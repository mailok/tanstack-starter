import {
  pgEnum,
  pgTable,
  text,
  timestamp,
  integer,
  boolean,
} from 'drizzle-orm/pg-core'

export const clientStatusEnum = pgEnum('client_status', [
  'active',
  'pending',
  'inactive',
])

export const coverageTypeEnum = pgEnum('coverage_type', [
  'Basic',
  'Standard',
  'Premium',
])

export const genderEnum = pgEnum('gender', ['male', 'female'])

export const clients = pgTable('clients', {
  id: text('id')
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  status: clientStatusEnum('status').notNull(),
  createdAt: timestamp('created_at', { mode: 'string' }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { mode: 'string' }).notNull().defaultNow(),
})

export const clientPersonalInformation = pgTable('client_personal_information', {
  id: text('id')
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  clientId: text('client_id')
    .notNull()
    .references(() => clients.id, { onDelete: 'cascade' }),

  photo: text('photo').notNull(),
  name: text('name').notNull(),
  email: text('email').notNull(),
  phone: text('phone').notNull(),
  birthDate: text('birth_date').notNull(),
  age: integer('age').notNull(),
  gender: genderEnum('gender').notNull(),
})

export const clientMedicalInformation = pgTable('client_medical_information', {
  id: text('id')
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  clientId: text('client_id')
    .notNull()
    .references(() => clients.id, { onDelete: 'cascade' }),

  bloodType: text('blood_type'),
  allergies: text('allergies').array(),
  chronicConditions: text('chronic_conditions').array(),
  medications: text('medications').array(),
  lastCheckup: text('last_checkup'),
  emergencyContactName: text('emergency_contact_name'),
  emergencyContactPhone: text('emergency_contact_phone'),
  emergencyContactRelationship: text('emergency_contact_relationship'),
})

export const clientBenefits = pgTable('client_benefits', {
  id: text('id')
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  clientId: text('client_id')
    .notNull()
    .references(() => clients.id, { onDelete: 'cascade' }),

  insuranceProvider: text('insurance_provider'),
  policyNumber: text('policy_number'),
  coverageType: coverageTypeEnum('coverage_type'),
  deductible: integer('deductible'),
  copay: integer('copay'),
  annualLimit: integer('annual_limit'),
  dentalCoverage: boolean('dental_coverage'),
  visionCoverage: boolean('vision_coverage'),
  mentalHealthCoverage: boolean('mental_health_coverage'),
})

export type Client = typeof clients.$inferSelect
export type NewClient = typeof clients.$inferInsert

export type ClientPersonalInformation =
  typeof clientPersonalInformation.$inferSelect
export type NewClientPersonalInformation =
  typeof clientPersonalInformation.$inferInsert

export type ClientMedicalInformation =
  typeof clientMedicalInformation.$inferSelect
export type NewClientMedicalInformation =
  typeof clientMedicalInformation.$inferInsert
export type ClientBenefits = typeof clientBenefits.$inferSelect
export type NewClientBenefits = typeof clientBenefits.$inferInsert
