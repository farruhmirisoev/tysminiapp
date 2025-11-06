<template>
  <div class="progress-bar-container">
    <!-- Progress Bar Track -->
    <div class="progress-track">
      <div
        class="progress-fill"
        :style="{ width: `${progressPercentage}%` }"
      />
    </div>

    <!-- Step Indicators -->
    <div class="steps-container">
      <div
        v-for="(step, index) in steps"
        :key="index"
        class="step-wrapper"
        @click="handleStepClick(index)"
      >
        <!-- Step Circle -->
        <div
          class="step-circle"
          :class="{
            'step-active': index === currentStep,
            'step-completed': index < currentStep,
            'step-pending': index > currentStep,
          }"
        >
          <span v-if="index < currentStep" class="step-check">✓</span>
          <span v-else class="step-number">{{ index + 1 }}</span>
        </div>

        <!-- Step Label (hidden on mobile) -->
        <div class="step-label">
          {{ step }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from '#imports'

interface Props {
  currentStep: number
  totalSteps: number
}

const props = defineProps<Props>()
const { t } = useI18n()

// Step labels - use translations
const steps = computed(() => [
  t('steps.params'),
  t('steps.vehicle'),
  t('steps.owner'),
  t('steps.drivers'),
  t('steps.summary'),
  t('steps.payment'),
])

// Calculate progress percentage
const progressPercentage = computed(() => {
  return ((props.currentStep + 1) / props.totalSteps) * 100
})

// Handle step click (optional - for navigation)
const handleStepClick = (index: number) => {
  // Could emit event to navigate to step
  // For now, we'll keep it disabled unless previous steps are completed
  console.log('Step clicked:', index)
}
</script>

<style scoped>
.progress-bar-container {
  position: relative;
  width: 100%;
}

/* Progress Track */
.progress-track {
  position: relative;
  width: 100%;
  height: 4px;
  background-color: #E5E7EB;
  border-radius: 2px;
  overflow: hidden;
  margin-bottom: 12px;
}

.progress-fill {
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  background: linear-gradient(90deg, #2481CC 0%, #3A91DC 100%);
  border-radius: 2px;
  transition: width 0.3s ease-in-out;
}

/* Steps Container */
.steps-container {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 4px;
}

.step-wrapper {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  cursor: default;
  min-width: 0;
}

/* Step Circle */
.step-circle {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  font-weight: 600;
  transition: all 0.2s ease;
  flex-shrink: 0;
}

.step-number,
.step-check {
  display: block;
}

/* Step States */
.step-active {
  background-color: #2481CC;
  color: white;
  box-shadow: 0 0 0 4px rgba(36, 129, 204, 0.2);
  transform: scale(1.05);
}

.step-completed {
  background-color: #2481CC;
  color: white;
}

.step-pending {
  background-color: #E5E7EB;
  color: #9CA3AF;
}

/* Step Label */
.step-label {
  font-size: 10px;
  color: #6B7280;
  text-align: center;
  line-height: 1.2;
  font-weight: 500;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  width: 100%;
  max-width: 60px;
}

.step-wrapper:has(.step-active) .step-label {
  color: #2481CC;
  font-weight: 600;
}

.step-wrapper:has(.step-completed) .step-label {
  color: #1F2937;
}

/* Animations */
@keyframes pulse {
  0%, 100% {
    box-shadow: 0 0 0 4px rgba(36, 129, 204, 0.2);
  }
  50% {
    box-shadow: 0 0 0 6px rgba(36, 129, 204, 0.1);
  }
}

.step-active {
  animation: pulse 2s ease-in-out infinite;
}

/* Mobile Responsive */
@media (max-width: 640px) {
  .step-circle {
    width: 24px;
    height: 24px;
    font-size: 11px;
  }

  .step-label {
    font-size: 9px;
    max-width: 50px;
  }

  .steps-container {
    gap: 2px;
  }
}

/* Extra small screens - hide labels */
@media (max-width: 400px) {
  .step-label {
    display: none;
  }

  .step-circle {
    width: 22px;
    height: 22px;
    font-size: 10px;
  }
}
</style>
