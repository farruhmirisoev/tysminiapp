<template>
  <router-link
    v-if="!editable"
    :to="{ name: 'claims-list' }"
    class="block mb-4 text-sm font-medium text-primary hover:text-primary-light"
  >
    <span aria-hidden="true">&larr;</span>
    {{ $t('claimCreate.backToList') }}
  </router-link>

  <div class="text-2xl font-bold">
    {{
      editable
        ? $t('claimCreate.createTitle')
        : $t('claimCreate.detailsTitle')
    }}
  </div>

  <div class="text-sm font-light">
    {{
      type === "osgor"
        ? $t('main.claim.osgor.title')
        : type === "osgop"
        ? $t('main.claim.osgop.title')
        : type === "ecclivo"
        ? $t('main.claim.osgo.title')
        : $t('main.claim.others.title')
    }}
  </div>

  <transition name="fade" mode="out-in">
    <div v-if="created" class="text-gray-700 border rounded-md p-4 mt-4">
      {{ $t('claimCreate.sentMessage') }}
      <router-link
        :to="{ name: 'claims-list' }"
        class="text-primary-light hover:text-primary-dark"
        >{{ $t('claimCreate.myClaims') }}</router-link
      >.
      {{ $t('claimCreate.questions') }}
      <a
        href="tel:+998712071905"
        class="text-primary-light hover:text-primary-dark whitespace-nowrap"
        >+998 (71) 207-19-05</a
      >
    </div>
  </transition>

  <PolicySearch
    ref="policySearchRef"
    class="mt-4"
    v-model:series="editData.series"
    v-model:number="editData.number"
    v-model:policy="policy"
    :editable="editable"
    :type="type"
  />

  <transition name="fade" mode="out-in">
    <form
      v-if="policy"
      class="grid gap-4 lg:grid-cols-3 mt-4"
      @submit.prevent="save"
    >
      <label class="block text-sm font-medium text-gray-700">
        {{ $t('claimCreate.policyStartDate') }}
        <input
          :value="policy.startDate"
          class="block w-full mt-1 input"
          disabled
        />
      </label>

      <label class="block text-sm font-medium text-gray-700">
        {{ $t('claimCreate.policyEndDate') }}
        <input
          :value="policy.endDate"
          class="block w-full mt-1 input"
          disabled
        />
      </label>

      <label class="block text-sm font-medium text-gray-700">
        {{ $t('claimCreate.eventExpense') }}
        <input
          v-model="editData.eventExpense"
          v-maska="'###############'"
          class="block w-full mt-1 input"
          :class="{ 'border-red-500': errors.includes('eventExpense') }"
          @blur="setErrors('eventExpense')"
          :disabled="!editable"
          required
        />
      </label>

      <label class="block text-sm font-medium text-gray-700">
        {{ $t('claimCreate.eventDate') }}
        <input
          type="date"
          v-model="editData.date"
          class="block w-full mt-1 input"
          :class="{ 'border-red-500': errors.includes('date') }"
          @blur="setErrors('date')"
          :disabled="!editable"
          required
        />
      </label>

      <label class="block text-sm font-medium text-gray-700">
        {{ $t('claimCreate.eventTime') }}
        <input
          type="time"
          v-model="editData.time"
          class="block w-full mt-1 input"
          :class="{ 'border-red-500': errors.includes('time') }"
          @blur="setErrors('time')"
          :disabled="!editable"
          required
        />
      </label>

      <label class="block mt-auto text-sm font-medium text-gray-700">
        {{ $t('claimCreate.phone') }}
        <input
          v-model="editData.phone"
          v-maska="'+998(##)###-##-##'"
          class="block w-full mt-1 input"
          :class="{ 'border-red-500': errors.includes('phone') }"
          @blur="setErrors('phone')"
          :disabled="!editable"
          required
        />
      </label>

      <label class="block mt-auto text-sm font-medium text-gray-700">
        {{ $t('claimCreate.region') }}
        <select
          v-model="editData.regionId"
          class="block w-full mt-1 input"
          :class="{ 'border-red-500': errors.includes('regionId') }"
          @blur="setErrors('regionId')"
          :disabled="!editable || fetchingRegions"
          @change="selectRegion"
          required
        >
          <option v-for="item in sortedRegions" :value="item.id" :key="item.id">
            {{ item.langValue1 }}
          </option>
        </select>
      </label>

      <label class="block text-sm font-medium text-gray-700 lg:col-span-2">
        {{ $t('claimCreate.eventAddress') }}
        <input
          v-model="editData.eventAddress"
          class="block w-full mt-1 input"
          :class="{ 'border-red-500': errors.includes('eventAddress') }"
          @blur="setErrors('eventAddress')"
          :disabled="!editable"
          required
        />
      </label>

      <label class="block text-sm font-medium text-gray-700 lg:col-span-3">
        {{ $t('claimCreate.eventCase') }}
        <textarea
          v-model="editData.eventCase"
          class="block w-full mt-1 input"
          :class="{ 'border-red-500': errors.includes('eventCase') }"
          @blur="setErrors('eventCase')"
          rows="6"
          :disabled="!editable"
          required
        ></textarea>
      </label>

      <div class="lg:col-span-3">
        <transition name="fade" mode="out-in">
          <div v-if="saveError" class="text-sm text-red-600 mb-4">
            {{ saveError }}
          </div>
        </transition>

        <button
          v-if="editable"
          type="submit"
          class="w-full btn btn-primary"
          :disabled="invalid"
        >
          {{ $t('claimCreate.createButton') }}
        </button>
      </div>
    </form>
  </transition>

  <!-- Attachments -->
  <transition name="fade" mode="out-in">
    <div v-if="!editable">
      <div class="flex items-center justify-between">
        <div class="text-xl font-bold">{{ $t('claimCreate.files') }}</div>
        <button
          type="button"
          class="btn btn-sm btn-primary-outlined"
          :disabled="uploading || fetching"
          @click="() => uploadRef.click()"
        >
          {{ $t('claimCreate.uploadFile') }}
        </button>
      </div>

      <template v-if="data?.attachments.length">
        <div
          v-for="attachment in data.attachments"
          class="text-sm border border-gray-300 rounded-md p-3 my-4 flex gap-3"
          :key="attachment.id"
        >
          <div
            class="bg-primary w-10 h-10 flex items-center justify-center rounded-md"
          >
            <i class="bx bx-file text-xl text-white"></i>
          </div>
          <div class="flex-1">
            <div class="font-bold">{{ attachment.file.name }}</div>
            <div class="text-gray-700">
              {{ dayjs(attachment.file.createDate).format("DD.MM.YYYY HH:mm") }}
            </div>
          </div>
        </div>
      </template>
      <div v-else class="my-4 text-gray-700 text-center text-sm">
        {{ $t('claimCreate.noFiles') }}
      </div>

      <transition name="fade" mode="out-in">
        <div v-if="uploadError" class="text-sm text-red-600 mb-4">
          {{ uploadError }}
        </div>
      </transition>

      <input
        ref="uploadRef"
        hidden
        type="file"
        accept="image/*,.pdf"
        @change="upload"
      />
    </div>
  </transition>
