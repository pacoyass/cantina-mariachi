
import
  {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuBadge,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarTrigger,
    useSidebar,
  } from "@/components/ui/sidebar";
import
  {
    BarChart3,
    Calendar,
    ChefHat,
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
  { name: "Dashboard", href: "/dashboard/admin", icon: LayoutDashboard },
  { name: "Orders", href: "/dashboard/admin/orders", icon: ShoppingBag, badge: "pending" },
  { name: "Menu", href: "/dashboard/admin/menu", icon: ChefHat },
  { name: "Users", href: "/dashboard/admin/users", icon: Users },
  { name: "Reservations", href: "/dashboard/admin/reservations", icon: Calendar },
  { name: "Analytics", href: "/dashboard/admin/analytics", icon: BarChart3 },
  { name: "Translations", href: "/dashboard/admin/translations", icon: Languages },
  { name: "Settings", href: "/dashboard/admin/settings", icon: Settings },
];

export function AppSidebar({ user, stats, lang }) {
  const { open, toggleSidebar } = useSidebar();

  const getBadgeValue = (type) => (type === "pending" ? stats?.orders?.pending || 0 : null);

  return (
    <Sidebar
      collapsible="icon"
      className={cn(
        "relative z-30 h-full shrink-0 border-r border-white/10 bg-linear-to-b",
        "from-[#181818]/95 to-[#0f0f0f]/95 text-white backdrop-blur-xl shadow-2xl transition-all duration-300"
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between  px-4 py-3 border-b border-white/10 h-16 bg-background/60 backdrop-blur-md">
        {open && (
          <h1 className="text-lg font-bold bg-linear-to-r from-primary to-primary/60 bg-clip-text text-transparent">
            Cantina
          </h1>
        )}
        <SidebarTrigger
          onClick={toggleSidebar}
          className="rounded-lg p-2 hover:bg-primary/20 transition-all"
        />
      </div>

      {/* Navigation */}
      <SidebarContent className="overflow-y-auto">
        <SidebarGroup>
          {open && (
            <SidebarGroupLabel className="text-xs uppercase text-muted-foreground tracking-wide mb-2">
              Navigation
            </SidebarGroupLabel>
          )}
          <SidebarGroupContent>
            <SidebarMenu className="gap-1 space-y-5">
              {navigation.map((item) => {
                const Icon = item.icon;
                const badge = item.badge ? getBadgeValue(item.badge) : null;

                return (
                  <SidebarMenuItem key={item.name}>
                    <SidebarMenuButton asChild>
                      <NavLink
                        to={`${item.href}?lng=${lang}`}
                        className={({ isActive }) =>
                          cn(
                            "group flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all",
                            "hover:bg-primary/10 hover:text-primary",
                            isActive
                              ? "bg-primary/15 text-primary shadow-inner"
                              : "text-muted-foreground"
                          )
                        }
                      >
                        <Icon className="size-4" />
                        {open && <span className="truncate">{item.name}</span>}
                      </NavLink>
                    </SidebarMenuButton>
                    {badge > 0 && open && (
                      <SidebarMenuBadge className="text-xs font-bold bg-primary/80 text-white rounded-full px-2 py-0.5">
                        {badge}
                      </SidebarMenuBadge>
                    )}
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      {/* Footer */}
      <SidebarFooter className="border-t border-white/10 p-3">
        <div
          className={cn(
            "flex items-center justify-between rounded-xl p-3 bg-white/5 hover:bg-white/10 transition-all",
            open ? "flex-row" : "justify-center"
          )}
        >
          {open && (
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 flex items-center justify-center rounded-lg bg-linear-to-br from-primary to-primary/70 text-white">
                <User className="size-4" />
              </div>
              <div className="text-sm leading-tight">
                <div className="font-semibold">{user?.name || "Admin"}</div>
                <div className="text-xs text-muted-foreground capitalize">
                  {user?.role || "owner"}
                </div>
              </div>
            </div>
          )}

          <Link
            to="/logout"
            className={cn(
              "text-muted-foreground hover:text-destructive transition-colors",
              !open && "mx-auto"
            )}
          >
            <LogOut className="size-4" />
          </Link>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
