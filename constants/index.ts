import { z } from 'zod';
import type { ICategory } from '~/types';

export const primaryCategorySchema = z.enum([
  'life',
  'study',
  'tips',
  'intl',
]);

export const secondaryCategorySchema = z.enum([
  'library',
  'activity',
  'dorm',
  'food',
  'club',
  'humanities',
  'science',
  'compulsories',
  'life',
  'study',
]);

export const categoryMap: Array<ICategory> = [{
  value: 'life',
  name: '生活篇',
  description: '来了就是深中人',
  icon: 'lucide:home',
  to: '/life',
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
  description: '什么都阻止不了我学习！',
  icon: 'lucide:book-marked',
  to: '/study',
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
  description: '在意想不到的时候很有用',
  icon: 'lucide:lightbulb',
  to: '/tips',
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
  description: '国际体系的特供经验',
  icon: 'lucide:globe',
  to: '/intl',
  secondary: [{
    value: 'study',
    name: '学习相关',
  }],
}];
