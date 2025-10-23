<template>
  <select
    :value="props.modelValue?.id"
    class="input"
    :disabled="fetching || props.disabled"
    @change="select"
  >
    <option v-for="item in sortedList" :value="item.id" :key="item.id">
      {{ item.langValue1 }}
    </option>
  </select>
</template>

<script setup lang="ts">
import _ from "lodash";
import { computed } from "vue";
import { storeToRefs } from "pinia";

import { useLegalsStore } from "@/store/legals";
import { DicOrgLegalFormType } from "@/models/entities/base/base$DicOrgLegalFormType";

const props = defineProps<{
  modelValue?: DicOrgLegalFormType | null;
  disabled: boolean;
}>();

const emit = defineEmits<{
  (e: "update:modelValue", value: DicOrgLegalFormType): void;
}>();

const store = useLegalsStore();
const { list, fetching } = storeToRefs(store);

const sortedList = computed(() => _.sortBy(list.value, "langValue1"));

function select(event: Event) {
  const { value } = event.target as HTMLInputElement;
  emit("update:modelValue", _.find(list.value, { id: value })!);
}

store.lazyFetch();
</script>
