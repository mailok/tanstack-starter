import { useQuery } from '@tanstack/react-query'
import { clientQueries } from '../../-queries'
import { ClientError } from './client-error'
import { ClientLayoutPending } from './client-layout-pending'
import { CLIENT_ERROR_CODES } from '../../-constants'

type Props = {
  clientId: string
  children: React.ReactNode
}

export function ClientGuard({ clientId, children }: Props) {
  const { isLoading, isError, error } = useQuery(
    clientQueries.checkClientExists(clientId),
  )

  if (isLoading) {
    return <ClientLayoutPending />
  }

  if (isError) {
    if (error.message.includes(CLIENT_ERROR_CODES.INVALID_CLIENT_ID)) {
      return (
        <ClientError
          title="Invalid Client ID"
          description="The client ID provided is not valid."
        />
      )
    }
    if (error.message.includes(CLIENT_ERROR_CODES.CLIENT_NOT_FOUND)) {
      return (
        <ClientError
          title="Client Not Found"
          description="The client you are looking for does not exist or has been removed."
        />
      )
    }
    return (
      <ClientError
        title="Something went wrong"
        description="We were unable to load the client information. Please try again later."
      />
    )
  }

  return <>{children}</>
}
