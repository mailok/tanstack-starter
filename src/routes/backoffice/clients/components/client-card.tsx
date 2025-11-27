import { Calendar, Mail, Phone, User } from 'lucide-react'
import { getInitials } from '../utils/get-initials'
import { getStatusLabel } from '../utils/get-status-label'
import type { GetClientsPageResponse } from '../api'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { cn } from '@/lib/utils'

type Client = GetClientsPageResponse['clients'][number]

type Props = {
  client: Client
  onClick?: (client: Client) => void
}

export function ClientCard({ client, onClick }: Props) {
  return (
    <Card
      className={cn(
        'group relative overflow-hidden border-none shadow-sm transition-all duration-300 hover:shadow-xl card-elevated cursor-pointer transition-all duration-300',
        onClick && 'hover:scale-105 hover:z-10',
      )}
      onClick={() => onClick?.(client)}
    >
      <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-primary to-purple-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

      <CardContent className="p-6">
        <div className="flex items-start gap-5">
          {/* Avatar */}
          <Avatar className="h-20 w-20 ring-4 ring-background shadow-md group-hover:scale-105 transition-transform duration-300">
            <AvatarImage
              src={client.photo}
              alt={client.name}
              className="object-cover"
            />
            <AvatarFallback className="bg-gradient-to-br from-primary/10 to-purple-500/10 text-primary text-xl font-bold">
              {getInitials(client.name)}
            </AvatarFallback>
          </Avatar>

          {/* Content */}
          <div className="min-w-0 flex-1 space-y-1">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-lg font-bold text-foreground tracking-tight group-hover:text-primary transition-colors">
                  {client.name}
                </h3>
                <Badge
                  className="mt-1.5 font-medium px-2.5 py-0.5 rounded-full"
                  variant="secondary"
                  data-status={client.status}
                >
                  {getStatusLabel(client.status)}
                </Badge>
              </div>
            </div>

            {/* Contact Info */}
            <div className="pt-4 space-y-2.5">
              <div className="flex items-center text-sm text-muted-foreground group-hover:text-foreground/80 transition-colors">
                <Mail className="mr-2.5 h-4 w-4 text-primary/70" />
                <span className="truncate">{client.email}</span>
              </div>
              <div className="flex items-center text-sm text-muted-foreground group-hover:text-foreground/80 transition-colors">
                <Phone className="mr-2.5 h-4 w-4 text-primary/70" />
                <span>{client.phone}</span>
              </div>
            </div>

            {/* Separator */}
            <div className="h-px w-full bg-gradient-to-r from-border to-transparent my-4" />

            {/* Additional Info */}
            <div className="grid grid-cols-2 gap-2">
              <div className="flex items-center text-xs text-muted-foreground">
                <Calendar className="mr-2 h-3.5 w-3.5 opacity-70" />
                <span>
                  {new Date(client.birthDate).toLocaleDateString('en-US')}
                  <span className="ml-1 opacity-70">({client.age}y)</span>
                </span>
              </div>
              <div className="flex items-center text-xs text-muted-foreground">
                <User className="mr-2 h-3.5 w-3.5 opacity-70" />
                <span className="capitalize">{client.gender}</span>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
