import { Link, useLocation } from "react-router";
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
  X,
  LogOut,
  User
} from "../../lib/lucide-shim.js";

const navigation = [
  {
    name: 'Dashboard',
    href: '/admin',
    icon: LayoutDashboard,
    exact: true
  },
  {
    name: 'Orders',
    href: '/admin/orders',
    icon: ShoppingBag,
    badge: 'pending'
  },
  {
    name: 'Menu',
    href: '/admin/menu',
    icon: ChefHat
  },
  {
    name: 'Users',
    href: '/admin/users',
    icon: Users
  },
  {
    name: 'Reservations',
    href: '/admin/reservations',
    icon: Calendar
  },
  {
    name: 'Analytics',
    href: '/admin/analytics',
    icon: BarChart3
  },
  {
    name: 'Settings',
    href: '/admin/settings',
    icon: Settings
  }
];

export function Sidebar({ user, stats, sidebarOpen, setSidebarOpen }) {
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
    <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-white border-r shadow-lg transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0 ${
      sidebarOpen ? 'translate-x-0' : '-translate-x-full'
    }`}>
      {/* Header */}
      <div className="flex items-center justify-between h-16 px-6 border-b bg-white">
        <h1 className="text-xl font-bold text-gray-900">Admin Panel</h1>
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
      <nav className="mt-6 px-3 flex-1 overflow-y-auto">
        <div className="space-y-1">
          {navigation.map((item) => {
            const Icon = item.icon;
            const badgeValue = item.badge ? getBadgeValue(item.badge) : null;
            
            return (
              <Link
                key={item.name}
                to={item.href}
                className={`group flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                  isActive(item)
                    ? 'bg-primary text-primary-foreground'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
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
              </Link>
            );
          })}
        </div>
      </nav>

      {/* User info at bottom */}
      <div className="absolute bottom-0 left-0 right-0 p-4 border-t bg-gray-50">
        <div className="flex items-center">
          <div className="flex-shrink-0">
            <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
              <User className="size-4 text-primary-foreground" />
            </div>
          </div>
          <div className="ml-3 flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-900 truncate">
              {user?.name || user?.email}
            </p>
            <p className="text-xs text-gray-500 truncate">
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
