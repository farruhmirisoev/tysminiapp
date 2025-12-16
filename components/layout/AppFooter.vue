<template>
  <footer class="fixed-footer">
    <div class="max-w-container mx-auto px-4 h-full flex items-center justify-between gap-4">
      <!-- Previous Button (hidden on first step) -->
      <button
        v-if="!isFirstStep"
        type="button"
        class="btn btn-secondary flex-1 max-w-[160px]"
        :disabled="loading"
        @click="handlePrevious"
      >
        <i class="text-lg bx bx-chevron-left"></i>
        <span>{{ $t('common.previous') }}</span>
      </button>
      <!-- Spacer when back button is hidden -->
      <div v-else class="flex-1 max-w-[160px]"></div>

      <!-- Step Indicator (center) -->
      <div class="flex-1 text-center">
        <div class="text-sm text-text-light font-medium">
          {{ $t('common.step', { current: displayStepNumber, total: totalSteps }) }}
        </div>
      </div>

      <!-- Next/Submit Button -->
      <button
        type="button"
        class="btn flex-1 max-w-[160px]"
        :class="{
          'btn-primary': !isLastStep || currentStep !== STEPS.PAYMENT,
          'btn-success': isLastStep && currentStep === STEPS.PAYMENT
        }"
        :disabled="!canProceed || loading"
        @click="handleNext"
      >
        <span v-if="loading" class="spinner"></span>
        <template v-else>
          <span v-if="currentStep === STEPS.SUMMARY && !osgoStore.osgo.id">{{ $t('step5.confirm') }}</span>
          <span v-else-if="isLastStep && currentStep === STEPS.PAYMENT">
            <i class="bx bx-credit-card"></i>
            <span>{{ $t('step5.payment') }}</span>
          </span>
          <span v-else>{{ $t('common.next') }}</span>
          <i v-if="!isLastStep && currentStep !== STEPS.SUMMARY" class="text-lg bx bx-chevron-right"></i>
        </template>
      </button>
    </div>
  </footer>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { useOsgoStore } from '~/stores/osgo'
import { STEPS } from '~/utils/constants'

const osgoStore = useOsgoStore()
const tg = useTelegramWebApp()
const api = useApi()
const { t } = useI18n()

// Payment sending state
const sendingPayment = ref(false)
const paymentError = ref<string | null>(null)
const paymentSuccess = ref<string | null>(null)

// Computed properties
const currentStep = computed(() => osgoStore.currentStep)
const totalSteps = computed(() => osgoStore.totalSteps)
const displayStepNumber = computed(() => osgoStore.displayStepNumber)
const isFirstStep = computed(() => currentStep.value === 0)
const isLastStep = computed(() => currentStep.value === STEPS.PAYMENT)
const canProceed = computed(() => {
  return osgoStore.canProceedToNextStep
})
const loading = computed(() => osgoStore.saving || osgoStore.fetching || sendingPayment.value)

// Handle previous button
const handlePrevious = () => {
  if (isFirstStep.value) return

  // Haptic feedback
  if (tg.isTelegramWebApp.value) {
    tg.hapticImpact('light')
  }

  osgoStore.previousStep()
}

// Handle next button
const handleNext = async () => {
  if (!canProceed.value) {
    // Show validation error
    if (tg.isTelegramWebApp.value) {
      tg.hapticNotification('error')
      await tg.showAlert(t('info.fillAllFields'))
    }
    return
  }

  // Haptic feedback
  if (tg.isTelegramWebApp.value) {
    tg.hapticImpact('medium')
  }

  // Handle verification steps
  try {
    if (currentStep.value === STEPS.VEHICLE && !osgoStore.vehicleVerified) {
      await osgoStore.verifyVehicle()
    } else if (currentStep.value === STEPS.OWNER) {
      if (!osgoStore.ownerVerified) {
        await osgoStore.verifyOwner()
      }
      if (!osgoStore.osgo.applicantIsOwner && !osgoStore.applicantVerified) {
        await osgoStore.verifyApplicant()
      }
    } else if (currentStep.value === STEPS.SUMMARY) {
      // On summary step, create policy if it doesn't exist
      if (!osgoStore.osgo.id) {
        await osgoStore.createPolicy()
        console.log('[AppFooter] Policy created:', osgoStore.osgo.id)
        
        if (tg.isTelegramWebApp.value) {
          tg.hapticNotification('success')
        }
      }
    } else if (currentStep.value === STEPS.PAYMENT) {
      // On payment step, send payment link via SMS
      if (!osgoStore.selectedPaymentMethod) {
        if (tg.isTelegramWebApp.value) {
          tg.hapticNotification('error')
          await tg.showAlert('Выберите способ оплаты')
        }
        return
      }

      // Map payment method to API method name
      const methodMap = {
        'payme': 'sendSmsPayme',
        'click': 'sendSmsClick',
        'uzum': 'sendSmsUzum'
      } as const

      const apiMethod = methodMap[osgoStore.selectedPaymentMethod]
      const contractId = osgoStore.osgo.id
      const party = osgoStore.osgo.applicantIsOwner ? osgoStore.owner : osgoStore.applicant
      const phone = party.phone || ''
      const amount = osgoStore.calculatedPremium

      if (!contractId || !phone || !amount) {
        const errorMsg = 'Недостаточно данных для отправки платежной ссылки'
        console.error('[AppFooter] Missing payment data:', { contractId, phone, amount })
        if (tg.isTelegramWebApp.value) {
          tg.hapticNotification('error')
          await tg.showAlert(errorMsg)
        }
        return
      }

      try {
        sendingPayment.value = true
        paymentError.value = null
        paymentSuccess.value = null

        await api.sendPaymentLink(apiMethod, contractId, phone, amount)

        paymentSuccess.value = 'Платежная ссылка отправлена на ваш номер телефона'
        console.log('[AppFooter] Payment link sent successfully')

        if (tg.isTelegramWebApp.value) {
          tg.hapticNotification('success')
          await tg.showAlert('Платежная ссылка отправлена на ваш номер телефона')
        }
      } catch (error: any) {
        paymentError.value = error.message || 'Ошибка при отправке платежной ссылки'
        console.error('[AppFooter] Payment link error:', error)

        if (tg.isTelegramWebApp.value) {
          tg.hapticNotification('error')
          await tg.showAlert(paymentError.value)
        }
      } finally {
        sendingPayment.value = false
      }

      return // Don't proceed to next step after sending payment
    }

    // Move to next step or submit
    if (isLastStep.value) {
      // This should not happen for payment step as we return early
      console.log('[AppFooter] Last step reached')
    } else {
      osgoStore.nextStep()
    }
  } catch (error: any) {
    console.error('[AppFooter] Error:', error)

    if (tg.isTelegramWebApp.value) {
      tg.hapticNotification('error')
      await tg.showAlert(error.message || t('errors.unknown'))
    }
  }
}
</script>

<style scoped>
.fixed-footer {
  background: linear-gradient(to top, rgba(255, 255, 255, 0.98), rgba(255, 255, 255, 0.95));
  backdrop-filter: blur(10px);
}

.btn {
  min-height: 44px;
  font-size: 15px;
  font-weight: 600;
  gap: 6px;
}

.btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* Loading spinner */
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

/* Icon styles */
i {
  line-height: 1;
}

/* iOS safe area support is handled globally in main.css */

/* Mobile adjustments */
@media (max-width: 640px) {
  .btn {
    font-size: 14px;
    padding-left: 16px;
    padding-right: 16px;
  }
}
</style>
