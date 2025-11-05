// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2024-01-01",
  devtools: { enabled: false },

  modules: ["@nuxtjs/tailwindcss", "@pinia/nuxt", "@nuxtjs/i18n"],

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
    lazy: true,
    langDir: "locales",
    defaultLocale: "ru",
    strategy: "no_prefix",
    detectBrowserLanguage: {
      useCookie: true,
      cookieKey: "i18n_redirected",
      redirectOn: "root",
      alwaysRedirect: false,
      fallbackLocale: "ru",
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

  ssr: false,

  experimental: {
    payloadExtraction: false,
  },
});
