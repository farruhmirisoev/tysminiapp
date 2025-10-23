<template>
  <div>
    <div class="mb-4 text-2xl font-bold">
      {{ $t('claimsList.title') }}
      <span class="text-gray-700">
        <i v-if="fetching" class="bx bx-loader-alt bx-spin"></i>
        <span v-else>({{ list.length }})</span>
      </span>
    </div>

    <div
      v-for="item in list"
      :key="item.id"
      class="mb-2 grid sm:grid-cols-3 gap-4 p-4 bg-white border rounded-md shadow-md hover:border-gray-300"
    >
      <div class="flex items-center sm:col-span-3 gap-2">
        <div
          class="inline-block w-3 h-3 rounded-full"
          :class="STATUS_COLOR[item.status!] ?? 'bg-yellow-500'"
        ></div>
        <div class="flex-1 font-bold">
          {{ item.policy?.contractExt?.product?.name }}
        </div>
      </div>

      <div>
        <div class="text-xs text-gray-700">{{ $t('claimsList.status') }}</div>
        <div class="text-sm font-bold text-gray-900">
          {{ getStatusDisplay(item.status!) ?? "-" }}
        </div>
      </div>

      <div>
        <div class="text-xs text-gray-700">{{ $t('claimsList.journalDate') }}</div>
        <div class="text-sm font-bold text-gray-900">
          {{ datetime(item.journalDate!, "DD.MM.YYYY") }}
        </div>
      </div>

      <div>
        <div class="text-xs text-gray-700">{{ $t('claimsList.daysOnReview') }}</div>
        <div class="text-sm font-bold text-gray-900">
          {{ daysFromNow(item.journalDate!) }}
        </div>
      </div>

      <div>
        <div class="text-xs text-gray-700">{{ $t('claimsList.eventExpense') }}</div>
        <div class="text-sm font-bold text-gray-900">
          {{ formatPirce(item.eventExpense!) }} {{ $t('claimsList.sum') }}
        </div>
      </div>

      <div>
        <div class="text-xs text-gray-700">{{ $t('claimsList.policy') }}</div>
        <div class="text-sm font-bold text-gray-900">
          {{ _.get(item.policy, "series") }} {{ _.get(item.policy, "number") }}
        </div>
      </div>

      <router-link
        :to="{ name: 'claim-details', params: { id: item.id } }"
        class="text-sm btn btn-primary"
      >
        {{ $t('claimsList.open') }}
      </router-link>
    </div>

    <transition name="fade">
      <div v-if="fetchError" class="mt-4 text-sm text-red-600">
        {{ fetchError }}
      </div>
    </transition>
  </div>
</template>
<script setup lang="ts">
import _ from "lodash";
import { storeToRefs } from "pinia";

import { datetime, daysFromNow, formatPirce } from "@/misc/filters";

import { useClaimsStore } from "@/store/claims";
import { ClaimStatus } from "@/models/enums/enums";

import { useI18n } from "vue-i18n";
const { t } = useI18n();

const STATUS_COLOR = {
  [ClaimStatus.APPROVED]: "bg-green-600",
  [ClaimStatus.CLOSED]: "bg-gray-500",
  [ClaimStatus.DRAFT]: "bg-yellow-500",
  [ClaimStatus.DRAFT_CHECK]: "bg-amber-500",
  [ClaimStatus.IN_PROGRESS]: "bg-blue-600",
  [ClaimStatus.NEW]: "bg-indigo-500",
  [ClaimStatus.ON_CHECK]: "bg-purple-500",
  [ClaimStatus.PROTOCOL]: "bg-teal-600",
  [ClaimStatus.REJECTED]: "bg-red-600",
};

const getStatusDisplay = (status: ClaimStatus) => {
  switch (status) {
    case ClaimStatus.APPROVED: return t('claimsList.statusApproved');
    case ClaimStatus.CLOSED: return t('claimsList.statusClosed');
    case ClaimStatus.DRAFT: return t('claimsList.statusDraft');
    case ClaimStatus.DRAFT_CHECK: return t('claimsList.statusDraftCheck');
    case ClaimStatus.IN_PROGRESS: return t('claimsList.statusInProgress');
    case ClaimStatus.NEW: return t('claimsList.statusNew');
    case ClaimStatus.ON_CHECK: return t('claimsList.statusOnCheck');
    case ClaimStatus.PROTOCOL: return t('claimsList.statusProtocol');
    case ClaimStatus.REJECTED: return t('claimsList.statusRejected');
    default: return '-';
  }
};

const store = useClaimsStore();
const { list, fetching, fetchError } = storeToRefs(store);

store.fetch({
  sort: "contractStartDate",
  view: "claim-online-view",
});
</script>
