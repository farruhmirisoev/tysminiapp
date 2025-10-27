<template>
  <div class="step-container">
    <div class="step-header">
      <h2 class="step-title">Информация о транспорте</h2>
      <p class="step-description">
        Введите данные транспортного средства для проверки
      </p>
    </div>

    <div class="step-content">
      <!-- Government Number -->
      <div class="form-section">
        <InputField
          v-model="osgo.vehicle!.govNumber"
          label="Государственный номер"
          placeholder="01A000AA"
          :disabled="!osgoStore.isEditable"
          :error="errors.govNumber"
          icon="bx bx-car"
          required
          @blur="validateField('govNumber')"
        />
      </div>

      <!-- Tech Passport Series -->
      <div class="form-section">
        <InputField
          v-model="osgo.vehicle!.techPassportSeries"
          label="Серия техпаспорта"
          placeholder="AAA"
          :disabled="!osgoStore.isEditable"
          :error="errors.techPassportSeries"
          :max-length="3"
          required
          @blur="validateField('techPassportSeries')"
        />
      </div>

      <!-- Tech Passport Number -->
      <div class="form-section">
        <InputField
          v-model="osgo.vehicle!.techPassportNumber"
          label="Номер техпаспорта"
          placeholder="1234567"
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
            <span>{{ osgoStore.vehicleVerified ? 'Проверено' : 'Проверить' }}</span>
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
            <span>Транспорт найден</span>
          </div>
          <div class="card-content">
            <div class="info-row" v-if="osgo.vehicle.model">
              <span class="info-label">Модель:</span>
              <span class="info-value">{{ osgo.vehicle.model }}</span>
            </div>
            <div class="info-row" v-if="osgo.vehicle.year">
              <span class="info-label">Год выпуска:</span>
              <span class="info-value">{{ osgo.vehicle.year }}</span>
            </div>
            <div class="info-row" v-if="osgo.vehicle.color">
              <span class="info-label">Цвет:</span>
              <span class="info-value">{{ osgo.vehicle.color }}</span>
            </div>
            <div class="info-row" v-if="osgo.vehicle.engineNumber">
              <span class="info-label">Номер двигателя:</span>
              <span class="info-value">{{ osgo.vehicle.engineNumber }}</span>
            </div>
            <div class="info-row" v-if="osgo.vehicle.carType">
              <span class="info-label">Тип:</span>
              <span class="info-value">{{ metaStore.getLocalizedName(osgo.vehicle.carType) }}</span>
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

const osgoStore = useOsgoStore()
const metaStore = useMetaStore()
const tg = useTelegramWebApp()

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
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.info-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 0;
  border-bottom: 1px solid #F3F4F6;
}

.info-row:last-child {
  border-bottom: none;
}

.info-label {
  font-size: 14px;
  color: #6B7280;
  font-weight: 500;
}

.info-value {
  font-size: 14px;
  color: #1F2937;
  font-weight: 600;
  text-align: right;
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

  .info-row {
    flex-direction: column;
    align-items: flex-start;
    gap: 4px;
  }

  .info-value {
    text-align: left;
  }
}
</style>
