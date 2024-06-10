<template>
  <header class="sticky z-40 top-0 bg-background/80 backdrop-blur-lg lg:border-b">
    <div class="container px-4 md:px-8 flex h-14 max-w-screen-xl items-center border-b lg:border-none gap-2 justify-between">
      <NuxtLink class="select-none" to="/">
        <NuxtImg class="flex h-6" src="/brand.svg" />
      </NuxtLink>
      <div class="flex justify-end gap-2">
        <DarkModeToggle />
      </div>
    </div>
  </header>

  <div class="border-b min-h-screen">
    <div class="container max-w-screen-lg px-4 md:px-8">
      <main class="py-6">
        <slot />
      </main>
    </div>
  </div>

  <footer class="text-muted-foreground py-6 md:px-8 md:py-0">
    <div class="container flex flex-col items-center justify-between gap-2 md:h-24 md:flex-row">
      <span class="text-sm">
        Designed by COSMO in 2024.
      </span>
    </div>
  </footer>
</template>
