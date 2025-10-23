<template>
  <AuthContainer :title="$t('auth.signup')">
    <div class="mt-4 mb-12 text-sm text-gray-700">
      {{ $t('auth.hasAccount') }}
      <router-link
        class="font-medium text-primary hover:underline"
        :to="{ name: 'signin' }"
      >
        {{ $t('auth.login') }}
      </router-link>
      {{ $t('auth.toStart') }}
    </div>

    <form class="text-sm" @submit.prevent="signUp">
      <label class="block font-medium text-gray-700">
        {{ $t('auth.phoneNumber') }} *
        <input
          v-model="username"
          v-maska="'+998(##)###-##-##'"
          class="block w-full mt-1 input"
          required
        />
      </label>

      <label class="block mt-6 font-medium text-gray-700">
        {{ $t('auth.password') }} *
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

      <label class="flex items-center mt-6">
        <input v-model="agree" type="checkbox" class="mr-2 checkbox" required />
        <router-link
          :to="{ name: 'terms-of-service' }"
          class="text-primary hover:underline"
        >
          {{ $t('auth.agreeTerms') }}
        </router-link>
      </label>

      <transition name="fade">
        <div v-if="signUpError" class="mt-6 text-red-600">
          {{ signUpError }}
        </div>
      </transition>

      <button
        type="submit"
        class="w-full mt-6 btn btn-primary"
        :disabled="signingUp || invalid"
      >
        {{ $t('auth.signup') }}
      </button>
    </form>
  </AuthContainer>
</template>

<script setup lang="ts">
import { storeToRefs } from "pinia";
import { useRouter } from "vue-router";
import { computed, ref } from "vue";

import { useAuthStore } from "@/store/auth";

import AuthContainer from "@/components/containers/AuthContainer.vue";

const store = useAuthStore();
const router = useRouter();

const agree = ref(false);
const username = ref("+998");
const password = ref("");
const showPassword = ref(false);

const { signingUp, signUpError } = storeToRefs(store);
const phone = computed<string>(() => username.value.replace(/[+()-]/g, ""));
const invalid = computed<boolean>(
  () => !agree.value || phone.value.length < 12 || password.value.length < 6
);

function signUp() {
  store.signUp(phone.value, password.value).then(() => {
    router.push({ name: "activate", params: { username: phone.value } });
  });
}

// Clear store
store.$reset();
</script>
