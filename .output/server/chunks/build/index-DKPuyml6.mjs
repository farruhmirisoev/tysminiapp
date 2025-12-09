import { defineComponent, useSSRContext, computed, mergeProps, unref, ref, watch } from 'vue';
import { ssrRenderAttrs, ssrRenderList, ssrRenderClass, ssrInterpolate, ssrRenderStyle, ssrRenderAttr, ssrRenderComponent, ssrIncludeBooleanAttr, ssrRenderSlot, ssrLooseContain, ssrLooseEqual, ssrRenderDynamicModel } from 'vue/server-renderer';
import { c as useI18n, e as useSwitchLocalePath, d as defineStore, f as useTelegramWebApp, b as useApi, S as STEPS, a as useMetaStore, C as COMPENSATION, u as useHead } from './server.mjs';
import dayjs from 'dayjs';
import { _ as _export_sfc } from './_plugin-vue_export-helper-1tPrXgE0.mjs';
import { _ as _imports_0 } from './tyslogo-C9au9Osp.mjs';
import '../nitro/nitro.mjs';
import 'node:http';
import 'node:https';
import 'node:events';
import 'node:buffer';
import 'node:fs';
import 'node:path';
import 'node:crypto';
import 'vue-router';
import 'node:url';
import 'lodash-es/sortBy.js';
import '../routes/renderer.mjs';
import 'vue-bundle-renderer/runtime';
import 'unhead/server';
import 'devalue';
import 'unhead/utils';
import 'unhead/plugins';

