// app/components/admin/app-sidebar.jsx
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  useSidebar,
} from "@/components/ui/sidebar";
import {
  BarChart3,
  Calendar,
  ChefHat,
  ChevronUp,
  Languages,
  LayoutDashboard,
  LogOut,
  Settings,
  ShoppingBag,
  User,
  Users,
} from "@/lib/lucide-shim";
import { cn } from "@/lib/utils";
import { Link, NavLink } from "react-router";

const navigation = [
  {
    name: "Dashboard",
    href: "/dashboard/admin",
    icon: LayoutDashboard,
    exact: true,
  },
  {
    name: "Orders",
    href: "/dashboard/admin/orders",
    icon: ShoppingBag,
    badge: "pending",
  },
  {
    name: "Menu",
    href: "/dashboard/admin/menu",
    icon: ChefHat,
  },
  {
    name: "Users",
    href: "/dashboard/admin/users",
    icon: Users,
  },
  {
    name: "Reservations",
    href: "/dashboard/admin/reservations",
    icon: Calendar,
  },
  {
    name: "Analytics",
    href: "/dashboard/admin/analytics",
    icon: BarChart3,
  },
  {
    name: "Translations",
    href: "/dashboard/admin/translations",
    icon: Languages,
  },
  {
    name: "Settings",
    href: "/dashboard/admin/settings",
    icon: Settings,
  },
];

export function AppSidebar({ user, stats, lang }) {
  const { open } = useSidebar();
  
  const getBadgeValue = (badgeType) => {
    switch (badgeType) {
      case "pending":
        return stats?.orders?.pending || 0;
      default:
        return null;
    }
  };

  return (
    <Sidebar collapsible="icon" className="border-r top-16 h-[calc(100vh-4rem)]">

      {/* Navigation */}
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="gap-1">
              {navigation.map((item) => {
                const Icon = item.icon;
                const badgeValue = item.badge
                  ? getBadgeValue(item.badge)
                  : null;

                return (
                  <SidebarMenuItem key={item.name}>
                    <SidebarMenuButton
                      asChild
                      tooltip={!open ? item.name : undefined}
                    >
                      <NavLink
                        to={`${item.href}?lng=${lang}`}
                        className={({ isActive }) =>
                          cn(
                            "group relative flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all",
                            isActive
                              ? "bg-sidebar-accent text-sidebar-accent-foreground shadow-sm"
                              : "hover:bg-sidebar-accent/50"
                          )
                        }
                      >
                        <Icon className="size-4 shrink-0" />
                        <span className="truncate">{item.name}</span>
                      </NavLink>
                    </SidebarMenuButton>
                    {badgeValue && badgeValue > 0 && (
                      <SidebarMenuBadge className="animate-in fade-in zoom-in duration-200">
                        {badgeValue}
                      </SidebarMenuBadge>
                    )}
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      {/* Footer with user info */}
      <SidebarFooter className="border-t">
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton
                  size="lg"
                  className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground hover:bg-sidebar-accent/50"
                  tooltip={!open ? user?.name || user?.email : undefined}
                >
                  <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-primary/80 text-primary-foreground shadow-sm">
                    <User className="size-4" />
                  </div>
                  <div className="grid flex-1 text-left text-sm leading-tight">
                    <span className="truncate font-semibold">
                      {user?.name || user?.email || "User"}
                    </span>
                    <span className="truncate text-xs text-muted-foreground capitalize">
                      {user?.role || "Admin"}
                    </span>
                  </div>
                  <ChevronUp className="ml-auto size-4 transition-transform group-data-[state=open]:rotate-180" />
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                className="w-56 rounded-lg"
                side={open ? "bottom" : "right"}
                align="end"
                sideOffset={8}
              >
                <div className="flex items-center gap-2 p-2">
                  <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-primary/80 text-primary-foreground">
                    <User className="size-4" />
                  </div>
                  <div className="grid flex-1 text-left text-sm leading-tight">
                    <span className="truncate font-semibold">
                      {user?.name || user?.email || "User"}
                    </span>
                    <span className="truncate text-xs text-muted-foreground">
                      {user?.email}
                    </span>
                  </div>
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link to="/account" className="cursor-pointer">
                    <User className="mr-2 size-4" />
                    <span>Account Settings</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link
                    to="/logout"
                    className="cursor-pointer text-destructive focus:text-destructive"
                  >
                    <LogOut className="mr-2 size-4" />
                    <span>Log out</span>
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>

      {/* Rail for easy toggling */}
      <SidebarRail />
    </Sidebar>
  );
}
