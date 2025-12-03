<template>
  <AuthContainer :title="$t('auth.activate')">
    <div class="auth-info-text">
      {{ $t('auth.smsSent', { phone: formattedPhone }) }}
    </div>

    <form class="auth-form" @submit.prevent="handleActivate">
      <label class="auth-label">
        {{ $t('auth.smsCode') }} *
        <input
          v-model="smsCode"
          v-maska="'####'"
          class="auth-input"
          maxlength="4"
          required
        />
      </label>

      <button
        type="button"
        class="auth-resend-button"
        :disabled="resending || interval > 0"
        @click="handleResend"
      >
        {{ $t('auth.resendSms') }}
        <span v-if="interval">({{ interval }})</span>
      </button>

      <Transition name="fade">
        <div v-if="authStore.activateError" class="auth-error">
          {{ authStore.activateError }}
        </div>
      </Transition>

      <button
        type="submit"
        class="auth-button"
        :disabled="authStore.activating || authStore.resending || smsCode.length < 4"
      >
        <span v-if="authStore.activating || authStore.resending" class="spinner"></span>
        <span v-else>{{ $t('auth.activateButton') }}</span>
      </button>
    </form>
  </AuthContainer>
</template>

<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from 'vue'
import { useAuthStore } from '~/stores/auth'
import { mask, tokens } from 'maska'

// Allow unauthenticated access
definePageMeta({
  middleware: false
})

const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()
const { t } = useI18n()

const INTERVAL = 180 // 3 minutes

const smsCode = ref('')
const interval = ref(INTERVAL)
let timer: number | null = null

const username = computed(() => route.params.username as string)
const formattedPhone = computed(() =>
  mask(username.value, '+998(##)###-##-##', tokens)
)

const resending = computed(() => authStore.resending)

const handleActivate = async () => {
  try {
    await authStore.activate(username.value, smsCode.value)
    // Redirect to sign in after successful activation
    await router.push('/signin')
  } catch (error) {
    // Error is handled by store
    console.error('[Activate] Activation failed:', error)
  }
}

const handleResend = async () => {
  try {
    await authStore.resendCode(username.value)
    interval.value = INTERVAL
  } catch (error) {
    // Error is handled by store
    console.error('[Activate] Resend code failed:', error)
  }
}

onMounted(() => {
  timer = window.setInterval(() => {
    if (interval.value > 0) {
      interval.value--
    } else if (timer) {
      clearInterval(timer)
      timer = null
    }
  }, 1000)
})

onUnmounted(() => {
  if (timer) {
    clearInterval(timer)
  }
})

useHead({
  title: t('auth.activate'),
})
</script>

<style scoped>
.auth-info-text {
  margin-top: 16px;
  margin-bottom: 32px;
  font-size: 14px;
  color: #6B7280;
  text-align: center;
}

.auth-form {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.auth-label {
  display: block;
  font-weight: 600;
  font-size: 14px;
  color: #374151;
}

.auth-input {
  width: 100%;
  margin-top: 8px;
  padding: 12px 16px;
  border: 2px solid #E5E7EB;
  border-radius: 8px;
  font-size: 15px;
  text-align: center;
  letter-spacing: 8px;
  font-size: 24px;
  font-weight: 600;
  transition: all 0.2s;
}

.auth-input:focus {
  outline: none;
  border-color: #2481CC;
  box-shadow: 0 0 0 3px rgba(36, 129, 204, 0.1);
}

.auth-resend-button {
  background: none;
  border: none;
  color: #2481CC;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  padding: 8px;
  text-align: right;
  margin-top: -16px;
}

.auth-resend-button:hover:not(:disabled) {
  text-decoration: underline;
}

.auth-resend-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.auth-error {
  padding: 12px 16px;
  background: #FEF2F2;
  border: 2px solid #EF4444;
  border-radius: 8px;
  color: #DC2626;
  font-size: 14px;
}

.auth-button {
  width: 100%;
  padding: 14px 24px;
  background: #2481CC;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

.auth-button:hover:not(:disabled) {
  background: #1e6ba8;
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(36, 129, 204, 0.3);
}

.auth-button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.spinner {
  display: inline-block;
  width: 16px;
  height: 16px;
  border: 2px solid currentColor;
  border-top-color: transparent;
  border-radius: 50%;
  animation: spin 0.6s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>

