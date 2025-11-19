import { db } from '@/db'
import { createServerFn } from '@tanstack/react-start'
import { and, count, eq, ilike } from 'drizzle-orm'
import { ClientTable } from '@/db/schemas/client'
import { BaseClientSearchSchema } from './-schemas'
import { PersonalInformationTable } from '@/db/schemas/client/personal-information'

export const getClientInsights = createServerFn({ method: 'GET' }).handler(
  async () => {
    const [{ active, inactive, pending, total }] = await db
      .select({
        active: count(eq(ClientTable.status, 'active')),
        inactive: count(eq(ClientTable.status, 'inactive')),
        pending: count(eq(ClientTable.status, 'pending')),
        total: count(),
      })
      .from(ClientTable)

    return {
      active,
      inactive,
      pending,
      total,
    } as const
  },
)

export type GetClientsPageResponse = Awaited<ReturnType<typeof getClientsPage>>

export const getClientsPage = createServerFn({ method: 'GET' })
  .inputValidator(BaseClientSearchSchema)
  .handler(async ({ data }) => {
    const { page, name, status, size } = data
    const trimmedName = name.trim()

    const whereClause = and(
      eq(ClientTable.status, status),
      trimmedName
        ? ilike(PersonalInformationTable.name, `%${trimmedName}%`)
        : undefined,
    )

    const offset = (page - 1) * size

    const clients = await db
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
      .offset(offset)

      const [{ total }] = await db
        .select({ total: count() })
        .from(ClientTable)
        .innerJoin(
          PersonalInformationTable,
          eq(PersonalInformationTable.clientId, ClientTable.id),
        )
        .where(whereClause)

      return {
        clients,
        total,
      }
  })
