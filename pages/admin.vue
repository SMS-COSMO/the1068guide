<template>
  <Card v-for="post in list" :key="post.id" class="mb-4">
    <CardHeader class="flex flex-row">
      <CardTitle class="text-lg">
        {{ categoryMap.find(x => x.value === post.primaryCategory)?.name }}
        <Icon name="lucide:chevron-right" class="mb-1.5" />
        {{ categoryMap.find(x => x.value === post.primaryCategory)?.secondary.find(x => x.value === post.secondaryCategory)?.name }}
      </CardTitle>
      <div class="ml-auto space-x-2">
        <Button size="icon" variant="outline" @click="approve(post.id)">
          <Icon name="lucide:check" />
        </Button>
        <Button size="icon" variant="outline" @click="reject(post.id)">
          <Icon name="lucide:x" />
        </Button>
      </div>
    </CardHeader>
    <CardContent>
      <TiptapViewer :content="post.content" />
    </CardContent>
  </Card>
</template>

<script setup lang="ts">
import { useToast } from '~/components/ui/toast';
import { categoryMap } from '~/constants';
import { useAdminStore } from '~/store/admin';

const adminStore = useAdminStore();
const { toast } = useToast();
const { $api } = useNuxtApp();

const { data: list } = await $api.guideReviewList.useQuery({
  password: adminStore.password,
});

async function approve(id: number) {
  try {
    await $api.modify.mutate({
      id,
      password: adminStore.password,
      isReviewed: true,
    });
    toast({ title: '成功通过' });
    list.value = await $api.guideReviewList.query({
      password: adminStore.password,
    });
  } catch (err) {
    toast({ title: '审核失败', variant: 'destructive' });
  }
}

async function reject(id: number) {
  try {
    await $api.remove.mutate({
      id,
      password: adminStore.password,
    });
    toast({ title: '成功拒绝' });
    list.value = await $api.guideReviewList.query({
      password: adminStore.password,
    });
  } catch (err) {
    toast({ title: '审核失败', variant: 'destructive' });
  }
}
</script>
