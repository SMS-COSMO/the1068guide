<template>
  <Button variant="outline" class="md:w-48 justify-start gap-2" @click="open = !open">
    <Icon name="lucide:search" />
    <span class="hidden md:block text-muted-foreground">
      搜索...
    </span>
  </Button>

  <Dialog v-model:open="open">
    <DialogContent class="p-0 max-w-2xl">
      <VisuallyHidden as-child>
        <DialogTitle />
      </VisuallyHidden>
      <VisuallyHidden as-child>
        <DialogDescription aria-describedby="undefined" />
      </VisuallyHidden>
      <Command :ignore-filter="true" class="h-svh sm:h-[450px]">
        <CommandInput v-model="input" placeholder="搜索指南..." />
        <CommandList class="max-h-full">
          <p v-if="loading" class="p-4 text-sm text-muted-foreground">
            加载中...
          </p>
          <p v-else-if="loadError" class="p-4 text-sm text-muted-foreground">
            搜索索引加载失败
          </p>
          <template v-for="post in processedListData" :key="post.id">
            <CardHeader>
              <CardTitle class="text-lg">
                <span class="inline-flex items-center gap-1">
                  <span>{{ categoryMap.find(x => x.value === post.primaryCategory)?.name }}</span>
                  <Icon name="lucide:chevron-right" class="size-4 shrink-0" />
                  <span>{{ categoryMap.find(x => x.value === post.primaryCategory)?.secondary.find(x => x.value === post.secondaryCategory)?.name }}</span>
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <TiptapViewer :content="post.content" />
            </CardContent>
            <CommandSeparator />
          </template>
        </CommandList>
      </Command>
    </DialogContent>
  </Dialog>
</template>

<script setup lang="ts">
import type { TPrimaryCategory, TSecondaryCategory } from '~/types';
import { useFuse } from '@vueuse/integrations/useFuse';
import { VisuallyHidden } from 'reka-ui';
import { categoryMap } from '~/constants';
import { guideHtml } from './tiptap/html';

interface GuideEntry {
  id: number;
  content: string;
  primaryCategory: TPrimaryCategory;
  secondaryCategory: TSecondaryCategory;
}

const open = ref(false);
const input = ref('');
const list = ref<GuideEntry[] | null>(null);
const loading = ref(false);
const loadError = ref(false);

const { Meta_K, Ctrl_K } = useMagicKeys({
  passive: false,
  onEventFired(e) {
    if (e.key === 'k' && (e.metaKey || e.ctrlKey))
      e.preventDefault();
  },
});

watch([Meta_K, Ctrl_K], (v) => {
  if (v[0] || v[1])
    open.value = true;
});

async function ensureGuides() {
  if (list.value || loading.value)
    return;

  loading.value = true;
  loadError.value = false;
  try {
    list.value = await $fetch<GuideEntry[]>('/api/guides');
  } catch {
    loadError.value = true;
  } finally {
    loading.value = false;
  }
}

watch(open, (isOpen) => {
  if (isOpen)
    void ensureGuides();
});

const preprocessedList = computed(() => (list.value ?? []).map((entry) => {
  const { content, ...rest } = entry;
  const html = guideHtml(content);

  return {
    content,
    searchPrompt: html.replaceAll(/<([^>]+)>/g, '').replaceAll(' ', ''),
    ...rest,
  };
}));

const fuse = useFuse(input, preprocessedList, {
  fuseOptions: {
    keys: ['searchPrompt'],
    shouldSort: true,
  },
  matchAllWhenSearchEmpty: true,
});

const processedListData = computed(
  () => fuse.results.value.map(entry => entry.item),
);
</script>
