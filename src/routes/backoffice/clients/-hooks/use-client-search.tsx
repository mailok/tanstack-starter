import { useRouter, useSearch  } from '@tanstack/react-router'

export function useClientSearch() {
  const search = useSearch({ from: '/backoffice/clients/' })
  const router = useRouter()

  function setClientSearch(values: Partial<typeof search>) {
    router.navigate({
      to: '/backoffice/clients',
      search: { ...search, ...values },
    })
  }

  return [search, setClientSearch] as const
}
