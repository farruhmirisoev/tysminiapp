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
                                <option
                                    v-for="frequency in metaStore.incidentFrequencies"
                                    :key="frequency.id"
                                    :value="frequency.coefficient"
                                >
                                    {{ getLocalizedName(frequency) }}
                                </option>
                            </select>
                            <div class="select-icon">
                                <i class="bx bx-chevron-down text-primary"></i>
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
                    v-if="premiumDisplay > 0"
                    class="premium-card"
                >
                    <div class="premium-card-content">
                        <div class="premium-label">
                            <i class="bx bx-shield-alt-2"></i>
                            <span>{{ t('step1.premium') }}</span>
                        </div>
                        <div class="premium-amount">
                            {{ formatPrice(premiumDisplay) }}
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
import { computed, onMounted, watch, nextTick } from "vue";
import { useOsgoStore } from "~/stores/osgo";
import { useMetaStore } from "~/stores/meta";
import type {
    CarType,
    Period,
    IncidentFrequency,
    DrivedArea,
} from "~/types/osgo";
import { formatPrice, toCapitalCase } from "~/utils/formatting";

const osgoStore = useOsgoStore();
const metaStore = useMetaStore();
const tg = useTelegramWebApp();
const { locale, t } = useI18n();

// Reactive references - MUST be defined before watchers
const osgo = computed(() => osgoStore.osgo);

// Function to set defaults for all selects (first option)
// Only sets defaults if form is completely empty (no existing selections)
const setDefaults = () => {
    if (!metaStore.isLoaded) {
        return;
    }
    
    // Only set defaults if ALL required values are missing (truly empty form)
    const isFormEmpty = !osgo.value.vehicle?.carType?.id && 
                       !osgo.value.period?.id && 
                       !osgo.value.drivedArea?.id;
    
    if (!isFormEmpty) {
        // Form already has values, don't override
        return;
    }
    
    // Set first car type as default - create vehicle object if it doesn't exist
    if (metaStore.carTypes.length > 0 && !osgo.value.vehicle?.carType?.id) {
        const firstCarType = metaStore.carTypes[0];
        if (!osgo.value.vehicle) {
            // Create new vehicle object with carType - this triggers reactivity
            osgo.value.vehicle = {
                govNumber: "",
                techPassportSeries: "",
                techPassportNumber: "",
                carType: firstCarType,
            };
        } else {
            // Vehicle exists but no carType - set it directly
            osgo.value.vehicle.carType = firstCarType;
        }
    }
    
    // Set first period as default - directly assign to trigger reactivity
    if (metaStore.periods.length > 0 && !osgo.value.period?.id) {
        const firstPeriod = metaStore.periods[0];
        osgo.value.period = firstPeriod;
    }
    
    // Set first drived area as default - directly assign to trigger reactivity
    if (metaStore.drivedAreas.length > 0 && !osgo.value.drivedArea?.id) {
        const firstArea = metaStore.drivedAreas[0];
        osgo.value.drivedArea = firstArea;
    }
    
    // Ensure driversLimited defaults to false (unlimited) - first option
    if (osgo.value.driversLimited === undefined) {
        osgo.value.driversLimited = false;
    }
    
    // Set first incident frequency as default if drivers are limited
    if (osgo.value.driversLimited && !osgo.value.incidentCoeff && metaStore.incidentFrequencies.length > 0) {
        osgo.value.incidentCoeff = metaStore.incidentFrequencies[0].coefficient;
    }
    
    // Manually trigger premium calculation immediately
    osgo.value.premium = osgoStore.calculatedPremium;
    
    // Force validation recomputation by triggering reactivity
    nextTick(() => {
        osgoStore.canProceedToNextStep;
    });
};

