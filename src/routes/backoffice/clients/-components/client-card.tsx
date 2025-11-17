import { Calendar, Mail, Phone, User } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import { getInitials } from '../-utils/get-initials'
import { getFilteredClients } from '../-api'
import { getStatusLabel } from '../-utils/get-status-label'

type Client = Awaited<ReturnType<typeof getFilteredClients>>['clients'][number]

type Props = {
  client: Client
  onClick?: (client: Client) => void
}

export function ClientCard({ client, onClick }: Props) {
  return (
    <Card
      className={cn(
        'card-elevated cursor-pointer transition-all duration-200',
        onClick && 'hover:scale-[1.02]',
      )}
      onClick={() => onClick?.(client)}
    >
      <CardContent className="p-6">
        <div className="flex items-start space-x-4">
          {/* Avatar */}
          <Avatar className="ring-border h-16 w-16 ring-2">
            <AvatarImage
              src={client.personalInformation.photo}
              alt={client.personalInformation.name}
            />
            <AvatarFallback className="bg-primary-muted text-primary font-semibold">
              {getInitials(client.personalInformation.name)}
            </AvatarFallback>
          </Avatar>

          {/* Content */}
          <div className="min-w-0 flex-1">
            <div className="mb-3 flex items-start justify-between">
              <div className="min-w-0 flex-1">
                <h3 className="text-foreground truncate text-base font-semibold">
                  {client.personalInformation.name}
                </h3>
                <Badge className="mt-1" data-status={client.status}>
                  {getStatusLabel(client.status)}
                </Badge>
              </div>
            </div>

            {/* Contact Info */}
            <div className="space-y-2">
              <div className="text-muted-foreground flex items-center text-sm">
                <Mail className="mr-2 h-4 w-4 shrink-0" />
                <span className="truncate">
                  {client.personalInformation.email}
                </span>
              </div>
              <div className="text-muted-foreground flex items-center text-sm">
                <Phone className="mr-2 h-4 w-4 shrink-0" />
                <span>{client.personalInformation.phone}</span>
              </div>
            </div>

            {/* Separator */}
            <div className="border-border my-4 border-t"></div>

            {/* Additional Info */}
            <div className="space-y-2">
              <div className="text-muted-foreground flex items-center text-sm">
                <Calendar className="mr-2 h-4 w-4 shrink-0" />
                <span>
                  {new Date(
                    client.personalInformation.birthDate,
                  ).toLocaleDateString('en-US')}{' '}
                  ({client.personalInformation.age} years)
                </span>
              </div>
              <div className="text-muted-foreground flex items-center text-sm">
                <User className="mr-2 h-4 w-4 shrink-0" />
                <span className="capitalize">
                  {client.personalInformation.gender === 'male'
                    ? 'Male'
                    : client.personalInformation.gender === 'female'
                      ? 'Female'
                      : 'Other'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
