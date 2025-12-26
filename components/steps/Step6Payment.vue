<template>
  <div class="step-container">
    <div class="step-header">
      <h2 class="step-title">{{ t('step5.payment') }}</h2>
      <p class="step-description">
        {{ t('step5.paymentDescription') }}
      </p>
    </div>

    <div class="step-content">
      <!-- Gift Message Section -->
      <div class="gift-section">
        <div class="gift-card" :class="{ 'gift-card-success': osgoStore.kaskoContractStatus === 'success', 'gift-card-failed': osgoStore.kaskoContractStatus === 'failed' }">
          <!-- Confetti Animation -->
          <div v-if="osgoStore.kaskoContractStatus === 'success'" class="confetti-container">
            <div class="confetti" v-for="i in 50" :key="i" :style="getConfettiStyle(i)"></div>
          </div>
          <div class="gift-icon">
            <i class="bx bx-gift"></i>
          </div>
          <div class="gift-message">
            <h3 class="gift-title">{{ t('step5.giftMessage') }}</h3>
            <div v-if="osgoStore.kaskoContractStatus === 'success'" class="gift-status success">
              <i class="bx bx-check-circle"></i>
              <span>{{ t('step5.kaskoSuccess') }}</span>
            </div>
            <div v-else-if="osgoStore.kaskoContractStatus === 'failed'" class="gift-status failed">
              <i class="bx bx-x-circle"></i>
              <span>{{ t('step5.kaskoFailed') }}</span>
            </div>
            <a
              href="https://tys.uz/products/kasko-dostupnoe"
              target="_blank"
              rel="noopener noreferrer"
              class="gift-link-text"
            >
              {{ t('step5.giftLinkText') }}
            </a>
          </div>
        </div>
      </div>
      
      <!-- Kasko Create Button -->
      <div v-if="canCreateKasko" class="gift-action">
        <button
          type="button"
          class="btn btn-kasko"
          :disabled="creatingKasko"
          @click="createKaskoContract"
        >
          <span v-if="creatingKasko" class="spinner"></span>
          <template v-else>
            <i class="bx bx-gift"></i>
            <span>{{ t('step5.createKasko') }}</span>
          </template>
        </button>
      </div>

      <!-- Premium Display -->
      <div class="premium-section">
        <div class="premium-card-large">
          <div class="premium-header">
            <i class="bx bx-shield-alt-2"></i>
            <span>{{ t('step5.premium') }}</span>
          </div>
          <div class="premium-amount-large">
            {{ formatPrice(osgoStore.calculatedPremium) }}
          </div>
        </div>
      </div>

      <!-- Payment Methods -->
      <div class="payment-section">
        <h3 class="section-title">
          <i class="bx bx-credit-card"></i>
          <span>{{ t('step5.paymentMethod') }}</span>
        </h3>

        <div class="payment-buttons">
          <button
            type="button"
            class="payment-btn payme"
            :class="{ 'payment-btn-selected': selectedPaymentMethod === 'payme' }"
            :disabled="checkingStatus"
            @click="selectPaymentMethod('payme')"
          >
            <div class="payment-icon">
              <img :src="paymeImage" alt="Payme" />
            </div>
          </button>

          <button
            type="button"
            class="payment-btn click"
            :class="{ 'payment-btn-selected': selectedPaymentMethod === 'click' }"
            :disabled="checkingStatus"
            @click="selectPaymentMethod('click')"
          >
            <div class="payment-icon">
              <img :src="clickImage" alt="Click" />
            </div>
          </button>

          <button
            type="button"
            class="payment-btn uzum"
            :class="{ 'payment-btn-selected': selectedPaymentMethod === 'uzum' }"
            :disabled="checkingStatus"
            @click="selectPaymentMethod('uzum')"
          >
            <div class="payment-icon">
              <img :src="uzumImage" alt="Uzum" />
            </div>
          </button>
        </div>
      </div>

      <!-- Check Status Button - Temporarily hidden -->
      <div v-if="false" class="status-section">
        <button
          type="button"
          class="btn btn-primary-outlined w-full"
          :disabled="!!statusCheckSeconds || checkingStatus || !osgo.id"
          @click="checkPaymentStatus"
        >
          <i class="bx bx-refresh"></i>
          <span>{{ t('step5.checkStatus') }}</span>
          <span v-if="statusCheckSeconds" class="ml-1">({{ statusCheckSeconds }})</span>
        </button>

        <Transition name="fade">
          <div v-if="statusError" class="error-message mt-2">
            <i class="bx bx-error-circle"></i>
            <span>{{ statusError }}</span>
          </div>
        </Transition>

        <!-- Payment Status Text -->
        <Transition name="fade">
          <div v-if="paymentStatusText" class="status-text" :class="statusClass">
            <i :class="statusIcon"></i>
            <span>{{ paymentStatusText }}</span>
          </div>
        </Transition>
      </div>

      <!-- Policy Created (after payment) -->
      <Transition name="fade">
        <div v-if="osgo.id && fundData && fundData.seria" class="success-card">
          <div class="success-icon">
            <i class="bx bx-check-circle"></i>
          </div>
          <h3 class="success-title">{{ t('step5.success') }}</h3>
          <p class="success-description">
            {{ t('step5.policyIssued') }}
          </p>
          <div class="policy-details">
            <div class="policy-row">
              <span class="policy-label">{{ t('step5.policySeries') }}:</span>
              <span class="policy-value">{{ fundData.seria }}</span>
            </div>
            <div class="policy-row">
              <span class="policy-label">{{ t('step5.policyNumber') }}:</span>
              <span class="policy-value">{{ fundData.number }}</span>
            </div>
          </div>
        </div>
      </Transition>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, onBeforeUnmount } from 'vue'
