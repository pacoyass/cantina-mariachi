import { useState } from 'react';
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
console.log("sessionData ....",sessionsData);

    return {
      orders: ordersData.data?.orders || [],
      reservations: reservationsData.data?.reservations || [],
      sessions: sessionsData.data?.sessions || [],
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
    <main className="container mx-auto px-4 py-8 max-w-6xl min-h-screen">
      {/* Welcome Message */}
      {isWelcome && (
        <Alert className="mb-8 border-green-200 bg-green-50">
          <CheckCircle className="h-4 w-4 text-green-600" />
          <AlertDescription className="text-green-800">
            Welcome to Cantina Mariachi! Your account has been created successfully.
          </AlertDescription>
        </Alert>
      )}

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
        <div className="flex items-center space-x-4">
          <Avatar className="h-16 w-16">
            <AvatarImage src={user?.avatar} alt={user?.name} />
            <AvatarFallback className="text-lg">
              {user?.name?.split(' ').map(n => n[0]).join('').toUpperCase() || 'U'}
            </AvatarFallback>
          </Avatar>
          <div>
            <h1 className="text-2xl font-bold">Welcome back, {user?.name || 'User'}!</h1>
            <p className="text-muted-foreground">Manage your account and view your activity</p>
          </div>
        </div>
        
        {/* Quick Stats */}
        <div className="flex gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-primary">{orders?.length || 0}</div>
            <div className="text-sm text-muted-foreground">Orders</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-primary">{reservations?.length || 0}</div>
            <div className="text-sm text-muted-foreground">Reservations</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-primary">1,250</div>
            <div className="text-sm text-muted-foreground">Points</div>
          </div>
        </div>
      </div>
   


      {/* Main Content */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-2 md:grid-cols-6">
          <TabsTrigger value="profile" className="flex items-center gap-2">
            <User className="h-4 w-4" />
            Profile
          </TabsTrigger>
          <TabsTrigger value="orders" className="flex items-center gap-2">
            <Package className="h-4 w-4" />
            Orders
          </TabsTrigger>
          <TabsTrigger value="reservations" className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            Reservations
          </TabsTrigger>
          <TabsTrigger value="sessions" className="flex items-center gap-2">
            <Shield className="h-4 w-4" />
            Sessions
          </TabsTrigger>
          <TabsTrigger value="rewards" className="flex items-center gap-2">
            <Gift className="h-4 w-4" />
            Rewards
          </TabsTrigger>
          <TabsTrigger value="settings" className="flex items-center gap-2">
            <Settings className="h-4 w-4" />
            Settings
          </TabsTrigger>
        </TabsList>

        {/* Profile Tab */}
        <TabsContent value="profile" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            {/* Profile Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Profile Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Success/Error Messages */}
                {actionDatas?.success && (
                  <Alert className="border-green-200 bg-green-50">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <AlertDescription className="text-green-800">
                      {actionDatas.success}
                    </AlertDescription>
                  </Alert>
                )}
                
                {actionDatas?.error && (
                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{actionDatas.error}</AlertDescription>
                  </Alert>
                )}

                <Form method="post" className="space-y-4">
                  <input type="hidden" name="_action" value="updateProfile" />
                  
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name *</Label>
                    <Input
                      id="name"
                      name="name"
                      defaultValue={actionDatas?.fields?.name || user?.name || ''}
                      placeholder="Your full name"
                      required
                    />
                    {actionDatas?.errors?.name && (
                      <p className="text-sm text-destructive">{actionDatas.errors.name}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address *</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      defaultValue={actionDatas?.fields?.email || user?.email || ''}
                      placeholder="your.email@example.com"
                      required
                    />
                    {actionDatas?.errors?.email && (
                      <p className="text-sm text-destructive">{actionDatas.errors.email}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input
                      id="phone"
                      name="phone"
                      type="tel"
                      defaultValue={actionDatas?.fields?.phone || user?.phone || ''}
                      placeholder="Your phone number"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="address">Default Address</Label>
                    <Input
                      id="address"
                      name="address"
                      defaultValue={actionDatas?.fields?.address || user?.address || ''}
                      placeholder="Your delivery address"
                    />
                  </div>

                  <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? 'Updating...' : 'Update Profile'}
                  </Button>
                </Form>
              </CardContent>
            </Card>

            {/* Security Settings */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  Security Settings
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Password Success/Error Messages */}
                {actionDatas?.passwordSuccess && (
                  <Alert className="border-green-200 bg-green-50">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <AlertDescription className="text-green-800">
                      {actionDatas.passwordSuccess}
                    </AlertDescription>
                  </Alert>
                )}
                
                {actionDatas?.passwordError && (
                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{actionDatas.passwordError}</AlertDescription>
                  </Alert>
                )}

                <Form method="post" className="space-y-4">
                  <input type="hidden" name="_action" value="changePassword" />
                  
                  <div className="space-y-2">
                    <Label htmlFor="currentPassword">Current Password *</Label>
                    <Input
                      id="currentPassword"
                      name="currentPassword"
                      type="password"
                      placeholder="Enter current password"
                      required
                    />
                    {actionDatas?.passwordErrors?.currentPassword && (
                      <p className="text-sm text-destructive">{actionDatas.passwordErrors.currentPassword}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="newPassword">New Password *</Label>
                    <Input
                      id="newPassword"
                      name="newPassword"
                      type="password"
                      placeholder="Enter new password"
                      required
                    />
                    {actionDatas?.passwordErrors?.newPassword && (
                      <p className="text-sm text-destructive">{actionDatas.passwordErrors.newPassword}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">Confirm New Password *</Label>
                    <Input
                      id="confirmPassword"
                      name="confirmPassword"
                      type="password"
                      placeholder="Confirm new password"
                      required
                    />
                    {actionDatas?.passwordErrors?.confirmPassword && (
                      <p className="text-sm text-destructive">{actionDatas.passwordErrors.confirmPassword}</p>
                    )}
                  </div>

                  <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? 'Changing...' : 'Change Password'}
                  </Button>
                </Form>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Orders Tab */}
        <TabsContent value="orders" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="h-5 w-5" />
                Order History
              </CardTitle>
            </CardHeader>
            <CardContent>
              {orders && orders.length > 0 ? (
                <div className="space-y-4">
                  {orders.map((order) => (
                    <div key={order.id} className="border rounded-lg p-4 space-y-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-semibold">Order #{order.orderNumber}</h4>
                          <p className="text-sm text-muted-foreground">
                            {formatDate(order.createdAt)}
                          </p>
                        </div>
                        <div className="text-right">
                          <div className="font-semibold">{formatCurrency(order.total)}</div>
                          <Badge className={getStatusColor(order.status)}>
                            {order.status}
                          </Badge>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="text-sm text-muted-foreground">
                          {order.orderItems?.length || 0} items • {order.type}
                        </div>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm">
                            <Eye className="h-4 w-4 mr-1" />
                            View Details
                          </Button>
                          <Button variant="outline" size="sm">
                            Reorder
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Package className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <h3 className="font-semibold mb-2">No orders yet</h3>
                  <p className="text-muted-foreground mb-4">
                    Start exploring our delicious menu!
                  </p>
                  <Link to="/menu">
                    <Button variant="outline"  className="cursor-pointer ">
                       Browse Menu 
                    </Button>
                
                  </Link>
                
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Reservations Tab */}
        <TabsContent value="reservations" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                My Reservations
              </CardTitle>
            </CardHeader>
            <CardContent>
              {reservations && reservations.length > 0 ? (
                <div className="space-y-4">
                  {reservations.map((reservation) => (
                    <div key={reservation.id} className="border rounded-lg p-4 space-y-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-semibold">
                            {formatDate(reservation.date)} at {reservation.time}
                          </h4>
                          <p className="text-sm text-muted-foreground">
                            Party of {reservation.partySize}
                          </p>
                        </div>
                        <Badge className={getStatusColor(reservation.status)}>
                          {reservation.status}
                        </Badge>
                      </div>
                      
                      {reservation.notes && (
                        <p className="text-sm text-muted-foreground">
                          Note: {reservation.notes}
                        </p>
                      )}
                      
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">
                          Modify
                        </Button>
                        <Button variant="outline" size="sm">
                          Cancel
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Calendar className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <h3 className="font-semibold mb-2">No reservations</h3>
                  <p className="text-muted-foreground mb-4">
                    Book a table to enjoy our authentic Mexican atmosphere!
                  </p>
                  <Button>Make Reservation</Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

{/* Sessions Tab */}
<SessionsTab
  value="sessions"
  sessions={sessions}
/>



        {/* Rewards Tab */}
        <TabsContent value="rewards" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Gift className="h-5 w-5" />
                  Reward Points
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center">
                  <div className="text-4xl font-bold text-primary">1,250</div>
                  <p className="text-muted-foreground">Available Points</p>
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Progress to next reward</span>
                    <span>250 points to go</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-primary h-2 rounded-full" style={{ width: '83%' }}></div>
                  </div>
                </div>
                
                <Button className="w-full">View Available Rewards</Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="font-medium">Order #1234</p>
                    <p className="text-sm text-muted-foreground">Dec 15, 2024</p>
                  </div>
                  <div className="text-green-600 font-medium">+50 pts</div>
                </div>
                
                <div className="flex justify-between items-center">
                  <div>
                    <p className="font-medium">Birthday Bonus</p>
                    <p className="text-sm text-muted-foreground">Dec 10, 2024</p>
                  </div>
                  <div className="text-green-600 font-medium">+100 pts</div>
                </div>
                
                <div className="flex justify-between items-center">
                  <div>
                    <p className="font-medium">Order #1233</p>
                    <p className="text-sm text-muted-foreground">Dec 8, 2024</p>
                  </div>
                  <div className="text-green-600 font-medium">+35 pts</div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Settings Tab */}
        <TabsContent value="settings" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5" />
                Notification Preferences
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium">Order Updates</h4>
                  <p className="text-sm text-muted-foreground">
                    Get notified about your order status
                  </p>
                </div>
                <input type="checkbox" defaultChecked className="h-4 w-4" />
              </div>
              
              <Separator />
              
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium">Promotional Offers</h4>
                  <p className="text-sm text-muted-foreground">
                    Receive exclusive deals and promotions
                  </p>
                </div>
                <input type="checkbox" defaultChecked className="h-4 w-4" />
              </div>
              
              <Separator />
              
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium">Reservation Reminders</h4>
                  <p className="text-sm text-muted-foreground">
                    Get reminded about upcoming reservations
                  </p>
                </div>
                <input type="checkbox" defaultChecked className="h-4 w-4" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-red-600">
                <LogOut className="h-5 w-5" />
                Account Actions
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button variant="outline" className="w-full justify-start">
                <LogOut className="h-4 w-4 mr-2" />
                Sign Out
              </Button>
              
              <Button variant="outline" className="w-full justify-start text-red-600 hover:text-red-700">
                <AlertCircleIcon className="h-4 w-4 mr-2" />
                Delete Account
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </main>
  );
}


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
    <div
      className={`border rounded-lg p-4 space-y-3 transition ${
        isCurrent ? "border-green-200 bg-green-50" : "hover:bg-muted/40"
      }`}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1 space-y-2">
          <div className="flex items-center gap-2">
            {device === "Mobile" ? (
              <Smartphone className="h-4 w-4 text-muted-foreground" />
            ) : (
              <Monitor className="h-4 w-4 text-muted-foreground" />
            )}
            <h4 className="font-semibold">
              {device} • {browser}
            </h4>
            {isCurrent && (
              <Badge variant="secondary" className="bg-green-100 text-green-800">
                <Circle className="h-2 w-2 fill-current mr-1" />
                Current Session
              </Badge>
            )}
              <div className="flex items-center gap-1 mx-auto">
              <MapPin className="h-3 w-3" />
              <span>IP ADRESS: {session.ip || "N/A"}</span>
              {session.ip === "::1" && (
                <Badge variant="outline" className="text-xs">Local</Badge>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-sm text-muted-foreground">
          
            <div className="flex items-center gap-1">
              <Calendar className="h-3 w-3" />
              <span>Signed in: {formatRelativeTime(session.createdAt)}</span>
            </div>
            <div className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              <span>last active: {formatRelativeTime(session.lastUsedAt)}</span>
            </div>
            <div className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              <span>Expires in: {formatRelativeTime(session.expiresAt)}</span>
            </div>
          </div>

          <div className="flex flex-wrap gap-2 mt-2">
            <Badge variant="outline" className="text-xs">{browser}</Badge>
            <Badge variant="outline" className="text-xs">{device}</Badge>
          </div>
        </div>

        {!isCurrent && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => submit( null, { action: "/logout", method: "post" } )}
            className="text-red-600 hover:text-red-700 hover:bg-red-50"
          >
            <Power className="h-4 w-4 mr-1" />
            Revoke
          </Button>
        )}
      </div>
    </div>
  );
};

const EmptySessionsState = () => (
  <div className="text-center py-8">
    <Shield className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
    <h3 className="font-semibold mb-2">No Active Sessions</h3>
    <p className="text-muted-foreground">
      You’re currently logged out on all devices.
    </p>
  </div>
);

// --- Main Sessions Tab ---
const SessionsTab = ({ sessions }) => {
   // Handle current session detection inside the component
   const enhancedSessions = sessions.map((s) => {
    const isBrowser = typeof navigator !== "undefined";
    const isCurrent = isBrowser && s.userAgent === navigator.userAgent;
    const isLocal = ["::1", "127.0.0.1", "localhost"].includes(s.ip);

    return { ...s, current: isCurrent || isLocal };
  });
  return (
    <TabsContent value="sessions" className="space-y-6 bg-transparent">
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Shield className="h-5 w-5" />
          Active Sessions
        </CardTitle>
        <CardDescription>
          Manage your logged-in devices and sessions. Log out from any suspicious or unused sessions.
        </CardDescription>
      </CardHeader>

      <CardContent>
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

            {/* Session Stats */}
            <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg text-sm">
              <div className="flex items-center gap-4">
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
                    {enhancedSessions.filter((s) => s.current).length} current device
                  </span>
                </div>
              </div>

              {sessions.filter((s) => !s.current).length > 0 && (
                <Button
                  variant="outline"
                  size="sm"
                  className="text-red-600 hover:text-red-700 hover:bg-red-50"
                >
                  <Power className="h-4 w-4 mr-1" />
                  Logout All Other Devices
                </Button>
              )}
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



