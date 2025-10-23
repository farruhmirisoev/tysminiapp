<template>
  <div class="p-4 bg-white border rounded-md shadow-md hover:border-gray-300">
    <div class="flex items-center gap-2">
      <div class="inline-block w-3 h-3 rounded-full" :class="statusColor"></div>
      <div class="flex-1 font-bold">
        {{ $t('osgor.card.title') }}
      </div>
    </div>

    <div class="flex flex-col sm:flex-row gap-4 mt-4">
      <div class="flex-1 grid sm:grid-cols-3 gap-4">
        <div>
          <div class="text-xs text-gray-700">{{ $t('osgor.card.status') }}</div>
          <div class="text-sm font-bold text-gray-900">
            {{ status }}
          </div>
        </div>

        <div>
          <div class="text-xs text-gray-700">{{ $t('osgor.card.insurancePeriod') }}</div>
          <div class="text-sm font-bold text-gray-900">
            {{ datetime(data.contractStartDate, "DD.MM.YYYY") }} -
            {{ datetime(data.contractEndDate, "DD.MM.YYYY") }}
          </div>
        </div>

        <div>
          <div class="text-xs text-gray-700">{{ $t('osgor.card.insurancePremium') }}</div>
          <div class="text-sm font-bold text-gray-900">
            {{ formatPirce(data.premium) }} {{ $t('common.currency') }}
          </div>
        </div>

        <div>
          <div class="text-xs text-gray-700">{{ $t('osgor.card.daysUntilExpiry') }}</div>
          <div class="text-sm font-bold text-gray-900">
            <span v-if="daysLeft > 0">
              <i
                v-if="daysLeft < 15"
                class="text-red-600 bx bx-alarm-exclamation"
              ></i>
              {{ daysLeft }} {{ $t('osgor.card.days') }}
            </span>
            <span v-else>{{ $t('osgor.card.expired') }}</span>
          </div>
        </div>

        <div>
          <div class="text-xs text-gray-700">{{ $t('osgor.card.insuranceAmount') }}</div>
          <div class="text-sm font-bold text-gray-900">
            {{ formatPirce(data.limitOfLiability) }} {{ $t('common.currency') }}
          </div>
        </div>
      </div>
      <div class="flex-none">
        <router-link
          :to="{ name: 'osgor-details', params: { id: data.id } }"
          class="text-sm btn btn-primary order-last sm:order-none"
        >
          {{ $t('osgor.card.open') }}
        </router-link>

        <router-link
          :to="{
            name: 'claim-create',
            query: { type: 'osgor', contractNumber: data.contractNumber },
          }"
          class="text-sm btn btn-primary-outlined my-2"
        >
          {{ $t('osgor.card.submitClaim') }}
        </router-link>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import _ from "lodash";
import { computed } from "vue";
import dayjs from "dayjs";
import { useI18n } from "vue-i18n";

import { BaseContractStatus } from "@/models/enums/enums";
import { ContractExt } from "@/models/entities/base$ContractExt";
import { datetime, formatPirce } from "@/misc/filters";

const { t } = useI18n();

const props = defineProps<{
  data: ContractExt;
}>();

const daysLeft = computed(() =>
  dayjs(props.data.contractEndDate).diff(dayjs(), "days")
);

const status = computed(() => {
  const { status } = props.data;

  return status === BaseContractStatus.SIGNED
    ? t('osgor.card.statusActive')
    : status === BaseContractStatus.REVOKED
    ? t('osgor.card.statusRevoked')
    : t('osgor.card.statusPending');
});

const statusColor = computed(() => {
  const { status } = props.data;

  return status === BaseContractStatus.SIGNED
    ? daysLeft.value < 15
      ? "bg-red-600"
      : "bg-green-600"
    : status === BaseContractStatus.REVOKED
    ? "bg-gray-400"
    : "bg-yellow-500";
});
</script>
