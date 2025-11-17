import { drizzle } from 'drizzle-orm/postgres-js'
import postgres from 'postgres'
import type {
  Client as ClientRow,
  ClientPersonalInformation,
  ClientMedicalInformation,
  ClientBenefits,
} from './schemas/clients'

const client = postgres(process.env.DATABASE_URL!)

export const db = drizzle({ client })

export type Client = ClientRow & {
  personalInformation: Omit<ClientPersonalInformation, 'clientId' | 'id'>
  medicalInformation?: Omit<ClientMedicalInformation, 'clientId' | 'id'> | null
  benefits?: Omit<ClientBenefits, 'clientId' | 'id'> | null
}

export default db
