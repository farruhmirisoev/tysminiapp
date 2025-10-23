<template>
  <div>
    <form class="text-sm" @submit.prevent="submit">
      <label class="block font-medium text-gray-700">
        {{ $t('profileForm.phone') }}
        <input
          v-model="username"
          v-maska="'+998(##)###-##-##'"
          class="block w-full mt-1 input"
          :disabled="smsCodeSent"
          required
        />
      </label>

      <label v-if="smsCodeSent" class="block mt-6 font-medium text-gray-700">
        {{ $t('profileForm.confirmationCode') }}
        <input
          v-model="smsCode"
          v-maska="'####'"
          class="block w-full mt-1 input"
          required
        />
      </label>

      <transition name="fade">
        <div v-if="changeUsernameError" class="mt-2 text-red-600">
          {{ changeUsernameError }}
        </div>
      </transition>

      <transition name="fade">
        <div v-if="succeded" class="mt-2 text-green-600">
          {{ $t('profileForm.usernameChanged') }}
        </div>
      </transition>

      <button
        type="submit"
        class="w-full mt-4 btn btn-primary"
        :disabled="
          changingUsername || (smsCodeSent ? !smsCode : !validUsername)
        "
      >
        {{ $t('profileForm.changePhone') }}
      </button>
    </form>
  </div>
</template>

<script setup lang="ts">
import { storeToRefs } from "pinia";
import { computed, ref } from "vue";

import { useAuthStore } from "@/store/auth";

const store = useAuthStore();

const smsCodeSent = ref(false);
const succeded = ref(false);
const username = ref("+998");
const smsCode = ref("");

const { changingUsername, changeUsernameError } = storeToRefs(store);

const validUsername = computed(
  () => username.value.replace(/[+()-]/g, "").length === 12
);

function submit() {
  if (smsCodeSent.value) {
    store
      .changeUsername(username.value.replace(/[+()-]/g, ""), smsCode.value)
      .then(() => {
        succeded.value = true;
        smsCodeSent.value = false;
        username.value = "";
        smsCode.value = "";

        // Clear message after 5 seconds
        setTimeout(() => {
          succeded.value = false;
        }, 5000);

        // Refetch user details
        store.fetch();
      });
  } else {
    store.changeUsername(username.value.replace(/[+()-]/g, "")).then(() => {
      smsCodeSent.value = true;
    });
  }
}
</script>
