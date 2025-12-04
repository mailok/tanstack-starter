import {
  MutationCache,
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query'

declare module '@tanstack/react-query' {
  interface Register {
    mutationMeta: {
      invalidateQueries?: string[]
      successMessage?: string
      errorMessage?: string
    }
  }
}

export function getContext() {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        refetchOnWindowFocus: import.meta.env.PROD,
        /* staleTime: 10 * 1000 */ // 10s
      },
    },
    mutationCache: new MutationCache({
      onSuccess: (_data, _variables, _context, mutation) => {
        if (mutation.meta?.successMessage) {
          // TODO: notify success message
        }
      },
      onError: (_error, _variables, _context, mutation) => {
        if (mutation.meta?.errorMessage) {
          // TODO: notify error message
        }
      },
      onSettled: (_data, _error, _variables, _context, mutation) => {
        if (mutation.meta?.invalidateQueries) {
          queryClient.invalidateQueries({
            queryKey: mutation.meta.invalidateQueries,
          })
        }
      },
    }),
  })
  return {
    queryClient,
  }
}

export function Provider({
  children,
  queryClient,
}: {
  children: React.ReactNode
  queryClient: QueryClient
}) {
  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  )
}
