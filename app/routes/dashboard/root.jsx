import { useEffect } from "react";
import { Outlet, useLocation, useNavigate, useOutletContext } from "react-router";

export const meta = () => [
  { title: "Dashboard - Cantina" },
];

export default function DashboardLayout() {
  const { user } = useOutletContext() || {}; 
  
  return <Outlet context={{ user }} />;
}