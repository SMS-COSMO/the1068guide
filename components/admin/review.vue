<template>
  <Card v-if="!list?.length">
    <CardHeader>
      <CardTitle>
        暂无待审核投稿～
      </CardTitle>
    </CardHeader>
  </Card>
  <Card v-for="post in list" :key="post.id" class="mb-4">
    <CardHeader class="flex flex-row">
      <CardTitle class="text-lg">
        {{ categoryMap.find(x => x.value === post.primaryCategory)?.name }}
        <Icon name="lucide:chevron-right" class="mb-1.5" />
        {{ categoryMap.find(x => x.value === post.primaryCategory)?.secondary.find(x => x.value === post.secondaryCategory)?.name }}
      </CardTitle>
      <div class="ml-auto space-x-2">
        <Button size="icon" variant="outline" @click="approve(post.id)">
          <Icon :name="approvePending ? 'lucide:loader-circle' : 'lucide:check'" :class="[approvePending && 'animate-spin']" />
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
import { getQueryKey } from 'trpc-nuxt/client';
import { useToast } from '~/components/ui/toast';
import { categoryMap } from '~/constants';

const { toast } = useToast();
const { $api } = useNuxtApp();

const { data: list, error, refresh } = $api.guideReviewList.useQuery(undefined);
const queryKey = getQueryKey($api.guideReviewList);

watch(error, (value) => {
  if (value)
    navigateTo('/login');
}, { immediate: true });

useIntervalFn(async () => {
  await refresh();
}, 10000);

const approvePending = ref(false);
async function approve(id: number) {
  approvePending.value = true;
  try {
    await $api.modify.mutate({
      id,
      isReviewed: true,
    });
    toast({ title: '成功通过' });
    await refreshNuxtData(queryKey);
  } catch {
    toast({ title: '审核失败', variant: 'destructive' });
  }
  approvePending.value = false;
}

async function reject(id: number) {
  try {
    await $api.remove.mutate({ id });
    toast({ title: '成功拒绝' });
    await refreshNuxtData(queryKey);
  } catch {
    toast({ title: '审核失败', variant: 'destructive' });
  }
}
</script>
