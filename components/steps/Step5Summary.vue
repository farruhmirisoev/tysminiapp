<template>
  <div class="step-container">
    <div class="step-header">
      <h2 class="step-title">{{ t('step5.title') }}</h2>
      <p class="step-description">
        {{ t('step5.description') }}
      </p>
    </div>

    <div class="step-content">
      <!-- Policy Summary -->
      <div class="summary-section">
        <!-- Owner Info -->
        <div class="summary-card">
          <div class="card-title">{{ t('step3.owner') }}</div>
          <div class="card-content">
            <div class="info-row">
              <span class="info-value-full">
                {{ owner.name || '-' }}{{ owner.birthDate ? ` (${owner.birthDate})` : '' }}
              </span>
            </div>
          </div>
        </div>

        <!-- Applicant Info -->
        <div class="summary-card">
          <div class="card-title">{{ t('step3.applicant') }}</div>
          <div class="card-content">
            <div class="info-row">
              <span class="info-value-full">
                {{ (osgo.applicantIsOwner ? owner : applicant).name || '-' }}{{ (osgo.applicantIsOwner ? owner : applicant).birthDate ? ` (${(osgo.applicantIsOwner ? owner : applicant).birthDate})` : '' }}
              </span>
            </div>
          </div>
        </div>

        <!-- Vehicle Info -->
        <div class="summary-card">
          <div class="card-title">{{ t('step5.vehicleInfo') }}</div>
          <div class="card-content">
            <div class="info-row">
              <span class="info-value-full">
                {{ osgo.vehicle?.modelName || osgo.vehicle?.model || '-' }}
                {{ osgo.vehicle?.govNumber ? ` (${osgo.vehicle.govNumber})` : '' }}
              </span>
            </div>
          </div>
        </div>


        <!-- Period & Territory -->
        <div class="summary-card">
          <div class="card-title">{{ t('step5.policyInfo') }}</div>
          <div class="card-content">
            <div class="info-row">
              <span class="info-value-full">{{ getPeriodName() }}</span>
            </div>
            <div class="info-row">
              <span class="info-value-full">{{ getAreaName() }}</span>
            </div>
            <div class="info-row">
              <span class="info-value-full">
                {{ osgo.driversLimited ? t('step5.driversLimited', { count: osgo.drivers?.length || 0 }) : t('step5.noDriversLimitation') }}
              </span>
            </div>
          </div>
        </div>

        <!-- Insurance Amount -->
        <div class="summary-card">
          <div class="card-title">{{ t('step5.compensation') }}</div>
          <div class="card-content">
            <div class="info-row">
              <span class="info-value-full">{{ formatPrice(COMPENSATION) }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Contact Information -->
      <div class="summary-section">
        <div class="form-section phone-input-wrapper">
          <label v-if="t('step5.phone')" class="input-label" for="phone-input">
            {{ t('step5.phone') }}
            <span class="text-error">*</span>
          </label>
          <div class="phone-input-container">
            <div class="phone-prefix">+998</div>
            <input
              id="phone-input"
              :value="phoneDisplay"
              type="tel"
              inputmode="tel"
              class="input phone-input"
              :class="{ 'input-error': false }"
              :placeholder="'90 123 45 67'"
              :disabled="!osgoStore.isEditable"
              maxlength="12"
              @input="handlePhoneInput"
              @focus="handlePhoneFocus"
              @blur="handlePhoneBlur"
            />
            <div class="input-icon input-icon-left phone-icon">
              <i class="bx bx-phone"></i>
            </div>
          </div>
        </div>

        <div class="form-section">
          <InputField
            v-model="osgo.contractStartDate"
            :label="t('step5.startDate')"
            type="text"
            date-mask
            :placeholder="t('step5.startDatePlaceholder')"
            icon="bx bx-calendar"
            :disabled="!osgoStore.isEditable"
            required
          />
        </div>

        <div v-if="osgo.contractEndDate" class="form-section">
          <InputField
            :model-value="osgo.contractEndDate"
            :label="t('step5.endDate')"
            type="text"
            date-mask
            :placeholder="t('step5.startDatePlaceholder')"
            icon="bx bx-calendar"
            disabled
          />
        </div>
      </div>

      <!-- Premium Display -->
      <div class="premium-section">
        <div class="premium-card-large">
          <div class="premium-header">
            <i class="bx bx-shield-alt-2"></i>
            <span>{{ t('step5.premium') }}</span>
          </div>
          <div class="premium-amount-large">
            {{ formatPrice(osgoStore.calculatedPremium) }}
          </div>
        </div>
      </div>

    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch, nextTick } from 'vue'