import { useOsgoStore } from '~/stores/osgo'
import { formatPrice } from '~/utils/formatting'
import { STEPS } from '~/utils/constants'

// Import payment images
import paymeImage from '~/assets/img/payme.png'
import clickImage from '~/assets/img/click.png'
import uzumImage from '~/assets/img/uzum.png'

const osgoStore = useOsgoStore()
const tg = useTelegramWebApp()
const api = useApi()
const { t, locale } = useI18n()

const osgo = computed(() => osgoStore.osgo)
const fundData = computed(() => osgoStore.fundData)

// Phone number
const phone = computed(() => {
  const party = osgo.value.applicantIsOwner ? osgoStore.owner : osgoStore.applicant
  return party.phone || ''
})

// Payment state - selection only (sending happens in footer)
const checkingStatus = ref(false)
const statusError = ref<string | null>(null)
const statusCheckSeconds = ref(0)
const paymentStatusText = ref<string | null>(null)

let statusInterval: number | null = null

// Selected payment method (stored in store)
const selectedPaymentMethod = computed({
  get: () => osgoStore.selectedPaymentMethod,
  set: (value) => {
    osgoStore.selectedPaymentMethod = value
  }
})

// Status class and icon based on payment status
const statusClass = computed(() => {
  if (!paymentStatusText.value) return ''
  const text = paymentStatusText.value.toLowerCase()
  const currentLocale = locale.value
  const successKeywords = currentLocale === 'ru' ? ['оплачен', 'успешно', 'завершена'] : ['to\'langan', 'muvaffaqiyatli', 'yakunlandi']
  const errorKeywords = currentLocale === 'ru' ? ['ошибка', 'не получена'] : ['xato', 'olindi']
  
  if (successKeywords.some(keyword => text.includes(keyword))) {
    return 'status-success'
  }
  if (errorKeywords.some(keyword => text.includes(keyword))) {
    return 'status-error'
  }
  return 'status-info'
})

const statusIcon = computed(() => {
  if (statusClass.value === 'status-success') {
    return 'bx bx-check-circle'
  }
  if (statusClass.value === 'status-error') {
    return 'bx bx-error-circle'
  }
  return 'bx bx-info-circle'
})

