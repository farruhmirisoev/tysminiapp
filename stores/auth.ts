// Auth Store for Telegram Mini App
// Handles authentication: sign in, sign up, activation, password recovery

import { defineStore } from 'pinia'
import { ref } from 'vue'
import { useApi } from '~/composables/useApi'

export const useAuthStore = defineStore('auth', () => {
  const api = useApi()

  // Sign in state
  const signingIn = ref(false)
  const signInError = ref<string | null>(null)

  // Sign up state
  const signingUp = ref(false)
  const signUpError = ref<string | null>(null)

  // Activation state
  const resending = ref(false)
  const activating = ref(false)
  const activateError = ref<string | null>(null)

  // Password recovery state
  const sendingRecoveryCode = ref(false)
  const sendRecoveryCodeError = ref<string | null>(null)
  const recoveringPassword = ref(false)
  const recoverPasswordError = ref<string | null>(null)

  // User data
  const data = ref<any>(null)
  const fetching = ref(false)
  const fetchError = ref<string | null>(null)

  /**
   * Sign in with username and password
   */
  const signIn = async (username: string, password: string) => {
    signingIn.value = true
    signInError.value = null

    try {
      const token = await api.signIn(username, password)
      api.setToken(token)
      
      // Fetch user info after sign in
      await fetch()
      
      return token
    } catch (error: any) {
      signInError.value = error.message || 'Ошибка входа'
      console.error('[AuthStore] Sign in error:', error)
      throw error
    } finally {
      signingIn.value = false
    }
  }

  /**
   * Sign up with phone and password
   */
  const signUp = async (login: string, password: string) => {
    signingUp.value = true
    signUpError.value = null

    try {
      await api.createUser(login, password)
      return
    } catch (error: any) {
      signUpError.value = error.message || 'Ошибка регистрации'
      console.error('[AuthStore] Sign up error:', error)
      throw error
    } finally {
      signingUp.value = false
    }
  }

  /**
   * Activate user with SMS code
   */
  const activate = async (login: string, smsCode: string) => {
    activating.value = true
    activateError.value = null

    try {
      await api.activateUser(login, smsCode)
      return
    } catch (error: any) {
      activateError.value = error.message || 'Неверный проверочный код'
      console.error('[AuthStore] Activate error:', error)
      throw error
    } finally {
      activating.value = false
    }
  }

  /**
   * Resend activation code
   */
  const resendCode = async (login: string) => {
    resending.value = true
    activateError.value = null

    try {
      await api.recoveryCode(login)
      return
    } catch (error: any) {
      activateError.value = error.message || 'Ошибка отправки кода'
      console.error('[AuthStore] Resend code error:', error)
      throw error
    } finally {
      resending.value = false
    }
  }

  /**
   * Send password recovery code
   */
  const sendRecoveryCode = async (login: string) => {
    sendingRecoveryCode.value = true
    sendRecoveryCodeError.value = null

    try {
      await api.recoveryCode(login)
      return
    } catch (error: any) {
      sendRecoveryCodeError.value = error.message || 'Ошибка отправки кода'
      console.error('[AuthStore] Send recovery code error:', error)
      throw error
    } finally {
      sendingRecoveryCode.value = false
    }
  }

  /**
   * Recover password with SMS code
   */
  const recoverPassword = async (login: string, password: string, smsCode: string) => {
    recoveringPassword.value = true
    recoverPasswordError.value = null

    try {
      await api.saveRecoveryPassword(login, password, smsCode)
      return
    } catch (error: any) {
      recoverPasswordError.value = error.message || 'Ошибка восстановления пароля'
      console.error('[AuthStore] Recover password error:', error)
      throw error
    } finally {
      recoveringPassword.value = false
    }
  }

  /**
   * Fetch user info
   */
  const fetch = async () => {
    fetching.value = true
    fetchError.value = null

    try {
      const user = await api.fetchUserInfo()
      data.value = user
      return user
    } catch (error: any) {
      fetchError.value = error.message || 'Ошибка загрузки данных пользователя'
      console.error('[AuthStore] Fetch error:', error)
      throw error
    } finally {
      fetching.value = false
    }
  }

  /**
   * Clear auth data and token
   */
  const clear = () => {
    api.clearToken()
    data.value = null
    signInError.value = null
    signUpError.value = null
    activateError.value = null
    sendRecoveryCodeError.value = null
    recoverPasswordError.value = null
  }

  /**
   * Check if user is authenticated
   */
  const isAuthenticated = () => {
    return !!data.value && !!api.getToken()
  }

  return {
    // State
    signingIn,
    signInError,
    signingUp,
    signUpError,
    resending,
    activating,
    activateError,
    sendingRecoveryCode,
    sendRecoveryCodeError,
    recoveringPassword,
    recoverPasswordError,
    data,
    fetching,
    fetchError,

    // Actions
    signIn,
    signUp,
    activate,
    resendCode,
    sendRecoveryCode,
    recoverPassword,
    fetch,
    clear,
    isAuthenticated,
  }
})

