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
                <div v-if="driver.id" class="driver-info">
                  <div class="driver-info-grid">
                    <!-- Passport Information -->
                    <div v-if="driver.passportIssueDate" class="info-item">
                      <div class="info-label">{{ t('step3.passportIssueDate') }}</div>
                      <div class="info-value">{{ formatDisplayDate(driver.passportIssueDate) }}</div>
                    </div>
                    <div v-if="driver.pinfl" class="info-item">
                      <div class="info-label">{{ t('step3.pinfl') }}</div>
                      <div class="info-value">{{ driver.pinfl }}</div>
                    </div>
                    <div v-if="driver.passportIssuedBy" class="info-item info-item-wide">
                      <div class="info-label">{{ t('step3.issuedBy') }}</div>
                      <div class="info-value">{{ driver.passportIssuedBy }}</div>
                    </div>

                    <!-- Personal Information -->
                    <div v-if="driver.lastName" class="info-item">
                      <div class="info-label">{{ t('step3.lastName') }}</div>
                      <div class="info-value">{{ driver.lastName }}</div>
                    </div>
                    <div v-if="driver.firstName" class="info-item">
                      <div class="info-label">{{ t('step3.firstName') }}</div>
                      <div class="info-value">{{ driver.firstName }}</div>
                    </div>
                    <div v-if="driver.middleName" class="info-item">
                      <div class="info-label">{{ t('step3.middleName') }}</div>
                      <div class="info-value">{{ driver.middleName }}</div>
                    </div>
                    <div v-if="driver.gender" class="info-item">
                      <div class="info-label">{{ t('step3.gender') }}</div>
                      <div class="info-value">{{ formatGender(driver.gender, locale.value) }}</div>
                    </div>
                    <div v-if="driver.address" class="info-item info-item-full">
                      <div class="info-label">{{ t('step3.address') }}</div>
                      <div class="info-value">{{ driver.address }}</div>
                    </div>

                    <!-- License Information -->
                    <div v-if="driver.licenseSeries" class="info-item">
                      <div class="info-label">{{ t('step4.licenseSeries') }}</div>
                      <div class="info-value">{{ driver.licenseSeries }}</div>
                    </div>
                    <div v-if="driver.licenseNumber" class="info-item">
                      <div class="info-label">{{ t('step4.licenseNumber') }}</div>
                      <div class="info-value">{{ driver.licenseNumber }}</div>
                    </div>
                    <div v-if="driver.licenseDate" class="info-item">
                      <div class="info-label">{{ t('step4.licenseDate') }}</div>
                      <div class="info-value">{{ formatDisplayDate(driver.licenseDate) }}</div>
                    </div>

                    <!-- Relationship -->
                    <div v-if="metaStore.relatives.length > 0" class="info-item">
                      <div class="info-label">{{ t('step4.relationship') }}</div>
                      <select
                        v-if="osgoStore.isEditable"
                        :value="driver.relative?.id || ''"
                        class="info-select"
                        @change="updateDriverRelative(index, $event)"
                      >
                        <option value="">{{ t('step4.selectRelationship') }}</option>
                        <option
                          v-for="relative in metaStore.relatives"
                          :key="relative.id"
                          :value="relative.id"
                        >
                          {{ getLocalizedName(relative) }}
                        </option>
                      </select>
                      <div v-else class="info-value">
                        {{ driver.relative ? getLocalizedName(driver.relative) : '-' }}
                      </div>
                    </div>
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
import { useMetaStore } from '~/stores/meta'
import type { Driver } from '~/types/osgo'
import { formatDisplayDate, formatGender, getLocalizedName } from '~/utils/formatting'

