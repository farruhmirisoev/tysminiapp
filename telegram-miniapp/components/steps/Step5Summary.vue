<template>
  <div class="step-container">
    <div class="step-header">
      <h2 class="step-title">Подтверждение и оплата</h2>
      <p class="step-description">
        Проверьте данные полиса и завершите оформление
      </p>
    </div>

    <div class="step-content">
      <!-- Policy Summary -->
      <div class="summary-section">
        <h3 class="section-title">
          <i class="bx bx-file-blank"></i>
          <span>Информация о страховке</span>
        </h3>

        <!-- Owner Info -->
        <div class="summary-card">
          <div class="card-title">Собственник</div>
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
          <div class="card-title">Заявитель</div>
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
          <div class="card-title">Транспортное средство</div>
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
          <div class="card-title">Условия страхования</div>
          <div class="card-content">
            <div class="info-row">
              <span class="info-value-full">{{ getPeriodName() }}</span>
            </div>
            <div class="info-row">
              <span class="info-value-full">{{ getAreaName() }}</span>
            </div>
            <div class="info-row">
              <span class="info-value-full">
                {{ osgo.driversLimited ? `Ограниченно (${osgo.drivers?.length || 0})` : 'Не ограничено' }}
              </span>
            </div>
          </div>
        </div>

        <!-- Insurance Amount -->
        <div class="summary-card">
          <div class="card-title">Страховая сумма</div>
          <div class="card-content">
            <div class="info-row">
              <span class="info-value-full">{{ formatPriceNumber(COMPENSATION) }} сум</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Contact Information -->
      <div class="summary-section">
        <h3 class="section-title">
          <i class="bx bx-phone"></i>
          <span>Контактные данные</span>
        </h3>

        <div class="form-section">
          <InputField
            v-model="phone"
            label="Номер телефона"
            placeholder="+998 90 123 45 67"
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
            label="Дата начала действия полиса"
            type="text"
            date-mask
            placeholder="DD-MM-YYYY"
            icon="bx bx-calendar"
            :disabled="!osgoStore.isEditable"
            required
          />
        </div>

        <div v-if="osgo.contractEndDate" class="form-section">
          <InputField
            :model-value="osgo.contractEndDate"
            label="Дата окончания действия полиса"
            type="text"
            date-mask
            placeholder="DD-MM-YYYY"
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
            <span>Страховая премия</span>
          </div>
          <div class="premium-amount-large">
            {{ formatPrice(osgoStore.calculatedPremium) }} сум
          </div>
        </div>
      </div>

      <!-- Payment Buttons -->
      <div v-if="!osgo.id" class="payment-section">
        <h3 class="section-title">
          <i class="bx bx-credit-card"></i>
          <span>Выберите способ оплаты</span>
        </h3>

        <div class="payment-buttons">
          <button
            type="button"
            class="payment-btn payme"
            :disabled="saving"
            @click="handlePayment('payme')"
          >
            <div class="payment-icon">💳</div>
            <div class="payment-name">Payme</div>
          </button>

          <button
            type="button"
            class="payment-btn click"
            :disabled="saving"
            @click="handlePayment('click')"
          >
            <div class="payment-icon">🔵</div>
            <div class="payment-name">Click</div>
          </button>

          <button
            type="button"
            class="payment-btn uzum"
            :disabled="saving"
            @click="handlePayment('uzum')"
          >
            <div class="payment-icon">🟣</div>
            <div class="payment-name">Uzum</div>
          </button>
        </div>
      </div>

      <!-- Policy Created (after payment) -->
      <Transition name="fade">
        <div v-if="osgo.id && fundData" class="success-card">
          <div class="success-icon">
            <i class="bx bx-check-circle"></i>
          </div>
          <h3 class="success-title">Полис оформлен!</h3>
          <p class="success-description">
            Ваш полис ОСГО успешно оформлен и оплачен
          </p>
          <div class="policy-details">
            <div class="policy-row">
              <span class="policy-label">Серия:</span>
              <span class="policy-value">{{ fundData.seria }}</span>
            </div>
            <div class="policy-row">
              <span class="policy-label">Номер:</span>
              <span class="policy-value">{{ fundData.number }}</span>
            </div>
          </div>
        </div>
      </Transition>
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
const getCarTypeName = (): string => {
  if (!osgo.value.vehicle?.carType) return '-'
  return metaStore.getLocalizedName(osgo.value.vehicle.carType, 'ru')
}

