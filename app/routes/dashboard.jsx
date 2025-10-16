import { redirect } from "react-router";

export const meta = () => [
  { title: "Dashboard - Cantina" },
];

// Smart redirect based on user role
export async function loader({ request }) {
  const url = new URL(request.url);
  const cookie = request.headers.get("cookie") || "";
  
  try {
    const authRes = await fetch(`${url.origin}/api/users/me`, {
      headers: { cookie }
    });
    
    if (!authRes.ok) {
      throw redirect("/login?redirect=/dashboard");
    }
    
    const authData = await authRes.json();
    const user = authData.data?.user;
    
    if (!user) {
      throw redirect("/login");
    }
    
    // Role-based redirect
    switch (user.role) {
      case 'OWNER':
      case 'ADMIN':
        throw redirect('/admin');
      
      case 'CASHIER':
        throw redirect('/cashier');
      
      case 'DRIVER':
        throw redirect('/driver');
      
      case 'CUSTOMER':
      default:
        throw redirect('/account');
    }
  } catch (error) {
    if (error instanceof Response) throw error;
    throw redirect("/login");
  }
}

export default function Dashboard() {
  // This should never render due to redirects
  return null;
}
