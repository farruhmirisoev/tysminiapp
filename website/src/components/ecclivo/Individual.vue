<template>
  <div class="p-4 border border-gray-300 rounded-md">
    <div class="text-lg font-bold">{{ title }}</div>
    <form
      class="grid gap-2 mt-4 lg:grid-cols-4"
      @submit.prevent="
        () => {
          if (editable) submit();
        }
      "
    >
      <label class="block text-sm font-medium text-gray-700">
        {{ $t('ecclivo.individual.passportSeries') }}*
        <input
          v-model="individual.passportSeries"
          v-maska="'AA'"
          class="block w-full mt-1 input"
          placeholder="AA"
          :disabled="!!individual.id"
        />
      </label>

      <label class="block text-sm font-medium text-gray-700">
        {{ $t('ecclivo.individual.passportNumber') }}*
        <input
          v-model="individual.passportNumber"
          v-maska="'#######'"
          class="block w-full mt-1 input"
          placeholder="0000000"
          :disabled="!!individual.id"
        />
      </label>

      <label class="block text-sm font-medium text-gray-700">
        {{ $t('ecclivo.individual.birthDate') }}*
        <input
          v-model="individual.birthDate"
          type="date"
          class="block w-full mt-1 input"
          :disabled="!!individual.id"
        />
      </label>

      <div v-if="editable" class="mt-auto">
        <button
          v-if="!individual.id"
          type="submit"
          class="w-full text-sm btn btn-primary"
          :disabled="!valid || fetching"
        >
          {{ $t('ecclivo.individual.find') }}
        </button>
        <button
          v-else
          type="button"
          class="w-full text-sm btn btn-danger"
          @click="clear"
        >
          {{ $t('ecclivo.individual.clear') }}
        </button>
      </div>
    </form>

    <transition name="fade" mode="out-in">
      <div v-if="fetchingError" class="mt-4 text-sm text-red-600">
        {{ fetchingError }}
      </div>
      <div v-else-if="individual.id">
        <hr class="my-4" />
        <div class="grid gap-2 text-sm lg:grid-cols-4">
          <div class="mt-auto">
            <div>{{ $t('ecclivo.individual.passportIssueDate') }}</div>
            <div class="font-bold">
              {{ datetime(individual.passportIssueDate, "DD.MM.YYYY") }}
            </div>
          </div>
          <div class="mt-auto">
            <div>{{ $t('ecclivo.individual.pinfl') }}</div>
            <div class="font-bold">
              {{ individual.nationalIdentifier }}
            </div>
          </div>
          <div class="col-span-2 mt-auto">
            <div>{{ $t('ecclivo.individual.issuedBy') }}</div>
            <div class="font-bold">
              {{ individual.passportIssuedBy }}
            </div>
          </div>
          <div class="mt-auto">
            <div>{{ $t('ecclivo.individual.lastName') }}</div>
            <div class="font-bold">
              {{ individual.lastName }}
            </div>
          </div>
          <div class="mt-auto">
            <div>{{ $t('ecclivo.individual.firstName') }}</div>
            <div class="font-bold">
              {{ individual.firstName }}
            </div>
          </div>
          <div class="mt-auto">
            <div>{{ $t('ecclivo.individual.middleName') }}</div>
            <div class="font-bold">
              {{ individual.middleName }}
            </div>
          </div>
          <div class="mt-auto">
            <div>{{ $t('ecclivo.individual.gender') }}</div>
            <div class="font-bold">
              {{ gender(individual.gender) }}
            </div>
          </div>
          <div class="mt-auto">
            <div>{{ $t('ecclivo.individual.country') }}</div>
            <div class="font-bold">
              {{ individual.country?.langValue1 }}
            </div>
          </div>
          <div class="mt-auto">
            <div>{{ $t('ecclivo.individual.region') }}</div>
            <div class="font-bold">
              {{ individual.region?.langValue1 }}
            </div>
          </div>
          <div class="mt-auto">
            <div>{{ $t('ecclivo.individual.district') }}</div>
            <div class="font-bold">
              {{ individual.district?.langValue1 }}
            </div>
          </div>
          <div class="mt-auto">
            <div>{{ $t('ecclivo.individual.street') }}</div>
            <div class="font-bold">
              {{ individual.street }}
            </div>
          </div>
        </div>
      </div>
    </transition>

    <slot></slot>
  </div>
</template>

<script setup lang="ts">
import _ from "lodash";
import { computed, ref } from "vue";
import { useI18n } from "vue-i18n";

import { datetime, gender } from "@/misc/filters";
import { handleError, invokeService, type AjaxError } from "@/misc/rest";
import { Individual } from "@/models/entities/base/base$Individual";

const { t } = useI18n();

const props = defineProps<{
  editable: boolean;
  modelValue: Individual;
  title: string;
}>();

const emit = defineEmits<{
  (e: "update:modelValue", value: Individual): void;
}>();

const individual = computed({
  get: () => props.modelValue,
  set: (value) => emit("update:modelValue", value),
});

const valid = computed(
  () =>
    !!individual.value.passportSeries &&
    !!individual.value.passportNumber &&
    !!individual.value.birthDate
);

const fetching = ref(false);
const fetchingError = ref<AjaxError | null>();

function clear() {
  individual.value = _.pick(
    individual.value,
    "passportSeries",
    "passportNumber",
    "birthDate"
  );
}

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
      handleError({ response: { ...response, data: { error: t('ecclivo.individual.notFound') } } });
    }

    individual.value = response.data.result!;
  } catch (err) {
    fetchingError.value = err as AjaxError;
  } finally {
    fetching.value = false;
  }
}
</script>