// Kasko contract creation
const creatingKasko = ref(false)

const canCreateKasko = computed(() => {
  // Can create Kasko if policy is created and payment is successful
  return !!(osgo.value.id && fundData.value?.seria && fundData.value?.number && osgoStore.kaskoContractStatus !== 'success')
})

const createKaskoContract = async () => {
  if (!canCreateKasko.value || creatingKasko.value) return

  try {
    creatingKasko.value = true
    
    // Haptic feedback
    if (tg.isTelegramWebApp.value) {
      tg.hapticImpact('medium')
    }

    // Get Kasko IDs and phone
    const vehicleId = osgoStore.kaskoVehicleId
    const individualId = osgoStore.kaskoIndividualId
    const partyPhone = phone.value || ''
    const formattedPhone = partyPhone.replace(/[+()-]/g, '').replace(/^998/, '998')
    
    if (!vehicleId || !individualId || !formattedPhone || !formattedPhone.startsWith('998')) {
      throw new Error('Kasko contract data is incomplete')
    }

    // Create Kasko contract using PAYME as default payment method
    const result = await api.createKaskoContract(vehicleId, individualId, formattedPhone, 'PAYME')
    
    // Update status based on result
    if (result && result.success === true) {
      osgoStore.kaskoContractStatus = 'success'
      
      if (tg.isTelegramWebApp.value) {
        tg.hapticNotification('success')
      }
    } else {
      osgoStore.kaskoContractStatus = 'failed'
      throw new Error('Kasko contract creation failed')
    }
  } catch (error: any) {
    console.error('[Step6Payment] Create Kasko error:', error)
    osgoStore.kaskoContractStatus = 'failed'
    
    if (tg.isTelegramWebApp.value) {
      tg.hapticNotification('error')
      await tg.showAlert(error.message || t('errors.kaskoCreateFailed') || 'Failed to create Kasko contract')
    }
  } finally {
    creatingKasko.value = false
  }
}

// Confetti animation styles generator
const getConfettiStyle = (index: number) => {
  const colors = ['#FFD700', '#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A', '#98D8C8', '#F7DC6F', '#BB8FCE']
  const color = colors[index % colors.length]
  const left = `${(index * 2) % 100}%`
  const delay = `${(index * 0.1) % 2}s`
  const duration = `${2 + (index % 3)}s`
  const size = `${6 + (index % 8)}px`
  const rotation = `${index * 36}deg`
  
  return {
    '--confetti-color': color,
    '--confetti-left': left,
    '--confetti-delay': delay,
    '--confetti-duration': duration,
    '--confetti-size': size,
    '--confetti-rotation': rotation,
  }
}

// Select payment method (just selection, sending happens in footer)
const selectPaymentMethod = (method: 'payme' | 'click' | 'uzum') => {
  // Toggle selection - if already selected, deselect
  if (selectedPaymentMethod.value === method) {
    selectedPaymentMethod.value = null
  } else {
    selectedPaymentMethod.value = method
  }

  // Haptic feedback
  if (tg.isTelegramWebApp.value) {
    tg.hapticImpact('light')
  }
}

