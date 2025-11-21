import { useSuspenseQuery } from '@tanstack/react-query'
import { Suspense } from 'react'
import { useNavigate, useSearch } from '@tanstack/react-router'
import { AlertTriangle } from 'lucide-react'
import { clientQueries } from '../-queries'
import { getInitials } from '../-utils/get-initials'
import { getGenderLabel } from '../-utils/get-gender-label'
import { getStatusLabel } from '../-utils/get-status-label'
import { ClientCard } from './client-card'
import type { GetClientsPageResponse } from '../-api'
import { ErrorBoundary, useErrorBoundary } from '@/components/error-boundary'
import { Card, CardContent } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { Button } from '@/components/ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'

type Client = GetClientsPageResponse['clients'][number]

function useClientSearch() {
  return useSearch({ from: '/backoffice/clients/' })
}

export function FilteredResults() {
  const search = useClientSearch()
  const resetKey = `${search.page}-${search.status}-${search.name}-${search.viewMode}`

  return (
    <ErrorBoundary key={resetKey} fallback={<FilteredResultsError />}>
      <Suspense fallback={<FilteredResultsSkeleton />}>
        <FilteredResultsContent />
      </Suspense>
    </ErrorBoundary>
  )
}

function FilteredResultsContent() {
  const search = useClientSearch()
  const navigate = useNavigate()

  const { data } = useSuspenseQuery(
    clientQueries.filteredClients({
      page: search.page,
      status: search.status,
      name: search.name,
      size: 10,
    }),
  )

  const handleClientClick = (client: Client) => {
    navigate({ to: `/backoffice/clients/${client.id}/personal-info`, search })
  }

  if (data.clients.length === 0) {
    return <EmptyResults />
  }
  if (search.viewMode === 'cards') {
    return (
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {data.clients.map((client, index) => (
          <div
            key={client.id}
            className="animate-in fade-in slide-in-from-bottom-4 fill-mode-backwards"
            style={{ animationDelay: `${index * 50}ms` }}
          >
            <ClientCard client={client} onClick={handleClientClick} />
          </div>
        ))}
      </div>
    )
  }
  return <ClientTable clients={data.clients} onClick={handleClientClick} />
}

function FilteredResultsSkeleton() {
  const search = useSearch({
    from: '/backoffice/clients/',
  })

  if (search.viewMode === 'cards') {
    return (
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <CardSkeleton key={i} />
        ))}
      </div>
    )
  }
  return <TableSkeleton />
}

function EmptyResults() {
  return (
    <div className="size-full flex items-center justify-center">
      <div className="p-12 text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-muted">
          <svg
            className="h-8 w-8 text-muted-foreground"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
            />
          </svg>
        </div>
        <h3 className="mt-4 text-lg font-semibold text-foreground">
          No clients found
        </h3>
        <p className="mt-2 text-sm text-muted-foreground">
          No clients were found matching the applied filters.
        </p>
      </div>
    </div>
  )
}

function CardSkeleton() {
  return (
    <Card className="card-elevated">
      <CardContent className="p-6">
        <div className="flex items-start space-x-4">
          <Skeleton className="h-16 w-16 rounded-full" />
          <div className="flex-1 space-y-3">
            <div className="flex items-start justify-between">
              <div className="space-y-2">
                <Skeleton className="h-5 w-32" />
                <Skeleton className="h-4 w-16" />
              </div>
            </div>
            <div className="space-y-2">
              <Skeleton className="h-4 w-48" />
              <Skeleton className="h-4 w-36" />
            </div>
            <div className="border-border border-t pt-3">
              <div className="space-y-2">
                <Skeleton className="h-4 w-40" />
                <Skeleton className="h-4 w-24" />
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

function TableSkeleton() {
  return (
    <div className="rounded-lg border bg-card shadow">
      <div className="space-y-4 p-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="flex items-center space-x-4">
            <Skeleton className="h-8 w-8 rounded-full" />
            <div className="grid flex-1 grid-cols-7 gap-4">
              <Skeleton className="h-4" />
              <Skeleton className="h-4" />
              <Skeleton className="h-4" />
              <Skeleton className="h-4" />
              <Skeleton className="h-4" />
              <Skeleton className="h-4" />
              <Skeleton className="h-4" />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

type ClientTableProps = {
  clients: Array<Client>
  onClick?: (client: Client) => void
}

function ClientTable({ clients, onClick }: ClientTableProps) {
  return (
    <div className="bg-card rounded-lg border shadow">
      <Table>
        <TableHeader>
          <TableRow className="hover:bg-transparent">
            <TableHead className="w-16"></TableHead>
            <TableHead>Nombre</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Teléfono</TableHead>
            <TableHead>Fecha Nacimiento</TableHead>
            <TableHead>Edad</TableHead>
            <TableHead>Género</TableHead>
            <TableHead>Estado</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {clients.map((client) => (
            <TableRow
              key={client.id}
              className={cn(
                'cursor-pointer transition-colors',
                onClick && 'hover:bg-card-hover',
              )}
              onClick={() => onClick?.(client)}
            >
              <TableCell>
                <Avatar className="h-8 w-8">
                  <AvatarImage src={client.photo} alt={client.name} />
                  <AvatarFallback className="bg-primary-muted text-primary text-xs">
                    {getInitials(client.name)}
                  </AvatarFallback>
                </Avatar>
              </TableCell>
              <TableCell className="font-medium">{client.name}</TableCell>
              <TableCell className="text-muted-foreground">
                {client.email}
              </TableCell>
              <TableCell className="text-muted-foreground">
                {client.phone}
              </TableCell>
              <TableCell className="text-muted-foreground">
                {new Date(client.birthDate).toLocaleDateString('es-ES')}
              </TableCell>
              <TableCell className="text-muted-foreground">
                {client.age}
              </TableCell>
              <TableCell className="text-muted-foreground">
                {getGenderLabel(client.gender)}
              </TableCell>
              <TableCell>
                <Badge className="text-xs" data-status={client.status}>
                  {getStatusLabel(client.status)}
                </Badge>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}

function FilteredResultsError() {
  const { error, resetErrorBoundary } = useErrorBoundary()
  return (
    <div className="size-full flex items-center justify-center">
      <div className="space-y-4 p-12 text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-destructive/10">
          <AlertTriangle className="h-5 w-5 text-red-600" />
        </div>
        <div className="space-y-2">
          <h3 className="text-lg font-semibold text-foreground">
            Error loading clients
          </h3>
          <p className="mx-auto max-w-md text-sm text-muted-foreground">
            {error?.message ||
              'Something went wrong while loading the client data. Please try again.'}
          </p>
        </div>
        <Button onClick={resetErrorBoundary} variant="outline" className="mt-4">
          Try Again
        </Button>
      </div>
    </div>
  )
}
