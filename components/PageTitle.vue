<template>
  <div class="mb-6 flex flex-col sm:flex-row items-center gap-4">
    <div class="space-y-1 text-center sm:text-start">
      <p class="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
        {{ title }}
      </p>
      <p class="text-lg text-muted-foreground">
        {{ description }}
      </p>
    </div>

    <div class="sm:ml-auto flex gap-2">
      <NuxtLink to="/">
        <Button variant="outline">
          <Icon name="lucide:arrow-left" class="mr-1" />
          返回
        </Button>
      </NuxtLink>
      <NuxtLink v-if="newButton" to="/new">
        <Button>我要添加内容</Button>
      </NuxtLink>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  title: string;
  description: string;
  newButton: boolean;
}>();
</script>
