import type { Client } from '@/db'

export function getGenderLabel(
  gender: Client['personalInformation']['gender'],
): string {
  switch (gender) {
    case 'male':
      return 'Male'
    case 'female':
      return 'Female'
    default:
      return 'Other'
  }
}
