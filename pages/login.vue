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
        <Input v-model="inputPassword" type="password" />
        <Button class="w-full mt-4" @click="checkPassword">
          登陆
        </Button>
      </CardContent>
    </Card>
  </div>
</template>

<script setup lang="ts">
import { useToast } from '~/components/ui/toast';
import { useAdminStore } from '~/store/admin';

const { toast } = useToast();
const { $api } = useNuxtApp();
const adminStore = useAdminStore();

const inputPassword = ref('');
async function checkPassword() {
  try {
    await $api.checkPassword.query({ password: inputPassword.value });
    adminStore.password = inputPassword.value;
    toast({ title: '登陆成功' });
    navigateTo('/admin');
  } catch {
    toast({ variant: 'destructive', title: '密码错误' });
  }
}
</script>
