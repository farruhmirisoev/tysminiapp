<template>
  <AuthContainer :title="$t('auth.recover')">
    <form class="text-sm mt-4" @submit.prevent="submit">
      <label class="block font-medium text-gray-700">
        {{ $t('auth.phoneNumber') }}
        <input
          v-model="username"
          v-maska="'+998(##)###-##-##'"
          class="block w-full mt-1 input"
          required
        />
      </label>

      <label
        v-if="recoveryCodeReceived"
        class="block mt-6 font-medium text-gray-700"
      >
        {{ $t('auth.password') }}
        <div class="relative mt-1">
          <input
            v-model="password"
            :type="showPassword ? 'text' : 'password'"
            class="block w-full input"
            required
          />
          <button
            type="button"
            class="absolute btn px-2 text-lg top-px right-px rounded-full"
            @click="showPassword = !showPassword"
          >
            <i class="bx" :class="showPassword ? 'bx-hide' : 'bx-show'"></i>
          </button>
        </div>
      </label>

      <label
        v-if="recoveryCodeReceived"
        class="block mt-6 font-medium text-gray-700"
      >
        {{ $t('auth.confirmationCode') }}
        <input
          v-model="smsCode"
          v-maska="'####'"
          class="block w-full mt-1 input"
          required
        />
      </label>

      <div class="mt-4 text-end">
        <router-link
          class="font-medium text-primary hover:underline"
          :to="{ name: 'signin' }"
        >
          {{ $t('auth.signIn') }}
        </router-link>
      </div>

      <transition name="fade">
        <div v-if="sendRecoveryCodeError" class="mt-6 text-red-600">
          {{ sendRecoveryCodeError }}
        </div>
      </transition>

      <transition name="fade">
        <div v-if="recoverPasswordError" class="mt-6 text-red-600">
          {{ recoverPasswordError }}
        </div>
      </transition>

      <button
        type="submit"
        class="w-full mt-6 btn btn-primary"
        :disabled="
          recoveryCodeReceived
            ? !password || !smsCode || recoveringPassword
            : !username || sendingRecoveryCode
        "
      >
        {{ recoveryCodeReceived ? $t('auth.changePassword') : $t('auth.sendSms') }}
      </button>
    </form>
  </AuthContainer>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { storeToRefs } from "pinia";
import { useRouter } from "vue-router";

import { useAuthStore } from "@/store/auth";

import AuthContainer from "@/components/containers/AuthContainer.vue";

// --- Stores and Utilities --- //

const router = useRouter();
const store = useAuthStore();

// --- Constants and Variables --- //

const recoveryCodeReceived = ref(false);
const username = ref("+998");
const password = ref("");
const smsCode = ref("");
const showPassword = ref(false);

// --- Computed properties --- //

const {
  sendingRecoveryCode,
  sendRecoveryCodeError,
  recoveringPassword,
  recoverPasswordError,
} = storeToRefs(store);

// --- Methods --- //

function submit() {
  if (recoveryCodeReceived.value) {
    store
      .recoverPassword(
        username.value.replace(/[+()-]/g, ""),
        password.value,
        smsCode.value
      )
      .then(() => {
        router.push({ name: "signin" });
      });
  } else {
    store.sendRecoveryCode(username.value.replace(/[+()-]/g, "")).then(() => {
      recoveryCodeReceived.value = true;
    });
  }
}
</script>
