import { defineStore } from 'pinia';

export const useAdminStore = defineStore('user', () => {
  const password = ref('');
  return {
    password,
  };
}, {
  persist: {
    storage: persistedState.cookiesWithOptions({
      // One month
      maxAge: 30 * 24 * 60 * 60,
    }),
  },
});
