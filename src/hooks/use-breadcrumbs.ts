import { useMatches } from '@tanstack/react-router'
import type { ReactNode } from 'react'

export function useBreadcrumbs(): Array<ReactNode> {
  const matches = useMatches()
  return matches
    .filter(
      (match) =>
        match.staticData &&
        typeof match.staticData === 'object' &&
        'crumb' in match.staticData,
    )
    .map((match) => match.staticData.crumb)
}
