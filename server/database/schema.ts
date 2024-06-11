import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';

export const guidebook = sqliteTable('guidebook', {
  id: integer('id', { mode: 'number' }).primaryKey({ autoIncrement: true }),
  content: text('content').notNull(),
  primaryCategory: text('primaryCategory', { enum: ['life', 'study', 'tips', 'intl'] }).notNull(),
  secondaryCategory: text('secondaryCategory', {
    enum: ['library', 'activity', 'dorm', 'food', 'club', 'humanities', 'science', 'compulsories', 'life', 'study'],
  }).notNull(),
  isReviewed: integer('is_reviewed', { mode: 'boolean' }).default(false).notNull(),
});
