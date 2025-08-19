import { route, index, layout } from "@react-router/dev/routes";

export default [
  layout("routes/shell.jsx", [
    index("routes/home.jsx"),
    route("menu", "routes/menu.jsx"),
    route("login", "routes/login.jsx"),
    route("register", "routes/register.jsx"),
    route("logout", "routes/logout.jsx"),
    route("orders", "routes/orders/index.jsx"),
    route("orders/:orderNumber", "routes/orders/$orderNumber.jsx"),
    route("orders/track", "routes/orders/track.jsx"),
    route("reservations", "routes/reservations.jsx"),
    route("account", "routes/account.jsx"),
    route("admin", "routes/admin.jsx"),
  ]),

  route("*", "routes/not-found.jsx"),
];
