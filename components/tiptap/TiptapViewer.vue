<template>
  <div class="tiptap" v-html="html" />
</template>

<script setup lang="ts">
import { generateHTML } from '@tiptap/html';
import { tipTapExtensions } from './extensions';

const props = defineProps<{
  content: string | undefined | null;
}>();

const html = computed(() => {
  let json = {};
  if (props.content) {
    try {
      json = JSON.parse(props.content);
    } catch {}
  }

  return generateHTML(json, tipTapExtensions);
});
</script>
