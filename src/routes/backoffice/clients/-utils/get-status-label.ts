import type { Client } from '@/db'

export function getStatusLabel(status: Client['status']): string {
  switch (status) {
    case 'active':
      return 'Activo'
    case 'inactive':
      return 'Inactivo'
    case 'pending':
      return 'Pendiente'
    default:
      return status
  }
}
