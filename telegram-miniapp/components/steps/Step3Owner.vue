<template>
  <div class="step-container">
    <div class="step-header">
      <h2 class="step-title">{{ t('step3.title') }}</h2>
      <p class="step-description">
        {{ t('step3.description') }}
      </p>
    </div>

    <div class="step-content">
      <!-- Owner Section -->
      <div class="subsection">
        <h3 class="subsection-title">{{ t('step3.owner') }}</h3>

        <!-- Passport Series -->
        <div class="form-section">
          <InputField
            v-model="owner.passportSeries"
            :label="t('step3.passportSeries')"
            :placeholder="t('step3.passportSeriesPlaceholder')"
            :disabled="!osgoStore.isEditable"
            :max-length="2"
            uppercase
            required
          />
        </div>

        <!-- Passport Number -->
        <div class="form-section">
          <InputField
            v-model="owner.passportNumber"
            :label="t('step3.passportNumber')"
            :placeholder="t('step3.passportNumberPlaceholder')"
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
            :label="t('step3.birthDate')"
            type="text"
            date-mask
            placeholder="31-12-2025"
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
              <span>{{ osgoStore.ownerVerified ? t('step3.verified') : t('step3.verifyOwner') }}</span>
            </template>
          </button>
        </div>

        <!-- Owner Verified Info -->
        <Transition name="fade">
          <div v-if="osgoStore.ownerVerified && owner.id" class="info-card success">
            <div class="card-header">
              <i class="bx bx-check-circle"></i>
              <span>{{ t('step3.ownerFound') }}</span>
            </div>
            <div class="card-content">
              <div class="info-grid">
                <div class="info-item">
                  <div class="info-label">{{ t('step3.passportIssueDate') }}</div>
                  <div class="info-value">{{ owner.passportIssueDate ? formatDisplayDate(owner.passportIssueDate) : '-' }}</div>
                </div>
                <div class="info-item">
                  <div class="info-label">{{ t('step3.pinfl') }}</div>
                  <div class="info-value">{{ owner.nationalIdentifier || '-' }}</div>
                </div>
                <div class="info-item info-item-wide">
                  <div class="info-label">{{ t('step3.issuedBy') }}</div>
                  <div class="info-value">{{ owner.passportIssuedBy || '-' }}</div>
                </div>
                <div class="info-item">
                  <div class="info-label">{{ t('step3.lastName') }}</div>
                  <div class="info-value">{{ owner.lastName || '-' }}</div>
                </div>
                <div class="info-item">
                  <div class="info-label">{{ t('step3.firstName') }}</div>
                  <div class="info-value">{{ owner.firstName || '-' }}</div>
                </div>
                <div class="info-item">
                  <div class="info-label">{{ t('step3.middleName') }}</div>
                  <div class="info-value">{{ owner.middleName || '-' }}</div>
                </div>
                <div class="info-item">
                  <div class="info-label">{{ t('step3.gender') }}</div>
                  <div class="info-value">{{ owner.gender ? formatGender(owner.gender, locale.value) : '-' }}</div>
                </div>
                <div class="info-item">
                  <div class="info-label">{{ t('step3.country') }}</div>
                  <div class="info-value">{{ owner.country?.langValue1 || '-' }}</div>
                </div>
                <div class="info-item">
                  <div class="info-label">{{ t('step3.region') }}</div>
                  <div class="info-value">{{ owner.region?.langValue1 || '-' }}</div>
                </div>
                <div class="info-item">
                  <div class="info-label">{{ t('step3.district') }}</div>
                  <div class="info-value">{{ owner.district?.langValue1 || '-' }}</div>
                </div>
                <div class="info-item">
                  <div class="info-label">{{ t('step3.street') }}</div>
                  <div class="info-value">{{ owner.street || '-' }}</div>
                </div>
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
          <span>{{ t('step3.ownerIsApplicant') }}</span>
        </label>
      </div>

      <!-- Applicant Section (if different from owner) -->
      <Transition name="slide-down">
        <div v-if="!osgo.applicantIsOwner" class="subsection">
          <h3 class="subsection-title">{{ t('step3.applicant') }}</h3>

          <!-- Passport Series -->
          <div class="form-section">
            <InputField
              v-model="applicant.passportSeries"
              :label="t('step3.passportSeries')"
              :placeholder="t('step3.passportSeriesPlaceholder')"
              :disabled="!osgoStore.isEditable"
              :max-length="2"
              uppercase
              required
            />
          </div>

          <!-- Passport Number -->
          <div class="form-section">
            <InputField
              v-model="applicant.passportNumber"
              :label="t('step3.passportNumber')"
              :placeholder="t('step3.passportNumberPlaceholder')"
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
              :label="t('step3.birthDate')"
              type="text"
              date-mask
              placeholder="DD-MM-YYYY"
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
                <span>{{ osgoStore.applicantVerified ? t('step3.verified') : t('step3.verifyApplicant') }}</span>
              </template>
            </button>
          </div>

          <!-- Applicant Verified Info -->
          <Transition name="fade">
            <div v-if="osgoStore.applicantVerified && applicant.id" class="info-card success">
              <div class="card-header">
                <i class="bx bx-check-circle"></i>
                <span>{{ t('step3.applicantFound') }}</span>
              </div>
              <div class="card-content">
                <div class="info-grid">
                  <div class="info-item">
                    <div class="info-label">{{ t('step3.passportIssueDate') }}</div>
                    <div class="info-value">{{ applicant.passportIssueDate ? formatDisplayDate(applicant.passportIssueDate) : '-' }}</div>
                  </div>
                  <div class="info-item">
                    <div class="info-label">{{ t('step3.pinfl') }}</div>
                    <div class="info-value">{{ applicant.nationalIdentifier || '-' }}</div>
                  </div>
                  <div class="info-item info-item-wide">
                    <div class="info-label">{{ t('step3.issuedBy') }}</div>
                    <div class="info-value">{{ applicant.passportIssuedBy || '-' }}</div>
                  </div>
                  <div class="info-item">
                    <div class="info-label">{{ t('step3.lastName') }}</div>
                    <div class="info-value">{{ applicant.lastName || '-' }}</div>
                  </div>
                  <div class="info-item">
                    <div class="info-label">{{ t('step3.firstName') }}</div>
                    <div class="info-value">{{ applicant.firstName || '-' }}</div>
                  </div>
                  <div class="info-item">
                    <div class="info-label">{{ t('step3.middleName') }}</div>
                    <div class="info-value">{{ applicant.middleName || '-' }}</div>
                  </div>
                  <div class="info-item">
                    <div class="info-label">{{ t('step3.gender') }}</div>
                    <div class="info-value">{{ applicant.gender ? formatGender(applicant.gender, locale.value) : '-' }}</div>
                  </div>
                  <div class="info-item">
                    <div class="info-label">{{ t('step3.country') }}</div>
                    <div class="info-value">{{ applicant.country?.langValue1 || '-' }}</div>
                  </div>
                  <div class="info-item">
                    <div class="info-label">{{ t('step3.region') }}</div>
                    <div class="info-value">{{ applicant.region?.langValue1 || '-' }}</div>
                  </div>
                  <div class="info-item">
                    <div class="info-label">{{ t('step3.district') }}</div>
                    <div class="info-value">{{ applicant.district?.langValue1 || '-' }}</div>
                  </div>
                  <div class="info-item">
                    <div class="info-label">{{ t('step3.street') }}</div>
                    <div class="info-value">{{ applicant.street || '-' }}</div>
                  </div>
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
import { formatDisplayDate, formatGender } from '~/utils/formatting'

const osgoStore = useOsgoStore()
const tg = useTelegramWebApp()
const { locale, t } = useI18n()

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

.info-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;
}

.info-item {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.info-item-wide {
  grid-column: 1 / -1;
}

.info-label {
  font-size: 13px;
  color: #6B7280;
  font-weight: 500;
}

.info-value {
  font-size: 14px;
  color: #1F2937;
  font-weight: 600;
  word-break: break-word;
}

/* Legacy info-row styles for backward compatibility */
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

  .info-grid {
    grid-template-columns: 1fr;
    gap: 12px;
  }

  .info-item-wide {
    grid-column: 1;
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
