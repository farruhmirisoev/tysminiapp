<template>
  <div class="step-container">
    <div class="step-header">
      <h2 class="step-title">Информация о водителях</h2>
      <p class="step-description">
        Добавьте водителей, допущенных к управлению транспортным средством
      </p>
    </div>

    <div class="step-content">
      <!-- Info message for unlimited drivers -->
      <div v-if="!osgo.driversLimited" class="info-card">
        <i class="bx bx-info-circle"></i>
        <div>
          <div class="info-title">Неограниченное количество водителей</div>
          <div class="info-text">
            Вы выбрали полис без ограничения по количеству водителей. Добавление водителей не требуется.
          </div>
        </div>
      </div>

      <!-- Drivers section (for limited drivers) -->
      <template v-else>
        <!-- Action buttons -->
        <div class="actions-row">
          <button
            type="button"
            class="btn btn-primary-outlined"
            :disabled="!osgoStore.isEditable"
            @click="addDriver"
          >
            <i class="bx bx-plus"></i>
            <span>Добавить водителя</span>
          </button>

          <button
            v-if="!hasOwnerAsDriver"
            type="button"
            class="btn btn-primary-outlined"
            :disabled="!osgoStore.isEditable || !osgoStore.ownerVerified"
            @click="addOwnerAsDriver"
          >
            <i class="bx bx-user"></i>
            <span>Владелец - водитель</span>
          </button>

          <button
            v-if="!osgo.applicantIsOwner && !hasApplicantAsDriver"
            type="button"
            class="btn btn-primary-outlined"
            :disabled="!osgoStore.isEditable || !osgoStore.applicantVerified"
            @click="addApplicantAsDriver"
          >
            <i class="bx bx-user"></i>
            <span>Страхователь - водитель</span>
          </button>
        </div>

        <!-- Drivers list -->
        <div v-if="osgo.drivers.length === 0" class="empty-state">
          <i class="bx bx-user-plus"></i>
          <p>Добавьте хотя бы одного водителя</p>
        </div>

        <div v-else class="drivers-list">
          <div
            v-for="(driver, index) in osgo.drivers"
            :key="index"
            class="driver-card"
          >
            <div class="driver-header">
              <div class="driver-number">
                <i class="bx bx-user"></i>
                <span>Водитель {{ index + 1 }}</span>
              </div>
              <button
                v-if="osgoStore.isEditable"
                type="button"
                class="btn-icon btn-danger"
                @click="removeDriver(index)"
              >
                <i class="bx bx-trash"></i>
              </button>
            </div>

            <div class="driver-content">
              <!-- Passport Series -->
              <InputField
                v-model="driver.passportSeries"
                label="Серия паспорта"
                placeholder="AA"
                :disabled="!osgoStore.isEditable"
                :max-length="2"
                uppercase
                required
              />

              <!-- Passport Number -->
              <InputField
                v-model="driver.passportNumber"
                label="Номер паспорта"
                placeholder="1234567"
                :disabled="!osgoStore.isEditable"
                input-mode="numeric"
                :max-length="7"
                required
              />

              <!-- Birth Date -->
              <InputField
                v-model="driver.birthDate"
                label="Дата рождения"
                type="text"
                date-mask
                placeholder="DD-MM-YYYY"
                :disabled="!osgoStore.isEditable"
                required
              />

              <!-- Verify Button -->
              <button
                type="button"
                class="btn btn-primary-outlined w-full"
                :disabled="!canVerifyDriver(driver)"
                @click="verifyDriver(index)"
              >
                <i class="bx bx-check-circle"></i>
                <span>{{ driver.name ? 'Проверено' : 'Проверить' }}</span>
              </button>

              <!-- Driver info (after verification) -->
              <Transition name="fade">
                <div v-if="driver.name" class="driver-info">
                  <div class="info-row">
                    <span class="info-label">ФИО:</span>
                    <span class="info-value">{{ driver.name }}</span>
                  </div>
                  <div class="info-row" v-if="driver.licenseNumber">
                    <span class="info-label">Водительское удостоверение:</span>
                    <span class="info-value">{{ driver.licenseNumber }}</span>
                  </div>
                </div>
              </Transition>
            </div>
          </div>
        </div>
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useOsgoStore } from '~/stores/osgo'
import type { Driver } from '~/types/osgo'

const osgoStore = useOsgoStore()
const tg = useTelegramWebApp()

