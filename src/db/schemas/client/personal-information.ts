import { date, pgEnum, pgTable, text, uuid } from 'drizzle-orm/pg-core'
import { ClientTable } from '.'

export const GenderEnum = pgEnum('gender', ['male', 'female'])

export const PersonalInformationTable = pgTable(
  'client_personal_informations',
  {
    id: uuid().primaryKey().defaultRandom().notNull(),
    clientId: uuid()
      .references(() => ClientTable.id, { onDelete: 'cascade' })
      .notNull(),

    photo: text(),
    name: text().notNull(),
    email: text().notNull(),
    phone: text().notNull(),
    birthDate: date().notNull(),
    gender: GenderEnum(),
  },
)

export type PersonalInformationRow =
  typeof PersonalInformationTable.$inferSelect
export type InsertPersonalInformationRow =
  typeof PersonalInformationTable.$inferInsert
