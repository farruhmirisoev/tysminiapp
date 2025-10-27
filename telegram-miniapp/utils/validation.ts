// Validation Utilities for ECCLIVO Telegram Mini App

import dayjs from "dayjs";

export interface ValidationResult {
  valid: boolean;
  error?: string;
}

/**
 * Validate government number format (01 W 273 FA)
 * Uzbekistan format: ##X###XX (2 digits, 1 letter, 3 digits, 2 letters)
 * @param govNumber - Government number to validate
 * @returns Validation result
 */
export function validateGovNumber(govNumber: string): ValidationResult {
  if (!govNumber) {
    return { valid: false, error: "Государственный номер обязателен" };
  }

  const cleaned = govNumber.replace(/\s/g, "").toUpperCase();

  // Format: ##X###XX (2 digits, 1 letter, 3 digits, 2 letters)
  // Example: 01W273FA, 01N355OB
  const pattern = /^\d{2}[A-Z]\d{3}[A-Z]{2}$/;

  if (!pattern.test(cleaned)) {
    return {
      valid: false,
      error: "Неверный формат. Пример: 01W273FA",
    };
  }

  return { valid: true };
}

/**
 * Validate tech passport series (2-3 letters)
 * @param series - Tech passport series
 * @returns Validation result
 */
export function validateTechPassportSeries(series: string): ValidationResult {
  if (!series) {
    return { valid: false, error: "Серия техпаспорта обязательна" };
  }

  const cleaned = series.toUpperCase();
  const pattern = /^[A-Z]{2,3}$/;

  if (!pattern.test(cleaned)) {
    return {
      valid: false,
      error: "Серия должна состоять из 2-3 букв",
    };
  }

  return { valid: true };
}

/**
 * Validate tech passport number (digits)
 * @param number - Tech passport number
 * @returns Validation result
 */
export function validateTechPassportNumber(number: string): ValidationResult {
  if (!number) {
    return { valid: false, error: "Номер техпаспорта обязателен" };
  }

  const pattern = /^\d+$/;

  if (!pattern.test(number)) {
    return {
      valid: false,
      error: "Номер должен содержать только цифры",
    };
  }

  return { valid: true };
}

/**
 * Validate passport series (2 letters)
 * @param series - Passport series
 * @returns Validation result
 */
export function validatePassportSeries(series: string): ValidationResult {
  if (!series) {
    return { valid: false, error: "Серия паспорта обязательна" };
  }

  const cleaned = series.toUpperCase();
  const pattern = /^[A-Z]{2}$/;

  if (!pattern.test(cleaned)) {
    return {
      valid: false,
      error: "Серия должна состоять из 2 букв",
    };
  }

  return { valid: true };
}

/**
 * Validate passport number (7 digits)
 * @param number - Passport number
 * @returns Validation result
 */
export function validatePassportNumber(number: string): ValidationResult {
  if (!number) {
    return { valid: false, error: "Номер паспорта обязателен" };
  }

  const pattern = /^\d{7}$/;

  if (!pattern.test(number)) {
    return {
      valid: false,
      error: "Номер должен состоять из 7 цифр",
    };
  }

  return { valid: true };
}

/**
 * Validate birth date
 * @param birthDate - Birth date string (YYYY-MM-DD)
 * @param minAge - Minimum age required (default: 18)
 * @param maxAge - Maximum age allowed (default: 100)
 * @returns Validation result
 */
export function validateBirthDate(
  birthDate: string,
  minAge: number = 18,
  maxAge: number = 100,
): ValidationResult {
  if (!birthDate) {
    return { valid: false, error: "Дата рождения обязательна" };
  }

  const date = dayjs(birthDate);

  if (!date.isValid()) {
    return { valid: false, error: "Неверная дата" };
  }

  const today = dayjs();
  const age = today.diff(date, "year");

  if (age < minAge) {
    return {
      valid: false,
      error: `Минимальный возраст: ${minAge} лет`,
    };
  }

  if (age > maxAge) {
    return {
      valid: false,
      error: `Максимальный возраст: ${maxAge} лет`,
    };
  }

  if (date.isAfter(today)) {
    return {
      valid: false,
      error: "Дата рождения не может быть в будущем",
    };
  }

  return { valid: true };
}

/**
 * Validate phone number (+998 XX XXX XX XX)
 * @param phone - Phone number
 * @returns Validation result
 */
export function validatePhone(phone: string): ValidationResult {
  if (!phone) {
    return { valid: false, error: "Номер телефона обязателен" };
  }

  const cleaned = phone.replace(/\D/g, "");

  // Must be 12 digits starting with 998
  if (cleaned.length !== 12 || !cleaned.startsWith("998")) {
    return {
      valid: false,
      error: "Неверный формат. Пример: +998 90 123 45 67",
    };
  }

  return { valid: true };
}

/**
 * Validate contract start date
 * @param startDate - Contract start date (YYYY-MM-DD)
 * @param maxDaysInFuture - Maximum days in future (default: 30)
 * @returns Validation result
 */
