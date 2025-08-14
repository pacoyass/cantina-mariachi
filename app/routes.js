import { route, index, layout } from "@react-router/dev/routes";

export default [
  layout("routes/shell.jsx", [
    index("routes/home.jsx"),
    route("menu", "routes/menu.jsx"),

    // Auth group under its own layout
    layout("routes/auth/layout.jsx", [
      route("login", "routes/login.jsx"),
      route("register", "routes/register.jsx"),
      route("logout", "routes/logout.jsx"),
    ]),

    // Orders group (use layout for compatibility)
    layout("routes/orders/layout.jsx", [
      index("routes/orders.index.jsx"),
      route(":orderNumber", "routes/orders.$orderNumber.jsx"),
      route("track", "routes/orders.track.jsx"),
    ]),

    route("reservations", "routes/reservations.jsx"),
    route("account", "routes/account.jsx"),
    route("admin", "routes/admin.jsx"),
  ]),

  route("*", "routes/not-found.jsx"),
];
