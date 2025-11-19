import {
  boolean,
  integer,
  pgEnum,
  pgTable,
  text,
  uuid,
} from 'drizzle-orm/pg-core'
import { ClientTable } from '.'

export const coverageTypeEnum = pgEnum('coverageType', [
  'Basic',
  'Standard',
  'Premium',
])

export const BenefitsTable = pgTable('client_benefits', {
  id: uuid().primaryKey().defaultRandom().notNull(),
  clientId: uuid()
    .references(() => ClientTable.id, { onDelete: 'cascade' })
    .notNull(),

  insuranceProvider: text(),
  policyNumber: text(),
  coverageType: coverageTypeEnum(),
  deductible: integer(),
  copay: integer(),
  annualLimit: integer(),
  dentalCoverage: boolean(),
  visionCoverage: boolean(),
  mentalHealthCoverage: boolean(),
})

export type BenefitsRow = typeof BenefitsTable.$inferSelect
export type InsertBenefitsRow = typeof BenefitsTable.$inferInsert