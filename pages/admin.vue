<template>
  <Card v-if="error && !list" class="md:mx-auto md:w-1/2">
    <CardHeader>
      <CardTitle>
        请输入管理员密码
      </CardTitle>
      <CardDescription>
        登陆管理系统
      </CardDescription>
    </CardHeader>
    <CardContent>
      <Input v-model="inputPassword" />
      <Button class="w-full mt-4" @click="checkPassword">
        登陆
      </Button>
    </CardContent>
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

const { toast } = useToast();
const { $api } = useNuxtApp();

const adminStore = useAdminStore();
const inputPassword = ref('');

const { data: list, error } = await $api.guideReviewList.useQuery({
  password: adminStore.password,
});

async function checkPassword() {
  try {
    await $api.checkPassword.query({ password: inputPassword.value });
    adminStore.password = inputPassword.value;
    toast({ title: '登陆成功' });
    list.value = await $api.guideReviewList.query({
      password: adminStore.password,
    });
  } catch (err) {
    toast({ variant: 'destructive', title: '密码错误' });
  }
}

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