function formatPrice(value, currency = "\u0441\u0443\u043C") {
  if (value === null || value === void 0 || isNaN(value)) {
    return `0 ${currency}`;
  }
  const formatted = value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
  return `${formatted} ${currency}`;
}
function formatDisplayDate(date) {
  if (!date) return "";
  return dayjs(date).format("DD.MM.YYYY");
}
function getLocalizedName(item, locale = "ru") {
  if (!item) return "";
  if (locale === "uz" && item.nameUz) {
    return item.nameUz;
  }
  return item.name || item.nameUz || "";
}
function formatGender(gender, locale = "ru") {
  if (!gender) return "";
  const genderLower = String(gender).toLowerCase();
  if (genderLower === "male" || genderLower === "\u043C\u0443\u0436\u0441\u043A\u043E\u0439" || genderLower === "erkak") {
    return locale === "uz" ? "Erkak" : "\u041C\u0443\u0436\u0441\u043A\u043E\u0439";
  }
  if (genderLower === "female" || genderLower === "\u0436\u0435\u043D\u0441\u043A\u0438\u0439" || genderLower === "ayol") {
    return locale === "uz" ? "Ayol" : "\u0416\u0435\u043D\u0441\u043A\u0438\u0439";
  }
  return String(gender);
}
function dateToApiFormat(date) {
  if (!date) return "";
  if (/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    return date;
  }
  if (/^\d{2}-\d{2}-\d{4}$/.test(date)) {
    const parts = date.split("-");
    return `${parts[2]}-${parts[1]}-${parts[0]}`;
  }
  try {
    return dayjs(date, "DD-MM-YYYY").format("YYYY-MM-DD");
  } catch {
    return date;
  }
}
const useOsgoStore = defineStore("osgo", () => {
  const metaStore = useMetaStore();
  const api = useApi();
  const osgo = ref({
    status: "DRAFT",
    vehicle: null,
    party: null,
    // Applicant
    beneficiary: null,
    // Owner
    applicantIsOwner: true,
    drivers: [],
    driversLimited: false,
    contractStartDate: dayjs().format("YYYY-MM-DD"),
    premium: 0
  });
  const owner = ref({
    passportSeries: "",
    passportNumber: "",
    birthDate: ""
  });
  const applicant = ref({
    passportSeries: "",
    passportNumber: "",
    birthDate: ""
  });
  const currentStep = ref(STEPS.PARAMS);
  const saving = ref(false);
  const saveError = ref(null);
  const fetching = ref(false);
  const fetchError = ref(null);
  const fundData = ref(null);
  const fundError = ref(null);
  const fetchingFundData = ref(false);
  const selectedPaymentMethod = ref(null);
  const vehicleVerifying = ref(false);
  const vehicleVerified = ref(false);
  const vehicleVerifyError = ref(null);
  const ownerVerifying = ref(false);
  const ownerVerified = ref(false);
  const ownerVerifyError = ref(null);
  const applicantVerifying = ref(false);
  const applicantVerified = ref(false);
  const applicantVerifyError = ref(null);
  const isEditable = computed(() => osgo.value.status === "DRAFT");
  const canProceedToNextStep = computed(() => {
    const validation = validateStepData(currentStep.value);
    return validation.valid;
  });
  const totalSteps = computed(() => Object.keys(STEPS).length);
  const progressPercentage = computed(() => {
    return Math.round((currentStep.value + 1) / totalSteps.value * 100);
  });
  const calculatedPremium = computed(() => {
    var _a;
    if (!((_a = osgo.value.vehicle) == null ? void 0 : _a.carType) || !osgo.value.period || !osgo.value.drivedArea) {
      return 0;
    }
    const baseCoefficient = osgo.value.vehicle.carType.tariffCompany || 0;
    const periodCoefficient = osgo.value.period.coefficient || 0;
    const areaCoefficient = osgo.value.drivedArea.coefficient || 0;
    let driverCoefficient = 3;
    if (osgo.value.driversLimited && osgo.value.incidentCoeff) {
      driverCoefficient = osgo.value.incidentCoeff;
    }
    const coefficient = baseCoefficient * periodCoefficient * driverCoefficient * areaCoefficient;
    const premium = coefficient > 5 * baseCoefficient ? COMPENSATION * 5 * baseCoefficient : COMPENSATION * coefficient / 100;
    return Math.round(premium);
  });
  const amountPayable = computed(() => {
    const entries = osgo.value.entriesJournalKt || [];
    const paid = entries.reduce((sum, entry) => sum + (entry.amount || 0), 0);
    return osgo.value.premium - paid;
  });
  const initialize = () => {
    osgo.value = {
      status: "DRAFT",
      vehicle: {
        govNumber: "",
        techPassportSeries: "",
        techPassportNumber: ""
      },
      party: null,
      beneficiary: null,
      applicantIsOwner: true,
      drivers: [],
      driversLimited: false,
      contractStartDate: dayjs().format("YYYY-MM-DD"),
      premium: 0
    };
    owner.value = {
      passportSeries: "",
      passportNumber: "",
      birthDate: ""
    };
    applicant.value = {
      passportSeries: "",
      passportNumber: "",
      birthDate: ""
    };
    currentStep.value = STEPS.PARAMS;
    if (metaStore.isLoaded) {
      osgo.value.discountType = metaStore.getDefaultDiscountType();
    }
  };
  watch(
    () => [osgo.value.contractStartDate, osgo.value.period],
    () => {
      if (!osgo.value.contractStartDate || !osgo.value.period) return;
      let endDate = dayjs(osgo.value.contractStartDate);
      if (osgo.value.period.periodType === "ONE_YEAR" || osgo.value.period.periodType === "SEASON") {
        endDate = endDate.add(osgo.value.period.months || 0, "months");
      } else if (osgo.value.period.periodType === "TILL_REGISTRATION") {
        endDate = endDate.add(osgo.value.period.days || 0, "days");
      }
      osgo.value.contractEndDate = endDate.subtract(1, "days").format("YYYY-MM-DD");
    }
  );
  watch(
    () => osgo.value.period,
    (period) => {
      if (period) {
        osgo.value.periodType = period.periodType;
      }
    }
  );
  watch(
    () => {
      var _a;
      return (_a = osgo.value.vehicle) == null ? void 0 : _a.govNumber;
    },
    (govNumber) => {
      if (!govNumber || govNumber.length < 2) return;
      const regionCode = parseInt(govNumber.slice(0, 2));
      const area = metaStore.findDrivedAreaByRegion(regionCode);
      if (area) {
        osgo.value.drivedArea = area;
      }
    }
  );
  watch(
    () => {
      var _a;
      return [
        (_a = osgo.value.vehicle) == null ? void 0 : _a.carType,
        osgo.value.period,
        osgo.value.driversLimited,
        osgo.value.incidentCoeff,
        osgo.value.drivedArea
      ];
    },
    () => {
      osgo.value.premium = calculatedPremium.value;
    },
    { deep: true }
  );
  watch(
    () => osgo.value.driversLimited,
    (limited) => {
      if (!limited) {
        osgo.value.incidentCoeff = void 0;
      }
    }
  );
  const verifyVehicle = async () => {
    if (!osgo.value.vehicle) return;
    vehicleVerifying.value = true;
    vehicleVerifyError.value = null;
    vehicleVerified.value = false;
    try {
      const response = await api.getVehicle({
        govNumber: osgo.value.vehicle.govNumber,
        techPassportSeries: osgo.value.vehicle.techPassportSeries,
        techPassportNumber: osgo.value.vehicle.techPassportNumber
      });
      const vehicleData = (response == null ? void 0 : response.result) || response;
      if ((response == null ? void 0 : response.error) && !vehicleData) {
        throw new Error(response.error.message || "Failed to verify vehicle");
      }
      if ((response == null ? void 0 : response.error) && vehicleData) {
        console.warn("[OsgoStore] Vehicle verification returned error but also has result:", response.error);
      }
      Object.assign(osgo.value.vehicle, vehicleData);
      if ((vehicleData == null ? void 0 : vehicleData.carType) && metaStore.isLoaded) {
        osgo.value.vehicle.carType = metaStore.findCarType(vehicleData.carType.id);
      }
      vehicleVerified.value = true;
      console.log("[OsgoStore] Vehicle verified:", vehicleData);
    } catch (error) {
      vehicleVerifyError.value = error.message || "Failed to verify vehicle";
      console.error("[OsgoStore] Vehicle verification failed:", error);
      throw error;
    } finally {
      vehicleVerifying.value = false;
    }
  };
  const verifyOwner = async () => {
    var _a;
    ownerVerifying.value = true;
    ownerVerifyError.value = null;
    ownerVerified.value = false;
    try {
      const result = await api.getIndividualByPassport({
        passportSeries: ((_a = owner.value.passportSeries) == null ? void 0 : _a.toUpperCase()) || "",
        passportNumber: owner.value.passportNumber,
        birthDate: owner.value.birthDate
      });
      console.log("[OsgoStore] API result:", result);
      console.log("[OsgoStore] Result has id?", !!(result == null ? void 0 : result.id));
      if (result) {
        owner.value = {
          passportSeries: owner.value.passportSeries,
          passportNumber: owner.value.passportNumber,
          birthDate: owner.value.birthDate,
          ...result
        };
        osgo.value.beneficiary = { ...owner.value };
        if (osgo.value.applicantIsOwner) {
          applicant.value = {
            passportSeries: owner.value.passportSeries,
            passportNumber: owner.value.passportNumber,
            birthDate: owner.value.birthDate,
            ...result
          };
          osgo.value.party = { ...owner.value };
          applicantVerified.value = true;
        }
      }
      ownerVerified.value = true;
      console.log("[OsgoStore] Owner after assignment:", owner.value);
      console.log("[OsgoStore] Owner has id?", !!owner.value.id);
    } catch (error) {
      ownerVerifyError.value = error.message || "Failed to verify owner";
      console.error("[OsgoStore] Owner verification failed:", error);
      throw error;
    } finally {
      ownerVerifying.value = false;
    }
  };
  const verifyApplicant = async () => {
    var _a;
    applicantVerifying.value = true;
    applicantVerifyError.value = null;
    applicantVerified.value = false;
    try {
      const result = await api.getIndividualByPassport({
        passportSeries: ((_a = applicant.value.passportSeries) == null ? void 0 : _a.toUpperCase()) || "",
        passportNumber: applicant.value.passportNumber,
        birthDate: applicant.value.birthDate
      });
      console.log("[OsgoStore] API result for applicant:", result);
      if (result) {
        applicant.value = {
          passportSeries: applicant.value.passportSeries,
          passportNumber: applicant.value.passportNumber,
          birthDate: applicant.value.birthDate,
          ...result
        };
        osgo.value.party = { ...applicant.value };
      }
      applicantVerified.value = true;
      console.log("[OsgoStore] Applicant after assignment:", applicant.value);
    } catch (error) {
      applicantVerifyError.value = error.message || "Failed to verify applicant";
      console.error("[OsgoStore] Applicant verification failed:", error);
      throw error;
    } finally {
      applicantVerifying.value = false;
    }
  };
  const verifyDriver = async (driver) => {
    if (!driver.passportSeries || !driver.passportNumber || !driver.birthDate) {
      throw new Error("Driver passport data is incomplete");
    }
    try {
      const apiBirthDate = dateToApiFormat(driver.birthDate);
      console.log("[OsgoStore] Verifying driver:", {
        passportSeries: driver.passportSeries,
        passportNumber: driver.passportNumber,
        birthDate: driver.birthDate,
        apiBirthDate
      });
      const result = await api.getDriver({
        passportSeries: driver.passportSeries.toUpperCase(),
        passportNumber: driver.passportNumber,
        birthDate: apiBirthDate
      });
      console.log("[OsgoStore] Driver verification result:", result);
      if (!result || !result.id) {
        throw new Error("Driver verification failed: invalid response");
      }
      const verifiedDriver = {
        ...driver,
        ...result,
        // Keep the display format birthDate
        birthDate: driver.birthDate
      };
      console.log("[OsgoStore] Verified driver:", verifiedDriver);
      return verifiedDriver;
    } catch (error) {
      console.error("[OsgoStore] Driver verification failed:", error);
      throw error;
    }
  };
  const addDriver = (prefill) => {
    if (!osgo.value.drivers) {
      osgo.value.drivers = [];
    }
    const newDriver = {
      passportSeries: (prefill == null ? void 0 : prefill.passportSeries) || "",
      passportNumber: (prefill == null ? void 0 : prefill.passportNumber) || "",
      birthDate: (prefill == null ? void 0 : prefill.birthDate) || ""
    };
    osgo.value.drivers.push(newDriver);
    console.log("[OsgoStore] Driver added, total drivers:", osgo.value.drivers.length);
  };
  const updateDriver = (index2, driver) => {
    if (osgo.value.drivers[index2]) {
      osgo.value.drivers[index2] = driver;
    }
  };
  const removeDriver = (index2) => {
    osgo.value.drivers.splice(index2, 1);
  };
  const hasDriver = (passportSeries, passportNumber, birthDate) => {
    return osgo.value.drivers.some(
      (d) => d.passportSeries === passportSeries && d.passportNumber === passportNumber && d.birthDate === birthDate
    );
  };
  const addOwnerAsDriver = () => {
    if (!owner.value.passportSeries || !owner.value.passportNumber || !owner.value.birthDate) {
      console.warn("[OsgoStore] Cannot add owner as driver: owner data incomplete");
      throw new Error("Owner data is incomplete. Please verify owner information first.");
    }
    if (hasDriver(owner.value.passportSeries, owner.value.passportNumber, owner.value.birthDate)) {
      console.log("[OsgoStore] Owner is already added as driver");
      return;
    }
    addDriver({
      passportSeries: owner.value.passportSeries,
      passportNumber: owner.value.passportNumber,
      birthDate: owner.value.birthDate
    });
    console.log("[OsgoStore] Owner added as driver");
  };
  const addApplicantAsDriver = () => {
    if (!hasDriver(applicant.value.passportSeries, applicant.value.passportNumber, applicant.value.birthDate)) {
      addDriver({
        passportSeries: applicant.value.passportSeries,
        passportNumber: applicant.value.passportNumber,
        birthDate: applicant.value.birthDate
      });
    }
  };
  const validateStepData = (step) => {
    var _a, _b, _c, _d;
    switch (step) {
      case STEPS.PARAMS:
        return {
          valid: !!(((_a = osgo.value.vehicle) == null ? void 0 : _a.carType) && osgo.value.period && osgo.value.drivedArea && (!osgo.value.driversLimited || osgo.value.incidentCoeff))
        };
      case STEPS.VEHICLE:
        return {
          valid: vehicleVerified.value
        };
      case STEPS.OWNER:
        return {
          valid: ownerVerified.value && (osgo.value.applicantIsOwner || applicantVerified.value)
        };
      case STEPS.DRIVERS:
        return {
          valid: !osgo.value.driversLimited || osgo.value.drivers.length > 0
        };
      case STEPS.SUMMARY:
        const applicantHasId = osgo.value.applicantIsOwner ? owner.value.id : applicant.value.id;
        return {
          valid: !!(owner.value.id && applicantHasId && ((_b = osgo.value.vehicle) == null ? void 0 : _b.id) && (!osgo.value.driversLimited || ((_c = osgo.value.drivers) == null ? void 0 : _c.length) && osgo.value.drivers.every((d) => d.id)) && ((_d = osgo.value.party) == null ? void 0 : _d.phone) && osgo.value.party.phone.replace(/[+()-]/g, "").length === 12 && osgo.value.contractStartDate)
        };
      case STEPS.PAYMENT:
        return {
          valid: !!(osgo.value.id && selectedPaymentMethod.value)
        };
      default:
        return { valid: false };
    }
  };
  const nextStep = () => {
    if (currentStep.value < totalSteps.value - 1) {
      currentStep.value++;
    }
  };
  const previousStep = () => {
    if (currentStep.value > 0) {
      currentStep.value--;
    }
  };
  const goToStep = (step) => {
    if (step >= 0 && step < totalSteps.value) {
      currentStep.value = step;
    }
  };
  const createPolicy = async () => {
    var _a, _b, _c, _d, _e, _f, _g, _h, _i;
    saving.value = true;
    saveError.value = null;
    try {
      let userInfo = null;
      try {
        userInfo = await api.fetchUserInfo();
        console.log("[OsgoStore] User info fetched:", userInfo);
      } catch (error) {
        console.warn("[OsgoStore] Failed to fetch user info, using minimal user object:", error);
        userInfo = {
          id: void 0,
          login: void 0,
          name: null,
          firstName: null,
          middleName: null,
          lastName: null,
          position: null,
          email: null,
          timeZone: "Asia/Tashkent",
          language: "ru",
          locale: "ru",
          _instanceName: ""
        };
      }
      const party = osgo.value.applicantIsOwner ? { ...owner.value } : { ...applicant.value };
      if (party.phone) {
        party.phone = party.phone.replace(/[+()-]/g, "");
      }
      const beneficiary = { ...owner.value };
      const discountType = osgo.value.discountType || ((_b = (_a = metaStore.meta) == null ? void 0 : _a.beneficiary) == null ? void 0 : _b.find(
        ({ coefficient }) => coefficient === 1
      ));
      if (!osgo.value.contractStartDate) {
        throw new Error("Contract start date is required");
      }
      const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
      if (!dateRegex.test(osgo.value.contractStartDate)) {
        throw new Error("Contract start date must be in YYYY-MM-DD format");
      }
      const startDate = dayjs(osgo.value.contractStartDate);
      if (!startDate.isValid()) {
        throw new Error("Invalid contract start date");
      }
      const osgoPayload = {
        party,
        // Full Individual object (already has country, district, region from verification)
        beneficiary,
        // Full Individual object
        vehicle: osgo.value.vehicle,
        // Full Vehicle object (already has carType from verification)
        period: osgo.value.period,
        // Full period object
        drivedArea: osgo.value.drivedArea,
        // Full drivedArea object
        discountType,
        // Full discountType object
        drivers: osgo.value.drivers || [],
        // Array of Driver objects
        contractStartDate: osgo.value.contractStartDate,
        // Already validated as YYYY-MM-DD
        contractEndDate: osgo.value.contractEndDate,
        status: osgo.value.status || "DRAFT",
        applicantIsOwner: (_c = osgo.value.applicantIsOwner) != null ? _c : true,
        periodType: osgo.value.periodType || ((_d = osgo.value.period) == null ? void 0 : _d.periodType) || "ONE_YEAR",
        premium: osgo.value.premium || 0,
        driversLimited: (_e = osgo.value.driversLimited) != null ? _e : false,
        incidentCoeff: osgo.value.incidentCoeff
      };
      const data = {
        user: userInfo,
        // Full user object
        osgo: osgoPayload
      };
      console.log("[OsgoStore] Creating policy with payload structure:", {
        user: { id: userInfo == null ? void 0 : userInfo.id, login: userInfo == null ? void 0 : userInfo.login },
        osgo: {
          party: { id: party.id, name: party.name },
          beneficiary: { id: beneficiary.id, name: beneficiary.name },
          vehicle: { id: (_f = osgo.value.vehicle) == null ? void 0 : _f.id, govNumber: (_g = osgo.value.vehicle) == null ? void 0 : _g.govNumber },
          period: { id: (_h = osgo.value.period) == null ? void 0 : _h.id },
          drivedArea: { id: (_i = osgo.value.drivedArea) == null ? void 0 : _i.id },
          discountType: { id: discountType == null ? void 0 : discountType.id }
        }
      });
      const policyId = await api.createOsgoApplication(data);
      if (!policyId || typeof policyId !== "string") {
        console.error("[OsgoStore] Invalid policy ID returned:", policyId);
        throw new Error("Failed to create policy: invalid response");
      }
      osgo.value.id = policyId;
      if (osgo.value.applicantIsOwner) {
        owner.value.phone = party.phone;
        osgo.value.party = owner.value;
      } else {
        applicant.value.phone = party.phone;
        osgo.value.party = applicant.value;
      }
      console.log("[OsgoStore] Policy created:", policyId);
      return policyId;
    } catch (error) {
      saveError.value = error.message || "Failed to create policy";
      console.error("[OsgoStore] Policy creation failed:", error);
      throw error;
    } finally {
      saving.value = false;
    }
  };
  const updatePolicy = async () => {
    if (!osgo.value.id) {
      throw new Error("Policy ID is required for update");
    }
    saving.value = true;
    saveError.value = null;
    try {
      const data = {
        ...osgo.value,
        party: osgo.value.applicantIsOwner ? owner.value : applicant.value,
        beneficiary: owner.value
      };
      await api.updateOsgoApplication(data);
      console.log("[OsgoStore] Policy updated");
    } catch (error) {
      saveError.value = error.message || "Failed to update policy";
      console.error("[OsgoStore] Policy update failed:", error);
      throw error;
    } finally {
      saving.value = false;
    }
  };
  const fetchPolicy = async (id) => {
    var _a, _b, _c;
    fetching.value = true;
    fetchError.value = null;
    try {
      const data = await api.fetchOsgoEntity(id);
      osgo.value = data;
      if ((_a = data.party) == null ? void 0 : _a.id) {
        const partyData = await api.fetchIndividualEntity(data.party.id);
        applicant.value = partyData;
        osgo.value.party = partyData;
      }
      if ((_b = data.beneficiary) == null ? void 0 : _b.id) {
        const beneficiaryData = await api.fetchIndividualEntity(data.beneficiary.id);
        owner.value = beneficiaryData;
        osgo.value.beneficiary = beneficiaryData;
      }
      if (metaStore.isLoaded && ((_c = osgo.value.vehicle) == null ? void 0 : _c.carType)) {
        osgo.value.vehicle.carType = metaStore.findCarType(osgo.value.vehicle.carType.id);
      }
      if (metaStore.isLoaded && osgo.value.period) {
        osgo.value.period = metaStore.findPeriod(osgo.value.period.id);
      }
      if (metaStore.isLoaded && osgo.value.drivedArea) {
        osgo.value.drivedArea = metaStore.findDrivedArea(osgo.value.drivedArea.id);
      }
      if (osgo.value.driversLimited && osgo.value.drivers.length > 0) {
        const maxCoeff = Math.max(
          ...osgo.value.drivers.map((d) => {
            var _a2;
            return ((_a2 = d.incidentFrequency) == null ? void 0 : _a2.coefficient) || 0;
          })
        );
        osgo.value.incidentCoeff = maxCoeff;
      }
      console.log("[OsgoStore] Policy fetched:", id);
    } catch (error) {
      fetchError.value = error.message || "Failed to fetch policy";
      console.error("[OsgoStore] Policy fetch failed:", error);
      throw error;
    } finally {
      fetching.value = false;
    }
  };
  const fetchFundData = async () => {
    if (!osgo.value.id) return;
    fetchingFundData.value = true;
    fundError.value = null;
    try {
      const result = await api.getFundPolicy(osgo.value.id);
      fundData.value = result || null;
      console.log("[OsgoStore] Fund data fetched:", result);
    } catch (error) {
      fundError.value = error.message || "Failed to fetch fund data";
      console.error("[OsgoStore] Fund data fetch failed:", error);
    } finally {
      fetchingFundData.value = false;
    }
  };
  const saveToSession = () => {
    return;
  };
  const loadFromSession = () => {
    return false;
  };
  const clearSession = () => {
    return;
  };
  const reset = () => {
    initialize();
    vehicleVerified.value = false;
    ownerVerified.value = false;
    applicantVerified.value = false;
    fundData.value = null;
    saveError.value = null;
    fetchError.value = null;
  };
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
    reset
  };
});
const _sfc_main$c = /* @__PURE__ */ defineComponent({
  __name: "LanguageSwitcher",
  __ssrInlineRender: true,
  setup(__props) {
    const { locale, locales } = useI18n();
    useSwitchLocalePath();
    const currentLocale = computed(() => locale.value);
    const availableLocales = computed(() => {
      return locales.value.filter((l) => l.code !== locale.value);
    });
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "language-switcher" }, _attrs))} data-v-e748ef5d><!--[-->`);
      ssrRenderList(unref(availableLocales), (locale2) => {
        _push(`<button class="${ssrRenderClass([
          "lang-btn",
          { active: unref(currentLocale) === locale2.code }
        ])}" data-v-e748ef5d>${ssrInterpolate(locale2.code.toUpperCase())}</button>`);
      });
      _push(`<!--]--></div>`);
    };
  }
});
const _sfc_setup$c = _sfc_main$c.setup;
_sfc_main$c.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/ui/LanguageSwitcher.vue");
  return _sfc_setup$c ? _sfc_setup$c(props, ctx) : void 0;
};
const __nuxt_component_0$2 = /* @__PURE__ */ _export_sfc(_sfc_main$c, [["__scopeId", "data-v-e748ef5d"]]);
const _sfc_main$b = /* @__PURE__ */ defineComponent({
  __name: "ProgressBar",
  __ssrInlineRender: true,
  props: {
    currentStep: {},
    totalSteps: {}
  },
  setup(__props) {
    const props = __props;
    const { t } = useI18n();
    const steps = computed(() => [
      t("steps.params"),
      t("steps.vehicle"),
      t("steps.owner"),
      t("steps.drivers"),
      t("steps.summary"),
      t("steps.payment")
    ]);
    const progressPercentage = computed(() => {
      return (props.currentStep + 1) / props.totalSteps * 100;
    });
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "progress-bar-container" }, _attrs))} data-v-b647cd33><div class="progress-track" data-v-b647cd33><div class="progress-fill" style="${ssrRenderStyle({ width: `${progressPercentage.value}%` })}" data-v-b647cd33></div></div><div class="steps-container" data-v-b647cd33><!--[-->`);
      ssrRenderList(steps.value, (step, index2) => {
        _push(`<div class="step-wrapper" data-v-b647cd33><div class="${ssrRenderClass([{
          "step-active": index2 === __props.currentStep,
          "step-completed": index2 < __props.currentStep,
          "step-pending": index2 > __props.currentStep
        }, "step-circle"])}" data-v-b647cd33>`);
        if (index2 < __props.currentStep) {
          _push(`<span class="step-check" data-v-b647cd33>\u2713</span>`);
        } else {
          _push(`<span class="step-number" data-v-b647cd33>${ssrInterpolate(index2 + 1)}</span>`);
        }
        _push(`</div><div class="step-label" data-v-b647cd33>${ssrInterpolate(step)}</div></div>`);
      });
      _push(`<!--]--></div></div>`);
    };
  }
});
const _sfc_setup$b = _sfc_main$b.setup;
_sfc_main$b.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/layout/ProgressBar.vue");
  return _sfc_setup$b ? _sfc_setup$b(props, ctx) : void 0;
};
const __nuxt_component_1 = /* @__PURE__ */ _export_sfc(_sfc_main$b, [["__scopeId", "data-v-b647cd33"]]);
const _sfc_main$a = /* @__PURE__ */ defineComponent({
  __name: "AppHeader",
  __ssrInlineRender: true,
  setup(__props) {
    const osgoStore = useOsgoStore();
    const currentStep = computed(() => osgoStore.currentStep);
    const totalSteps = computed(() => osgoStore.totalSteps);
    return (_ctx, _push, _parent, _attrs) => {
      const _component_LanguageSwitcher = __nuxt_component_0$2;
      const _component_ProgressBar = __nuxt_component_1;
      _push(`<header${ssrRenderAttrs(mergeProps({ class: "fixed-header" }, _attrs))} data-v-67b64b56><div class="max-w-container mx-auto px-4 h-full flex flex-col justify-center" data-v-67b64b56><div class="flex items-center justify-between mb-3" data-v-67b64b56><div class="flex items-center gap-3" data-v-67b64b56><div class="w-10 h-10 bg-primary overflow-hidden rounded-lg flex items-center justify-center text-white font-bold text-lg" data-v-67b64b56><img${ssrRenderAttr("src", _imports_0)} alt="Temiryo&#39;l Sug&#39;urta Logo" data-v-67b64b56></div><div data-v-67b64b56><div class="text-base font-bold text-text" data-v-67b64b56>\u041E\u0421\u0413\u041E\u0412\u0422\u0421</div><div class="text-xs text-text-light" data-v-67b64b56> Temiryo&#39;l Sug&#39;urta </div></div></div>`);
      _push(ssrRenderComponent(_component_LanguageSwitcher, null, null, _parent));
      _push(`</div>`);
      _push(ssrRenderComponent(_component_ProgressBar, {
        "current-step": currentStep.value,
        "total-steps": totalSteps.value
      }, null, _parent));
      _push(`</div></header>`);
    };
  }
});
const _sfc_setup$a = _sfc_main$a.setup;
_sfc_main$a.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/layout/AppHeader.vue");
  return _sfc_setup$a ? _sfc_setup$a(props, ctx) : void 0;
};
const AppHeader = /* @__PURE__ */ _export_sfc(_sfc_main$a, [["__scopeId", "data-v-67b64b56"]]);
const _sfc_main$9 = /* @__PURE__ */ defineComponent({
  __name: "AppFooter",
  __ssrInlineRender: true,
  setup(__props) {
    const osgoStore = useOsgoStore();
    useTelegramWebApp();
    useApi();
    const { t } = useI18n();
    const sendingPayment = ref(false);
    ref(null);
    ref(null);
    const currentStep = computed(() => osgoStore.currentStep);
    const totalSteps = computed(() => osgoStore.totalSteps);
    const isFirstStep = computed(() => currentStep.value === 0);
    const isLastStep = computed(() => currentStep.value === totalSteps.value - 1);
    const canProceed = computed(() => osgoStore.canProceedToNextStep);
    const loading = computed(() => osgoStore.saving || osgoStore.fetching || sendingPayment.value);
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<footer${ssrRenderAttrs(mergeProps({ class: "fixed-footer" }, _attrs))} data-v-4fce94ec><div class="max-w-container mx-auto px-4 h-full flex items-center justify-between gap-4" data-v-4fce94ec><button type="button" class="btn btn-secondary flex-1 max-w-[160px]"${ssrIncludeBooleanAttr(isFirstStep.value || loading.value) ? " disabled" : ""} data-v-4fce94ec><i class="text-lg bx bx-chevron-left" data-v-4fce94ec></i><span data-v-4fce94ec>${ssrInterpolate(_ctx.$t("common.previous"))}</span></button><div class="flex-1 text-center" data-v-4fce94ec><div class="text-sm text-text-light font-medium" data-v-4fce94ec>${ssrInterpolate(_ctx.$t("common.step", { current: currentStep.value + 1, total: totalSteps.value }))}</div></div><button type="button" class="${ssrRenderClass([{
        "btn-primary": !isLastStep.value || currentStep.value !== unref(STEPS).PAYMENT,
        "btn-success": isLastStep.value && currentStep.value === unref(STEPS).PAYMENT
      }, "btn flex-1 max-w-[160px]"])}"${ssrIncludeBooleanAttr(!canProceed.value || loading.value) ? " disabled" : ""} data-v-4fce94ec>`);
      if (loading.value) {
        _push(`<span class="spinner" data-v-4fce94ec></span>`);
      } else {
        _push(`<!--[-->`);
        if (currentStep.value === unref(STEPS).SUMMARY && !unref(osgoStore).osgo.id) {
          _push(`<span data-v-4fce94ec>${ssrInterpolate(_ctx.$t("step5.confirm"))}</span>`);
        } else if (isLastStep.value && currentStep.value === unref(STEPS).PAYMENT) {
          _push(`<span data-v-4fce94ec><i class="bx bx-credit-card" data-v-4fce94ec></i><span data-v-4fce94ec>${ssrInterpolate(_ctx.$t("step5.payment"))}</span></span>`);
        } else {
          _push(`<span data-v-4fce94ec>${ssrInterpolate(_ctx.$t("common.next"))}</span>`);
        }
        if (!isLastStep.value && currentStep.value !== unref(STEPS).SUMMARY) {
          _push(`<i class="text-lg bx bx-chevron-right" data-v-4fce94ec></i>`);
        } else {
          _push(`<!---->`);
        }
        _push(`<!--]-->`);
      }
      _push(`</button></div></footer>`);
    };
  }
});
const _sfc_setup$9 = _sfc_main$9.setup;
_sfc_main$9.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/layout/AppFooter.vue");
  return _sfc_setup$9 ? _sfc_setup$9(props, ctx) : void 0;
};
const AppFooter = /* @__PURE__ */ _export_sfc(_sfc_main$9, [["__scopeId", "data-v-4fce94ec"]]);
const _sfc_main$8 = /* @__PURE__ */ defineComponent({
  __name: "CheckButton",
  __ssrInlineRender: true,
  props: {
    title: { default: "" },
    description: { default: "" },
    icon: { default: "" },
    active: { type: Boolean, default: false },
    disabled: { type: Boolean, default: false }
  },
  emits: ["click"],
  setup(__props, { emit: __emit }) {
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<button${ssrRenderAttrs(mergeProps({
        type: "button",
        class: ["check-button", {
          "active": __props.active,
          "disabled": __props.disabled
        }],
        disabled: __props.disabled
      }, _attrs))} data-v-f6637245>`);
      if (__props.icon) {
        _push(`<div class="check-icon" data-v-f6637245>${ssrInterpolate(__props.icon)}</div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`<div class="check-content" data-v-f6637245><div class="check-title" data-v-f6637245>`);
      ssrRenderSlot(_ctx.$slots, "default", {}, () => {
        _push(`${ssrInterpolate(__props.title)}`);
      }, _push, _parent);
      _push(`</div>`);
      if (__props.description || _ctx.$slots.description) {
        _push(`<div class="check-description" data-v-f6637245>`);
        ssrRenderSlot(_ctx.$slots, "description", {}, () => {
          _push(`${ssrInterpolate(__props.description)}`);
        }, _push, _parent);
        _push(`</div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div><div class="check-indicator" data-v-f6637245><div class="check-circle" data-v-f6637245>`);
      if (__props.active) {
        _push(`<div class="check-dot" data-v-f6637245></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div></div></button>`);
    };
  }
});
const _sfc_setup$8 = _sfc_main$8.setup;
_sfc_main$8.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/ui/CheckButton.vue");
  return _sfc_setup$8 ? _sfc_setup$8(props, ctx) : void 0;
};
const __nuxt_component_0$1 = /* @__PURE__ */ _export_sfc(_sfc_main$8, [["__scopeId", "data-v-f6637245"]]);
const _sfc_main$7 = /* @__PURE__ */ defineComponent({
  __name: "Step1Params",
  __ssrInlineRender: true,
  setup(__props) {
    const osgoStore = useOsgoStore();
    const metaStore = useMetaStore();
    const tg = useTelegramWebApp();
    const { locale } = useI18n();
    const osgo = computed(() => osgoStore.osgo);
    const getLocalizedName2 = (item) => {
      return metaStore.getLocalizedName(item, locale.value || "uz");
    };
    const selectedDrivedArea = computed({
      get: () => {
        var _a;
        return ((_a = osgo.value.drivedArea) == null ? void 0 : _a.id) || "";
      },
      set: (id) => {
        const area = metaStore.findDrivedArea(id);
        if (area) {
          osgo.value.drivedArea = area;
        }
      }
    });
    const selectCarType = (carType) => {
      if (!osgoStore.isEditable) return;
      if (!osgo.value.vehicle) {
        osgo.value.vehicle = {
          govNumber: "",
          techPassportSeries: "",
          techPassportNumber: ""
        };
      }
      osgo.value.vehicle.carType = carType;
      if (tg.isTelegramWebApp.value) {
        tg.hapticImpact("light");
      }
    };
    const selectPeriod = (period) => {
      if (!osgoStore.isEditable) return;
      osgo.value.period = period;
      if (tg.isTelegramWebApp.value) {
        tg.hapticImpact("light");
      }
    };
    const selectIncidentFrequency = (frequency) => {
      if (!osgoStore.isEditable) return;
      osgo.value.incidentCoeff = frequency.coefficient;
      if (tg.isTelegramWebApp.value) {
        tg.hapticImpact("light");
      }
    };
    return (_ctx, _push, _parent, _attrs) => {
      const _component_CheckButton = __nuxt_component_0$1;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "step-container" }, _attrs))} data-v-9caa72cf>`);
      if (unref(metaStore).fetching) {
        _push(`<div class="loading-state" data-v-9caa72cf><div class="loading-spinner" data-v-9caa72cf></div><p data-v-9caa72cf>\u0417\u0430\u0433\u0440\u0443\u0437\u043A\u0430 \u0434\u0430\u043D\u043D\u044B\u0445...</p></div>`);
      } else if (unref(metaStore).error) {
        _push(`<div class="error-state" data-v-9caa72cf><i class="bx bx-error-circle" data-v-9caa72cf></i><p data-v-9caa72cf>${ssrInterpolate(unref(metaStore).error)}</p><button class="btn-retry" data-v-9caa72cf> \u041F\u043E\u043F\u0440\u043E\u0431\u043E\u0432\u0430\u0442\u044C \u0441\u043D\u043E\u0432\u0430 </button></div>`);
      } else if (!unref(metaStore).isLoaded || unref(metaStore).carTypes.length === 0) {
        _push(`<div class="error-state" data-v-9caa72cf><i class="bx bx-info-circle" data-v-9caa72cf></i><p data-v-9caa72cf>\u041D\u0435\u0442 \u0434\u0430\u043D\u043D\u044B\u0445. \u0417\u0430\u0433\u0440\u0443\u0437\u043A\u0430...</p><p class="debug-info" data-v-9caa72cf> isLoaded: ${ssrInterpolate(unref(metaStore).isLoaded)}<br data-v-9caa72cf> carTypes: ${ssrInterpolate(unref(metaStore).carTypes.length)}<br data-v-9caa72cf> meta: ${ssrInterpolate(unref(metaStore).meta ? "exists" : "null")}</p></div>`);
      } else {
        _push(`<div data-v-9caa72cf><div class="step-header" data-v-9caa72cf><h2 class="step-title" data-v-9caa72cf>\u041F\u0430\u0440\u0430\u043C\u0435\u0442\u0440\u044B \u043F\u043E\u043B\u0438\u0441\u0430</h2><p class="step-description" data-v-9caa72cf> \u0412\u044B\u0431\u0435\u0440\u0438\u0442\u0435 \u0442\u0438\u043F \u0442\u0440\u0430\u043D\u0441\u043F\u043E\u0440\u0442\u0430, \u043F\u0435\u0440\u0438\u043E\u0434 \u0441\u0442\u0440\u0430\u0445\u043E\u0432\u0430\u043D\u0438\u044F \u0438 \u043F\u0430\u0440\u0430\u043C\u0435\u0442\u0440\u044B \u0438\u0441\u043F\u043E\u043B\u044C\u0437\u043E\u0432\u0430\u043D\u0438\u044F </p></div><div class="step-content" data-v-9caa72cf><div class="form-section" data-v-9caa72cf><h3 class="section-title" data-v-9caa72cf>\u0422\u0438\u043F \u0442\u0440\u0430\u043D\u0441\u043F\u043E\u0440\u0442\u043D\u043E\u0433\u043E \u0441\u0440\u0435\u0434\u0441\u0442\u0432\u0430</h3><div class="grid grid-cols-1 md:grid-cols-2 gap-3" data-v-9caa72cf><!--[-->`);
        ssrRenderList(unref(metaStore).carTypes, (carType) => {
          var _a, _b;
          _push(ssrRenderComponent(_component_CheckButton, {
            key: carType.id,
            title: getLocalizedName2(carType),
            active: ((_b = (_a = osgo.value.vehicle) == null ? void 0 : _a.carType) == null ? void 0 : _b.id) === carType.id,
            disabled: !unref(osgoStore).isEditable,
            onClick: ($event) => selectCarType(carType)
          }, null, _parent));
        });
        _push(`<!--]--></div></div><div class="form-section" data-v-9caa72cf><h3 class="section-title" data-v-9caa72cf>\u041F\u0435\u0440\u0438\u043E\u0434 \u0441\u0442\u0440\u0430\u0445\u043E\u0432\u0430\u043D\u0438\u044F</h3><div class="grid grid-cols-1 md:grid-cols-3 gap-3" data-v-9caa72cf><!--[-->`);
        ssrRenderList(unref(metaStore).periods, (period) => {
          var _a;
          _push(ssrRenderComponent(_component_CheckButton, {
            key: period.id,
            title: getLocalizedName2(period),
            active: ((_a = osgo.value.period) == null ? void 0 : _a.id) === period.id,
            disabled: !unref(osgoStore).isEditable,
            onClick: ($event) => selectPeriod(period)
          }, null, _parent));
        });
        _push(`<!--]--></div></div><div class="form-section" data-v-9caa72cf><h3 class="section-title" data-v-9caa72cf>\u041A\u043E\u043B\u0438\u0447\u0435\u0441\u0442\u0432\u043E \u0432\u043E\u0434\u0438\u0442\u0435\u043B\u0435\u0439</h3><div class="grid grid-cols-1 md:grid-cols-2 gap-3" data-v-9caa72cf>`);
        _push(ssrRenderComponent(_component_CheckButton, {
          title: "\u0411\u0435\u0437 \u043E\u0433\u0440\u0430\u043D\u0438\u0447\u0435\u043D\u0438\u0439",
          description: "\u041B\u044E\u0431\u043E\u0435 \u043A\u043E\u043B\u0438\u0447\u0435\u0441\u0442\u0432\u043E \u0432\u043E\u0434\u0438\u0442\u0435\u043B\u0435\u0439",
          active: !osgo.value.driversLimited,
          disabled: !unref(osgoStore).isEditable,
          onClick: ($event) => osgo.value.driversLimited = false
        }, null, _parent));
        _push(ssrRenderComponent(_component_CheckButton, {
          title: "\u041E\u0433\u0440\u0430\u043D\u0438\u0447\u0435\u043D\u043D\u043E\u0435",
          description: "\u0423\u043A\u0430\u0437\u0430\u043D\u043D\u044B\u0435 \u0432\u043E\u0434\u0438\u0442\u0435\u043B\u0438",
          active: osgo.value.driversLimited,
          disabled: !unref(osgoStore).isEditable,
          onClick: ($event) => osgo.value.driversLimited = true
        }, null, _parent));
        _push(`</div></div>`);
        if (osgo.value.driversLimited) {
          _push(`<div class="form-section" data-v-9caa72cf><h3 class="section-title" data-v-9caa72cf>\u0427\u0430\u0441\u0442\u043E\u0442\u0430 \u0441\u0442\u0440\u0430\u0445\u043E\u0432\u044B\u0445 \u0441\u043B\u0443\u0447\u0430\u0435\u0432</h3><div class="grid grid-cols-1 md:grid-cols-2 gap-3" data-v-9caa72cf><!--[-->`);
          ssrRenderList(unref(metaStore).incidentFrequencies, (frequency) => {
            _push(ssrRenderComponent(_component_CheckButton, {
              key: frequency.id,
              title: getLocalizedName2(frequency),
              active: osgo.value.incidentCoeff === frequency.coefficient,
              disabled: !unref(osgoStore).isEditable,
              onClick: ($event) => selectIncidentFrequency(frequency)
            }, null, _parent));
          });
          _push(`<!--]--></div></div>`);
        } else {
          _push(`<!---->`);
        }
        _push(`<div class="form-section" data-v-9caa72cf><h3 class="section-title" data-v-9caa72cf>\u0422\u0435\u0440\u0440\u0438\u0442\u043E\u0440\u0438\u044F \u0438\u0441\u043F\u043E\u043B\u044C\u0437\u043E\u0432\u0430\u043D\u0438\u044F</h3><div class="select-wrapper" data-v-9caa72cf><select class="input"${ssrIncludeBooleanAttr(!unref(osgoStore).isEditable) ? " disabled" : ""} data-v-9caa72cf><option value="" disabled data-v-9caa72cf${ssrIncludeBooleanAttr(Array.isArray(selectedDrivedArea.value) ? ssrLooseContain(selectedDrivedArea.value, "") : ssrLooseEqual(selectedDrivedArea.value, "")) ? " selected" : ""}> \u0412\u044B\u0431\u0435\u0440\u0438\u0442\u0435 \u0442\u0435\u0440\u0440\u0438\u0442\u043E\u0440\u0438\u044E </option><!--[-->`);
        ssrRenderList(unref(metaStore).drivedAreas, (area) => {
          _push(`<option${ssrRenderAttr("value", area.id)} data-v-9caa72cf${ssrIncludeBooleanAttr(Array.isArray(selectedDrivedArea.value) ? ssrLooseContain(selectedDrivedArea.value, area.id) : ssrLooseEqual(selectedDrivedArea.value, area.id)) ? " selected" : ""}>${ssrInterpolate(getLocalizedName2(area))}</option>`);
        });
        _push(`<!--]--></select><div class="select-icon" data-v-9caa72cf><i class="bx bx-chevron-down" data-v-9caa72cf></i></div></div></div>`);
        if (unref(osgoStore).calculatedPremium > 0) {
          _push(`<div class="premium-card" data-v-9caa72cf><div class="premium-card-content" data-v-9caa72cf><div class="premium-label" data-v-9caa72cf><i class="bx bx-shield-alt-2" data-v-9caa72cf></i><span data-v-9caa72cf>\u0421\u0442\u0440\u0430\u0445\u043E\u0432\u0430\u044F \u043F\u0440\u0435\u043C\u0438\u044F</span></div><div class="premium-amount" data-v-9caa72cf>${ssrInterpolate(unref(formatPrice)(unref(osgoStore).calculatedPremium))}</div></div></div>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</div></div>`);
      }
      _push(`</div>`);
    };
  }
});
const _sfc_setup$7 = _sfc_main$7.setup;
_sfc_main$7.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/steps/Step1Params.vue");
  return _sfc_setup$7 ? _sfc_setup$7(props, ctx) : void 0;
};
const Step1Params = /* @__PURE__ */ _export_sfc(_sfc_main$7, [["__scopeId", "data-v-9caa72cf"]]);
const _sfc_main$6 = /* @__PURE__ */ defineComponent({
  __name: "InputField",
  __ssrInlineRender: true,
  props: {
    modelValue: {},
    label: { default: "" },
    placeholder: { default: "" },
    type: { default: "text" },
    icon: { default: "" },
    error: { default: "" },
    helperText: { default: "" },
    disabled: { type: Boolean, default: false },
    readonly: { type: Boolean, default: false },
    required: { type: Boolean, default: false },
    clearable: { type: Boolean, default: false },
    loading: { type: Boolean, default: false },
    maxLength: { default: void 0 },
    showCount: { type: Boolean, default: false },
    autocomplete: { default: "off" },
    inputMode: { default: "text" },
    mask: { default: "" },
    autofocus: { type: Boolean, default: false },
    uppercase: { type: Boolean, default: false },
    dateMask: { type: Boolean, default: false }
  },
  emits: ["update:modelValue", "blur", "focus", "enter", "input"],
  setup(__props, { expose: __expose, emit: __emit }) {
    const props = __props;
    const emit = __emit;
    const { locale } = useI18n();
    const inputLocale = computed(() => {
      if (props.type === "date") {
        return locale.value === "uz" ? "uz-UZ" : "ru-RU";
      }
      return void 0;
    });
    const inputRef = ref(null);
    const inputId = computed(() => `input-${Math.random().toString(36).substr(2, 9)}`);
    const inputValue = computed({
      get: () => {
        const value = String(props.modelValue || "");
        if (props.dateMask && value) {
          if (/^\d{1,2}(-\d{1,2}(-\d{0,4})?)?$/.test(value) || /^\d{2}-\d{2}-\d{4}$/.test(value)) {
            return value;
          }
          if (/^\d{4}-\d{2}-\d{2}$/.test(value)) {
            const parts = value.split("-");
            return `${parts[2]}-${parts[1]}-${parts[0]}`;
          }
        }
        return value;
      },
      set: (value) => {
        if (props.uppercase) {
          value = value.toUpperCase();
        }
        if (props.dateMask && value) {
          if (/^\d{4}-\d{2}-\d{2}$/.test(value)) {
            emit("update:modelValue", value);
            return;
          }
          if (/^\d{2}-\d{2}-\d{4}$/.test(value)) {
            const parts = value.split("-");
            emit("update:modelValue", `${parts[2]}-${parts[1]}-${parts[0]}`);
            return;
          }
          emit("update:modelValue", value);
          return;
        }
        emit("update:modelValue", value);
      }
    });
    const focus = () => {
      var _a;
      (_a = inputRef.value) == null ? void 0 : _a.focus();
    };
    const blur = () => {
      var _a;
      (_a = inputRef.value) == null ? void 0 : _a.blur();
    };
    __expose({
      focus,
      blur
    });
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({
        class: ["input-field", { "has-error": __props.error }]
      }, _attrs))} data-v-4eb39aee>`);
      if (__props.label) {
        _push(`<label class="input-label"${ssrRenderAttr("for", inputId.value)} data-v-4eb39aee>${ssrInterpolate(__props.label)} `);
        if (__props.required) {
          _push(`<span class="text-error" data-v-4eb39aee>*</span>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</label>`);
      } else {
        _push(`<!---->`);
      }
      _push(`<div class="input-wrapper" data-v-4eb39aee>`);
      if (__props.icon) {
        _push(`<div class="input-icon input-icon-left" data-v-4eb39aee><i class="${ssrRenderClass(__props.icon)}" data-v-4eb39aee></i></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`<input${ssrRenderAttr("id", inputId.value)}${ssrRenderDynamicModel(__props.dateMask ? "text" : __props.type, inputValue.value, null)}${ssrRenderAttr("type", __props.dateMask ? "text" : __props.type)}${ssrRenderAttr("placeholder", __props.dateMask ? __props.placeholder || "DD-MM-YYYY" : __props.placeholder)}${ssrIncludeBooleanAttr(__props.disabled) ? " disabled" : ""}${ssrIncludeBooleanAttr(__props.readonly) ? " readonly" : ""}${ssrRenderAttr("maxlength", __props.dateMask ? 10 : __props.maxLength)}${ssrRenderAttr("autocomplete", __props.autocomplete)}${ssrRenderAttr("inputmode", __props.dateMask ? "numeric" : __props.inputMode)}${ssrRenderAttr("lang", inputLocale.value)} class="${ssrRenderClass([{
        "input-with-icon-left": __props.icon,
        "input-with-icon-right": __props.clearable || __props.loading,
        "input-error": __props.error
      }, "input"])}" data-v-4eb39aee>`);
      if (__props.clearable && inputValue.value && !__props.disabled && !__props.readonly) {
        _push(`<button type="button" class="input-icon input-icon-right input-clear" data-v-4eb39aee><i class="bx bx-x" data-v-4eb39aee></i></button>`);
      } else {
        _push(`<!---->`);
      }
      if (__props.loading) {
        _push(`<div class="input-icon input-icon-right" data-v-4eb39aee><div class="spinner-small" data-v-4eb39aee></div></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div>`);
      if (__props.helperText || __props.error) {
        _push(`<div class="input-message" data-v-4eb39aee>`);
        if (__props.error) {
          _push(`<span class="error-message" data-v-4eb39aee>${ssrInterpolate(__props.error)}</span>`);
        } else if (__props.helperText) {
          _push(`<span class="helper-text" data-v-4eb39aee>${ssrInterpolate(__props.helperText)}</span>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</div>`);
      } else {
        _push(`<!---->`);
      }
      if (__props.showCount && __props.maxLength) {
        _push(`<div class="input-count" data-v-4eb39aee>${ssrInterpolate(inputValue.value.length)} / ${ssrInterpolate(__props.maxLength)}</div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div>`);
    };
  }
});
const _sfc_setup$6 = _sfc_main$6.setup;
_sfc_main$6.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/ui/InputField.vue");
  return _sfc_setup$6 ? _sfc_setup$6(props, ctx) : void 0;
};
const __nuxt_component_0 = /* @__PURE__ */ _export_sfc(_sfc_main$6, [["__scopeId", "data-v-4eb39aee"]]);
function validateGovNumber(govNumber) {
  if (!govNumber) {
    return { valid: false, error: "\u0413\u043E\u0441\u0443\u0434\u0430\u0440\u0441\u0442\u0432\u0435\u043D\u043D\u044B\u0439 \u043D\u043E\u043C\u0435\u0440 \u043E\u0431\u044F\u0437\u0430\u0442\u0435\u043B\u0435\u043D" };
  }
  const cleaned = govNumber.replace(/\s/g, "").toUpperCase();
  const pattern = /^\d{2}[A-Z]\d{3}[A-Z]{2}$/;
  if (!pattern.test(cleaned)) {
    return {
      valid: false,
      error: "\u041D\u0435\u0432\u0435\u0440\u043D\u044B\u0439 \u0444\u043E\u0440\u043C\u0430\u0442. \u041F\u0440\u0438\u043C\u0435\u0440: 01W273FA"
    };
  }
  return { valid: true };
}
function validateTechPassportSeries(series) {
  if (!series) {
    return { valid: false, error: "\u0421\u0435\u0440\u0438\u044F \u0442\u0435\u0445\u043F\u0430\u0441\u043F\u043E\u0440\u0442\u0430 \u043E\u0431\u044F\u0437\u0430\u0442\u0435\u043B\u044C\u043D\u0430" };
  }
  const cleaned = series.toUpperCase();
  const pattern = /^[A-Z]{2,3}$/;
  if (!pattern.test(cleaned)) {
    return {
      valid: false,
      error: "\u0421\u0435\u0440\u0438\u044F \u0434\u043E\u043B\u0436\u043D\u0430 \u0441\u043E\u0441\u0442\u043E\u044F\u0442\u044C \u0438\u0437 2-3 \u0431\u0443\u043A\u0432"
    };
  }
  return { valid: true };
}
function validateTechPassportNumber(number) {
  if (!number) {
    return { valid: false, error: "\u041D\u043E\u043C\u0435\u0440 \u0442\u0435\u0445\u043F\u0430\u0441\u043F\u043E\u0440\u0442\u0430 \u043E\u0431\u044F\u0437\u0430\u0442\u0435\u043B\u0435\u043D" };
  }
  const pattern = /^\d+$/;
  if (!pattern.test(number)) {
    return {
      valid: false,
      error: "\u041D\u043E\u043C\u0435\u0440 \u0434\u043E\u043B\u0436\u0435\u043D \u0441\u043E\u0434\u0435\u0440\u0436\u0430\u0442\u044C \u0442\u043E\u043B\u044C\u043A\u043E \u0446\u0438\u0444\u0440\u044B"
    };
  }
  return { valid: true };
}
const _sfc_main$5 = /* @__PURE__ */ defineComponent({
  __name: "Step2Vehicle",
  __ssrInlineRender: true,
  setup(__props) {
    const osgoStore = useOsgoStore();
    useMetaStore();
    useTelegramWebApp();
    const osgo = computed(() => osgoStore.osgo);
    const errors = ref({});
    const canVerify = computed(() => {
      var _a, _b, _c;
      return !!(((_a = osgo.value.vehicle) == null ? void 0 : _a.govNumber) && ((_b = osgo.value.vehicle) == null ? void 0 : _b.techPassportSeries) && ((_c = osgo.value.vehicle) == null ? void 0 : _c.techPassportNumber) && Object.keys(errors.value).length === 0);
    });
    const vehicleInfoCount = computed(() => {
      if (!osgo.value.vehicle) return 0;
      const vehicle = osgo.value.vehicle;
      let count = 0;
      if (vehicle.techPassportIssueDate) count++;
      if (vehicle.modelName || vehicle.model) count++;
      if (vehicle.createdYear || vehicle.year) count++;
      if (vehicle.engineNumber) count++;
      if (vehicle.bodyNumber) count++;
      return count;
    });
    const validateField = (field) => {
      if (!osgo.value.vehicle) return;
      let result;
      switch (field) {
        case "govNumber":
          result = validateGovNumber(osgo.value.vehicle.govNumber);
          break;
        case "techPassportSeries":
          result = validateTechPassportSeries(osgo.value.vehicle.techPassportSeries);
          break;
        case "techPassportNumber":
          result = validateTechPassportNumber(osgo.value.vehicle.techPassportNumber);
          break;
      }
      if (result && !result.valid) {
        errors.value[field] = result.error || "";
      } else {
        delete errors.value[field];
      }
    };
    return (_ctx, _push, _parent, _attrs) => {
      var _a, _b, _c, _d, _e, _f, _g, _h, _i, _j, _k;
      const _component_InputField = __nuxt_component_0;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "step-container" }, _attrs))} data-v-7b02d127><div class="step-header" data-v-7b02d127><h2 class="step-title" data-v-7b02d127>\u0418\u043D\u0444\u043E\u0440\u043C\u0430\u0446\u0438\u044F \u043E \u0442\u0440\u0430\u043D\u0441\u043F\u043E\u0440\u0442\u0435</h2><p class="step-description" data-v-7b02d127> \u0412\u0432\u0435\u0434\u0438\u0442\u0435 \u0434\u0430\u043D\u043D\u044B\u0435 \u0442\u0440\u0430\u043D\u0441\u043F\u043E\u0440\u0442\u043D\u043E\u0433\u043E \u0441\u0440\u0435\u0434\u0441\u0442\u0432\u0430 \u0434\u043B\u044F \u043F\u0440\u043E\u0432\u0435\u0440\u043A\u0438 </p></div><div class="step-content" data-v-7b02d127><div class="form-section" data-v-7b02d127>`);
      _push(ssrRenderComponent(_component_InputField, {
        modelValue: osgo.value.vehicle.govNumber,
        "onUpdate:modelValue": ($event) => osgo.value.vehicle.govNumber = $event,
        label: "\u0413\u043E\u0441\u0443\u0434\u0430\u0440\u0441\u0442\u0432\u0435\u043D\u043D\u044B\u0439 \u043D\u043E\u043C\u0435\u0440",
        placeholder: "01A000AA",
        disabled: !unref(osgoStore).isEditable,
        error: errors.value.govNumber,
        icon: "bx bx-car",
        required: "",
        uppercase: "",
        onBlur: ($event) => validateField("govNumber")
      }, null, _parent));
      _push(`</div><div class="form-section" data-v-7b02d127>`);
      _push(ssrRenderComponent(_component_InputField, {
        modelValue: osgo.value.vehicle.techPassportSeries,
        "onUpdate:modelValue": ($event) => osgo.value.vehicle.techPassportSeries = $event,
        label: "\u0421\u0435\u0440\u0438\u044F \u0442\u0435\u0445\u043F\u0430\u0441\u043F\u043E\u0440\u0442\u0430",
        placeholder: "AAA",
        disabled: !unref(osgoStore).isEditable,
        error: errors.value.techPassportSeries,
        "max-length": 3,
        required: "",
        uppercase: "",
        onBlur: ($event) => validateField("techPassportSeries")
      }, null, _parent));
      _push(`</div><div class="form-section" data-v-7b02d127>`);
      _push(ssrRenderComponent(_component_InputField, {
        modelValue: osgo.value.vehicle.techPassportNumber,
        "onUpdate:modelValue": ($event) => osgo.value.vehicle.techPassportNumber = $event,
        label: "\u041D\u043E\u043C\u0435\u0440 \u0442\u0435\u0445\u043F\u0430\u0441\u043F\u043E\u0440\u0442\u0430",
        placeholder: "1234567",
        disabled: !unref(osgoStore).isEditable,
        error: errors.value.techPassportNumber,
        "input-mode": "numeric",
        required: "",
        onBlur: ($event) => validateField("techPassportNumber")
      }, null, _parent));
      _push(`</div><div class="form-section" data-v-7b02d127><button type="button" class="btn btn-primary w-full"${ssrIncludeBooleanAttr(!canVerify.value || unref(osgoStore).vehicleVerifying) ? " disabled" : ""} data-v-7b02d127>`);
      if (unref(osgoStore).vehicleVerifying) {
        _push(`<span class="spinner" data-v-7b02d127></span>`);
      } else {
        _push(`<!--[--><i class="bx bx-check-circle" data-v-7b02d127></i><span data-v-7b02d127>${ssrInterpolate(unref(osgoStore).vehicleVerified ? "\u041F\u0440\u043E\u0432\u0435\u0440\u0435\u043D\u043E" : "\u041F\u0440\u043E\u0432\u0435\u0440\u0438\u0442\u044C")}</span><!--]-->`);
      }
      _push(`</button></div>`);
      if (unref(osgoStore).vehicleVerifyError) {
        _push(`<div class="alert alert-error" data-v-7b02d127><i class="bx bx-error-circle" data-v-7b02d127></i><span data-v-7b02d127>${ssrInterpolate(unref(osgoStore).vehicleVerifyError)}</span></div>`);
      } else {
        _push(`<!---->`);
      }
      if (unref(osgoStore).vehicleVerified && osgo.value.vehicle) {
        _push(`<div class="vehicle-info-card" data-v-7b02d127><div class="card-header" data-v-7b02d127><i class="bx bx-check-circle text-success" data-v-7b02d127></i><span data-v-7b02d127>\u0422\u0440\u0430\u043D\u0441\u043F\u043E\u0440\u0442 \u043D\u0430\u0439\u0434\u0435\u043D</span></div><div class="card-content" data-v-7b02d127>`);
        {
          _push(`<!---->`);
        }
        _push(`<div class="vehicle-info-grid" data-v-7b02d127>`);
        if ((_a = osgo.value.vehicle) == null ? void 0 : _a.techPassportIssueDate) {
          _push(`<div class="vehicle-info-item" data-v-7b02d127><div class="vehicle-info-label" data-v-7b02d127>\u0414\u0430\u0442\u0430 \u0432\u044B\u0434\u0430\u0447\u0438 \u0442\u0435\u0445\u043F\u0430\u0441\u043F\u043E\u0440\u0442\u0430</div><div class="vehicle-info-value" data-v-7b02d127>${ssrInterpolate(unref(formatDisplayDate)(osgo.value.vehicle.techPassportIssueDate))}</div></div>`);
        } else {
          _push(`<!---->`);
        }
        if (((_b = osgo.value.vehicle) == null ? void 0 : _b.modelName) || ((_c = osgo.value.vehicle) == null ? void 0 : _c.model)) {
          _push(`<div class="vehicle-info-item" data-v-7b02d127><div class="vehicle-info-label" data-v-7b02d127>\u041C\u043E\u0434\u0435\u043B\u044C</div><div class="vehicle-info-value" data-v-7b02d127>${ssrInterpolate(((_d = osgo.value.vehicle) == null ? void 0 : _d.modelName) || ((_e = osgo.value.vehicle) == null ? void 0 : _e.model) || "-")}</div></div>`);
        } else {
          _push(`<!---->`);
        }
        if (((_f = osgo.value.vehicle) == null ? void 0 : _f.createdYear) || ((_g = osgo.value.vehicle) == null ? void 0 : _g.year)) {
          _push(`<div class="vehicle-info-item" data-v-7b02d127><div class="vehicle-info-label" data-v-7b02d127>\u0413\u043E\u0434 \u0432\u044B\u043F\u0443\u0441\u043A\u0430</div><div class="vehicle-info-value" data-v-7b02d127>${ssrInterpolate(((_h = osgo.value.vehicle) == null ? void 0 : _h.createdYear) || ((_i = osgo.value.vehicle) == null ? void 0 : _i.year) || "-")}</div></div>`);
        } else {
          _push(`<!---->`);
        }
        if ((_j = osgo.value.vehicle) == null ? void 0 : _j.engineNumber) {
          _push(`<div class="vehicle-info-item" data-v-7b02d127><div class="vehicle-info-label" data-v-7b02d127>\u041D\u043E\u043C\u0435\u0440 \u0434\u0432\u0438\u0433\u0430\u0442\u0435\u043B\u044F</div><div class="vehicle-info-value" data-v-7b02d127>${ssrInterpolate(osgo.value.vehicle.engineNumber)}</div></div>`);
        } else {
          _push(`<!---->`);
        }
        if ((_k = osgo.value.vehicle) == null ? void 0 : _k.bodyNumber) {
          _push(`<div class="vehicle-info-item" data-v-7b02d127><div class="vehicle-info-label" data-v-7b02d127>\u041D\u043E\u043C\u0435\u0440 \u043A\u0443\u0437\u043E\u0432\u0430/\u0448\u0430\u0441\u0441\u0438</div><div class="vehicle-info-value" data-v-7b02d127>${ssrInterpolate(osgo.value.vehicle.bodyNumber)}</div></div>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</div>`);
        if (vehicleInfoCount.value === 0) {
          _push(`<div class="vehicle-info-empty" data-v-7b02d127> \u041D\u0435\u0442 \u0434\u0430\u043D\u043D\u044B\u0445 \u043E \u0442\u0440\u0430\u043D\u0441\u043F\u043E\u0440\u0442\u043D\u043E\u043C \u0441\u0440\u0435\u0434\u0441\u0442\u0432\u0435 </div>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</div></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div></div>`);
    };
  }
});
const _sfc_setup$5 = _sfc_main$5.setup;
_sfc_main$5.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/steps/Step2Vehicle.vue");
  return _sfc_setup$5 ? _sfc_setup$5(props, ctx) : void 0;
};
const Step2Vehicle = /* @__PURE__ */ _export_sfc(_sfc_main$5, [["__scopeId", "data-v-7b02d127"]]);
const _sfc_main$4 = /* @__PURE__ */ defineComponent({
  __name: "Step3Owner",
  __ssrInlineRender: true,
  setup(__props) {
    const osgoStore = useOsgoStore();
    useTelegramWebApp();
    const { locale, t } = useI18n();
    const osgo = computed(() => osgoStore.osgo);
    const owner = computed(() => osgoStore.owner);
    const applicant = computed(() => osgoStore.applicant);
    return (_ctx, _push, _parent, _attrs) => {
      var _a, _b, _c, _d, _e, _f;
      const _component_InputField = __nuxt_component_0;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "step-container" }, _attrs))} data-v-62def220><div class="step-header" data-v-62def220><h2 class="step-title" data-v-62def220>${ssrInterpolate(unref(t)("step3.title"))}</h2><p class="step-description" data-v-62def220>${ssrInterpolate(unref(t)("step3.description"))}</p></div><div class="step-content" data-v-62def220><div class="subsection" data-v-62def220><h3 class="subsection-title" data-v-62def220>${ssrInterpolate(unref(t)("step3.owner"))}</h3><div class="form-section" data-v-62def220>`);
      _push(ssrRenderComponent(_component_InputField, {
        modelValue: owner.value.passportSeries,
        "onUpdate:modelValue": ($event) => owner.value.passportSeries = $event,
        label: unref(t)("step3.passportSeries"),
        placeholder: unref(t)("step3.passportSeriesPlaceholder"),
        disabled: !unref(osgoStore).isEditable,
        "max-length": 2,
        uppercase: "",
        required: ""
      }, null, _parent));
      _push(`</div><div class="form-section" data-v-62def220>`);
      _push(ssrRenderComponent(_component_InputField, {
        modelValue: owner.value.passportNumber,
        "onUpdate:modelValue": ($event) => owner.value.passportNumber = $event,
        label: unref(t)("step3.passportNumber"),
        placeholder: unref(t)("step3.passportNumberPlaceholder"),
        disabled: !unref(osgoStore).isEditable,
        "input-mode": "numeric",
        "max-length": 7,
        required: ""
      }, null, _parent));
      _push(`</div><div class="form-section" data-v-62def220>`);
      _push(ssrRenderComponent(_component_InputField, {
        modelValue: owner.value.birthDate,
        "onUpdate:modelValue": ($event) => owner.value.birthDate = $event,
        label: unref(t)("step3.birthDate"),
        type: "text",
        "date-mask": "",
        placeholder: "31-12-2025",
        disabled: !unref(osgoStore).isEditable,
        required: ""
      }, null, _parent));
      _push(`</div><div class="form-section" data-v-62def220><button type="button" class="btn btn-primary w-full"${ssrIncludeBooleanAttr(unref(osgoStore).ownerVerifying) ? " disabled" : ""} data-v-62def220>`);
      if (unref(osgoStore).ownerVerifying) {
        _push(`<span class="spinner" data-v-62def220></span>`);
      } else {
        _push(`<!--[--><i class="bx bx-check-circle" data-v-62def220></i><span data-v-62def220>${ssrInterpolate(unref(osgoStore).ownerVerified ? unref(t)("step3.verified") : unref(t)("step3.verifyOwner"))}</span><!--]-->`);
      }
      _push(`</button></div>`);
      if (unref(osgoStore).ownerVerified && owner.value.id) {
        _push(`<div class="info-card success" data-v-62def220><div class="card-header" data-v-62def220><i class="bx bx-check-circle" data-v-62def220></i><span data-v-62def220>${ssrInterpolate(unref(t)("step3.ownerFound"))}</span></div><div class="card-content" data-v-62def220><div class="info-grid" data-v-62def220><div class="info-item" data-v-62def220><div class="info-label" data-v-62def220>${ssrInterpolate(unref(t)("step3.passportIssueDate"))}</div><div class="info-value" data-v-62def220>${ssrInterpolate(owner.value.passportIssueDate ? unref(formatDisplayDate)(owner.value.passportIssueDate) : "-")}</div></div><div class="info-item" data-v-62def220><div class="info-label" data-v-62def220>${ssrInterpolate(unref(t)("step3.pinfl"))}</div><div class="info-value" data-v-62def220>${ssrInterpolate(owner.value.nationalIdentifier || "-")}</div></div><div class="info-item info-item-wide" data-v-62def220><div class="info-label" data-v-62def220>${ssrInterpolate(unref(t)("step3.issuedBy"))}</div><div class="info-value" data-v-62def220>${ssrInterpolate(owner.value.passportIssuedBy || "-")}</div></div><div class="info-item" data-v-62def220><div class="info-label" data-v-62def220>${ssrInterpolate(unref(t)("step3.lastName"))}</div><div class="info-value" data-v-62def220>${ssrInterpolate(owner.value.lastName || "-")}</div></div><div class="info-item" data-v-62def220><div class="info-label" data-v-62def220>${ssrInterpolate(unref(t)("step3.firstName"))}</div><div class="info-value" data-v-62def220>${ssrInterpolate(owner.value.firstName || "-")}</div></div><div class="info-item" data-v-62def220><div class="info-label" data-v-62def220>${ssrInterpolate(unref(t)("step3.middleName"))}</div><div class="info-value" data-v-62def220>${ssrInterpolate(owner.value.middleName || "-")}</div></div><div class="info-item" data-v-62def220><div class="info-label" data-v-62def220>${ssrInterpolate(unref(t)("step3.gender"))}</div><div class="info-value" data-v-62def220>${ssrInterpolate(owner.value.gender ? unref(formatGender)(owner.value.gender, unref(locale).value) : "-")}</div></div><div class="info-item" data-v-62def220><div class="info-label" data-v-62def220>${ssrInterpolate(unref(t)("step3.country"))}</div><div class="info-value" data-v-62def220>${ssrInterpolate(((_a = owner.value.country) == null ? void 0 : _a.langValue1) || "-")}</div></div><div class="info-item" data-v-62def220><div class="info-label" data-v-62def220>${ssrInterpolate(unref(t)("step3.region"))}</div><div class="info-value" data-v-62def220>${ssrInterpolate(((_b = owner.value.region) == null ? void 0 : _b.langValue1) || "-")}</div></div><div class="info-item" data-v-62def220><div class="info-label" data-v-62def220>${ssrInterpolate(unref(t)("step3.district"))}</div><div class="info-value" data-v-62def220>${ssrInterpolate(((_c = owner.value.district) == null ? void 0 : _c.langValue1) || "-")}</div></div><div class="info-item" data-v-62def220><div class="info-label" data-v-62def220>${ssrInterpolate(unref(t)("step3.street"))}</div><div class="info-value" data-v-62def220>${ssrInterpolate(owner.value.street || "-")}</div></div></div></div></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div><div class="form-section" data-v-62def220><label class="checkbox-label" data-v-62def220><input${ssrIncludeBooleanAttr(Array.isArray(osgo.value.applicantIsOwner) ? ssrLooseContain(osgo.value.applicantIsOwner, null) : osgo.value.applicantIsOwner) ? " checked" : ""} type="checkbox" class="checkbox"${ssrIncludeBooleanAttr(!unref(osgoStore).isEditable) ? " disabled" : ""} data-v-62def220><span data-v-62def220>${ssrInterpolate(unref(t)("step3.ownerIsApplicant"))}</span></label></div>`);
      if (!osgo.value.applicantIsOwner) {
        _push(`<div class="subsection" data-v-62def220><h3 class="subsection-title" data-v-62def220>${ssrInterpolate(unref(t)("step3.applicant"))}</h3><div class="form-section" data-v-62def220>`);
        _push(ssrRenderComponent(_component_InputField, {
          modelValue: applicant.value.passportSeries,
          "onUpdate:modelValue": ($event) => applicant.value.passportSeries = $event,
          label: unref(t)("step3.passportSeries"),
          placeholder: unref(t)("step3.passportSeriesPlaceholder"),
          disabled: !unref(osgoStore).isEditable,
          "max-length": 2,
          uppercase: "",
          required: ""
        }, null, _parent));
        _push(`</div><div class="form-section" data-v-62def220>`);
        _push(ssrRenderComponent(_component_InputField, {
          modelValue: applicant.value.passportNumber,
          "onUpdate:modelValue": ($event) => applicant.value.passportNumber = $event,
          label: unref(t)("step3.passportNumber"),
          placeholder: unref(t)("step3.passportNumberPlaceholder"),
          disabled: !unref(osgoStore).isEditable,
          "input-mode": "numeric",
          "max-length": 7,
          required: ""
        }, null, _parent));
        _push(`</div><div class="form-section" data-v-62def220>`);
        _push(ssrRenderComponent(_component_InputField, {
          modelValue: applicant.value.birthDate,
          "onUpdate:modelValue": ($event) => applicant.value.birthDate = $event,
          label: unref(t)("step3.birthDate"),
          type: "text",
          "date-mask": "",
          placeholder: "DD-MM-YYYY",
          disabled: !unref(osgoStore).isEditable,
          required: ""
        }, null, _parent));
        _push(`</div><div class="form-section" data-v-62def220><button type="button" class="btn btn-primary w-full"${ssrIncludeBooleanAttr(unref(osgoStore).applicantVerifying) ? " disabled" : ""} data-v-62def220>`);
        if (unref(osgoStore).applicantVerifying) {
          _push(`<span class="spinner" data-v-62def220></span>`);
        } else {
          _push(`<!--[--><i class="bx bx-check-circle" data-v-62def220></i><span data-v-62def220>${ssrInterpolate(unref(osgoStore).applicantVerified ? unref(t)("step3.verified") : unref(t)("step3.verifyApplicant"))}</span><!--]-->`);
        }
        _push(`</button></div>`);
        if (unref(osgoStore).applicantVerified && applicant.value.id) {
          _push(`<div class="info-card success" data-v-62def220><div class="card-header" data-v-62def220><i class="bx bx-check-circle" data-v-62def220></i><span data-v-62def220>${ssrInterpolate(unref(t)("step3.applicantFound"))}</span></div><div class="card-content" data-v-62def220><div class="info-grid" data-v-62def220><div class="info-item" data-v-62def220><div class="info-label" data-v-62def220>${ssrInterpolate(unref(t)("step3.passportIssueDate"))}</div><div class="info-value" data-v-62def220>${ssrInterpolate(applicant.value.passportIssueDate ? unref(formatDisplayDate)(applicant.value.passportIssueDate) : "-")}</div></div><div class="info-item" data-v-62def220><div class="info-label" data-v-62def220>${ssrInterpolate(unref(t)("step3.pinfl"))}</div><div class="info-value" data-v-62def220>${ssrInterpolate(applicant.value.nationalIdentifier || "-")}</div></div><div class="info-item info-item-wide" data-v-62def220><div class="info-label" data-v-62def220>${ssrInterpolate(unref(t)("step3.issuedBy"))}</div><div class="info-value" data-v-62def220>${ssrInterpolate(applicant.value.passportIssuedBy || "-")}</div></div><div class="info-item" data-v-62def220><div class="info-label" data-v-62def220>${ssrInterpolate(unref(t)("step3.lastName"))}</div><div class="info-value" data-v-62def220>${ssrInterpolate(applicant.value.lastName || "-")}</div></div><div class="info-item" data-v-62def220><div class="info-label" data-v-62def220>${ssrInterpolate(unref(t)("step3.firstName"))}</div><div class="info-value" data-v-62def220>${ssrInterpolate(applicant.value.firstName || "-")}</div></div><div class="info-item" data-v-62def220><div class="info-label" data-v-62def220>${ssrInterpolate(unref(t)("step3.middleName"))}</div><div class="info-value" data-v-62def220>${ssrInterpolate(applicant.value.middleName || "-")}</div></div><div class="info-item" data-v-62def220><div class="info-label" data-v-62def220>${ssrInterpolate(unref(t)("step3.gender"))}</div><div class="info-value" data-v-62def220>${ssrInterpolate(applicant.value.gender ? unref(formatGender)(applicant.value.gender, unref(locale).value) : "-")}</div></div><div class="info-item" data-v-62def220><div class="info-label" data-v-62def220>${ssrInterpolate(unref(t)("step3.country"))}</div><div class="info-value" data-v-62def220>${ssrInterpolate(((_d = applicant.value.country) == null ? void 0 : _d.langValue1) || "-")}</div></div><div class="info-item" data-v-62def220><div class="info-label" data-v-62def220>${ssrInterpolate(unref(t)("step3.region"))}</div><div class="info-value" data-v-62def220>${ssrInterpolate(((_e = applicant.value.region) == null ? void 0 : _e.langValue1) || "-")}</div></div><div class="info-item" data-v-62def220><div class="info-label" data-v-62def220>${ssrInterpolate(unref(t)("step3.district"))}</div><div class="info-value" data-v-62def220>${ssrInterpolate(((_f = applicant.value.district) == null ? void 0 : _f.langValue1) || "-")}</div></div><div class="info-item" data-v-62def220><div class="info-label" data-v-62def220>${ssrInterpolate(unref(t)("step3.street"))}</div><div class="info-value" data-v-62def220>${ssrInterpolate(applicant.value.street || "-")}</div></div></div></div></div>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div></div>`);
    };
  }
});
const _sfc_setup$4 = _sfc_main$4.setup;
_sfc_main$4.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/steps/Step3Owner.vue");
  return _sfc_setup$4 ? _sfc_setup$4(props, ctx) : void 0;
};
const Step3Owner = /* @__PURE__ */ _export_sfc(_sfc_main$4, [["__scopeId", "data-v-62def220"]]);
const _sfc_main$3 = /* @__PURE__ */ defineComponent({
  __name: "Step4Drivers",
  __ssrInlineRender: true,
  setup(__props) {
    const osgoStore = useOsgoStore();
    const metaStore = useMetaStore();
    useTelegramWebApp();
    const { t, locale } = useI18n();
    const osgo = computed(() => osgoStore.osgo);
    const owner = computed(() => osgoStore.owner);
    const applicant = computed(() => osgoStore.applicant);
    const hasOwnerAsDriver = computed(() => {
      return osgoStore.hasDriver(
        owner.value.passportSeries,
        owner.value.passportNumber,
        owner.value.birthDate
      );
    });
    const hasApplicantAsDriver = computed(() => {
      return osgoStore.hasDriver(
        applicant.value.passportSeries,
        applicant.value.passportNumber,
        applicant.value.birthDate
      );
    });
    const canVerifyDriver = (driver) => {
      return !!(driver.passportSeries && driver.passportNumber && driver.birthDate);
    };
    return (_ctx, _push, _parent, _attrs) => {
      const _component_InputField = __nuxt_component_0;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "step-container" }, _attrs))} data-v-d2bd1c0c><div class="step-header" data-v-d2bd1c0c><h2 class="step-title" data-v-d2bd1c0c>\u0418\u043D\u0444\u043E\u0440\u043C\u0430\u0446\u0438\u044F \u043E \u0432\u043E\u0434\u0438\u0442\u0435\u043B\u044F\u0445</h2><p class="step-description" data-v-d2bd1c0c> \u0414\u043E\u0431\u0430\u0432\u044C\u0442\u0435 \u0432\u043E\u0434\u0438\u0442\u0435\u043B\u0435\u0439, \u0434\u043E\u043F\u0443\u0449\u0435\u043D\u043D\u044B\u0445 \u043A \u0443\u043F\u0440\u0430\u0432\u043B\u0435\u043D\u0438\u044E \u0442\u0440\u0430\u043D\u0441\u043F\u043E\u0440\u0442\u043D\u044B\u043C \u0441\u0440\u0435\u0434\u0441\u0442\u0432\u043E\u043C </p></div><div class="step-content" data-v-d2bd1c0c>`);
      if (!osgo.value.driversLimited) {
        _push(`<div class="info-card" data-v-d2bd1c0c><i class="bx bx-info-circle" data-v-d2bd1c0c></i><div data-v-d2bd1c0c><div class="info-title" data-v-d2bd1c0c>\u041D\u0435\u043E\u0433\u0440\u0430\u043D\u0438\u0447\u0435\u043D\u043D\u043E\u0435 \u043A\u043E\u043B\u0438\u0447\u0435\u0441\u0442\u0432\u043E \u0432\u043E\u0434\u0438\u0442\u0435\u043B\u0435\u0439</div><div class="info-text" data-v-d2bd1c0c> \u0412\u044B \u0432\u044B\u0431\u0440\u0430\u043B\u0438 \u043F\u043E\u043B\u0438\u0441 \u0431\u0435\u0437 \u043E\u0433\u0440\u0430\u043D\u0438\u0447\u0435\u043D\u0438\u044F \u043F\u043E \u043A\u043E\u043B\u0438\u0447\u0435\u0441\u0442\u0432\u0443 \u0432\u043E\u0434\u0438\u0442\u0435\u043B\u0435\u0439. \u0414\u043E\u0431\u0430\u0432\u043B\u0435\u043D\u0438\u0435 \u0432\u043E\u0434\u0438\u0442\u0435\u043B\u0435\u0439 \u043D\u0435 \u0442\u0440\u0435\u0431\u0443\u0435\u0442\u0441\u044F. </div></div></div>`);
      } else {
        _push(`<!--[--><div class="actions-row" data-v-d2bd1c0c><button type="button" class="btn btn-primary-outlined"${ssrIncludeBooleanAttr(!unref(osgoStore).isEditable) ? " disabled" : ""} data-v-d2bd1c0c><i class="bx bx-plus" data-v-d2bd1c0c></i><span data-v-d2bd1c0c>\u0414\u043E\u0431\u0430\u0432\u0438\u0442\u044C \u0432\u043E\u0434\u0438\u0442\u0435\u043B\u044F</span></button>`);
        if (!hasOwnerAsDriver.value) {
          _push(`<button type="button" class="btn btn-primary-outlined"${ssrIncludeBooleanAttr(!unref(osgoStore).isEditable || !unref(osgoStore).ownerVerified) ? " disabled" : ""} data-v-d2bd1c0c><i class="bx bx-user" data-v-d2bd1c0c></i><span data-v-d2bd1c0c>\u0412\u043B\u0430\u0434\u0435\u043B\u0435\u0446 - \u0432\u043E\u0434\u0438\u0442\u0435\u043B\u044C</span></button>`);
        } else {
          _push(`<!---->`);
        }
        if (!osgo.value.applicantIsOwner && !hasApplicantAsDriver.value) {
          _push(`<button type="button" class="btn btn-primary-outlined"${ssrIncludeBooleanAttr(!unref(osgoStore).isEditable || !unref(osgoStore).applicantVerified) ? " disabled" : ""} data-v-d2bd1c0c><i class="bx bx-user" data-v-d2bd1c0c></i><span data-v-d2bd1c0c>\u0421\u0442\u0440\u0430\u0445\u043E\u0432\u0430\u0442\u0435\u043B\u044C - \u0432\u043E\u0434\u0438\u0442\u0435\u043B\u044C</span></button>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</div>`);
        if (osgo.value.drivers.length === 0) {
          _push(`<div class="empty-state" data-v-d2bd1c0c><i class="bx bx-user-plus" data-v-d2bd1c0c></i><p data-v-d2bd1c0c>\u0414\u043E\u0431\u0430\u0432\u044C\u0442\u0435 \u0445\u043E\u0442\u044F \u0431\u044B \u043E\u0434\u043D\u043E\u0433\u043E \u0432\u043E\u0434\u0438\u0442\u0435\u043B\u044F</p></div>`);
        } else {
          _push(`<div class="drivers-list" data-v-d2bd1c0c><!--[-->`);
          ssrRenderList(osgo.value.drivers, (driver, index2) => {
            var _a;
            _push(`<div class="driver-card" data-v-d2bd1c0c><div class="driver-header" data-v-d2bd1c0c><div class="driver-number" data-v-d2bd1c0c><i class="bx bx-user" data-v-d2bd1c0c></i><span data-v-d2bd1c0c>\u0412\u043E\u0434\u0438\u0442\u0435\u043B\u044C ${ssrInterpolate(index2 + 1)}</span></div>`);
            if (unref(osgoStore).isEditable) {
              _push(`<button type="button" class="btn-icon btn-danger" data-v-d2bd1c0c><i class="bx bx-trash" data-v-d2bd1c0c></i></button>`);
            } else {
              _push(`<!---->`);
            }
            _push(`</div><div class="driver-content" data-v-d2bd1c0c>`);
            _push(ssrRenderComponent(_component_InputField, {
              modelValue: driver.passportSeries,
              "onUpdate:modelValue": ($event) => driver.passportSeries = $event,
              label: "\u0421\u0435\u0440\u0438\u044F \u043F\u0430\u0441\u043F\u043E\u0440\u0442\u0430",
              placeholder: "AA",
              disabled: !unref(osgoStore).isEditable,
              "max-length": 2,
              uppercase: "",
              required: ""
            }, null, _parent));
            _push(ssrRenderComponent(_component_InputField, {
              modelValue: driver.passportNumber,
              "onUpdate:modelValue": ($event) => driver.passportNumber = $event,
              label: "\u041D\u043E\u043C\u0435\u0440 \u043F\u0430\u0441\u043F\u043E\u0440\u0442\u0430",
              placeholder: "1234567",
              disabled: !unref(osgoStore).isEditable,
              "input-mode": "numeric",
              "max-length": 7,
              required: ""
            }, null, _parent));
            _push(ssrRenderComponent(_component_InputField, {
              modelValue: driver.birthDate,
              "onUpdate:modelValue": ($event) => driver.birthDate = $event,
              label: "\u0414\u0430\u0442\u0430 \u0440\u043E\u0436\u0434\u0435\u043D\u0438\u044F",
              type: "text",
              "date-mask": "",
              placeholder: "DD-MM-YYYY",
              disabled: !unref(osgoStore).isEditable,
              required: ""
            }, null, _parent));
            _push(`<button type="button" class="btn btn-primary-outlined w-full"${ssrIncludeBooleanAttr(!canVerifyDriver(driver)) ? " disabled" : ""} data-v-d2bd1c0c><i class="bx bx-check-circle" data-v-d2bd1c0c></i><span data-v-d2bd1c0c>${ssrInterpolate(driver.name ? "\u041F\u0440\u043E\u0432\u0435\u0440\u0435\u043D\u043E" : "\u041F\u0440\u043E\u0432\u0435\u0440\u0438\u0442\u044C")}</span></button>`);
            if (driver.id) {
              _push(`<div class="driver-info" data-v-d2bd1c0c><div class="driver-info-grid" data-v-d2bd1c0c>`);
              if (driver.passportIssueDate) {
                _push(`<div class="info-item" data-v-d2bd1c0c><div class="info-label" data-v-d2bd1c0c>${ssrInterpolate(unref(t)("step3.passportIssueDate"))}</div><div class="info-value" data-v-d2bd1c0c>${ssrInterpolate(unref(formatDisplayDate)(driver.passportIssueDate))}</div></div>`);
              } else {
                _push(`<!---->`);
              }
              if (driver.pinfl) {
                _push(`<div class="info-item" data-v-d2bd1c0c><div class="info-label" data-v-d2bd1c0c>${ssrInterpolate(unref(t)("step3.pinfl"))}</div><div class="info-value" data-v-d2bd1c0c>${ssrInterpolate(driver.pinfl)}</div></div>`);
              } else {
                _push(`<!---->`);
              }
              if (driver.passportIssuedBy) {
                _push(`<div class="info-item info-item-wide" data-v-d2bd1c0c><div class="info-label" data-v-d2bd1c0c>${ssrInterpolate(unref(t)("step3.issuedBy"))}</div><div class="info-value" data-v-d2bd1c0c>${ssrInterpolate(driver.passportIssuedBy)}</div></div>`);
              } else {
                _push(`<!---->`);
              }
              if (driver.lastName) {
                _push(`<div class="info-item" data-v-d2bd1c0c><div class="info-label" data-v-d2bd1c0c>${ssrInterpolate(unref(t)("step3.lastName"))}</div><div class="info-value" data-v-d2bd1c0c>${ssrInterpolate(driver.lastName)}</div></div>`);
              } else {
                _push(`<!---->`);
              }
              if (driver.firstName) {
                _push(`<div class="info-item" data-v-d2bd1c0c><div class="info-label" data-v-d2bd1c0c>${ssrInterpolate(unref(t)("step3.firstName"))}</div><div class="info-value" data-v-d2bd1c0c>${ssrInterpolate(driver.firstName)}</div></div>`);
              } else {
                _push(`<!---->`);
              }
              if (driver.middleName) {
                _push(`<div class="info-item" data-v-d2bd1c0c><div class="info-label" data-v-d2bd1c0c>${ssrInterpolate(unref(t)("step3.middleName"))}</div><div class="info-value" data-v-d2bd1c0c>${ssrInterpolate(driver.middleName)}</div></div>`);
              } else {
                _push(`<!---->`);
              }
              if (driver.gender) {
                _push(`<div class="info-item" data-v-d2bd1c0c><div class="info-label" data-v-d2bd1c0c>${ssrInterpolate(unref(t)("step3.gender"))}</div><div class="info-value" data-v-d2bd1c0c>${ssrInterpolate(unref(formatGender)(driver.gender, unref(locale).value))}</div></div>`);
              } else {
                _push(`<!---->`);
              }
              if (driver.address) {
                _push(`<div class="info-item info-item-full" data-v-d2bd1c0c><div class="info-label" data-v-d2bd1c0c>${ssrInterpolate(unref(t)("step3.address"))}</div><div class="info-value" data-v-d2bd1c0c>${ssrInterpolate(driver.address)}</div></div>`);
              } else {
                _push(`<!---->`);
              }
              if (driver.licenseSeries) {
                _push(`<div class="info-item" data-v-d2bd1c0c><div class="info-label" data-v-d2bd1c0c>${ssrInterpolate(unref(t)("step4.licenseSeries"))}</div><div class="info-value" data-v-d2bd1c0c>${ssrInterpolate(driver.licenseSeries)}</div></div>`);
              } else {
                _push(`<!---->`);
              }
              if (driver.licenseNumber) {
                _push(`<div class="info-item" data-v-d2bd1c0c><div class="info-label" data-v-d2bd1c0c>${ssrInterpolate(unref(t)("step4.licenseNumber"))}</div><div class="info-value" data-v-d2bd1c0c>${ssrInterpolate(driver.licenseNumber)}</div></div>`);
              } else {
                _push(`<!---->`);
              }
              if (driver.licenseDate) {
                _push(`<div class="info-item" data-v-d2bd1c0c><div class="info-label" data-v-d2bd1c0c>${ssrInterpolate(unref(t)("step4.licenseDate"))}</div><div class="info-value" data-v-d2bd1c0c>${ssrInterpolate(unref(formatDisplayDate)(driver.licenseDate))}</div></div>`);
              } else {
                _push(`<!---->`);
              }
              if (unref(metaStore).relatives.length > 0) {
                _push(`<div class="info-item" data-v-d2bd1c0c><div class="info-label" data-v-d2bd1c0c>${ssrInterpolate(unref(t)("step4.relationship"))}</div>`);
                if (unref(osgoStore).isEditable) {
                  _push(`<select${ssrRenderAttr("value", ((_a = driver.relative) == null ? void 0 : _a.id) || "")} class="info-select" data-v-d2bd1c0c><option value="" data-v-d2bd1c0c>${ssrInterpolate(unref(t)("step4.selectRelationship"))}</option><!--[-->`);
                  ssrRenderList(unref(metaStore).relatives, (relative) => {
                    _push(`<option${ssrRenderAttr("value", relative.id)} data-v-d2bd1c0c>${ssrInterpolate(unref(getLocalizedName)(relative))}</option>`);
                  });
                  _push(`<!--]--></select>`);
                } else {
                  _push(`<div class="info-value" data-v-d2bd1c0c>${ssrInterpolate(driver.relative ? unref(getLocalizedName)(driver.relative) : "-")}</div>`);
                }
                _push(`</div>`);
              } else {
                _push(`<!---->`);
              }
              _push(`</div></div>`);
            } else {
              _push(`<!---->`);
            }
            _push(`</div></div>`);
          });
          _push(`<!--]--></div>`);
        }
        _push(`<!--]-->`);
      }
      _push(`</div></div>`);
    };
  }
});
const _sfc_setup$3 = _sfc_main$3.setup;
_sfc_main$3.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/steps/Step4Drivers.vue");
  return _sfc_setup$3 ? _sfc_setup$3(props, ctx) : void 0;
};
const Step4Drivers = /* @__PURE__ */ _export_sfc(_sfc_main$3, [["__scopeId", "data-v-d2bd1c0c"]]);
const _sfc_main$2 = /* @__PURE__ */ defineComponent({
  __name: "Step5Summary",
  __ssrInlineRender: true,
  setup(__props) {
    const formatPriceNumber = (value) => {
      return value.toString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1 ");
    };
    const osgoStore = useOsgoStore();
    const metaStore = useMetaStore();
    useTelegramWebApp();
    useApi();
    const osgo = computed(() => osgoStore.osgo);
    const owner = computed(() => osgoStore.owner);
    const applicant = computed(() => osgoStore.applicant);
    computed(() => osgoStore.fundData);
    ref(false);
    const phone = computed({
      get: () => {
        const party = osgo.value.applicantIsOwner ? owner.value : applicant.value;
        return party.phone || "";
      },
      set: (value) => {
        if (osgo.value.applicantIsOwner) {
          owner.value.phone = value;
          osgo.value.party = owner.value;
        } else {
          applicant.value.phone = value;
          osgo.value.party = applicant.value;
        }
      }
    });
    const { locale } = useI18n();
    const getPeriodName = () => {
      if (!osgo.value.period) return "-";
      return metaStore.getLocalizedName(osgo.value.period, locale.value || "uz");
    };
    const getAreaName = () => {
      if (!osgo.value.drivedArea) return "-";
      return metaStore.getLocalizedName(osgo.value.drivedArea, locale.value || "uz");
    };
    return (_ctx, _push, _parent, _attrs) => {
      var _a, _b, _c, _d;
      const _component_InputField = __nuxt_component_0;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "step-container" }, _attrs))} data-v-832f148c><div class="step-header" data-v-832f148c><h2 class="step-title" data-v-832f148c>\u041F\u043E\u0434\u0442\u0432\u0435\u0440\u0436\u0434\u0435\u043D\u0438\u0435</h2><p class="step-description" data-v-832f148c> \u041F\u0440\u043E\u0432\u0435\u0440\u044C\u0442\u0435 \u0434\u0430\u043D\u043D\u044B\u0435 \u043F\u043E\u043B\u0438\u0441\u0430 \u043F\u0435\u0440\u0435\u0434 \u043E\u0444\u043E\u0440\u043C\u043B\u0435\u043D\u0438\u0435\u043C </p></div><div class="step-content" data-v-832f148c><div class="summary-section" data-v-832f148c><h3 class="section-title" data-v-832f148c><i class="bx bx-file-blank" data-v-832f148c></i><span data-v-832f148c>\u0418\u043D\u0444\u043E\u0440\u043C\u0430\u0446\u0438\u044F \u043E \u0441\u0442\u0440\u0430\u0445\u043E\u0432\u043A\u0435</span></h3><div class="summary-card" data-v-832f148c><div class="card-title" data-v-832f148c>\u0421\u043E\u0431\u0441\u0442\u0432\u0435\u043D\u043D\u0438\u043A</div><div class="card-content" data-v-832f148c><div class="info-row" data-v-832f148c><span class="info-value-full" data-v-832f148c>${ssrInterpolate(owner.value.name || "-")}${ssrInterpolate(owner.value.birthDate ? ` (${owner.value.birthDate})` : "")}</span></div></div></div><div class="summary-card" data-v-832f148c><div class="card-title" data-v-832f148c>\u0417\u0430\u044F\u0432\u0438\u0442\u0435\u043B\u044C</div><div class="card-content" data-v-832f148c><div class="info-row" data-v-832f148c><span class="info-value-full" data-v-832f148c>${ssrInterpolate((osgo.value.applicantIsOwner ? owner.value : applicant.value).name || "-")}${ssrInterpolate((osgo.value.applicantIsOwner ? owner.value : applicant.value).birthDate ? ` (${(osgo.value.applicantIsOwner ? owner.value : applicant.value).birthDate})` : "")}</span></div></div></div><div class="summary-card" data-v-832f148c><div class="card-title" data-v-832f148c>\u0422\u0440\u0430\u043D\u0441\u043F\u043E\u0440\u0442\u043D\u043E\u0435 \u0441\u0440\u0435\u0434\u0441\u0442\u0432\u043E</div><div class="card-content" data-v-832f148c><div class="info-row" data-v-832f148c><span class="info-value-full" data-v-832f148c>${ssrInterpolate(((_a = osgo.value.vehicle) == null ? void 0 : _a.modelName) || ((_b = osgo.value.vehicle) == null ? void 0 : _b.model) || "-")} ${ssrInterpolate(((_c = osgo.value.vehicle) == null ? void 0 : _c.govNumber) ? ` (${osgo.value.vehicle.govNumber})` : "")}</span></div></div></div><div class="summary-card" data-v-832f148c><div class="card-title" data-v-832f148c>\u0423\u0441\u043B\u043E\u0432\u0438\u044F \u0441\u0442\u0440\u0430\u0445\u043E\u0432\u0430\u043D\u0438\u044F</div><div class="card-content" data-v-832f148c><div class="info-row" data-v-832f148c><span class="info-value-full" data-v-832f148c>${ssrInterpolate(getPeriodName())}</span></div><div class="info-row" data-v-832f148c><span class="info-value-full" data-v-832f148c>${ssrInterpolate(getAreaName())}</span></div><div class="info-row" data-v-832f148c><span class="info-value-full" data-v-832f148c>${ssrInterpolate(osgo.value.driversLimited ? `\u041E\u0433\u0440\u0430\u043D\u0438\u0447\u0435\u043D\u043D\u043E (${((_d = osgo.value.drivers) == null ? void 0 : _d.length) || 0})` : "\u041D\u0435 \u043E\u0433\u0440\u0430\u043D\u0438\u0447\u0435\u043D\u043E")}</span></div></div></div><div class="summary-card" data-v-832f148c><div class="card-title" data-v-832f148c>\u0421\u0442\u0440\u0430\u0445\u043E\u0432\u0430\u044F \u0441\u0443\u043C\u043C\u0430</div><div class="card-content" data-v-832f148c><div class="info-row" data-v-832f148c><span class="info-value-full" data-v-832f148c>${ssrInterpolate(formatPriceNumber(unref(COMPENSATION)))} \u0441\u0443\u043C</span></div></div></div></div><div class="summary-section" data-v-832f148c><h3 class="section-title" data-v-832f148c><i class="bx bx-phone" data-v-832f148c></i><span data-v-832f148c>\u041A\u043E\u043D\u0442\u0430\u043A\u0442\u043D\u044B\u0435 \u0434\u0430\u043D\u043D\u044B\u0435</span></h3><div class="form-section" data-v-832f148c>`);
      _push(ssrRenderComponent(_component_InputField, {
        modelValue: phone.value,
        "onUpdate:modelValue": ($event) => phone.value = $event,
        label: "\u041D\u043E\u043C\u0435\u0440 \u0442\u0435\u043B\u0435\u0444\u043E\u043D\u0430",
        placeholder: "+998 90 123 45 67",
        type: "tel",
        icon: "bx bx-phone",
        "input-mode": "tel",
        disabled: !unref(osgoStore).isEditable,
        required: ""
      }, null, _parent));
      _push(`</div><div class="form-section" data-v-832f148c>`);
      _push(ssrRenderComponent(_component_InputField, {
        modelValue: osgo.value.contractStartDate,
        "onUpdate:modelValue": ($event) => osgo.value.contractStartDate = $event,
        label: "\u0414\u0430\u0442\u0430 \u043D\u0430\u0447\u0430\u043B\u0430 \u0434\u0435\u0439\u0441\u0442\u0432\u0438\u044F \u043F\u043E\u043B\u0438\u0441\u0430",
        type: "text",
        "date-mask": "",
        placeholder: "DD-MM-YYYY",
        icon: "bx bx-calendar",
        disabled: !unref(osgoStore).isEditable,
        required: ""
      }, null, _parent));
      _push(`</div>`);
      if (osgo.value.contractEndDate) {
        _push(`<div class="form-section" data-v-832f148c>`);
        _push(ssrRenderComponent(_component_InputField, {
          "model-value": osgo.value.contractEndDate,
          label: "\u0414\u0430\u0442\u0430 \u043E\u043A\u043E\u043D\u0447\u0430\u043D\u0438\u044F \u0434\u0435\u0439\u0441\u0442\u0432\u0438\u044F \u043F\u043E\u043B\u0438\u0441\u0430",
          type: "text",
          "date-mask": "",
          placeholder: "DD-MM-YYYY",
          icon: "bx bx-calendar",
          disabled: ""
        }, null, _parent));
        _push(`</div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div><div class="premium-section" data-v-832f148c><div class="premium-card-large" data-v-832f148c><div class="premium-header" data-v-832f148c><i class="bx bx-shield-alt-2" data-v-832f148c></i><span data-v-832f148c>\u0421\u0442\u0440\u0430\u0445\u043E\u0432\u0430\u044F \u043F\u0440\u0435\u043C\u0438\u044F</span></div><div class="premium-amount-large" data-v-832f148c>${ssrInterpolate(unref(formatPrice)(unref(osgoStore).calculatedPremium))} \u0441\u0443\u043C </div></div></div></div></div>`);
    };
  }
});
const _sfc_setup$2 = _sfc_main$2.setup;
_sfc_main$2.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/steps/Step5Summary.vue");
  return _sfc_setup$2 ? _sfc_setup$2(props, ctx) : void 0;
};
const Step5Summary = /* @__PURE__ */ _export_sfc(_sfc_main$2, [["__scopeId", "data-v-832f148c"]]);
const _sfc_main$1 = /* @__PURE__ */ defineComponent({
  __name: "Step6Payment",
  __ssrInlineRender: true,
  setup(__props) {
    const osgoStore = useOsgoStore();
    useTelegramWebApp();
    useApi();
    const { t } = useI18n();
    const osgo = computed(() => osgoStore.osgo);
    const fundData = computed(() => osgoStore.fundData);
    computed(() => {
      const party = osgo.value.applicantIsOwner ? osgoStore.owner : osgoStore.applicant;
      return party.phone || "";
    });
    const checkingStatus = ref(false);
    const statusError = ref(null);
    const statusCheckSeconds = ref(0);
    const paymentStatusText = ref(null);
    const selectedPaymentMethod = computed({
      get: () => osgoStore.selectedPaymentMethod,
      set: (value) => {
        osgoStore.selectedPaymentMethod = value;
      }
    });
    const statusClass = computed(() => {
      if (!paymentStatusText.value) return "";
      if (paymentStatusText.value.toLowerCase().includes("\u043E\u043F\u043B\u0430\u0447\u0435\u043D") || paymentStatusText.value.toLowerCase().includes("\u0443\u0441\u043F\u0435\u0448\u043D\u043E")) {
        return "status-success";
      }
      if (paymentStatusText.value.toLowerCase().includes("\u043E\u0448\u0438\u0431\u043A\u0430") || paymentStatusText.value.toLowerCase().includes("\u043D\u0435")) {
        return "status-error";
      }
      return "status-info";
    });
    const statusIcon = computed(() => {
      if (statusClass.value === "status-success") {
        return "bx bx-check-circle";
      }
      if (statusClass.value === "status-error") {
        return "bx bx-error-circle";
      }
      return "bx bx-info-circle";
    });
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "step-container" }, _attrs))} data-v-f6910a80><div class="step-header" data-v-f6910a80><h2 class="step-title" data-v-f6910a80>\u041E\u043F\u043B\u0430\u0442\u0430</h2><p class="step-description" data-v-f6910a80> \u0412\u044B\u0431\u0435\u0440\u0438\u0442\u0435 \u0441\u043F\u043E\u0441\u043E\u0431 \u043E\u043F\u043B\u0430\u0442\u044B \u0434\u043B\u044F \u0437\u0430\u0432\u0435\u0440\u0448\u0435\u043D\u0438\u044F \u043E\u0444\u043E\u0440\u043C\u043B\u0435\u043D\u0438\u044F \u043F\u043E\u043B\u0438\u0441\u0430 </p></div><div class="step-content" data-v-f6910a80><div class="premium-section" data-v-f6910a80><div class="premium-card-large" data-v-f6910a80><div class="premium-header" data-v-f6910a80><i class="bx bx-shield-alt-2" data-v-f6910a80></i><span data-v-f6910a80>\u0421\u0442\u0440\u0430\u0445\u043E\u0432\u0430\u044F \u043F\u0440\u0435\u043C\u0438\u044F</span></div><div class="premium-amount-large" data-v-f6910a80>${ssrInterpolate(unref(formatPrice)(unref(osgoStore).calculatedPremium))} \u0441\u0443\u043C </div></div></div><div class="payment-section" data-v-f6910a80><h3 class="section-title" data-v-f6910a80><i class="bx bx-credit-card" data-v-f6910a80></i><span data-v-f6910a80>\u0412\u044B\u0431\u0435\u0440\u0438\u0442\u0435 \u0441\u043F\u043E\u0441\u043E\u0431 \u043E\u043F\u043B\u0430\u0442\u044B</span></h3><div class="payment-buttons" data-v-f6910a80><button type="button" class="${ssrRenderClass([{ "payment-btn-selected": selectedPaymentMethod.value === "payme" }, "payment-btn payme"])}"${ssrIncludeBooleanAttr(checkingStatus.value) ? " disabled" : ""} data-v-f6910a80><div class="payment-icon" data-v-f6910a80>\u{1F4B3}</div><div class="payment-name" data-v-f6910a80>Payme</div>`);
      if (selectedPaymentMethod.value === "payme") {
        _push(`<div class="payment-selected-indicator" data-v-f6910a80><i class="bx bx-check-circle" data-v-f6910a80></i></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</button><button type="button" class="${ssrRenderClass([{ "payment-btn-selected": selectedPaymentMethod.value === "click" }, "payment-btn click"])}"${ssrIncludeBooleanAttr(checkingStatus.value) ? " disabled" : ""} data-v-f6910a80><div class="payment-icon" data-v-f6910a80>\u{1F535}</div><div class="payment-name" data-v-f6910a80>Click</div>`);
      if (selectedPaymentMethod.value === "click") {
        _push(`<div class="payment-selected-indicator" data-v-f6910a80><i class="bx bx-check-circle" data-v-f6910a80></i></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</button><button type="button" class="${ssrRenderClass([{ "payment-btn-selected": selectedPaymentMethod.value === "uzum" }, "payment-btn uzum"])}"${ssrIncludeBooleanAttr(checkingStatus.value) ? " disabled" : ""} data-v-f6910a80><div class="payment-icon" data-v-f6910a80>\u{1F7E3}</div><div class="payment-name" data-v-f6910a80>Uzum</div>`);
      if (selectedPaymentMethod.value === "uzum") {
        _push(`<div class="payment-selected-indicator" data-v-f6910a80><i class="bx bx-check-circle" data-v-f6910a80></i></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</button></div></div><div class="status-section" data-v-f6910a80><button type="button" class="btn btn-primary-outlined w-full"${ssrIncludeBooleanAttr(!!statusCheckSeconds.value || checkingStatus.value || !osgo.value.id) ? " disabled" : ""} data-v-f6910a80><i class="bx bx-refresh" data-v-f6910a80></i><span data-v-f6910a80>${ssrInterpolate(unref(t)("step5.checkStatus"))}</span>`);
      if (statusCheckSeconds.value) {
        _push(`<span class="ml-1" data-v-f6910a80>(${ssrInterpolate(statusCheckSeconds.value)})</span>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</button>`);
      if (statusError.value) {
        _push(`<div class="error-message mt-2" data-v-f6910a80><i class="bx bx-error-circle" data-v-f6910a80></i><span data-v-f6910a80>${ssrInterpolate(statusError.value)}</span></div>`);
      } else {
        _push(`<!---->`);
      }
      if (paymentStatusText.value) {
        _push(`<div class="${ssrRenderClass([statusClass.value, "status-text"])}" data-v-f6910a80><i class="${ssrRenderClass(statusIcon.value)}" data-v-f6910a80></i><span data-v-f6910a80>${ssrInterpolate(paymentStatusText.value)}</span></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div>`);
      if (osgo.value.id && fundData.value && fundData.value.seria) {
        _push(`<div class="success-card" data-v-f6910a80><div class="success-icon" data-v-f6910a80><i class="bx bx-check-circle" data-v-f6910a80></i></div><h3 class="success-title" data-v-f6910a80>\u041F\u043E\u043B\u0438\u0441 \u043E\u0444\u043E\u0440\u043C\u043B\u0435\u043D!</h3><p class="success-description" data-v-f6910a80> \u0412\u0430\u0448 \u043F\u043E\u043B\u0438\u0441 \u041E\u0421\u0413\u041E \u0443\u0441\u043F\u0435\u0448\u043D\u043E \u043E\u0444\u043E\u0440\u043C\u043B\u0435\u043D \u0438 \u043E\u043F\u043B\u0430\u0447\u0435\u043D </p><div class="policy-details" data-v-f6910a80><div class="policy-row" data-v-f6910a80><span class="policy-label" data-v-f6910a80>\u0421\u0435\u0440\u0438\u044F:</span><span class="policy-value" data-v-f6910a80>${ssrInterpolate(fundData.value.seria)}</span></div><div class="policy-row" data-v-f6910a80><span class="policy-label" data-v-f6910a80>\u041D\u043E\u043C\u0435\u0440:</span><span class="policy-value" data-v-f6910a80>${ssrInterpolate(fundData.value.number)}</span></div></div></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div></div>`);
    };
  }
});
const _sfc_setup$1 = _sfc_main$1.setup;
_sfc_main$1.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/steps/Step6Payment.vue");
  return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
const Step6Payment = /* @__PURE__ */ _export_sfc(_sfc_main$1, [["__scopeId", "data-v-f6910a80"]]);
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "index",
  __ssrInlineRender: true,
  setup(__props) {
    const osgoStore = useOsgoStore();
    useMetaStore();
    useTelegramWebApp();
    useHead({
      title: "OSGO Insurance - ECCLIVO",
      meta: [
        {
          name: "description",
          content: "Purchase OSGO insurance policy through Telegram"
        }
      ]
    });
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "min-h-screen flex flex-col" }, _attrs))} data-v-8561f7bb><header class="fixed top-0 left-0 right-0 bg-white shadow-sm z-50" style="${ssrRenderStyle({ "height": "60px" })}" data-v-8561f7bb>`);
      _push(ssrRenderComponent(AppHeader, null, null, _parent));
      _push(`</header><main class="flex-1 overflow-y-auto" style="${ssrRenderStyle({ "margin-top": "140px", "margin-bottom": "70px", "padding": "24px 16px" })}" data-v-8561f7bb><div class="max-w-3xl mx-auto" data-v-8561f7bb>`);
      if (unref(osgoStore).currentStep === unref(STEPS).PARAMS) {
        _push(ssrRenderComponent(Step1Params, {
          key: unref(STEPS).PARAMS
        }, null, _parent));
      } else if (unref(osgoStore).currentStep === unref(STEPS).VEHICLE) {
        _push(ssrRenderComponent(Step2Vehicle, {
          key: unref(STEPS).VEHICLE
        }, null, _parent));
      } else if (unref(osgoStore).currentStep === unref(STEPS).OWNER) {
        _push(ssrRenderComponent(Step3Owner, {
          key: unref(STEPS).OWNER
        }, null, _parent));
      } else if (unref(osgoStore).currentStep === unref(STEPS).DRIVERS) {
        _push(ssrRenderComponent(Step4Drivers, {
          key: unref(STEPS).DRIVERS
        }, null, _parent));
      } else if (unref(osgoStore).currentStep === unref(STEPS).SUMMARY) {
        _push(ssrRenderComponent(Step5Summary, {
          key: unref(STEPS).SUMMARY
        }, null, _parent));
      } else if (unref(osgoStore).currentStep === unref(STEPS).PAYMENT) {
        _push(ssrRenderComponent(Step6Payment, {
          key: unref(STEPS).PAYMENT
        }, null, _parent));
      } else {
        _push(`<!---->`);
      }
      _push(`</div></main><footer class="fixed bottom-0 left-0 right-0 bg-white border-t shadow-sm z-50" style="${ssrRenderStyle({ "height": "70px" })}" data-v-8561f7bb>`);
      _push(ssrRenderComponent(AppFooter, null, null, _parent));
      _push(`</footer></div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/index.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const index = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-8561f7bb"]]);

export { index as default };
//# sourceMappingURL=index-DKPuyml6.mjs.map
