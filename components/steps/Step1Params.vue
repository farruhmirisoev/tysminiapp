<template>
    <div class="step-container">
        <!-- Loading State -->
        <div v-if="metaStore.fetching" class="loading-state">
            <div class="loading-spinner"></div>
            <p>{{ t('common.loading') }}</p>
        </div>

        <!-- Error State -->
        <div v-else-if="metaStore.error" class="error-state">
            <i class="bx bx-error-circle"></i>
            <p>{{ metaStore.error }}</p>
            <button @click="metaStore.fetchMeta(true)" class="btn-retry">
                {{ t('common.retry') }}
            </button>
        </div>

        <!-- No Data State -->
        <div
            v-else-if="!metaStore.isLoaded || metaStore.carTypes.length === 0"
            class="error-state"
        >
            <i class="bx bx-info-circle"></i>
            <p>{{ t('common.loading') }}</p>
            <p class="debug-info">
                isLoaded: {{ metaStore.isLoaded }}<br />
                carTypes: {{ metaStore.carTypes.length }}<br />
                meta: {{ metaStore.meta ? "exists" : "null" }}
            </p>
        </div>

        <!-- Content -->
        <div v-else>
            <div class="step-header">
                <h2 class="step-title">{{ t('step1.title') }}</h2>
                <p class="step-description">
                    {{ t('step1.description') }}
                </p>
            </div>

            <div class="step-content">
                <!-- Vehicle Type Selection -->
                <div class="form-section">
                    <h3 class="section-title">{{ t('step1.vehicleType') }}</h3>
                    <div class="select-wrapper">
                        <select
                            v-model="selectedCarType"
                            class="input"
                            :disabled="!osgoStore.isEditable"
                        >
                            <option value="" disabled>
                                {{ t('step1.vehicleTypePlaceholder') }}
                            </option>
                            <option
                                v-for="carType in metaStore.carTypes"
                                :key="carType.id"
                                :value="carType.id"
                            >
                                {{ getLocalizedName(carType) }}
                            </option>
                        </select>
                        <div class="select-icon">
                            <i class="bx bx-chevron-down"></i>
                        </div>
                    </div>
                </div>

                <!-- Insurance Period -->
                <div class="form-section">
                    <h3 class="section-title">{{ t('step1.period') }}</h3>
                    <div class="select-wrapper">
                        <select
                            v-model="selectedPeriod"
                            class="input"
                            :disabled="!osgoStore.isEditable"
                        >
                            <option value="" disabled>
                                {{ t('step1.periodPlaceholder') }}
                            </option>
                            <option
                                v-for="period in metaStore.periods"
                                :key="period.id"
                                :value="period.id"
                            >
                                {{ getLocalizedName(period) }}
                            </option>
                        </select>
                        <div class="select-icon">
                            <i class="bx bx-chevron-down"></i>
                        </div>
                    </div>
                </div>

                <!-- Driver Limitation (hidden, defaults to unlimited) -->
                <div class="form-section" style="display: none;">
                    <h3 class="section-title">{{ t('step1.driversLimited') }}</h3>
                    <div class="select-wrapper">
                        <select
                            v-model="selectedDriversLimited"
                            class="input"
                            :disabled="!osgoStore.isEditable"
                        >
                            <option value="false">
                                {{ t('step1.driversLimitedNo') }} - {{ t('step1.driversLimitedNoDesc') }}
                            </option>
                            <option value="true">
                                {{ t('step1.driversLimitedYes') }} - {{ t('step1.driversLimitedYesDesc') }}
                            </option>
                        </select>
                        <div class="select-icon">
                            <i class="bx bx-chevron-down"></i>
                        </div>
                    </div>
                </div>

                <!-- Incident Frequency (conditional) -->
                <Transition name="slide-down">
                    <div v-if="osgo.driversLimited" class="form-section">
                        <h3 class="section-title">{{ t('step1.incidentFrequency') }}</h3>
                        <div class="select-wrapper">
                            <select
                                v-model="selectedIncidentFrequency"
                                class="input"
                                :disabled="!osgoStore.isEditable"
                            >
                                <option value="" disabled>
                                    {{ t('step1.incidentFrequencyPlaceholder') }}
                                </option>
                                <option
                                    v-for="frequency in metaStore.incidentFrequencies"
                                    :key="frequency.id"
                                    :value="frequency.coefficient"
                                >
                                    {{ getLocalizedName(frequency) }}
                                </option>
                            </select>
                            <div class="select-icon">
                                <i class="bx bx-chevron-down"></i>
                            </div>
                        </div>
                    </div>
                </Transition>

                <!-- Usage Territory -->
                <div class="form-section">
                    <h3 class="section-title">{{ t('step1.usageTerritory') }}</h3>
                    <div class="select-wrapper">
                        <select
                            v-model="selectedDrivedArea"
                            class="input"
                            :disabled="!osgoStore.isEditable"
                        >
                            <option value="" disabled>
                                {{ t('step1.usageTerritoryPlaceholder') }}
                            </option>
                            <option
                                v-for="area in metaStore.drivedAreas"
                                :key="area.id"
                                :value="area.id"
                            >
                                {{ getLocalizedName(area) }}
                            </option>
                        </select>
                        <div class="select-icon">
                            <i class="bx bx-chevron-down"></i>
                        </div>
                    </div>
                </div>

                <!-- Premium Summary Card -->
                <div
                    v-if="osgoStore.calculatedPremium > 0"
                    class="premium-card"
                >
                    <div class="premium-card-content">
                        <div class="premium-label">
                            <i class="bx bx-shield-alt-2"></i>
                            <span>{{ t('step1.premium') }}</span>
                        </div>
                        <div class="premium-amount">
                            {{ formatPrice(osgoStore.calculatedPremium) }}
                        </div>
                    </div>
                    <!-- <div class="premium-details">
          <div class="premium-detail-item">
            <span class="premium-detail-label">Базовая ставка:</span>
            <span class="premium-detail-value">
              {{ osgo.vehicle?.carType?.tariffCompany || 0 }}
            </span>
          </div>
          <div class="premium-detail-item">
            <span class="premium-detail-label">Период:</span>
            <span class="premium-detail-value">
              ×{{ osgo.period?.coefficient || 0 }}
            </span>
          </div>
          <div class="premium-detail-item">
            <span class="premium-detail-label">Водители:</span>
            <span class="premium-detail-value">
              ×{{ osgo.driversLimited ? (osgo.incidentCoeff || 0) : 3 }}
            </span>
          </div>
          <div class="premium-detail-item">
            <span class="premium-detail-label">Территория:</span>
            <span class="premium-detail-value">
              ×{{ osgo.drivedArea?.coefficient || 0 }}
            </span>
          </div>
        </div> -->
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { computed, onMounted } from "vue";
import { useOsgoStore } from "~/stores/osgo";
import { useMetaStore } from "~/stores/meta";
import type {
    CarType,
    Period,
    IncidentFrequency,
    DrivedArea,
} from "~/types/osgo";
import { formatPrice } from "~/utils/formatting";

