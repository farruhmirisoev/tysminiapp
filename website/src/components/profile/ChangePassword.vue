<template>
  <div>
    <form class="text-sm" @submit.prevent="submit">
      <label class="block font-medium text-gray-700">
        {{ $t('profileForm.oldPassword') }}
        <input
          v-model="oldPassword"
          type="password"
          class="block w-full mt-1 input"
          required
        />
      </label>

      <label class="block mt-2 font-medium text-gray-700">
        {{ $t('profileForm.newPassword') }}
        <input
          v-model="newPassword"
          type="password"
          class="block w-full mt-1 input"
          required
        />
      </label>

      <transition name="fade">
        <div v-if="changePasswordError" class="mt-2 text-red-600">
          {{ changePasswordError }}
        </div>
      </transition>

      <transition name="fade">
        <div v-if="succeded" class="mt-2 text-green-600">
          {{ $t('profileForm.passwordChanged') }}
        </div>
      </transition>

      <button
        type="submit"
        class="w-full mt-4 btn btn-primary"
        :disabled="
          !oldPassword ||
          !newPassword ||
          newPassword.length < 5 ||
          changingPassword
        "
      >
        {{ $t('profileForm.changePassword') }}
      </button>
    </form>
  </div>
</template>

<script setup lang="ts">
import { storeToRefs } from "pinia";
import { ref } from "vue";

import { useAuthStore } from "@/store/auth";

const store = useAuthStore();

const succeded = ref(false);
const oldPassword = ref("");
const newPassword = ref("");

const { changingPassword, changePasswordError } = storeToRefs(store);

function submit() {
  store.changePassword(oldPassword.value, newPassword.value).then(() => {
    succeded.value = true;
    oldPassword.value = "";
    newPassword.value = "";

    // Clear message after 5 seconds
    setTimeout(() => {
      succeded.value = false;
    }, 5000);
  });
}
</script>
