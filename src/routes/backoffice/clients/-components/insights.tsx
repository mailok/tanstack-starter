import { AlertTriangle, Clock, UserCheck, UserX, Users } from 'lucide-react'
import { useSuspenseQuery } from '@tanstack/react-query'
import { Suspense, useEffect } from 'react'
import { toast } from 'sonner'
import { clientQueries } from '../-queries'
import { ErrorBoundary, useErrorBoundary } from '@/components/error-boundary'
import { Skeleton } from '@/components/ui/skeleton'
import { Card, CardContent } from '@/components/ui/card'
import { cn } from '@/lib/utils'

const summaryItems = [
  {
    key: 'total' as const,
    label: 'Total Clients',
    icon: Users,
    gradient: 'from-blue-500 to-cyan-400',
    shadow: 'shadow-blue-500/20',
    iconColor: 'text-white',
  },
  {
    key: 'active' as const,
    label: 'Active',
    icon: UserCheck,
    gradient: 'from-primary to-purple-400', // Using the new primary (Electric Purple)
    shadow: 'shadow-primary/20',
    iconColor: 'text-white',
  },
  {
    key: 'pending' as const,
    label: 'Pending',
    icon: Clock,
    gradient: 'from-orange-500 to-amber-400',
    shadow: 'shadow-orange-500/20',
    iconColor: 'text-white',
  },
  {
    key: 'inactive' as const,
    label: 'Inactive',
    icon: UserX,
    gradient: 'from-red-500 to-pink-500',
    shadow: 'shadow-red-500/20',
    iconColor: 'text-white',
  },
]

export function Insights() {
  return (
    <ErrorBoundary fallback={<InsightsError />}>
      <Suspense fallback={<InsightsSkeleton />}>
        <InsightsContent />
      </Suspense>
    </ErrorBoundary>
  )
}

export function InsightsContent() {
  const { data: insights } = useSuspenseQuery(clientQueries.insights())

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {summaryItems.map((item) => {
        const Icon = item.icon
        const value = insights[item.key]

        return (
          <Card
            key={item.key}
            className={cn(
              'border-none overflow-hidden relative group transition-all duration-300',
            )}
          >
            <div
              className={cn(
                'absolute inset-0 opacity-[0.03] dark:opacity-[0.05] bg-gradient-to-br',
                item.gradient,
              )}
            />

            <CardContent className="p-6 relative z-10">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-1">
                    {item.label}
                  </p>
                  <p className="text-3xl font-bold text-foreground tracking-tight">
                    {value}
                  </p>
                </div>

                <div
                  className={cn(
                    'flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br shadow-lg transform group-hover:rotate-6 transition-transform duration-300',
                    item.gradient,
                    item.shadow,
                  )}
                >
                  <Icon className={cn('h-6 w-6', item.iconColor)} />
                </div>
              </div>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}

export function InsightsSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {summaryItems.map((item) => (
        <Card key={item.key} className="border-none shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="space-y-2">
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-8 w-12" />
              </div>
              <Skeleton className="h-12 w-12 rounded-xl" />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

export function InsightsError() {
  const { error, resetErrorBoundary } = useErrorBoundary()

  useEffect(() => {
    let id: string | number | undefined
    if (error) {
      id = toast.error('Error loading client insights', {
        description: error.message,
        position: 'top-right',
        duration: 5000,
        action: {
          label: 'Retry',
          onClick: resetErrorBoundary,
        },
      })
      return () => {
        if (id) {
          toast.dismiss(id)
        }
      }
    }
  }, [error, resetErrorBoundary])

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 gap-4 opacity-60 sm:grid-cols-2 lg:grid-cols-4">
        {summaryItems.map((item) => {
          return (
            <Card key={item.key} className="border-none shadow-sm">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground mb-1">
                      {item.label}
                    </p>
                    <p className="text-3xl font-bold text-foreground">0</p>
                  </div>
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-red-100 dark:bg-red-900/50">
                    <AlertTriangle className="h-6 w-6 text-red-600 dark:text-red-400" />
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
