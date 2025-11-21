import { pgEnum, pgTable, timestamp, uuid } from 'drizzle-orm/pg-core'

export const ClientStatusEnum = pgEnum('clientStatus', [
  'active',
  'pending',
  'inactive',
])

export const ClientTable = pgTable('clients', {
  id: uuid().primaryKey().defaultRandom().notNull(),
  status: ClientStatusEnum().notNull(),
  createdAt: timestamp({ mode: 'string' }).notNull().defaultNow(),
  updatedAt: timestamp({ mode: 'string' }).notNull().defaultNow(),
})

export type ClientRow = typeof ClientTable.$inferSelect
export type InsertClientRow = typeof ClientTable.$inferInsert
export type ClientStatus = ClientRow['status']
