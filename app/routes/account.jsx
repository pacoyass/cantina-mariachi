import { useState } from 'react';
import React from 'react';
import { Form, useLoaderData, useActionData, useNavigation, redirect, Link, useOutletContext, useSubmit } from 'react-router';
// middleware-based auth temporarily disabled due to RouterContextProvider incompatibility
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Button } from '../components/ui/button';
import { Label } from '../components/ui/label';
import { Alert, AlertDescription } from '../components/ui/alert';
import { Badge } from '../components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '../components/ui/avatar';
import { Separator } from '../components/ui/separator';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '../components/ui/dialog';
import { 
  User, Mail, Phone, MapPin, CreditCard, History, 
  Calendar, Star, Package, AlertCircle, CheckCircle,
  Settings, Bell, Shield, LogOut, Edit, Eye, Gift,
  Monitor, Smartphone, Tablet, Globe, Trash2, Power
} from '../lib/lucide-shim.js';
import { AlertCircleIcon, Circle, Clock } from 'lucide-react';

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
        const res = await fetch(`${url.origin}/api/admin/users/sessions`, {
          method: "GET",
          headers: { cookie },
        });
        
        if (res.ok) {
          const result = await res.json();
          return { 
            status: "success", 
            data: result.data,
            action: "display-users-sessions"
          };
        } else {
          // If admin routes don't exist yet, return mock data
          console.log("Admin routes not implemented, using mock data");
          return { 
            status: "success", 
            data: [
              {
                id: "current-user",
                name: currentUser?.name || "Current User",
                email: currentUser?.email || "admin@example.com", 
                role: currentUser?.role || "OWNER",
                sessions: currentSessions || []
              }
            ],
            action: "display-users-sessions",
            message: "Admin routes not implemented yet. Showing current user only."
          };
        }
      } catch (error) {
        console.error("Failed to fetch users sessions:", error);
        // Fallback to showing current user only
        return { 
          status: "success", 
          data: [
            {
              id: "current-user",
              name: currentUser?.name || "Current User", 
              email: currentUser?.email || "admin@example.com",
              role: currentUser?.role || "OWNER",
              sessions: currentSessions || []
            }
          ],
          action: "display-users-sessions",
          message: "Backend not ready. Showing your sessions only."
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
  const [showUserManagement, setShowUserManagement] = useState(false);
  const [allUsersData, setAllUsersData] = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [selectedSessions, setSelectedSessions] = useState(new Set());
  const [searchTerm, setSearchTerm] = useState('');
  const isSubmitting = navigation.state === 'submitting';
  
  // Handle redirect after logout-all-sessions
  React.useEffect(() => {
    if (actionDatas?.redirect === '/login') {
      window.location.href = '/login?message=All sessions logged out successfully';
    }
    
    // Handle admin user management modal
    if (actionDatas?.action === 'show-user-management') {
      setShowUserManagement(true);
      fetchAllUsersData();
    }
    
    // Handle displaying users sessions data
    if (actionDatas?.action === 'display-users-sessions' && actionDatas?.data) {
      setAllUsersData(actionDatas.data);
      setShowUserManagement(true);
    }
  }, [actionDatas]);
  
  const fetchAllUsersData = async () => {
    setLoadingUsers(true);
    try {
      const response = await fetch('/api/admin/users/sessions', {
        credentials: 'include'
      });
      if (response.ok) {
        const result = await response.json();
        setAllUsersData(result.data || []);
      }
    } catch (error) {
      console.error('Failed to fetch users data:', error);
    } finally {
      setLoadingUsers(false);
    }
  };
  
  console.log("from account", user);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatDateTime = (dateString) => {
    return new Date(dateString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'completed':
      case 'delivered':
        return 'bg-green-100 text-green-800';
      case 'confirmed':
      case 'preparing':
        return 'bg-blue-100 text-blue-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <main className="container mx-auto px-3 sm:px-4 lg:px-6 py-6 sm:py-8 max-w-6xl min-h-screen">
      {/* Welcome Message */}
      {isWelcome && (
        <Alert className="mb-6 sm:mb-8 border-green-200 bg-green-50">
          <CheckCircle className="h-4 w-4 text-green-600" />
          <AlertDescription className="text-green-800 text-sm sm:text-base">
            Welcome to Cantina Mariachi! Your account has been created successfully.
          </AlertDescription>
        </Alert>
      )}

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6 sm:mb-8">
        <div className="flex items-center space-x-3 sm:space-x-4">
          <Avatar className="h-12 w-12 sm:h-16 sm:w-16">
            <AvatarImage src={user?.avatar} alt={user?.name} />
            <AvatarFallback className="text-base sm:text-lg">
              {user?.name?.split(' ').map(n => n[0]).join('').toUpperCase() || 'U'}
            </AvatarFallback>
          </Avatar>
          <div>
            <h1 className="text-xl sm:text-2xl font-bold">Welcome back, {user?.name || 'User'}!</h1>
            <p className="text-sm sm:text-base text-muted-foreground">Manage your account and view your activity</p>
          </div>
        </div>
        
        {/* Quick Stats */}
        <div className="flex gap-3 sm:gap-4">
          <div className="text-center">
            <div className="text-xl sm:text-2xl font-bold text-primary">{orders?.length || 0}</div>
            <div className="text-xs sm:text-sm text-muted-foreground">Orders</div>
          </div>
          <div className="text-center">
            <div className="text-xl sm:text-2xl font-bold text-primary">{reservations?.length || 0}</div>
            <div className="text-xs sm:text-sm text-muted-foreground">Reservations</div>
          </div>
          <div className="text-center">
            <div className="text-xl sm:text-2xl font-bold text-primary">1,250</div>
            <div className="text-xs sm:text-sm text-muted-foreground">Points</div>
          </div>
        </div>
      </div>
   


      {/* Main Content */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4  sm:space-y-6">
        <TabsList className="grid w-full h-full  grid-cols-3 sm:grid-cols-3 md:grid-cols-6 gap-1">
          <TabsTrigger value="profile" className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm px-2 sm:px-3">
            <User className="h-3 w-3 sm:h-4 sm:w-4" />
            <span className="hidden xs:inline">Profile</span>
            <span className="xs:hidden">Profile</span>

          </TabsTrigger>
          <TabsTrigger value="orders" className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm px-2 sm:px-3">
            <Package className="h-3 w-3 sm:h-4 sm:w-4" />
            <span className="hidden xs:inline">Orders</span>
            <span className="xs:hidden">Orders</span>

          </TabsTrigger>
          <TabsTrigger value="reservations" className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm px-2 sm:px-3">
            <Calendar className="h-3 w-3 sm:h-4 sm:w-4" />
            <span className="hidden xs:inline">Reservations</span>
            <span className="xs:hidden">Reservations</span>
          </TabsTrigger>
          <TabsTrigger value="sessions" className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm px-2 sm:px-3">
            <Shield className="h-3 w-3 sm:h-4 sm:w-4" />
            <span className="hidden xs:inline">Sessions</span>
            <span className="xs:hidden">Sessions</span>

          </TabsTrigger>
          <TabsTrigger value="rewards" className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm px-2 sm:px-3">
            <Gift className="h-3 w-3 sm:h-4 sm:w-4" />
            <span className="xs:hidden">Rewards</span>
            <span className="hidden xs:inline">Rewards</span>

          </TabsTrigger>
          <TabsTrigger value="settings" className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm px-2 sm:px-3">
            <Settings className="h-3 w-3 sm:h-4 sm:w-4" />
            <span className="hidden xs:inline">Settings</span>
            <span className="xs:hidden">Settings</span>

          </TabsTrigger>
        </TabsList>

        {/* Profile Tab */}
        <TabsContent value="profile" className="space-y-4 sm:space-y-6">
          <div className="grid gap-4 sm:gap-6 md:grid-cols-2">
            {/* Profile Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
                  <User className="h-4 w-4 sm:h-5 sm:w-5" />
                  Profile Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Success/Error Messages */}
                {actionDatas?.success && (
                  <Alert className="border-green-200 bg-green-50">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <AlertDescription className="text-green-800 text-sm">
                      {actionDatas.success}
                    </AlertDescription>
                  </Alert>
                )}
                
                {actionDatas?.error && (
                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription className="text-sm">{actionDatas.error}</AlertDescription>
                  </Alert>
                )}

                <Form method="post" className="space-y-4">
                  <input type="hidden" name="_action" value="updateProfile" />
                  
                  <div className="space-y-2">
                    <Label htmlFor="name" className="text-sm sm:text-base">Full Name *</Label>
                    <Input
                      id="name"
                      name="name"
                      defaultValue={actionDatas?.fields?.name || user?.name || ''}
                      placeholder="Your full name"
                      required
                      className="text-sm sm:text-base"
                    />
                    {actionDatas?.errors?.name && (
                      <p className="text-xs sm:text-sm text-destructive">{actionDatas.errors.name}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-sm sm:text-base">Email Address *</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      defaultValue={actionDatas?.fields?.email || user?.email || ''}
                      placeholder="your.email@example.com"
                      required
                      className="text-sm sm:text-base"
                    />
                    {actionDatas?.errors?.email && (
                      <p className="text-xs sm:text-sm text-destructive">{actionDatas.errors.email}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone" className="text-sm sm:text-base">Phone Number</Label>
                    <Input
                      id="phone"
                      name="phone"
                      type="tel"
                      defaultValue={actionDatas?.fields?.phone || user?.phone || ''}
                      placeholder="Your phone number"
                      className="text-sm sm:text-base"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="address" className="text-sm sm:text-base">Default Address</Label>
                    <Input
                      id="address"
                      name="address"
                      defaultValue={actionDatas?.fields?.address || user?.address || ''}
                      placeholder="Your delivery address"
                      className="text-sm sm:text-base"
                    />
                  </div>

                  <Button type="submit" disabled={isSubmitting} className="text-xs sm:text-sm w-full sm:w-auto">
                    {isSubmitting ? 'Updating...' : 'Update Profile'}
                  </Button>
                </Form>
              </CardContent>
            </Card>

            {/* Security Settings */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
                  <Shield className="h-4 w-4 sm:h-5 sm:w-5" />
                  Security Settings
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Password Success/Error Messages */}
                {actionDatas?.passwordSuccess && (
                  <Alert className="border-green-200 bg-green-50">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <AlertDescription className="text-green-800 text-sm">
                      {actionDatas.passwordSuccess}
                    </AlertDescription>
                  </Alert>
                )}
                
                {actionDatas?.passwordError && (
                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription className="text-sm">{actionDatas.passwordError}</AlertDescription>
                  </Alert>
                )}

                <Form method="post" className="space-y-4">
                  <input type="hidden" name="_action" value="changePassword" />
                  
                  <div className="space-y-2">
                    <Label htmlFor="currentPassword" className="text-sm sm:text-base">Current Password *</Label>
                    <Input
                      id="currentPassword"
                      name="currentPassword"
                      type="password"
                      placeholder="Enter current password"
                      required
                      className="text-sm sm:text-base"
                    />
                    {actionDatas?.passwordErrors?.currentPassword && (
                      <p className="text-xs sm:text-sm text-destructive">{actionDatas.passwordErrors.currentPassword}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="newPassword" className="text-sm sm:text-base">New Password *</Label>
                    <Input
                      id="newPassword"
                      name="newPassword"
                      type="password"
                      placeholder="Enter new password"
                      required
                      className="text-sm sm:text-base"
                    />
                    {actionDatas?.passwordErrors?.newPassword && (
                      <p className="text-xs sm:text-sm text-destructive">{actionDatas.passwordErrors.newPassword}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword" className="text-sm sm:text-base">Confirm New Password *</Label>
                    <Input
                      id="confirmPassword"
                      name="confirmPassword"
                      type="password"
                      placeholder="Confirm new password"
                      required
                      className="text-sm sm:text-base"
                    />
                    {actionDatas?.passwordErrors?.confirmPassword && (
                      <p className="text-xs sm:text-sm text-destructive">{actionDatas.passwordErrors.confirmPassword}</p>
                    )}
                  </div>

                  <Button type="submit" disabled={isSubmitting} className="text-xs sm:text-sm w-full sm:w-auto">
                    {isSubmitting ? 'Changing...' : 'Change Password'}
                  </Button>
                </Form>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Orders Tab */}
        <TabsContent value="orders" className="space-y-4 sm:space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
                <Package className="h-4 w-4 sm:h-5 sm:w-5" />
                Order History
              </CardTitle>
            </CardHeader>
            <CardContent>
              {orders && orders.length > 0 ? (
                <div className="space-y-4">
                  {orders.map((order) => (
                    <div key={order.id} className="border rounded-lg p-3 sm:p-4 space-y-3">
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                        <div>
                          <h4 className="font-semibold text-sm sm:text-base">Order #{order.orderNumber}</h4>
                          <p className="text-xs sm:text-sm text-muted-foreground">
                            {formatDate(order.createdAt)}
                          </p>
                        </div>
                        <div className="flex items-center justify-between sm:text-right sm:block">
                          <div className="font-semibold text-sm sm:text-base">{formatCurrency(order.total)}</div>
                          <Badge className={getStatusColor(order.status)}>
                            {order.status}
                          </Badge>
                        </div>
                      </div>
                      
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                        <div className="text-xs sm:text-sm text-muted-foreground">
                          {order.orderItems?.length || 0} items • {order.type}
                        </div>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm" className="text-xs sm:text-sm flex-1 sm:flex-none">
                            <Eye className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                            <span className="hidden sm:inline">View Details</span>
                            <span className="sm:hidden">View</span>
                          </Button>
                          <Button variant="outline" size="sm" className="text-xs sm:text-sm flex-1 sm:flex-none">
                            Reorder
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Package className="h-10 w-10 sm:h-12 sm:w-12 mx-auto text-muted-foreground mb-4" />
                  <h3 className="font-semibold mb-2 text-sm sm:text-base">No orders yet</h3>
                  <p className="text-muted-foreground mb-4 text-xs sm:text-sm">
                    Start exploring our delicious menu!
                  </p>
                  <Link to="/menu">
                    <Button variant="outline" className="cursor-pointer text-xs sm:text-sm">
                       Browse Menu 
                    </Button>
                
                  </Link>
                
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Reservations Tab */}
        <TabsContent value="reservations" className="space-y-4 sm:space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
                <Calendar className="h-4 w-4 sm:h-5 sm:w-5" />
                My Reservations
              </CardTitle>
            </CardHeader>
            <CardContent>
              {reservations && reservations.length > 0 ? (
                <div className="space-y-4">
                  {reservations.map((reservation) => (
                    <div key={reservation.id} className="border rounded-lg p-3 sm:p-4 space-y-3">
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                        <div>
                          <h4 className="font-semibold text-sm sm:text-base">
                            {formatDate(reservation.date)} at {reservation.time}
                          </h4>
                          <p className="text-xs sm:text-sm text-muted-foreground">
                            Party of {reservation.partySize}
                          </p>
                        </div>
                        <Badge className={getStatusColor(reservation.status)}>
                          {reservation.status}
                        </Badge>
                      </div>
                      
                      {reservation.notes && (
                        <p className="text-xs sm:text-sm text-muted-foreground">
                          Note: {reservation.notes}
                        </p>
                      )}
                      
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" className="flex-1 sm:flex-none text-xs sm:text-sm">
                          Modify
                        </Button>
                        <Button variant="outline" size="sm" className="flex-1 sm:flex-none text-xs sm:text-sm">
                          Cancel
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Calendar className="h-10 w-10 sm:h-12 sm:w-12 mx-auto text-muted-foreground mb-4" />
                  <h3 className="font-semibold mb-2 text-sm sm:text-base">No reservations</h3>
                  <p className="text-muted-foreground mb-4 text-xs sm:text-sm px-4">
                    Book a table to enjoy our authentic Mexican atmosphere!
                  </p>
                  <Button className="text-xs sm:text-sm">Make Reservation</Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

{/* Sessions Tab */}
<SessionsTab
  value="sessions"
  sessions={sessions}
  actionData={actionDatas}
  user={user}
  showUserManagement ={showUserManagement }
  setShowUserManagement={setShowUserManagement}
  loadingUsers={loadingUsers}
  allUsersData={allUsersData}
  setAllUsersData={setAllUsersData}
  selectedSessions={selectedSessions}
  setSelectedSessions={setSelectedSessions}
  searchTerm={searchTerm}
  setSearchTerm={setSearchTerm}
/>



        {/* Rewards Tab */}
        <TabsContent value="rewards" className="space-y-4 sm:space-y-6">
          <div className="grid gap-4 sm:gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
                  <Gift className="h-4 w-4 sm:h-5 sm:w-5" />
                  Reward Points
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center">
                  <div className="text-3xl sm:text-4xl font-bold text-primary">1,250</div>
                  <p className="text-muted-foreground text-sm sm:text-base">Available Points</p>
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between text-xs sm:text-sm">
                    <span>Progress to next reward</span>
                    <span>250 points to go</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-primary h-2 rounded-full" style={{ width: '83%' }}></div>
                  </div>
                </div>
                
                <Button className="w-full text-xs sm:text-sm">View Available Rewards</Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base sm:text-lg">Recent Activity</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="font-medium text-sm sm:text-base">Order #1234</p>
                    <p className="text-xs sm:text-sm text-muted-foreground">Dec 15, 2024</p>
                  </div>
                  <div className="text-green-600 font-medium text-sm sm:text-base">+50 pts</div>
                </div>
                
                <div className="flex justify-between items-center">
                  <div>
                    <p className="font-medium text-sm sm:text-base">Birthday Bonus</p>
                    <p className="text-xs sm:text-sm text-muted-foreground">Dec 10, 2024</p>
                  </div>
                  <div className="text-green-600 font-medium text-sm sm:text-base">+100 pts</div>
                </div>
                
                <div className="flex justify-between items-center">
                  <div>
                    <p className="font-medium text-sm sm:text-base">Order #1233</p>
                    <p className="text-xs sm:text-sm text-muted-foreground">Dec 8, 2024</p>
                  </div>
                  <div className="text-green-600 font-medium text-sm sm:text-base">+35 pts</div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Settings Tab */}
        <TabsContent value="settings" className="space-y-4 sm:space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
                <Bell className="h-4 w-4 sm:h-5 sm:w-5" />
                Notification Preferences
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between gap-4">
                <div className="flex-1">
                  <h4 className="font-medium text-sm sm:text-base">Order Updates</h4>
                  <p className="text-xs sm:text-sm text-muted-foreground">
                    Get notified about your order status
                  </p>
                </div>
                <input type="checkbox" defaultChecked className="h-4 w-4 flex-shrink-0" />
              </div>
              
              <Separator />
              
              <div className="flex items-center justify-between gap-4">
                <div className="flex-1">
                  <h4 className="font-medium text-sm sm:text-base">Promotional Offers</h4>
                  <p className="text-xs sm:text-sm text-muted-foreground">
                    Receive exclusive deals and promotions
                  </p>
                </div>
                <input type="checkbox" defaultChecked className="h-4 w-4 flex-shrink-0" />
              </div>
              
              <Separator />
              
              <div className="flex items-center justify-between gap-4">
                <div className="flex-1">
                  <h4 className="font-medium text-sm sm:text-base">Reservation Reminders</h4>
                  <p className="text-xs sm:text-sm text-muted-foreground">
                    Get reminded about upcoming reservations
                  </p>
                </div>
                <input type="checkbox" defaultChecked className="h-4 w-4 flex-shrink-0" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-red-600 text-base sm:text-lg">
                <LogOut className="h-4 w-4 sm:h-5 sm:w-5" />
                Account Actions
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button variant="outline" className="w-full justify-start text-xs sm:text-sm">
                <LogOut className="h-3 w-3 sm:h-4 sm:w-4 mr-2" />
                Sign Out
              </Button>
              
              <Button variant="outline" className="w-full justify-start text-red-600 hover:text-red-700 text-xs sm:text-sm">
                <AlertCircleIcon className="h-3 w-3 sm:h-4 sm:w-4 mr-2" />
                Delete Account
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      
      {/* Note: UserManagementModal is now integrated into the Dialog above */}
    </main>
  );
}


// --- User Management Content Component ---
const UserManagementContent = ({ usersData, currentUser, selectedSessions, setSelectedSessions, searchTerm, setSearchTerm }) => {
  const submit = useSubmit();
  
  const filteredUsers = usersData.filter(user => 
    user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSessionSelect = (userId, sessionId) => {
    const key = `${userId}-${sessionId}`;
    const newSelected = new Set(selectedSessions);
    if (newSelected.has(key)) {
      newSelected.delete(key);
    } else {
      newSelected.add(key);
    }
    setSelectedSessions(newSelected);
  };

  const handleRevokeSelected = () => {
    if (selectedSessions.size === 0) return;
    
    if (confirm(`Revoke ${selectedSessions.size} selected sessions?`)) {
      selectedSessions.forEach(key => {
        const [userId, sessionId] = key.split('-');
        const formData = new FormData();
        formData.append("intent", "revoke-user-session");
        formData.append("userId", userId);
        formData.append("sessionId", sessionId);
        submit(formData, { method: "post" });
      });
      setSelectedSessions(new Set());
    }
  };
 
  return (
    <div className="w-full h-full overflow-y-auto space-y-6">
      {/* Search and Controls */}
      <div className="flex flex-wrap items-start sm:items-center justify-between mb-6 px-1 gap-3">
        <div className="flex items-center gap-4 w-full sm:w-auto">
          <Input
            placeholder="Search users..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full sm:w-64 text-sm"
          />
          <Badge variant="outline" className="text-xs sm:text-sm">
            {filteredUsers.length} users
          </Badge>
        </div>
        
        {selectedSessions.size > 0 && (
          <Button
            variant="destructive"
            size="sm"
            onClick={handleRevokeSelected}
            className="text-xs sm:text-sm w-full sm:w-auto"
          >
            Revoke {selectedSessions.size} Selected Sessions
          </Button>
        )}
      </div>

      {/* Users List */}
      <div className="space-y-4 px-1">
        {filteredUsers.map(user => (
          <Card key={user.id}>
            <CardHeader className="pb-3">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div className="flex items-center gap-3">
                  <Avatar className="h-8 w-8 sm:h-10 sm:w-10">
                    <AvatarFallback className="text-xs sm:text-sm">
                      {user.name?.split(' ').map(n => n[0]).join('').toUpperCase() || 'U'}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="font-semibold text-sm sm:text-base">{user.name || 'Unknown User'}</h3>
                    <p className="text-xs sm:text-sm text-muted-foreground">{user.email}</p>
                  </div>
                  <Badge variant={user.id === currentUser?.userId ? 'default' : 'secondary'} className="text-xs">
                    {user.role}
                  </Badge>
                  {user.id === currentUser?.userId && (
                    <Badge variant="outline" className="bg-green-50 text-green-700 text-xs">
                      You
                    </Badge>
                  )}
                </div>
                <div className="text-xs sm:text-sm text-muted-foreground">
                  {user.sessions?.length || 0} active sessions
                </div>
              </div>
            </CardHeader>
            
            {user.sessions && user.sessions.length > 0 && (
              <CardContent className="pt-0">
                <div className="space-y-2">
                  {user.sessions.map(session => {
                    const { device, browser } = parseUserAgent(session.userAgent);
                    const sessionKey = `${user.id}-${session.id}`;
                    const isSelected = selectedSessions.has(sessionKey);
                    
                    return (
                      <div 
                      key={session.id}
                      className={`flex flex-wrap items-center justify-between gap-3 p-3 rounded-lg border ${
                        isSelected ? 'border-red-200 bg-red-50' : 'border-border'
                      }`}
                    >
                        <div className="flex items-center gap-3 flex-1 min-w-0">
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={() => handleSessionSelect(user.id, session.id)}
                            className="h-4 w-4 flex-shrink-0"
                          />
                          
                          <div className="flex items-center gap-2 flex-1 min-w-0">
                            {device === "Mobile" ? (
                              <Smartphone className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground flex-shrink-0" />
                            ) : (
                              <Monitor className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground flex-shrink-0" />
                            )}
                            <span className="font-medium text-xs sm:text-sm truncate">{device} • {browser}</span>
                          </div>
                          
                          <Badge variant="outline" className="text-xs flex-shrink-0">
                            IP: {session.ip}
                          </Badge>
                        </div>
                        
                        <div className="flex flex-wrap  items-start sm:items-center gap-2 sm:gap-4 text-xs sm:text-sm text-muted-foreground">
                          <span className="whitespace-nowrap">Active: {formatRelativeTime(session.lastUsedAt)}</span>
                          <span className="whitespace-nowrap">Expires: {formatRelativeTime(session.expiresAt, true)}</span>
                          
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              if (confirm(`Revoke this session for ${user.name}?`)) {
                                const formData = new FormData();
                                formData.append("intent", "revoke-user-session");
                                formData.append("userId", user.id);
                                formData.append("sessionId", session.id);
                                submit(formData, { method: "post" });
                              }
                            }}
                            className="text-red-600 hover:text-red-700 text-xs w-full sm:w-auto"
                          >
                            <Power className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                            Revoke
                          </Button>
                        </div>
                     
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            )}
          </Card>
        ))}
        
        {filteredUsers.length === 0 && (
          <div className="text-center py-8">
            <p className="text-muted-foreground text-sm">No users found matching your search.</p>
          </div>
        )}
      </div>
    </div>
  );
};


// --- Helpers ---
function parseUserAgent(ua) {
  if (!ua) return { device: "Unknown", browser: "Unknown" };

  const isWindows = ua.includes("Windows");
  const isMac = ua.includes("Macintosh");
  const isLinux = ua.includes("Linux");
  const isMobile = /iPhone|Android/i.test(ua);

  const device = isMobile
    ? "Mobile"
    : isWindows
    ? "Windows"
    : isMac
    ? "Mac"
    : isLinux
    ? "Linux"
    : "Unknown";

  const match = ua.match(/(Chrome|Firefox|Safari|Edge)\/([\d.]+)/);
  const browser = match ? `${match[1]} ${match[2].split(".")[0]}` : "Unknown";

  return { device, browser };
}

function formatRelativeTime(date, future = false) {
  const d = new Date(date);
  const diff = (d - new Date()) / 1000;
  const abs = Math.abs(diff);
  const mins = Math.floor(abs / 60);
  const hrs = Math.floor(mins / 60);
  const days = Math.floor(hrs / 24);

  const label = future ? "in" : "";
  if (days > 0) return `${label} ${days} day${days > 1 ? "s" : ""}`;
  if (hrs > 0) return `${label} ${hrs} hour${hrs > 1 ? "s" : ""}`;
  if (mins > 0) return `${label} ${mins} minute${mins > 1 ? "s" : ""}`;
  return "just now";
}

// --- Components ---
const SessionCard = ({ session, isCurrent, onLogout }) => {
  const { device, browser } = parseUserAgent(session.userAgent);
  const submit = useSubmit();
  return (
    <div className="border rounded-lg p-3 sm:p-4 space-y-3 transition hover:bg-muted/40">
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 space-y-2 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            {device === "Mobile" ? (
              <Smartphone className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground flex-shrink-0" />
            ) : (
              <Monitor className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground flex-shrink-0" />
            )}
            <h4 className="font-semibold text-sm sm:text-base">
              {device} • {browser}
            </h4>
            {isCurrent && (
              <Badge variant="secondary" className="bg-green-100 text-green-800 text-xs">
                <Circle className="h-2 w-2 fill-current mr-1" />
                Current Session
              </Badge>
            )}
          </div>
          
          <div className="flex items-center gap-1 text-xs sm:text-sm text-muted-foreground">
            <MapPin className="h-3 w-3 flex-shrink-0" />
            <span className="truncate">IP ADDRESS: {session.ip || "N/A"}</span>
            {session.ip === "::1" && (
              <Badge variant="outline" className="text-xs">Local</Badge>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs sm:text-sm text-muted-foreground">
          
            <div className="flex items-center gap-1">
              <Calendar className="h-3 w-3 flex-shrink-0" />
              <span className="truncate">Signed in: {formatRelativeTime(session.createdAt)}</span>
            </div>
            <div className="flex items-center gap-1">
              <Clock className="h-3 w-3 flex-shrink-0" />
              <span className="truncate">last active: {formatRelativeTime(session.lastUsedAt)}</span>
            </div>
            <div className="flex items-center gap-1">
              <Clock className="h-3 w-3 flex-shrink-0" />
              <span className="truncate">Expires in: {formatRelativeTime(session.expiresAt)}</span>
            </div>
          </div>

          <div className="flex flex-wrap gap-2 mt-2">
            <Badge variant="outline" className="text-xs">{browser}</Badge>
            <Badge variant="outline" className="text-xs">{device}</Badge>
          </div>
        </div>

        {/* Revoke button - Debug: isCurrent = {isCurrent ? 'true' : 'false'} */}
        {!isCurrent && (
          <div className="ml-2 sm:ml-4 flex-shrink-0">
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                console.log("Revoking session:", session.id);
                const formData = new FormData();
                formData.append("intent", "revoke-session");
                formData.append("sessionId", session.id);
                submit(formData, { method: "post" });
              }}
              className="text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200 text-xs sm:text-sm"
            >
              <Power className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
              <span className="hidden sm:inline">Revoke</span>
            </Button>
          </div>
        )}
        
        {/* Debug info */}
        {process.env.NODE_ENV === 'development' && (
          <div className="ml-2 sm:ml-4 text-xs text-gray-500">
            Current: {isCurrent ? 'YES' : 'NO'}
          </div>
        )}
      </div>
    </div>
  );
};

const EmptySessionsState = () => (
  <div className="text-center py-8">
    <Shield className="h-10 w-10 sm:h-12 sm:w-12 mx-auto text-muted-foreground mb-4" />
    <h3 className="font-semibold mb-2 text-sm sm:text-base">No Active Sessions</h3>
    <p className="text-muted-foreground text-xs sm:text-sm">
      You're currently logged out on all devices.
    </p>
  </div>
);

// --- Main Sessions Tab ---
const SessionsTab = ({ sessions, actionData, user ,showUserManagement ,setShowUserManagement,loadingUsers,allUsersData,setAllUsersData,selectedSessions,setSelectedSessions,
  searchTerm,setSearchTerm
}) => {
  const submit = useSubmit();
  
  return (
    <TabsContent value="sessions" className="space-y-4 sm:space-y-6 bg-transparent">
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
          <Shield className="h-4 w-4 sm:h-5 sm:w-5" />
          Active Sessions
        </CardTitle>
        <CardDescription className="text-xs sm:text-sm">
          Manage your logged-in devices and sessions. Log out from any suspicious or unused sessions.
        </CardDescription>
      </CardHeader>

      <CardContent>
     

        {/* Display action results */}
        {actionData?.status === "success" && (
          <Alert className="mb-4 border-green-200 bg-green-50">
            <CheckCircle className="h-4 w-4 text-green-600" />
            <AlertDescription className="text-green-800 text-sm">
              {actionData.message}
            </AlertDescription>
          </Alert>
        )}
        
        {actionData?.status === "error" && (
          <Alert variant="destructive" className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription className="text-sm">{actionData.message}</AlertDescription>
          </Alert>
        )}

        {sessions && sessions.length > 0 ? (
          <div className="space-y-4">
            {/* Current Session */}
            {sessions.filter((s) => s.current).map((session) => (
              <SessionCard key={session.id} session={session} isCurrent />
            ))}

            {/* Other Sessions */}
            {sessions.filter((s) => !s.current).map((session) => (
              <SessionCard
                key={session.id}
                session={session}
                isCurrent={false}
              />
            ))}

            {/* Session Stats and Management Buttons */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 bg-muted/50 rounded-lg text-xs sm:text-sm gap-4">
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span>
                    {sessions.length} active session
                    {sessions.length !== 1 ? "s" : ""}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span>
                    {sessions.filter((s) => s.current).length} current device
                  </span>
                </div>
                
                {/* Debug info */}
                {process.env.NODE_ENV === 'development' && (
                  <div className="text-xs text-gray-500">
                    Others: {sessions.filter((s) => !s.current).length}
                  </div>
                )}
              </div>

              <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
  {(user?.role === 'ADMIN' || user?.role === 'OWNER') && (
  <Dialog open={showUserManagement} onOpenChange={setShowUserManagement}>
    <DialogTrigger asChild>
      <Button
        variant="outline"
        size="sm"
        onClick={() => {
          const mockUsersData = [
            {
              id: user?.userId || "current-user",
              name: user?.name || "Current User",
              email: user?.email || "owner@example1.com",
              role: user?.role || "OWNER",
              sessions: sessions || [],
            },
            {
              id: "mock-user-1",
              name: "John Doe",
              email: "john@example.com",
              role: "CUSTOMER",
              sessions: [
                {
                  id: "mock-session-1",
                  ip: "192.168.1.100",
                  userAgent:
                    "Mozilla/5.0 (iPhone; CPU iPhone OS 15_0 like Mac OS X)",
                  createdAt: new Date(Date.now() - 3600000).toISOString(),
                  lastUsedAt: new Date(Date.now() - 1800000).toISOString(),
                  expiresAt: new Date(Date.now() + 1800000).toISOString(),
                },
              ],
            },
            {
              id: "mock-user-2",
              name: "Jane Smith",
              email: "jane@example.com",
              role: "ADMIN",
              sessions: [
                {
                  id: "mock-session-2",
                  ip: "10.0.0.50",
                  userAgent:
                    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
                  createdAt: new Date(Date.now() - 7200000).toISOString(),
                  lastUsedAt: new Date(Date.now() - 900000).toISOString(),
                  expiresAt: new Date(Date.now() + 3600000).toISOString(),
                },
                {
                  id: "mock-session-3",
                  ip: "10.0.0.51",
                  userAgent:
                    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36",
                  createdAt: new Date(Date.now() - 5400000).toISOString(),
                  lastUsedAt: new Date(Date.now() - 600000).toISOString(),
                  expiresAt: new Date(Date.now() + 2400000).toISOString(),
                },
              ],
            },
          ];
          setAllUsersData(mockUsersData);
          setShowUserManagement(true);
        }}
        className="text-purple-600 hover:text-purple-700 hover:bg-purple-50 border-purple-200 text-xs w-full sm:w-auto"
      >
        <Shield className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
        <span className="hidden sm:inline">Manage All Users</span>
        <span className="sm:hidden">Manage Users</span>
        <Badge variant="outline" className="ml-2 text-xs">Admin</Badge>
      </Button>
    </DialogTrigger>

    <DialogContent
  className="
    w-[98vw] sm:w-[90vw] md:w-[85vw] lg:w-[80vw] xl:w-[75vw] 
    max-h-[90vh]
    mx-auto
    p-4 sm:p-6
    overflow-hidden
    flex flex-col
    bg-background
    rounded-2xl
  "
>
  <DialogHeader className="mb-4">
    <DialogTitle className="text-base sm:text-lg">User Session Management</DialogTitle>
    <DialogDescription className="text-xs sm:text-sm">
      Manage active sessions for all users. Revoke suspicious or unused sessions.
    </DialogDescription>
    {actionData?.status === "success" && (
          <Alert variant="success" className="h-8 flex items-center justify-center gap-2">
            <CheckCircle className="h-4 w-4 text-green-600" />
            <AlertDescription className="text-green-800 text-sm">
              {actionData.message}
            </AlertDescription>
          </Alert>
        )}
    {actionData?.status === "error" && (
          <Alert variant="destructive" className="h-8 flex items-center justify-center gap-2">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription className="text-sm">{actionData.message}</AlertDescription>
          </Alert>
        )}
  </DialogHeader>

  <div
    className="
      flex-1
      overflow-y-auto
      border
      border-border
      rounded-xl
      bg-card
      p-3 sm:p-4
    "
  >
    {loadingUsers ? (
      <div className="p-8 text-center">
        <div className="animate-spin h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
        <p className="text-sm">Loading users and sessions...</p>
      </div>
    ) : (
      <UserManagementContent
        usersData={allUsersData}
        currentUser={user}
        selectedSessions={selectedSessions}
        setSelectedSessions={setSelectedSessions}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        
      />
    )}
  </div>
</DialogContent>

  </Dialog>
)}


                {/* Alternative: Logout Other Devices for all users but with different behavior */}
                {sessions.filter((s) => !s.current).length > 0 && 
                 user?.role !== 'ADMIN' && user?.role !== 'OWNER' && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      if (confirm("This will log out all your other devices but keep this session active. Continue?")) {
                        console.log("Logging out other sessions only (user)");
                        const formData = new FormData();
                        formData.append("intent", "logout-all-others");
                        submit(formData, { method: "post" });
                      }
                    }}
                    className="text-orange-600 hover:text-orange-700 hover:bg-orange-50 border-orange-200 text-xs w-full sm:w-auto"
                  >
                    <Power className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                    <span className="hidden sm:inline">Keep This Session Only</span>
                    <span className="sm:hidden">Keep This Only</span>
                  </Button>
                )}
                
                {/* Logout ALL Sessions - Always available */}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    if (confirm("This will log you out of ALL devices including this one. Continue?")) {
                      console.log("Logging out ALL sessions");
                      const formData = new FormData();
                      formData.append("intent", "logout-all-sessions");
                      submit(formData, { method: "post" });
                    }
                  }}
                  className="text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200 text-xs w-full sm:w-auto"
                >
                  <Power className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                  <span className="hidden sm:inline">Logout All Devices</span>
                  <span className="sm:hidden">Logout All</span>
                </Button>
              </div>
            </div>
          </div>
        ) : (
          <EmptySessionsState />
        )}
      </CardContent>
    </Card>
  </TabsContent>
  )
   
}