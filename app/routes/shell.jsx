import { Outlet, NavLink } from "react-router";

export default function ShellLayout() {
  return (
    <div>
      <header className="p-4 border-b">
        <nav className="container mx-auto flex gap-4">
          <NavLink to="/">Home</NavLink>
          <NavLink to="/menu">Menu</NavLink>
          <NavLink to="/orders">Orders</NavLink>
          <NavLink to="/reservations">Reservations</NavLink>
          <NavLink to="/account">Account</NavLink>
        </nav>
      </header>
      <Outlet />
    </div>
  );
}