export function validateContractStartDate(
  startDate: string,
  maxDaysInFuture: number = 30,
): ValidationResult {
  if (!startDate) {
    return { valid: false, error: "Дата начала договора обязательна" };
  }

  const date = dayjs(startDate);

  if (!date.isValid()) {
    return { valid: false, error: "Неверная дата" };
  }

  const today = dayjs().startOf("day");
  const selectedDate = date.startOf("day");

  if (selectedDate.isBefore(today)) {
    return {
      valid: false,
      error: "Дата не может быть в прошлом",
    };
  }

  const maxDate = today.add(maxDaysInFuture, "days");

  if (selectedDate.isAfter(maxDate)) {
    return {
      valid: false,
      error: `Дата не может быть больше ${maxDaysInFuture} дней в будущем`,
    };
  }

  return { valid: true };
}

/**
 * Validate required field
 * @param value - Value to validate
 * @param fieldName - Field name for error message
 * @returns Validation result
 */
export function validateRequired(
  value: any,
  fieldName: string = "Поле",
): ValidationResult {
  if (value === null || value === undefined || value === "") {
    return {
      valid: false,
      error: `${fieldName} обязательно`,
    };
  }

  if (typeof value === "string" && value.trim() === "") {
    return {
      valid: false,
      error: `${fieldName} обязательно`,
    };
  }

  return { valid: true };
}

/**
 * Validate email format
 * @param email - Email to validate
 * @returns Validation result
 */
export function validateEmail(email: string): ValidationResult {
  if (!email) {
    return { valid: false, error: "Email обязателен" };
  }

  const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!pattern.test(email)) {
    return {
      valid: false,
      error: "Неверный формат email",
    };
  }

  return { valid: true };
}

/**
 * Validate numeric value
 * @param value - Value to validate
 * @param min - Minimum value
 * @param max - Maximum value
 * @returns Validation result
 */
export function validateNumber(
  value: any,
  min?: number,
  max?: number,
): ValidationResult {
  const num = Number(value);

  if (isNaN(num)) {
    return {
      valid: false,
      error: "Значение должно быть числом",
    };
  }

  if (min !== undefined && num < min) {
    return {
      valid: false,
      error: `Минимальное значение: ${min}`,
    };
  }

  if (max !== undefined && num > max) {
    return {
      valid: false,
      error: `Максимальное значение: ${max}`,
    };
  }

  return { valid: true };
}

/**
 * Validate PINFL (14 digits)
 * @param pinfl - PINFL number
 * @returns Validation result
 */
export function validatePinfl(pinfl: string): ValidationResult {
  if (!pinfl) {
    return { valid: false, error: "ПИНФЛ обязателен" };
  }

  const pattern = /^\d{14}$/;

  if (!pattern.test(pinfl)) {
    return {
      valid: false,
      error: "ПИНФЛ должен состоять из 14 цифр",
    };
  }

  return { valid: true };
}

/**
 * Validate license number
 * @param licenseNumber - License number
 * @returns Validation result
 */
export function validateLicenseNumber(licenseNumber: string): ValidationResult {
  if (!licenseNumber) {
    return {
      valid: false,
      error: "Номер водительского удостоверения обязателен",
    };
  }

  // License number can be alphanumeric
  const pattern = /^[A-Z0-9]{5,15}$/i;

  if (!pattern.test(licenseNumber)) {
    return {
      valid: false,
      error: "Неверный формат номера",
    };
  }

  return { valid: true };
}

/**
 * Validate array has items
 * @param array - Array to validate
 * @param fieldName - Field name for error message
 * @param minItems - Minimum number of items
 * @returns Validation result
 */
export function validateArrayNotEmpty(
  array: any[],
  fieldName: string = "Список",
  minItems: number = 1,
): ValidationResult {
  if (!array || !Array.isArray(array) || array.length < minItems) {
    return {
      valid: false,
      error: `${fieldName} должен содержать минимум ${minItems} элемент(ов)`,
    };
  }

  return { valid: true };
}

/**
 * Validate premium amount
 * @param premium - Premium amount
 * @returns Validation result
 */
export function validatePremium(premium: number): ValidationResult {
  if (!premium || premium <= 0) {
    return {
      valid: false,
      error: "Страховая премия должна быть больше 0",
    };
  }

  return { valid: true };
}

/**
 * Composite validation for vehicle data
 * @param vehicle - Vehicle object
 * @returns Validation result with multiple errors
 */
export function validateVehicle(vehicle: any): {
  valid: boolean;
  errors: Record<string, string>;
} {
  const errors: Record<string, string> = {};

  const govNumberResult = validateGovNumber(vehicle.govNumber);
  if (!govNumberResult.valid) {
    errors.govNumber = govNumberResult.error!;
  }

  const seriesResult = validateTechPassportSeries(vehicle.techPassportSeries);
  if (!seriesResult.valid) {
    errors.techPassportSeries = seriesResult.error!;
  }

  const numberResult = validateTechPassportNumber(vehicle.techPassportNumber);
  if (!numberResult.valid) {
    errors.techPassportNumber = numberResult.error!;
  }

  return {
    valid: Object.keys(errors).length === 0,
    errors,
  };
}

