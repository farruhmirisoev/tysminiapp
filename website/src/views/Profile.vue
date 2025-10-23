<template>
  <Tabs v-model="tab" :options="TABS" class="mb-4" />

  <div class="max-w-sm">
    <div v-if="tab === 0">
      <ProfileDetails class="mb-4" />
      <transition name="fade" mode="out-in">
        <div v-if="requestPoliciesError" class="text-sm text-red-600 mb-4">
          {{ requestPoliciesError }}
        </div>
      </transition>
      <button
        type="button"
        class="w-full btn btn-primary-outlined mb-4"
        :disabled="requestingPolicies"
        @click="store.requestPolicies()"
      >
        {{ $t('profile.getMyPolicies') }}
      </button>
      <router-link :to="{ name: 'signout' }" class="btn btn-primary-outlined">
        {{ $t('profile.signOut') }}
      </router-link>
    </div>
    <ChangeUsername v-else-if="tab === 1" />
    <ChangePassword v-else-if="tab === 2" />
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import { storeToRefs } from "pinia";

import { useAuthStore } from "@/store/auth";
import { useI18n } from "vue-i18n";

import ChangePassword from "@/components/profile/ChangePassword.vue";
import ChangeUsername from "@/components/profile/ChangeUsername.vue";
import ProfileDetails from "@/components/profile/ProfileDetails.vue";
import Tabs from "@/components/common/Tabs.vue";

const { t } = useI18n();

const TABS = computed(() => [
  t('profile.profileData'),
  t('profile.changePhone'),
  t('profile.changePassword')
]);

const store = useAuthStore();

const tab = ref(0);
const { requestingPolicies, requestPoliciesError } = storeToRefs(store);
</script>
