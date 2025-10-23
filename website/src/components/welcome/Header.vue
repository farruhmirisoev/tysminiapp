<template>
  <header class="py-10">
    <div class="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
      <nav class="relative z-50 flex justify-between">
        <div class="flex items-center md:gap-x-12">
          <a aria-label="Home" href="/#">
            <img src="/logo_extended.svg" alt="TYS" class="h-10" />
          </a>
        </div>

        <div class="flex items-center gap-x-5 md:gap-x-8">
          <div class="hidden md:flex md:gap-x-6">
            <a
              v-for="link in LINKS"
              class="inline-block px-2 py-1 text-sm rounded-lg text-slate-700 hover:bg-slate-100 hover:text-slate-900"
              :key="link.title"
              :href="link.href"
            >
              {{ link.title }}
            </a>
          </div>

          <button
            type="button"
            class="inline-block px-2 py-1 text-sm rounded-lg text-slate-700 hover:bg-slate-100 hover:text-slate-900"
            @click="store.setLocale(nextLocale)"
          >
            <i class="bx bx-globe"></i>
            {{ locale === "ru" ? "Русский" : "O'zbekcha" }}
          </button>

          <div class="-mr-1 md:hidden">
            <div>
              <button
                class="relative z-10 flex items-center justify-center text-slate-700"
                aria-label="Toggle Navigation"
                type="button"
                :aria-expanded="expanded ? 'true' : 'false'"
                @click="expanded = !expanded"
              >
                <i class="bx bx-sm" :class="expanded ? 'bx-x' : 'bx-menu'"></i>
              </button>

              <div v-if="expanded">
                <div
                  class="fixed inset-0 opacity-100 bg-slate-300/50"
                  aria-hidden="true"
                  @click="expanded = false"
                ></div>
                <div
                  class="absolute inset-x-0 flex flex-col p-4 mt-4 text-lg tracking-tight bg-white shadow-xl opacity-100 top-full origin-top rounded-2xl text-slate-900 ring-1 ring-slate-900/5 scale-100"
                  tabindex="-1"
                >
                  <a
                    v-for="link in LINKS"
                    class="block w-full p-2"
                    :key="link.title"
                    :href="link.href"
                  >
                    {{ link.title }}
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </nav>
    </div>
  </header>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { storeToRefs } from "pinia";

import { useSettingsStore } from "@/store/settings";

const store = useSettingsStore();

const LINKS = [
  {
    title: "Features",
    href: "/#features",
  },
  {
    title: "Testimonials",
    href: "/#testimonials",
  },
  {
    title: "Pricing",
    href: "/#pricing",
  },
];

const expanded = ref(false);
const { locale, nextLocale } = storeToRefs(store);
</script>
