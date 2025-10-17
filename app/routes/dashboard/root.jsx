import { redirect, useOutletContext, useNavigate } from "react-router";
import { useEffect } from "react";

export const meta = () => [
  { title: "Dashboard - Cantina" },
];

export default function DashboardRoot() {
  const { user } = useOutletContext() || {};
  const navigate = useNavigate();
  
  useEffect(() => {
    // Client-side redirect based on user role
    if (!user) {
      navigate("/login?redirect=/dashboard", { replace: true });
      return;
    }
    
    // Role-based redirect
    switch (user.role) {
      case 'OWNER':
      case 'ADMIN':
        navigate('/admin', { replace: true });
        break;
      
      case 'CASHIER':
        navigate('/cashier', { replace: true });
        break;
      
      case 'DRIVER':
        navigate('/driver', { replace: true });
        break;
      
      case 'CUSTOMER':
      default:
        navigate('/account', { replace: true });
        break;
    }
  }, [user, navigate]);
  
  // Show loading state while redirecting
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4"></div>
        <p className="text-gray-600">Redirecting to your dashboard...</p>
      </div>
    </div>
  );
}