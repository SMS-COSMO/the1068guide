<template>
  <NuxtLoadingIndicator :color="false" class="z-100 bg-primary/50" />
  <Toaster />
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>

<script setup lang="ts">
import '@/assets/css/tiptap-theme.css';
</script>
