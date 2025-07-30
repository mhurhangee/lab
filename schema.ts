import { integer, jsonb, pgTable, text, timestamp, varchar } from 'drizzle-orm/pg-core'

export const projects = pgTable('projects', {
  id: varchar('id', { length: 12 }).primaryKey(),
  userId: varchar('user_id', { length: 255 }).notNull(),
  title: varchar('title', { length: 255 }).notNull(),
  description: varchar('description', { length: 512 }),
  vectorStoreId: varchar('vector_store_id', { length: 255 }).notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
})

export const contexts = pgTable('contexts', {
  id: varchar('id', { length: 12 }).primaryKey(),
  userId: varchar('user_id', { length: 255 }).notNull(),
  name: varchar('name', { length: 255 }).notNull(),
  url: varchar('url', { length: 512 }).notNull(),
  size: integer('size').notNull(),
  type: varchar('type', { length: 255 }).notNull(),
  fileType: varchar('file_type', { length: 255 }),
  openaiUploadId: varchar('openai_upload_id', { length: 255 }),
  projectId: varchar('project_id', { length: 12 }),
  parsedMarkdown: text('parsed_markdown'),
  textDocument: jsonb('text_document'),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
})

export const chats = pgTable('chats', {
  id: varchar('id', { length: 12 }).primaryKey(),
  userId: varchar('user_id', { length: 255 }).notNull(),
  title: varchar('title', { length: 255 }).notNull().default('Untitled Chat'),
  messages: jsonb('messages').notNull().default([]),
  projectId: varchar('project_id', { length: 12 }),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
})
