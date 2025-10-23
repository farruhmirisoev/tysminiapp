<template>
  <div>
    <div class="text-lg font-bold">{{ $t('main.buy') }}</div>
    <div class="flex gap-4 mt-4 align-middle">
      <router-link
        :to="{ name: 'osgor-create' }"
        class="p-4 bg-white border rounded-md shadow-md hover:text-white hover:bg-primary"
      >
        <div class="font-bold">{{ $t('main.policies.osgor.title') }}</div>
        <div class="text-sm font-light">
          {{ $t('main.policies.osgor.description') }}
        </div>
      </router-link>

      <router-link
        v-if="!restriction"
        :to="{ name: 'ecclivo-create' }"
        class="p-4 bg-white border rounded-md shadow-md hover:text-white hover:bg-primary"
      >
        <div class="font-bold">{{ $t('main.policies.osgo.title') }}</div>
        <div class="text-sm font-light">
          {{ $t('main.policies.osgo.description') }}
        </div>
      </router-link>

      <router-link
        :to="{ name: 'osgop-create' }"
        class="p-4 bg-white border rounded-md shadow-md hover:text-white hover:bg-primary"
      >
        <div class="font-bold">{{ $t('main.policies.osgop.title') }}</div>
        <div class="text-sm font-light">
          {{ $t('main.policies.osgop.description') }}
        </div>
      </router-link>
    </div>

    <div class="mt-8 text-lg font-bold">{{ $t('main.calculate') }}</div>
    <div
      class="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mt-4 align-middle"
    >
      <router-link
        :to="{ name: 'calculator-ecclivo' }"
        class="p-4 bg-white border rounded-md shadow-md hover:text-white hover:bg-primary"
      >
        <div class="font-bold">{{ $t('main.calculator.osgo.title') }}</div>
        <div class="text-sm font-light">
          {{ $t('main.calculator.osgo.description') }}
        </div>
      </router-link>
    </div>

    <div class="mt-8 text-lg font-bold">
      {{ $t('main.claim.title') }}
    </div>
    <div
      class="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mt-4 align-middle"
    >
      <router-link
        :to="{ name: 'claim-create', query: { type: 'osgor' } }"
        class="p-4 bg-white border rounded-md shadow-md hover:text-white hover:bg-primary"
      >
        <div class="font-bold">{{ $t('main.claim.osgor.title') }}</div>
        <div class="text-sm font-light">
          {{ $t('main.claim.osgor.description') }}
        </div>
      </router-link>
      <router-link
        :to="{ name: 'claim-create', query: { type: 'ecclivo' } }"
        class="p-4 bg-white border rounded-md shadow-md hover:text-white hover:bg-primary"
      >
        <div class="font-bold">{{ $t('main.claim.osgo.title') }}</div>
        <div class="text-sm font-light">
          {{ $t('main.claim.osgo.description') }}
        </div>
      </router-link>
      <router-link
        :to="{ name: 'claim-create', query: { type: 'osgop' } }"
        class="p-4 bg-white border rounded-md shadow-md hover:text-white hover:bg-primary"
      >
        <div class="font-bold">{{ $t('main.claim.osgop.title') }}</div>
        <div class="text-sm font-light">
          {{ $t('main.claim.osgop.description') }}
        </div>
      </router-link>
      <router-link
        :to="{ name: 'claim-create', query: { type: 'others' } }"
        class="p-4 bg-white border rounded-md shadow-md hover:text-white hover:bg-primary"
      >
        <div class="font-bold">{{ $t('main.claim.others.title') }}</div>
        <div class="text-sm font-light">
          {{ $t('main.claim.others.description') }}
        </div>
      </router-link>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useWorkStore } from "@/store/work";
import { WorkType } from "@/models/enums/enums";

const workStore = useWorkStore();
const restriction = workStore.getWorkService(WorkType.PAGE);
</script>
