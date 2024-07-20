<template>
  <div class="box-border w-full rounded-md border shadow-sm">
    <ToggleGroup class="justify-start border-b p-1.5" size="sm" type="multiple">
      <ToggleGroupItem
        value="bold"
        aria-label="Toggle bold"
        :data-state="editor.isActive('bold') ? 'on' : 'off'"
        :pressed="editor.isActive('bold')"
        @mousedown.left="editor.chain().focus().toggleBold().run()"
      >
        <Icon name="lucide:bold" class="h-4 w-4" />
      </ToggleGroupItem>
      <ToggleGroupItem
        value="italic"
        aria-label="Toggle italic"
        :data-state="editor.isActive('italic') ? 'on' : 'off'"
        :pressed="editor.isActive('italic')"
        @mousedown.left="editor.chain().focus().toggleItalic().run()"
      >
        <Icon name="lucide:italic" class="h-4 w-4" />
      </ToggleGroupItem>
      <ToggleGroupItem
        value="underline"
        aria-label="Toggle underline"
        :data-state="editor.isActive('underline') ? 'on' : 'off'"
        :pressed="editor.isActive('underline')"
        @mousedown.left="editor.chain().focus().toggleUnderline().run()"
      >
        <Icon name="lucide:underline" class="h-4 w-4" />
      </ToggleGroupItem>
      <ToggleGroupItem
        value="strikethrough"
        aria-label="Toggle strikethrough"
        :data-state="editor.isActive('strike') ? 'on' : 'off'"
        :pressed="editor.isActive('strike')"
        @mousedown.left="editor.chain().focus().toggleStrike().run()"
      >
        <Icon name="lucide:strikethrough" class="h-4 w-4" />
      </ToggleGroupItem>
    </ToggleGroup>
    <div class="p-3 h-64">
      <EditorContent
        :editor="editor"
        class="h-full min-h-8 box-border px-1"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { useVModel } from '@vueuse/core';
import { Editor, EditorContent } from './vue';
import { tipTapExtensions } from './extensions';

const props = defineProps<{
  modelValue: string | null | undefined;
  class?: string;
}>();

const emit = defineEmits<{
  (e: 'update:modelValue', value?: string | null): void;
}>();

const content = useVModel(props, 'modelValue', emit);

const editor = new Editor({
  content: content.value ? JSON.parse(content.value) : undefined,
  extensions: tipTapExtensions,
  editorProps: {
    attributes: {
      class: `max-h-full w-full overflow-y-auto focus:outline-none p-0 h-full`,
    },
  },
  onUpdate: () => {
    emit('update:modelValue', JSON.stringify(editor.getJSON()));
  },
});

function resetEditor() {
  editor.commands.clearContent(true);
}

defineExpose({ resetEditor });
onUnmounted(() => editor.destroy());
</script>
