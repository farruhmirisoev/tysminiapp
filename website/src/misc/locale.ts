import { LOCALE_KEY } from "@/misc/storage";

export const FALLBACK_LOCALE: string = "ru";

export const LOCALES: string[] = ["ru", "uz"];

export function getLocale(): string {
  const locale: string = localStorage.getItem(LOCALE_KEY) ?? LOCALE_KEY;
  return LOCALES.includes(locale) ? locale : FALLBACK_LOCALE;
}

export function setLocale(locale: string) {
  if (LOCALES.includes(locale)) {
    localStorage.setItem(LOCALE_KEY, locale);
  }
}

export default {
  getLocale,
  setLocale,
};
