// app/components/admin/app-sidebar.jsx
import
  {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
  } from "@/components/ui/dropdown-menu";
import
  {
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
  } from "@/components/ui/sidebar";
import
  {
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
  const getBadgeValue = (badgeType) => {
    switch (badgeType) {
      case "pending":
        return stats?.orders?.pending || 0;
      default:
        return null;
    }
  };

  return (
    <Sidebar collapsible="icon" className="sticky ">
      {/* Header */}
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <Link to="/dashboard/admin">
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                  <LayoutDashboard className="size-4" />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">Admin Panel</span>
                  <span className="truncate text-xs">Cantina</span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      {/* Navigation */}
      <SidebarContent className="space-y-6 bg-gray-100/30 backdrop-blur-sm dark:supports-[backdrop-filter]:bg-background/30 ">
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent >
            <SidebarMenu className="space-y-4">
              {navigation.map((item) => {
                const Icon = item.icon;
                const badgeValue = item.badge ? getBadgeValue(item.badge) : null;
                
                return (
                  <SidebarMenuItem key={item.name} >
                    <SidebarMenuButton asChild>
                      <NavLink
                        to={`${item.href}?lng=${lang}`}
                        className={({ isActive }) =>
                          isActive ? "bg-sidebar-accent" : ""
                        }
                      >
                        <Icon />
                        <span>{item.name}</span>
                      </NavLink>
                    </SidebarMenuButton>
                    {badgeValue && badgeValue > 0 && (
                      <SidebarMenuBadge>
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
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton
                  size="lg"
                  className=" data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                >
                  <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                    <User className="size-4" />
                  </div>
                  <div className="grid flex-1 text-left text-sm leading-tight">
                    <span className="truncate font-semibold">
                      {user?.name || user?.email}
                    </span>
                    <span className="truncate text-xs">{user?.role}</span>
                  </div>
                  <ChevronUp className="ml-auto size-4" />
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
                side="bottom"
                align="end"
                sideOffset={5}
              >
                <DropdownMenuItem asChild>
                  <Link to="/account">
                    <User className="mr-2 size-4" />
                    <span>Account</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/logout">
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