// Watch for metadata loading - set defaults only when form is empty
watch(
    () => metaStore.isLoaded && metaStore.carTypes.length > 0 && metaStore.periods.length > 0 && metaStore.drivedAreas.length > 0,
    (isReady) => {
        if (isReady) {
            // Check if form is empty before setting defaults
            const isFormEmpty = !osgo.value.vehicle?.carType?.id && 
                               !osgo.value.period?.id && 
                               !osgo.value.drivedArea?.id;
            
            if (isFormEmpty) {
                nextTick(() => {
                    setDefaults();
                });
            }
        }
    },
    { immediate: true }
);

onMounted(async () => {
    console.log("[Step1Params] Mounted");
    console.log("[Step1Params] Meta loaded:", metaStore.isLoaded);
    console.log("[Step1Params] Car types count:", metaStore.carTypes.length);
    console.log("[Step1Params] Periods count:", metaStore.periods.length);
    
    // Wait for next tick to ensure everything is initialized
    await nextTick();
    
    // Set defaults only if form is completely empty and metadata is ready
    const isFormEmpty = !osgo.value.vehicle?.carType?.id && 
                       !osgo.value.period?.id && 
                       !osgo.value.drivedArea?.id;
    
    if (metaStore.isLoaded && 
        metaStore.carTypes.length > 0 && 
        metaStore.periods.length > 0 && 
        metaStore.drivedAreas.length > 0 &&
        isFormEmpty) {
        setDefaults();
    }
});

// Get localized name based on current language and convert to capital case
const getLocalizedName = (item: any): string => {
    const name = metaStore.getLocalizedName(item, locale.value || 'uz');
    return toCapitalCase(name);
};

// Computed property for premium display to ensure reactivity
const premiumDisplay = computed(() => {
    return osgoStore.calculatedPremium;
});

// Selected car type (for v-model on select)
const selectedCarType = computed({
    get: () => {
        const currentId = osgo.value.vehicle?.carType?.id;
        // If no value is set and metadata is loaded, return first option ID for visual display
        if (!currentId && metaStore.isLoaded && metaStore.carTypes.length > 0) {
            return metaStore.carTypes[0].id;
        }
        return currentId || "";
    },
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
    get: () => {
        const currentId = osgo.value.period?.id;
        // If no value is set and metadata is loaded, return first option ID for visual display
        if (!currentId && metaStore.isLoaded && metaStore.periods.length > 0) {
            return metaStore.periods[0].id;
        }
        return currentId || "";
    },
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
    get: () => {
        return osgo.value.incidentCoeff?.toString() || "";
    },
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
    get: () => {
        const currentId = osgo.value.drivedArea?.id;
        // If no value is set and metadata is loaded, return first option ID for visual display
        if (!currentId && metaStore.isLoaded && metaStore.drivedAreas.length > 0) {
            return metaStore.drivedAreas[0].id;
        }
        return currentId || "";
    },
    set: (id: string) => {
        if (!osgoStore.isEditable) return;
        
        const area = metaStore.findDrivedArea(id);
        if (area) {
            osgo.value.drivedArea = area;
            
            // Haptic feedback
            if (tg.isTelegramWebApp.value) {
                tg.hapticImpact("light");
            }
        }
    },
});

