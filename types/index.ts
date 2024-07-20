import type { inferRouterInputs, inferRouterOutputs } from '@trpc/server';
import type { AppRouter } from '~/server/trpc/routers';

export type RouterOutput = inferRouterOutputs<AppRouter>;
export type RouterInput = inferRouterInputs<AppRouter>;

export type TPrimaryCategory = 'life' | 'study' | 'intl' | 'tips';
export type TSecondaryCategory =
  'library' |
  'activity' |
  'dorm' |
  'food' |
  'club' |
  'humanities' |
  'science' |
  'compulsories' |
  'life' |
  'study' |
  'overview';

export interface ICategory {
  value: TPrimaryCategory;
  name: string;
  description: string;
  icon: string;
  to: string;
  secondary: Array<{
    value: TSecondaryCategory;
    name: string;
  }>;
};