</template>
<script setup lang="ts">
import _ from "lodash";
import dayjs from "dayjs";
import { ref, computed, onMounted, watch, nextTick } from "vue";
import { storeToRefs } from "pinia";
import { useRoute, useRouter } from "vue-router";

import { Claim } from "@/models/entities/baseClaim";
import { POLICY_SERIES } from "@/misc/constants";
import { useAddressStore } from "@/store/address";
import { useAuthStore } from "@/store/auth";
import { useClaimStore } from "@/store/claim";

import PolicySearch from "@/components/claim/PolicySearch.vue";

// --- Stores & Composables --- //

const route = useRoute();
const router = useRouter();
const addressStore = useAddressStore();
const store = useClaimStore();
const user = storeToRefs(useAuthStore()).data;

// --- Variables --- //

const created = ref(false);
const editData = ref({
  series: "",
  number: "",
  eventAddress: "",
  eventExpense: "",
  date: dayjs().format("YYYY-MM-DD"),
  time: dayjs().format("HH:mm"),
  phone: "",
  eventCase: "",
  regionId: null,
});
const errors = ref([]);
const policy = ref(null);
const policySearchRef = ref(null);
const uploadRef = ref(null);

// --- Computed properties --- //

const { data, fetching, saving, saveError, uploading, uploadError } =
  storeToRefs(store);
const { regions, fetching: fetchingRegions } = storeToRefs(addressStore);
const editable = computed(() => !route.params.id);
const sortedRegions = computed(() => _.sortBy(regions.value, "langValue1"));
const type = computed(() => {
  if (!editable.value) {
    const series = _.get(data.value?.policy, "series");
    const type = _.keys(POLICY_SERIES).find((key) =>
      POLICY_SERIES[key].includes(series)
    );
    return type || "others";
  }

  return _.keys(POLICY_SERIES).includes(route.query.type)
    ? route.query.type
    : "others";
});
const invalid = computed(
  () =>
    !editData.value.eventExpense ||
    !editData.value.date ||
    !editData.value.time ||
    !editData.value.phone ||
    !editData.value.eventAddress ||
    !editData.value.eventCase
);

// --- Methods --- //

function setErrors(field) {
  if (editData.value[field]) {
    errors.value = _.without(errors.value, field);
  } else {
    errors.value.push(field);
  }
}

function save(event: SubmitEvent) {
  if (!editable.value) return;

  const payload = {
    claim: {
      userId: user.value.id,
      policyId: policy.value.policyId,
      ..._.omit(editData.value, "date", "time", "phone"),
      eventTime: `${dayjs(editData.value.date).format("DD.MM.YYYY")} ${
        editData.value.time
      }`,
      phone: editData.value.phone.replace(/[+()-]/g, ""),
    },
  };

  store.create(payload).then((id) => {
    created.value = true;
    router.push({ name: "claim-details", params: { id } });
  });
}

function upload(event: Event) {
  const target = event.target as HTMLInputElement;
  store.upload(target.files[0]);
  target.value = "";
}

// --- Watchers --- //

watch(
  () => route.params.id,
  (id) => {
    store.clear();
    if (id) {
      store.fetch(id as string);
    }
  },
  { immediate: true }
);

watch(data, (value) => {
  if (value) {
    editData.value.series = _.get(value.policy, "series");
    editData.value.number = _.get(value.policy, "number");
    editData.value.phone = _.get(value.policy, "phone");
    editData.value.eventExpense = value.eventExpense;
    editData.value.date = dayjs(value.eventTime).format("YYYY-MM-DD");
    editData.value.time = dayjs(value.eventTime).format("HH:mm");
    editData.value.eventAddress = value.eventAddress;
    editData.value.eventCase = value.eventCase;
    editData.value.regionId = value.eventRegion.id;
    policy.value = {
      policyId: value.policy.id,
      startDate: value.policy.begin,
      endDate: value.policy.endDate,
    };
  }
});

// --- Lifecycle hooks --- //

onMounted(() => {
  addressStore.lazyFetch();

  // Fill series and number if contractNumber is provided
  if (route.query.contractNumber) {
    const [series, number] = route.query.contractNumber.split(/[ -]+/);
    editData.value.series = series;
    editData.value.number = number;
    nextTick(() => policySearchRef.value.find());
  }
});
</script>
