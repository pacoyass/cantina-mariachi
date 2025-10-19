import { useEffect, useState } from 'react';
import { useNavigation, redirect, useOutletContext } from 'react-router';
import { useTranslation } from 'react-i18next';
import Account from '@/pages/account/account';

export const meta = () => [
  { title: 'My Account - Cantina Mariachi' },
  { name: 'description', content: 'Manage your profile, view order history, and track your rewards.' },
];

export async function loader({ request }) {
  const url = new URL(request.url);
  const cookie = request.headers.get('cookie') || '';
  
  try {
    // Get user's orders
    const ordersRes = await fetch(`${url.origin}/api/orders/mine/list`, { 
      headers: { cookie } 
    });
    
    const ordersData = ordersRes.ok ? await ordersRes.json() : { data: { orders: [] } };
    
    // Get user's reservations
    const reservationsRes = await fetch(`${url.origin}/api/reservations`, { 
      headers: { cookie } 
    });
    
    const reservationsData = reservationsRes.ok ? await reservationsRes.json() : { data: { reservations: [] } };

    // Get user's active sessions
    const sessionsRes = await fetch(`${url.origin}/api/auth/sessions`, { 
      headers: { cookie } 
    });
    
    const sessionsData = sessionsRes.ok ? await sessionsRes.json() : { data: { sessions: [] } };
    console.log("🔍 Sessions API Response:", {
      status: sessionsRes.status,
      ok: sessionsRes.ok,
      data: sessionsData
    });

    // Add current session identification
    const userAgent = request.headers.get('user-agent') || '';
    const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 
              request.headers.get('x-real-ip') || 'unknown';
    
    console.log("🔍 Current Request Info:", { userAgent: userAgent.substring(0, 100), ip });

    const enhancedSessions = (sessionsData.data?.sessions || []).map(session => {
      // Multiple ways to detect current session
      const isCurrentUserAgent = session.userAgent === userAgent;
      const isRecentAndSameIP = session.ip === ip && 
        (new Date() - new Date(session.lastUsedAt)) < 300000; // 5 minutes
      const isLocalAndRecent = (session.ip === '::1' || session.ip === '127.0.0.1') &&
        (new Date() - new Date(session.lastUsedAt)) < 60000; // 1 minute for local
      
      console.log("🔍 Session analysis:", {
        sessionId: session.id,
        sessionIP: session.ip,
        sessionUA: session.userAgent?.substring(0, 50),
        isCurrentUserAgent,
        isRecentAndSameIP,
        isLocalAndRecent
      });
      
      return {
        ...session,
        current: isCurrentUserAgent || isRecentAndSameIP || isLocalAndRecent
      };
    });

    console.log("🔍 Final enhanced sessions:", enhancedSessions.length);

    return {
      orders: ordersData.data?.orders || [],
      reservations: reservationsData.data?.reservations || [],
      sessions: enhancedSessions,
      isWelcome: url.searchParams.get('welcome') === 'true'
    };
  } catch (error) {
    return redirect('/login?redirect=' + encodeURIComponent('/account'));
  }
}

