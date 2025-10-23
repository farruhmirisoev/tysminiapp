<script setup lang="ts">
import { RouterView } from "vue-router";

import { useWorkStore } from "@/store/work";
import { WorkType } from "@/models/enums/enums";

const workStore = useWorkStore();
const restriction = workStore.getWorkService(WorkType.ERROR);
</script>

<template>
  <div
    v-if="restriction"
    class="flex items-center justify-center h-screen text-3xl text-gray-700"
  >
    {{ restriction.message }}
  </div>
  <RouterView v-else />
</template>
