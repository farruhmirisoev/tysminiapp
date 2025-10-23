<template>
  <div>
    <form class="grid grid-cols-4 gap-4 mb-4" @submit.prevent="submit">
      <label class="block text-sm font-medium text-gray-700">
        {{ $t('osgop.vehicleForm.govNumber') }}
        <input
          :value="vehicle.govNumber"
          class="block w-full mt-1 input"
          :placeholder="$t('osgop.vehicleForm.govNumberPlaceholder')"
          :disabled="!!vehicle.id"
          @input="setGovNumber"
        />
      </label>
      <label class="block text-sm font-medium text-gray-700">
        {{ $t('osgop.vehicleForm.techPassportSeries') }}
        <input
          v-model="vehicle.techPassportSeries"
          v-maska="'AAA'"
          class="block w-full mt-1 input"
          placeholder="AAA"
          :disabled="!!vehicle.id"
        />
      </label>
      <label class="block text-sm font-medium text-gray-700">
        {{ $t('osgop.vehicleForm.techPassportNumber') }}
        <input
          v-model="vehicle.techPassportNumber"
          v-maska="'#######'"
          class="block w-full mt-1 input"
          placeholder="0000000"
          :disabled="!!vehicle.id"
        />
      </label>
      <div v-if="!readonly" class="mt-auto">
        <button
          v-if="!props.modelValue.id"
          type="submit"
          class="w-full text-sm btn btn-primary"
          :disabled="fetching || !valid"
        >
          {{ $t('osgop.vehicleForm.find') }}
        </button>
        <button
          v-else
          type="button"
          class="w-full text-sm btn btn-danger"
          @click="clear"
        >
          {{ $t('osgop.vehicleForm.clear') }}
        </button>
      </div>
    </form>

    <transition name="fade" mode="out-in">
      <div v-if="fetchingError" class="text-sm text-red-600">
        {{ fetchingError }}
      </div>
      <div v-else-if="vehicle.id" class="grid gap-4 text-sm lg:grid-cols-4">
        <label class="block mt-auto text-sm font-medium text-gray-700">
          {{ $t('osgop.vehicleForm.techPassportIssueDate') }}
          <input
            :value="vehicle.techPassportIssueDate"
            class="block w-full mt-1 input"
            disabled
          />
        </label>

        <label class="block mt-auto text-sm font-medium text-gray-700">
          {{ $t('osgop.vehicleForm.model') }}
          <input
            :value="vehicle.modelName"
            class="block w-full mt-1 input"
            disabled
          />
        </label>

        <label class="block mt-auto text-sm font-medium text-gray-700">
          {{ $t('osgop.vehicleForm.year') }}
          <input
            :value="vehicle.createdYear"
            class="block w-full mt-1 input"
            disabled
          />
        </label>

        <label class="block mt-auto text-sm font-medium text-gray-700">
          {{ $t('osgop.vehicleForm.engineNumber') }}
          <input
            :value="vehicle.engineNumber"
            class="block w-full mt-1 input"
            disabled
          />
        </label>

        <label class="block mt-auto text-sm font-medium text-gray-700">
          {{ $t('osgop.vehicleForm.bodyNumber') }}
          <input
            :value="vehicle.bodyNumber"
            class="block w-full mt-1 input"
            disabled
          />
        </label>

        <label class="block mt-auto text-sm font-medium text-gray-700">
          {{ $t('osgop.vehicleForm.numberOfSeats') }}
          <input
            :value="vehicle.numberOfSeats"
            class="block w-full mt-1 input"
            disabled
          />
        </label>
      </div>
    </transition>
  </div>
</template>

<script setup lang="ts">
import _ from "lodash";
import { computed, ref } from "vue";
import { useI18n } from "vue-i18n";

import { AjaxError, invokeService, handleError } from "@/misc/rest";
import { Vehicle } from "@/models/entities/osgo_Vehicle";

const { t } = useI18n();

const props = defineProps<{
  modelValue: Vehicle;
  readonly?: boolean | null;
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
    "vehicleTypeOsgop"
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

    vehicle.value = {
      ...response.data.result!,
      vehicleTypeOsgop: vehicle.value.vehicleTypeOsgop,
    };
  } catch (err) {
    fetchingError.value = err as AjaxError;
  } finally {
    fetching.value = false;
  }
}
</script>
