/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_BASE_URL: string;
  readonly VITE_ID_BASE_URL: string;
  readonly VITE_INFO_BASE_URL: string;
  readonly VITE_BASIC_AUTH_USERNAME: string;
  readonly VITE_BASIC_AUTH_PASSWORD: string;
  readonly VITE_COMPANY_INN: string;
  readonly VITE_VEHICLE_GOV_NUMBER: string;
  readonly VITE_VEHICLE_TECH_PASSPORT_SERIES: string;
  readonly VITE_VEHICLE_TECH_PASSPORT_NUMBER: string;
  readonly VITE_PERSON_PASSPORT_SERIES: string;
  readonly VITE_PERSON_PASSPORT_NUMBER: string;
  readonly VITE_PERSON_BIRTH_DATE: string;
  readonly VITE_PAYME_CHECKOUT: string;
  readonly VITE_PAYME_MERCHANT: string;
  readonly VITE_CLICK_CHECKOUT: string;
  readonly VITE_CLICK_MERCHANT: string;
  readonly VITE_CLICK_SERVICE: string;
  readonly VITE_UZUM_CHECKOUT: string;
  readonly VITE_UZUM_SERVICE_ID: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
