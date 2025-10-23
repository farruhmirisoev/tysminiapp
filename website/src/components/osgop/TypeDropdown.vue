<template>
  <select
    :value="modelValue?.id"
    class="input"
    :disabled="fetching"
    @change="select"
  >
    <option v-for="item in sortedList" :value="item.id" :key="item.id">
      {{ getLocalizedName(item) }}
    </option>
  </select>
</template>

<script setup lang="ts">
import _ from "lodash";
import { computed, watch } from "vue";
import { storeToRefs } from "pinia";
import { useI18n } from "vue-i18n";

import { useVehicleTypesStore } from "@/store/vehicle_types";
import { OsgopVehicleType } from "@/models/entities/osgopVehicleType";

const { locale } = useI18n();

const props = defineProps<{
  modelValue?: OsgopVehicleType | null;
}>();

const emit = defineEmits<{
  (e: "update:modelValue", value: OsgopVehicleType): void;
}>();

const store = useVehicleTypesStore();
const { list, fetching } = storeToRefs(store);

const sortedList = computed(() => _.sortBy(list.value, "order"));

// Helper function to get the localized name based on current locale
function getLocalizedName(item: any): string {
  if (locale.value === 'uz' && item.nameUz) {
    return item.nameUz;
  }
  return item.name || '';
}

function select(event: Event) {
  const { value } = event.target as HTMLInputElement;
  emit("update:modelValue", _.find(list.value, { id: value })!);
}

store.lazyFetch();
</script>
