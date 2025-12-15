<template>
    <header class="fixed-header">
        <div
            class="max-w-container mx-auto px-4 h-full flex flex-col justify-center"
        >
            <!-- Logo and Title Row -->
            <div class="flex items-center justify-between mb-3">
                <div class="flex items-center gap-3">
                    <!-- Logo placeholder -->

                    <div
                        class="w-10 h-10 bg-primary overflow-hidden rounded-lg flex items-center justify-center text-white font-bold text-lg"
                    >
                        <img
                            src="~/assets/img/tyslogo.png"
                            alt="Temiryo'l Sug'urta Logo"
                        />
                    </div>
                    <div>
                        <div class="text-base font-bold text-text">{{ t('header.appTitle') }}</div>
                        <div class="text-xs text-text-light">
                            Temiryo'l Sug'urta
                        </div>
                    </div>
                </div>

                <!-- Language Switcher -->
                <LanguageSwitcher />
            </div>

            <!-- Progress Bar -->
            <ProgressBar
                :current-step="currentStep"
                :total-steps="totalSteps"
            />
        </div>
    </header>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useOsgoStore } from "~/stores/osgo";

const osgoStore = useOsgoStore();
const { t } = useI18n();

const currentStep = computed(() => osgoStore.currentStep);
const totalSteps = computed(() => osgoStore.totalSteps);
</script>

<style scoped>
.fixed-header {
    background: linear-gradient(
        to bottom,
        rgba(255, 255, 255, 0.98),
        rgba(255, 255, 255, 0.95)
    );
    backdrop-filter: blur(10px);
}

/* iOS safe area support is handled globally in main.css */
</style>
