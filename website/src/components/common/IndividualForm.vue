<template>
  <div>
    <form class="grid grid-cols-4 gap-4 mb-4" @submit.prevent="submit">
      <label class="block text-sm font-medium text-gray-700">
        {{ $t('individualForm.passportSeries') }}
        <input
          v-model="individual.passportSeries"
          v-maska="'AA'"
          class="block w-full mt-1 input"
          placeholder="AA"
          :disabled="!!individual.id"
        />
      </label>

      <label class="block text-sm font-medium text-gray-700">
        {{ $t('individualForm.passportNumber') }}
        <input
          v-model="individual.passportNumber"
          v-maska="'#######'"
          class="block w-full mt-1 input"
          placeholder="0000000"
          :disabled="!!individual.id"
        />
      </label>

      <label class="block text-sm font-medium text-gray-700">
        {{ $t('individualForm.birthDate') }}
        <input
          v-model="individual.birthDate"
          type="date"
          class="block w-full mt-1 input"
          :disabled="!!individual.id"
        />
      </label>
      <div v-if="!readonly" class="mt-auto">
        <button
          v-if="!modelValue.id"
          type="submit"
          class="w-full text-sm btn btn-primary"
          :disabled="fetching"
        >
          {{ $t('individualForm.find') }}
        </button>
        <button
          v-else
          type="button"
          class="w-full text-sm btn btn-danger"
          @click="clear"
        >
          {{ $t('individualForm.clear') }}
        </button>
      </div>
    </form>

    <transition name="fade" mode="out-in">
      <div v-if="fetchingError" class="text-sm text-red-600">
        {{ fetchingError }}
      </div>
      <div v-else-if="individual.id" class="grid gap-4 text-sm lg:grid-cols-4">
        <label class="block mt-auto text-sm font-medium text-gray-700">
          {{ $t('individualForm.lastName') }}
          <input
            :value="individual.lastName"
            class="block w-full mt-1 input"
            disabled
          />
        </label>

        <label class="block mt-auto text-sm font-medium text-gray-700">
          {{ $t('individualForm.firstName') }}
          <input
            :value="individual.firstName"
            class="block w-full mt-1 input"
            disabled
          />
        </label>

        <label class="block mt-auto text-sm font-medium text-gray-700">
          {{ $t('individualForm.middleName') }}
          <input
            :value="individual.middleName"
            class="block w-full mt-1 input"
            disabled
          />
        </label>

        <label class="block mt-auto text-sm font-medium text-gray-700">
          {{ $t('individualForm.phone') }}
          <input
            :value="individual.phone"
            v-maska="'+998(##)###-##-##'"
            class="block w-full mt-1 input"
            disabled
          />
        </label>

        <Address
          :country="individual.country"
          :region="individual.region"
          :district="individual.district"
          disabled
        />

        <label class="block mt-auto text-sm font-medium text-gray-700">
          {{ $t('individualForm.address') }}
          <input
            :value="individual.street"
            class="block w-full mt-1 input"
            disabled
          />
        </label>

        <label
          v-if="hasAccount"
          class="block col-span-3 mt-auto text-sm font-medium text-gray-700"
        >
          {{ $t('individualForm.bank') }}
          <BankDropdown
            class="w-full mt-1"
            v-model="account.bank"
            :disabled="!!readonly"
          />
        </label>

        <label
          v-if="hasAccount"
          class="block mt-auto text-sm font-medium text-gray-700"
        >
          {{ $t('individualForm.accountNumber') }}
          <span v-if="(account.number?.length ?? 0) < 20" class="text-red-600"
            >({{ $t('individualForm.min20Chars') }})</span
          >
          <input
            v-model="account.number"
            class="block w-full mt-1 input"
            :class="{
              'border border-red-600': (account.number?.length ?? 0) < 20,
            }"
            :disabled="!!readonly"
          />
        </label>
      </div>
    </transition>
  </div>
</template>

<script setup lang="ts">
import _ from "lodash";
import { computed, ref, watch } from "vue";

import { AjaxError, handleError, invokeService } from "@/misc/rest";
import { BankAccount } from "@/models/entities/base/base_BankAccount";
import { Individual } from "@/models/entities/base/base$Individual";

import Address from "@/components/common/Address.vue";
import BankDropdown from "@/components/common/BankDropdown.vue";

const props = defineProps<{
  modelValue: Individual;
  hasAccount: boolean;
  readonly?: boolean | null;
}>();

const emit = defineEmits<{
  (e: "update:modelValue", value: Individual): void;
}>();

const individual = computed({
  get: () => props.modelValue,
  set: (value) => emit("update:modelValue", value),
});
const account = computed(() => individual.value.accounts![0]);

const fetching = ref(false);
const fetchingError = ref<AjaxError | null>();

async function submit() {
  fetching.value = true;
  fetchingError.value = null;

  try {
    const response = (await invokeService(
      "PartyService",
      "getIndividualByPassport",
      {
        method: "POST",
        data: {
          passport: {
            ..._.pick(
              individual.value,
              "passportSeries",
              "passportNumber",
              "birthDate"
            ),
            isConsent: "Y",
          },
        },
      }
    )) as { data: { error?: any; result?: Individual } };

    if (response.data.error) {
      handleError({ response });
    }

    if (_.isEmpty(response.data.result)) {
      handleError({ response: { ...response, data: { error: "Не найдено" } } });
    }

    individual.value = response.data.result!;
  } catch (err) {
    fetchingError.value = err as AjaxError;
  } finally {
    fetching.value = false;
  }
}

function clear() {
  individual.value = _.pick(
    individual.value,
    "passportSeries",
    "passportNumber",
    "birthDate"
  );
}

watch(individual, () => {
  if (props.hasAccount && _.isEmpty(individual.value.accounts)) {
    individual.value.accounts = [new BankAccount()];
  }
});
</script>
