<template>
  <div class="step-container">
    <div class="step-header">
      <h2 class="step-title">{{ t('step5.title') }}</h2>
      <p class="step-description">
        {{ t('step5.description') }}
      </p>
    </div>

    <div class="step-content">
      <!-- Policy Summary -->
      <div class="summary-section">
        <h3 class="section-title">
          <i class="bx bx-file-blank"></i>
          <span>{{ t('step5.policyInfo') }}</span>
        </h3>

        <!-- Owner Info -->
        <div class="summary-card">
          <div class="card-title">{{ t('step3.owner') }}</div>
          <div class="card-content">
            <div class="info-row">
              <span class="info-value-full">
                {{ owner.name || '-' }}{{ owner.birthDate ? ` (${owner.birthDate})` : '' }}
              </span>
            </div>
          </div>
        </div>

        <!-- Applicant Info -->
        <div class="summary-card">
          <div class="card-title">{{ t('step3.applicant') }}</div>
          <div class="card-content">
            <div class="info-row">
              <span class="info-value-full">
                {{ (osgo.applicantIsOwner ? owner : applicant).name || '-' }}{{ (osgo.applicantIsOwner ? owner : applicant).birthDate ? ` (${(osgo.applicantIsOwner ? owner : applicant).birthDate})` : '' }}
              </span>
            </div>
          </div>
        </div>

        <!-- Vehicle Info -->
        <div class="summary-card">
          <div class="card-title">{{ t('step5.vehicleInfo') }}</div>
          <div class="card-content">
            <div class="info-row">
              <span class="info-value-full">
                {{ osgo.vehicle?.modelName || osgo.vehicle?.model || '-' }}
                {{ osgo.vehicle?.govNumber ? ` (${osgo.vehicle.govNumber})` : '' }}
              </span>
            </div>
          </div>
        </div>


        <!-- Period & Territory -->
        <div class="summary-card">
          <div class="card-title">{{ t('step5.policyInfo') }}</div>
          <div class="card-content">
            <div class="info-row">
              <span class="info-value-full">{{ getPeriodName() }}</span>
            </div>
            <div class="info-row">
              <span class="info-value-full">{{ getAreaName() }}</span>
            </div>
            <div class="info-row">
              <span class="info-value-full">
                {{ osgo.driversLimited ? t('step5.driversLimited', { count: osgo.drivers?.length || 0 }) : t('step5.noDriversLimitation') }}
              </span>
            </div>
          </div>
        </div>

        <!-- Insurance Amount -->
        <div class="summary-card">
          <div class="card-title">{{ t('step5.compensation') }}</div>
          <div class="card-content">
            <div class="info-row">
              <span class="info-value-full">{{ formatPrice(COMPENSATION) }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Contact Information -->
      <div class="summary-section">
        <h3 class="section-title">
          <i class="bx bx-phone"></i>
          <span>{{ t('step5.contactInfo') }}</span>
        </h3>

        <div class="form-section">
          <InputField
            v-model="phone"
            :label="t('step5.phone')"
            :placeholder="t('step5.phonePlaceholder')"
            type="tel"
            icon="bx bx-phone"
            input-mode="tel"
            :disabled="!osgoStore.isEditable"
            required
          />
        </div>

        <div class="form-section">
          <InputField
            v-model="osgo.contractStartDate"
            :label="t('step5.startDate')"
            type="text"
            date-mask
            :placeholder="t('step5.startDatePlaceholder')"
            icon="bx bx-calendar"
            :disabled="!osgoStore.isEditable"
            required
          />
        </div>

        <div v-if="osgo.contractEndDate" class="form-section">
          <InputField
            :model-value="osgo.contractEndDate"
            :label="t('step5.endDate')"
            type="text"
            date-mask
            :placeholder="t('step5.startDatePlaceholder')"
            icon="bx bx-calendar"
            disabled
          />
        </div>
      </div>

      <!-- Premium Display -->
      <div class="premium-section">
        <div class="premium-card-large">
          <div class="premium-header">
            <i class="bx bx-shield-alt-2"></i>
            <span>{{ t('step5.premium') }}</span>
          </div>
          <div class="premium-amount-large">
            {{ formatPrice(osgoStore.calculatedPremium) }}
          </div>
        </div>
      </div>

    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { useOsgoStore } from '~/stores/osgo'
import { useMetaStore } from '~/stores/meta'
import { formatPrice, formatPassport } from '~/utils/formatting'
import { COMPENSATION } from '~/utils/constants'

// Format number with thousand separators (like website's formatPirce)
const formatPriceNumber = (value: number): string => {
  return value.toString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, '$1 ')
}

