import { index, route, prefix } from "@react-router/dev/routes";

export default [
  index("routes/home.jsx"),
  route("menu", "routes/menu.jsx"),
  prefix("orders", [
    index("routes/orders.index.jsx"),
    route(":orderNumber", "routes/orders.$orderNumber.jsx"),
    route("track", "routes/orders.track.jsx"),
  ]),
  route("reservations", "routes/reservations.jsx"),
  route("account", "routes/account.jsx"),
  route("login", "routes/login.jsx"),
  route("register", "routes/register.jsx"),
  route("admin", "routes/admin.jsx"),
  route("*", "routes/not-found.jsx"),
];
