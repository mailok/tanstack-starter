import { useMatchRoute } from '@tanstack/react-router'

export function useClientRoute(clientId: string) {
  const matchRoute = useMatchRoute()

  const isPersonalInfo = matchRoute({
    to: '/backoffice/clients/$clientId/personal-info',
    params: { clientId },
  })
  const isMedicalInfo = matchRoute({
    to: '/backoffice/clients/$clientId/medical-info',
    params: { clientId },
  })
  const isBenefits = matchRoute({
    to: '/backoffice/clients/$clientId/benefits',
    params: { clientId },
  })

  return {
    isPersonalInfo: !!isPersonalInfo,
    isMedicalInfo: !!isMedicalInfo,
    isBenefits: !!isBenefits,
  }
}
