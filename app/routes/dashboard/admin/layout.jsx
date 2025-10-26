import { Outlet, redirect, useOutletContext } from "react-router";
import { AppSidebar } from "../../../components/admin/app-sidebar";
import { Badge } from "../../../components/ui/badge";
import { Button } from "../../../components/ui/button";
import { SidebarInset, SidebarProvider } from "../../../components/ui/sidebar";
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
    const [ordersRes, usersRes, menuRes] = await Promise.all([
      fetch(`${url.origin}/api/admin/stats/orders`, { headers: { cookie } }),
      fetch(`${url.origin}/api/admin/stats/users`, { headers: { cookie } }),
      fetch(`${url.origin}/api/admin/stats/menu`, { headers: { cookie } }),
    ]);

    if (
      (!ordersRes.ok && [401, 403].includes(ordersRes.status)) ||
      (!usersRes.ok && [401, 403].includes(usersRes.status)) ||
      (!menuRes.ok && [401, 403].includes(menuRes.status))
    ) {
      throw redirect("/login?redirect=/admin");
    }

    const stats = {
      orders: ordersRes.ok ? (await ordersRes.json()).data : { total: 0, pending: 0, today: 0 },
      users: usersRes.ok ? (await usersRes.json()).data : { total: 0, active: 0, new: 0 },
      menu: menuRes.ok ? (await menuRes.json()).data : { total: 0, available: 0 },
    };

    return { stats, lang };
  } catch (error) {
    console.error("Admin loader error:", error);
    throw redirect("/login?redirect=/admin");
  }
}

export default function AdminLayout({ loaderData }) {
  const { stats, lang } = loaderData;
  const { user } = useOutletContext() || {};

  return (
    <SidebarProvider defaultOpen={false}>
      <div className="flex h-full w-full">
        <AppSidebar user={user} stats={stats} lang={lang} />

        <SidebarInset className="flex flex-col flex-1 bg-linear-to-br from-background to-muted/30">
          {/* Top Bar */}
          <header className="sticky top-0 z-20 flex h-16 items-center justify-between border-b bg-background/60 backdrop-blur-md px-6 shadow-sm">
            <h2 className="text-sm text-balance font-light tracking-tight">Welcome
              <strong className="font-semibold tracking-wide"> {user?.name}</strong></h2>
            <Button variant="ghost" size="icon" className="relative hover:bg-accent">
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
          </header>

          <main className="flex-1 overflow-auto bg-mexican-pattern">
            <div className="container mx-auto p-6">
              <Outlet context={{ user }} />
            </div>
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
