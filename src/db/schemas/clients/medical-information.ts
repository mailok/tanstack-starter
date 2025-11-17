import { pgTable, text, uuid } from "drizzle-orm/pg-core";
import { ClientTable } from "./client";



export const MedicalInformationTable = pgTable(
  'client_medical_informations',
  {
    id: uuid('id').primaryKey().defaultRandom().notNull(),
    clientId: uuid('clientId')
      .references(() => ClientTable.id, { onDelete: 'cascade' })
      .notNull(),

    bloodType: text('blood_type'),
    allergies: text('allergies').array(),
    chronicConditions: text('chronic_conditions').array(),
    medications: text('medications').array(),
    lastCheckup: text('last_checkup'),
    emergencyContactName: text('emergency_contact_name'),
    emergencyContactPhone: text('emergency_contact_phone'),
    emergencyContactRelationship: text('emergency_contact_relationship'),
  },
)

export type MedicalInformation = typeof MedicalInformationTable.$inferSelect
export type NewMedicalInformation = typeof MedicalInformationTable.$inferInsert