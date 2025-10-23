<template>
  <div>
    <router-link
      :to="{ name: 'calculator-ecclivo' }"
      class="block p-4 bg-white border rounded-md shadow-md md:w-96 hover:text-white hover:bg-primary"
    >
      <div class="font-bold">{{ $t('calculator.ecclivo.title') }}</div>
      <div class="text-sm font-light">
        {{ $t('calculator.ecclivo.description') }}
      </div>
    </router-link>
  </div>
</template>
