// Constants for ECCLIVO Telegram Mini App

/**
 * Compensation amount for insurance calculation
 * This is the base compensation value used in premium calculations
 */
export const COMPENSATION = 40000000;

/**
 * API Configuration
 */
export const API_CONFIG = {
  BASE_URL: "https://port.tys.uz/rest/v2/",
  TIMEOUT: 30000, // 30 seconds
  RETRY_ATTEMPTS: 3,
  RETRY_DELAY: 1000, // 1 second
};

/**
 * Storage Keys
 */
export const STORAGE_KEYS = {
  ECCLIVO_META: "ecclivo-meta",
  OSGO_DRAFT: "osgo-draft",
  AUTH_TOKEN: "auth-token",
  USER_DATA: "user-data",
  LANGUAGE: "app-language",
  THEME: "app-theme",
};

/**
 * Step Configuration
 */
export const STEPS = {
  PARAMS: 0,
  VEHICLE: 1,
  OWNER: 2,
  DRIVERS: 3,
  SUMMARY: 4,
} as const;

export const STEP_NAMES = [
  "policy.osgo.tabs.coverage",
  "policy.osgo.tabs.vehicle",
  "policy.osgo.tabs.owner",
  "policy.osgo.tabs.drivers",
  "policy.osgo.tabs.payment",
] as const;

/**
 * Default Values
 */
export const DEFAULTS = {
  CURRENCY: "сум",
  LOCALE: "ru",
  MIN_AGE: 18,
  MAX_AGE: 100,
  MAX_FUTURE_DAYS: 30,
  DEBOUNCE_DELAY: 500, // milliseconds
  CACHE_TTL: 300000, // 5 minutes
};

/**
 * Validation Patterns
 */
export const PATTERNS = {
  GOV_NUMBER: /^\d{2}[A-Z]\d{3}[A-Z]{2}$/,
  TECH_PASSPORT_SERIES: /^[A-Z]{2,3}$/,
  TECH_PASSPORT_NUMBER: /^\d+$/,
  PASSPORT_SERIES: /^[A-Z]{2}$/,
  PASSPORT_NUMBER: /^\d{7}$/,
  PHONE: /^998\d{9}$/,
  PINFL: /^\d{14}$/,
  LICENSE_NUMBER: /^[A-Z0-9]{5,15}$/i,
};

/**
 * HTTP Status Codes
 */
export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  INTERNAL_SERVER_ERROR: 500,
  SERVICE_UNAVAILABLE: 503,
} as const;

/**
 * Error Messages
 */
export const ERROR_MESSAGES = {
  NETWORK_ERROR: "Ошибка подключения. Проверьте интернет-соединение.",
  SERVER_ERROR: "Сервис временно недоступен. Попробуйте позже.",
  UNAUTHORIZED: "Необходима авторизация.",
  NOT_FOUND: "Данные не найдены. Проверьте введенные данные.",
  VALIDATION_ERROR: "Проверьте правильность заполнения полей.",
  UNKNOWN_ERROR: "Произошла неизвестная ошибка.",
};

/**
 * Success Messages
 */
export const SUCCESS_MESSAGES = {
  VEHICLE_VERIFIED: "Транспортное средство успешно проверено",
  OWNER_VERIFIED: "Владелец успешно проверен",
  DRIVER_VERIFIED: "Водитель успешно проверен",
  POLICY_CREATED: "Полис успешно создан",
  PAYMENT_SUCCESS: "Оплата прошла успешно",
  DATA_SAVED: "Данные сохранены",
};

/**
 * Payment Methods
 */
export const PAYMENT_METHODS = {
  PAYME: {
    id: "payme",
    name: "Payme",
    icon: "💳",
  },
  CLICK: {
    id: "click",
    name: "Click",
    icon: "🔵",
  },
  UZUM: {
    id: "uzum",
    name: "Uzum",
    icon: "🟣",
  },
} as const;

/**
 * Service Names (for API calls)
 */
export const SERVICES = {
  OSGO: "OsgoService",
  PARTY: "PartyService",
  BILLING: "BillingService",
} as const;

/**
 * API Methods
 */
export const API_METHODS = {
  // OsgoService
  GET_OSGO_DATA_VERSION: "getOsgoDataVersion",
  GET_OSGO_DATA: "getOsgoData",
  GET_VEHICLE: "getVehicle",
  GET_DRIVER: "getDriver",
  CREATE_OSGO_APPLICATION: "createOsgoApplication",
  UPDATE_OSGO_APPLICATION: "updateOsgoApplication",
  GET_FUND_POLICY: "getFundPolicy",

  // PartyService
  GET_INDIVIDUAL_BY_PASSPORT: "getIndividualByPassport",

  // BillingService
  CREATE_PAYME_PAYMENT: "createPaymePayment",
  CREATE_CLICK_PAYMENT: "createClickPayment",
  CREATE_UZUM_PAYMENT: "createUzumPayment",
} as const;

