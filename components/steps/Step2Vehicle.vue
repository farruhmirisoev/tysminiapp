<template>
  <div class="step-container">
    <div class="step-header">
      <h2 class="step-title">{{ t('step2.title') }}</h2>
      <p class="step-description">
        {{ t('step2.description') }}
      </p>
    </div>

    <div class="step-content">
      <!-- Government Number -->
      <div class="form-section">
        <InputField
          v-model="osgo.vehicle!.govNumber"
          :label="t('step2.govNumber')"
          :placeholder="t('step2.govNumberPlaceholder')"
          :disabled="!osgoStore.isEditable"
          :error="errors.govNumber"
          icon="bx bx-car"
          required
          uppercase
          @blur="validateField('govNumber')"
        />
      </div>

      <!-- Tech Passport Series -->
      <div class="form-section">
        <InputField
          v-model="osgo.vehicle!.techPassportSeries"
          :label="t('step2.techPassportSeries')"
          :placeholder="t('step2.techPassportSeriesPlaceholder')"
          :disabled="!osgoStore.isEditable"
          :error="errors.techPassportSeries"
          :max-length="3"
          required
          uppercase
          @blur="validateField('techPassportSeries')"
        />
      </div>

      <!-- Tech Passport Number -->
      <div class="form-section">
        <InputField
          v-model="osgo.vehicle!.techPassportNumber"
          :label="t('step2.techPassportNumber')"
          :placeholder="t('step2.techPassportNumberPlaceholder')"
          :disabled="!osgoStore.isEditable"
          :error="errors.techPassportNumber"
          input-mode="numeric"
          required
          @blur="validateField('techPassportNumber')"
        />
      </div>

      <!-- Verify Button -->
      <div class="form-section">
        <button
          type="button"
          class="btn btn-primary w-full"
          :disabled="!canVerify || osgoStore.vehicleVerifying"
          @click="handleVerify"
        >
          <span v-if="osgoStore.vehicleVerifying" class="spinner"></span>
          <template v-else>
            <i class="bx bx-check-circle"></i>
            <span>{{ osgoStore.vehicleVerified ? t('step2.verified') : t('step2.verify') }}</span>
          </template>
        </button>
      </div>

      <!-- Verification Error -->
      <div v-if="osgoStore.vehicleVerifyError" class="alert alert-error">
        <i class="bx bx-error-circle"></i>
        <span>{{ osgoStore.vehicleVerifyError }}</span>
      </div>

      <!-- Vehicle Details (after verification) -->
      <Transition name="fade">
        <div v-if="osgoStore.vehicleVerified && osgo.vehicle" class="vehicle-info-card">
          <div class="card-header">
            <i class="bx bx-check-circle text-success"></i>
            <span>{{ t('step2.vehicleFound') }}</span>
          </div>
          <div class="card-content">
            <!-- Debug: Show vehicle object (temporary - remove after debugging) -->
            <!-- Change v-if to false to disable debug view -->
            <div v-if="false" style="font-size: 11px; color: #666; margin-bottom: 15px; padding: 10px; background: #f5f5f5; border-radius: 4px; max-height: 200px; overflow-y: auto;">
              <strong>Debug Vehicle Data:</strong><br>
              <strong>Keys:</strong> {{ Object.keys(osgo.vehicle || {}).join(', ') }}<br>
              <strong>Full object:</strong><br>
              <pre style="font-size: 10px; margin-top: 5px;">{{ JSON.stringify(osgo.vehicle, null, 2) }}</pre>
            </div>
            
            <div class="vehicle-info-grid">
              <div class="vehicle-info-item" v-if="osgo.vehicle?.techPassportIssueDate">
                <div class="vehicle-info-label">{{ t('step2.techPassportIssueDate') }}</div>
                <div class="vehicle-info-value">{{ formatDisplayDate(osgo.vehicle.techPassportIssueDate) }}</div>
              </div>
              <div class="vehicle-info-item" v-if="osgo.vehicle?.modelName || osgo.vehicle?.model">
                <div class="vehicle-info-label">{{ t('step2.model') }}</div>
                <div class="vehicle-info-value">{{ osgo.vehicle?.modelName || osgo.vehicle?.model || '-' }}</div>
              </div>
              <div class="vehicle-info-item" v-if="osgo.vehicle?.createdYear || osgo.vehicle?.year">
                <div class="vehicle-info-label">{{ t('step2.year') }}</div>
                <div class="vehicle-info-value">{{ osgo.vehicle?.createdYear || osgo.vehicle?.year || '-' }}</div>
              </div>
              <div class="vehicle-info-item" v-if="osgo.vehicle?.engineNumber">
                <div class="vehicle-info-label">{{ t('step2.engineNumber') }}</div>
                <div class="vehicle-info-value">{{ osgo.vehicle.engineNumber }}</div>
              </div>
              <div class="vehicle-info-item" v-if="osgo.vehicle?.bodyNumber">
                <div class="vehicle-info-label">{{ t('step2.bodyNumber') }}</div>
                <div class="vehicle-info-value">{{ osgo.vehicle.bodyNumber }}</div>
              </div>
            </div>
            
            <!-- Fallback: Show if no fields match -->
            <div v-if="vehicleInfoCount === 0" class="vehicle-info-empty">
              {{ t('step2.vehicleNotFound') }}
            </div>
          </div>
        </div>
      </Transition>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useOsgoStore } from '~/stores/osgo'
