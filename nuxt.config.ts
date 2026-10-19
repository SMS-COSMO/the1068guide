import process from 'node:process';
import tailwindcss from '@tailwindcss/vite';
import { GUIDE_CACHE_SECONDS } from './shared/cache';

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  // Nuxt 4 defaults to an app/ directory. This repo keeps the Nuxt 3 layout.
  srcDir: '.',
  dir: {
    app: 'app',
  },

  devtools: { enabled: false },

  auth: {
    // Public pages are prerendered or ISR-cached, so the sealed session
    // cookie is read in the browser instead of during static generation.
    loadStrategy: 'client-only',
  },

  modules: [
    'shadcn-nuxt',
    '@nuxt/image',
    '@nuxt/icon',
    '@vueuse/nuxt',
    'nuxt-auth-utils',
  ],

  css: ['~/assets/css/tailwind.css'],

  // Public pages are static. Category guides change only when an editor
  // publishes, so they are regenerated at most once an hour (Vercel ISR).
  // Admin and the submission form are client-rendered shells.
  routeRules: {
    '/': { prerender: true },
    '/login': { prerender: true },
    '/new': { prerender: true },
    '/admin': { ssr: false },
    '/life': { isr: GUIDE_CACHE_SECONDS },
    '/study': { isr: GUIDE_CACHE_SECONDS },
    '/intl': { isr: GUIDE_CACHE_SECONDS },
    '/tips': { isr: GUIDE_CACHE_SECONDS },
    // Search uses this route. It shares the reviewed-guide function cache,
    // which editors clear on publish, so it is not given a second route cache.
    '/api/guides': { cache: false },
    '/api/trpc/**': { cache: false },
    '/api/auth/**': { cache: false },
    '/api/_auth/**': { cache: false },
  },

  nitro: {
    prerender: {
      crawlLinks: false,
      routes: ['/', '/login', '/new'],
    },
  },

  runtimeConfig: {
    tursoDatabaseUrl: '',
    tursoAuthToken: '',
    adminPasswordHash: '',
    session: {
      password: '',
      maxAge: 60 * 60 * 24 * 7,
      cookie: {
        sameSite: 'lax',
        secure: process.env.NODE_ENV === 'production',
      },
    },
  },

  icon: {
    serverBundle: {
      collections: ['lucide'],
    },
  },

  shadcn: {
    prefix: '',
    componentDir: './components/ui',
  },

  build: {
    transpile: ['trpc-nuxt'],
  },

  vite: {
    plugins: [tailwindcss()],
    optimizeDeps: {
      exclude: ['vee-validate'],
    },
  },

  compatibilityDate: '2026-10-19',
});
