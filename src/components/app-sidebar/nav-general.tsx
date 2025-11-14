import { LayoutDashboard, PersonStanding, ListTodo, Users } from 'lucide-react';
import { Link } from '@tanstack/react-router';
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from '../ui/sidebar';

export function NavGeneral() {
  return (
    <SidebarGroup>
      <SidebarGroupLabel>General</SidebarGroupLabel>
      <SidebarMenu>
        <SidebarMenuItem key="dashboard">
          <Link to="/backoffice" activeOptions={{ exact: true }}>
            {({ isActive }) => (
              <SidebarMenuButton isActive={isActive} asChild>
                <span>
                  <LayoutDashboard />
                  Dashboard
                </span>
              </SidebarMenuButton>
            )}
          </Link>
        </SidebarMenuItem>
        <SidebarMenuItem key="clients">
          <Link to="/backoffice/clients" preload="intent">
            {({ isActive }) => (
              <SidebarMenuButton isActive={isActive} asChild>
                <span>
                  <PersonStanding />
                  Clients
                </span>
              </SidebarMenuButton>
            )}
          </Link>
        </SidebarMenuItem>
        <SidebarMenuItem key="employees">
          <Link to="/">
            {({ isActive }) => (
              <SidebarMenuButton isActive={isActive} asChild>
                <span>
                  <Users />
                  Employees
                </span>
              </SidebarMenuButton>
            )}
          </Link>
        </SidebarMenuItem>
        <SidebarMenuItem key="tasks">
          <Link to="/">
            {({ isActive }) => (
              <SidebarMenuButton isActive={isActive} asChild>
                <span>
                  <ListTodo />
                  Tasks
                </span>
              </SidebarMenuButton>
            )}
          </Link>
        </SidebarMenuItem>
      </SidebarMenu>
    </SidebarGroup>
  )
}
