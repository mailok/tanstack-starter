import { getRouteApi, useRouter } from '@tanstack/react-router'
import type {SelectedTheme} from '@/components/theme/theme-storage';
import {
  
  updateSelectedTheme
} from '@/components/theme/theme-storage'

export function useTheme() {
  const router = useRouter()
  const routeApi = getRouteApi('__root__')
  const { theme } = routeApi.useLoaderData()

  function setTheme(selectedTheme: SelectedTheme) {
    updateSelectedTheme(selectedTheme)
    router.invalidate()
  }

  return { setTheme, theme }
}
