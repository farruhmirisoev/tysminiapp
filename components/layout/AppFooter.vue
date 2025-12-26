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
        <i class="bx bx-arrow-back"></i>
        <span>{{ $t('common.previous') }}</span>
      </button>
      <!-- Spacer when back button is hidden -->
      <div v-else class="flex-1 max-w-[160px]"></div>

      <!-- Step Indicator (center) -->
      <div class="flex-1 text-center">
        <div class="text-xs text-text-light font-medium">
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
        <template v-else-if="currentStep === STEPS.SUMMARY && !osgoStore.osgo.id">
          <span>{{ $t('step5.confirm') }}</span>
        </template>
        <template v-else-if="isLastStep && currentStep === STEPS.PAYMENT">
          <i class="bx bx-credit-card"></i>
          <span>{{ $t('step5.payment') }}</span>
        </template>
        <template v-else>
          <span>{{ $t('common.next') }}</span>
          <i class="bx bx-arrow-back"></i>
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
      const phone = osgoStore.osgo.party?.phone || ''
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

        // Create Kasko contract as gift bonus after payment link is sent
        try {
          const vehicleId = osgoStore.kaskoVehicleId
          const individualId = osgoStore.kaskoIndividualId
          const partyPhone = osgoStore.osgo.party?.phone || ''
          const formattedPhone = partyPhone.replace(/[+()-]/g, '').replace(/^998/, '998')
          
          if (vehicleId && individualId && formattedPhone && formattedPhone.startsWith('998')) {
            // Use default payment method PAYME for Kasko (payment method selection happens later)
            try {
              const result = await api.createKaskoContract(vehicleId, individualId, formattedPhone, 'PAYME')
              // Only set success if result.success is explicitly true
              if (result && result.success === true) {
                osgoStore.kaskoContractStatus = 'success'
                console.log('[AppFooter] Kasko contract created successfully as gift bonus')
              } else {
                // If result doesn't have success=true, treat as failed
                osgoStore.kaskoContractStatus = 'failed'
                console.warn('[AppFooter] Kasko contract creation returned non-success result:', result)
              }
            } catch (contractError: any) {
              // Error thrown from createKaskoContract - set status to failed
              osgoStore.kaskoContractStatus = 'failed'
              console.error('[AppFooter] Failed to create Kasko contract:', contractError)
            }
          } else {
            console.warn('[AppFooter] Kasko IDs or phone not available, skipping Kasko contract creation', {
              vehicleId,
              individualId,
              formattedPhone
            })
            osgoStore.kaskoContractStatus = 'failed'
          }
        } catch (kaskoError: any) {
          // Log error but don't fail payment - gift bonus is optional
          osgoStore.kaskoContractStatus = 'failed'
          console.error('[AppFooter] Failed to create Kasko contract (outer catch):', kaskoError)
        }

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
  font-size: 14px;
  font-weight: 600;
  gap: 6px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex-wrap: nowrap;
}

.btn i {
  font-size: 16px;
  line-height: 1;
  display: inline-flex !important;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  vertical-align: middle;
  opacity: 1;
  visibility: visible;
  color: inherit;
}

/* Icon before text - add margin-right */
.btn i:not(:last-child) {
  margin-right: 6px;
}

/* Icon after text - add margin-left */
.btn i:last-child:not(:first-child) {
  margin-left: 6px;
  margin-right: 0;
}

/* Flip arrow-back icon horizontally for forward arrow */
.btn i.bx-arrow-back:last-child:not(:first-child) {
  transform: scaleX(-1);
}

/* Icon before text (credit-card) - add margin-right */
.btn i.bx-credit-card {
  margin-right: 6px;
  margin-left: 0;
}

.btn span {
  display: inline-flex;
  align-items: center;
  line-height: 1.2;
  vertical-align: middle;
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


/* iOS safe area support is handled globally in main.css */

/* Mobile adjustments */
@media (max-width: 640px) {
  .btn {
    font-size: 13px;
    padding-left: 14px;
    padding-right: 14px;
  }
}
</style>
