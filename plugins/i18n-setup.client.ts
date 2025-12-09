// Directly import translations to ensure they're bundled
import ruMessages from '~/locales/ru.json'
import uzMessages from '~/locales/uz.json'

// i18n setup plugin - loads messages directly to prevent lazy loading
// This MUST run synchronously before any components render
export default defineNuxtPlugin({
  name: 'i18n-setup',
  enforce: 'pre', // Run before other plugins
  parallel: false, // Don't run in parallel - ensure it completes before other plugins
  setup(nuxtApp) {
    // This runs on both server and client, but we only need client-side
    if (typeof window === 'undefined') return
    
    // Get i18n instance - it should be available since we're using enforce: 'pre'
    const { $i18n } = nuxtApp
    
    if (!$i18n) {
      console.warn('[i18n-setup] i18n not available - will retry on app:mounted')
      // Retry when app is mounted
      nuxtApp.hook('app:mounted', () => {
        const { $i18n: i18n } = nuxtApp
        if (i18n) {
          setupMessages(i18n)
        }
      })
      return
    }
    
    // Set up messages immediately
    setupMessages($i18n)
    
    function setupMessages(i18n: any) {
      // Set messages directly to bypass lazy loading
      // This must happen before any locale changes or component rendering
      if (i18n.setLocaleMessage) {
        i18n.setLocaleMessage('ru', ruMessages)
        i18n.setLocaleMessage('uz', uzMessages)
      }
      
      // Also set directly in messages object (vue-i18n uses this)
      if (!i18n.messages.value) {
        i18n.messages.value = {}
      }
      i18n.messages.value.ru = ruMessages
      i18n.messages.value.uz = uzMessages
      
      // Set default locale to uz (without triggering lazy load)
      const savedLocale = localStorage.getItem('app-language')
      const targetLocale = (savedLocale && (savedLocale === 'ru' || savedLocale === 'uz')) 
        ? savedLocale 
        : 'uz'
      
      // Set locale directly - ensure it's set before components render
      if (!i18n.locale.value || i18n.locale.value === '') {
        i18n.locale.value = targetLocale
      }
      
      // Verify messages are available
      if (i18n.messages.value && i18n.messages.value[targetLocale]) {
        console.log('[i18n-setup] Messages loaded and available for locale:', targetLocale)
      } else {
        console.warn('[i18n-setup] Messages not available for locale:', targetLocale, 'Available:', Object.keys(i18n.messages.value || {}))
      }
    }
  }
})

