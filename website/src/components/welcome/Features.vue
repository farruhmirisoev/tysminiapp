<template>
  <section
    aria-label="Features for running your books"
    class="pt-20 overflow-hidden bg-primary pb-28 sm:py-32"
  >
    <div class="relative px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
      <div class="max-w-2xl md:mx-auto md:text-center xl:max-w-none">
        <h2
          class="text-3xl tracking-tight text-white font-display sm:text-4xl md:text-5xl"
        >
          Everything you need to run your books.
        </h2>
        <p class="mt-6 text-lg tracking-tight text-blue-100">
          Well everything you need if you aren’t that picky about minor details
          like tax compliance.
        </p>
      </div>
      <div
        class="items-center pt-10 mt-16 grid grid-cols-1 gap-y-2 sm:gap-y-6 md:mt-20 lg:grid-cols-12 lg:pt-0"
      >
        <div
          class="flex pb-4 -mx-4 overflow-x-auto sm:mx-0 sm:overflow-visible sm:pb-0 lg:col-span-5"
        >
          <div
            class="relative z-10 flex px-4 gap-x-4 whitespace-nowrap sm:mx-auto sm:px-0 lg:mx-0 lg:block lg:gap-x-0 lg:gap-y-1 lg:whitespace-normal"
            role="tablist"
            aria-orientation="vertical"
          >
            <div
              v-for="(feature, index) in FEATURES"
              class="relative px-4 py-1 rounded-full group lg:rounded-r-none lg:rounded-l-xl lg:p-6"
              :class="
                active === index
                  ? 'bg-white lg:bg-white/10 lg:ring-1 lg:ring-inset lg:ring-white/10'
                  : 'hover:bg-white/10 lg:hover:bg-white/5'
              "
              :key="feature.title"
            >
              <h3>
                <button
                  class="font-display text-lg [&:not(:focus-visible)]:focus:outline-none"
                  :class="
                    active === index
                      ? 'text-primary lg:text-white'
                      : 'text-blue-100 hover:text-white lg:text-white'
                  "
                  role="tab"
                  type="button"
                  aria-selected="false"
                  tabindex="-1"
                  @click="active = index"
                >
                  <span
                    class="absolute inset-0 rounded-full lg:rounded-r-none lg:rounded-l-xl"
                  ></span
                  >{{ feature.title }}
                </button>
              </h3>
              <p
                class="hidden mt-2 text-sm text-blue-100 lg:block group-hover:text-white"
              >
                {{ feature.description }}
              </p>
            </div>
          </div>
        </div>
        <div class="lg:col-span-7">
          <div
            v-for="(feature, index) in FEATURES"
            :key="feature.title"
            :class="{ hidden: active !== index }"
            role="tabpanel"
          >
            <div class="relative sm:px-6 lg:hidden">
              <div
                class="absolute -inset-x-4 top-[-6.5rem] bottom-[-4.25rem] bg-white/10 ring-1 ring-inset ring-white/10 sm:inset-x-0 sm:rounded-t-xl"
              ></div>
              <p
                class="relative max-w-2xl mx-auto text-base text-white sm:text-center"
              >
                {{ feature.description }}
              </p>
            </div>
            <div
              class="mt-10 w-[45rem] overflow-hidden rounded-xl bg-slate-50 shadow-xl shadow-blue-900/20 sm:w-auto lg:mt-0 lg:w-[67.8125rem]"
            >
              <img
                sizes="(min-width: 1024px) 67.8125rem, (min-width: 640px) 100vw, 45rem"
                :src="feature.image"
                class="w-full"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref } from "vue";

const FEATURES = [
  {
    title: "Payroll",
    description:
      "Keep track of everyone's salaries and whether or not they've been paid. Direct deposit not supported.",
    image:
      "https://salient.tailwindui.com/_next/image?url=/_next/static/media/payroll.517af4e7.png&w=3840&q=75",
  },
  {
    title: "Claim expenses",
    description:
      "All of your receipts organized into one place, as long as you don't mind typing in the data by hand.",
    image:
      "https://salient.tailwindui.com/_next/image?url=/_next/static/media/expenses.3f331919.png&w=3840&q=75",
  },
  {
    title: "VAT handling",
    description:
      "We only sell our software to companies who don't deal with VAT at all, so technically we do all the VAT stuff they need.",
    image:
      "https://salient.tailwindui.com/_next/image?url=/_next/static/media/vat-returns.7402820f.png&w=3840&q=75",
  },
  {
    title: "Reporting",
    description:
      "Easily export your data into an Excel spreadsheet where you can do whatever the hell you want with it.",
    image:
      "https://salient.tailwindui.com/_next/image?url=/_next/static/media/reporting.2ad6f065.png&w=3840&q=75",
  },
];

const active = ref(0);
</script>
