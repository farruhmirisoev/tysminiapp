<template>
  <div class="step-container">
    <div class="step-header">
      <h2 class="step-title">Оплата</h2>
      <p class="step-description">
        Выберите способ оплаты для завершения оформления полиса
      </p>
    </div>

    <div class="step-content">
      <!-- Premium Display -->
      <div class="premium-section">
        <div class="premium-card-large">
          <div class="premium-header">
            <i class="bx bx-shield-alt-2"></i>
            <span>Страховая премия</span>
          </div>
          <div class="premium-amount-large">
            {{ formatPrice(osgoStore.calculatedPremium) }} сум
          </div>
        </div>
      </div>

      <!-- Payment Methods -->
      <div class="payment-section">
        <h3 class="section-title">
          <i class="bx bx-credit-card"></i>
          <span>Выберите способ оплаты</span>
        </h3>

        <div class="payment-buttons">
          <button
            type="button"
            class="payment-btn payme"
            :class="{ 'payment-btn-selected': selectedPaymentMethod === 'payme' }"
            :disabled="checkingStatus"
            @click="selectPaymentMethod('payme')"
          >
            <div class="payment-icon">💳</div>
            <div class="payment-name">Payme</div>
            <div v-if="selectedPaymentMethod === 'payme'" class="payment-selected-indicator">
              <i class="bx bx-check-circle"></i>
            </div>
          </button>

          <button
            type="button"
            class="payment-btn click"
            :class="{ 'payment-btn-selected': selectedPaymentMethod === 'click' }"
            :disabled="checkingStatus"
            @click="selectPaymentMethod('click')"
          >
            <div class="payment-icon">🔵</div>
            <div class="payment-name">Click</div>
            <div v-if="selectedPaymentMethod === 'click'" class="payment-selected-indicator">
              <i class="bx bx-check-circle"></i>
            </div>
          </button>

          <button
            type="button"
            class="payment-btn uzum"
            :class="{ 'payment-btn-selected': selectedPaymentMethod === 'uzum' }"
            :disabled="checkingStatus"
            @click="selectPaymentMethod('uzum')"
          >
            <div class="payment-icon">🟣</div>
            <div class="payment-name">Uzum</div>
            <div v-if="selectedPaymentMethod === 'uzum'" class="payment-selected-indicator">
              <i class="bx bx-check-circle"></i>
            </div>
          </button>
        </div>
      </div>

      <!-- Check Status Button -->
      <div class="status-section">
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
          <h3 class="success-title">Полис оформлен!</h3>
          <p class="success-description">
            Ваш полис ОСГО успешно оформлен и оплачен
          </p>
          <div class="policy-details">
            <div class="policy-row">
              <span class="policy-label">Серия:</span>
              <span class="policy-value">{{ fundData.seria }}</span>
            </div>
            <div class="policy-row">
              <span class="policy-label">Номер:</span>
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

const osgoStore = useOsgoStore()
const tg = useTelegramWebApp()
const api = useApi()
const { t } = useI18n()

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
  if (paymentStatusText.value.toLowerCase().includes('оплачен') || 
      paymentStatusText.value.toLowerCase().includes('успешно')) {
    return 'status-success'
  }
  if (paymentStatusText.value.toLowerCase().includes('ошибка') || 
      paymentStatusText.value.toLowerCase().includes('не')) {
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
    statusError.value = 'Полис не создан'
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
      paymentStatusText.value = 'Оплата успешно завершена. Полис оформлен.'
      if (tg.isTelegramWebApp.value) {
        tg.hapticNotification('success')
      }
    } else if (fundData.value) {
      paymentStatusText.value = 'Оплата обрабатывается. Проверьте статус позже.'
    } else {
      paymentStatusText.value = 'Оплата не получена. Проверьте SMS или попробуйте снова.'
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
    statusError.value = error.message || 'Ошибка при проверке статуса оплаты'
    paymentStatusText.value = 'Ошибка при проверке статуса. Попробуйте позже.'

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
  margin-bottom: 24px;
}

.step-title {
  font-size: 24px;
  font-weight: 700;
  color: #1F2937;
  margin-bottom: 8px;
}

