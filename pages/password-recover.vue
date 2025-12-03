<template>
  <AuthContainer :title="$t('auth.recover')">
    <form class="auth-form" @submit.prevent="handleSubmit">
      <label class="auth-label">
        {{ $t('auth.phoneNumber') }}
        <input
          v-model="username"
          v-maska="'+998(##)###-##-##'"
          class="auth-input"
          type="tel"
          :disabled="recoveryCodeReceived"
          required
        />
      </label>

      <label v-if="recoveryCodeReceived" class="auth-label">
        {{ $t('auth.password') }}
        <div class="password-input-wrapper">
          <input
            v-model="password"
            :type="showPassword ? 'text' : 'password'"
            class="auth-input"
            required
            minlength="6"
          />
          <button
            type="button"
            class="password-toggle"
            @click="showPassword = !showPassword"
          >
            <i class="bx" :class="showPassword ? 'bx-hide' : 'bx-show'"></i>
          </button>
        </div>
      </label>

      <label v-if="recoveryCodeReceived" class="auth-label">
        {{ $t('auth.confirmationCode') }}
        <input
          v-model="smsCode"
          v-maska="'####'"
          class="auth-input"
          maxlength="4"
          required
        />
      </label>

      <div class="auth-link-wrapper">
        <NuxtLink class="auth-link" to="/signin">
          {{ $t('auth.signIn') }}
        </NuxtLink>
      </div>

      <Transition name="fade">
        <div v-if="authStore.sendRecoveryCodeError" class="auth-error">
          {{ authStore.sendRecoveryCodeError }}
        </div>
      </Transition>

      <Transition name="fade">
        <div v-if="authStore.recoverPasswordError" class="auth-error">
          {{ authStore.recoverPasswordError }}
        </div>
      </Transition>

      <button
        type="submit"
        class="auth-button"
        :disabled="
          recoveryCodeReceived
            ? !password || !smsCode || authStore.recoveringPassword
            : !username || authStore.sendingRecoveryCode
        "
      >
        <span v-if="authStore.sendingRecoveryCode || authStore.recoveringPassword" class="spinner"></span>
        <span v-else>
          {{ recoveryCodeReceived ? $t('auth.changePassword') : $t('auth.sendSms') }}
        </span>
      </button>
    </form>
  </AuthContainer>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useAuthStore } from '~/stores/auth'

// Allow unauthenticated access
definePageMeta({
  middleware: false
})

const authStore = useAuthStore()
const router = useRouter()
const { t } = useI18n()

const recoveryCodeReceived = ref(false)
const username = ref('+998')
const password = ref('')
const smsCode = ref('')
const showPassword = ref(false)

const handleSubmit = async () => {
  if (recoveryCodeReceived.value) {
    // Recover password with SMS code
    try {
      await authStore.recoverPassword(
        username.value.replace(/[+()-]/g, ''),
        password.value,
        smsCode.value
      )
      // Redirect to sign in after successful password recovery
      await router.push('/signin')
    } catch (error) {
      // Error is handled by store
      console.error('[PasswordRecover] Recover password failed:', error)
    }
  } else {
    // Send recovery code
    try {
      await authStore.sendRecoveryCode(username.value.replace(/[+()-]/g, ''))
      recoveryCodeReceived.value = true
    } catch (error) {
      // Error is handled by store
      console.error('[PasswordRecover] Send recovery code failed:', error)
    }
  }
}

useHead({
  title: t('auth.recover'),
})
</script>

<style scoped>
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
  transition: all 0.2s;
}

.auth-input:focus {
  outline: none;
  border-color: #2481CC;
  box-shadow: 0 0 0 3px rgba(36, 129, 204, 0.1);
}

.auth-input:disabled {
  background: #F3F4F6;
  cursor: not-allowed;
}

.password-input-wrapper {
  position: relative;
}

.password-toggle {
  position: absolute;
  right: 8px;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  padding: 8px;
  cursor: pointer;
  color: #6B7280;
  font-size: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.password-toggle:hover {
  color: #2481CC;
}

.auth-link-wrapper {
  text-align: right;
}

.auth-link {
  color: #2481CC;
  font-weight: 600;
  text-decoration: none;
  font-size: 14px;
}

.auth-link:hover {
  text-decoration: underline;
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