import { useOsgoStore } from '~/stores/osgo'
import { useMetaStore } from '~/stores/meta'
import { formatPrice, formatPassport } from '~/utils/formatting'
import { COMPENSATION } from '~/utils/constants'

// Format number with thousand separators (like website's formatPirce)
const formatPriceNumber = (value: number): string => {
  return value.toString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, '$1 ')
}

const osgoStore = useOsgoStore()
const metaStore = useMetaStore()
const tg = useTelegramWebApp()
const api = useApi()

const osgo = computed(() => osgoStore.osgo)
const owner = computed(() => osgoStore.owner)
const applicant = computed(() => osgoStore.applicant)
const fundData = computed(() => osgoStore.fundData)
const saving = ref(false)

// Phone number storage
// Stored format: 998XXXXXXXXX (12 digits, no +, no spaces, no formatting)
// Example: "998935286407"
const phone = computed({
  get: () => {
    const party = osgo.value.applicantIsOwner ? owner.value : applicant.value
    return party.phone || ''
  },
  set: (value: string) => {
    // Remove all non-digit characters: +, spaces, parentheses, dashes
    const cleaned = value.replace(/\D/g, '')
    
    // Ensure phone starts with 998 and is exactly 12 digits
    let phoneValue = ''
    if (cleaned.startsWith('998')) {
      // Already has 998 prefix, take first 12 digits
      phoneValue = cleaned.slice(0, 12)
    } else if (cleaned.length > 0) {
      // No 998 prefix, add it and limit to 12 digits total
      phoneValue = `998${cleaned.slice(0, 9)}`
    }
    // If cleaned is empty, phoneValue remains empty string
    
    // Store phone without any formatting, spaces, or + sign
    // Format: 998XXXXXXXXX (12 digits total)
    if (osgo.value.applicantIsOwner) {
      owner.value.phone = phoneValue
      osgo.value.party = owner.value
    } else {
      applicant.value.phone = phoneValue
      osgo.value.party = applicant.value
    }
  }
})

// Phone display value (only the 9 digits after +998)
const phoneDisplay = ref('')
let isInternalUpdate = false

// Initialize display value from stored phone (only when phone changes externally)
watch(() => phone.value, (newValue) => {
  // Skip update if change came from user input
  if (isInternalUpdate) {
    return
  }
  
  if (newValue) {
    // Stored phone is already clean (no +, no spaces, no formatting)
    // Format: 998XXXXXXXXX (12 digits)
    const cleaned = newValue.replace(/\D/g, '') // Extra safety: remove any non-digits
    
    if (cleaned.startsWith('998') && cleaned.length === 12) {
      // Perfect format: extract the 9 digits after 998
      phoneDisplay.value = cleaned.slice(3) // Remove "998" prefix -> "935286407"
    } else if (cleaned.startsWith('998') && cleaned.length > 12) {
      // Too long: take first 12 digits, then extract 9 after 998
      phoneDisplay.value = cleaned.slice(0, 12).slice(3)
    } else if (cleaned.length >= 9) {
      // No 998 prefix or wrong format: take last 9 digits
      phoneDisplay.value = cleaned.slice(-9)
    } else if (cleaned.length > 0) {
      // Less than 9 digits: show as-is
      phoneDisplay.value = cleaned
    } else {
      phoneDisplay.value = ''
    }
  } else {
    phoneDisplay.value = ''
  }
}, { immediate: true })

