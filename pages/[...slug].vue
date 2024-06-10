<template>
  {{ categoryName }}
</template>

<script setup lang="ts">
const { params } = useRoute();

const categoryMap: { [key: string]: string } = {
  life: '生活篇',
  intl: '国际体系篇',
  study: '学习篇',
  tips: '小技巧篇',
};

const categoryName = computed(() => categoryMap[params.slug[0]]);

useHead({
  title: `${categoryName.value} | 深中漫游指南`,
  meta: [{ name: 'description', content: '一份不太常规的深中入学指南。' }],
});

useServerSeoMeta({
  title: `${categoryName.value} | 深中漫游指南`,
  ogTitle: `${categoryName.value} | 深中漫游指南`,
  description: '一份不太常规的深中入学指南。',
  ogImage: 'https://oss.the1068.pictures/ogDefault.png',
});
</script>