import { useMetaStore } from '~/stores/meta'
import {
  validateGovNumber,
  validateTechPassportSeries,
  validateTechPassportNumber,
} from '~/utils/validation'
import { formatDisplayDate } from '~/utils/formatting'

const osgoStore = useOsgoStore()
const metaStore = useMetaStore()
const tg = useTelegramWebApp()
const { t } = useI18n()

const osgo = computed(() => osgoStore.osgo)

// Validation errors
const errors = ref<Record<string, string>>({})

// Can verify if all fields are filled
const canVerify = computed(() => {
  return !!(
    osgo.value.vehicle?.govNumber &&
    osgo.value.vehicle?.techPassportSeries &&
    osgo.value.vehicle?.techPassportNumber &&
    Object.keys(errors.value).length === 0
  )
})

// Count how many vehicle info fields are available
const vehicleInfoCount = computed(() => {
  if (!osgo.value.vehicle) return 0
  const vehicle = osgo.value.vehicle
  let count = 0
  if (vehicle.techPassportIssueDate) count++
  if (vehicle.modelName || vehicle.model) count++
  if (vehicle.createdYear || vehicle.year) count++
  if (vehicle.engineNumber) count++
  if (vehicle.bodyNumber) count++
  return count
})

// Validate single field
const validateField = (field: string) => {
  if (!osgo.value.vehicle) return

  let result
  switch (field) {
    case 'govNumber':
      result = validateGovNumber(osgo.value.vehicle.govNumber)
      break
    case 'techPassportSeries':
      result = validateTechPassportSeries(osgo.value.vehicle.techPassportSeries)
      break
    case 'techPassportNumber':
      result = validateTechPassportNumber(osgo.value.vehicle.techPassportNumber)
      break
  }

  if (result && !result.valid) {
    errors.value[field] = result.error || ''
  } else {
    delete errors.value[field]
  }
}

// Handle verify button click
const handleVerify = async () => {
  // Validate all fields
  validateField('govNumber')
  validateField('techPassportSeries')
  validateField('techPassportNumber')

  if (Object.keys(errors.value).length > 0) {
    if (tg.isTelegramWebApp.value) {
      tg.hapticNotification('error')
    }
    return
  }

  try {
    await osgoStore.verifyVehicle()
    
    // Debug: Log vehicle data after verification
    console.log('[Step2Vehicle] Vehicle after verification:', osgo.value.vehicle)
    console.log('[Step2Vehicle] Vehicle keys:', Object.keys(osgo.value.vehicle || {}))

    if (tg.isTelegramWebApp.value) {
      tg.hapticNotification('success')
    }
  } catch (error: any) {
    if (tg.isTelegramWebApp.value) {
      tg.hapticNotification('error')
    }
  }
}
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
  gap: 20px;
}

.form-section {
  width: 100%;
}

/* Alert */
.alert {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 14px 16px;
  border-radius: 10px;
  font-size: 14px;
  line-height: 1.4;
}

.alert-error {
  background: #FEE2E2;
  color: #991B1B;
  border: 1px solid #FCA5A5;
}

.alert i {
  font-size: 20px;
  flex-shrink: 0;
}

/* Vehicle Info Card */
.vehicle-info-card {
  background: white;
  border: 2px solid #10B981;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.card-header {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 16px;
  background: #ECFDF5;
  border-bottom: 1px solid #D1FAE5;
  font-weight: 600;
  color: #065F46;
}

.card-header i {
  font-size: 24px;
}

.card-content {
  padding: 16px;
}

.vehicle-info-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
  gap: 16px;
}

@media (min-width: 1024px) {
  .vehicle-info-grid {
    grid-template-columns: repeat(4, 1fr);
  }
}

.vehicle-info-item {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.vehicle-info-label {
  font-size: 14px;
  color: #6B7280;
  line-height: 1.4;
}

.vehicle-info-value {
  font-size: 14px;
  color: #1F2937;
  font-weight: 700;
  line-height: 1.4;
}

.vehicle-info-empty {
  padding: 16px;
  text-align: center;
  color: #6B7280;
  font-size: 14px;
}

/* Spinner */
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

/* Button icon */
.btn i {
  font-size: 18px;
}

/* Transitions */
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

  .step-description {
    font-size: 14px;
  }

  .vehicle-info-grid {
    grid-template-columns: 1fr;
    gap: 12px;
  }
}
</style>