// Watch computed values to ensure defaults are set when fallbacks are used
// This watcher runs after all computed properties are defined
watch(
    () => [
        selectedCarType.value,
        selectedPeriod.value,
        selectedDrivedArea.value,
        metaStore.isLoaded
    ],
    ([carTypeId, periodId, areaId, isLoaded]) => {
        // Only sync if metadata is loaded and we have fallback values
        if (!isLoaded) return;
        
        let needsUpdate = false;
        
        // Sync car type if fallback is returned but not in store
        if (carTypeId && !osgo.value.vehicle?.carType?.id && metaStore.carTypes.length > 0) {
            const carType = metaStore.carTypes.find(ct => ct.id === carTypeId);
            if (carType) {
                if (!osgo.value.vehicle) {
                    // Create vehicle with carType immediately to ensure reactivity
                    osgo.value.vehicle = {
                        govNumber: "",
                        techPassportSeries: "",
                        techPassportNumber: "",
                        carType: carType,
                    };
                } else {
                    osgo.value.vehicle.carType = carType;
                }
                needsUpdate = true;
            }
        }
        
        // Sync period if fallback is returned but not in store
        if (periodId && !osgo.value.period?.id && metaStore.periods.length > 0) {
            const period = metaStore.periods.find(p => p.id === periodId);
            if (period) {
                osgo.value.period = period;
                needsUpdate = true;
            }
        }
        
        // Sync drived area if fallback is returned but not in store
        if (areaId && !osgo.value.drivedArea?.id && metaStore.drivedAreas.length > 0) {
            const area = metaStore.drivedAreas.find(a => a.id === areaId);
            if (area) {
                osgo.value.drivedArea = area;
                needsUpdate = true;
            }
        }
        
        // Force premium recalculation by triggering reactivity
        if (needsUpdate) {
            nextTick(() => {
                // The watcher in osgo store should automatically update premium
                // But we ensure it's triggered by accessing calculatedPremium
                const _ = osgoStore.calculatedPremium;
            });
        }
    },
    { immediate: true }
);
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
    margin-bottom: 16px;
}

.step-title {
    font-size: 20px;
    font-weight: 600;
    color: #1f2937;
    margin-bottom: 8px;
}

.step-description {
    font-size: 13px;
    color: #6b7280;
    line-height: 1.5;
}

.step-content {
    display: flex;
    flex-direction: column;
    gap: 16px;
}

.form-section {
    display: flex;
    flex-direction: column;
    gap: 6px;
}

.section-title {
    font-size: 13px !important;
    font-weight: 500;
    color: #1f2937;
    margin-bottom: 2px;
    line-height: 1.4;
}

/* Select wrapper */
.select-wrapper {
    position: relative;
}

.select-wrapper select {
    width: 100%;
    appearance: none;
    padding: 10px 40px 10px 14px;
    cursor: pointer;
    font-weight: 500;
    font-size: 15px;
    color: #1F2937;
    background: white;
    border: 1.5px solid #E5E7EB;
    border-radius: 12px;
    outline: none;
    transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.04), inset 0 1px 0 rgba(255, 255, 255, 0.8);
}

.select-wrapper select:hover:not(:disabled) {
    border-color: #D1D5DB;
}

.select-wrapper select:focus {
    border-color: #2481CC;
    box-shadow: 0 0 0 3px rgba(36, 129, 204, 0.12), 0 2px 4px rgba(36, 129, 204, 0.08);
    transform: translateY(-1px);
}

.select-wrapper select:disabled {
    background: #F9FAFB;
    color: #9CA3AF;
    cursor: not-allowed;
}

.select-icon {
    position: absolute;
    right: 14px;
    top: 50%;
    transform: translateY(-50%);
    pointer-events: none;
    color: #2481CC;
    font-size: 16px;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: transform 0.2s cubic-bezier(0.16, 1, 0.3, 1), color 0.2s ease;
    z-index: 1;
}

.select-icon i {
    color: inherit;
}

.select-wrapper:focus-within .select-icon {
    transform: translateY(-50%) rotate(180deg);
    color: #2481CC;
}

.select-wrapper:hover .select-icon {
    color: #2481CC;
}

.select-wrapper:has(select:disabled) .select-icon {
    color: #9CA3AF;
}

/* Premium Card - Apple Style */
.premium-card {
    background: linear-gradient(135deg, #2481cc 0%, #3a91dc 100%);
    border-radius: 18px;
    padding: 18px;
    color: white;
    box-shadow: 0 4px 20px rgba(36, 129, 204, 0.25), 0 8px 32px rgba(36, 129, 204, 0.15), inset 0 1px 0 rgba(255, 255, 255, 0.2);
    margin-top: 8px;
    position: relative;
    overflow: hidden;
}

.premium-card::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 1px;
    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.4), transparent);
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
    font-size: 18px;
    filter: drop-shadow(0 1px 2px rgba(0, 0, 0, 0.2));
}

.premium-amount {
    font-size: 26px;
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
        font-size: 13px !important;
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
