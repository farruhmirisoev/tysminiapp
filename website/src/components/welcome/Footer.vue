<template>
  <footer class="bg-slate-50">
    <div class="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
      <div class="py-16">
        <img src="/logo.svg" alt="TYS" class="h-10 mx-auto" />
        <nav class="mt-10 text-sm" aria-label="quick links">
          <div class="flex justify-center -my-1 gap-x-6">
            <a
              v-for="link in LINKS"
              class="inline-block px-2 py-1 text-sm rounded-lg text-slate-700 hover:bg-slate-100 hover:text-slate-900"
              :key="link.title"
              :href="link.href"
            >
              {{ link.title }}
            </a>
          </div>
        </nav>
      </div>
      <div
        class="flex flex-col items-center py-10 border-t border-slate-400/10 sm:flex-row-reverse sm:justify-between"
      >
        <div class="flex gap-x-6">
          <a
            v-for="social in SOCIALS"
            class="text-slate-500 hover:text-slate-700"
            :key="social.name"
            :aria-label="`TYS on ${social.name}`"
            :href="social.href"
          >
            <i class="bx bx-sm" :class="social.icon"></i>
          </a>
        </div>
        <p class="mt-6 text-sm text-slate-500 sm:mt-0">
          © AO «TEMIRYO’L-SUG’URTA», 2002—{{ YEAR }}
        </p>
      </div>
    </div>
  </footer>
</template>

<script setup lang="ts">
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
const SOCIALS = [
  {
    name: "Twitter",
    href: "https://twitter.com",
    icon: "bxl-twitter",
  },
  {
    name: "Facebook",
    href: "https://facebook.com",
    icon: "bxl-facebook",
  },
  {
    name: "Instagram",
    href: "https://instagram.com",
    icon: "bxl-instagram",
  },
];
const YEAR = new Date().getFullYear();
</script>
