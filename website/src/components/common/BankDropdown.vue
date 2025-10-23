<template>
  <select
    :value="props.modelValue?.id"
    class="input"
    :disabled="fetching"
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

import { Bank } from "@/models/entities/base/base$Bank";
import { useBanksStore } from "@/store/banks";

const props = defineProps<{
  modelValue?: Bank | null;
}>();

const emit = defineEmits<{
  (e: "update:modelValue", value: Bank): void;
}>();

const store = useBanksStore();
const { list, fetching } = storeToRefs(store);

const sortedList = computed(() => _.sortBy(list.value, "code"));

function select(event: Event) {
  const { value } = event.target as HTMLInputElement;
  emit("update:modelValue", _.find(list.value, { id: value })!);
}

store.lazyFetch();
</script>