// Check payment status
const checkPaymentStatus = async () => {
  if (!osgo.value.id) {
    statusError.value = t('errors.createApplicationFailed')
    return
  }

  try {
    checkingStatus.value = true
    statusError.value = null
    paymentStatusText.value = null

    // Haptic feedback
    if (tg.isTelegramWebApp.value) {
      tg.hapticImpact('light')
    }

    // Fetch fund data to check payment status
    await osgoStore.fetchFundData()

    // Determine status text based on fund data
    if (fundData.value?.seria && fundData.value?.number) {
      paymentStatusText.value = t('step5.paymentSuccess')
      if (tg.isTelegramWebApp.value) {
        tg.hapticNotification('success')
      }
    } else if (fundData.value) {
      paymentStatusText.value = t('step5.paymentProcessing')
    } else {
      paymentStatusText.value = t('step5.paymentNotReceived')
    }

    // Start countdown timer
    statusCheckSeconds.value = 15
    if (statusInterval) {
      clearInterval(statusInterval)
    }
    statusInterval = window.setInterval(() => {
      if (statusCheckSeconds.value > 0) {
        statusCheckSeconds.value--
      } else {
        if (statusInterval) {
          clearInterval(statusInterval)
          statusInterval = null
        }
      }
    }, 1000)

  } catch (error: any) {
    console.error('[Step6Payment] Check status error:', error)
    statusError.value = error.message || t('errors.paymentFailed')
    paymentStatusText.value = t('errors.paymentFailed')

    if (tg.isTelegramWebApp.value) {
      tg.hapticNotification('error')
    }
  } finally {
    checkingStatus.value = false
  }
}

onBeforeUnmount(() => {
  if (statusInterval) {
    clearInterval(statusInterval)
  }
})
</script>

<style scoped>
.step-container {
  width: 100%;
  animation: fadeIn 0.3s ease;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.step-header {
  margin-bottom: 16px;
}

.step-title {
  font-size: 20px;
  font-weight: 600;
  color: #1F2937;
  margin-bottom: 8px;
}

.step-description {
  font-size: 13px;
  color: #6B7280;
  line-height: 1.5;
}

.step-content {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

/* Premium Section */
.gift-section {
  margin-bottom: 24px;
}

.gift-card {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 18px;
  padding: 18px;
  text-align: center;
  color: white;
  box-shadow: 0 4px 20px rgba(102, 126, 234, 0.25), 0 8px 32px rgba(102, 126, 234, 0.15), inset 0 1px 0 rgba(255, 255, 255, 0.2);
  position: relative;
  overflow: hidden;
}

.gift-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 1px;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.4), transparent);
}

.gift-icon {
  font-size: 44px;
  margin-bottom: 12px;
  color: white;
  filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.2));
  position: relative;
  z-index: 2;
}

.gift-icon i {
  display: inline-block;
  animation: float 3s ease-in-out infinite;
}

@keyframes float {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-4px);
  }
}

.gift-message {
  color: white;
  position: relative;
  z-index: 2;
}

