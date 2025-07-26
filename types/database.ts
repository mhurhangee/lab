import { chats, contexts, projects } from '@/schema'

export type ProjectDB = typeof projects.$inferSelect
export type ContextDB = typeof contexts.$inferSelect
export type ChatDB = typeof chats.$inferSelect
