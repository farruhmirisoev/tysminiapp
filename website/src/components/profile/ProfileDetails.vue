<template>
  <div>
    <label class="block text-sm font-medium text-gray-700">
      {{ $t('profileForm.lastName') }}
      <input :value="data.lastName" class="block w-full mt-1 input" disabled />
    </label>
    <label class="block mt-2 text-sm font-medium text-gray-700">
      {{ $t('profileForm.firstName') }}
      <input :value="data.firstName" class="block w-full mt-1 input" disabled />
    </label>
    <label class="block mt-2 text-sm font-medium text-gray-700">
      {{ $t('profileForm.middleName') }}
      <input
        :value="data.middleName"
        class="block w-full mt-1 input"
        disabled
      />
    </label>
    <label class="block mt-2 text-sm font-medium text-gray-700">
      {{ $t('profileForm.phone') }}
      <input
        v-maska="'+998(##)###-##-##'"
        :value="data.login"
        class="block w-full mt-1 input"
        disabled
      />
    </label>
  </div>
</template>

<script setup lang="ts">
import { storeToRefs } from "pinia";

import { useAuthStore } from "@/store/auth";

const store = useAuthStore();

const { data } = storeToRefs(store);
</script>
