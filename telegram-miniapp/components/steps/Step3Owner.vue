<template>
  <div class="step-container">
    <div class="step-header">
      <h2 class="step-title">Информация о владельце</h2>
      <p class="step-description">
        Введите данные владельца транспортного средства
      </p>
    </div>

    <div class="step-content">
      <!-- Owner Section -->
      <div class="subsection">
        <h3 class="subsection-title">Владелец</h3>

        <!-- Passport Series -->
        <div class="form-section">
          <InputField
            v-model="owner.passportSeries"
            label="Серия паспорта"
            placeholder="AA"
            :disabled="!osgoStore.isEditable"
            :max-length="2"
            required
          />
        </div>

        <!-- Passport Number -->
        <div class="form-section">
          <InputField
            v-model="owner.passportNumber"
            label="Номер паспорта"
            placeholder="1234567"
            :disabled="!osgoStore.isEditable"
            input-mode="numeric"
            :max-length="7"
            required
          />
        </div>

        <!-- Birth Date -->
        <div class="form-section">
          <InputField
            v-model="owner.birthDate"
            label="Дата рождения"
            type="date"
            :disabled="!osgoStore.isEditable"
            required
          />
        </div>

        <!-- Verify Owner Button -->
        <div class="form-section">
          <button
            type="button"
            class="btn btn-primary w-full"
            :disabled="osgoStore.ownerVerifying"
            @click="verifyOwner"
          >
            <span v-if="osgoStore.ownerVerifying" class="spinner"></span>
            <template v-else>
              <i class="bx bx-check-circle"></i>
              <span>{{ osgoStore.ownerVerified ? 'Проверено' : 'Проверить владельца' }}</span>
            </template>
          </button>
        </div>

        <!-- Owner Verified Info -->
        <Transition name="fade">
          <div v-if="osgoStore.ownerVerified && owner.name" class="info-card success">
            <div class="card-header">
              <i class="bx bx-check-circle"></i>
              <span>Владелец найден</span>
            </div>
            <div class="card-content">
              <div class="info-row">
                <span class="info-label">ФИО:</span>
                <span class="info-value">{{ owner.name }}</span>
              </div>
              <div class="info-row" v-if="owner.address">
                <span class="info-label">Адрес:</span>
                <span class="info-value">{{ owner.address }}</span>
              </div>
            </div>
          </div>
        </Transition>
      </div>

      <!-- Owner is Applicant Checkbox -->
      <div class="form-section">
        <label class="checkbox-label">
          <input
            v-model="osgo.applicantIsOwner"
            type="checkbox"
            class="checkbox"
            :disabled="!osgoStore.isEditable"
          />
          <span>Владелец является страхователем</span>
        </label>
      </div>

      <!-- Applicant Section (if different from owner) -->
      <Transition name="slide-down">
        <div v-if="!osgo.applicantIsOwner" class="subsection">
          <h3 class="subsection-title">Страхователь</h3>

          <!-- Passport Series -->
          <div class="form-section">
            <InputField
              v-model="applicant.passportSeries"
              label="Серия паспорта"
              placeholder="AA"
              :disabled="!osgoStore.isEditable"
              :max-length="2"
              required
            />
          </div>

          <!-- Passport Number -->
          <div class="form-section">
            <InputField
              v-model="applicant.passportNumber"
              label="Номер паспорта"
              placeholder="1234567"
              :disabled="!osgoStore.isEditable"
              input-mode="numeric"
              :max-length="7"
              required
            />
          </div>

          <!-- Birth Date -->
          <div class="form-section">
            <InputField
              v-model="applicant.birthDate"
              label="Дата рождения"
              type="date"
              :disabled="!osgoStore.isEditable"
              required
            />
          </div>

          <!-- Verify Applicant Button -->
          <div class="form-section">
            <button
              type="button"
              class="btn btn-primary w-full"
              :disabled="osgoStore.applicantVerifying"
              @click="verifyApplicant"
            >
              <span v-if="osgoStore.applicantVerifying" class="spinner"></span>
              <template v-else>
                <i class="bx bx-check-circle"></i>
                <span>{{ osgoStore.applicantVerified ? 'Проверено' : 'Проверить страхователя' }}</span>
              </template>
            </button>
          </div>

          <!-- Applicant Verified Info -->
          <Transition name="fade">
            <div v-if="osgoStore.applicantVerified && applicant.name" class="info-card success">
              <div class="card-header">
                <i class="bx bx-check-circle"></i>
                <span>Страхователь найден</span>
              </div>
              <div class="card-content">
                <div class="info-row">
                  <span class="info-label">ФИО:</span>
                  <span class="info-value">{{ applicant.name }}</span>
                </div>
                <div class="info-row" v-if="applicant.address">
                  <span class="info-label">Адрес:</span>
                  <span class="info-value">{{ applicant.address }}</span>
                </div>
              </div>
            </div>
          </Transition>
        </div>
      </Transition>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useOsgoStore } from '~/stores/osgo'

const osgoStore = useOsgoStore()
const tg = useTelegramWebApp()

const osgo = computed(() => osgoStore.osgo)
const owner = computed(() => osgoStore.owner)
const applicant = computed(() => osgoStore.applicant)

const verifyOwner = async () => {
  try {
    await osgoStore.verifyOwner()
    if (tg.isTelegramWebApp.value) {
      tg.hapticNotification('success')
    }
  } catch (error) {
    if (tg.isTelegramWebApp.value) {
      tg.hapticNotification('error')
    }
  }
}

const verifyApplicant = async () => {
  try {
    await osgoStore.verifyApplicant()
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
  gap: 24px;
}

.subsection {
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: 20px;
  background: #F9FAFB;
  border-radius: 12px;
}

.subsection-title {
  font-size: 18px;
  font-weight: 600;
  color: #1F2937;
  margin-bottom: 4px;
}

.form-section {
  width: 100%;
}

.checkbox-label {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 15px;
  font-weight: 500;
  color: #1F2937;
  cursor: pointer;
  user-select: none;
}

.checkbox {
  width: 20px;
  height: 20px;
  cursor: pointer;
}

.info-card {
  background: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.info-card.success {
  border: 2px solid #10B981;
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

.btn i {
  font-size: 18px;
}

.slide-down-enter-active,
.slide-down-leave-active {
  transition: all 0.3s ease;
  max-height: 800px;
  overflow: hidden;
}

.slide-down-enter-from,
.slide-down-leave-to {
  max-height: 0;
  opacity: 0;
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

  .subsection {
    padding: 16px;
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
