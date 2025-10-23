<template>
  <div class="flex min-h-full">
    <div
      class="flex flex-col justify-center flex-1 px-8 py-12 lg:flex-none lg:px-20 xl:px-24"
    >
      <div class="w-full max-w-sm mx-auto lg:w-96">
        <img src="/logo_extended.svg" alt="TYS" class="h-10 lg:hidden" />
        <h2 class="mt-6 text-3xl font-bold tracking-tight text-gray-900">
          {{ props.title }}
        </h2>
        <slot></slot>
      </div>
    </div>
    <div
      class="items-center justify-center flex-1 hidden w-0 bg-primary lg:flex"
    >
      <img
        src="/logo_extended.svg"
        alt="TYS"
        class="h-20 filter brightness-0 invert"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  title: string;
}>();
</script>
