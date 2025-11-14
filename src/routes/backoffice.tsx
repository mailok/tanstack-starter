import { createFileRoute, Outlet } from '@tanstack/react-router'
import { AppSidebar } from '@/components/app-sidebar'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from '@/components/ui/sidebar'

export const Route = createFileRoute('/backoffice')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <SidebarProvider>
      <AppSidebar variant="inset" />
      <SidebarInset>
        <header className="flex h-(--header-height) shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-(--header-height)">
          <div className="flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6">
            <SidebarTrigger className="-ml-1" />
            <Separator
              orientation="vertical"
              className="mx-2 data-[orientation=vertical]:h-4"
            />
            {/* <Breadcrumbs /> */}
            <div className="ml-auto flex items-center gap-2">
              <Button
                variant="ghost"
                asChild
                size="sm"
                className="hidden sm:flex"
              >
                <a
                  href="https://github.com/mailok/react-spa-starter"
                  rel="noopener noreferrer"
                  target="_blank"
                  className="dark:text-foreground"
                >
                  GitHub
                </a>
              </Button>
              {/* <ModeToggle /> */}
            </div>
          </div>
        </header>
        <div className="size-full">
          <Outlet />
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
