<template>
  <main
    class="flex flex-col justify-center min-h-full px-4 py-16 text-center sm:px-6 lg:px-8"
  >
    <img class="w-auto h-12 mx-auto" src="/logo_extended.svg" alt="TYS" />

    <h1
      class="mt-16 text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl"
    >
      {{ $t('navigation.notFound') }}
    </h1>

    <p class="mt-2 text-base text-gray-500">
      {{ $t('navigation.notFoundMessage') }}
    </p>

    <div class="mt-6">
      <router-link
        :to="{ name: 'home' }"
        class="text-base font-medium text-primary hover:text-primary-light"
      >
        {{ $t('navigation.backToHome') }}
        <span aria-hidden="true">&rarr;</span>
      </router-link>
    </div>
  </main>
</template>
