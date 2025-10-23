<template>
  <div>
    <form class="grid grid-cols-3 gap-4 mb-4" @submit.prevent="submit">
      <label class="block col-span-2 text-sm font-medium text-gray-700">
        {{ $t('companyForm.inn') }}
        <input
          v-model="company.nationalIdentifier"
          v-maska="'#########'"
          class="block w-full mt-1 input"
          :disabled="!!company.id"
        />
      </label>
      <div v-if="!readonly" class="mt-auto">
        <button
          v-if="!modelValue.id"
          type="submit"
          class="w-full text-sm btn btn-primary"
          :disabled="fetching"
        >
          {{ $t('companyForm.find') }}
        </button>
        <button
          v-else
          type="button"
          class="w-full text-sm btn btn-danger"
          @click="clear"
        >
          {{ $t('companyForm.clear') }}
        </button>
      </div>
    </form>

    <transition name="fade" mode="out-in">
      <div v-if="fetchingError" class="text-sm text-red-600">
        {{ fetchingError }}
      </div>
      <div v-else-if="company.id">
        <div class="grid gap-4 text-sm lg:grid-cols-3">
          <label class="block mt-auto text-sm font-medium text-gray-700">
            {{ $t('companyForm.legalFormType') }}
            <LegalDropdown
              v-model="company.legalFormType"
              class="w-full mt-1"
              :disabled="hasLegalFormType"
            />
          </label>

          <label class="block mt-auto text-sm font-medium text-gray-700">
            {{ $t('companyForm.name') }}
            <input
              v-model="company.name"
              class="block w-full mt-1 input"
              disabled
            />
          </label>

          <label class="block mt-auto text-sm font-medium text-gray-700">
            {{ $t('companyForm.phone') }}
            <input
              v-model="company.phone"
              v-maska="'+998(##)###-##-##'"
              class="block w-full mt-1 input"
              :disabled="!!readonly"
            />
          </label>
        </div>

        <div class="grid gap-4 mt-4 text-sm lg:grid-cols-3">
          <Address
            v-model:country="company.country"
            v-model:region="company.region"
            v-model:district="company.district"
            :disabled="hasAddress"
          />
        </div>

        <div class="grid gap-4 mt-4 text-sm lg:grid-cols-3">
          <label class="block mt-auto text-sm font-medium text-gray-700">
            {{ $t('companyForm.address') }}
            <input
              v-model="company.street"
              class="block w-full mt-1 input"
              disabled
            />
          </label>

          <label
            class="block text-sm font-medium text-gray-700"
            :class="{ 'col-span-2': !activityCoefficient }"
          >
            {{ $t('companyForm.oked') }}
            <OkedDropdown
              v-model="company.oked"
              class="w-full mt-1"
              :disabled="hasOked"
            />
          </label>

          <label
            v-if="activityCoefficient"
            class="block text-sm font-medium text-gray-700"
          >
            {{ $t('companyForm.class') }}
            <input
              class="block w-full mt-1 input"
              :value="activityCoefficient?.className"
              disabled
            />
          </label>
        </div>

        <div class="grid gap-4 mt-4 text-sm lg:grid-cols-2">
          <label class="block mt-auto text-sm font-medium text-gray-700">
            {{ $t('companyForm.bank') }}
            <BankDropdown
              class="w-full mt-1"
              v-model="account.bank"
              :disabled="!!readonly"
            />
          </label>

          <label class="block mt-auto text-sm font-medium text-gray-700">
            {{ $t('companyForm.accountNumber') }}
            <span v-if="(account.number?.length ?? 0) < 20" class="text-red-600"
              >({{ $t('companyForm.min20Chars') }})</span
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

        <div class="grid gap-4 mt-4 text-sm lg:grid-cols-2">
          <label class="block mt-auto text-sm font-medium text-gray-700">
            {{ $t('companyForm.chiefName') }}
            <input
              v-model="company.chiefName"
              class="block w-full mt-1 input"
              :disabled="!!readonly"
            />
          </label>

          <label class="block mt-auto text-sm font-medium text-gray-700">
            {{ $t('companyForm.position') }}
            <input
              v-model="company.account"
              class="block w-full mt-1 input"
              :disabled="!!readonly"
            />
          </label>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup lang="ts">
import _ from "lodash";
import { computed, ref, watch } from "vue";

import { ActivityCoefficient } from "@/models/entities/reference_OsgorActivityCoefficient";
import { AjaxError, invokeService } from "@/misc/rest";
import { BankAccount } from "@/models/entities/base/base_BankAccount";
import { Company } from "@/models/entities/base/base$Company";

import Address from "@/components/common/Address.vue";
import BankDropdown from "@/components/common/BankDropdown.vue";
import LegalDropdown from "@/components/common/LegalDropdown.vue";
import OkedDropdown from "@/components/common/OkedDropdown.vue";

const props = defineProps<{
  modelValue: Company;
  activityCoefficient?: ActivityCoefficient | null;
  readonly?: boolean | null;
}>();

const emit = defineEmits<{
  (e: "update:modelValue", value: Company): void;
}>();

const company = computed({
  get: () => props.modelValue,
  set: (value) => emit("update:modelValue", value),
});
const account = computed(() => company.value.accounts![0]);

const fetching = ref(false);
const fetchingError = ref<AjaxError | null>();

const hasAddress = ref(true);
const hasLegalFormType = ref(true);
const hasOked = ref(true);

async function submit() {
  fetching.value = true;
  fetchingError.value = null;

  try {
    const response = (await invokeService(
      "PartyService",
      "getCompanyFromOsgoFund",
      {
        method: "POST",
        data: {
          inn: company.value.nationalIdentifier,
        },
      }
    )) as { data?: Company };

    if (response.data) {
      company.value = response.data;
    } else {
      fetchingError.value = new AjaxError({
        raw: {
          response: { data: { message: "Компания с данным ИНН не найдена" } },
        },
      });
    }
  } catch (err) {
    fetchingError.value = err as AjaxError;
  } finally {
    fetching.value = false;
  }
}

function clear() {
  company.value = _.pick(company.value, "nationalIdentifier");
}

watch(company, () => {
  if (_.isEmpty(company.value.accounts)) {
    company.value.accounts = [new BankAccount()];
  }

  hasAddress.value =
    !!company.value.country &&
    !!company.value.region &&
    !!company.value.district;
  hasLegalFormType.value = !!company.value.legalFormType;
  hasOked.value = !!company.value.oked;
});
</script>
