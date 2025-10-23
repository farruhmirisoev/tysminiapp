import { LOCALES, getLocale, setLocale } from "@/misc/locale";
import { defineStore } from "pinia";

export const useSettingsStore = defineStore("settings", {
  state: () => ({
    locale: getLocale(),
  }),

  getters: {
    nextLocale(): string {
      return LOCALES.filter((entry) => entry != this.locale)[0];
    },
  },

  actions: {
    setLocale(locale: string) {
      this.locale = locale;
      setLocale(locale);
    },
  },
});