const osgoStore = useOsgoStore()
const metaStore = useMetaStore()
const tg = useTelegramWebApp()
const api = useApi()

const osgo = computed(() => osgoStore.osgo)
const owner = computed(() => osgoStore.owner)
const applicant = computed(() => osgoStore.applicant)
const fundData = computed(() => osgoStore.fundData)
const saving = ref(false)

// Phone number with two-way binding
const phone = computed({
  get: () => {
    const party = osgo.value.applicantIsOwner ? owner.value : applicant.value
    return party.phone || ''
  },
  set: (value: string) => {
    if (osgo.value.applicantIsOwner) {
      owner.value.phone = value
      osgo.value.party = owner.value
    } else {
      applicant.value.phone = value
      osgo.value.party = applicant.value
    }
  }
})

// Helper methods
const { locale, t } = useI18n()

const getCarTypeName = (): string => {
  if (!osgo.value.vehicle?.carType) return '-'
  return metaStore.getLocalizedName(osgo.value.vehicle.carType, locale.value || 'uz')
}

const getPeriodName = (): string => {
  if (!osgo.value.period) return '-'
  return metaStore.getLocalizedName(osgo.value.period, locale.value || 'uz')
}

const getAreaName = (): string => {
  if (!osgo.value.drivedArea) return '-'
  return metaStore.getLocalizedName(osgo.value.drivedArea, locale.value || 'uz')
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

.summary-section {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.section-title {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 18px;
  font-weight: 600;
  color: #1F2937;
  margin-bottom: 4px;
}

.section-title i {
  font-size: 22px;
  color: #2481CC;
}

.summary-card {
  background: white;
  border: 2px solid #E5E7EB;
  border-radius: 12px;
  overflow: hidden;
}

.card-title {
  padding: 12px 16px;
  background: #F9FAFB;
  border-bottom: 1px solid #E5E7EB;
  font-weight: 600;
  font-size: 15px;
  color: #1F2937;
}

.card-content {
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 10px;
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

.info-value-full {
  color: #1F2937;
  font-weight: 600;
  text-align: left;
  width: 100%;
}

.form-section {
  width: 100%;
}

/* Premium Section */
.premium-section {
  margin: 8px 0;
}

.premium-card-large {
  background: linear-gradient(135deg, #2481CC 0%, #3A91DC 100%);
  border-radius: 16px;
  padding: 24px;
  color: white;
  text-align: center;
  box-shadow: 0 8px 20px rgba(36, 129, 204, 0.3);
}

.premium-header {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  font-size: 16px;
  font-weight: 600;
  opacity: 0.95;
  margin-bottom: 12px;
}

.premium-header i {
  font-size: 24px;
}

.premium-amount-large {
  font-size: 36px;
  font-weight: 700;
  margin-bottom: 8px;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.premium-details-text {
  font-size: 14px;
  opacity: 0.9;
}



.fade-enter-active,
.fade-leave-active {
  transition: all 0.4s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: scale(0.95);
}

/* Mobile responsive */
@media (max-width: 768px) {
  .step-title {
    font-size: 22px;
  }

  .premium-amount-large {
    font-size: 32px;
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
