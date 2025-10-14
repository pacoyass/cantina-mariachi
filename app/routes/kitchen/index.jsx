import { useLoaderData, Form, redirect } from "react-router";
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Badge } from "../../components/ui/badge";
import { Separator } from "../../components/ui/separator";
import { 
  ChefHat, 
  Clock, 
  CheckCircle, 
  AlertCircle,
  Utensils,
  Truck,
  Home
} from "../../lib/lucide-shim.js";

export const meta = () => [
  { title: "Kitchen Dashboard - Cantina" },
];

export async function loader({ request }) {
  const url = new URL(request.url);
  const cookie = request.headers.get("cookie") || "";
  
  try {
    // Check auth and role
    const authRes = await fetch(`${url.origin}/api/users/me`, {
      headers: { cookie }
    });
    
    if (!authRes.ok) {
      throw redirect("/login?redirect=/kitchen");
    }
    
    const authData = await authRes.json();
    const user = authData.data?.user;
    
    if (!user || user.role !== 'COOK') {
      throw redirect("/");
    }
    
    // Get kitchen orders from real API
    const ordersRes = await fetch(`${url.origin}/api/kitchen/orders`, {
      headers: { cookie }
    });
    
    if (ordersRes.ok) {
      const data = await ordersRes.json();
      return { 
        user,
        orders: data.data?.orders || [],
        stats: data.data?.stats || { pending: 0, preparing: 0, ready: 0, avgTime: 0 }
      };
    }
    
    // Fallback if API fails
    return {
      user,
      orders: [],
      stats: { pending: 0, preparing: 0, ready: 0, avgTime: 0 }
    };
  } catch (error) {
    if (error instanceof Response) throw error;
    console.error('Kitchen loader error:', error);
    throw redirect("/login?redirect=/kitchen");
  }
}

// REMOVED MOCK DATA - Now uses real API

export async function action({ request }) {
  const url = new URL(request.url);
  const cookie = request.headers.get("cookie") || "";
  const formData = await request.formData();
  const action = formData.get("action");
  const orderId = formData.get("orderId");
  
  try {
    if (action === "start-preparing") {
      const res = await fetch(`${url.origin}/api/kitchen/orders/${orderId}/start-preparing`, {
        method: 'POST',
        headers: { cookie }
      });
      
      if (res.ok) {
        return { success: true, message: "Started preparing order" };
      }
      const error = await res.json();
      return { success: false, message: error.error?.message || "Failed to start preparing" };
    }
    
    if (action === "mark-ready") {
      const res = await fetch(`${url.origin}/api/kitchen/orders/${orderId}/mark-ready`, {
        method: 'POST',
        headers: { cookie }
      });
      
      if (res.ok) {
        return { success: true, message: "Order marked as ready" };
      }
      const error = await res.json();
      return { success: false, message: error.error?.message || "Failed to mark ready" };
    }
    
    return { success: false, message: "Unknown action" };
  } catch (error) {
    console.error('Kitchen action error:', error);
    return { success: false, message: "Action failed" };
  }
}

const getTimeSince = (timeString) => {
  const mins = Math.floor((Date.now() - new Date(timeString)) / 60000);
  if (mins < 1) return 'Just now';
  if (mins === 1) return '1 min ago';
  return `${mins} mins ago`;
};

const getOrderTypeIcon = (type) => {
  switch (type) {
    case 'DELIVERY': return <Truck className="size-4" />;
    case 'PICKUP': return <Home className="size-4" />;
    default: return <Utensils className="size-4" />;
  }
};

export default function KitchenDashboard() {
  const { user, orders, stats } = useLoaderData();
  const [filter, setFilter] = useState('all');

  const filteredOrders = orders.filter(order => {
    if (filter === 'all') return true;
    return order.status.toLowerCase() === filter.toLowerCase();
  });

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-orange-100 p-3 rounded-lg">
              <ChefHat className="size-8 text-orange-600" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">Kitchen Dashboard</h1>
              <p className="text-gray-600">Welcome, {user.name}!</p>
            </div>
          </div>
          
          {/* Stats */}
          <div className="flex gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-red-600">{stats.pending}</div>
              <div className="text-xs text-gray-600">Pending</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">{stats.preparing}</div>
              <div className="text-xs text-gray-600">Preparing</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{stats.ready}</div>
              <div className="text-xs text-gray-600">Ready</div>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-2 mb-6">
        <Button 
          variant={filter === 'all' ? 'default' : 'outline'}
          onClick={() => setFilter('all')}
        >
          All Orders
        </Button>
        <Button 
          variant={filter === 'confirmed' ? 'default' : 'outline'}
          onClick={() => setFilter('confirmed')}
        >
          New ({stats.pending})
        </Button>
        <Button 
          variant={filter === 'preparing' ? 'default' : 'outline'}
          onClick={() => setFilter('preparing')}
        >
          In Progress ({stats.preparing})
        </Button>
      </div>

      {/* Orders Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filteredOrders.map((order) => (
          <Card key={order.id} className={`${order.priority === 'high' ? 'border-red-500 border-2' : ''}`}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg flex items-center gap-2">
                  {getOrderTypeIcon(order.type)}
                  {order.orderNumber}
                </CardTitle>
                <div className="flex items-center gap-2">
                  {order.priority === 'high' && (
                    <Badge variant="destructive">Urgent</Badge>
                  )}
                  <Badge variant={order.status === 'PREPARING' ? 'default' : 'secondary'}>
                    {order.status}
                  </Badge>
                </div>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Clock className="size-3" />
                {getTimeSince(order.orderTime)}
                {order.table && <span>• Table {order.table}</span>}
              </div>
            </CardHeader>
            <CardContent>
              {/* Items */}
              <div className="space-y-3 mb-4">
                {(order.orderItems || order.items || []).map((item, idx) => (
                  <div key={idx}>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="font-medium">
                          {item.quantity}x {item.menuItem?.name || item.name}
                        </div>
                        {item.notes && (
                          <div className="text-sm text-orange-600 mt-1">
                            <AlertCircle className="size-3 inline mr-1" />
                            {item.notes}
                          </div>
                        )}
                      </div>
                    </div>
                    {idx < (order.orderItems || order.items || []).length - 1 && <Separator className="mt-2" />}
                  </div>
                ))}
              </div>

              {/* Actions */}
              <Form method="post" className="flex gap-2">
                <input type="hidden" name="orderId" value={order.id} />
                {order.status === 'CONFIRMED' && (
                  <Button 
                    type="submit" 
                    name="action" 
                    value="start-preparing"
                    className="flex-1"
                  >
                    Start Preparing
                  </Button>
                )}
                {order.status === 'PREPARING' && (
                  <Button 
                    type="submit" 
                    name="action" 
                    value="mark-ready"
                    variant="default"
                    className="flex-1 bg-green-600 hover:bg-green-700"
                  >
                    <CheckCircle className="size-4 mr-2" />
                    Mark Ready
                  </Button>
                )}
              </Form>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredOrders.length === 0 && (
        <Card>
          <CardContent className="py-12 text-center">
            <CheckCircle className="size-12 mx-auto text-green-600 mb-4" />
            <h3 className="text-lg font-semibold mb-2">All Caught Up!</h3>
            <p className="text-muted-foreground">No orders in this queue</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
