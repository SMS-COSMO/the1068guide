// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: false },

  modules: [
    '@nuxtjs/tailwindcss',
    'shadcn-nuxt',
    '@nuxt/image',
    '@vueuse/nuxt',
    'nuxt-icon',
    '@nuxthub/core',
    '@pinia/nuxt',
    '@pinia-plugin-persistedstate/nuxt',
  ],

  hub: {
    database: true,
  },

  routeRules: {
    '/': { prerender: true },
    '/new': { ssr: false },
  },

  build: {
    transpile: ['trpc-nuxt'],
  },

  shadcn: {
    /**
     * Prefix for all the imported component
     */
    prefix: '',
    /**
     * Directory that the component lives in.
     * @default "./components/ui"
     */
    componentDir: './components/ui',
  },

  typescript: {
    tsConfig: {
      compilerOptions: {
        baseUrl: '.',
      },
    },
  },

  vite: {
    optimizeDeps: {
      exclude: ['vee-validate'],
    },
  },

  compatibilityDate: '2024-07-21',
});
