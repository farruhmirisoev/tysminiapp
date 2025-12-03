<template>
  <AuthContainer :title="$t('auth.signin')">
    <div class="auth-link-text">
      {{ $t('auth.noAccount') }}
      <NuxtLink class="auth-link" to="/signup">
        {{ $t('auth.register') }}
      </NuxtLink>
      {{ $t('auth.toStart') }}
    </div>

    <form class="auth-form" @submit.prevent="handleSignIn">
      <label class="auth-label">
        {{ $t('auth.phoneNumber') }}
        <input
          v-model="username"
          v-maska="'+998(##)###-##-##'"
          class="auth-input"
          type="tel"
          required
        />
      </label>

      <label class="auth-label">
        {{ $t('auth.password') }}
        <div class="password-input-wrapper">
          <input
            v-model="password"
            :type="showPassword ? 'text' : 'password'"
            class="auth-input"
            required
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

      <Transition name="fade">
        <div v-if="authStore.signInError" class="auth-error">
          {{ authStore.signInError }}
        </div>
      </Transition>

      <div class="auth-link-wrapper">
        <NuxtLink class="auth-link" to="/password-recover">
          {{ $t('auth.forgotPassword') }}
        </NuxtLink>
      </div>

      <button
        type="submit"
        class="auth-button"
        :disabled="authStore.signingIn"
      >
        <span v-if="authStore.signingIn" class="spinner"></span>
        <span v-else>{{ $t('auth.signIn') }}</span>
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

const username = ref('+998')
const password = ref('')
const showPassword = ref(false)

const handleSignIn = async () => {
  try {
    await authStore.signIn(
      username.value.replace(/[+()-]/g, ''),
      password.value
    )
    // Redirect to home after successful sign in
    await router.push('/')
  } catch (error) {
    // Error is handled by store
    console.error('[Signin] Sign in failed:', error)
  }
}

// Set page title
useHead({
  title: t('auth.signin'),
})
</script>

<style scoped>
.auth-link-text {
  margin-top: 16px;
  margin-bottom: 48px;
  font-size: 14px;
  color: #6B7280;
  text-align: center;
}

.auth-link {
  color: #2481CC;
  font-weight: 600;
  text-decoration: none;
}

.auth-link:hover {
  text-decoration: underline;
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
  transition: all 0.2s;
}

.auth-input:focus {
  outline: none;
  border-color: #2481CC;
  box-shadow: 0 0 0 3px rgba(36, 129, 204, 0.1);
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

.auth-error {
  padding: 12px 16px;
  background: #FEF2F2;
  border: 2px solid #EF4444;
  border-radius: 8px;
  color: #DC2626;
  font-size: 14px;
}

.auth-link-wrapper {
  text-align: right;
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

