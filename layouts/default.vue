<template>
  <header class="sticky z-40 top-0 bg-background/80 backdrop-blur-lg lg:border-b">
    <div class="container px-4 md:px-8 flex h-14 max-w-screen-xl items-center border-b lg:border-none gap-2 justify-between">
      <NuxtLink class="flex select-none h-full" to="/">
        <NuxtImg preload class="dark:hidden h-10 self-center" src="/brand.svg" />
        <NuxtImg preload class="hidden dark:flex h-10 self-center" src="/brand-dark.svg" />
      </NuxtLink>
      <div class="flex justify-end gap-2">
        <DarkModeToggle />
        <NuxtLink to="https://github.com/SMS-COSMO/the1068guide" target="_blank">
          <Button variant="ghost" size="icon">
            <Icon name="lucide:github" size="18" />
          </Button>
        </NuxtLink>
        <NuxtLink to="https://the1068.pictures/" target="_blank">
          <Button variant="ghost" size="icon">
            <span class="font-serif leading-[0.6rem] text-xs font-semibold">
              10<br>68
            </span>
          </Button>
        </NuxtLink>
      </div>
    </div>
  </header>

  <div class="border-b min-h-screen">
    <div class="container max-w-screen-lg px-4 md:px-8">
      <main class="py-6 lg:py-10">
        <slot />
      </main>
    </div>
  </div>

  <footer class="text-muted-foreground py-6 md:px-8 md:py-0">
    <div class="container flex flex-col items-center justify-between gap-2 md:h-24 md:flex-row">
      <span class="text-sm">
        Designed by COSMO.
      </span>
      <div class="flex gap-2">
        <NuxtLink to="/admin">
          <Button variant="ghost" size="icon">
            <Icon name="lucide:circle-user" size="18" />
          </Button>
        </NuxtLink>
        <NuxtLink to="https://github.com/SMS-COSMO/the1068guide" target="_blank">
          <Button variant="ghost" size="icon">
            <Icon name="lucide:github" size="18" />
          </Button>
        </NuxtLink>
      </div>
    </div>
  </footer>
</template>
