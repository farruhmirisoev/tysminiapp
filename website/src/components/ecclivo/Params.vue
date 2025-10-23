<template>
  <div>
    <div class="text-lg font-bold">{{ $t('ecclivo.params.vehicleType') }}</div>
    <div class="grid gap-2 mt-2 lg:grid-cols-2">
      <CheckButton
        v-for="(type, index) in props.meta.carType"
        :active="carType.id === type.id"
        :key="index"
        :title="getLocalizedName(type)"
        :disabled="!editable"
        @click="carType = type"
      >
        {{ getLocalizedName(type) }}
      </CheckButton>
    </div>

    <div class="mt-6 text-lg font-bold">{{ $t('ecclivo.params.insurancePeriod') }}</div>
    <div class="grid gap-2 mt-2 lg:grid-cols-3">
      <CheckButton
        v-for="(item, index) in periods"
        :active="period.id === item.id"
        :key="index"
        :title="getLocalizedName(item)"
        :disabled="!editable"
        @click="period = item"
      >
        {{ getLocalizedName(item) }}
      </CheckButton>
    </div>

    <div class="mt-6 text-lg font-bold">{{ $t('ecclivo.params.driversCount') }}</div>
    <div class="grid gap-2 mt-2 lg:grid-cols-2">
      <CheckButton
        :active="!osgo.driversLimited"
        :disabled="!editable"
        :title="$t('ecclivo.params.unlimited')"
        @click="osgo = { ...osgo, driversLimited: false }"
      >
        {{ $t('ecclivo.params.unlimited') }}
      </CheckButton>
      <CheckButton
        :active="!!osgo.driversLimited"
        :disabled="!editable"
        :title="$t('ecclivo.params.limited')"
        @click="osgo = { ...osgo, driversLimited: true }"
      >
        {{ $t('ecclivo.params.limited') }}
      </CheckButton>
    </div>

    <transition name="height">
      <div v-if="osgo.driversLimited">
        <div class="mt-6 text-lg font-bold">
          {{ $t('ecclivo.params.incidentFrequency') }}
        </div>
        <div class="grid gap-2 mt-2 lg:grid-cols-2">
          <CheckButton
            v-for="({ name, nameUz, coefficient }, index) in props.meta
              .incidentFrequency"
            :active="incidentCoeff === coefficient"
            :disabled="!editable"
            :key="index"
            :title="getLocalizedName({ name, nameUz })"
            @click="incidentCoeff = coefficient"
          >
            {{ getLocalizedName({ name, nameUz }) }}
          </CheckButton>
        </div>
      </div>
    </transition>

    <div class="mt-6 text-lg font-bold">
      {{ $t('ecclivo.params.usageTerritory') }}
    </div>
    <select v-model="drivedArea" class="w-full mt-2 input uppercase">
      <option
        v-for="item in props.meta.drivedArea"
        :disabled="!editable"
        :key="item.id"
        :value="item"
      >
        {{ getLocalizedName(item) }}
      </option>
    </select>

    <div
      class="fixed right-0 px-8 py-4 text-white bg-primary rounded-l-lg bottom-4"
    >
      <div class="font-light">{{ $t('ecclivo.params.insurancePremium') }}</div>
      <div class="text-3xl">{{ formatPirce(price) }} {{ $t('common.currency') }}</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, watch } from "vue";
import { useI18n } from "vue-i18n";

import { COMPENSATION } from "@/misc/constants";
import { formatPirce } from "@/misc/filters";
import { OsgoPeriodType } from "@/models/enums/enums";
import type { EcclivoMeta } from "@/models/ecclivo_meta.model";
import type { Osgo } from "@/models/entities/contract$Osgo";

import CheckButton from "@/components/calculator/CheckButton.vue";

const { t, locale } = useI18n();

const props = defineProps<{
  editable: boolean;
  modelValue: Osgo;
  meta: EcclivoMeta;
}>();

const emit = defineEmits<{
  (e: "update:modelValue", value: Osgo): void;
}>();

const osgo = computed({
  get: () => props.modelValue,
  set: (value) => emit("update:modelValue", value),
});

// Helper function to get the localized name based on current locale
function getLocalizedName(item: any): string {
  if (locale.value === 'uz' && item.nameUz) {
    return item.nameUz;
  }
  return item.name || '';
}

const carType = computed({
  get: () => {
    if (!osgo.value.vehicle?.carType) {
      const fallback = props.meta.carType[0];
      emit("update:modelValue", {
        ...osgo.value,
        vehicle: { ...osgo.value.vehicle, carType: fallback },
      });
      return fallback;
    }
    return osgo.value.vehicle?.carType;
  },
  set: (value) =>
    emit("update:modelValue", {
      ...osgo.value,
      vehicle: { ...osgo.value.vehicle, carType: value },
    }),
});

const periods = computed(() =>
  props.meta.period.filter(
    ({ periodType }) => periodType !== OsgoPeriodType.FOREIGN
  )
);

const period = computed({
  get: () => {
    if (!osgo.value.period) {
      const fallback = periods.value[0];
      emit("update:modelValue", { ...osgo.value, period: fallback });
      return fallback;
    }
    return osgo.value.period;
  },
  set: (value) => emit("update:modelValue", { ...osgo.value, period: value }),
});

const incidentCoeff = computed({
  get: () => {
    if (!osgo.value.incidentCoeff) {
      const fallback = props.meta.incidentFrequency[0].coefficient;
      emit("update:modelValue", { ...osgo.value, incidentCoeff: fallback });
      return fallback;
    }
    return osgo.value.incidentCoeff;
  },
  set: (value) =>
    emit("update:modelValue", { ...osgo.value, incidentCoeff: value }),
});

const drivedArea = computed({
  get: () => {
    if (!osgo.value.drivedArea) {
      const fallback = props.meta.drivedArea[0];
      emit("update:modelValue", { ...osgo.value, drivedArea: fallback });
      return fallback;
    }
    return osgo.value.drivedArea;
  },
  set: (value) =>
    emit("update:modelValue", { ...osgo.value, drivedArea: value }),
});

const price = computed(() => {
  const baseCoefficient = carType.value.tariffCompany!;

  const coefficient =
    baseCoefficient *
    period.value.coefficient *
    (osgo.value.driversLimited ? incidentCoeff.value : 3) *
    osgo.value.drivedArea?.coefficient;

  return Math.round(
    coefficient > 5 * baseCoefficient
      ? COMPENSATION * 5 * baseCoefficient
      : (COMPENSATION * coefficient) / 100
  );
});

watch(
  () => osgo.value.driversLimited,
  (driversLimited) => {
    if (!driversLimited) {
      delete osgo.value.incidentCoeff;
    }
  }
);
</script>
