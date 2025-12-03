// OSGO Policy Store for ECCLIVO Telegram Mini App
// Handles OSGO insurance policy creation and management

import { defineStore } from 'pinia'
import { ref, computed, watch } from 'vue'
import dayjs from 'dayjs'
import type { Osgo, Vehicle, Individual, Driver, EntriesJournal, FundData, BaseContractStatus, OsgoPeriodType } from '~/types/osgo'
import { useMetaStore } from './meta'
import { STORAGE_KEYS, COMPENSATION, DEFAULTS, STEPS } from '~/utils/constants'
import { validateOsgoForm } from '~/utils/validation'
import { dateToApiFormat } from '~/utils/formatting'

export const useOsgoStore = defineStore('osgo', () => {
  const metaStore = useMetaStore()
  const api = useApi()

  // State
  const osgo = ref<Osgo>({
    status: 'DRAFT' as BaseContractStatus,
    vehicle: null,
    party: null, // Applicant
    beneficiary: null, // Owner
    applicantIsOwner: true,
    drivers: [],
    driversLimited: false,
    contractStartDate: dayjs().format('YYYY-MM-DD'),
    premium: 0,
  })

  const owner = ref<Individual>({
    passportSeries: '',
    passportNumber: '',
    birthDate: '',
  })

  const applicant = ref<Individual>({
    passportSeries: '',
    passportNumber: '',
    birthDate: '',
  })

  const currentStep = ref(STEPS.PARAMS)
  const saving = ref(false)
  const saveError = ref<string | null>(null)
  const fetching = ref(false)
  const fetchError = ref<string | null>(null)
  const fundData = ref<FundData | null>(null)
  const fundError = ref<string | null>(null)
  const fetchingFundData = ref(false)

  // Payment method selection
  const selectedPaymentMethod = ref<'payme' | 'click' | 'uzum' | null>(null)

  // Verification states
  const vehicleVerifying = ref(false)
  const vehicleVerified = ref(false)
  const vehicleVerifyError = ref<string | null>(null)

  const ownerVerifying = ref(false)
  const ownerVerified = ref(false)
  const ownerVerifyError = ref<string | null>(null)

  const applicantVerifying = ref(false)
  const applicantVerified = ref(false)
  const applicantVerifyError = ref<string | null>(null)

  // Computed properties
  const isEditable = computed(() => osgo.value.status === 'DRAFT')

  const canProceedToNextStep = computed(() => {
    const validation = validateStepData(currentStep.value)
    return validation.valid
  })

  const totalSteps = computed(() => Object.keys(STEPS).length)

  const progressPercentage = computed(() => {
    return Math.round(((currentStep.value + 1) / totalSteps.value) * 100)
  })

  // Premium calculation
  const calculatedPremium = computed(() => {
    if (!osgo.value.vehicle?.carType || !osgo.value.period || !osgo.value.drivedArea) {
      return 0
    }

    const baseCoefficient = osgo.value.vehicle.carType.tariffCompany || 0
    const periodCoefficient = osgo.value.period.coefficient || 0
    const areaCoefficient = osgo.value.drivedArea.coefficient || 0

    let driverCoefficient = 3 // Default for unlimited drivers

    if (osgo.value.driversLimited && osgo.value.incidentCoeff) {
      driverCoefficient = osgo.value.incidentCoeff
    }

    const coefficient = baseCoefficient * periodCoefficient * driverCoefficient * areaCoefficient

    // Calculate premium based on compensation amount
    const premium = coefficient > 5 * baseCoefficient
      ? COMPENSATION * 5 * baseCoefficient
      : (COMPENSATION * coefficient) / 100

    return Math.round(premium)
  })

  const amountPayable = computed(() => {
    const entries = osgo.value.entriesJournalKt || []
    const paid = entries.reduce((sum, entry) => sum + (entry.amount || 0), 0)
    return osgo.value.premium - paid
  })

  /**
   * Initialize OSGO with default values
   */
  const initialize = () => {
    osgo.value = {
      status: 'DRAFT' as BaseContractStatus,
      vehicle: {
        govNumber: '',
        techPassportSeries: '',
        techPassportNumber: '',
      },
      party: null,
      beneficiary: null,
      applicantIsOwner: true,
      drivers: [],
      driversLimited: false,
      contractStartDate: dayjs().format('YYYY-MM-DD'),
      premium: 0,
    }

    owner.value = {
      passportSeries: '',
      passportNumber: '',
      birthDate: '',
    }

    applicant.value = {
      passportSeries: '',
      passportNumber: '',
      birthDate: '',
    }

    currentStep.value = STEPS.PARAMS

    // Set default discount type (coefficient = 1)
    if (metaStore.isLoaded) {
      osgo.value.discountType = metaStore.getDefaultDiscountType()
    }
  }

  /**
   * Update contract end date when start date or period changes
   */
  watch(
    () => [osgo.value.contractStartDate, osgo.value.period],
    () => {
      if (!osgo.value.contractStartDate || !osgo.value.period) return

      let endDate = dayjs(osgo.value.contractStartDate)

      if (osgo.value.period.periodType === 'ONE_YEAR' || osgo.value.period.periodType === 'SEASON') {
        endDate = endDate.add(osgo.value.period.months || 0, 'months')
      } else if (osgo.value.period.periodType === 'TILL_REGISTRATION') {
        endDate = endDate.add(osgo.value.period.days || 0, 'days')
      }

      osgo.value.contractEndDate = endDate.subtract(1, 'days').format('YYYY-MM-DD')
    }
  )

  /**
   * Update period type when period changes
   */
  watch(
    () => osgo.value.period,
    (period) => {
      if (period) {
        osgo.value.periodType = period.periodType
      }
    }
  )

  /**
   * Update drived area based on vehicle gov number
   */
  watch(
    () => osgo.value.vehicle?.govNumber,
    (govNumber) => {
      if (!govNumber || govNumber.length < 2) return

      const regionCode = parseInt(govNumber.slice(0, 2))
      const area = metaStore.findDrivedAreaByRegion(regionCode)

      if (area) {
        osgo.value.drivedArea = area
      }
    }
  )

  /**
   * Update premium when calculation inputs change
   */
  watch(
    () => [
      osgo.value.vehicle?.carType,
      osgo.value.period,
      osgo.value.driversLimited,
      osgo.value.incidentCoeff,
      osgo.value.drivedArea,
    ],
    () => {
      osgo.value.premium = calculatedPremium.value
    },
    { deep: true }
  )

  /**
   * Clear incident coeff when drivers become unlimited
   */
  watch(
    () => osgo.value.driversLimited,
    (limited) => {
      if (!limited) {
        osgo.value.incidentCoeff = undefined
      }
    }
  )

  /**
   * Verify vehicle information
   */
  const verifyVehicle = async () => {
    if (!osgo.value.vehicle) return

    vehicleVerifying.value = true
    vehicleVerifyError.value = null
    vehicleVerified.value = false

    try {
      const response = await api.getVehicle({
        govNumber: osgo.value.vehicle.govNumber,
        techPassportSeries: osgo.value.vehicle.techPassportSeries,
        techPassportNumber: osgo.value.vehicle.techPassportNumber,
      })

      // Extract vehicle data from result if nested
      const vehicleData = response?.result || response

      // Check for errors in response (but only throw if no result exists)
      if (response?.error && !vehicleData) {
        throw new Error(response.error.message || 'Failed to verify vehicle')
      }
      
      // If we have both error and result, log warning but proceed with result
      if (response?.error && vehicleData) {
        console.warn('[OsgoStore] Vehicle verification returned error but also has result:', response.error)
      }

      // Merge retrieved data with existing vehicle data
      Object.assign(osgo.value.vehicle, vehicleData)

      // Update car type from metadata
      if (vehicleData?.carType && metaStore.isLoaded) {
        osgo.value.vehicle.carType = metaStore.findCarType(vehicleData.carType.id)
      }

      vehicleVerified.value = true
      console.log('[OsgoStore] Vehicle verified:', vehicleData)
    } catch (error: any) {
      vehicleVerifyError.value = error.message || 'Failed to verify vehicle'
      console.error('[OsgoStore] Vehicle verification failed:', error)
      throw error
    } finally {
      vehicleVerifying.value = false
    }
  }

  /**
   * Verify owner information
   */
  const verifyOwner = async () => {
    ownerVerifying.value = true
    ownerVerifyError.value = null
    ownerVerified.value = false

    try {
      const result = await api.getIndividualByPassport({
        passportSeries: owner.value.passportSeries?.toUpperCase() || '',
        passportNumber: owner.value.passportNumber,
        birthDate: owner.value.birthDate,
      })

      console.log('[OsgoStore] API result:', result)
      console.log('[OsgoStore] Result has id?', !!result?.id)

      // Assign the entire result to ensure reactivity
      if (result) {
        // Keep the original input fields and merge with result
        owner.value = {
          passportSeries: owner.value.passportSeries,
          passportNumber: owner.value.passportNumber,
          birthDate: owner.value.birthDate,
          ...result,
        }
        osgo.value.beneficiary = { ...owner.value }
        
        // If applicant is owner, copy owner data to applicant as well
        if (osgo.value.applicantIsOwner) {
          applicant.value = {
            passportSeries: owner.value.passportSeries,
            passportNumber: owner.value.passportNumber,
            birthDate: owner.value.birthDate,
            ...result,
          }
          osgo.value.party = { ...owner.value }
          applicantVerified.value = true // Mark as verified since it's the same person
        }
      }

      ownerVerified.value = true
      console.log('[OsgoStore] Owner after assignment:', owner.value)
      console.log('[OsgoStore] Owner has id?', !!owner.value.id)
    } catch (error: any) {
      ownerVerifyError.value = error.message || 'Failed to verify owner'
      console.error('[OsgoStore] Owner verification failed:', error)
      throw error
    } finally {
      ownerVerifying.value = false
    }
  }

  /**
   * Verify applicant information
   */
  const verifyApplicant = async () => {
    applicantVerifying.value = true
    applicantVerifyError.value = null
    applicantVerified.value = false

    try {
      const result = await api.getIndividualByPassport({
        passportSeries: applicant.value.passportSeries?.toUpperCase() || '',
        passportNumber: applicant.value.passportNumber,
        birthDate: applicant.value.birthDate,
      })

      console.log('[OsgoStore] API result for applicant:', result)
      
      // Assign the entire result to ensure reactivity
      if (result) {
        // Keep the original input fields and merge with result
        applicant.value = {
          passportSeries: applicant.value.passportSeries,
          passportNumber: applicant.value.passportNumber,
          birthDate: applicant.value.birthDate,
          ...result,
        }
        osgo.value.party = { ...applicant.value }
      }

      applicantVerified.value = true
      console.log('[OsgoStore] Applicant after assignment:', applicant.value)
    } catch (error: any) {
      applicantVerifyError.value = error.message || 'Failed to verify applicant'
      console.error('[OsgoStore] Applicant verification failed:', error)
      throw error
    } finally {
      applicantVerifying.value = false
    }
  }

  /**
   * Verify driver information
   */
  const verifyDriver = async (driver: Driver): Promise<Driver> => {
    // Validate input
    if (!driver.passportSeries || !driver.passportNumber || !driver.birthDate) {
      throw new Error('Driver passport data is incomplete')
    }

    try {
      // Convert date from DD-MM-YYYY (display format) to YYYY-MM-DD (API format)
      const apiBirthDate = dateToApiFormat(driver.birthDate)

      console.log('[OsgoStore] Verifying driver:', {
        passportSeries: driver.passportSeries,
        passportNumber: driver.passportNumber,
        birthDate: driver.birthDate,
        apiBirthDate,
      })

      const result = await api.getDriver({
        passportSeries: driver.passportSeries.toUpperCase(),
        passportNumber: driver.passportNumber,
        birthDate: apiBirthDate,
      })

      console.log('[OsgoStore] Driver verification result:', result)

      // Ensure result has required fields
      if (!result || !result.id) {
        throw new Error('Driver verification failed: invalid response')
      }

      // Merge driver data with verification result
      // Keep original birthDate format (DD-MM-YYYY) for display
      const verifiedDriver: Driver = {
        ...driver,
        ...result,
        // Keep the display format birthDate
        birthDate: driver.birthDate,
      }

      console.log('[OsgoStore] Verified driver:', verifiedDriver)
      return verifiedDriver
    } catch (error: any) {
      console.error('[OsgoStore] Driver verification failed:', error)
      throw error
    }
  }

  /**
   * Add a new driver
   */
  const addDriver = (prefill?: Partial<Driver>) => {
    // Ensure drivers array exists
    if (!osgo.value.drivers) {
      osgo.value.drivers = []
    }

    const newDriver: Driver = {
      passportSeries: prefill?.passportSeries || '',
      passportNumber: prefill?.passportNumber || '',
      birthDate: prefill?.birthDate || '',
    }

    osgo.value.drivers.push(newDriver)
    console.log('[OsgoStore] Driver added, total drivers:', osgo.value.drivers.length)
  }

  /**
   * Update driver at index
   */
  const updateDriver = (index: number, driver: Driver) => {
    if (osgo.value.drivers[index]) {
      osgo.value.drivers[index] = driver
    }
  }

  /**
   * Remove driver at index
   */
  const removeDriver = (index: number) => {
    osgo.value.drivers.splice(index, 1)
  }

  /**
   * Check if driver with same credentials exists
   */
  const hasDriver = (passportSeries: string, passportNumber: string, birthDate: string): boolean => {
    return osgo.value.drivers.some(
      d => d.passportSeries === passportSeries &&
           d.passportNumber === passportNumber &&
           d.birthDate === birthDate
    )
  }

  /**
   * Add owner as driver
   */
  const addOwnerAsDriver = () => {
    // Check if owner data is available
    if (!owner.value.passportSeries || !owner.value.passportNumber || !owner.value.birthDate) {
      console.warn('[OsgoStore] Cannot add owner as driver: owner data incomplete')
      throw new Error('Owner data is incomplete. Please verify owner information first.')
    }

    // Check if owner is already added as driver
    if (hasDriver(owner.value.passportSeries, owner.value.passportNumber, owner.value.birthDate)) {
      console.log('[OsgoStore] Owner is already added as driver')
      return
    }

    addDriver({
      passportSeries: owner.value.passportSeries,
      passportNumber: owner.value.passportNumber,
      birthDate: owner.value.birthDate,
    })
    console.log('[OsgoStore] Owner added as driver')
  }

  /**
   * Add applicant as driver
   */
  const addApplicantAsDriver = () => {
    if (!hasDriver(applicant.value.passportSeries, applicant.value.passportNumber, applicant.value.birthDate)) {
      addDriver({
        passportSeries: applicant.value.passportSeries,
        passportNumber: applicant.value.passportNumber,
        birthDate: applicant.value.birthDate,
      })
    }
  }

  /**
   * Validate current step data
   */
  const validateStepData = (step: number): { valid: boolean; errors?: any } => {
    // Simplified validation per step
    switch (step) {
      case STEPS.PARAMS:
        return {
          valid: !!(
            osgo.value.vehicle?.carType &&
            osgo.value.period &&
            osgo.value.drivedArea &&
            (!osgo.value.driversLimited || osgo.value.incidentCoeff)
          )
        }
      case STEPS.VEHICLE:
        return {
          valid: vehicleVerified.value
        }
      case STEPS.OWNER:
        return {
          valid: ownerVerified.value && (osgo.value.applicantIsOwner || applicantVerified.value)
        }
      case STEPS.DRIVERS:
        return {
          valid: !osgo.value.driversLimited || osgo.value.drivers.length > 0
        }
      case STEPS.SUMMARY:
        // If applicant is owner, use owner.id; otherwise require applicant.id
        const applicantHasId = osgo.value.applicantIsOwner 
          ? owner.value.id 
          : applicant.value.id
        
        return {
          valid: !!(
            owner.value.id &&
            applicantHasId &&
            osgo.value.vehicle?.id &&
            (!osgo.value.driversLimited || (osgo.value.drivers?.length && osgo.value.drivers.every(d => d.id))) &&
            osgo.value.party?.phone &&
            osgo.value.party.phone.replace(/[+()-]/g, '').length === 12 &&
            osgo.value.contractStartDate
          )
        }
      case STEPS.PAYMENT:
        // Payment step requires policy to be created and payment method selected
        return {
          valid: !!(osgo.value.id && selectedPaymentMethod.value)
        }
      default:
        return { valid: false }
    }
  }

  /**
   * Go to next step
   */
  const nextStep = () => {
    if (currentStep.value < totalSteps.value - 1) {
      currentStep.value++
    }
  }

  /**
   * Go to previous step
   */
  const previousStep = () => {
    if (currentStep.value > 0) {
      currentStep.value--
    }
  }

  /**
   * Go to specific step
   */
  const goToStep = (step: number) => {
    if (step >= 0 && step < totalSteps.value) {
      currentStep.value = step
    }
  }

  /**
   * Create OSGO policy
   */
  const createPolicy = async () => {
    saving.value = true
    saveError.value = null

    try {
      // Fetch user info first - API requires full user object
      let userInfo: any = null
      try {
        userInfo = await api.fetchUserInfo()
        console.log('[OsgoStore] User info fetched:', userInfo)
      } catch (error) {
        console.warn('[OsgoStore] Failed to fetch user info, using minimal user object:', error)
        // Fallback: construct minimal user object matching API structure
        userInfo = {
          id: undefined,
          login: undefined,
          name: null,
          firstName: null,
          middleName: null,
          lastName: null,
          position: null,
          email: null,
          timeZone: 'Asia/Tashkent',
          language: 'ru',
          locale: 'ru',
          _instanceName: '',
        }
      }

      // Prepare party data with cleaned phone number (only for party, not beneficiary)
      const party = osgo.value.applicantIsOwner ? { ...owner.value } : { ...applicant.value }
      if (party.phone) {
        party.phone = party.phone.replace(/[+()-]/g, '')
      }

      // Beneficiary keeps original phone format
      const beneficiary = { ...owner.value }

      // Ensure discountType is set (required by API)
      const discountType = osgo.value.discountType || metaStore.meta?.beneficiary?.find(
        ({ coefficient }) => coefficient === 1
      )

      // Validate contract start date
      if (!osgo.value.contractStartDate) {
        throw new Error('Contract start date is required')
      }

      // Validate date format (must be YYYY-MM-DD)
      const dateRegex = /^\d{4}-\d{2}-\d{2}$/
      if (!dateRegex.test(osgo.value.contractStartDate)) {
        throw new Error('Contract start date must be in YYYY-MM-DD format')
      }

      // Validate date is valid
      const startDate = dayjs(osgo.value.contractStartDate)
      if (!startDate.isValid()) {
        throw new Error('Invalid contract start date')
      }

      // Prepare osgo payload - ensure all nested objects are included
      // The API expects full objects with all properties, not just IDs
      const osgoPayload = {
        party: party, // Full Individual object (already has country, district, region from verification)
        beneficiary: beneficiary, // Full Individual object
        vehicle: osgo.value.vehicle, // Full Vehicle object (already has carType from verification)
        period: osgo.value.period, // Full period object
        drivedArea: osgo.value.drivedArea, // Full drivedArea object
        discountType: discountType, // Full discountType object
        drivers: osgo.value.drivers || [], // Array of Driver objects
        contractStartDate: osgo.value.contractStartDate, // Already validated as YYYY-MM-DD
        contractEndDate: osgo.value.contractEndDate,
        status: osgo.value.status || 'DRAFT',
        applicantIsOwner: osgo.value.applicantIsOwner ?? true,
        periodType: osgo.value.periodType || osgo.value.period?.periodType || 'ONE_YEAR',
        premium: osgo.value.premium || 0,
        driversLimited: osgo.value.driversLimited ?? false,
        incidentCoeff: osgo.value.incidentCoeff,
      }

      // Prepare data for submission - API expects { user: {...}, osgo: {...} }
      const data = {
        user: userInfo, // Full user object
        osgo: osgoPayload,
      }

      console.log('[OsgoStore] Creating policy with payload structure:', {
        user: { id: userInfo?.id, login: userInfo?.login },
        osgo: {
          party: { id: party.id, name: party.name },
          beneficiary: { id: beneficiary.id, name: beneficiary.name },
          vehicle: { id: osgo.value.vehicle?.id, govNumber: osgo.value.vehicle?.govNumber },
          period: { id: osgo.value.period?.id },
          drivedArea: { id: osgo.value.drivedArea?.id },
          discountType: { id: discountType?.id },
        },
      })

      const policyId = await api.createOsgoApplication(data)
      
      // Validate that policyId is a string (not an error object)
      if (!policyId || typeof policyId !== "string") {
        console.error('[OsgoStore] Invalid policy ID returned:', policyId)
        throw new Error('Failed to create policy: invalid response')
      }
      
      osgo.value.id = policyId

      // Update party reference with cleaned phone
      if (osgo.value.applicantIsOwner) {
        owner.value.phone = party.phone
        osgo.value.party = owner.value
      } else {
        applicant.value.phone = party.phone
        osgo.value.party = applicant.value
      }

      console.log('[OsgoStore] Policy created:', policyId)
      return policyId
    } catch (error: any) {
      saveError.value = error.message || 'Failed to create policy'
      console.error('[OsgoStore] Policy creation failed:', error)
      throw error
    } finally {
      saving.value = false
    }
  }

  /**
   * Update OSGO policy
   */
  const updatePolicy = async () => {
    if (!osgo.value.id) {
      throw new Error('Policy ID is required for update')
    }

    saving.value = true
    saveError.value = null

    try {
      const data = {
        ...osgo.value,
        party: osgo.value.applicantIsOwner ? owner.value : applicant.value,
        beneficiary: owner.value,
      }

      await api.updateOsgoApplication(data)
      console.log('[OsgoStore] Policy updated')
    } catch (error: any) {
      saveError.value = error.message || 'Failed to update policy'
      console.error('[OsgoStore] Policy update failed:', error)
      throw error
    } finally {
      saving.value = false
    }
  }

  /**
   * Fetch OSGO policy by ID
   */
  const fetchPolicy = async (id: string) => {
    fetching.value = true
    fetchError.value = null

    try {
      const data = await api.fetchOsgoEntity(id)
      osgo.value = data

      // Fetch party and beneficiary details
      if (data.party?.id) {
        const partyData = await api.fetchIndividualEntity(data.party.id)
        applicant.value = partyData
        osgo.value.party = partyData
      }

      if (data.beneficiary?.id) {
        const beneficiaryData = await api.fetchIndividualEntity(data.beneficiary.id)
        owner.value = beneficiaryData
        osgo.value.beneficiary = beneficiaryData
      }

      // Update references from metadata
      if (metaStore.isLoaded && osgo.value.vehicle?.carType) {
        osgo.value.vehicle.carType = metaStore.findCarType(osgo.value.vehicle.carType.id)
      }

      if (metaStore.isLoaded && osgo.value.period) {
        osgo.value.period = metaStore.findPeriod(osgo.value.period.id)
      }

      if (metaStore.isLoaded && osgo.value.drivedArea) {
        osgo.value.drivedArea = metaStore.findDrivedArea(osgo.value.drivedArea.id)
      }

      // Calculate incident coefficient from drivers
      if (osgo.value.driversLimited && osgo.value.drivers.length > 0) {
        const maxCoeff = Math.max(
          ...osgo.value.drivers
            .map(d => d.incidentFrequency?.coefficient || 0)
        )
        osgo.value.incidentCoeff = maxCoeff
      }

      console.log('[OsgoStore] Policy fetched:', id)
    } catch (error: any) {
      fetchError.value = error.message || 'Failed to fetch policy'
      console.error('[OsgoStore] Policy fetch failed:', error)
      throw error
    } finally {
      fetching.value = false
    }
  }

  /**
   * Fetch fund policy data
   */
  const fetchFundData = async () => {
    if (!osgo.value.id) return

    fetchingFundData.value = true
    fundError.value = null

    try {
      const result = await api.getFundPolicy(osgo.value.id)
      fundData.value = result || null
      console.log('[OsgoStore] Fund data fetched:', result)
    } catch (error: any) {
      fundError.value = error.message || 'Failed to fetch fund data'
      console.error('[OsgoStore] Fund data fetch failed:', error)
    } finally {
      fetchingFundData.value = false
    }
  }

  /**
   * Save form data to session storage
   */
  const saveToSession = () => {
    if (typeof window === 'undefined') return

    try {
      const data = {
        osgo: osgo.value,
        owner: owner.value,
        applicant: applicant.value,
        currentStep: currentStep.value,
      }

      sessionStorage.setItem(STORAGE_KEYS.OSGO_DRAFT, JSON.stringify(data))
      console.log('[OsgoStore] Saved to session')
    } catch (error) {
      console.error('[OsgoStore] Error saving to session:', error)
    }
  }

  /**
   * Load form data from session storage
   */
  const loadFromSession = (): boolean => {
    if (typeof window === 'undefined') return false

    try {
      const json = sessionStorage.getItem(STORAGE_KEYS.OSGO_DRAFT)
      if (!json) return false

      const data = JSON.parse(json)
      osgo.value = data.osgo
      owner.value = data.owner
      applicant.value = data.applicant
      currentStep.value = data.currentStep || 0

      console.log('[OsgoStore] Loaded from session')
      return true
    } catch (error) {
      console.error('[OsgoStore] Error loading from session:', error)
      return false
    }
  }

  /**
   * Clear session storage
   */
  const clearSession = () => {
    if (typeof window === 'undefined') return

    sessionStorage.removeItem(STORAGE_KEYS.OSGO_DRAFT)
    console.log('[OsgoStore] Session cleared')
  }

  /**
   * Reset store to initial state
   */
  const reset = () => {
    initialize()
    vehicleVerified.value = false
    ownerVerified.value = false
    applicantVerified.value = false
    fundData.value = null
    saveError.value = null
    fetchError.value = null
  }

  return {
    // State
    osgo,
    owner,
    applicant,
    currentStep,
    saving,
    saveError,
    fetching,
    fetchError,
    fundData,
    fundError,
    fetchingFundData,
    selectedPaymentMethod,

    // Verification
    vehicleVerifying,
    vehicleVerified,
    vehicleVerifyError,
    ownerVerifying,
    ownerVerified,
    ownerVerifyError,
    applicantVerifying,
    applicantVerified,
    applicantVerifyError,

    // Computed
    isEditable,
    canProceedToNextStep,
    totalSteps,
    progressPercentage,
    calculatedPremium,
    amountPayable,

    // Actions
    initialize,
    verifyVehicle,
    verifyOwner,
    verifyApplicant,
    verifyDriver,
    addDriver,
    updateDriver,
    removeDriver,
    hasDriver,
    addOwnerAsDriver,
    addApplicantAsDriver,
    validateStepData,
    nextStep,
    previousStep,
    goToStep,
    createPolicy,
    updatePolicy,
    fetchPolicy,
    fetchFundData,
    saveToSession,
    loadFromSession,
    clearSession,
    reset,
  }
})
