import { User, Bell, Settings } from 'lucide-react';
import { Link } from '@tanstack/react-router';
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarMenuBadge,
} from '../ui/sidebar';

export function NavSettings() {
  return (
    <SidebarGroup>
      <SidebarGroupLabel>Settings</SidebarGroupLabel>
      <SidebarMenu>
        <SidebarMenuItem key="account">
          <Link to="/backoffice">
            {({ isActive }) => (
              <SidebarMenuButton isActive={isActive} asChild>
                <span>
                  <User />
                  Account
                </span>
              </SidebarMenuButton>
            )}
          </Link>
        </SidebarMenuItem>
        <SidebarMenuItem key="notifications">
          <Link to="/backoffice">
            {({ isActive }) => (
              <SidebarMenuButton isActive={isActive} asChild>
                <span>
                  <Bell />
                  Notifications
                  <SidebarMenuBadge className="bg-primary text-primary-foreground">
                    2
                  </SidebarMenuBadge>
                </span>
              </SidebarMenuButton>
            )}
          </Link>
        </SidebarMenuItem>
        <SidebarMenuItem key="preferences">
          <Link to="/backoffice">
            {({ isActive }) => (
              <SidebarMenuButton isActive={isActive} asChild>
                <span>
                  <Settings />
                  Preferences
                </span>
              </SidebarMenuButton>
            )}
          </Link>
        </SidebarMenuItem>
      </SidebarMenu>
    </SidebarGroup>
  )
}
