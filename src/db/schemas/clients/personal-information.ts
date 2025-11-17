import { integer, pgEnum, pgTable, text, uuid } from "drizzle-orm/pg-core";
import { ClientTable } from "./client";


export const GenderEnum = pgEnum('gender', ['male', 'female'])

export const PersonalInformationTable = pgTable(
  'client_personal_informations',
  {
    id: uuid('id').primaryKey().defaultRandom().notNull(),
    clientId: uuid('clientId')
      .references(() => ClientTable.id, { onDelete: 'cascade' })
      .notNull(),

    photo: text('photo').notNull(),
    name: text('name').notNull(),
    email: text('email').notNull(),
    phone: text('phone').notNull(),
    birthDate: text('birth_date').notNull(),
    age: integer('age').notNull(),
    gender: GenderEnum('gender').notNull(),
  },
) 

export type PersonalInformation = typeof PersonalInformationTable.$inferSelect
export type NewPersonalInformation = typeof PersonalInformationTable.$inferInsert