import { Link, NavLink, useFetcher, useLocation } from "react-router";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { 
  LayoutDashboard, 
  ShoppingBag, 
  Users, 
  ChefHat, 
  Calendar,
  Settings,
  BarChart3,
  Languages,
  X,
  LogOut,
  User
} from "../../lib/lucide-shim.js";

const navigation = [
  {
    name: 'Dashboard',
    href: '/dashboard/admin',
    icon: LayoutDashboard,
    exact: true
  },
  {
    name: 'Orders',
    href: '/dashboard/admin/orders',
    icon: ShoppingBag,
    badge: 'pending'
  },
  {
    name: 'Menu',
    href: '/dashboard/admin/menu',
    icon: ChefHat
  },
  {
    name: 'Users',
    href: '/dashboard/admin/users',
    icon: Users
  },
  {
    name: 'Reservations',
    href: '/dashboard/admin/reservations',
    icon: Calendar
  },
  {
    name: 'Analytics',
    href: '/dashboard/admin/analytics',
    icon: BarChart3
  },
  {
    name: 'Translations',
    href: '/dashboard/admin/translations',
    icon: Languages
  },
  {
    name: 'Settings',
    href: '/dashboard/admin/settings',
    icon: Settings
  }
];

export function Sidebar({ user, stats, sidebarOpen, setSidebarOpen,lang }) {
  const location = useLocation();
  
  const isActive = (item) => {
    if (item.exact) {
      return location.pathname === item.href;
    }
    return location.pathname.startsWith(item.href);
  };

  const getBadgeValue = (badgeType) => {
    switch (badgeType) {
      case 'pending':
        return stats?.orders?.pending || 0;
      default:
        return null;
    }
  };

  return (
    <div className={`fixed inset-y-0 left-0  w-64  border-1 bg-gray-100/30 backdrop-blur-sm dark:supports-[backdrop-filter]:bg-background/30 shadow-lg transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0 ${
      sidebarOpen ? 'translate-x-0' : '-translate-x-full'
    }`}>
      {/* Header */}
      <div className="flex items-center justify-between h-16 px-6 border-b-4 bg-gray-100/30 backdrop-blur-sm dark:supports-[backdrop-filter]:bg-background/30">
        <h1 className="text-xl font-bold ">Admin Panel</h1>
        <Button
          variant="ghost"
          size="icon"
          className="lg:hidden"
          onClick={() => setSidebarOpen(false)}
        >
          <X className="size-5" />
        </Button>
      </div>

      {/* Navigation */}
      <nav className="mt-12 px-3  min-h-max flex-1 overflow-y-auto">
        <div className="space-y-6 ">
          {navigation.map((item) => {
            const Icon = item.icon;
            const badgeValue = item.badge ? getBadgeValue(item.badge) : null;
            
            return (
              <NavLink
                key={item.name}
                to={`${item.href}?lng=${lang}`}
                relative="path"
                className={`group flex  items-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                  isActive(item)
                    ? 'bg-primary text-primary-foreground'
                    : ' hover:bg-gray-50 hover:text-gray-900'
                }`}
                onClick={() => setSidebarOpen(false)}
              >
                <Icon className="mr-3 size-5 flex-shrink-0" />
                {item.name}
                {badgeValue && badgeValue > 0 && (
                  <Badge variant="destructive" className="ml-auto">
                    {badgeValue}
                  </Badge>
                )}
              </NavLink>
            );
          })}
        </div>
      </nav>

      {/* User info at bottom */}
      <div className="absolute bottom-0 left-0 right-0 p-4 border-t-4 bg-gray-100/30 backdrop-blur-sm dark:supports-[backdrop-filter]:bg-background/30">
        <div className="flex items-center">
          <div className="flex-shrink-0">
            <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
              <User className="size-4 text-primary-foreground" />
            </div>
          </div>
          <div className="ml-3 flex-1 min-w-0 tracking-wide">
            <p className="text-sm font-bold  truncate">
              {user?.name || user?.email}
            </p>
            <p className="text-xs font-light truncate">
              {user?.role}
            </p>
          </div>
          <Link to="/logout" className="ml-3">
            <Button variant="ghost" size="icon" className="size-8">
              <LogOut className="size-4" />
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
