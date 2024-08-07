<template>
  <PageTitle new-button :title="category.name" :description="category.description" />
  <template v-for="(posts, key) in Array.from(data)" :key="key">
    <h2
      class="mt-10 scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight transition-colors first:mt-0"
    >
      {{ category.secondary.find(x => x.value === posts[0])?.name }}
    </h2>

    <ol class="my-6 ml-6 list-decimal [&>li]:mt-4">
      <li v-for="post in posts[1]" :key="post.id">
        <TiptapViewer :content="post.content" />
      </li>
    </ol>
  </template>
</template>

<script setup lang="ts">
import { categoryMap } from '~/constants';
import type { RouterOutput, TPrimaryCategory, TSecondaryCategory } from '~/types';

const { params } = useRoute();
const { $api } = useNuxtApp();

const routeCategory = params.category as TPrimaryCategory;
const category = computed(
  () => categoryMap.find(x => x.value === routeCategory) || categoryMap[0],
);

const { data: guideList } = await $api.guideList.useQuery({ primaryCategory: routeCategory });
const data: Map<TSecondaryCategory, RouterOutput['guideList']> = new Map();
for (const c of categoryMap.find(x => x.value === routeCategory)?.secondary ?? []) {
  data.set(
    c.value,
    guideList.value
      ?.filter(x => x.secondaryCategory === c.value)
      ?.sort((a, b) => a.id - b.id)
      ?? [],
  );
}

useHead({
  title: `${category.value.name} | 深中漫游指南`,
  meta: [{ name: 'description', content: '一份不太常规的深中入学指南。' }],
});

useServerSeoMeta({
  title: `${category.value.name} | 深中漫游指南`,
  ogTitle: `${category.value.name} | 深中漫游指南`,
  description: '一份不太常规的深中入学指南。',
});
</script>
