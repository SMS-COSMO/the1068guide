<template>
  <div class="tiptap" v-html="html" />
</template>

<script setup lang="ts">
import { guideHtml } from './html';

const props = defineProps<{
  content: string | undefined | null;
}>();

const html = computed(() => guideHtml(props.content));
</script>
