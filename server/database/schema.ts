import { index, integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';

export const guidebook = sqliteTable('guidebook', {
  id: integer('id', { mode: 'number' }).primaryKey({ autoIncrement: true }),
  content: text('content').notNull(),
  primaryCategory: text('primaryCategory', { enum: ['life', 'study', 'tips', 'intl'] }).notNull(),
  secondaryCategory: text('secondaryCategory', {
    enum: ['library', 'activity', 'dorm', 'food', 'club', 'humanities', 'science', 'compulsories', 'life', 'study', 'overview'],
  }).notNull(),
  isReviewed: integer('is_reviewed', { mode: 'boolean' }).default(false).notNull(),
});

export const loginAttempts = sqliteTable('login_attempts', {
  id: integer('id', { mode: 'number' }).primaryKey({ autoIncrement: true }),
  ip: text('ip').notNull(),
  kind: text('kind', { enum: ['login', 'submit'] }).notNull(),
  createdAt: integer('created_at', { mode: 'number' }).notNull(),
}, table => [
  index('login_attempts_ip_kind_created_idx').on(table.ip, table.kind, table.createdAt),
]);
