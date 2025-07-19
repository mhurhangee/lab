import { pgTable, timestamp, varchar, integer } from 'drizzle-orm/pg-core'

export const projects = pgTable('projects', {
  id: varchar('id', { length: 12 }).primaryKey(),
  userId: varchar('user_id', { length: 255 }).notNull(),
  title: varchar('title', { length: 255 }).notNull(),
  description: varchar('description', { length: 512 }),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
})

export const files = pgTable('files', {
  id: varchar('id', { length: 12 }).primaryKey(),
  userId: varchar('user_id', { length: 255 }).notNull(),
  name: varchar('name', { length: 255 }).notNull(),
  url: varchar('url', { length: 512 }).notNull(),
  size: integer('size').notNull(),
  type: varchar('type', { length: 255 }).notNull(),
  projectId: varchar('project_id', { length: 12 }),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
})
