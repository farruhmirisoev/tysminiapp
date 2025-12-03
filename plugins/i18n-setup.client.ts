// Directly import translations to ensure they're bundled
import ruMessages from '~/locales/ru.json'
import uzMessages from '~/locales/uz.json'

export default defineNuxtPlugin((nuxtApp) => {
  const { $i18n } = nuxtApp
  
  if (typeof window === 'undefined') return
  
  // Set messages directly to bypass lazy loading
  if ($i18n && $i18n.setLocaleMessage) {
    $i18n.setLocaleMessage('ru', ruMessages)
    $i18n.setLocaleMessage('uz', uzMessages)
    
    // Set default locale to uz
    const savedLocale = localStorage.getItem('app-language')
    const targetLocale = (savedLocale && (savedLocale === 'ru' || savedLocale === 'uz')) 
      ? savedLocale 
      : 'uz'
    
    if (!$i18n.locale.value || $i18n.locale.value === '') {
      $i18n.locale.value = targetLocale
    }
    
    console.log('[i18n-setup] Translations loaded directly, locale:', $i18n.locale.value)
  }
})

