import { useLoaderData, Form, redirect } from "react-router";
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Badge } from "../../components/ui/badge";
import { 
  Truck, 
  MapPin,
  Phone,
  Clock,
  CheckCircle,
  Navigation,
  Package,
  AlertCircle
} from "../../lib/lucide-shim.js";

export const meta = () => [
  { title: "Driver Dashboard - Cantina" },
];

export async function loader({ request }) {
  const url = new URL(request.url);
  const cookie = request.headers.get("cookie") || "";
  
  try {
    const authRes = await fetch(`${url.origin}/api/users/me`, {
      headers: { cookie }
    });
    
    if (!authRes.ok) {
      throw redirect("/login?redirect=/driver");
    }
    
    const authData = await authRes.json();
    const user = authData.data?.user;
    
    if (!user || user.role !== 'DRIVER') {
      throw redirect("/");
    }
    
    // Get driver's deliveries
    const deliveriesRes = await fetch(`${url.origin}/api/driver/deliveries`, {
      headers: { cookie }
    });
    
    if (deliveriesRes.ok) {
      const data = await deliveriesRes.json();
      return { 
        user,
        deliveries: data.data?.deliveries || []
      };
    }
  } catch (error) {
    if (error instanceof Response) throw error;
  }
  
  // Mock data
  return {
    user: { name: 'Driver', role: 'DRIVER' },
    deliveries: [
      {
        id: 'DEL-201',
        orderNumber: 'ORD-150',
        customer: 'John Smith',
        phone: '+1-555-0123',
        address: '123 Main St, Los Angeles, CA',
        items: 3,
        total: 45.99,
        status: 'ASSIGNED',
        priority: 'high',
        estimatedTime: 25,
        distance: '2.5 miles',
        createdAt: new Date(Date.now() - 5 * 60000).toISOString()
      },
      {
        id: 'DEL-200',
        orderNumber: 'ORD-149',
        customer: 'Jane Doe',
        phone: '+1-555-0124',
        address: '456 Oak Ave, Los Angeles, CA',
        items: 2,
        total: 28.50,
        status: 'IN_TRANSIT',
        priority: 'normal',
        estimatedTime: 15,
        distance: '1.8 miles',
        createdAt: new Date(Date.now() - 15 * 60000).toISOString()
      }
    ]
  };
}

export async function action({ request }) {
  const formData = await request.formData();
  const action = formData.get("action");
  
  if (action === "start-delivery") {
    return { success: true, message: "Delivery started" };
  }
  
  if (action === "complete-delivery") {
    return { success: true, message: "Delivery completed" };
  }
  
  return { success: false };
}

const getStatusColor = (status) => {
  switch (status) {
    case 'ASSIGNED': return 'bg-blue-100 text-blue-800';
    case 'IN_TRANSIT': return 'bg-orange-100 text-orange-800';
    case 'DELIVERED': return 'bg-green-100 text-green-800';
    default: return 'bg-gray-100 text-gray-800';
  }
};

const getTimeSince = (timeString) => {
  const mins = Math.floor((Date.now() - new Date(timeString)) / 60000);
  if (mins < 1) return 'Just now';
  return `${mins} mins ago`;
};

