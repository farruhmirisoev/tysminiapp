<template>
  <Header></Header>
  <main>
    <Hero></Hero>
    <Features></Features>
    <Tasks></Tasks>
    <Starter></Starter>
    <Testimonials></Testimonials>
    <Pricing></Pricing>
    <FAQ v-if="!fetching && data" :faqs="data.faq"></FAQ>
  </main>
  <Footer></Footer>
</template>

<script setup lang="ts">
import { storeToRefs } from "pinia";

import { useWelcomeStore } from "@/store/welcome";

import FAQ from "@/components/welcome/FAQ.vue";
import Features from "@/components/welcome/Features.vue";
import Footer from "@/components/welcome/Footer.vue";
import Header from "@/components/welcome/Header.vue";
import Hero from "@/components/welcome/Hero.vue";
import Pricing from "@/components/welcome/Pricing.vue";
import Starter from "@/components/welcome/Starter.vue";
import Tasks from "@/components/welcome/Tasks.vue";
import Testimonials from "@/components/welcome/Testimonials.vue";

const store = useWelcomeStore();
const { data, fetching } = storeToRefs(store);

store.fetch();
</script>