const osgoStore = useOsgoStore();
const metaStore = useMetaStore();
const tg = useTelegramWebApp();
const { locale, t } = useI18n();

// Debug logging on mount
onMounted(() => {
    console.log("[Step1Params] Mounted");
    console.log("[Step1Params] Meta loaded:", metaStore.isLoaded);
    console.log("[Step1Params] Car types count:", metaStore.carTypes.length);
    console.log("[Step1Params] Car types:", metaStore.carTypes);
    console.log("[Step1Params] Periods count:", metaStore.periods.length);
    console.log("[Step1Params] Meta object:", metaStore.meta);
    
    // Ensure driversLimited defaults to false (unlimited)
    if (osgo.value.driversLimited === undefined) {
        osgo.value.driversLimited = false;
    }
});

// Reactive references
const osgo = computed(() => osgoStore.osgo);

// Get localized name based on current language
const getLocalizedName = (item: any): string => {
    return metaStore.getLocalizedName(item, locale.value || 'uz');
};

// Selected car type (for v-model on select)
const selectedCarType = computed({
    get: () => osgo.value.vehicle?.carType?.id || "",
    set: (id: string) => {
        if (!osgoStore.isEditable) return;
        
        const carType = metaStore.carTypes.find(ct => ct.id === id);
        if (carType) {
            if (!osgo.value.vehicle) {
                osgo.value.vehicle = {
                    govNumber: "",
                    techPassportSeries: "",
                    techPassportNumber: "",
                };
            }
            osgo.value.vehicle.carType = carType;
            
            // Haptic feedback
            if (tg.isTelegramWebApp.value) {
                tg.hapticImpact("light");
            }
        }
    },
});

// Selected period (for v-model on select)
const selectedPeriod = computed({
    get: () => osgo.value.period?.id || "",
    set: (id: string) => {
        if (!osgoStore.isEditable) return;
        
        const period = metaStore.periods.find(p => p.id === id);
        if (period) {
            osgo.value.period = period;
            
            // Haptic feedback
            if (tg.isTelegramWebApp.value) {
                tg.hapticImpact("light");
            }
        }
    },
});

// Selected drivers limited (for v-model on select)
// Defaults to false (unlimited) if not set
const selectedDriversLimited = computed({
    get: () => {
        // Default to false (unlimited) if undefined
        if (osgo.value.driversLimited === undefined) {
            osgo.value.driversLimited = false;
        }
        return osgo.value.driversLimited ? "true" : "false";
    },
    set: (value: string) => {
        if (!osgoStore.isEditable) return;
        
        osgo.value.driversLimited = value === "true";
        
        // Clear incident coefficient if switching to unlimited
        if (!osgo.value.driversLimited) {
            osgo.value.incidentCoeff = undefined;
        }
        
        // Haptic feedback
        if (tg.isTelegramWebApp.value) {
            tg.hapticImpact("light");
        }
    },
});