export default function DriverDashboard() {
  const { user, deliveries } = useLoaderData();
  const [filter, setFilter] = useState('active');

  const filteredDeliveries = deliveries.filter(delivery => {
    if (filter === 'active') {
      return delivery.status !== 'DELIVERED';
    }
    return delivery.status === 'DELIVERED';
  });

  const assignedCount = deliveries.filter(d => d.status === 'ASSIGNED').length;
  const inTransitCount = deliveries.filter(d => d.status === 'IN_TRANSIT').length;
  const completedToday = deliveries.filter(d => d.status === 'DELIVERED').length;

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-blue-100 p-3 rounded-lg">
              <Truck className="size-8 text-blue-600" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">Driver Dashboard</h1>
              <p className="text-gray-600">Welcome, {user.name}!</p>
            </div>
          </div>
          
          <Button variant="outline">
            <Navigation className="size-4 mr-2" />
            Open Maps
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4 mb-6">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-blue-600">{assignedCount}</div>
                <div className="text-sm text-gray-600">Assigned</div>
              </div>
              <Package className="size-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-orange-600">{inTransitCount}</div>
                <div className="text-sm text-gray-600">In Transit</div>
              </div>
              <Truck className="size-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-green-600">{completedToday}</div>
                <div className="text-sm text-gray-600">Completed Today</div>
              </div>
              <CheckCircle className="size-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold">${stats.todayTotal}</div>
                <div className="text-sm text-gray-600">Today's Deliveries</div>
              </div>
              <DollarSign className="size-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex gap-2 mb-6">
        <Button 
          variant={filter === 'active' ? 'default' : 'outline'}
          onClick={() => setFilter('active')}
        >
          Active Deliveries ({assignedCount + inTransitCount})
        </Button>
        <Button 
          variant={filter === 'completed' ? 'default' : 'outline'}
          onClick={() => setFilter('completed')}
        >
          Completed ({completedToday})
        </Button>
      </div>

      {/* Deliveries List */}
      <div className="space-y-4">
        {filteredDeliveries.map((delivery) => (
          <Card 
            key={delivery.id}
            className={delivery.priority === 'high' ? 'border-red-500 border-2' : ''}
          >
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    {delivery.orderNumber}
                    {delivery.priority === 'high' && (
                      <Badge variant="destructive">Urgent</Badge>
                    )}
                  </CardTitle>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                    <Clock className="size-3" />
                    {getTimeSince(delivery.createdAt)}
                    <span>• ETA: {delivery.estimatedTime} mins</span>
                  </div>
                </div>
                <Badge className={getStatusColor(delivery.status)}>
                  {delivery.status}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Customer Info */}
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <div className="text-sm font-medium mb-2">Customer</div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-sm">
                      <Package className="size-4 text-muted-foreground" />
                      <span>{delivery.customer}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Phone className="size-4 text-muted-foreground" />
                      <a href={`tel:${delivery.phone}`} className="text-blue-600 hover:underline">
                        {delivery.phone}
                      </a>
                    </div>
                  </div>
                </div>

                <div>
                  <div className="text-sm font-medium mb-2">Delivery Details</div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-sm">
                      <MapPin className="size-4 text-muted-foreground" />
                      <span className="text-sm">{delivery.distance}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <DollarSign className="size-4 text-muted-foreground" />
                      <span>{delivery.items} items • ${delivery.total}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Address */}
              <div className="bg-gray-50 p-3 rounded">
                <div className="text-xs text-gray-600 mb-1">Delivery Address</div>
                <div className="font-medium">{delivery.address}</div>
              </div>

              {/* Actions */}
              <div className="flex gap-2">
                <Form method="post" className="flex-1">
                  <input type="hidden" name="deliveryId" value={delivery.id} />
                  {delivery.status === 'ASSIGNED' && (
                    <Button 
                      type="submit" 
                      name="action" 
                      value="start-delivery"
                      className="w-full"
                    >
                      <Navigation className="size-4 mr-2" />
                      Start Delivery
                    </Button>
                  )}
                  {delivery.status === 'IN_TRANSIT' && (
                    <Button 
                      type="submit" 
                      name="action" 
                      value="complete-delivery"
                      className="w-full bg-green-600 hover:bg-green-700"
                    >
                      <CheckCircle className="size-4 mr-2" />
                      Mark Delivered
                    </Button>
                  )}
                </Form>
                
                <Button variant="outline" asChild>
                  <a href={`https://maps.google.com/?q=${encodeURIComponent(delivery.address)}`} target="_blank">
                    <MapPin className="size-4 mr-2" />
                    Navigate
                  </a>
                </Button>
                
                <Button variant="outline" asChild>
                  <a href={`tel:${delivery.phone}`}>
                    <Phone className="size-4" />
                  </a>
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredDeliveries.length === 0 && (
        <Card>
          <CardContent className="py-12 text-center">
            <CheckCircle className="size-12 mx-auto text-green-600 mb-4" />
            <h3 className="text-lg font-semibold mb-2">No Deliveries</h3>
            <p className="text-muted-foreground">
              {filter === 'active' ? 'All caught up! No active deliveries.' : 'No completed deliveries yet.'}
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
