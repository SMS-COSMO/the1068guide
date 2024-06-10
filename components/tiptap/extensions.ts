import StarterKit from '@tiptap/starter-kit';
import ExtensionColor from '@tiptap/extension-color';
import Image from '@tiptap/extension-image';
import Link from '@tiptap/extension-link';
import Placeholder from '@tiptap/extension-placeholder';
import Underline from '@tiptap/extension-underline';
import Subscript from '@tiptap/extension-subscript';
import Superscript from '@tiptap/extension-superscript';
import Highlight from '@tiptap/extension-highlight';
import type { AnyExtension } from '@tiptap/vue-3';

export const tipTapExtensions: AnyExtension[] = [
  StarterKit.configure({
    blockquote: false,
    bulletList: false,
    orderedList: false,
    code: false,
    codeBlock: false,
    heading: false,
  }),
  ExtensionColor,
  Image.configure({
    inline: true,
    HTMLAttributes: {
      crossorigin: 'use-credentials',
    },
  }),
  Link.configure({
    linkOnPaste: true,
    autolink: true,
    openOnClick: true,
  }),
  Placeholder,
  Underline,
  Subscript,
  Superscript,
  Highlight,
];
