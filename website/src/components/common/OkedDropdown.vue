<template>
  <select
    :value="props.modelValue?.id"
    class="input"
    :disabled="fetching || props.disabled"
    @change="select"
  >
    <option v-for="item in sortedList" :value="item.id" :key="item.id">
      ({{ item.code }}) {{ item.langValue1 }}
    </option>
  </select>
</template>

<script setup lang="ts">
import _ from "lodash";
import { computed } from "vue";
import { storeToRefs } from "pinia";

import { DicOked } from "@/models/entities/base/base$DicOked";
import { useOkedsStore } from "@/store/okeds";

const props = defineProps<{
  modelValue?: DicOked | null;
  disabled: boolean;
}>();

const emit = defineEmits<{
  (e: "update:modelValue", value: DicOked): void;
}>();

const store = useOkedsStore();
const { list, fetching } = storeToRefs(store);

const sortedList = computed(() => _.sortBy(list.value, "langValue1"));

function select(event: Event) {
  const { value } = event.target as HTMLInputElement;
  emit("update:modelValue", _.find(list.value, { id: value })!);
}

store.lazyFetch();
</script>
