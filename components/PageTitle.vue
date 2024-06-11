<template>
  <div class="mb-6 flex">
    <div class="space-y-1">
      <p class="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
        {{ title }}
      </p>
      <p class="text-lg text-muted-foreground">
        {{ description }}
      </p>
    </div>
    <NuxtLink v-if="newButton" class="ml-auto" to="/new">
      <Button>我要添加内容</Button>
    </NuxtLink>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  title: string;
  description: string;
  newButton: boolean;
}>();
</script>