const osgo = computed(() => osgoStore.osgo)
const owner = computed(() => osgoStore.owner)
const applicant = computed(() => osgoStore.applicant)

// Check if owner is already added as driver
const hasOwnerAsDriver = computed(() => {
  return osgoStore.hasDriver(
    owner.value.passportSeries,
    owner.value.passportNumber,
    owner.value.birthDate
  )
})

// Check if applicant is already added as driver
const hasApplicantAsDriver = computed(() => {
  return osgoStore.hasDriver(
    applicant.value.passportSeries,
    applicant.value.passportNumber,
    applicant.value.birthDate
  )
})

// Add empty driver
const addDriver = () => {
  osgoStore.addDriver()
  if (tg.isTelegramWebApp.value) {
    tg.hapticImpact('light')
  }
}

// Add owner as driver
const addOwnerAsDriver = () => {
  osgoStore.addOwnerAsDriver()
  if (tg.isTelegramWebApp.value) {
    tg.hapticImpact('medium')
  }
}

// Add applicant as driver
const addApplicantAsDriver = () => {
  osgoStore.addApplicantAsDriver()
  if (tg.isTelegramWebApp.value) {
    tg.hapticImpact('medium')
  }
}

// Remove driver
const removeDriver = (index: number) => {
  osgoStore.removeDriver(index)
  if (tg.isTelegramWebApp.value) {
    tg.hapticImpact('light')
  }
}

// Check if driver can be verified
const canVerifyDriver = (driver: Driver): boolean => {
  return !!(
    driver.passportSeries &&
    driver.passportNumber &&
    driver.birthDate
  )
}

// Verify driver
const verifyDriver = async (index: number) => {
  try {
    const driver = osgo.value.drivers[index]
    const verifiedDriver = await osgoStore.verifyDriver(driver)
    osgoStore.updateDriver(index, verifiedDriver)

    if (tg.isTelegramWebApp.value) {
      tg.hapticNotification('success')
    }
  } catch (error) {
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

/* Info card */
.info-card {
  display: flex;
  gap: 12px;
  padding: 16px;
  background: #EFF6FF;
  border: 1px solid #BFDBFE;
  border-radius: 12px;
  color: #1E40AF;
}

.info-card i {
  font-size: 24px;
  flex-shrink: 0;
}

.info-title {
  font-weight: 600;
  margin-bottom: 4px;
}

.info-text {
  font-size: 14px;
  line-height: 1.4;
  opacity: 0.9;
}

/* Actions row */
.actions-row {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.actions-row .btn {
  flex: 1;
  min-width: 150px;
  font-size: 14px;
}

/* Empty state */
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px 20px;
  background: #F9FAFB;
  border: 2px dashed #D1D5DB;
  border-radius: 12px;
  color: #6B7280;
}

.empty-state i {
  font-size: 48px;
  margin-bottom: 12px;
  opacity: 0.5;
}

.empty-state p {
  font-size: 15px;
  font-weight: 500;
}

/* Drivers list */
.drivers-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

/* Driver card */
.driver-card {
  background: white;
  border: 2px solid #E5E7EB;
  border-radius: 12px;
  overflow: hidden;
  transition: all 0.2s ease;
}

.driver-card:hover {
  border-color: #2481CC;
  box-shadow: 0 2px 8px rgba(36, 129, 204, 0.1);
}

.driver-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 16px;
  background: #F9FAFB;
  border-bottom: 1px solid #E5E7EB;
}

.driver-number {
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: 600;
  color: #1F2937;
}

.driver-number i {
  font-size: 20px;
  color: #2481CC;
}

.btn-icon {
  width: 36px;
  height: 36px;
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: none;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn-icon.btn-danger {
  color: #EF4444;
}

.btn-icon.btn-danger:hover {
  background: #FEE2E2;
}

.btn-icon i {
  font-size: 20px;
}

.driver-content {
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.driver-info {
  padding: 12px;
  background: #ECFDF5;
  border: 1px solid #D1FAE5;
  border-radius: 8px;
}

.info-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 6px 0;
  font-size: 14px;
}

.info-label {
  color: #6B7280;
  font-weight: 500;
}

.info-value {
  color: #1F2937;
  font-weight: 600;
  text-align: right;
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

@media (max-width: 768px) {
  .step-title {
    font-size: 22px;
  }

  .actions-row .btn {
    min-width: 120px;
    font-size: 13px;
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
