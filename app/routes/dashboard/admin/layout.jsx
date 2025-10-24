import { useLoaderData, Outlet, redirect, useOutletContext } from "react-router";
import { Button } from "../../../components/ui/button";
import { Badge } from "../../../components/ui/badge";
import { AppSidebar } from "../../../components/admin/app-sidebar";
import {
  SidebarProvider,
  SidebarInset,
  SidebarTrigger,
} from "../../../components/ui/sidebar";
import { useTranslation } from "react-i18next";
import { Bell } from "../../../lib/lucide-shim.js";

export const meta = () => [
  { title: "Admin Dashboard - Cantina" },
  { name: "robots", content: "noindex, nofollow" },
];

export async function loader({ request, context }) {
  const url = new URL(request.url);
  const cookie = request.headers.get("cookie") || "";
  const lang = context.lng;

  try {
    // Get dashboard stats
    // The API endpoints already check authentication and ADMIN/OWNER role
    const [ordersRes, usersRes, menuRes] = await Promise.all([
      fetch(`${url.origin}/api/admin/stats/orders`, { headers: { cookie } }),
      fetch(`${url.origin}/api/admin/stats/users`, { headers: { cookie } }),
      fetch(`${url.origin}/api/admin/stats/menu`, { headers: { cookie } }),
    ]);

    // If any API returns 401/403, redirect to login
    if (
      (!ordersRes.ok && (ordersRes.status === 401 || ordersRes.status === 403)) ||
      (!usersRes.ok && (usersRes.status === 401 || usersRes.status === 403)) ||
      (!menuRes.ok && (menuRes.status === 401 || menuRes.status === 403))
    ) {
      throw redirect("/login?redirect=/admin");
    }

    const stats = {
      orders: ordersRes.ok
        ? (await ordersRes.json()).data
        : { total: 0, pending: 0, today: 0 },
      users: usersRes.ok
        ? (await usersRes.json()).data
        : { total: 0, active: 0, new: 0 },
      menu: menuRes.ok
        ? (await menuRes.json()).data
        : { total: 0, available: 0 },
    };

    return { stats, lang };
  } catch (error) {
    if (error instanceof Response) throw error;
    console.error("Admin loader error:", error);
    throw redirect("/login?redirect=/admin");
  }
}

export default function AdminLayout({ loaderData }) {
  const { stats, lang } = loaderData;
  const { user } = useOutletContext() || {};

  return (
    <SidebarProvider defaultOpen={true}>
      <AppSidebar user={user} stats={stats} lang={lang} />
      <SidebarInset>
        {/* Top bar */}
        <header className="sticky top-0 z-10 flex h-16 shrink-0 items-center gap-2 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 shadow-sm">
          <div className="flex items-center gap-3 px-4">
            <SidebarTrigger className="-ml-1 hover:bg-accent" />
            <div className="h-6 w-px bg-border" />
            <div className="flex items-center gap-2">
              <h2 className="text-sm font-semibold tracking-tight">
                Dashboard
              </h2>
            </div>
          </div>

          <div className="flex flex-1 items-center justify-end gap-2 px-4">
            {/* Notifications */}
            <Button
              variant="ghost"
              size="icon"
              className="relative hover:bg-accent"
            >
              <Bell className="size-5" />
              {stats?.orders?.pending > 0 && (
                <Badge
                  variant="destructive"
                  className="absolute -top-1 -right-1 size-5 text-xs p-0 flex items-center justify-center animate-in zoom-in duration-200"
                >
                  {stats.orders.pending}
                </Badge>
              )}
            </Button>
          </div>
        </header>

        {/* Page content with Mexican pattern background */}
        <main className="flex-1 overflow-auto bg-mexican-pattern">
          <div className="container mx-auto p-4 md:p-6 lg:p-8">
            <Outlet context={{ user }} />
          </div>
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