// Handle phone input - only allow digits, max 9 (the part after +998)
const handlePhoneInput = (event: Event) => {
  const target = event.target as HTMLInputElement
  const cursorPosition = target.selectionStart || 0
  
  // Get raw input value
  const rawValue = target.value
  
  // Remove all non-digit characters
  let digitsOnly = rawValue.replace(/\D/g, '')
  
  // Limit to exactly 9 digits (the part after +998)
  digitsOnly = digitsOnly.slice(0, 9)
  
  // Prevent watch from interfering during user input
  isInternalUpdate = true
  
  // Update display (digits only, no formatting during input)
  phoneDisplay.value = digitsOnly
  
  // Update stored phone (with 998 prefix, without +, spaces, or formatting)
  // Stored format: 998XXXXXXXXX (12 digits total, no formatting)
  const fullPhone = digitsOnly.length > 0 ? `998${digitsOnly}` : ''
  phone.value = fullPhone // This will be stored as pure digits: 998935286407
  
  // Reset flag and restore cursor position after Vue updates
  nextTick(() => {
    isInternalUpdate = false
    // Restore cursor position - place at end of current digits
    if (target && document.activeElement === target) {
      const newPosition = digitsOnly.length
      target.setSelectionRange(newPosition, newPosition)
    }
  })
}

// Format phone display on blur - format as "90 123 45 67" (12 chars with spaces)
const handlePhoneBlur = () => {
  if (phoneDisplay.value) {
    const digits = phoneDisplay.value.replace(/\D/g, '')
    if (digits.length === 9) {
      // Format as: 90 123 45 67 (12 characters total including spaces)
      phoneDisplay.value = `${digits.slice(0, 2)} ${digits.slice(2, 5)} ${digits.slice(5, 7)} ${digits.slice(7, 9)}`
    } else if (digits.length > 0) {
      // Partial input - keep as digits only, don't format incomplete numbers
      phoneDisplay.value = digits
    }
  }
}

// Clear formatting on focus
const handlePhoneFocus = () => {
  if (phoneDisplay.value) {
    phoneDisplay.value = phoneDisplay.value.replace(/\D/g, '')
  }
}

// Helper methods
const { locale, t } = useI18n()

const getCarTypeName = (): string => {
  if (!osgo.value.vehicle?.carType) return '-'
  return metaStore.getLocalizedName(osgo.value.vehicle.carType, locale.value || 'uz')
}

const getPeriodName = (): string => {
  if (!osgo.value.period) return '-'
  return metaStore.getLocalizedName(osgo.value.period, locale.value || 'uz')
}

const getAreaName = (): string => {
  if (!osgo.value.drivedArea) return '-'
  return metaStore.getLocalizedName(osgo.value.drivedArea, locale.value || 'uz')
}

</script>

<style scoped>
.step-container {
  width: 100%;
  animation: fadeIn 0.3s ease;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.step-header {
  margin-bottom: 16px;
}

.step-title {
  font-size: 20px;
  font-weight: 600;
  color: #1F2937;
  margin-bottom: 8px;
}

.step-description {
  font-size: 13px;
  color: #6B7280;
  line-height: 1.5;
}

.step-content {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.summary-section {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.section-title {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 13px;
  font-weight: 500;
  color: #1F2937;
  margin-bottom: 4px;
}

.section-title i {
  font-size: 18px;
  color: #2481CC;
}

.summary-card {
  background: white;
  border: 1px solid rgba(229, 231, 235, 0.5);
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06), 0 4px 16px rgba(0, 0, 0, 0.04), inset 0 1px 0 rgba(255, 255, 255, 0.8);
  transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
}

.summary-card:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08), 0 8px 24px rgba(0, 0, 0, 0.06), inset 0 1px 0 rgba(255, 255, 255, 0.8);
}

