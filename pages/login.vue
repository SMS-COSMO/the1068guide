<template>
  <div class="h-[calc(100vh-14rem)] flex flex-col">
    <Card class="md:mx-auto md:w-1/2 my-auto">
      <CardHeader>
        <CardTitle>
          请输入管理员密码
        </CardTitle>
        <CardDescription>
          登陆管理系统
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form @submit.prevent="checkPassword">
          <Input v-model="inputPassword" type="password" autocomplete="current-password" />
          <Button class="w-full mt-4" type="submit" :disabled="pending">
            登陆
          </Button>
        </form>
      </CardContent>
    </Card>
  </div>
</template>

<script setup lang="ts">
import { useToast } from '~/components/ui/toast';

const { toast } = useToast();
const { fetch } = useUserSession();

const inputPassword = ref('');
const pending = ref(false);

async function checkPassword() {
  pending.value = true;
  try {
    await $fetch('/api/auth/login', {
      method: 'POST',
      body: { password: inputPassword.value },
    });
    await fetch();
    toast({ title: '登陆成功' });
    await navigateTo('/admin');
  } catch (error: unknown) {
    const status = typeof error === 'object' && error && 'statusCode' in error
      ? Number(error.statusCode)
      : 0;
    const title = status === 429
      ? '尝试次数过多，请稍后再试'
      : status === 401
        ? '密码错误'
        : '登录失败，请稍后再试';
    toast({ variant: 'destructive', title });
  } finally {
    pending.value = false;
  }
}

useHead({
  title: '登录 | 深中漫游指南',
});
</script>
