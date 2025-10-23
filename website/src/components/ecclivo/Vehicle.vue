<template>
  <div class="p-4 border border-gray-300 rounded-md">
    <div class="text-lg font-bold">
      {{ $t('ecclivo.vehicle.findInDatabase') }}
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
        {{ $t('ecclivo.vehicle.govNumber') }}*
        <input
          :value="vehicle.govNumber"
          class="block w-full mt-1 input"
          :placeholder="$t('ecclivo.vehicle.govNumberPlaceholder')"
          :disabled="!!vehicle.id"
          @input="setGovNumber"
        />
      </label>

      <label class="block text-sm font-medium text-gray-700">
        {{ $t('ecclivo.vehicle.techPassportSeries') }}*
        <input
          v-model="vehicle.techPassportSeries"
          v-maska="'AAA'"
          class="block w-full mt-1 input"
          placeholder="AAA"
          :disabled="!!vehicle.id"
        />
      </label>

      <label class="block text-sm font-medium text-gray-700">
        {{ $t('ecclivo.vehicle.techPassportNumber') }}*
        <input
          v-model="vehicle.techPassportNumber"
          v-maska="'#######'"
          class="block w-full mt-1 input"
          placeholder="0000000"
          :disabled="!!vehicle.id"
        />
      </label>

      <div v-if="editable" class="mt-auto">
        <button
          v-if="!vehicle.id"
          type="submit"
          class="w-full text-sm btn btn-primary"
          :disabled="!valid || fetching"
        >
          {{ $t('ecclivo.vehicle.find') }}
        </button>
        <button
          v-else
          type="button"
          class="w-full text-sm btn btn-danger"
          @click="clear"
        >
          {{ $t('ecclivo.vehicle.clear') }}
        </button>
      </div>
    </form>

    <transition name="fade" mode="out-in">
      <div v-if="fetchingError" class="mt-4 text-sm text-red-600">
        {{ fetchingError }}
      </div>
      <div v-else-if="vehicle.id">
        <hr class="my-4" />
        <div class="grid gap-2 text-sm lg:grid-cols-4">
          <div class="mt-auto">
            <div>{{ $t('ecclivo.vehicle.techPassportIssueDate') }}</div>
            <div class="font-bold">
              {{ datetime(vehicle.techPassportIssueDate, "DD.MM.YYYY") }}
            </div>
          </div>
          <div class="mt-auto">
            <div>{{ $t('ecclivo.vehicle.model') }}</div>
            <div class="font-bold">
              {{ vehicle.modelName }}
            </div>
          </div>
          <div class="mt-auto">
            <div>{{ $t('ecclivo.vehicle.year') }}</div>
            <div class="font-bold">
              {{ vehicle.createdYear }}
            </div>
          </div>
          <div class="mt-auto">
            <div>{{ $t('ecclivo.vehicle.engineNumber') }}</div>
            <div class="font-bold">
              {{ vehicle.engineNumber }}
            </div>
          </div>
          <div class="mt-auto">
            <div>{{ $t('ecclivo.vehicle.bodyNumber') }}</div>
            <div class="font-bold">
              {{ vehicle.bodyNumber }}
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

import { AjaxError, handleError, invokeService } from "@/misc/rest";
import { datetime } from "@/misc/filters";
import type { Vehicle } from "@/models/entities/osgo_Vehicle";

const { t } = useI18n();

const props = defineProps<{
  editable: boolean;
  modelValue: Vehicle;
}>();

const emit = defineEmits<{
  (e: "update:modelValue", value: Vehicle): void;
}>();

const fetching = ref(false);
const fetchingError = ref<AjaxError | null>();

const vehicle = computed({
  get: () => props.modelValue,
  set: (value) => emit("update:modelValue", value),
});

const valid = computed(
  () =>
    !!vehicle.value.govNumber &&
    !!vehicle.value.techPassportSeries &&
    !!vehicle.value.techPassportNumber
);

function setGovNumber(event: Event) {
  const { value } = event.target as HTMLInputElement;
  vehicle.value = {
    ...props.modelValue,
    govNumber: value.toUpperCase().replace(/[^A-Z0-9\s]+/g, ""),
  };
}

function clear() {
  vehicle.value = _.pick(
    vehicle.value,
    "govNumber",
    "techPassportNumber",
    "techPassportSeries",
    "carType"
  );
}

async function submit() {
  fetching.value = true;
  fetchingError.value = null;

  try {
    const response = (await invokeService("OsgoService", "getVehicle", {
      method: "POST",
      data: {
        vehicleType: {
          ..._.pick(vehicle.value, "govNumber", "techPassportNumber"),

          // TODO: rename to techPassportSeries
          techPassportSeria: vehicle.value.techPassportSeries,
        },
      },
    })) as { data: { error?: any; result?: Vehicle } };

    if (response.data.error) {
      handleError({ response });
    }

    vehicle.value = response.data.result!;
  } catch (err) {
    fetchingError.value = err as AjaxError;
  } finally {
    fetching.value = false;
  }
}
</script>
