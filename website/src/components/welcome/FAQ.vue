<template>
  <section
    aria-labelledby="faq-title"
    class="py-20 overflow-hidden bg-slate-50 sm:py-32"
  >
    <div class="relative px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
      <div class="max-w-2xl mx-auto lg:mx-0">
        <h2
          class="text-3xl tracking-tight font-display text-slate-900 sm:text-4xl"
        >
          Часто задаваемые вопросы
        </h2>
        <p class="mt-4 text-lg tracking-tight text-slate-700">
          Если вы не можете найти то, что ищете, отправьте электронное письмо в
          нашу службу поддержки, и, если вам повезет, кто-нибудь свяжется с
          вами.
        </p>
      </div>
      <ul
        role="list"
        class="max-w-2xl mx-auto mt-16 grid grid-cols-1 gap-8 lg:max-w-none lg:grid-cols-3"
      >
        <li v-for="faq in props.faqs" :key="faq.id">
          <h3 class="text-lg font-display leading-7 text-slate-900">
            {{ faq.question[locale] }}
          </h3>
          <div
            v-html="markdown(faq.answer[locale])"
            class="mt-4 text-sm text-slate-700"
          ></div>
        </li>
      </ul>
    </div>
  </section>
</template>

<script setup lang="ts">
import { storeToRefs } from "pinia";

import { useSettingsStore } from "@/store/settings";
import { markdown } from "@/misc/markdown";
import type { FAQ } from "@/models/welcome.model";

const props = defineProps<{
  faqs: FAQ[];
}>();

const store = useSettingsStore();

const { locale } = storeToRefs(store);
</script>
