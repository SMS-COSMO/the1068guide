<template>
  <Card v-for="post in list" :key="post.id" class="mb-4">
    <CardHeader class="relative flex flex-row items-center">
      <CardTitle class="text-lg">
        {{ categoryMap.find(x => x.value === post.primaryCategory)?.name }}
        <Icon name="lucide:chevron-right" class="mb-1.5" />
        {{ categoryMap.find(x => x.value === post.primaryCategory)?.secondary.find(x => x.value === post.secondaryCategory)?.name }}
      </CardTitle>
      <div class="ml-auto flex gap-2">
        <Button size="icon" variant="outline" @click="startEdit(post.id, post.content)">
          <Icon name="lucide:edit" />
        </Button>
        <AlertDialog>
          <AlertDialogTrigger>
            <Button size="icon" variant="outline">
              <Icon name="lucide:trash" />
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>确定要删除吗?</AlertDialogTitle>
              <AlertDialogDescription>
                此操作不可撤销，请仔细检查后再确认。
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter class="items-center">
              <AlertDialogCancel>取消</AlertDialogCancel>
              <AlertDialogAction @click="remove(post.id)">
                删除
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </CardHeader>
    <CardContent>
      <TiptapViewer v-if="post.id !== editing" :content="post.content" />
      <div v-else class="flex flex-col gap-2">
        <TiptapEditor v-model="newContent" />
        <div class="flex gap-2">
          <Button @click="modify(post.id)">
            确认
          </Button>
          <Button variant="outline" @click="editing = undefined; newContent = undefined;">
            取消
          </Button>
        </div>
      </div>
    </CardContent>
  </Card>
</template>

<script setup lang="ts">
import { getQueryKey } from 'trpc-nuxt/client';
import { useToast } from '../ui/toast';
import { categoryMap } from '~/constants';
import { useAdminStore } from '~/store/admin';
import type { TPrimaryCategory } from '~/types';

const props = defineProps<{
  category: TPrimaryCategory;
}>();

const { toast } = useToast();
const { $api } = useNuxtApp();
const adminStore = useAdminStore();

const { data: list } = await $api.guideList.useQuery({ primaryCategory: props.category });
const queryKey = getQueryKey($api.guideList, { primaryCategory: props.category });

const editing = ref();

async function remove(id: number) {
  try {
    await $api.remove.mutate({ password: adminStore.password, id });
    await refreshNuxtData(queryKey);
    toast({ title: '删除成功' });
  } catch {
    toast({ title: '删除失败', variant: 'destructive' });
  }
}

const newContent = ref<string | undefined>();
function startEdit(id: number, content: string) {
  editing.value = editing.value ? undefined : id;
  newContent.value = content;
}

async function modify(id: number) {
  try {
    await $api.modify.mutate({ password: adminStore.password, id, content: newContent.value });
    await refreshNuxtData(queryKey);
    editing.value = undefined;
    newContent.value = undefined;
    toast({ title: '修改成功' });
  } catch {
    toast({ title: '修改失败', variant: 'destructive' });
  }
}
</script>
