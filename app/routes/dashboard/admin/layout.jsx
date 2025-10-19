import { useLoaderData, Outlet, redirect, useOutletContext } from "react-router";
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

export async function loader({ request,context }) {
  const url = new URL(request.url);
  const cookie = request.headers.get("cookie") || "";
  const lang =context.lng;
  
  try {
    // Get dashboard stats
    // The API endpoints already check authentication and ADMIN/OWNER role
    const [ordersRes, usersRes, menuRes] = await Promise.all([
      fetch(`${url.origin}/api/admin/stats/orders`, { headers: { cookie } }),
      fetch(`${url.origin}/api/admin/stats/users`, { headers: { cookie } }),
      fetch(`${url.origin}/api/admin/stats/menu`, { headers: { cookie } })
    ]);
    
    // If any API returns 401/403, redirect to login
    if ((!ordersRes.ok && (ordersRes.status === 401 || ordersRes.status === 403)) ||
        (!usersRes.ok && (usersRes.status === 401 || usersRes.status === 403)) ||
        (!menuRes.ok && (menuRes.status === 401 || menuRes.status === 403))) {
      throw redirect("/login?redirect=/admin");
    }
    
    const stats = {
      orders: ordersRes.ok ? (await ordersRes.json()).data : { total: 0, pending: 0, today: 0 },
      users: usersRes.ok ? (await usersRes.json()).data : { total: 0, active: 0, new: 0 },
      menu: menuRes.ok ? (await menuRes.json()).data : { total: 0, available: 0 }
    };
    
    return { stats,lang };
  } catch (error) {
    if (error instanceof Response) throw error;
    console.error('Admin loader error:', error);
    throw redirect("/login?redirect=/admin");
  }
}

export default function AdminLayout({loaderData}) {
  const { stats,lang } = loaderData;
  const { user } = useOutletContext() || {};
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen  flex">
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
        lang={lang}
      />

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top bar */}
        <div className="sticky top-0 z-30 flex h-16 border-b-4 bg-gray-100/30 backdrop-blur-sm dark:supports-[backdrop-filter]:bg-background/30 shadow-sm">
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
        <main className="flex-1 ">
          <Outlet context={{ user }} />
        </main>
      </div>
    </div>
  );
}