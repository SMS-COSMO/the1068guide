<template>
  <PageTitle title="增加新的内容" description="不知道写什么" />

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
import { toTypedSchema } from '@vee-validate/zod';
import { useForm } from 'vee-validate';

import * as z from 'zod';

const formSchema = toTypedSchema(z.object({
  primaryCategory: z.string(),
  secondaryCategory: z.string(),
  content: z.string(),
}));
const { values, handleSubmit, setFieldValue } = useForm({ validationSchema: formSchema });

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
  () => guideCategory.find(e => e.value === values.primaryCategory),
);
watch(selectedPrimaryCategory, () => setFieldValue('secondaryCategory', undefined, false));

const onSubmit = handleSubmit((values) => {
  // TODO
  console.log(values);
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
