<template>
  <Tabs :default-value="categoryMap[0].value" class="mt-4">
    <TabsList class="grid w-full grid-cols-4">
      <TabsTrigger v-for="category in categoryMap" :key="category.value" :value="category.value">
        <Icon :name="category.icon" class="mr-2" />
        {{ category.name }}
      </TabsTrigger>
    </TabsList>
    <TabsContent v-for="category in categoryMap" :key="category.value" :value="category.value" class="mt-4">
      <AdminModifyCategory :category="category.value" />
    </TabsContent>
  </Tabs>
</template>

<script setup lang="ts">
import { categoryMap } from '~/constants';
</script>
