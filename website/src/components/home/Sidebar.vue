<template>
  <div class="flex flex-col bg-primary">
    <div class="flex flex-col flex-1 pt-5 pb-4 overflow-y-auto">
      <div class="flex items-center flex-shrink-0 px-4">
        <img
          class="w-auto h-10 filter brightness-0 invert"
          src="/logo_extended.svg"
          alt="TYS"
        />
      </div>

      <nav class="flex-1 px-2 mt-5 space-y-1">
        <router-link
          v-for="(route, index) in ROUTES"
          class="flex items-center px-2 py-2 text-sm text-white rounded-md hover:bg-primary-light hover:bg-opacity-75"
          active-class="bg-primary-dark"
          :to="route.to"
          :key="index"
          @click="$emit('click')"
        >
          <i class="mr-3 text-2xl bx" :class="route.icon"></i>
          {{ route.name }}
        </router-link>
      </nav>
    </div>
    <div class="flex-shrink-0">
      <div class="p-4">
        <LanguageSwitcher/>
      </div>
    </div>
    <div class="flex flex-shrink-0 border-t border-primary-dark">
      <router-link
        :to="{ name: 'profile' }"
        class="flex-shrink-0 block w-full p-4 text-gray-200 hover:text-white"
      >
        <div class="flex items-center">
          <div>
            <i class="text-3xl bx bxs-user-circle"></i>
          </div>
          <div class="ml-3">
            <p class="text-sm font-medium">{{ username }}</p>
            <p class="text-xs">{{ $t('sidebar.viewProfile') }}</p>
          </div>
        </div>
      </router-link>
    </div>
  </div>
</template>

<script setup lang="ts">
import { storeToRefs } from "pinia";
import { mask, tokens } from "maska";
import { computed } from "vue";
import { useI18n } from "vue-i18n";

import { useAuthStore } from "@/store/auth";

import LanguageSwitcher from "@/components/common/LanguageSwitcher.vue";

const store = useAuthStore();
const { t } = useI18n();

const { data } = storeToRefs(store);

const username = computed(() =>
  mask(data.value?.login, "+998(##)###-##-##", tokens)
);

const ROUTES = computed(() => [
  {
    icon: "bx-home",
    name: t('sidebar.home'),
    to: { name: "main" },
  },
  {
    icon: "bx-calculator",
    name: t('sidebar.calculator'),
    to: { name: "calculator-list" },
  },
  {
    icon: "bx-file",
    name: t('sidebar.myPolicies'),
    to: { name: "policies-list" },
  },
  {
    icon: "bx-cabinet",
    name: t('sidebar.myClaims'),
    to: { name: "claims-list" },
  },
]);
</script>
