import { Outlet, redirect, useOutletContext } from "react-router";

export const meta = () => [
  { title: "Dashboard - Cantina" },
];



export default function DashboardLayout() {
  const { user } = useOutletContext() || {};
  
  // This should never render due to redirects in loader
  return <Outlet context={{user}} />;
}