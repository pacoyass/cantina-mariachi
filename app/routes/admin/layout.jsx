import { useLoaderData, Outlet, Link, useLocation, redirect } from "react-router";
import { useState } from "react";
import { Card, CardContent } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Badge } from "../../components/ui/badge";
import { useTranslation } from 'react-i18next';
import { 
  LayoutDashboard, 
  ShoppingBag, 
  Users, 
  ChefHat, 
  Calendar,
  Settings,
  BarChart3,
  Bell,
  Menu,
  X,
  LogOut,
  User
} from "../../lib/lucide-shim.js";

export const meta = () => [
  { title: "Admin Dashboard - Cantina" },
  { name: "robots", content: "noindex, nofollow" },
];

export async function loader({ request }) {
  const url = new URL(request.url);
  const cookie = request.headers.get("cookie") || "";
  
  try {
    // Check if user is authenticated and has admin privileges
    const authRes = await fetch(`${url.origin}/api/users/me`, {
      headers: { cookie }
    });
    
    if (!authRes.ok) {
      throw redirect("/login?redirect=/admin");
    }
    
    const authData = await authRes.json();
    const user = authData.data?.user;
    
    // Check if user has admin role
    if (!user || !['ADMIN', 'OWNER'].includes(user.role)) {
      throw redirect("/");
    }
    
    // Get dashboard stats
    const [ordersRes, usersRes, menuRes] = await Promise.all([
      fetch(`${url.origin}/api/admin/stats/orders`, { headers: { cookie } }),
      fetch(`${url.origin}/api/admin/stats/users`, { headers: { cookie } }),
      fetch(`${url.origin}/api/admin/stats/menu`, { headers: { cookie } })
    ]);
    
    const stats = {
      orders: ordersRes.ok ? (await ordersRes.json()).data : { total: 0, pending: 0, today: 0 },
      users: usersRes.ok ? (await usersRes.json()).data : { total: 0, active: 0, new: 0 },
      menu: menuRes.ok ? (await menuRes.json()).data : { total: 0, available: 0 }
    };
    
    return { user, stats };
  } catch (error) {
    if (error instanceof Response) throw error;
    console.error('Admin loader error:', error);
    throw redirect("/login?redirect=/admin");
  }
}

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

export default function AdminLayout() {
  const { user, stats } = useLoaderData();
  const { t } = useTranslation(['ui', 'admin']);
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const isActive = (item) => {
    if (item.exact) {
      return location.pathname === item.href;
    }
    return location.pathname.startsWith(item.href);
  };

  const getBadgeValue = (badgeType) => {
    switch (badgeType) {
      case 'pending':
        return stats.orders?.pending || 0;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile sidebar backdrop */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 z-40 lg:hidden" 
          onClick={() => setSidebarOpen(false)}
        >
          <div className="absolute inset-0 bg-gray-600 opacity-75"></div>
        </div>
      )}

      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0 ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        <div className="flex items-center justify-between h-16 px-6 border-b">
          <h1 className="text-xl font-bold text-gray-900">
            {t('admin.title', { defaultValue: 'Admin Panel' })}
          </h1>
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden"
            onClick={() => setSidebarOpen(false)}
          >
            <X className="size-5" />
          </Button>
        </div>

        <nav className="mt-6 px-3">
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

        {/* User info */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t bg-gray-50">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                <User className="size-4 text-primary-foreground" />
              </div>
            </div>
            <div className="ml-3 flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">
                {user.name || user.email}
              </p>
              <p className="text-xs text-gray-500 truncate">
                {user.role}
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

      {/* Main content */}
      <div className="lg:pl-64">
        {/* Top bar */}
        <div className="sticky top-0 z-40 flex h-16 bg-white border-b border-gray-200 lg:border-none">
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden ml-4"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu className="size-5" />
          </Button>
          
          <div className="flex-1 flex justify-between items-center px-4 lg:px-6">
            <div className="flex-1" />
            
            {/* Notifications */}
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="icon" className="relative">
                <Bell className="size-5" />
                {stats.orders?.pending > 0 && (
                  <Badge variant="destructive" className="absolute -top-1 -right-1 size-5 text-xs p-0 flex items-center justify-center">
                    {stats.orders.pending}
                  </Badge>
                )}
              </Button>
            </div>
          </div>
        </div>

        {/* Page content */}
        <main className="flex-1">
          <Outlet />
        </main>
      </div>
    </div>
  );
}