.card-title {
  padding: 14px 16px;
  background: linear-gradient(180deg, #F9FAFB 0%, #F3F4F6 100%);
  border-bottom: 1px solid rgba(229, 231, 235, 0.5);
  font-weight: 600;
  font-size: 14px;
  color: #1F2937;
}

.card-content {
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  background: linear-gradient(180deg, #FFFFFF 0%, #FAFAFA 100%);
}

.info-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 0;
  font-size: 14px;
  transition: padding 0.2s ease;
}

.info-row:hover {
  padding-left: 4px;
  padding-right: 4px;
}

.info-label {
  color: #6B7280;
  font-weight: 500;
}

.info-value {
  color: #1F2937;
  font-weight: 600;
  text-align: right;
}

.info-value-full {
  color: #1F2937;
  font-weight: 600;
  text-align: left;
  width: 100%;
}

.form-section {
  width: 100%;
}

/* Phone Input Glowing Animation - LED Charging Effect */
.phone-input-wrapper .phone-input:not(:focus):not(:disabled) {
  animation: phoneGlow 3s ease-in-out infinite;
}

@keyframes phoneGlow {
  0%, 100% {
    border-color: #2481CC;
    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.04), 
                inset 0 1px 0 rgba(255, 255, 255, 0.8),
                0 0 0 0 rgba(36, 129, 204, 0);
  }
  50% {
    border-color: #3A91DC;
    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.04), 
                inset 0 1px 0 rgba(255, 255, 255, 0.8),
                0 0 0 3px rgba(36, 129, 204, 0.15),
                0 0 12px rgba(36, 129, 204, 0.2);
  }
}

/* Phone Input with Prefix */
.phone-input-container {
  position: relative;
  display: flex;
  align-items: center;
  width: 100%;
}

.phone-prefix {
  position: absolute;
  left: 40px;
  top: 50%;
  transform: translateY(-50%);
  color: #6B7280;
  font-size: 15px;
  font-weight: 500;
  pointer-events: none;
  z-index: 2;
  user-select: none;
  transition: color 0.2s ease;
}

.phone-input-container:focus-within .phone-prefix {
  color: #2481CC;
}

.phone-input {
  padding-left: 90px !important;
  width: 100%;
  padding: 10px 14px;
  font-size: 15px;
  color: #1F2937;
  background: white;
  border: 1.5px solid #E5E7EB;
  border-radius: 12px;
  outline: none;
  transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
  -webkit-appearance: none;
  -moz-appearance: none;
  appearance: none;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.04), inset 0 1px 0 rgba(255, 255, 255, 0.8);
}

.phone-input:hover:not(:disabled) {
  border-color: #D1D5DB;
}

.phone-input:focus {
  border-color: #2481CC;
  box-shadow: 0 0 0 3px rgba(36, 129, 204, 0.12), 0 2px 4px rgba(36, 129, 204, 0.08);
  transform: translateY(-1px);
}

.phone-input:disabled {
  background: #F9FAFB;
  color: #9CA3AF;
  cursor: not-allowed;
}

.phone-input::placeholder {
  color: #9CA3AF;
}

.phone-icon {
  position: absolute;
  left: 2px;
  top: 50%;
  transform: translateY(-50%);
  z-index: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  color: #6B7280;
  font-size: 16px;
  pointer-events: none;
  transition: color 0.2s ease;
}

.phone-input-container:focus-within .phone-icon {
  color: #2481CC;
}

.input-label {
  display: block;
  font-size: 13px;
  font-weight: 500;
  color: #1F2937;
  margin-bottom: 2px;
  line-height: 1.4;
}

.text-error {
  color: #EF4444;
}

/* Premium Section */
.premium-section {
  margin: 8px 0;
}

.premium-card-large {
  background: linear-gradient(135deg, #2481CC 0%, #3A91DC 100%);
  border-radius: 16px;
  padding: 24px;
  color: white;
  text-align: center;
  box-shadow: 0 8px 20px rgba(36, 129, 204, 0.3);
}

.premium-header {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  font-size: 16px;
  font-weight: 600;
  opacity: 0.95;
  margin-bottom: 12px;
}

.premium-header i {
  font-size: 24px;
}

.premium-amount-large {
  font-size: 36px;
  font-weight: 700;
  margin-bottom: 8px;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.premium-details-text {
  font-size: 14px;
  opacity: 0.9;
}



.fade-enter-active,
.fade-leave-active {
  transition: all 0.4s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: scale(0.95);
}

/* Mobile responsive */
@media (max-width: 768px) {
  .step-title {
    font-size: 18px;
  }

  .premium-amount-large {
    font-size: 32px;
  }


  .info-row {
    flex-direction: column;
    align-items: flex-start;
    gap: 4px;
  }

  .info-value {
    text-align: left;
  }
}
</style>
