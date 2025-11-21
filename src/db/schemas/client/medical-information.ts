import { pgTable, text, uuid } from 'drizzle-orm/pg-core'
import { ClientTable } from '.'

export const MedicalInformationTable = pgTable('client_medical_informations', {
  id: uuid().primaryKey().defaultRandom().notNull(),
  clientId: uuid()
    .references(() => ClientTable.id, { onDelete: 'cascade' })
    .notNull(),

  bloodType: text(),
  allergies: text().array(),
  chronicConditions: text().array(),
  medications: text().array(),
  lastCheckup: text(),
  emergencyContactName: text(),
  emergencyContactPhone: text(),
  emergencyContactRelationship: text(),
})

export type MedicalInformationRow = typeof MedicalInformationTable.$inferSelect
export type InsertMedicalInformationRow =
  typeof MedicalInformationTable.$inferInsert
