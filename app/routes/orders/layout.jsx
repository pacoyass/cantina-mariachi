import { Outlet, NavLink } from "react-router";

export default function OrdersLayout() {
  return (
    <main className="p-4 container mx-auto">
      <h1>Orders</h1>
      <nav className="flex gap-3 mb-4">
        <NavLink to="/orders">My Orders</NavLink>
        <NavLink to="/orders/track">Track</NavLink>
      </nav>
      <Outlet />
    </main>
  );
}