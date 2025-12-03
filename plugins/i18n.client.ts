export default defineNuxtPlugin(async (nuxtApp) => {
  // Ensure i18n is properly initialized on client side
  const { $i18n } = nuxtApp
  
  if (typeof window === 'undefined') return
  
  // Wait for i18n to be ready
  if ($i18n.waitForPendingLocaleChange) {
    await $i18n.waitForPendingLocaleChange()
  }
  
  // Set default locale if not already set
  const savedLocale = localStorage.getItem('app-language')
  const targetLocale = (savedLocale && (savedLocale === 'ru' || savedLocale === 'uz')) 
    ? savedLocale 
    : 'uz'
  
  // Ensure locale is set to uz by default
  if (!$i18n.locale.value || $i18n.locale.value === '') {
    $i18n.locale.value = targetLocale
  } else if ($i18n.locale.value !== targetLocale && savedLocale) {
    // Only change if user explicitly saved a preference
    await $i18n.setLocale(targetLocale)
  }
  
  // Verify translations are available (should be bundled with lazy: false)
  const currentLocale = $i18n.locale.value || 'uz'
  if ($i18n.messages.value && $i18n.messages.value[currentLocale]) {
    console.log('[i18n] Translations available for locale:', currentLocale)
  } else {
    console.warn('[i18n] Translations not found for locale:', currentLocale, 'Messages:', $i18n.messages.value)
  }
})
