import db from '@/db'
import { createServerFn } from '@tanstack/react-start'
import { BaseClientSearchSchema } from './-schemas'
import { sleep } from '@/lib/sleep'

export const getClientInsights = createServerFn({ method: 'GET' }).handler(
  async () => {
    return {
      active: await db.clients.countByStatus('active'),
      inactive: await db.clients.countByStatus('inactive'),
      pending: await db.clients.countByStatus('pending'),
      total: await db.clients.count(),
    } as const
  },
)

export const getFilteredClients = createServerFn({ method: 'GET' })
  .inputValidator(BaseClientSearchSchema)
  .handler(async ({ data }) => {
    await sleep({ delay: 2000 })
    const { page, name, status, size } = data
    const clients = await db.clients.filterBy((client) => {
      return (
        client.status === status &&
        client.personalInformation.name
          .toLowerCase()
          .includes(name.toLowerCase())
      )
    })

    const totalClients = clients.length
    const totalPages = Math.ceil(totalClients / size)
    const startIndex = (page - 1) * size
    const endIndex = startIndex + size
    const paginatedClients = clients.slice(startIndex, endIndex)

    return {
      clients: paginatedClients,
      pagination: {
        currentPage: page,
        totalPages,
        totalClients,
        pageSize: size,
        hasNextPage: page < totalPages,
        hasPreviousPage: page > 1,
      },
    }
  })