/**
 * Entity Names (for entity fetching)
 */
export const ENTITIES = {
  OSGO: "contract$Osgo",
  INDIVIDUAL: "base$Individual",
  VEHICLE: "osgo_Vehicle",
  DRIVER: "osgoDriver",
} as const;

/**
 * Views (for entity fetching with specific data)
 */
export const VIEWS = {
  OSGO_FRONT: "osgo-front-view",
  INDIVIDUAL_FRONT: "individual-front-view",
} as const;

/**
 * Temporary Login Credentials (for development)
 * TODO: Remove in production - use Telegram auth
 */
export const TEMP_CREDENTIALS = {
  USERNAME: "998935286407",
  PASSWORD: "Abc123!@#",
};

/**
 * UI Configuration
 */
export const UI_CONFIG = {
  HEADER_HEIGHT: 60,
  FOOTER_HEIGHT: 70,
  MAX_WIDTH: 768,
  TRANSITION_DURATION: 200,
  LOADING_DEBOUNCE: 300,
  TOAST_DURATION: 3000,
};

/**
 * Form Field Names
 */
export const FORM_FIELDS = {
  // Vehicle
  GOV_NUMBER: "govNumber",
  TECH_PASSPORT_SERIES: "techPassportSeries",
  TECH_PASSPORT_NUMBER: "techPassportNumber",

  // Individual
  PASSPORT_SERIES: "passportSeries",
  PASSPORT_NUMBER: "passportNumber",
  BIRTH_DATE: "birthDate",
  PHONE: "phone",

  // OSGO
  CAR_TYPE: "carType",
  PERIOD: "period",
  DRIVERS_LIMITED: "driversLimited",
  INCIDENT_COEFF: "incidentCoeff",
  DRIVED_AREA: "drivedArea",
  CONTRACT_START_DATE: "contractStartDate",
  APPLICANT_IS_OWNER: "applicantIsOwner",
} as const;

/**
 * Telegram WebApp Theme Colors
 */
export const TELEGRAM_THEME = {
  BG_COLOR: "--tg-theme-bg-color",
  TEXT_COLOR: "--tg-theme-text-color",
  HINT_COLOR: "--tg-theme-hint-color",
  LINK_COLOR: "--tg-theme-link-color",
  BUTTON_COLOR: "--tg-theme-button-color",
  BUTTON_TEXT_COLOR: "--tg-theme-button-text-color",
  SECONDARY_BG_COLOR: "--tg-theme-secondary-bg-color",
} as const;

/**
 * Animation Durations
 */
export const ANIMATION = {
  FAST: 150,
  BASE: 200,
  SLOW: 300,
  PAGE_TRANSITION: 400,
} as const;

/**
 * Breakpoints (matches Tailwind config)
 */
export const BREAKPOINTS = {
  SM: 640,
  MD: 768,
  LG: 1024,
  XL: 1280,
} as const;

/**
 * Date Formats
 */
export const DATE_FORMATS = {
  API: "YYYY-MM-DD",
  DISPLAY: "DD.MM.YYYY",
  DISPLAY_WITH_TIME: "DD.MM.YYYY HH:mm",
  TIME: "HH:mm",
} as const;

/**
 * File Size Limits
 */
export const FILE_LIMITS = {
  MAX_SIZE: 5 * 1024 * 1024, // 5MB
  ALLOWED_TYPES: ["image/jpeg", "image/png", "image/jpg", "application/pdf"],
} as const;

/**
 * Pagination
 */
export const PAGINATION = {
  DEFAULT_PAGE_SIZE: 20,
  MAX_PAGE_SIZE: 100,
} as const;

/**
 * Regular Expression Patterns for masking
 */
export const MASK_PATTERNS = {
  PHONE: "+998 ## ### ## ##",
  GOV_NUMBER: "## ### ***",
  PASSPORT: "** #######",
} as const;

/**
 * Feature Flags
 */
export const FEATURES = {
  ENABLE_TELEGRAM_AUTH: true,
  ENABLE_DEV_LOGIN: true,
  ENABLE_ANALYTICS: false,
  ENABLE_ERROR_REPORTING: false,
  ENABLE_OFFLINE_MODE: false,
} as const;

/**
 * Environment
 */
export const ENV = {
  DEVELOPMENT: "development",
  PRODUCTION: "production",
  STAGING: "staging",
} as const;
