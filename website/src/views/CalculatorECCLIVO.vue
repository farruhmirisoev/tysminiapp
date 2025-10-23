<template>
  <div>
    <div class="text-2xl font-bold">{{ $t('calculator.ecclivo.title') }}</div>
    <div class="text-sm font-light">
      {{ $t('calculator.ecclivo.description') }}
    </div>

    <div class="grid lg:grid-cols-3 lg:gap-8">
      <div class="mt-6 lg:col-span-2">
        <div class="text-lg font-bold">{{ $t('calculator.ecclivo.vehicleType.title') }}</div>
        <div class="grid gap-2 mt-2 lg:grid-cols-2">
          <CheckButton
            v-for="({ label }, index) in VEHICLE_TYPES"
            :active="vehicleTypeIndex === index"
            :key="index"
            :title="$t(label)"
            @click="vehicleTypeIndex = index"
          >
            {{ $t(label) }}
          </CheckButton>
        </div>

        <div class="mt-6 text-lg font-bold">{{ $t('calculator.ecclivo.period.title') }}</div>
        <div class="grid gap-2 mt-2 lg:grid-cols-3">
          <CheckButton
            v-for="({ label }, index) in PERIODS"
            :active="periodIndex === index"
            :key="index"
            :title="$t(label)"
            @click="periodIndex = index"
          >
            {{ $t(label) }}
          </CheckButton>
        </div>

        <div class="mt-6 text-lg font-bold">
          {{ $t('calculator.ecclivo.region.title') }}
        </div>
        <div class="grid gap-2 mt-2 lg:grid-cols-2">
          <CheckButton
            v-for="({ label }, index) in REGIONS"
            :active="regionIndex === index"
            :key="index"
            :title="$t(label)"
            @click="regionIndex = index"
          >
            {{ $t(label) }}
          </CheckButton>
        </div>

        <div class="mt-6 text-lg font-bold">
          {{ $t('calculator.ecclivo.drivers.title') }}
        </div>
        <div class="grid gap-2 mt-2 lg:grid-cols-2">
          <CheckButton
            v-for="({ label }, index) in LIMITS"
            :active="limitIndex === index"
            :key="index"
            :title="$t(label)"
            @click="limitIndex = index"
          >
            {{ $t(label) }}
          </CheckButton>
        </div>

        <transition name="height">
          <div v-if="incidents.length > 1">
            <div class="mt-6 text-lg font-bold">
              {{ $t('calculator.ecclivo.incidents.title') }}
            </div>
            <div class="grid gap-2 mt-2 lg:grid-cols-2">
              <CheckButton
                v-for="({ label }, index) in incidents"
                :active="incidentIndex === index"
                :key="index"
                :title="$t(label)"
                @click="incidentIndex = index"
              >
                {{ $t(label) }}
              </CheckButton>
            </div>
          </div>
        </transition>

        <hr class="mt-6 lg:hidden" />
      </div>

      <div class="relative mt-6">
        <div class="top-6 lg:sticky">
          <div class="text-lg font-bold">{{ $t('calculator.ecclivo.results.title') }}</div>

          <div class="mt-2 font-light">{{ $t('calculator.ecclivo.results.premium') }}</div>
          <div class="text-3xl">{{ formatPirce(price) }} {{ $t('calculator.ecclivo.results.currency') }}</div>

          <div class="mt-6 font-light">{{ $t('calculator.ecclivo.results.sum') }}</div>
          <div class="text-3xl">{{ formatPirce(COMPENSATION) }} {{ $t('calculator.ecclivo.results.currency') }}</div>

          <div class="mt-6 font-light">
            {{ $t('calculator.ecclivo.results.healthCoverage') }}
          </div>
          <div class="text-3xl">65%</div>

          <div class="mt-6 font-light">
            {{ $t('calculator.ecclivo.results.propertyCoverage') }}
          </div>
          <div class="text-3xl">35%</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from "vue";

import {
  COMPENSATION,
  INCIDENTS,
  LIMITS,
  PERIODS,
  REGIONS,
  VEHICLE_TYPES,
} from "@/misc/constants";
import { formatPirce } from "@/misc/filters";

import CheckButton from "@/components/calculator/CheckButton.vue";

const vehicleTypeIndex = ref(0);
const periodIndex = ref(0);
const regionIndex = ref(0);
const limitIndex = ref(0);
const incidentIndex = ref(0);

const incidents = computed(() =>
  INCIDENTS.filter(
    ({ type }) => type === "GENERAL" || (limitIndex.value && type === "LIMITED")
  )
);

const price = computed(() => {
  const coefficient =
    VEHICLE_TYPES[vehicleTypeIndex.value].coefficient *
    PERIODS[periodIndex.value].coefficient *
    REGIONS[regionIndex.value].coefficient *
    LIMITS[limitIndex.value].coefficient *
    incidents.value[incidentIndex.value].coefficient;

  return Math.round(
    coefficient > 5 * VEHICLE_TYPES[vehicleTypeIndex.value].coefficient
      ? COMPENSATION * 5 * VEHICLE_TYPES[vehicleTypeIndex.value].coefficient
      : (COMPENSATION * coefficient) / 100
  );
});

watch(incidents, () => (incidentIndex.value = 0));
</script>
