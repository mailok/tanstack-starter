import {
  HeadContent,
  Scripts,
  createRootRouteWithContext,
} from '@tanstack/react-router'
import { TanStackRouterDevtoolsPanel } from '@tanstack/react-router-devtools'
import { TanStackDevtools } from '@tanstack/react-devtools'

import TanStackQueryDevtools from '../integrations/tanstack-query/devtools'

import appCss from '../styles.css?url'

import type { QueryClient } from '@tanstack/react-query'
import { Toaster } from '@/components/ui/sonner'
import { ThemeMonitor } from '@/components/theme/theme-monitor'
import { getThemeServer } from '@/components/theme/theme-server'
import { cn } from '@/lib/utils'

interface MyRouterContext {
  queryClient: QueryClient
}

export const Route = createRootRouteWithContext<MyRouterContext>()({
  head: () => ({
    meta: [
      {
        charSet: 'utf-8',
      },
      {
        name: 'viewport',
        content: 'width=device-width, initial-scale=1',
      },
      {
        title: 'TanStack Start Starter',
      },
    ],
    links: [
      {
        rel: 'stylesheet',
        href: appCss,
      },
    ],
  }),

  shellComponent: RootDocument,
  loader: async () => {
    const theme = await getThemeServer()
    return { theme }
  },
})

function RootDocument({ children }: { children: React.ReactNode }) {
  const { theme } = Route.useLoaderData()
  return (
    <html
      lang="en"
      className={cn('size-full', theme.selected || theme.detected)}
    >
      <head>
        <HeadContent />
        <ThemeMonitor />
      </head>
      <body className="size-full">
        {children}
        <TanStackDevtools
          config={{
            position: 'bottom-right',
          }}
          plugins={[
            {
              name: 'Tanstack Router',
              render: <TanStackRouterDevtoolsPanel />,
            },
            TanStackQueryDevtools,
          ]}
        />
        <Toaster richColors />
        <Scripts />
      </body>
    </html>
  )
}
