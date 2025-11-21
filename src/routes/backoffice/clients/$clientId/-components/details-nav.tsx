import {
  Calendar,
  CreditCard,
  FileText,
  HeartPulse,
  Notebook,
  ShieldPlus,
  User,
} from 'lucide-react'
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
} from '@/components/ui/sidebar'
import { Link } from '@tanstack/react-router'
import { cn } from '@/lib/utils'

type Tab = {
  name: string
  value: string
  to: string
  disabled: boolean
  icon: React.ElementType
}

type Section = {
  title: string
  items: readonly Tab[]
}

const sections: readonly Section[] = [
  {
    title: 'General',
    items: [
      {
        name: 'Personal Information',
        value: 'personal-info',
        to: '/backoffice/clients/$clientId/personal-info',
        disabled: false,
        icon: User,
      },
      {
        name: 'Medical Information',
        value: 'medical-info',
        to: '/backoffice/clients/$clientId/medical-info',
        disabled: false,
        icon: HeartPulse,
      },
      {
        name: 'Benefits',
        value: 'benefits',
        to: '/backoffice/clients/$clientId/benefits',
        disabled: false,
        icon: ShieldPlus,
      },
    ],
  },
  {
    title: 'Records',
    items: [
      {
        name: 'Documents',
        value: 'documents',
        to: '/backoffice/clients/$clientId/documents',
        disabled: true,
        icon: FileText,
      },
      {
        name: 'Notes',
        value: 'notes',
        to: '/backoffice/clients/$clientId/notes',
        disabled: true,
        icon: Notebook,
      },
    ],
  },
  {
    title: 'Management',
    items: [
      {
        name: 'Appointments',
        value: 'appointments',
        to: '/backoffice/clients/$clientId/appointments',
        disabled: true,
        icon: Calendar,
      },
      {
        name: 'Billing',
        value: 'billing',
        to: '/backoffice/clients/$clientId/billing',
        disabled: true,
        icon: CreditCard,
      },
    ],
  },
] as const

type Props = {
  children: React.ReactNode
  header?: React.ReactNode
}

export function DetailsNav({ children, header }: Props) {
  return (
    <SidebarProvider className="min-h-0 flex-1 flex-row">
      {/* Unified Sidebar for Desktop and Mobile */}
      <div className="w-[48px] md:w-auto md:min-w-48 flex-shrink-0 bg-sidebar border-r md:bg-transparent md:border-none transition-all duration-200 ease-linear">
        <Sidebar
          collapsible="none"
          className="bg-transparent w-full border-none h-full"
        >
          {header && (
            <SidebarHeader className="hidden md:block">{header}</SidebarHeader>
          )}
          <SidebarContent>
            {sections.map((section) => (
              <SidebarGroup key={section.title} className="p-0">
                <SidebarGroupContent>
                  <SidebarMenu>
                    {section.items.map((tab) => (
                      <SidebarMenuItem key={tab.value}>
                        <Link
                          to={tab.to}
                          disabled={tab.disabled}
                          activeOptions={{ exact: true, includeSearch: false }}
                          className="w-full"
                        >
                          {({ isActive }) => (
                            <SidebarMenuButton
                              isActive={isActive}
                              asChild
                              disabled={tab.disabled}
                              className={cn(
                                'w-full justify-center md:justify-start h-10 md:h-auto p-2',
                                tab.disabled && 'opacity-50',
                              )}
                              tooltip={tab.name}
                            >
                              <span className="flex items-center gap-2">
                                {/* Icon: Visible on mobile, hidden on desktop */}
                                <tab.icon className="size-5 md:hidden" />

                                {/* Text: Hidden on mobile, visible on desktop */}
                                <span className="hidden md:inline">
                                  {tab.name}
                                </span>
                              </span>
                            </SidebarMenuButton>
                          )}
                        </Link>
                      </SidebarMenuItem>
                    ))}
                  </SidebarMenu>
                </SidebarGroupContent>
              </SidebarGroup>
            ))}
          </SidebarContent>
        </Sidebar>
      </div>

      {/* Main Content */}
      <div className="flex-1 min-w-0 flex flex-col gap-6 ml-8">
        {/* Mobile Header (rendered in content area for mobile) */}
        <div className="md:hidden pt-4">{header}</div>
        {children}
      </div>
    </SidebarProvider>
  )
}
