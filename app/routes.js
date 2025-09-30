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
    route("admin", "routes/admin.jsx"),

    
  ]),

  route("*", "routes/not-found.jsx"),
];
