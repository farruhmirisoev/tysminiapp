<template>
  <footer class="fixed-footer">
    <div class="max-w-container mx-auto px-4 h-full flex items-center justify-between gap-4">
      <!-- Previous Button -->
      <button
        type="button"
        class="btn btn-secondary flex-1 max-w-[160px]"
        :disabled="isFirstStep || loading"
        @click="handlePrevious"
      >
        <i class="text-lg bx bx-chevron-left"></i>
        <span>{{ $t('common.previous') }}</span>
      </button>

      <!-- Step Indicator (center) -->
      <div class="flex-1 text-center">
        <div class="text-sm text-text-light font-medium">
          {{ $t('common.step', { current: currentStep + 1, total: totalSteps }) }}
        </div>
      </div>

      <!-- Next/Submit Button -->
      <button
        type="button"
        class="btn flex-1 max-w-[160px]"
        :class="isLastStep ? 'btn-primary' : 'btn-primary'"
        :disabled="!canProceed || loading"
        @click="handleNext"
      >
        <span v-if="loading" class="spinner"></span>
        <template v-else>
          <span>{{ isLastStep ? $t('step5.payment') : $t('common.next') }}</span>
          <i v-if="!isLastStep" class="text-lg bx bx-chevron-right"></i>
        </template>
      </button>
    </div>
  </footer>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useOsgoStore } from '~/stores/osgo'
import { STEPS } from '~/utils/constants'

const osgoStore = useOsgoStore()
const tg = useTelegramWebApp()
const { t } = useI18n()

// Computed properties
const currentStep = computed(() => osgoStore.currentStep)
const totalSteps = computed(() => osgoStore.totalSteps)
const isFirstStep = computed(() => currentStep.value === 0)
const isLastStep = computed(() => currentStep.value === totalSteps.value - 1)
const canProceed = computed(() => osgoStore.canProceedToNextStep)
const loading = computed(() => osgoStore.saving || osgoStore.fetching)

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
    }

    // Move to next step or submit
    if (isLastStep.value) {
      // TODO: Handle payment submission
      console.log('[AppFooter] Submit payment')
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
