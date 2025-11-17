import {
  boolean,
  integer,
  pgEnum,
  pgTable,
  text,
  uuid,
} from 'drizzle-orm/pg-core'
import { ClientTable } from './client'

export const coverageTypeEnum = pgEnum('coverage_type', [
  'Basic',
  'Standard',
  'Premium',
])

export const BenefitsTable = pgTable('client_benefits', {
  id: uuid('id').primaryKey().defaultRandom().notNull(),
  clientId: uuid('clientId')
    .references(() => ClientTable.id, { onDelete: 'cascade' })
    .notNull(),

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

export type Benefits = typeof BenefitsTable.$inferSelect
export type NewBenefits = typeof BenefitsTable.$inferInsert