import { Card, CardContent } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { AlertTriangle, Clock, UserCheck, Users, UserX } from 'lucide-react'
import { clientQuieries } from '../-queries'
import { useSuspenseQuery } from '@tanstack/react-query'
import { Suspense, useEffect } from 'react'
import { ErrorBoundary, useErrorBoundary } from '@/components/error-boundary'
import { toast } from 'sonner'

const summaryItems = [
  {
    key: 'total' as const,
    label: 'Total Clients',
    icon: Users,
    colorClass: 'text-blue-600',
    bgClass: 'bg-blue-100',
  },
  {
    key: 'active' as const,
    label: 'Active',
    icon: UserCheck,
    colorClass: 'text-green-600',
    bgClass: 'bg-green-100',
  },
  {
    key: 'pending' as const,
    label: 'Pending',
    icon: Clock,
    colorClass: 'text-orange-600',
    bgClass: 'bg-orange-100',
  },
  {
    key: 'inactive' as const,
    label: 'Inactive',
    icon: UserX,
    colorClass: 'text-red-600',
    bgClass: 'bg-red-100',
  },
]

export function Insights() {
  return (
    <ErrorBoundary fallback={<InsightsError />}>
      <Suspense fallback={<InsightsSkeleton />}>
        <InsightsCards />
      </Suspense>
    </ErrorBoundary>
  )
}

export function InsightsCards() {
  const { data: insights } = useSuspenseQuery(clientQuieries.insights())

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {summaryItems.map((item) => {
        const Icon = item.icon
        const value = insights[item.key]

        return (
          <Card key={item.key} className="card-elevated status-indicator">
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div
                  className={`flex h-12 w-12 items-center justify-center rounded-lg ${item.bgClass}`}
                >
                  <Icon className={`h-6 w-6 ${item.colorClass}`} />
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    {item.label}
                  </p>
                  <p className="text-2xl font-bold text-foreground">{value}</p>
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
        <Card key={item.key} className="card-elevated">
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <Skeleton className="h-12 w-12 rounded-lg" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-6 w-8" />
              </div>
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
      {/* Error state cards with opacity */}
      <div className="grid grid-cols-1 gap-4 opacity-60 sm:grid-cols-2 lg:grid-cols-4">
        {summaryItems.map((item) => {
          return (
            <Card key={item.key} className="card-elevated status-indicator">
              <CardContent className="p-6">
                <div className="flex items-center space-x-4">
                  <div
                    className={`flex h-12 w-12 items-center justify-center rounded-lg bg-red-100 dark:bg-red-900/50`}
                  >
                    <AlertTriangle className="h-6 w-6 text-red-600 dark:text-red-400" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      {item.label}
                    </p>
                    <p className="text-2xl font-bold text-foreground">0</p>
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
