import { db } from '@/db'
import { createServerFn } from '@tanstack/react-start'
import { and, count, eq, ilike } from 'drizzle-orm'
import { clients, clientPersonalInformation } from '@/db/schemas/clients'
import { BaseClientSearchSchema } from './-schemas'

export const getClientInsights = createServerFn({ method: 'GET' }).handler(
  async () => {
    const [activeRow] = await db
      .select({ count: count() })
      .from(clients)
      .where(eq(clients.status, 'active'))

    const [inactiveRow] = await db
      .select({ count: count() })
      .from(clients)
      .where(eq(clients.status, 'inactive'))

    const [pendingRow] = await db
      .select({ count: count() })
      .from(clients)
      .where(eq(clients.status, 'pending'))

    const [totalRow] = await db.select({ count: count() }).from(clients)

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
      eq(clients.status, status),
      trimmedName
        ? ilike(clientPersonalInformation.name, `%${trimmedName}%`)
        : undefined,
    )

    const offset = (page - 1) * size

    const rows = await db
      .select({
        id: clients.id,
        status: clients.status,
        createdAt: clients.createdAt,
        updatedAt: clients.updatedAt,
        photo: clientPersonalInformation.photo,
        fullName: clientPersonalInformation.name,
        email: clientPersonalInformation.email,
        phone: clientPersonalInformation.phone,
        birthDate: clientPersonalInformation.birthDate,
        age: clientPersonalInformation.age,
        gender: clientPersonalInformation.gender,
      })
      .from(clients)
      .innerJoin(
        clientPersonalInformation,
        eq(clientPersonalInformation.clientId, clients.id),
      )
      .where(whereClause)
      .orderBy(clients.createdAt)
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
