// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2024-01-01",
  devtools: { enabled: false },
  
  modules: ["@nuxtjs/tailwindcss", "@pinia/nuxt", "@nuxtjs/i18n"],

  // Enable SSR for SSG (but use route rules to disable for client-only pages)
  ssr: true,

  // Disable payload extraction for static pages (prevents _payload.json errors)
  experimental: {
    payloadExtraction: false,
  },

  // Nitro configuration for static generation
  nitro: {
    prerender: {
      // Generate static pages for homepage and auth routes
      routes: ['/', '/signin', '/signup', '/password-recover'],
      // Don't crawl links (we specify routes explicitly)
      crawlLinks: false,
      // Don't fail on errors (some routes may fail during prerender)
      failOnError: false,
    },
    // Route rules for different pages
    routeRules: {
      // Homepage - prerendered as index.html (client-side rendered)
      '/': { prerender: true, ssr: false, index: true },
      // Auth pages - static (pre-rendered as SPA pages, no payload extraction)
      '/signin': { prerender: true, ssr: false, index: false },
      '/signup': { prerender: true, ssr: false, index: false },
      '/password-recover': { prerender: true, ssr: false, index: false },
      // Dynamic routes - client-side only (no prerender)
      '/activate/**': { ssr: false },
    },
  },

  i18n: {
    locales: [
      {
        code: "ru",
        language: "ru-RU",
        name: "Русский",
        file: "ru.json",
      },
      {
        code: "uz",
        language: "uz-UZ",
        name: "O'zbek",
        file: "uz.json",
      },
    ],
    // Bundle translations at build time (required for SSG with static pages)
    lazy: false,
    langDir: "locales",
    defaultLocale: "uz",
    strategy: "no_prefix",
    // Disable browser language detection to prevent loading wrong locale
    detectBrowserLanguage: false,
    // Ensure translations are available during SSG
    compilation: {
      strictMessage: false,
    },
    // Experimental options to ensure translations are bundled
    experimental: {
      stripMessagesPayload: false,
    },
    // Preload default locale
    precompile: {
      strictMessage: false,
    },
  },

  css: ["~/assets/css/main.css"],

  components: [
    {
      path: "~/components",
      pathPrefix: false,
    },
  ],

  app: {
    head: {
      title: "ECCLIVO Insurance - Telegram Mini App",
      htmlAttrs: {
        lang: "ru-RU",
      },
      meta: [
        { charset: "utf-8" },
        {
          name: "viewport",
          content:
            "width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no",
        },
        {
          name: "description",
          content: "Purchase OSGO insurance policy through Telegram",
        },
      ],
      script: [
        {
          src: "https://telegram.org/js/telegram-web-app.js",
          tagPosition: "head",
        },
      ],
      link: [
        {
          rel: "stylesheet",
          href: "https://unpkg.com/boxicons@2.1.4/css/boxicons.min.css",
        },
      ],
    },
  },

  runtimeConfig: {
    public: {
      apiBase:
        process.env.NUXT_PUBLIC_API_BASE || "https://port.tys.uz/rest/v2/",
      telegramBotToken: process.env.NUXT_PUBLIC_TELEGRAM_BOT_TOKEN || "",
    },
  },

  vite: {
    css: {
      preprocessorOptions: {
        scss: {
          additionalData: '@use "~/assets/scss/_variables.scss" as *;',
        },
      },
    },
  },

  tailwindcss: {
    cssPath: "~/assets/css/main.css",
    configPath: "tailwind.config",
  },
});
