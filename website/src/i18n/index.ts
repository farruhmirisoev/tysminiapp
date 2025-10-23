import { createI18n } from "vue-i18n"
import ru from "./locales/ru.json"
import uz from "./locales/uz.json"
// @ts-ignore
import Trans from "./translation.js"

export default createI18n({
  legacy: false,
  locale: Trans.guessDefaultLocale(),
  fallbackLocale: "ru",
  globalInjection: true,
  messages: { ru, uz },
})