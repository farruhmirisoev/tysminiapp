<template>
  <div class="p-8">
    <div v-if="data" v-html="content" class="mx-auto prose"></div>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { storeToRefs } from "pinia";

import { useTermsStore } from "@/store/terms";
import { useSettingsStore } from "@/store/settings";
import { FALLBACK_LOCALE } from "@/misc/locale";
import { markdown } from "@/misc/markdown";

const termStore = useTermsStore();
const settingsStore = useSettingsStore();

const { data } = storeToRefs(termStore);
const { locale } = storeToRefs(settingsStore);

const content = computed<string>(() => {
  const content =
    locale.value === FALLBACK_LOCALE ? data.value?.text : data.value?.textUz;
  return markdown(content!);
});

termStore.fetch();
</script>
