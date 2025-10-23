<template>
  <div>
    <!-- Off-canvas menu for mobile, show/hide based on off-canvas menu state. -->
    <div
      v-if="showSidebar"
      class="relative z-40 lg:hidden"
      role="dialog"
      aria-modal="true"
    >
      <!--
      Off-canvas menu backdrop, show/hide based on off-canvas menu state.

      Entering: "transition-opacity ease-linear duration-300"
        From: "opacity-0"
        To: "opacity-100"
      Leaving: "transition-opacity ease-linear duration-300"
        From: "opacity-100"
        To: "opacity-0"
    -->
      <div class="fixed inset-0 bg-gray-600 bg-opacity-75"></div>

      <div class="fixed inset-0 z-40 flex">
        <!--
        Off-canvas menu, show/hide based on off-canvas menu state.

        Entering: "transition ease-in-out duration-300 transform"
          From: "-translate-x-full"
          To: "translate-x-0"
        Leaving: "transition ease-in-out duration-300 transform"
          From: "translate-x-0"
          To: "-translate-x-full"
      -->
        <div class="relative flex flex-col flex-1 w-full max-w-xs">
          <!--
          Close button, show/hide based on off-canvas menu state.

          Entering: "ease-in-out duration-300"
            From: "opacity-0"
            To: "opacity-100"
          Leaving: "ease-in-out duration-300"
            From: "opacity-100"
            To: "opacity-0"
        -->
          <div class="absolute top-0 right-0 pt-2 -mr-12">
            <button
              type="button"
              class="flex items-center justify-center w-10 h-10 ml-1 text-white rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
              @click="showSidebar = false"
            >
              <span class="sr-only">{{ $t('home.sidebar.close') }}</span>
              <i class="text-2xl bx bx-x"></i>
            </button>
          </div>

          <Sidebar class="flex-1 h-0" @click="showSidebar = false" />
        </div>

        <div class="flex-shrink-0 w-14" aria-hidden="true">
          <!-- Force sidebar to shrink to fit close icon -->
        </div>
      </div>
    </div>

    <!-- Static sidebar for desktop -->
    <div class="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-64 lg:flex-col">
      <!-- Sidebar component, swap this element with another sidebar if you like -->
      <Sidebar class="flex-1 min-h-0" />
    </div>

    <div class="flex flex-col flex-1 lg:pl-64">
      <div class="sticky top-0 z-10 p-2 pt-1 pl-1 bg-primary lg:hidden">
        <button
          type="button"
          class="inline-flex items-center justify-center w-12 h-12 text-white rounded-md hover:bg-primary-light focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary-dark"
          @click="showSidebar = true"
        >
          <span class="sr-only">{{ $t('home.sidebar.open') }}</span>
          <i class="text-2xl bx bx-menu"></i>
        </button>
      </div>

      <main class="flex-1 p-8">
        <router-view></router-view>
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import Sidebar from "@/components/home/Sidebar.vue";
import { ref } from "vue";

const showSidebar = ref(false);
</script>
