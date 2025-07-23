import { chats, files, projects } from '@/schema'

export type ProjectDB = typeof projects.$inferSelect
export type FileDB = typeof files.$inferSelect
export type ChatDB = typeof chats.$inferSelect
