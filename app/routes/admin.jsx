import { redirect } from "react-router";

export const meta = () => [
  { title: "Admin - Cantina" },
];

export async function loader() {
  // Redirect to the admin dashboard
  throw redirect("/admin/");
}

export default function AdminPage() {
  // This component should never render due to the redirect
  return null;
}