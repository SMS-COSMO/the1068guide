export default defineNuxtRouteMiddleware(async () => {
  const { loggedIn, ready, fetch } = useUserSession();
  if (!ready.value)
    await fetch();

  if (!loggedIn.value)
    return navigateTo('/login');
});