/**
 * Composite validation for individual (owner/applicant)
 * @param individual - Individual object
 * @returns Validation result with multiple errors
 */
export function validateIndividual(individual: any): {
  valid: boolean;
  errors: Record<string, string>;
} {
  const errors: Record<string, string> = {};

  const seriesResult = validatePassportSeries(individual.passportSeries);
  if (!seriesResult.valid) {
    errors.passportSeries = seriesResult.error!;
  }

  const numberResult = validatePassportNumber(individual.passportNumber);
  if (!numberResult.valid) {
    errors.passportNumber = numberResult.error!;
  }

  const birthDateResult = validateBirthDate(individual.birthDate);
  if (!birthDateResult.valid) {
    errors.birthDate = birthDateResult.error!;
  }

  return {
    valid: Object.keys(errors).length === 0,
    errors,
  };
}

/**
 * Composite validation for driver
 * @param driver - Driver object
 * @returns Validation result with multiple errors
 */
export function validateDriver(driver: any): {
  valid: boolean;
  errors: Record<string, string>;
} {
  const errors: Record<string, string> = {};

  const seriesResult = validatePassportSeries(driver.passportSeries);
  if (!seriesResult.valid) {
    errors.passportSeries = seriesResult.error!;
  }

  const numberResult = validatePassportNumber(driver.passportNumber);
  if (!numberResult.valid) {
    errors.passportNumber = numberResult.error!;
  }

  const birthDateResult = validateBirthDate(driver.birthDate);
  if (!birthDateResult.valid) {
    errors.birthDate = birthDateResult.error!;
  }

  return {
    valid: Object.keys(errors).length === 0,
    errors,
  };
}

/**
 * Validate complete OSGO form before submission
 * @param osgo - OSGO object
 * @returns Validation result with step-wise errors
 */
export function validateOsgoForm(osgo: any): {
  valid: boolean;
  errors: {
    params?: string[];
    vehicle?: Record<string, string>;
    owner?: Record<string, string>;
    applicant?: Record<string, string>;
    drivers?: string[];
    payment?: Record<string, string>;
  };
} {
  const errors: any = {};

  // Step 1: Parameters
  const paramsErrors: string[] = [];
  if (!osgo.vehicle?.carType) paramsErrors.push("Выберите тип транспорта");
  if (!osgo.period) paramsErrors.push("Выберите период страхования");
  if (!osgo.drivedArea) paramsErrors.push("Выберите территорию использования");
  if (osgo.driversLimited && !osgo.incidentCoeff) {
    paramsErrors.push("Выберите частоту страховых случаев");
  }
  if (paramsErrors.length > 0) errors.params = paramsErrors;

  // Step 2: Vehicle
  if (osgo.vehicle) {
    const vehicleValidation = validateVehicle(osgo.vehicle);
    if (!vehicleValidation.valid) {
      errors.vehicle = vehicleValidation.errors;
    }
  }

  // Step 3: Owner
  if (osgo.beneficiary) {
    const ownerValidation = validateIndividual(osgo.beneficiary);
    if (!ownerValidation.valid) {
      errors.owner = ownerValidation.errors;
    }
  }

  // Step 3: Applicant (if different from owner)
  if (!osgo.applicantIsOwner && osgo.party) {
    const applicantValidation = validateIndividual(osgo.party);
    if (!applicantValidation.valid) {
      errors.applicant = applicantValidation.errors;
    }
  }

  // Step 4: Drivers
  if (osgo.driversLimited) {
    if (!osgo.drivers || osgo.drivers.length === 0) {
      errors.drivers = ["Добавьте хотя бы одного водителя"];
    } else {
      const driverErrors = osgo.drivers
        .map((driver: any, index: number) => {
          const validation = validateDriver(driver);
          if (!validation.valid) {
            return `Водитель ${index + 1}: ${Object.values(validation.errors).join(", ")}`;
          }
          return null;
        })
        .filter(Boolean);

      if (driverErrors.length > 0) {
        errors.drivers = driverErrors;
      }
    }
  }

  // Step 5: Payment
  const paymentErrors: Record<string, string> = {};
  if (osgo.party?.phone) {
    const phoneResult = validatePhone(osgo.party.phone);
    if (!phoneResult.valid) {
      paymentErrors.phone = phoneResult.error!;
    }
  } else {
    paymentErrors.phone = "Номер телефона обязателен";
  }

  if (osgo.contractStartDate) {
    const dateResult = validateContractStartDate(osgo.contractStartDate);
    if (!dateResult.valid) {
      paymentErrors.contractStartDate = dateResult.error!;
    }
  } else {
    paymentErrors.contractStartDate = "Дата начала договора обязательна";
  }

  if (Object.keys(paymentErrors).length > 0) {
    errors.payment = paymentErrors;
  }

  return {
    valid: Object.keys(errors).length === 0,
    errors,
  };
}
