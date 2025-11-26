import { and, count, eq, ilike } from 'drizzle-orm'
import type { ClientQuery } from './-schemas'
import { ClientTable } from '@/db/schemas/client'
import { db } from '@/db'
import { PersonalInformationTable } from '@/db/schemas/client/personal-information'
import { MedicalInformationTable } from '@/db/schemas/client/medical-information'
import { BenefitsTable } from '@/db/schemas/client/benefits'

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
        age: PersonalInformationTable.age,
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
    .leftJoin(
      BenefitsTable,
      eq(BenefitsTable.clientId, ClientTable.id),
    )
    .where(eq(ClientTable.id, clientId))

  return result
}
