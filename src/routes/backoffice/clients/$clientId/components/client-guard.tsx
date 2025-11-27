import { useQuery } from '@tanstack/react-query'
import { clientQueries } from '../../queries'
import { ClientError } from './client-error'
import { useClientRoute } from '../hooks/use-client-route'

type Props = {
  clientId: string
  children: React.ReactNode
}

function useClientValidator(clientId: string) {
  const { isPersonalInfo, isMedicalInfo, isBenefits } = useClientRoute(clientId)

  const personalInfo = useQuery({
    ...clientQueries.personalInformation(clientId),
    throwOnError: false,
    retry: 0,
    enabled: isPersonalInfo,
  })
  const medicalInfo = useQuery({
    ...clientQueries.medicalInformation(clientId),
    throwOnError: false,
    retry: 0,
    enabled: isMedicalInfo,
  })
  const benefits = useQuery({
    ...clientQueries.benefits(clientId),
    throwOnError: false,
    retry: 0,
    enabled: isBenefits,
  })

  if (personalInfo.isError) return { isError: true, error: personalInfo.error }
  if (medicalInfo.isError) return { isError: true, error: medicalInfo.error }
  if (benefits.isError) return { isError: true, error: benefits.error }

  const isError =
    personalInfo.isError || medicalInfo.isError || benefits.isError
  const error = personalInfo.error || medicalInfo.error || benefits.error

  return { isError, error }
}

export function ClientGuard({ clientId, children }: Props) {
  const { isError, error } = useClientValidator(clientId)
  const { isPersonalInfo, isMedicalInfo, isBenefits } = useClientRoute(clientId)

  if (isError && error) {
    const message =
      error?.message ||
      'Something went wrong while loading the client details. Please try again.'

    const title = isPersonalInfo
      ? 'Error loading personal information'
      : isMedicalInfo
        ? 'Error loading medical information'
        : isBenefits
          ? 'Error loading benefits'
          : 'Error loading details'

    return <ClientError title={title} description={message} />
  }

  return <>{children}</>
}
