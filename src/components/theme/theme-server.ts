import { createServerFn } from '@tanstack/react-start'
import { getRequestHeaders   } from '@tanstack/react-start/server'
import { getTheme } from './theme-storage'

export const getThemeServer = createServerFn().handler(
  async () => {
    const headers = getRequestHeaders()
    return getTheme(headers.get('cookie'))
  },
)