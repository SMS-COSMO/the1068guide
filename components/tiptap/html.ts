import type { JSONContent } from '@tiptap/core';
import { generateHTML } from '@tiptap/html';
import { tipTapExtensions } from './extensions';

function escapeHtml(value: string) {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;');
}

export function guideHtml(content: string | null | undefined) {
  if (!content)
    return '';

  try {
    const json = JSON.parse(content) as JSONContent;
    if (!json || typeof json !== 'object' || json.type !== 'doc')
      return escapeHtml(content);
    return generateHTML(json, tipTapExtensions);
  } catch {
    return escapeHtml(content);
  }
}
