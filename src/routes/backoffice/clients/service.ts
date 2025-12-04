import { and, count, eq, ilike } from 'drizzle-orm'
import type { ClientQuery } from './schemas'
import { ClientTable, type ClientStatus } from '@/db/schemas/client'
import { db } from '@/db'
import {
  PersonalInformationTable,
  type InsertPersonalInformationRow,
} from '@/db/schemas/client/personal-information'
import {
  MedicalInformationTable,
  type InsertMedicalInformationRow,
} from '@/db/schemas/client/medical-information'
import {
  BenefitsTable,
  type InsertBenefitsRow,
} from '@/db/schemas/client/benefits'

export async function getInsights() {
  const [{ active, inactive, pending, total }] = await db
    .select({
      active: count(eq(ClientTable.status, 'active')),
      inactive: count(eq(ClientTable.status, 'inactive')),
      pending: count(eq(ClientTable.status, 'pending')),
      total: count(),
    })
    .from(ClientTable)

  return { active, inactive, pending, total } as const
}

export async function findMany(query: ClientQuery) {
  const { page, name, status, size } = query
  const trimmedName = name.trim()

  const whereClause = and(
    eq(ClientTable.status, status),
    trimmedName
      ? ilike(PersonalInformationTable.name, `%${trimmedName}%`)
      : undefined,
  )

  const offset = (page - 1) * size

  const [clients, [{ total }]] = await Promise.all([
    db
      .select({
        id: ClientTable.id,
        status: ClientTable.status,
        photo: PersonalInformationTable.photo,
        name: PersonalInformationTable.name,
        email: PersonalInformationTable.email,
        phone: PersonalInformationTable.phone,
        birthDate: PersonalInformationTable.birthDate,
        gender: PersonalInformationTable.gender,
      })
      .from(ClientTable)
      .innerJoin(
        PersonalInformationTable,
        eq(PersonalInformationTable.clientId, ClientTable.id),
      )
      .where(whereClause)
      .orderBy(ClientTable.createdAt)
      .limit(size)
      .offset(offset),
    db
      .select({ total: count() })
      .from(ClientTable)
      .innerJoin(
        PersonalInformationTable,
        eq(PersonalInformationTable.clientId, ClientTable.id),
      )
      .where(whereClause),
  ])

  return { clients, total }
}

export async function getHeaderInfo(clientId: string) {
  const [client] = await db
    .select({
      id: ClientTable.id,
      status: ClientTable.status,
      photo: PersonalInformationTable.photo,
      name: PersonalInformationTable.name,
    })
    .from(ClientTable)
    .innerJoin(
      PersonalInformationTable,
      eq(PersonalInformationTable.clientId, ClientTable.id),
    )
    .where(eq(ClientTable.id, clientId))

  return client
}

export async function getPersonalInformation(clientId: string) {
  const [personalInfo] = await db
    .select()
    .from(PersonalInformationTable)
    .where(eq(PersonalInformationTable.clientId, clientId))

  return personalInfo
}

export async function getMedicalInformation(clientId: string) {
  const [result] = await db
    .select({
      clientId: ClientTable.id,
      medicalInfo: MedicalInformationTable,
    })
    .from(ClientTable)
    .leftJoin(
      MedicalInformationTable,
      eq(MedicalInformationTable.clientId, ClientTable.id),
    )
    .where(eq(ClientTable.id, clientId))

  return result
}

export async function getBenefits(clientId: string) {
  const [result] = await db
    .select({
      clientId: ClientTable.id,
      benefits: BenefitsTable,
    })
    .from(ClientTable)
    .leftJoin(BenefitsTable, eq(BenefitsTable.clientId, ClientTable.id))
    .where(eq(ClientTable.id, clientId))

  return result
}

