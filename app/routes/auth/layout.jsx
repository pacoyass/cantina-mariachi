import { Outlet } from "react-router";

export const meta = () => [{ title: "Auth - Cantina" }];

export default function AuthLayout() {
  return (
    <main className="p-4 container mx-auto">
      <h1>Authentication</h1>
      <Outlet />
    </main>
  );
}