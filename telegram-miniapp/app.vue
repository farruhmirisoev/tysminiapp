<template>
  <div id="app" class="min-h-screen bg-background">
    <NuxtPage />
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'

// Initialize Telegram WebApp
const tg = useTelegramWebApp()
const metaStore = useMetaStore()
const api = useApi()

// Initialize app
onMounted(async () => {
  // Initialize Telegram WebApp
  tg.initialize()
  tg.applyTheme()

  // Login with temporary credentials (TODO: Replace with Telegram auth)
  try {
    console.log('[App] Logging in with temp credentials...')
    const token = await api.signIn('998935286407', 'Abc123!@#')
    console.log('[App] Login successful, token obtained')
  } catch (error) {
    console.error('[App] Failed to login:', error)
    if (tg.isTelegramWebApp.value) {
      await tg.showAlert('Ошибка авторизации. Пожалуйста, перезапустите приложение.')
    }
  }

  // Fetch metadata
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
