<template>
  <div
    v-if="restriction"
    class="flex items-center justify-center h-screen text-3xl text-gray-700"
  >
    {{ restriction.message }}
  </div>

  <AuthContainer v-else :title="$t('auth.signin')">
    <div class="mt-4 mb-12 text-sm text-gray-700">
      {{ $t('auth.noAccount') }}
      <router-link
        class="font-medium text-primary hover:underline"
        :to="{ name: 'signup' }"
      >
        {{ $t('auth.register') }}
      </router-link>
      {{ $t('auth.toStart') }}
    </div>

    <form class="text-sm" @submit.prevent="singIn">
      <label class="block font-medium text-gray-700">
        {{ $t('auth.phoneNumber') }}
        <input
          v-model="username"
          v-maska="'+998(##)###-##-##'"
          class="block w-full mt-1 input"
          required
        />
      </label>

      <label class="block mt-6 font-medium text-gray-700">
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

      <transition name="fade">
        <div v-if="signInError" class="mt-6 text-red-600">
          {{ signInError }}
        </div>
      </transition>

      <div class="mt-4 text-end">
        <router-link
          class="font-medium text-primary hover:underline"
          :to="{ name: 'password-recover' }"
        >
          {{ $t('auth.forgotPassword') }}
        </router-link>
      </div>

      <button
        type="submit"
        class="w-full mt-6 btn btn-primary"
        :disabled="signingIn"
      >
        {{ $t('auth.signIn') }}
      </button>
    </form>

    <!-- NOTE: Uncomment when needed -->
    <!-- <div class="relative my-4">
      <div class="absolute inset-0 flex items-center">
        <div class="w-full border-t border-gray-300"></div>
      </div>
      <div class="relative flex justify-center text-sm">
        <span class="px-2 text-gray-500 bg-white">Или</span>
      </div>
    </div>

    <div class="text-sm text-center text-gray-700">
      <a class="font-medium text-primary hover:underline" :href="ID_BASE_URL">
        Войдите
      </a>
      с помощью электронного ключа.
    </div> -->
  </AuthContainer>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { storeToRefs } from "pinia";
import { useRouter } from "vue-router";

import { useAuthStore } from "@/store/auth";
import { useWorkStore } from "@/store/work";
import { WorkType } from "@/models/enums/enums";

import AuthContainer from "@/components/containers/AuthContainer.vue";

// const ID_BASE_URL = import.meta.env.VITE_ID_BASE_URL;

const store = useAuthStore();
const router = useRouter();

const workStore = useWorkStore();
const restriction = workStore.getWorkService(WorkType.LOGIN);

const username = ref("+998");
const password = ref("");
const showPassword = ref(false);

const { signingIn, signInError } = storeToRefs(store);

function singIn() {
  store
    .signIn(username.value.replace(/[+()-]/g, ""), password.value)
    .then(() => {
      router.push({ name: "home" });
    });

  // Clear store
  store.$reset();
}
</script>