.gift-title {
  font-size: 18px;
  font-weight: 600;
  margin-bottom: 12px;
  color: white;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.gift-link-text {
  display: inline-block;
  color: rgba(255, 255, 255, 0.9);
  text-decoration: underline;
  text-decoration-color: rgba(255, 255, 255, 0.5);
  text-underline-offset: 3px;
  font-weight: 500;
  font-size: 14px;
  transition: all 0.2s ease;
  margin-top: 10px;
}

.gift-link-text:hover {
  color: white;
  text-decoration-color: rgba(255, 255, 255, 0.8);
}

.gift-card-success {
  background: linear-gradient(135deg, #10B981 0%, #059669 100%);
  position: relative;
  overflow: hidden;
}

/* Confetti Animation */
.confetti-container {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  pointer-events: none;
  overflow: hidden;
  z-index: 1;
}

.confetti {
  position: absolute;
  width: var(--confetti-size, 8px);
  height: var(--confetti-size, 8px);
  background-color: var(--confetti-color, #FFD700);
  left: var(--confetti-left, 50%);
  top: -10px;
  opacity: 0;
  animation: confetti-fall var(--confetti-duration, 3s) var(--confetti-delay, 0s) ease-in forwards;
  transform: rotate(var(--confetti-rotation, 0deg));
  border-radius: 2px;
}

@keyframes confetti-fall {
  0% {
    opacity: 1;
    transform: translateY(0) rotate(0deg) scale(1);
  }
  10% {
    opacity: 1;
  }
  90% {
    opacity: 1;
  }
  100% {
    opacity: 0;
    transform: translateY(400px) rotate(var(--confetti-rotation, 360deg)) scale(0.5);
  }
}

.gift-card-failed {
  background: linear-gradient(135deg, #EF4444 0%, #DC2626 100%);
}

.gift-status {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  margin-top: 10px;
  font-size: 14px;
  font-weight: 500;
}

.gift-status.success {
  color: rgba(255, 255, 255, 0.95);
}

.gift-status.failed {
  color: rgba(255, 255, 255, 0.95);
}

.gift-status i {
  font-size: 18px;
  filter: drop-shadow(0 1px 2px rgba(0, 0, 0, 0.2));
}

.premium-section {
  margin: 8px 0;
}

.premium-card-large {
  background: linear-gradient(135deg, #2481CC 0%, #3A91DC 100%);
  border-radius: 18px;
  padding: 18px;
  color: white;
  text-align: center;
  box-shadow: 0 4px 20px rgba(36, 129, 204, 0.25), 0 8px 32px rgba(36, 129, 204, 0.15), inset 0 1px 0 rgba(255, 255, 255, 0.2);
  position: relative;
  overflow: hidden;
}

.premium-card-large::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 1px;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.4), transparent);
}

.premium-header {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  font-size: 14px;
  font-weight: 600;
  opacity: 0.95;
  margin-bottom: 12px;
}

.premium-header i {
  font-size: 20px;
  filter: drop-shadow(0 1px 2px rgba(0, 0, 0, 0.2));
}

.premium-amount-large {
  font-size: 28px;
  font-weight: 600;
  margin-bottom: 8px;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

/* Payment Section */
.payment-section {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.section-title {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 13px;
  font-weight: 500;
  color: #1F2937;
  margin-bottom: 4px;
}

.section-title i {
  font-size: 18px;
  color: #2481CC;
}

.payment-buttons {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;
  width: 100%;
}

.payment-btn {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 16px;
  background: white;
  border: 2px solid #E5E7EB;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.2s ease;
  font-weight: 600;
  position: relative;
  min-height: 80px;
}

.payment-btn:hover:not(:disabled) {
  border-color: #2481CC;
  background: rgba(36, 129, 204, 0.05);
  transform: translateY(-2px);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.08);
}

.payment-btn:active:not(:disabled) {
  transform: translateY(0);
}

.payment-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.payment-btn-selected {
  border-color: #10B981 !important;
  background: #ECFDF5 !important;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(16, 185, 129, 0.25) !important;
}

.payment-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 50px;
  flex: 1;
}

.payment-icon img {
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
  width: auto;
  height: auto;
}

.payment-selected-indicator {
  position: absolute;
  top: 8px;
  right: 8px;
  color: #10B981;
  font-size: 20px;
  background: white;
  border-radius: 50%;
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}


/* Status Section */
.status-section {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.status-text {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 14px 16px;
  border-radius: 14px;
  font-size: 14px;
  font-weight: 500;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06), inset 0 1px 0 rgba(255, 255, 255, 0.8);
}

.status-text i {
  font-size: 20px;
}

.status-success {
  background: linear-gradient(180deg, #ECFDF5 0%, #D1FAE5 100%);
  border: 1px solid rgba(16, 185, 129, 0.2);
  color: #065F46;
}

.status-success i {
  color: #10B981;
  filter: drop-shadow(0 1px 2px rgba(16, 185, 129, 0.2));
}

.status-error {
  background: linear-gradient(180deg, #FEF2F2 0%, #FEE2E2 100%);
  border: 1px solid rgba(239, 68, 68, 0.2);
  color: #DC2626;
}

.status-error i {
  color: #EF4444;
  filter: drop-shadow(0 1px 2px rgba(239, 68, 68, 0.2));
}

.status-info {
  background: linear-gradient(180deg, #EFF6FF 0%, #DBEAFE 100%);
  border: 1px solid rgba(59, 130, 246, 0.2);
  color: #1E40AF;
}

.status-info i {
  color: #3B82F6;
  filter: drop-shadow(0 1px 2px rgba(59, 130, 246, 0.2));
}

.error-message {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 14px 16px;
  background: linear-gradient(180deg, #FEF2F2 0%, #FEE2E2 100%);
  border: 1px solid rgba(239, 68, 68, 0.2);
  border-radius: 14px;
  color: #DC2626;
  font-size: 14px;
  font-weight: 500;
  box-shadow: 0 2px 8px rgba(239, 68, 68, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.8);
}

.error-message i {
  font-size: 20px;
  color: #EF4444;
  filter: drop-shadow(0 1px 2px rgba(239, 68, 68, 0.2));
}

.success-message {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 14px 16px;
  background: linear-gradient(180deg, #ECFDF5 0%, #D1FAE5 100%);
  border: 1px solid rgba(16, 185, 129, 0.2);
  border-radius: 14px;
  color: #065F46;
  font-size: 14px;
  font-weight: 500;
  box-shadow: 0 2px 8px rgba(16, 185, 129, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.8);
}

.success-message i {
  font-size: 20px;
}

/* Success Card - Apple Style */
.success-card {
  background: linear-gradient(135deg, #10B981 0%, #059669 100%);
  border-radius: 20px;
  padding: 28px 20px;
  color: white;
  text-align: center;
  box-shadow: 0 8px 24px rgba(16, 185, 129, 0.3), 0 16px 48px rgba(16, 185, 129, 0.15), inset 0 1px 0 rgba(255, 255, 255, 0.2);
  position: relative;
  overflow: hidden;
  animation: slideUpFade 0.5s cubic-bezier(0.16, 1, 0.3, 1);
}

@keyframes slideUpFade {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.success-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 1px;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.4), transparent);
}

.success-icon {
  display: flex;
  justify-content: center;
  margin-bottom: 16px;
}

.success-icon i {
  font-size: 56px;
  animation: checkAppear 0.6s cubic-bezier(0.34, 1.56, 0.64, 1);
  filter: drop-shadow(0 4px 8px rgba(0, 0, 0, 0.2));
}

@keyframes checkAppear {
  0% {
    transform: scale(0) rotate(-180deg);
    opacity: 0;
  }
  60% {
    transform: scale(1.1) rotate(10deg);
  }
  100% {
    transform: scale(1) rotate(0deg);
    opacity: 1;
  }
}

.success-title {
  font-size: 22px;
  font-weight: 600;
  margin-bottom: 8px;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.success-description {
  font-size: 14px;
  opacity: 0.95;
  margin-bottom: 20px;
  line-height: 1.5;
}

.policy-details {
  background: rgba(255, 255, 255, 0.15);
  backdrop-filter: blur(10px);
  border-radius: 14px;
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.2), 0 2px 8px rgba(0, 0, 0, 0.1);
}

.policy-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 0;
  border-bottom: 1px solid rgba(255, 255, 255, 0.15);
  transition: all 0.2s ease;
  font-size: 15px;
}

.policy-row:last-child {
  border-bottom: none;
}

.policy-row:hover {
  padding-left: 4px;
  padding-right: 4px;
}

.policy-label {
  opacity: 0.9;
  font-weight: 500;
  letter-spacing: 0.3px;
  font-size: 13px;
}

.policy-value {
  font-weight: 700;
  font-size: 18px;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
  letter-spacing: 0.5px;
}

.fade-enter-active,
.fade-leave-active {
  transition: all 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}

/* Mobile responsive */
@media (max-width: 768px) {
  .step-title {
    font-size: 18px;
  }

  .premium-amount-large {
    font-size: 24px;
  }

  .payment-buttons {
    grid-template-columns: repeat(3, 1fr);
    gap: 8px;
  }

  .payment-btn {
    min-height: 70px;
    padding: 12px;
  }
  
  .payment-icon {
    height: 45px;
  }
}
</style>