const osgoStore = useOsgoStore()
const metaStore = useMetaStore()
const tg = useTelegramWebApp()
const { t, locale } = useI18n()

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
  if (!osgoStore.isEditable) return
  
  try {
    osgoStore.addDriver()
    if (tg.isTelegramWebApp.value) {
      tg.hapticImpact('light')
    }
    console.log('[Step4Drivers] Driver added, total drivers:', osgo.value.drivers.length)
  } catch (error) {
    console.error('[Step4Drivers] Error adding driver:', error)
    if (tg.isTelegramWebApp.value) {
      tg.showAlert('Ошибка при добавлении водителя')
    }
  }
}

// Add owner as driver
const addOwnerAsDriver = () => {
  if (!osgoStore.isEditable || !osgoStore.ownerVerified) {
    if (tg.isTelegramWebApp.value) {
      tg.showAlert('Сначала необходимо проверить данные владельца')
    }
    return
  }
  
  if (!owner.value.passportSeries || !owner.value.passportNumber || !owner.value.birthDate) {
    if (tg.isTelegramWebApp.value) {
      tg.showAlert('Данные владельца не заполнены')
    }
    return
  }
  
  try {
    osgoStore.addOwnerAsDriver()
    if (tg.isTelegramWebApp.value) {
      tg.hapticImpact('medium')
    }
    console.log('[Step4Drivers] Owner added as driver, total drivers:', osgo.value.drivers.length)
  } catch (error) {
    console.error('[Step4Drivers] Error adding owner as driver:', error)
    if (tg.isTelegramWebApp.value) {
      tg.showAlert('Ошибка при добавлении владельца как водителя')
    }
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
  const driver = osgo.value.drivers[index]
  
  if (!canVerifyDriver(driver)) {
    return
  }

  try {
    const verifiedDriver = await osgoStore.verifyDriver(driver)
    
    // Check if verification returned valid data
    if (!verifiedDriver || !verifiedDriver.id) {
      throw new Error('Driver not found or verification failed')
    }
    
    osgoStore.updateDriver(index, verifiedDriver)

    if (tg.isTelegramWebApp.value) {
      tg.hapticNotification('success')
      tg.showAlert('Водитель успешно проверен')
    }
  } catch (error: any) {
    console.error('[Step4Drivers] Driver verification error:', error)
    
    if (tg.isTelegramWebApp.value) {
      tg.hapticNotification('error')
      tg.showAlert(error?.message || 'Ошибка при проверке водителя')
    }
  }
}

// Update driver relative
const updateDriverRelative = (index: number, event: Event) => {
  const target = event.target as HTMLSelectElement
  const relativeId = target.value
  const driver = osgo.value.drivers[index]
  
  if (driver) {
    if (relativeId) {
      const relative = metaStore.relatives.find(r => r.id === relativeId)
      driver.relative = relative || null
    } else {
      driver.relative = null
    }
    osgoStore.updateDriver(index, driver)
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
  padding: 16px;
  background: #ECFDF5;
  border: 1px solid #D1FAE5;
  border-radius: 8px;
  margin-top: 12px;
}

.driver-info-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
}

.info-item {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.info-item-wide {
  grid-column: span 2;
}

.info-item-full {
  grid-column: 1 / -1;
}

.info-label {
  font-size: 12px;
  color: #6B7280;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.info-value {
  font-size: 14px;
  color: #1F2937;
  font-weight: 600;
  word-break: break-word;
}

.info-select {
  width: 100%;
  padding: 8px 12px;
  border: 1px solid #D1D5DB;
  border-radius: 6px;
  background: white;
  font-size: 14px;
  color: #1F2937;
  cursor: pointer;
  transition: border-color 0.2s;
}

.info-select:hover {
  border-color: #2481CC;
}

.info-select:focus {
  outline: none;
  border-color: #2481CC;
  box-shadow: 0 0 0 3px rgba(36, 129, 204, 0.1);
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

  .driver-info-grid {
    grid-template-columns: 1fr;
  }

  .info-item-wide,
  .info-item-full {
    grid-column: 1;
  }

  .info-value {
    text-align: left;
  }
}
</style>
