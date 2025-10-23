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

import { usePeriodsStore } from "@/store/periods";
import { OsgopPeriod } from "@/models/entities/OsgopPeriod";

const { locale } = useI18n();

const props = defineProps<{
  modelValue?: OsgopPeriod | null;
}>();

const emit = defineEmits<{
  (e: "update:modelValue", value: OsgopPeriod): void;
}>();

const store = usePeriodsStore();
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

watch(list, () => {
  const period = _.last(_.sortBy(list.value, "month"));
  if (period && !props.modelValue) {
    emit("update:modelValue", period);
  }
});
</script>
