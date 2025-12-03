<template>
  <div id="app" class="min-h-screen bg-background" :lang="localeLang">
    <NuxtPage />
  </div>
</template>

<script setup lang="ts">
import { onMounted, computed } from 'vue'

// Initialize Telegram WebApp (only on client)
const tg = useTelegramWebApp()
const metaStore = useMetaStore()
const api = useApi()
const authStore = useAuthStore()
const { locale } = useI18n()

// Get locale for lang attribute (use ru-RU or uz-UZ format)
const localeLang = computed(() => {
  return locale.value === 'uz' ? 'uz-UZ' : 'ru-RU'
})

// Initialize app (only on client side)
onMounted(async () => {
  // Skip if running on server
  if (import.meta.server) return

  // Initialize Telegram WebApp
  tg.initialize()
  tg.applyTheme()

  // Check if user has token and fetch user data
  const token = api.getToken()
  if (token && !authStore.data) {
    try {
      await authStore.fetch()
      console.log('[App] User data loaded from token')
    } catch (error) {
      console.error('[App] Failed to load user data:', error)
      // Clear invalid token
      authStore.clear()
    }
  }

  // Fetch metadata (can be done without auth)
  try {
    await metaStore.fetchMeta()
    console.log('[App] Metadata loaded successfully')
  } catch (error) {
    console.error('[App] Failed to load metadata:', error)
  }

  // Log app info
  console.log('[App] Initialized', {
    isTelegramWebApp: tg.isTelegramWebApp.value,
    user: tg.user.value,
    platform: tg.platform.value,
    version: tg.version.value,
  })
})
</script>

<style>
/* Global styles are imported via nuxt.config.ts */
</style>
