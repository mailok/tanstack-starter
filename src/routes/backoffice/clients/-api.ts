import { db } from '@/db'
import { createServerFn } from '@tanstack/react-start'
import { and, count, eq, ilike } from 'drizzle-orm'
import { ClientTable } from '@/db/schemas/clients/client'
import { BaseClientSearchSchema } from './-schemas'
import { PersonalInformationTable } from '@/db/schemas/clients/personal-information'

export const getClientInsights = createServerFn({ method: 'GET' }).handler(
  async () => {
    const [activeRow] = await db
      .select({ count: count() })
      .from(ClientTable)
      .where(eq(ClientTable.status, 'active'))

    const [inactiveRow] = await db
      .select({ count: count() })
      .from(ClientTable)
      .where(eq(ClientTable.status, 'inactive'))

    const [pendingRow] = await db
      .select({ count: count() })
      .from(ClientTable)
      .where(eq(ClientTable.status, 'pending'))

    const [totalRow] = await db.select({ count: count() }).from(ClientTable)

    return {
      active: Number(activeRow?.count ?? 0),
      inactive: Number(inactiveRow?.count ?? 0),
      pending: Number(pendingRow?.count ?? 0),
      total: Number(totalRow?.count ?? 0),
    } as const
  },
)

export const getFilteredClients = createServerFn({ method: 'GET' })
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

    const rows = await db
      .select({
        id: ClientTable.id,
        status: ClientTable.status,
        createdAt: ClientTable.createdAt,
        updatedAt: ClientTable.updatedAt,
        photo: PersonalInformationTable.photo,
        fullName: PersonalInformationTable.name,
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

    const paginatedClients = rows.map((row) => ({
      id: row.id,
      status: row.status,
      createdAt: row.createdAt,
      updatedAt: row.updatedAt,
      personalInformation: {
        photo: row.photo,
        name: row.fullName,
        email: row.email,
        phone: row.phone,
        birthDate: row.birthDate,
        age: row.age,
        gender: row.gender,
      },
    }))

    return {
      clients: paginatedClients,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(rows.length / size),
      },
    }
  })