.step-description {
  font-size: 15px;
  color: #6B7280;
  line-height: 1.5;
}

.step-content {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

/* Premium Section */
.premium-section {
  margin: 8px 0;
}

.premium-card-large {
  background: linear-gradient(135deg, #2481CC 0%, #3A91DC 100%);
  border-radius: 16px;
  padding: 24px;
  color: white;
  text-align: center;
  box-shadow: 0 8px 20px rgba(36, 129, 204, 0.3);
}

.premium-header {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  font-size: 16px;
  font-weight: 600;
  opacity: 0.95;
  margin-bottom: 12px;
}

.premium-header i {
  font-size: 24px;
}

.premium-amount-large {
  font-size: 36px;
  font-weight: 700;
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
  gap: 8px;
  font-size: 18px;
  font-weight: 600;
  color: #1F2937;
  margin-bottom: 4px;
}

.section-title i {
  font-size: 22px;
  color: #2481CC;
}

.payment-buttons {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;
}

.payment-btn {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 20px 16px;
  background: white;
  border: 2px solid #E5E7EB;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.2s ease;
  font-weight: 600;
  position: relative;
}

.payment-btn:hover:not(:disabled) {
  border-color: #2481CC;
  background: rgba(36, 129, 204, 0.05);
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
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
  box-shadow: 0 4px 12px rgba(16, 185, 129, 0.2) !important;
}

.payment-icon {
  font-size: 32px;
}

.payment-name {
  font-size: 14px;
  color: #1F2937;
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

.payment-btn-selected .payment-name {
  color: #065F46;
  font-weight: 700;
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
  gap: 8px;
  padding: 12px 16px;
  border-radius: 12px;
  font-size: 14px;
  font-weight: 500;
}

.status-text i {
  font-size: 20px;
}

.status-success {
  background: #ECFDF5;
  border: 2px solid #10B981;
  color: #065F46;
}

.status-error {
  background: #FEF2F2;
  border: 2px solid #EF4444;
  color: #DC2626;
}

.status-info {
  background: #EFF6FF;
  border: 2px solid #3B82F6;
  color: #1E40AF;
}

.error-message {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 16px;
  background: #FEF2F2;
  border: 2px solid #EF4444;
  border-radius: 12px;
  color: #DC2626;
  font-size: 14px;
  font-weight: 500;
}

.error-message i {
  font-size: 20px;
}

.success-message {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 16px;
  background: #ECFDF5;
  border: 2px solid #10B981;
  border-radius: 12px;
  color: #065F46;
  font-size: 14px;
  font-weight: 500;
}

.success-message i {
  font-size: 20px;
}

/* Success Card */
.success-card {
  background: linear-gradient(135deg, #10B981 0%, #059669 100%);
  border-radius: 16px;
  padding: 32px 24px;
  color: white;
  text-align: center;
  box-shadow: 0 8px 20px rgba(16, 185, 129, 0.3);
}

.success-icon {
  display: flex;
  justify-content: center;
  margin-bottom: 16px;
}

.success-icon i {
  font-size: 64px;
  animation: checkAppear 0.5s ease;
}

@keyframes checkAppear {
  from {
    transform: scale(0);
    opacity: 0;
  }
  to {
    transform: scale(1);
    opacity: 1;
  }
}

.success-title {
  font-size: 24px;
  font-weight: 700;
  margin-bottom: 8px;
}

.success-description {
  font-size: 15px;
  opacity: 0.95;
  margin-bottom: 20px;
}

.policy-details {
  background: rgba(255, 255, 255, 0.2);
  border-radius: 12px;
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.policy-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 15px;
}

.policy-label {
  opacity: 0.9;
}

.policy-value {
  font-weight: 700;
  font-size: 18px;
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
    font-size: 22px;
  }

  .premium-amount-large {
    font-size: 32px;
  }

  .payment-buttons {
    grid-template-columns: 1fr;
  }

  .payment-btn {
    flex-direction: row;
    justify-content: flex-start;
    padding: 16px;
  }
}
</style>