// AccountPage.action.js
export async function action({ request }) {
  const url = new URL(request.url);
  const cookie = request.headers.get("cookie") || "";
  const formData = await request.formData();
  const intent = formData.get("intent");

  // Get user data from token for admin operations
  let currentUser = null;
  let currentSessions = [];
  
  try {
    // Get current user info
    const userRes = await fetch(`${url.origin}/api/auth/token`, { 
      headers: { cookie } 
    });
    if (userRes.ok) {
      const userData = await userRes.json();
      currentUser = userData.data?.user;
    }
    
    // Get current user's sessions
    const sessionsRes = await fetch(`${url.origin}/api/auth/sessions`, { 
      headers: { cookie } 
    });
    if (sessionsRes.ok) {
      const sessionsData = await sessionsRes.json();
      currentSessions = sessionsData.data?.sessions || [];
    }
  } catch (error) {
    console.error("Failed to get user data in action:", error);
  }

  try {
    if (intent === "cancel-order") {
      const orderNumber = formData.get("orderNumber");
      const res = await fetch(`${url.origin}/api/orders/${orderNumber}`, {
        method: "DELETE", // you'll need to implement this backend route
        headers: { cookie },
      });
      return res.json();
    }

    if (intent === "cancel-reservation") {
      const reservationId = formData.get("reservationId");
      const res = await fetch(`${url.origin}/api/reservations/${reservationId}`, {
        method: "DELETE",
        headers: { cookie },
      });
      return res.json();
    }

    if (intent === "revoke-session") {
      const sessionId = formData.get("sessionId");
      const res = await fetch(`${url.origin}/api/auth/sessions/${sessionId}`, {
        method: "DELETE",
        headers: { cookie },
      });
      const result = await res.json();
      
      if (res.ok) {
        return { status: "success", message: "Session revoked successfully" };
      } else {
        return { status: "error", message: result.error?.message || "Failed to revoke session" };
      }
    }

    if (intent === "logout-all-sessions") {
      const res = await fetch(`${url.origin}/api/auth/logout-all`, {
        method: "POST",
        headers: { 
          cookie,
          "Content-Type": "application/json"
        },
      });
      
      let result;
      try {
        result = await res.json();
      } catch (parseError) {
        console.error("Failed to parse logout-all response:", parseError);
        return { 
          status: "error", 
          message: `Server returned invalid response (${res.status}): ${res.statusText}` 
        };
      }
      
      console.log("Logout-all response:", { status: res.status, ok: res.ok, result });
      
      if (res.ok) {
        return { 
          status: "success", 
          message: `All sessions logged out successfully. ${result.data?.deletedTokens || 0} sessions were removed.`,
          redirect: "/login"
        };
      } else {
        return { 
          status: "error", 
          message: `Logout failed: ${result.error?.message || result.message || 'Unknown error'} (Status: ${res.status})` 
        };
      }
    }

    if (intent === "logout-all-others") {
      // For regular users: logout their own other sessions
      if (currentUser?.role !== 'ADMIN' && currentUser?.role !== 'OWNER') {
        const currentRefresh = request.headers.get('cookie')?.match(/refreshToken=([^;]+)/)?.[1];
        
        if (!currentRefresh) {
          return { status: "error", message: "Current refresh token not found. Cannot preserve current session." };
        }

        const res = await fetch(`${url.origin}/api/auth/logout-others`, {
          method: "POST",
          headers: { 
            cookie,
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            refreshToken: currentRefresh
          })
        });
        const result = await res.json();
        
        if (res.ok) {
          return { 
            status: "success", 
            message: `${result.data?.deletedTokens || 0} other sessions logged out successfully. Your current session remains active.` 
          };
        } else {
          return { status: "error", message: result.error?.message || "Failed to logout other sessions" };
        }
      }
      
      // For Admin/Owner: This should show user management modal instead
      return { 
        status: "info", 
        message: "Opening user management interface...",
        action: "show-user-management"
      };
    }

    if (intent === "revoke-user-session") {
      // Admin-only: Revoke specific user's session
      const userId = formData.get("userId");
      const sessionId = formData.get("sessionId");
      
      const res = await fetch(`${url.origin}/api/admin/users/${userId}/sessions/${sessionId}`, {
        method: "DELETE",
        headers: { cookie },
      });
      
      if (res.ok) {
        return { status: "success", message: "User session revoked successfully" };
      } else {
        const result = await res.json();
        return { status: "error", message: result.error?.message || "Failed to revoke user session" };
      }
    }

    if (intent === "get-all-users-sessions") {
      // Admin-only: Get all users and their sessions
      try {
        console.log('🔄 Fetching users sessions from:', `${url.origin}/api/admin/users/sessions`);
        const res = await fetch(`${url.origin}/api/admin/users/sessions`, {
          method: "GET",
          headers: { cookie },
        });
        
        console.log('📡 API Response status:', res.status, res.statusText);
        
        if (res.ok) {
          const result = await res.json();
          console.log('✅ API Success:', result);
          console.log('📊 Users data:', result.data);
          console.log('📊 Number of users:', Array.isArray(result.data) ? result.data.length : 'NOT AN ARRAY');
          return { 
            status: "success", 
            data: result.data,
            action: "display-users-sessions"
          };
        } else {
          const result = await res.json();
          console.error('❌ API Error Response:', result);
          return { 
            status: "error", 
            message: result.error?.message || result.message || "Failed to fetch users sessions. Admin API may not be available."
          };
        }
      } catch (error) {
        console.error("❌ Failed to fetch users sessions:", error);
        return { 
          status: "error", 
          message: "Failed to connect to the server. Please try again later."
        };
      }
    }

    return { status: "error", message: "Unknown action" };
  } catch (error) {
    console.error("AccountPage.action error:", error);
    return { status: "error", message: "Action failed" };
  }
}

export default function AccountPage({loaderData,actionData}) {
  const { t } = useTranslation(['account', 'common']);
  const {user}= useOutletContext() || {};
  const {  orders, reservations, isWelcome ,sessions} = loaderData;
  const actionDatas = actionData;
  const navigation = useNavigation();
  const [activeTab, setActiveTab] = useState('profile');
  const isSubmitting = navigation.state === 'submitting';
  
  // Handle redirect after logout-all-sessions
  useEffect(() => {
    if (actionDatas?.redirect === '/login') {
      window.location.href = '/login?message=All sessions logged out successfully';
    }
  }, [actionDatas]);

  return (
 <div>
  <Account
  isWelcome={isWelcome}
  orders={orders}
  reservations={reservations}
  sessions={sessions}
  user={user}
  activeTab={activeTab} 
  setActiveTab={setActiveTab}
  actionDatas={actionDatas}
  isSubmitting={isSubmitting}
  />
 </div>
  );
}


