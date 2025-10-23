<template>
  <div>
    <form class="grid sm:grid-cols-3 gap-4" @submit.prevent="find">
      <label class="block text-sm font-medium text-gray-700">
        {{ $t('policySearch.series') }}
        <select
          class="block w-full mt-1 input"
          :disabled="!editable || !!policy"
          :value="series"
          @change="(e) => $emit('update:series', e.target.value)"
        >
          <option value="" selected disabled hidden>{{ $t('policySearch.chooseSeries') }}</option>
          <option
            v-for="option in POLICY_SERIES[type]"
            :value="option"
            :key="option"
          >
            {{ option }}
          </option>
        </select>
      </label>

      <label class="block text-sm font-medium text-gray-700">
        {{ $t('policySearch.number') }}
        <input
          class="block w-full mt-1 input"
          :disabled="!editable || !!policy"
          :value="number"
          @input="(e) => $emit('update:number', e.target.value)"
        />
      </label>

      <div v-if="editable" class="mt-auto">
        <button
          v-if="!policy"
          type="submit"
          class="w-full text-sm btn btn-primary"
          :disabled="!valid || fetching"
        >
          {{ $t('policySearch.find') }}
        </button>
        <button
          v-else
          type="button"
          class="w-full text-sm btn btn-danger"
          @click="clear"
        >
          {{ $t('policySearch.clear') }}
        </button>
      </div>
    </form>

    <transition name="fade" mode="out-in">
      <div v-if="fetchError" class="mt-4 text-sm text-red-600">
        {{ fetchError }}
      </div>
    </transition>
  </div>
</template>

<script setup lang="ts">
import _ from "lodash";
import { ref, computed } from "vue";

import { handleError, invokeService, type AjaxError } from "@/misc/rest";
import { POLICY_SERIES } from "@/misc/constants";

const props = defineProps<{
  editable: boolean;
  number: string | number;
  policy: any | null;
  series: string;
  type: string;
}>();

const emit = defineEmits<{
  (e: "update:series", value: string): void;
  (e: "update:number", value: string): void;
  (e: "update:policy", value: any): void;
}>();

defineExpose({
  find,
});

const fetching = ref(false);
const fetchError = ref<AjaxError | null>();

const valid = computed(() => !!props.series && !!props.number);

async function find() {
  if (!props.editable) return;

  fetching.value = true;
  fetchError.value = null;

  try {
    const response = (await invokeService("ClaimOnlineService", "checkPolicy", {
      method: "POST",
      data: {
        policy: {
          series: props.series,
          number: props.number,
        },
      },
    })) as { data: { error?: any; result?: any } };

    if (response.data.error) {
      handleError({ response });
    }

    if (_.isEmpty(response.data.result)) {
      handleError({ response: { ...response, data: { error: "Не найдено" } } });
    }

    emit("update:policy", response.data.result);
  } catch (err) {
    fetchError.value = err as AjaxError;
  } finally {
    fetching.value = false;
  }
}

function clear() {
  emit("update:policy", null);
}
</script>
