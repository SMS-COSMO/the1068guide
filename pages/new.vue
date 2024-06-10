<template>
  <Breadcrumb class="mb-3">
    <BreadcrumbList>
      <BreadcrumbItem>
        <BreadcrumbLink href="/">
          主页
        </BreadcrumbLink>
      </BreadcrumbItem>
      <BreadcrumbSeparator />
      <BreadcrumbItem>
        <BreadcrumbPage>添加内容</BreadcrumbPage>
      </BreadcrumbItem>
    </BreadcrumbList>
  </Breadcrumb>

  <div class="mb-6 space-y-1">
    <p class="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
      增加新的内容
    </p>
    <p class="text-lg text-muted-foreground">
      不知道写什么
    </p>
  </div>

  <div class="grid lg:grid-cols-2 gap-4 lg:w-1/2">
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
              <SelectItem v-for="option in guideCategory" :key="option.value" :value="option.value">
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
      <FormItem>
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
import { toTypedSchema } from '@vee-validate/zod';
import { useForm } from 'vee-validate';

import * as z from 'zod';

const formSchema = toTypedSchema(z.object({
  primaryCategory: z.string(),
  secondaryCategory: z.string(),
  content: z.string(),
}));
const { values, handleSubmit } = useForm({ validationSchema: formSchema });

const guideCategory = [{
  value: 'life',
  name: '生活篇',
  secondary: [{
    value: 'library',
    name: '图书馆相关',
  }, {
    value: 'activity',
    name: '深中活动',
  }, {
    value: 'dorm',
    name: '宿舍相关',
  }, {
    value: 'food',
    name: '美食地图',
  }, {
    value: 'club',
    name: '社团相关',
  }],
}, {
  value: 'study',
  name: '学习篇',
  secondary: [{
    value: 'humanities',
    name: '文科',
  }, {
    value: 'science',
    name: '理科',
  }, {
    value: 'compulsories',
    name: '主科（语数英）',
  }],
}, {
  value: 'tips',
  name: '小技巧篇',
  secondary: [{
    value: 'life',
    name: '生活相关',
  }, {
    value: 'study',
    name: '学习相关',
  }],
}, {
  value: 'intl',
  name: '国际体系篇',
  secondary: [{
    value: 'study',
    name: '学习相关',
  }],
}];

const selectedPrimaryCategory = computed(
  () => guideCategory.find(e => e.value === (values.primaryCategory ?? 'life')),
);

const onSubmit = handleSubmit((values) => {
  // TODO
  console.log(values);
});
</script>