// Selected incident frequency (for v-model on select)
const selectedIncidentFrequency = computed({
    get: () => osgo.value.incidentCoeff?.toString() || "",
    set: (value: string) => {
        if (!osgoStore.isEditable) return;
        
        const coefficient = parseFloat(value);
        if (!isNaN(coefficient)) {
            osgo.value.incidentCoeff = coefficient;
            
            // Haptic feedback
            if (tg.isTelegramWebApp.value) {
                tg.hapticImpact("light");
            }
        }
    },
});

// Selected drived area (for v-model on select)
const selectedDrivedArea = computed({
    get: () => osgo.value.drivedArea?.id || "",
    set: (id: string) => {
        const area = metaStore.findDrivedArea(id);
        if (area) {
            osgo.value.drivedArea = area;
        }
    },
});
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
    color: #1f2937;
    margin-bottom: 8px;
}

.step-description {
    font-size: 15px;
    color: #6b7280;
    line-height: 1.5;
}

.step-content {
    display: flex;
    flex-direction: column;
    gap: 24px;
}

.form-section {
    display: flex;
    flex-direction: column;
    gap: 12px;
}

.section-title {
    font-size: 18px;
    font-weight: 600;
    color: #1f2937;
    margin-bottom: 4px;
}

/* Select wrapper */
.select-wrapper {
    position: relative;
}

.select-wrapper select {
    width: 100%;
    appearance: none;
    padding-right: 40px;
    cursor: pointer;
    text-transform: uppercase;
    font-weight: 500;
}

.select-icon {
    position: absolute;
    right: 12px;
    top: 50%;
    transform: translateY(-50%);
    pointer-events: none;
    color: #6b7280;
    font-size: 20px;
    display: flex;
    align-items: center;
    justify-content: center;
}

/* Premium Card */
.premium-card {
    background: linear-gradient(135deg, #2481cc 0%, #3a91dc 100%);
    border-radius: 16px;
    padding: 20px;
    color: white;
    box-shadow: 0 4px 12px rgba(36, 129, 204, 0.3);
    margin-top: 8px;
}

.premium-card-content {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 16px;
    padding-bottom: 16px;
    border-bottom: 1px solid rgba(255, 255, 255, 0.2);
}

.premium-label {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 14px;
    font-weight: 500;
    opacity: 0.95;
}

.premium-label i {
    font-size: 20px;
}

.premium-amount {
    font-size: 28px;
    font-weight: 700;
    text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.premium-details {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 12px;
}

.premium-detail-item {
    display: flex;
    flex-direction: column;
    gap: 4px;
}

.premium-detail-label {
    font-size: 12px;
    opacity: 0.8;
}

.premium-detail-value {
    font-size: 16px;
    font-weight: 600;
}

/* Slide down transition for conditional section */
.slide-down-enter-active,
.slide-down-leave-active {
    transition: all 0.3s ease;
    max-height: 500px;
    overflow: hidden;
}

.slide-down-enter-from,
.slide-down-leave-to {
    max-height: 0;
    opacity: 0;
    margin-top: 0;
    margin-bottom: 0;
}

/* Mobile responsive */
@media (max-width: 768px) {
    .step-title {
        font-size: 22px;
    }

    .step-description {
        font-size: 14px;
    }

    .section-title {
        font-size: 16px;
    }

    .premium-card {
        padding: 16px;
    }

    .premium-amount {
        font-size: 24px;
    }

    .premium-details {
        grid-template-columns: 1fr;
        gap: 8px;
    }

    .premium-detail-item {
        flex-direction: row;
        justify-content: space-between;
        align-items: center;
    }
}

/* Dark mode support */
@media (prefers-color-scheme: dark) {
    .step-title {
        color: #f9fafb;
    }

    .step-description {
        color: #9ca3af;
    }

    .section-title {
        color: #f9fafb;
    }
}

/* Loading and Error States */
.loading-state,
.error-state {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 48px 24px;
    text-align: center;
    color: #6b7280;
}

.loading-spinner {
    width: 48px;
    height: 48px;
    border: 4px solid #e5e7eb;
    border-top-color: #2481cc;
    border-radius: 50%;
    animation: spin 1s linear infinite;
    margin-bottom: 16px;
}

@keyframes spin {
    to {
        transform: rotate(360deg);
    }
}

.error-state i {
    font-size: 48px;
    color: #ef4444;
    margin-bottom: 16px;
}

.btn-retry {
    margin-top: 16px;
    padding: 10px 24px;
    background: #2481cc;
    color: white;
    border: none;
    border-radius: 8px;
    font-weight: 500;
    cursor: pointer;
    transition: background 0.2s;
}

.btn-retry:hover {
    background: #1d6aa8;
}

.debug-info {
    margin-top: 12px;
    font-size: 12px;
    color: #9ca3af;
    font-family: monospace;
    text-align: left;
    background: #f3f4f6;
    padding: 12px;
    border-radius: 6px;
    line-height: 1.6;
}
</style>
