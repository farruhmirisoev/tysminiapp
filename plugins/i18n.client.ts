export default defineNuxtPlugin({
  name: 'i18n-client',
  setup: async (nuxtApp) => {
    // Ensure i18n is properly initialized on client side
    const { $i18n } = nuxtApp
    
    if (typeof window === 'undefined') return
    
    // Wait for i18n to be ready
    if ($i18n && $i18n.waitForPendingLocaleChange) {
      await $i18n.waitForPendingLocaleChange()
    }
    
    // Ensure messages are already loaded (from i18n-setup plugin)
    const currentLocale = $i18n?.locale?.value || 'uz'
    if (!$i18n?.messages?.value?.[currentLocale]) {
      console.warn('[i18n-client] Messages not loaded for locale:', currentLocale)
      return
    }
    
    // Set default locale if not already set
    const savedLocale = localStorage.getItem('app-language')
    const targetLocale = (savedLocale && (savedLocale === 'ru' || savedLocale === 'uz')) 
      ? savedLocale 
      : 'uz'
    
    // Ensure locale is set to uz by default
    // Use direct assignment instead of setLocale to avoid triggering lazy load
    if (!$i18n.locale.value || $i18n.locale.value === '') {
      $i18n.locale.value = targetLocale
    } else if ($i18n.locale.value !== targetLocale && savedLocale) {
      // Only change if user explicitly saved a preference
      // Check if messages are available before changing locale
      if ($i18n.messages.value && $i18n.messages.value[targetLocale]) {
        $i18n.locale.value = targetLocale
      } else {
        console.warn('[i18n-client] Cannot change locale, messages not available for:', targetLocale)
      }
    }
    
    // Verify translations are available (should be bundled with lazy: false)
    if ($i18n.messages.value && $i18n.messages.value[currentLocale]) {
      console.log('[i18n-client] Translations available for locale:', currentLocale)
    } else {
      console.warn('[i18n-client] Translations not found for locale:', currentLocale, 'Messages:', $i18n.messages.value)
    }
  }
})
