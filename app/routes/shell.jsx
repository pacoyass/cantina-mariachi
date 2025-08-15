import { Outlet } from "react-router";
import { Navbar } from "../components/Navbar";
import { Footer } from "../components/Footer";

export default function ShellLayout() {
  return (
    <div className="bg-mexican-pattern min-h-screen">
      <Navbar />
      <Outlet />
      <Footer />
    </div>
  );
}