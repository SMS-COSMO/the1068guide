<template>
  <section class="mx-auto flex max-w-[980px] flex-col items-center gap-2 py-8 md:py-12 md:pb-8 lg:py-24 lg:pb-20">
    <h1 class="text-center text-3xl font-bold leading-tight tracking-tighter md:text-6xl lg:leading-[1.1]">
      [COSMO 图标]
      <br>
      深中漫游指南
    </h1>
    <span class="max-w-[750px] text-center text-lg text-muted-foreground sm:text-xl">
      一份 <s>不太常规的</s> 深中入学指南。
    </span>

    <section class="flex w-full items-center justify-center space-x-4 py-4 md:pb-10">
      <NuxtLink to="/new">
        <Button size="lg" class="text-md">
          <Icon name="lucide:plus" class="mr-1" />
          我要添加内容
        </Button>
      </NuxtLink>
    </section>
  </section>

  <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
    <NuxtLink v-for="(card, i) in categoryMap" :key="i" :to="card.to">
      <Card class="relative hover:bg-muted transition-all h-full">
        <CardHeader class="text-xl">
          <Icon :name="card.icon" size="30" class="mb-2" />
          <CardTitle>
            {{ card.name }}
          </CardTitle>
          <CardDescription>
            {{ card.description }}
          </CardDescription>
        </CardHeader>
        <Icon name="lucide:arrow-up-right" class="absolute right-4 top-4" />
      </Card>
    </NuxtLink>
  </div>
</template>

<script setup lang="ts">
import { categoryMap } from '~/constants';

useHead({
  title: '深中漫游指南',
  meta: [{ name: 'description', content: '一份不太常规的深中入学指南。' }],
});

useServerSeoMeta({
  title: '深中漫游指南',
  ogTitle: '深中漫游指南',
  description: '一份不太常规的深中入学指南。',
  ogImage: 'https://oss.the1068.pictures/ogDefault.png',
});
</script>
