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
    
    // Admin routes with layout and sidebar
    route("admin", "routes/admin/layout.jsx", [
      index("routes/admin/index.jsx"),
      route("orders", "routes/admin/orders.jsx"),
      route("menu", "routes/admin/menu.jsx"),
      route("users", "routes/admin/users.jsx"),
      route("reservations", "routes/admin/reservations.jsx"),
      route("analytics", "routes/admin/analytics.jsx"),
      route("settings", "routes/admin/settings.jsx"),
    ]),
    
  ]),

  route("*", "routes/not-found.jsx"),
];
