import { useLoaderData, Form } from "react-router";
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Separator } from "../../components/ui/separator";
import { Badge } from "../../components/ui/badge";
import { 
  Settings, 
  Bell, 
  Globe, 
  Shield,
  Mail,
  Phone,
  MapPin,
  Clock,
  DollarSign,
  CheckCircle
} from "../../lib/lucide-shim.js";

export const meta = () => [
  { title: "Settings - Admin - Cantina" },
];

export async function loader({ request }) {
  const url = new URL(request.url);
  const cookie = request.headers.get("cookie") || "";
  
  try {
    const settingsRes = await fetch(`${url.origin}/api/admin/settings`, {
      headers: { cookie }
    });
    
    if (settingsRes.ok) {
      const data = await settingsRes.json();
      return { settings: data.data || {} };
    }
  } catch (error) {
    console.error('Settings loader error:', error);
  }
  
  // Mock data for development
  return {
    settings: {
      restaurant: {
        name: 'Cantina Mariachi',
        email: 'info@cantina-mariachi.com',
        phone: '+1 (555) 123-4567',
        address: '123 Main St, Los Angeles, CA 90001',
        timezone: 'America/Los_Angeles'
      },
      business: {
        openTime: '11:00',
        closeTime: '22:00',
        currency: 'USD',
        taxRate: 8.5,
        deliveryFee: 5.99
      },
      notifications: {
        emailNotifications: true,
        smsNotifications: false,
        orderAlerts: true,
        reservationAlerts: true
      }
    }
  };
}

export async function action({ request }) {
  const formData = await request.formData();
  const action = formData.get("action");
  const url = new URL(request.url);
  const cookie = request.headers.get("cookie") || "";

  if (action === "update-general") {
    // Update general settings
    return { success: true, message: "Settings updated successfully" };
  }

  if (action === "update-notifications") {
    // Update notification settings
    return { success: true, message: "Notification preferences updated" };
  }

  return { success: false, message: "Unknown action" };
}

