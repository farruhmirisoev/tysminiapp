<template>
  <div class="p-4 border border-gray-300 rounded-md">
    <div class="flex justify-between">
      <div class="text-lg font-bold">{{ title }}</div>
      <slot name="actions"></slot>
    </div>
    <form
      class="grid gap-2 mt-4 lg:grid-cols-4"
      @submit.prevent="
        () => {
          if (editable) submit();
        }
      "
    >
      <label class="block text-sm font-medium text-gray-700">
        {{ $t('ecclivo.driver.passportSeries') }}*
        <input
          v-model="driver.passportSeries"
          v-maska="'AA'"
          class="block w-full mt-1 input"
          placeholder="AA"
          :disabled="!!driver.id"
        />
      </label>

      <label class="block text-sm font-medium text-gray-700">
        {{ $t('ecclivo.driver.passportNumber') }}*
        <input
          v-model="driver.passportNumber"
          v-maska="'#######'"
          class="block w-full mt-1 input"
          placeholder="0000000"
          :disabled="!!driver.id"
        />
      </label>

      <label class="block text-sm font-medium text-gray-700">
        {{ $t('ecclivo.driver.birthDate') }} *
        <input
          v-model="driver.birthDate"
          type="date"
          class="block w-full mt-1 input"
          :disabled="!!driver.id"
        />
      </label>

      <div v-if="editable" class="mt-auto">
        <button
          v-if="!driver.id"
          type="submit"
          class="w-full text-sm btn btn-primary"
          :disabled="!valid || fetching"
        >
          {{ $t('ecclivo.driver.find') }}
        </button>
        <button
          v-else
          type="button"
          class="w-full text-sm btn btn-danger"
          @click="clear"
        >
          {{ $t('ecclivo.driver.clear') }}
        </button>
      </div>
    </form>

    <transition name="fade" mode="out-in">
      <div v-if="fetchingError" class="mt-4 text-sm text-red-600">
        {{ fetchingError }}
      </div>
      <div v-else-if="driver.id">
        <hr class="my-4" />
        <div class="grid gap-2 text-sm lg:grid-cols-4">
          <div class="mt-auto">
            <div>{{ $t('ecclivo.driver.passportIssueDate') }}</div>
            <div class="font-bold">
              {{ datetime(driver.passportIssueDate, "DD.MM.YYYY") }}
            </div>
          </div>
          <div class="mt-auto">
            <div>{{ $t('ecclivo.driver.pinfl') }}</div>
            <div class="font-bold">
              {{ driver.pinfl }}
            </div>
          </div>
          <div class="col-span-2 mt-auto">
            <div>{{ $t('ecclivo.driver.issuedBy') }}</div>
            <div class="font-bold">
              {{ driver.passportIssuedBy }}
            </div>
          </div>
          <div class="mt-auto">
            <div>{{ $t('ecclivo.driver.lastName') }}</div>
            <div class="font-bold">
              {{ driver.lastName }}
            </div>
          </div>
          <div class="mt-auto">
            <div>{{ $t('ecclivo.driver.firstName') }}</div>
            <div class="font-bold">
              {{ driver.firstName }}
            </div>
          </div>
          <div class="mt-auto">
            <div>{{ $t('ecclivo.driver.middleName') }}</div>
            <div class="font-bold">
              {{ driver.middleName }}
            </div>
          </div>
          <div class="mt-auto">
            <div>{{ $t('ecclivo.driver.gender') }}</div>
            <div class="font-bold">
              {{ gender(driver.gender) }}
            </div>
          </div>
          <div class="mt-auto lg:col-span-4">
            <div>{{ $t('ecclivo.driver.address') }}</div>
            <div class="font-bold">
              {{ driver.address }}
            </div>
          </div>

          <div class="mt-auto">
            <div>{{ $t('ecclivo.driver.licenseSeries') }}</div>
            <div class="font-bold">
              {{ driver.licenseSeries }}
            </div>
          </div>
          <div class="mt-auto">
            <div>{{ $t('ecclivo.driver.licenseNumber') }}</div>
            <div class="font-bold">
              {{ driver.licenseNumber }}
            </div>
          </div>
          <div class="mt-auto">
            <div>{{ $t('ecclivo.driver.licenseDate') }}</div>
            <div class="font-bold">
              {{ datetime(driver.licenseDate, "DD.MM.YYYY") }}
            </div>
          </div>
          <div class="mt-auto">
            <div>{{ $t('ecclivo.driver.relationship') }}</div>
            <select
              v-if="editable"
              class="w-full input"
              :value="driver.relative?.id"
              @change="
                driver.relative = meta?.relative.find(
                  ({ id }) => id === ($event.target as HTMLInputElement).value
                )
              "
            >
              <option
                v-for="relative in meta?.relative"
                :key="relative.id"
                :value="relative.id"
              >
                {{ getLocalizedName(relative) }}
              </option>
            </select>
            <div v-else class="font-bold">
              {{ getLocalizedName(driver.relative) }}
            </div>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup lang="ts">
import _ from "lodash";
import { computed, ref } from "vue";
import { useI18n } from "vue-i18n";

import { datetime, gender } from "@/misc/filters";
import { handleError, invokeService, type AjaxError } from "@/misc/rest";
import type { Driver } from "@/models/entities/osgoDriver";
import type { EcclivoMeta } from "@/models/ecclivo_meta.model";

const { t, locale } = useI18n();

const props = defineProps<{
  editable: boolean;
  meta?: EcclivoMeta | null;
  modelValue: Driver;
  title: string;
}>();

const emit = defineEmits<{
  (e: "update:modelValue", value: Driver): void;
}>();

const driver = computed({
  get: () => props.modelValue,
  set: (value) => emit("update:modelValue", value),
});

function getLocalizedName(item: any): string {
  if (!item) return '';
  if (locale.value === 'uz' && item.nameUz) {
    return item.nameUz;
  }
  return item.name || '';
}

const valid = computed(
  () =>
    !!driver.value.passportSeries &&
    !!driver.value.passportNumber &&
    !!driver.value.birthDate
);

const fetching = ref(false);
const fetchingError = ref<AjaxError | null>();

function clear() {
  driver.value = _.pick(
    driver.value,
    "passportSeries",
    "passportNumber",
    "birthDate"
  );
}

async function submit() {
  fetching.value = true;
  fetchingError.value = null;

  try {
    const response = (await invokeService("OsgoService", "getDriver", {
      method: "POST",
      data: {
        passportBirthDateType: {
          ..._.pick(
            driver.value,
            "passportSeries",
            "passportNumber",
            "birthDate"
          ),
          isConsent: "Y",
        },
      },
    })) as { data: { error?: any; result?: Driver } };

    if (response.data.error) {
      handleError({ response });
    }

    if (_.isEmpty(response.data.result)) {
      handleError({ response: { ...response, data: { error: t('ecclivo.driver.notFound') } } });
    }

    driver.value = response.data.result!;
  } catch (err) {
    fetchingError.value = err as AjaxError;
  } finally {
    fetching.value = false;
  }
}

if (
  !driver.value.id &&
  driver.value.passportSeries &&
  driver.value.passportNumber &&
  driver.value.birthDate
) {
  submit();
}
</script>
