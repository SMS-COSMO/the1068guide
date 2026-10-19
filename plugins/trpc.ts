import type { AppRouter } from '~/server/trpc/routers';
import { createTRPCNuxtClient, httpBatchLink } from 'trpc-nuxt/client';

export default defineNuxtPlugin(() => {
  const api = createTRPCNuxtClient<AppRouter>({
    links: [
      httpBatchLink({
        url: '/api/trpc',
        fetchOptions: {
          credentials: 'include',
        },
      }),
    ],
  });

  return {
    provide: {
      api,
    },
  };
});