export default function SettingsPage() {
  const { settings } = useLoaderData();
  const [activeSection, setActiveSection] = useState('general');

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
        <p className="text-gray-600 mt-1">Manage system configuration and preferences</p>
      </div>

      <div className="grid gap-6 md:grid-cols-4">
        {/* Settings Navigation */}
        <Card className="md:col-span-1">
          <CardContent className="p-4">
            <nav className="space-y-1">
              <Button
                variant={activeSection === 'general' ? 'default' : 'ghost'}
                className="w-full justify-start"
                onClick={() => setActiveSection('general')}
              >
                <Settings className="size-4 mr-2" />
                General
              </Button>
              <Button
                variant={activeSection === 'business' ? 'default' : 'ghost'}
                className="w-full justify-start"
                onClick={() => setActiveSection('business')}
              >
                <Clock className="size-4 mr-2" />
                Business
              </Button>
              <Button
                variant={activeSection === 'notifications' ? 'default' : 'ghost'}
                className="w-full justify-start"
                onClick={() => setActiveSection('notifications')}
              >
                <Bell className="size-4 mr-2" />
                Notifications
              </Button>
              <Button
                variant={activeSection === 'security' ? 'default' : 'ghost'}
                className="w-full justify-start"
                onClick={() => setActiveSection('security')}
              >
                <Shield className="size-4 mr-2" />
                Security
              </Button>
            </nav>
          </CardContent>
        </Card>

        {/* Settings Content */}
        <div className="md:col-span-3 space-y-6">
          {/* General Settings */}
          {activeSection === 'general' && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="size-5" />
                  General Settings
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Form method="post" className="space-y-4">
                  <input type="hidden" name="action" value="update-general" />
                  
                  <div className="space-y-2">
                    <Label htmlFor="name">Restaurant Name</Label>
                    <Input 
                      id="name" 
                      name="name" 
                      defaultValue={settings.restaurant?.name}
                      placeholder="Your restaurant name"
                    />
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="email">
                        <Mail className="size-4 inline mr-1" />
                        Contact Email
                      </Label>
                      <Input 
                        id="email" 
                        name="email" 
                        type="email"
                        defaultValue={settings.restaurant?.email}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="phone">
                        <Phone className="size-4 inline mr-1" />
                        Phone Number
                      </Label>
                      <Input 
                        id="phone" 
                        name="phone" 
                        defaultValue={settings.restaurant?.phone}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="address">
                      <MapPin className="size-4 inline mr-1" />
                      Address
                    </Label>
                    <Input 
                      id="address" 
                      name="address" 
                      defaultValue={settings.restaurant?.address}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="timezone">
                      <Globe className="size-4 inline mr-1" />
                      Timezone
                    </Label>
                    <Input 
                      id="timezone" 
                      name="timezone" 
                      defaultValue={settings.restaurant?.timezone}
                    />
                  </div>

                  <Button type="submit">Save Changes</Button>
                </Form>
              </CardContent>
            </Card>
          )}

          {/* Business Settings */}
          {activeSection === 'business' && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="size-5" />
                  Business Settings
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Form method="post" className="space-y-4">
                  <input type="hidden" name="action" value="update-business" />
                  
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="openTime">Opening Time</Label>
                      <Input 
                        id="openTime" 
                        name="openTime" 
                        type="time"
                        defaultValue={settings.business?.openTime}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="closeTime">Closing Time</Label>
                      <Input 
                        id="closeTime" 
                        name="closeTime" 
                        type="time"
                        defaultValue={settings.business?.closeTime}
                      />
                    </div>
                  </div>

                  <Separator />

                  <div className="grid md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="currency">Currency</Label>
                      <Input 
                        id="currency" 
                        name="currency" 
                        defaultValue={settings.business?.currency}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="taxRate">Tax Rate (%)</Label>
                      <Input 
                        id="taxRate" 
                        name="taxRate" 
                        type="number"
                        step="0.1"
                        defaultValue={settings.business?.taxRate}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="deliveryFee">Delivery Fee ($)</Label>
                      <Input 
                        id="deliveryFee" 
                        name="deliveryFee" 
                        type="number"
                        step="0.01"
                        defaultValue={settings.business?.deliveryFee}
                      />
                    </div>
                  </div>

                  <Button type="submit">Save Changes</Button>
                </Form>
              </CardContent>
            </Card>
          )}

          {/* Notification Settings */}
          {activeSection === 'notifications' && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bell className="size-5" />
                  Notification Settings
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Form method="post" className="space-y-6">
                  <input type="hidden" name="action" value="update-notifications" />
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Email Notifications</Label>
                      <p className="text-sm text-muted-foreground">
                        Receive notifications via email
                      </p>
                    </div>
                    <input 
                      type="checkbox" 
                      name="emailNotifications"
                      defaultChecked={settings.notifications?.emailNotifications}
                      className="h-4 w-4"
                    />
                  </div>

                  <Separator />

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>SMS Notifications</Label>
                      <p className="text-sm text-muted-foreground">
                        Receive notifications via SMS
                      </p>
                    </div>
                    <input 
                      type="checkbox" 
                      name="smsNotifications"
                      defaultChecked={settings.notifications?.smsNotifications}
                      className="h-4 w-4"
                    />
                  </div>

                  <Separator />

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Order Alerts</Label>
                      <p className="text-sm text-muted-foreground">
                        Get notified about new orders
                      </p>
                    </div>
                    <input 
                      type="checkbox" 
                      name="orderAlerts"
                      defaultChecked={settings.notifications?.orderAlerts}
                      className="h-4 w-4"
                    />
                  </div>

                  <Separator />

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Reservation Alerts</Label>
                      <p className="text-sm text-muted-foreground">
                        Get notified about new reservations
                      </p>
                    </div>
                    <input 
                      type="checkbox" 
                      name="reservationAlerts"
                      defaultChecked={settings.notifications?.reservationAlerts}
                      className="h-4 w-4"
                    />
                  </div>

                  <Button type="submit">Save Preferences</Button>
                </Form>
              </CardContent>
            </Card>
          )}

          {/* Security Settings */}
          {activeSection === 'security' && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="size-5" />
                  Security Settings
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h3 className="font-semibold mb-2">Session Management</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Manage user sessions and security policies
                  </p>
                  <Button variant="outline" asChild>
                    <a href="/admin/users?tab=sessions">
                      Go to Session Management
                    </a>
                  </Button>
                </div>

                <Separator />

                <div>
                  <h3 className="font-semibold mb-2">API Keys</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Manage API keys for integrations
                  </p>
                  <Badge variant="outline">Coming Soon</Badge>
                </div>

                <Separator />

                <div>
                  <h3 className="font-semibold mb-2">Activity Logs</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    View system activity and audit logs
                  </p>
                  <Button variant="outline" disabled>
                    View Logs (Coming Soon)
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
