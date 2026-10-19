import type { AnyExtension } from '@tiptap/vue-3';
import ExtensionColor from '@tiptap/extension-color';
import Highlight from '@tiptap/extension-highlight';
import Image from '@tiptap/extension-image';
import Link from '@tiptap/extension-link';
import Placeholder from '@tiptap/extension-placeholder';
import Subscript from '@tiptap/extension-subscript';
import Superscript from '@tiptap/extension-superscript';
import Underline from '@tiptap/extension-underline';
import StarterKit from '@tiptap/starter-kit';

export const tipTapExtensions: AnyExtension[] = [
  StarterKit.configure({
    blockquote: false,
    bulletList: false,
    orderedList: false,
    code: false,
    codeBlock: false,
    heading: false,
    // Registered again below with the editor's own options.
    link: false,
    underline: false,
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
