<template>
    <div class="min-h-screen flex flex-col">
        <!-- Fixed Header -->
        <header
            class="fixed top-0 left-0 right-0 bg-white shadow-sm z-50"
            style="height: 60px"
        >
            <AppHeader />
        </header>

        <!-- Main Content Area with proper spacing -->
        <main
            class="flex-1 overflow-y-auto"
            style="margin-top: 140px; margin-bottom: 70px; padding: 24px 16px"
        >
            <div class="max-w-3xl mx-auto">
                <!-- Step Content -->
                <Transition name="fade" mode="out-in">
                    <Step1Params
                        v-if="osgoStore.currentStep === STEPS.PARAMS"
                        :key="STEPS.PARAMS"
                    />
                    <Step2Vehicle
                        v-else-if="osgoStore.currentStep === STEPS.VEHICLE"
                        :key="STEPS.VEHICLE"
                    />
                    <Step3Owner
                        v-else-if="osgoStore.currentStep === STEPS.OWNER"
                        :key="STEPS.OWNER"
                    />
                    <Step5Summary
                        v-else-if="osgoStore.currentStep === STEPS.SUMMARY"
                        :key="STEPS.SUMMARY"
                    />
                    <Step6Payment
                        v-else-if="osgoStore.currentStep === STEPS.PAYMENT"
                        :key="STEPS.PAYMENT"
                    />
                </Transition>
            </div>
        </main>

        <!-- Fixed Footer -->
        <footer
            class="fixed bottom-0 left-0 right-0 bg-white border-t shadow-sm z-50"
            style="height: 70px"
        >
            <AppFooter />
        </footer>

        <!-- Premium Badge (floating, visible on step 1) -->
        <!--
    <Transition name="slide-up">
      <div
        v-if="osgoStore.currentStep === STEPS.PARAMS && osgoStore.calculatedPremium > 0"
        class="fixed right-4 z-40 px-6 py-4 bg-primary text-white rounded-l-2xl shadow-lg"
        style="bottom: 90px;"
      >
        <div class="text-xs font-light opacity-90">Страховая премия</div>
        <div class="text-2xl font-bold">
          {{ formatPrice(osgoStore.calculatedPremium) }}
        </div>
      </div>
    </Transition>
    --></div>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, watch } from "vue";
import { useOsgoStore } from "~/stores/osgo";
import { useMetaStore } from "~/stores/meta";
import { STEPS } from "~/utils/constants";
import { formatPrice } from "~/utils/formatting";

// Protect this page with auth middleware
definePageMeta({
  middleware: 'auth'
})

// Explicit component imports
import AppHeader from "~/components/layout/AppHeader.vue";
import AppFooter from "~/components/layout/AppFooter.vue";
import Step1Params from "~/components/steps/Step1Params.vue";
import Step2Vehicle from "~/components/steps/Step2Vehicle.vue";
import Step3Owner from "~/components/steps/Step3Owner.vue";
import Step5Summary from "~/components/steps/Step5Summary.vue";
import Step6Payment from "~/components/steps/Step6Payment.vue";

const osgoStore = useOsgoStore();
const metaStore = useMetaStore();
const tg = useTelegramWebApp();

// Initialize on mount
onMounted(async () => {
    console.log("[IndexPage] Mounted");

    // Ensure metadata is loaded
    await metaStore.lazyFetch();

    // Initialize OSGO store
    osgoStore.initialize();

    // Try to restore from session storage
    const restored = osgoStore.loadFromSession();
    if (restored) {
        console.log("[IndexPage] Restored data from session");
    }

    // Setup Telegram back button
    if (tg.isTelegramWebApp.value) {
        tg.showBackButton(() => {
            if (osgoStore.currentStep > 0) {
                osgoStore.previousStep();
            } else {
                tg.close();
            }
        });
    }

    // Auto-save on changes
    const stopWatch = watch(
        () => osgoStore.osgo,
        () => {
            osgoStore.saveToSession();
        },
        { deep: true },
    );

    // Cleanup watcher on unmount
    onUnmounted(() => {
        stopWatch();
    });
});

// Cleanup on unmount
onUnmounted(() => {
    // Save current state
    osgoStore.saveToSession();

    // Hide Telegram buttons
    if (tg.isTelegramWebApp.value) {
        tg.hideBackButton();
        tg.hideMainButton();
    }
});

// Setup head
useHead({
    title: "OSGO Insurance - ECCLIVO",
    meta: [
        {
            name: "description",
            content: "Purchase OSGO insurance policy through Telegram",
        },
    ],
});
</script>

<style scoped>
/* Transition animations */
.fade-enter-active,
.fade-leave-active {
    transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
    opacity: 0;
}

.slide-up-enter-active,
.slide-up-leave-active {
    transition: all 0.3s ease;
}

.slide-up-enter-from {
    transform: translateY(20px);
    opacity: 0;
}

.slide-up-leave-to {
    transform: translateY(20px);
    opacity: 0;
}
</style>
