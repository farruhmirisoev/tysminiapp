<template>
  <div class="text-sm">
    <div class="text-lg font-bold">{{ $t('ecclivo.summary.insuranceInfo') }}</div>
    <div class="mt-4 font-bold">{{ $t('ecclivo.summary.owner') }}</div>
    <div v-if="owner.id">{{ owner.name }}({{ owner.birthDate }})</div>
    <div v-else class="text-red-600">{{ $t('ecclivo.summary.ownerNotEntered') }}</div>

    <div class="mt-4 font-bold">{{ $t('ecclivo.summary.applicant') }}</div>
    <div v-if="applicant.id">
      {{ applicant.name }} ({{ applicant.birthDate }})
    </div>
    <div v-else class="text-red-600">{{ $t('ecclivo.summary.applicantNotEntered') }}</div>

    <div class="mt-4 font-bold">{{ $t('ecclivo.summary.vehicle') }}</div>
    <div v-if="osgo.vehicle?.id">
      {{ osgo.vehicle?.modelName }} ({{ osgo.vehicle?.govNumber }})
    </div>
    <div v-else class="text-red-600">
      {{ $t('ecclivo.summary.vehicleNotEntered') }}
    </div>

    <div class="mt-4 font-bold">{{ $t('ecclivo.summary.insurancePeriod') }}</div>
    <div>{{ getLocalizedName(osgo.period) }}</div>

    <div class="mt-4 font-bold">{{ $t('ecclivo.summary.usageTerritory') }}</div>
    <div>{{ getLocalizedName(osgo.drivedArea) }}</div>

    <div class="mt-4 font-bold">{{ $t('ecclivo.summary.driversCount') }}</div>
    <div v-if="!osgo.driversLimited">
      {{ $t(LIMITS[0].label) }}
    </div>
    <template v-else>
      <div v-if="validDrivers">
        {{ osgo.drivers?.length }}
      </div>
      <div v-else class="text-red-600">{{ $t('ecclivo.summary.driversNotEntered') }}</div>
    </template>

    <div class="mt-4 font-bold">{{ $t('ecclivo.summary.insuranceAmount') }}</div>
    <div class="text-xl">{{ formatPirce(COMPENSATION) }} {{ $t('common.currency') }}</div>

    <div class="mt-4 font-bold">{{ $t('ecclivo.summary.insurancePremium') }}</div>
    <div class="text-xl">{{ formatPirce(price) }} {{ $t('common.currency') }}</div>

    <div class="grid gap-4 mt-4 lg:grid-cols-2">
      <label class="mt-auto">
        <span class="font-bold">{{ $t('ecclivo.summary.policyStartDate') }}</span>
        <input
          v-model="osgo.contractStartDate"
          type="date"
          class="w-full mt-1 input"
          :min="dayjs().format('YYYY-MM-DD')"
          :max="dayjs('2025-12-31').format('YYYY-MM-DD')"
          :readonly="!editable"
        />
      </label>
      <label class="mt-auto">
        <span class="font-bold">{{ $t('ecclivo.summary.policyEndDate') }}</span>
        <input
          v-model="osgo.contractEndDate"
          type="date"
          class="w-full mt-1 input"
          readonly
        />
      </label>
    </div>

    <label class="block mt-4">
      <span class="font-bold">{{ $t('ecclivo.summary.applicantPhone') }}</span>
      <input
        v-model="phone"
        v-maska="'+998(##)###-##-##'"
        class="w-full mt-1 input"
        :min="dayjs().format('YYYY-MM-DD')"
        :readonly="!editable"
      />
    </label>

    <transition name="fade">
      <div v-if="saveError" class="mt-4 text-red-600">
        {{ saveError }}
      </div>
    </transition>

    <button
      v-if="editable"
      type="button"
      class="w-full mt-4 btn btn-primary"
      :disabled="
        osgo.status === BaseContractStatus.SIGNED ||
        saving ||
        !owner.id ||
        !applicant.id ||
        !osgo.vehicle?.id ||
        !(osgo.driversLimited ? validDrivers : true) ||
        !validPhone ||
        !osgo.contractStartDate
      "
      @click="save"
    >
      {{ osgo.id ? $t('ecclivo.summary.update') : $t('ecclivo.summary.send') }}
    </button>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { storeToRefs } from "pinia";
import { useRouter } from "vue-router";
import dayjs from "dayjs";
import { useI18n } from "vue-i18n";

import { BaseContractStatus } from "@/models/enums/enums";
import { COMPENSATION, LIMITS } from "@/misc/constants";
import { formatPirce } from "@/misc/filters";
import { useAuthStore } from "@/store/auth";
import { useEcclivoStore } from "@/store/ecclivo";
import type { Individual } from "@/models/entities/base/base$Individual";
import type { Osgo } from "@/models/entities/contract$Osgo";

const { t, locale } = useI18n();

const props = defineProps<{
  editable: boolean;
  modelValue: Osgo;
  applicant: Individual;
  owner: Individual;
}>();

const emit = defineEmits<{
  (e: "update:modelValue", value: Osgo): void;
  (e: "update:applicant", value: Individual): void;
}>();

const router = useRouter();
const store = useEcclivoStore();
const user = storeToRefs(useAuthStore()).data;
const { saving, saveError } = storeToRefs(store);

const osgo = computed({
  get: () => props.modelValue,
  set: (value) => emit("update:modelValue", value),
});

// Helper function to get the localized name based on current locale
function getLocalizedName(item: any): string {
  if (!item) return '';
  if (locale.value === 'uz' && item.nameUz) {
    return item.nameUz;
  }
  return item.name || '';
}

const phone = computed({
  get: () => props.applicant.phone,
  set: (phone) => emit("update:applicant", { ...props.applicant, phone }),
});

const validPhone = computed(
  () => phone.value?.replace(/[+()-]/g, "").length === 12
);

const validDrivers = computed(
  () =>
    osgo.value.drivers?.length &&
    osgo.value.drivers.reduce((result, { id }) => result && !!id, true)
);

const price = computed(() => {
  const baseCoefficient = osgo.value.vehicle?.carType?.tariffCompany!;

  const coefficient =
    baseCoefficient *
    osgo.value.period?.coefficient *
    (osgo.value.driversLimited ? osgo.value.incidentCoeff : 3) *
    osgo.value.drivedArea?.coefficient;

  return Math.round(
    coefficient > 5 * baseCoefficient
      ? COMPENSATION * 5 * baseCoefficient
      : (COMPENSATION * coefficient) / 100
  );
});

function save() {
  const party = osgo.value.applicantIsOwner ? props.owner : props.applicant;

  if (osgo.value.id) {
    store.update({
      osgo: {
        ...osgo.value,
        party: { ...party, phone: party.phone?.replace(/[+()-]/g, "") },
        beneficiary: props.owner,
      },
    });
  } else {
    store
      .create({
        user: user.value,
        osgo: {
          ...osgo.value,
          party: { ...party, phone: party.phone?.replace(/[+()-]/g, "") },
          beneficiary: props.owner,
        },
      })
      .then((id) => {
        router.push({ name: "ecclivo-details", params: { id } });
      });
  }
}
</script>