const getPeriodName = (): string => {
  if (!osgo.value.period) return '-'
  return metaStore.getLocalizedName(osgo.value.period, 'ru')
}

const getAreaName = (): string => {
  if (!osgo.value.drivedArea) return '-'
  return metaStore.getLocalizedName(osgo.value.drivedArea, 'ru')
}

// Handle payment
const handlePayment = async (method: 'payme' | 'click' | 'uzum') => {
  if (saving.value) return

  // Validate phone number
  if (!phone.value || phone.value.trim() === '') {
    if (tg.isTelegramWebApp.value) {
      tg.hapticNotification('error')
      await tg.showAlert('Пожалуйста, введите номер телефона')
    }
    return
  }

  try {
    saving.value = true

    // Haptic feedback
    if (tg.isTelegramWebApp.value) {
      tg.hapticImpact('medium')
    }

    // Ensure policy exists - create if doesn't exist
    let policyId = osgo.value.id
    if (!policyId) {
      policyId = await osgoStore.createPolicy()
      console.log('[Step5Summary] Policy created:', policyId)
    }

    // Map payment method to API method name
    const apiMethod = method === 'payme' 
      ? 'sendSmsPayme' 
      : method === 'click' 
      ? 'sendSmsClick' 
      : 'sendSmsUzum'

    // Send payment link via SMS
    await api.sendPaymentLink(
      apiMethod as 'sendSmsPayme' | 'sendSmsClick' | 'sendSmsUzum',
      policyId,
      phone.value,
      osgoStore.calculatedPremium
    )

    console.log('[Step5Summary] Payment link sent via', apiMethod)

    // Show success message
    if (tg.isTelegramWebApp.value) {
      tg.hapticNotification('success')
      await tg.showAlert(
        `Ссылка на оплату отправлена на номер ${phone.value}. Проверьте SMS.`
      )
    }

    // Refresh fund data to check payment status
    await osgoStore.fetchFundData()

  } catch (error: any) {
    console.error('[Step5Summary] Payment error:', error)

    if (tg.isTelegramWebApp.value) {
      tg.hapticNotification('error')
      await tg.showAlert(
        error.message || 'Ошибка при отправке ссылки на оплату'
      )
    }
  } finally {
    saving.value = false
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

/* Payment Section */
.payment-section {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.payment-buttons {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;
}

.payment-btn {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 20px 16px;
  background: white;
  border: 2px solid #E5E7EB;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.2s ease;
  font-weight: 600;
}

.payment-btn:hover:not(:disabled) {
  border-color: #2481CC;
  background: rgba(36, 129, 204, 0.05);
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.payment-btn:active:not(:disabled) {
  transform: translateY(0);
}

.payment-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.payment-icon {
  font-size: 32px;
}

.payment-name {
  font-size: 14px;
  color: #1F2937;
}

/* Success Card */
.success-card {
  background: linear-gradient(135deg, #10B981 0%, #059669 100%);
  border-radius: 16px;
  padding: 32px 24px;
  color: white;
  text-align: center;
  box-shadow: 0 8px 20px rgba(16, 185, 129, 0.3);
}

.success-icon {
  display: flex;
  justify-content: center;
  margin-bottom: 16px;
}

.success-icon i {
  font-size: 64px;
  animation: checkAppear 0.5s ease;
}

@keyframes checkAppear {
  from {
    transform: scale(0);
    opacity: 0;
  }
  to {
    transform: scale(1);
    opacity: 1;
  }
}

.success-title {
  font-size: 24px;
  font-weight: 700;
  margin-bottom: 8px;
}

.success-description {
  font-size: 15px;
  opacity: 0.95;
  margin-bottom: 20px;
}

.policy-details {
  background: rgba(255, 255, 255, 0.2);
  border-radius: 12px;
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.policy-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 15px;
}

.policy-label {
  opacity: 0.9;
}

.policy-value {
  font-weight: 700;
  font-size: 18px;
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

  .payment-buttons {
    grid-template-columns: 1fr;
  }

  .payment-btn {
    flex-direction: row;
    justify-content: flex-start;
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
