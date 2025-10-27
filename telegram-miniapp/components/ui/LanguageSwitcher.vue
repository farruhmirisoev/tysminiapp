<template>
  <div class="language-switcher">
    <button
      v-for="locale in availableLocales"
      :key="locale.code"
      :class="[
        'lang-btn',
        { active: currentLocale === locale.code }
      ]"
      @click="switchLanguage(locale.code)"
    >
      {{ locale.code.toUpperCase() }}
    </button>
  </div>
</template>

<script setup lang="ts">
const { locale, locales } = useI18n()
const switchLocalePath = useSwitchLocalePath()

const currentLocale = computed(() => locale.value)

const availableLocales = computed(() => {
  return locales.value.filter((l: any) => l.code !== locale.value)
})

const switchLanguage = (code: string) => {
  locale.value = code

  // Store preference
  if (typeof window !== 'undefined') {
    localStorage.setItem('app-language', code)
  }

  // Haptic feedback if available
  if (window.Telegram?.WebApp?.HapticFeedback) {
    window.Telegram.WebApp.HapticFeedback.impactOccurred('light')
  }
}

// Load saved language preference on mount
onMounted(() => {
  if (typeof window !== 'undefined') {
    const saved = localStorage.getItem('app-language')
    if (saved && (saved === 'ru' || saved === 'uz')) {
      locale.value = saved
    }
  }
})
</script>

<style scoped>
.language-switcher {
  display: flex;
  gap: 0.25rem;
  background: #f3f4f6;
  border-radius: 0.5rem;
  padding: 0.25rem;
}

.lang-btn {
  padding: 0.375rem 0.75rem;
  border-radius: 0.375rem;
  font-size: 0.875rem;
  font-weight: 500;
  color: #6b7280;
  background: transparent;
  border: none;
  cursor: pointer;
  transition: all 0.2s ease;
  user-select: none;
  -webkit-tap-highlight-color: transparent;
}

.lang-btn:hover {
  color: #374151;
}

.lang-btn.active {
  background: white;
  color: #2481cc;
  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
}

.lang-btn:active {
  transform: scale(0.95);
}

/* Dark theme support */
:root[data-theme="dark"] .language-switcher {
  background: #2a2a2a;
}

:root[data-theme="dark"] .lang-btn {
  color: #9ca3af;
}

:root[data-theme="dark"] .lang-btn:hover {
  color: #d1d5db;
}

:root[data-theme="dark"] .lang-btn.active {
  background: #1a1a1a;
  color: #60a5fa;
}
</style>