export async function getClient(clientId: string) {
  const [client] = await db
    .select({
      id: ClientTable.id,
      status: ClientTable.status,
      personalInfo: {
        name: PersonalInformationTable.name,
        photo: PersonalInformationTable.photo,
        birthDate: PersonalInformationTable.birthDate,
        gender: PersonalInformationTable.gender,
        phone: PersonalInformationTable.phone,
        email: PersonalInformationTable.email,
      },
      medicalInfo: {
        bloodType: MedicalInformationTable.bloodType,
        allergies: MedicalInformationTable.allergies,
        chronicConditions: MedicalInformationTable.chronicConditions,
        medications: MedicalInformationTable.medications,
        lastCheckup: MedicalInformationTable.lastCheckup,
        emergencyContactName: MedicalInformationTable.emergencyContactName,
        emergencyContactPhone: MedicalInformationTable.emergencyContactPhone,
        emergencyContactRelationship:
          MedicalInformationTable.emergencyContactRelationship,
      },
      benefits: {
        insuranceProvider: BenefitsTable.insuranceProvider,
        policyNumber: BenefitsTable.policyNumber,
        coverageType: BenefitsTable.coverageType,
        deductible: BenefitsTable.deductible,
        copay: BenefitsTable.copay,
        annualLimit: BenefitsTable.annualLimit,
        dentalCoverage: BenefitsTable.dentalCoverage,
        visionCoverage: BenefitsTable.visionCoverage,
        mentalHealthCoverage: BenefitsTable.mentalHealthCoverage,
      },
    })
    .from(ClientTable)
    .where(eq(ClientTable.id, clientId))
    .leftJoin(
      PersonalInformationTable,
      eq(PersonalInformationTable.clientId, ClientTable.id),
    )
    .leftJoin(
      MedicalInformationTable,
      eq(MedicalInformationTable.clientId, ClientTable.id),
    )
    .leftJoin(BenefitsTable, eq(BenefitsTable.clientId, ClientTable.id))

  return client
}

// ============================================================================
// MUTATIONS
// ============================================================================

export type CreateClientInput = Omit<
  InsertPersonalInformationRow,
  'id' | 'clientId'
>

export async function createClient(personalInfo: CreateClientInput) {
  return db.transaction(async (tx) => {
    // Create client with pending status
    const [client] = await tx
      .insert(ClientTable)
      .values({ status: 'pending' })
      .returning({ id: ClientTable.id })

    // Create personal information linked to client
    await tx.insert(PersonalInformationTable).values({
      clientId: client.id,
      ...personalInfo,
    })

    return client
  })
}

export type UpdatePersonalInfoInput = {
  clientId: string
  data: Omit<InsertPersonalInformationRow, 'id' | 'clientId'>
}

export async function updatePersonalInfo({
  clientId,
  data,
}: UpdatePersonalInfoInput) {
  const [updated] = await db
    .update(PersonalInformationTable)
    .set(data)
    .where(eq(PersonalInformationTable.clientId, clientId))
    .returning({ id: PersonalInformationTable.id })

  return updated
}

export type UpdateMedicalInfoInput = {
  clientId: string
  data: Omit<InsertMedicalInformationRow, 'id' | 'clientId'>
}

export async function updateMedicalInfo({
  clientId,
  data,
}: UpdateMedicalInfoInput) {
  const [result] = await db
    .insert(MedicalInformationTable)
    .values({ clientId, ...data })
    .onConflictDoUpdate({
      target: MedicalInformationTable.clientId,
      set: data,
    })
    .returning({ id: MedicalInformationTable.id })

  return result
}

export type UpdateBenefitsInput = {
  clientId: string
  data: Omit<InsertBenefitsRow, 'id' | 'clientId'>
}

export async function updateBenefits({ clientId, data }: UpdateBenefitsInput) {
  const [result] = await db
    .insert(BenefitsTable)
    .values({ clientId, ...data })
    .onConflictDoUpdate({
      target: BenefitsTable.clientId,
      set: data,
    })
    .returning({ id: BenefitsTable.id })

  return result
}

export type CompleteOnboardingInput = {
  clientId: string
  benefits: Omit<InsertBenefitsRow, 'id' | 'clientId'>
}

export async function completeOnboarding({
  clientId,
  benefits,
}: CompleteOnboardingInput) {
  return db.transaction(async (tx) => {
    // Upsert benefits
    await tx
      .insert(BenefitsTable)
      .values({ clientId, ...benefits })
      .onConflictDoUpdate({
        target: BenefitsTable.clientId,
        set: benefits,
      })

    // Update client status to active
    const [client] = await tx
      .update(ClientTable)
      .set({ status: 'active', updatedAt: new Date().toISOString() })
      .where(eq(ClientTable.id, clientId))
      .returning({ id: ClientTable.id, status: ClientTable.status })

    return client
  })
}

export async function updateClientStatus(
  clientId: string,
  status: ClientStatus,
) {
  const [updated] = await db
    .update(ClientTable)
    .set({ status, updatedAt: new Date().toISOString() })
    .where(eq(ClientTable.id, clientId))
    .returning({ id: ClientTable.id, status: ClientTable.status })

  return updated
}