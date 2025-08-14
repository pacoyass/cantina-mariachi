import { Outlet, NavLink } from "react-router";
import { Button } from "../components/ui/button";
import { Dropdown, DropdownItem } from "../components/ui/dropdown";
import { ThemeToggle } from "../components/theme-toggle";
import { Sheet, SheetContent, SheetTrigger } from "../components/ui/sheet";

export default function ShellLayout() {
  return (
    <div>
      <header className="border-b">
        <nav className="container mx-auto grid grid-cols-3 h-14 items-center px-4">
          <div className="flex items-center gap-3">
            <div className="md:hidden">
              <Sheet>
                <SheetTrigger>
                  <Button variant="ghost" aria-label="Open menu">☰</Button>
                </SheetTrigger>
                <SheetContent>
                  <div className="flex flex-col gap-3">
                    <NavLink to="/">Home</NavLink>
                    <NavLink to="/menu">Menu</NavLink>
                    <NavLink to="/orders">Orders</NavLink>
                    <NavLink to="/reservations">Reservations</NavLink>
                    <NavLink to="/account">Account</NavLink>
                  </div>
                </SheetContent>
              </Sheet>
            </div>
            <div className="hidden md:flex items-center gap-4 text-sm">
              <NavLink to="/menu">Menu</NavLink>
              <NavLink to="/orders">Orders</NavLink>
            </div>
          </div>

          <div className="flex items-center justify-center">
            <NavLink to="/" className="text-lg font-semibold">Cantina</NavLink>
          </div>

          <div className="flex items-center justify-end gap-2">
            <div className="hidden md:flex items-center gap-4 text-sm mr-2">
              <NavLink to="/reservations">Reservations</NavLink>
              <NavLink to="/account">Account</NavLink>
            </div>
            <ThemeToggle />
            <Dropdown label="Account">
              <DropdownItem><NavLink to="/account">Profile</NavLink></DropdownItem>
              <DropdownItem><NavLink to="/login">Login</NavLink></DropdownItem>
              <DropdownItem><NavLink to="/register">Register</NavLink></DropdownItem>
            </Dropdown>
            <Button className="hidden md:inline-flex">Order Now</Button>
          </div>
        </nav>
        <div className="mex-divider" />
      </header>
      <Outlet />
    </div>
  );
}