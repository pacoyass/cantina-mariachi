import { useLoaderData, Outlet, redirect } from "react-router";
import { useState } from "react";
import { Button } from "../../../components/ui/button";
import { Badge } from "../../../components/ui/badge";
import { Sidebar } from "../../../components/admin/Sidebar";
import { useTranslation } from 'react-i18next';
import { 
  Bell,
  Menu
} from "../../../lib/lucide-shim.js";

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

export default function AdminLayout() {
  const { user, stats } = useLoaderData();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Mobile sidebar backdrop */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 z-40 bg-gray-600/75 lg:hidden" 
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <Sidebar 
        user={user} 
        stats={stats} 
        sidebarOpen={sidebarOpen} 
        setSidebarOpen={setSidebarOpen} 
      />

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top bar */}
        <div className="sticky top-0 z-30 flex h-16 bg-white border-b shadow-sm">
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
                {stats?.orders?.pending > 0 && (
                  <Badge variant="destructive" className="absolute -top-1 -right-1 size-5 text-xs p-0 flex items-center justify-center">
                    {stats.orders.pending}
                  </Badge>
                )}
              </Button>
            </div>
          </div>
        </div>

        {/* Page content - no extra padding/margin at top */}
        <main className="flex-1 bg-gray-50">
          <Outlet context={{ user }} />
        </main>
      </div>
    </div>
  );
}