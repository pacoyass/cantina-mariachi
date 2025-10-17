import { route, index, layout } from "@react-router/dev/routes";

export default [
  layout("routes/shell.jsx", [
    index("routes/home.jsx"),
    route("menu", "routes/menu.jsx"),
    layout("routes/auth/layout.jsx",[
       route("login", "routes/auth/login.jsx"),
       route("register", "routes/auth/register.jsx"),
       route("logout", "routes/auth/logout.jsx"),
    ]),
    route("orders", "routes/orders/index.jsx"),
    route("orders/:orderNumber", "routes/orders/$orderNumber.jsx"),
    route("orders/track", "routes/orders/track.jsx"),
    route("reservations", "routes/reservations.jsx"),
    route("account", "routes/account.jsx"),
    
    // Smart role-based redirect
    layout("./routes/dashboard/root.jsx", [
      // Role-specific dashboards
    route("cashier", "routes/dashboard/cashier/index.jsx"),  // CASHIER
    route("driver", "routes/dashboard/driver/index.jsx"),    // DRIVER
 // Admin routes (OWNER, ADMIN)
    route("admin", "routes/dashboard/admin/layout.jsx", [
      index("routes/dashboard/admin/index.jsx"),
      route("orders", "routes/dashboard/admin/orders.jsx"),
      route("menu", "routes/dashboard/admin/menu.jsx"),
      route("users", "routes/dashboard/admin/users.jsx"),
      route("reservations", "routes/dashboard/admin/reservations.jsx"),
      route("analytics", "routes/dashboard/admin/analytics.jsx"),
      route("settings", "routes/dashboard/admin/settings.jsx"),
    ]),
    ]),
    
   
    
    
    
  ]),

  route("*", "routes/not-found.jsx"),
];
