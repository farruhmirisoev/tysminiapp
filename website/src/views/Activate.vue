<template>
  <AuthContainer :title="$t('auth.activate')">
    <div class="mt-4 mb-12 text-sm text-gray-700">
      {{ $t('auth.smsSent', { phone }) }}
    </div>
    <form class="text-sm" @submit.prevent="activate">
      <label class="block font-medium text-gray-700">
        {{ $t('auth.smsCode') }} *
        <input
          v-model="smsCode"
          v-maska="'####'"
          class="block w-full mt-1 input"
          required
        />
      </label>
      <button
        type="button"
        class="block p-0 mt-1 ml-auto text-xs text-primary btn hover:text-primary-dark hover:underline disabled:hover:no-underline"
        :disabled="resending || interval > 0"
        @click="resend"
      >
        {{ $t('auth.resendSms') }}
        <span v-if="interval">({{ interval }})</span>
      </button>

      <transition name="fade">
        <div v-if="activateError" class="mt-6 text-red-600">
          {{ activateError }}
        </div>
      </transition>

      <button
        type="submit"
        class="w-full mt-6 btn btn-primary"
        :disabled="resending || activating || smsCode.length < 4"
      >
        {{ $t('auth.activateButton') }}
      </button>
    </form>
  </AuthContainer>
</template>

<script setup lang="ts">
import { storeToRefs } from "pinia";
import { mask, tokens } from "maska";
import { useRouter } from "vue-router";
import { computed, onMounted, onUnmounted, ref } from "vue";

import { useAuthStore } from "@/store/auth";

import AuthContainer from "@/components/containers/AuthContainer.vue";

const INTERVAL = 180;

const store = useAuthStore();
const router = useRouter();

let timer: number;
const smsCode = ref("");
const interval = ref(INTERVAL);

const { resending, activating, activateError } = storeToRefs(store);
const login = computed<string>(
  () => router.currentRoute.value.params.username as string
);
const phone = computed<string>(() =>
  mask(login.value, "+998(##)###-##-##", tokens)
);

function activate() {
  store.activate(login.value, smsCode.value).then(() => {
    router.push({ name: "signin" });
  });
}

function resend() {
  store.resendCode(login.value).then(() => {
    interval.value = INTERVAL;
  });
}

onMounted(() => {
  timer = window.setInterval(() => {
    if (interval.value > 0) interval.value -= 1;
  }, 1000);
});

onUnmounted(() => {
  clearInterval(timer);
});

// Clear store
store.$reset();
</script>
