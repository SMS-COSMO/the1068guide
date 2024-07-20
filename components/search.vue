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
      <Command v-model:search-term="input" class="h-svh sm:h-[450px]">
        <CommandInput placeholder="搜索指南..." />
        <CommandList class="max-h-full">
          <template v-for="post in processedListData" :key="post.id">
            <CardHeader>
              <CardTitle class="text-lg">
                {{ categoryMap.find(x => x.value === post.primaryCategory)?.name }}
                <Icon name="lucide:chevron-right" class="mb-1.5" />
                {{ categoryMap.find(x => x.value === post.primaryCategory)?.secondary.find(x => x.value === post.secondaryCategory)?.name }}
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
import { generateHTML } from '@tiptap/html';
import { useFuse } from '@vueuse/integrations/useFuse';
import { VisuallyHidden } from 'radix-vue';
import { tipTapExtensions } from './tiptap/extensions';
import { categoryMap } from '~/constants';

const { $api } = useNuxtApp();

const open = ref(false);

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

const input = ref('');

const { data: list } = await $api.guideList.useQuery({});

const preprocessedList = computed(() => list.value?.map((x) => {
  const { content, ...rest } = x;
  let json = {};
  try {
    json = JSON.parse(content);
  } catch {}
  const html = generateHTML(json, tipTapExtensions);

  return {
    content,
    searchPrompt: html.replaceAll(/<([^>]+)>/g, '').replaceAll(' ', ''),
    ...rest,
  };
}));

const fuse = useFuse(input, ref(preprocessedList.value ?? []), {
  fuseOptions: {
    keys: ['searchPrompt'],
    shouldSort: true,
  },
  matchAllWhenSearchEmpty: true,
});

const processedListData = computed(
  () => fuse.results.value
    .map(e => e.item),
);
</script>
