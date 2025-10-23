<template>
  <div>
    <div class="text-lg font-bold">{{ $t('fundData.thankYou') }}</div>
    <div class="flex items-start justify-between mt-4 text-sm">
      <div>
        <div class="font-bold">{{ $t('fundData.series') }}</div>
        <div class="text-xl font-light">{{ props.seria }}</div>

        <div class="mt-4 font-bold">{{ $t('fundData.number') }}</div>
        <div class="text-xl font-light">{{ props.number }}</div>

        <a
          :href="url"
          target="_blank"
          class="block mt-4 text-primary hover:underline"
        >
          {{ $t('fundData.checkPolicy') }}
        </a>
      </div>
      <transition name="fade">
        <img v-if="qr" :src="qr" />
      </transition>
    </div>
  </div>
</template>

<script setup lang="ts">
import QRCode from "qrcode";
import { computed, ref, watch } from "vue";

const props = defineProps<{
  seria: string;
  number: string;
  data: string;
}>();

const qr = ref("");

const url = computed(
  () => `https://ersp.e-osgo.uz/${props.seria}/${props.number}/${props.data}`
);

watch(
  url,
  async () => {
    if (url.value) {
      qr.value = await QRCode.toDataURL(url.value, { margin: 0, width: 160 });
    }
  },
  { immediate: true }
);
</script>
