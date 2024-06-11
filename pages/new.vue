<template>
  <PageTitle :new-button="false" title="增加新的内容" description="不知道写什么" />

  <div class="lg:w-1/4">
    <FormField v-slot="{ componentField }" name="primaryCategory">
      <FormItem>
        <FormLabel>一级类别</FormLabel>
        <Select v-bind="componentField">
          <FormControl>
            <SelectTrigger>
              <SelectValue placeholder="请选择" />
            </SelectTrigger>
          </FormControl>
          <SelectContent>
            <SelectGroup>
              <SelectItem v-for="option in categoryMap" :key="option.value" :value="option.value">
                {{ option.name }}
              </SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
        <FormDescription />
        <FormMessage />
      </FormItem>
    </FormField>
    <FormField v-slot="{ componentField }" name="secondaryCategory">
      <Transition name="fade">
        <FormItem v-show="selectedPrimaryCategory">
          <FormLabel>二级类别</FormLabel>
          <Select v-bind="componentField">
            <FormControl>
              <SelectTrigger>
                <SelectValue placeholder="请选择" />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              <SelectGroup>
                <SelectItem v-for="option in selectedPrimaryCategory?.secondary" :key="option.value" :value="option.value">
                  {{ option.name }}
                </SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
          <FormDescription />
          <FormMessage />
        </FormItem>
      </Transition>
    </FormField>
  </div>

  <FormField v-slot="{ value, handleChange }" name="content">
    <FormItem>
      <FormLabel>投稿内容</FormLabel>
      <FormControl>
        <TiptapEditor :model-value="value" @update:model-value="handleChange" />
      </FormControl>
      <FormDescription />
      <FormMessage />
    </FormItem>
  </FormField>

  <Button @click="onSubmit">
    提交
  </Button>
</template>

<script setup lang="ts">
import * as z from 'zod';
import { toTypedSchema } from '@vee-validate/zod';
import { useForm } from 'vee-validate';
import { categoryMap, primaryCategorySchema, secondaryCategorySchema } from '~/constants';
import { useToast } from '@/components/ui/toast/use-toast';

const { toast } = useToast();
const { $api } = useNuxtApp();

const formSchema = toTypedSchema(z.object({
  primaryCategory: primaryCategorySchema,
  secondaryCategory: secondaryCategorySchema,
  content: z.string(),
}));
const form = useForm({ validationSchema: formSchema });

const selectedPrimaryCategory = computed(
  () => categoryMap.find(e => e.value === form.values.primaryCategory),
);
watch(selectedPrimaryCategory, () => form.setFieldValue('secondaryCategory', undefined, false));

const onSubmit = form.handleSubmit(async (values) => {
  try {
    await $api.new.mutate(values);
    form.resetForm();
    toast({
      title: '投稿成功！',
      description: '等待管理员审核中~',
    });
    navigateTo('/');
  } catch (err) {

  }
});
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
