<template>
  <div class="mb-6 space-y-1">
    <p class="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
      {{ title }}
    </p>
    <p class="text-lg text-muted-foreground">
      {{ description }}
    </p>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  title: string;
  description: string;
}>();
</script>
