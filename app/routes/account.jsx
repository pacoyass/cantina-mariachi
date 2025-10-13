import { useState } from 'react';
import { Form, useLoaderData, useActionData, useNavigation, redirect, Link, useOutletContext } from 'react-router';
// middleware-based auth temporarily disabled due to RouterContextProvider incompatibility
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
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
  Settings, Bell, Shield, LogOut, Edit, Eye, Gift
} from '../lib/lucide-shim.js';

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

    return {
      orders: ordersData.data?.orders || [],
      reservations: reservationsData.data?.reservations || [],
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
  const {  orders, reservations, isWelcome } = loaderData;
  const actionDatas = actionData;
  const navigation = useNavigation();
  const [activeTab, setActiveTab] = useState('profile');
  const isSubmitting = navigation.state === 'submitting';
console.log("from account",user);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
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
    <main className="container mx-auto px-3 sm:px-4 py-6 sm:py-8 max-w-6xl min-h-screen">
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
        <div className="flex gap-4 sm:gap-6">
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
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-1">
          <TabsTrigger value="profile" className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm">
            <User className="h-3 w-3 sm:h-4 sm:w-4" />
            <span className="hidden sm:inline">Profile</span>
            <span className="sm:hidden">Profile</span>
          </TabsTrigger>
          <TabsTrigger value="orders" className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm">
            <Package className="h-3 w-3 sm:h-4 sm:w-4" />
            <span className="hidden sm:inline">Orders</span>
            <span className="sm:hidden">Orders</span>
          </TabsTrigger>
          <TabsTrigger value="reservations" className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm">
            <Calendar className="h-3 w-3 sm:h-4 sm:w-4" />
            <span className="hidden sm:inline">Reservations</span>
            <span className="sm:hidden">Reserve</span>
          </TabsTrigger>
          <TabsTrigger value="rewards" className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm">
            <Gift className="h-3 w-3 sm:h-4 sm:w-4" />
            <span className="hidden sm:inline">Rewards</span>
            <span className="sm:hidden">Rewards</span>
          </TabsTrigger>
          <TabsTrigger value="settings" className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm">
            <Settings className="h-3 w-3 sm:h-4 sm:w-4" />
            <span className="hidden sm:inline">Settings</span>
            <span className="sm:hidden">Settings</span>
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

                  <Button type="submit" disabled={isSubmitting} className="text-xs sm:text-sm">
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

                  <Button type="submit" disabled={isSubmitting} className="text-xs sm:text-sm">
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
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-0">
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
                      
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-0">
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
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-0">
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

        {/* Rewards Tab */}
        <TabsContent value="rewards" className="space-y-6">
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
                <AlertCircle className="h-3 w-3 sm:h-4 sm:w-4 mr-2" />
                Delete Account
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </main>
  );
}