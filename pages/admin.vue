<template>
  <Tabs default-value="review">
    <TabsList class="grid w-40 grid-cols-2">
      <TabsTrigger value="review">
        审核
      </TabsTrigger>
      <TabsTrigger value="modify">
        修改
      </TabsTrigger>
    </TabsList>
    <TabsContent value="review">
      <AdminReview />
    </TabsContent>
    <TabsContent value="modify">
      <AdminModify />
    </TabsContent>
  </Tabs>
</template>

<script setup lang="ts">
useHead({
  title: '管理 | 深中漫游指南',
  meta: [{ name: 'description', content: '一份不太常规的深中入学指南。' }],
});

useServerSeoMeta({
  title: '管理 | 深中漫游指南',
  ogTitle: '管理 | 深中漫游指南',
  description: '一份不太常规的深中入学指南。',
});
</script>
