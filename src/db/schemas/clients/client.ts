import { pgTable, uuid, timestamp, pgEnum } from 'drizzle-orm/pg-core'

export const ClientStatusEnum = pgEnum('client_status', [
  'active',
  'pending',
  'inactive',
])

export const ClientTable = pgTable('clients', {
  id: uuid('id').primaryKey().defaultRandom().notNull(),
  status: ClientStatusEnum('status').notNull(),
  createdAt: timestamp('created_at', { mode: 'string' }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { mode: 'string' }).notNull().defaultNow(),
})

export type Client = typeof ClientTable.$inferSelect
export type NewClient = typeof ClientTable.$inferInsert