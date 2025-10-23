<template>
  <div class="p-4 bg-white border rounded-md shadow-md hover:border-gray-300">
    <div class="flex items-center gap-2">
      <div class="inline-block w-3 h-3 rounded-full" :class="statusColor"></div>
      <div class="flex-1 font-bold">
        {{ $t('ecclivo.card.title') }}
      </div>
    </div>

    <div class="flex flex-col sm:flex-row gap-4 mt-4">
      <div class="flex-1 grid sm:grid-cols-3 gap-4">
        <div>
          <div class="text-xs text-gray-700">{{ $t('ecclivo.card.status') }}</div>
          <div class="text-sm font-bold text-gray-900">
            {{ status }}
          </div>
        </div>

        <!-- <div>
      <div class="text-xs text-gray-700">Гос. номер</div>
      <div class="text-sm font-bold text-gray-900">
        {{ data.vehicle?.govNumber }}
      </div>
    </div> -->

        <div>
          <div class="text-xs text-gray-700">{{ $t('ecclivo.card.insurancePeriod') }}</div>
          <div class="text-sm font-bold text-gray-900">
            {{ datetime(data.contractStartDate, "DD.MM.YYYY") }} -
            {{ datetime(data.contractEndDate, "DD.MM.YYYY") }}
          </div>
        </div>

        <!-- <div>
      <div class="text-xs text-gray-700">Общая страховая сумма</div>
      <div class="text-sm font-bold text-gray-900">
        {{ formatPirce(data.limitOfLiability) }} сум
      </div>
    </div> -->

        <div>
          <div class="text-xs text-gray-700">{{ $t('ecclivo.card.insurancePremium') }}</div>
          <div class="text-sm font-bold text-gray-900">
            {{ formatPirce(data.premium) }} {{ $t('common.currency') }}
          </div>
        </div>

        <div>
          <div class="text-xs text-gray-700">{{ $t('ecclivo.card.daysUntilExpiry') }}</div>
          <div class="text-sm font-bold text-gray-900">
            <span v-if="daysLeft > 0">
              <i
                v-if="daysLeft < 15"
                class="text-red-600 bx bx-alarm-exclamation"
              ></i>
              {{ daysLeft }} {{ $t('ecclivo.card.days') }}
            </span>
            <span v-else>{{ $t('ecclivo.card.expired') }}</span>
          </div>
        </div>

        <div>
          <div class="text-xs text-gray-700">{{ $t('ecclivo.card.insuranceAmount') }}</div>
          <div class="text-sm font-bold text-gray-900">
            {{ formatPirce(data.limitOfLiability) }} {{ $t('common.currency') }}
          </div>
        </div>

        <div>
          <div class="text-xs text-gray-700">{{ $t("ecclivo.vehicle.govNumber")}}</div>
          <div class="text-sm font-bold text-gray-900">
            {{ data.govNumber }}
          </div>
        </div>

        <!-- <div>
      <div class="text-xs text-gray-700">Оплачено</div>
      <div class="text-sm font-bold text-gray-900">
        {{ formatPirce(paid) }} сум
      </div>
    </div>
    
    <div>
      <div class="text-xs text-gray-700">Подлежит оплате</div>
      <div class="text-sm font-bold text-gray-900">
        {{ formatPirce(data.premium - paid) }} сум
      </div>
    </div> -->
      </div>

      <div class="flex-none">
        <router-link
          :to="{ name: 'ecclivo-details', params: { id: data.id } }"
          class="text-sm btn btn-primary"
        >
          {{ $t('ecclivo.card.open') }}
        </router-link>

        <router-link
          :to="{
            name: 'claim-create',
            query: { type: 'ecclivo', contractNumber: data.contractNumber },
          }"
          class="text-sm btn btn-primary-outlined my-2"
        >
          {{ $t('ecclivo.card.submitClaim') }}
        </router-link>

        <button
          type="button"
          class="w-full text-sm btn btn-primary-outlined"
          :disabled="saving"
          @click="store.copy(data.id!)"
        >
          {{ $t('ecclivo.card.copy') }}
        </button>

        <transition name="fade">
          <div
            v-if="copyId === data.id && saveError"
            class="text-sm text-red-600"
          >
            {{ saveError }}
          </div>
        </transition>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import _ from "lodash";
import { computed } from "vue";
import { storeToRefs } from "pinia";
import dayjs from "dayjs";
import { useI18n } from "vue-i18n";

import { BaseContractStatus } from "@/models/enums/enums";
import { datetime, formatPirce } from "@/misc/filters";
import { EntriesJournal } from "@/models/entities/accounting$EntriesJournal";
import { Osgo } from "@/models/entities/contract$Osgo";
import { usePoliciesStore } from "@/store/policies";

const { t } = useI18n();

const props = defineProps<{
  data: Osgo;
}>();

const store = usePoliciesStore();

const { copyId, saving, saveError } = storeToRefs(store);

const paid = computed(() => {
  const entries = _.get(props.data, "entriesJournalKt", []) as EntriesJournal[];
  return entries.reduce((sum, { amount }) => sum + (amount ?? 0), 0);
});

const daysLeft = computed(() =>
  dayjs(props.data.contractEndDate).diff(dayjs(), "days")
);

const status = computed(() => {
  const { status } = props.data;

  return status === BaseContractStatus.SIGNED
    ? t('ecclivo.card.statusActive')
    : status === BaseContractStatus.REVOKED
    ? t('ecclivo.card.statusRevoked')
    : t('ecclivo.card.statusPending');
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
