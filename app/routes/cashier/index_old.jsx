import { useLoaderData, Form, redirect, useOutletContext, useSubmit } from "react-router";
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Badge } from "../../components/ui/badge";
import { Input } from "../../components/ui/input";
import { 
  DollarSign, 
  CreditCard,
  TrendingUp,
  Clock,
  CheckCircle,
  AlertCircle,
  Receipt,
  Bell,
  Plus,
  XCircle,
  Truck,
  ChefHat,
  Package,
} from "../../lib/lucide-shim.js";

export const meta = () => [
  { title: "Cashier Dashboard - Cantina" },
];

export async function loader({ request }) {
  const url = new URL(request.url);
  const cookie = request.headers.get("cookie") || "";
  
  try {
    // Get all delivery orders grouped by status
    const [transactionsRes, driversRes] = await Promise.all([
      fetch(`${url.origin}/api/cashier/transactions`, {
        headers: { cookie }
      }),
      fetch(`${url.origin}/api/cashier/drivers`, {
        headers: { cookie }
      })
    ]);

    const transactionsData = transactionsRes.ok ? await transactionsRes.json() : null;
    const driversData = driversRes.ok ? await driversRes.json() : null;

    // Group orders by status
    const orders = transactionsData?.data?.orders || [];
    
    const pendingOrders = orders.filter(o => o.status === 'PENDING');
    const confirmedOrders = orders.filter(o => o.status === 'CONFIRMED' || o.status === 'PREPARING');
    const readyOrders = orders.filter(o => o.status === 'READY');
    const outForDeliveryOrders = orders.filter(o => o.status === 'OUT_FOR_DELIVERY');
    const deliveredOrders = orders.filter(o => o.status === 'DELIVERED');

    return { 
      transactions: transactionsData?.data?.transactions || [],
      orders: transactionsData?.data?.orders || [],
      stats: transactionsData?.data?.stats || {},
      drivers: driversData?.data || [],
      pendingOrders,
      confirmedOrders,
      readyOrders,
      outForDeliveryOrders,
      deliveredOrders,
    };
  } catch (error) {
    console.error('Cashier loader error:', error);
    if (error instanceof Response) throw error;
    throw redirect("/login?redirect=/cashier");
  }
}

export async function action({ request }) {
  const url = new URL(request.url);
  const cookie = request.headers.get("cookie") || "";
  const formData = await request.formData();
  const action = formData.get("action");
  
  try {
    // Confirm order
    if (action === "confirm-order") {
      const orderId = formData.get("orderId");
      const res = await fetch(`${url.origin}/api/cashier/orders/${orderId}/confirm`, {
        method: 'POST',
        headers: { cookie }
      });
      if (res.ok) {
        return { success: true, message: "Order confirmed" };
      }
      return { success: false, message: "Failed to confirm order" };
    }

    // Reject order
    if (action === "reject-order") {
      const orderId = formData.get("orderId");
      const reason = formData.get("reason") || "Out of stock / Kitchen closed";
      const res = await fetch(`${url.origin}/api/cashier/orders/${orderId}/reject`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          cookie 
        },
        body: JSON.stringify({ reason })
      });
      if (res.ok) {
        return { success: true, message: "Order rejected" };
      }
      return { success: false, message: "Failed to reject order" };
    }

    // Mark order ready
    if (action === "mark-ready") {
      const orderId = formData.get("orderId");
      const res = await fetch(`${url.origin}/api/cashier/orders/${orderId}/ready`, {
        method: 'POST',
        headers: { cookie }
      });
      if (res.ok) {
        return { success: true, message: "Order marked ready" };
      }
      return { success: false, message: "Failed to mark order ready" };
    }

    // Assign driver
    if (action === "assign-driver") {
      const orderId = formData.get("orderId");
      const driverId = formData.get("driverId");
      const res = await fetch(`${url.origin}/api/cashier/orders/${orderId}/assign-driver`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          cookie 
        },
        body: JSON.stringify({ driverId })
      });
      if (res.ok) {
        return { success: true, message: "Driver assigned" };
      }
      return { success: false, message: "Failed to assign driver" };
    }

    // Verify cash
    if (action === "verify-cash") {
      const orderId = formData.get("orderId");
      const amount = formData.get("amount");
      const res = await fetch(`${url.origin}/api/cashier/payments`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          cookie 
        },
        body: JSON.stringify({
          orderId,
          paymentMethod: "CASH",
          amount: parseFloat(amount),
          notes: "Cash verified by cashier"
        })
      });
      if (res.ok) {
        return { success: true, message: "Cash verified" };
      }
      return { success: false, message: "Failed to verify cash" };
    }
    
    return { success: false, message: "Unknown action" };
  } catch (error) {
    console.error('Cashier action error:', error);
    return { success: false, message: "Action failed" };
  }
}

export default function CashierDashboard() {
  const loaderData = useLoaderData();
  const { user } = useOutletContext();
  const submit = useSubmit();
  const { 
    stats, 
    drivers,
    pendingOrders,
    confirmedOrders,
    readyOrders,
    outForDeliveryOrders,
    deliveredOrders
  } = loaderData;

  const [selectedDriver, setSelectedDriver] = useState({});

  const handleDriverAssign = (orderId, driverId) => {
    const formData = new FormData();
    formData.append("action", "assign-driver");
    formData.append("orderId", orderId);
    formData.append("driverId", driverId);
    submit(formData, { method: "post" });
  };

  return (
    <div className="min-h-screen p-4 bg-gray-50">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-green-600 dark:bg-green-100 p-3 rounded-lg">
              <DollarSign className="size-8 text-green-100 dark:text-green-600" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">Cashier Dashboard</h1>
              <p className="text-gray-600">Central Order Coordinator - {user?.name}</p>
            </div>
          </div>
          
          <Form method="post">
            <input type="hidden" name="action" value="end-shift" />
            <Button variant="outline">
              <Receipt className="size-4 mr-2" />
              End Shift Report
            </Button>
          </Form>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4 mb-6">
        <Card className="border-4 bg-gray-100/30 backdrop-blur-sm dark:supports-[backdrop-filter]:bg-background/30">
          <CardContent className="pt-6">
            <div className="text-sm text-gray-600">Today's Total</div>
            <div className="text-2xl font-bold text-green-600">${stats.todayTotal?.toFixed(2) || '0.00'}</div>
            <div className="text-xs text-muted-foreground mt-1">
              {stats.transactionCount || 0} orders
            </div>
          </CardContent>
        </Card>

        <Card className="border-4 bg-gray-100/30 backdrop-blur-sm dark:supports-[backdrop-filter]:bg-background/30">
          <CardContent className="pt-6">
            <div className="text-sm text-gray-600">Cash Collected</div>
            <div className="text-2xl font-bold">${stats.cashTotal?.toFixed(2) || '0.00'}</div>
            <div className="text-xs text-muted-foreground mt-1">
              COD deliveries
            </div>
          </CardContent>
        </Card>

        <Card className="border-4 bg-gray-100/30 backdrop-blur-sm dark:supports-[backdrop-filter]:bg-background/30">
          <CardContent className="pt-6">
            <div className="text-sm text-gray-600">Active Orders</div>
            <div className="text-2xl font-bold">{(pendingOrders?.length || 0) + (confirmedOrders?.length || 0) + (readyOrders?.length || 0)}</div>
            <div className="text-xs text-muted-foreground mt-1">
              Need attention
            </div>
          </CardContent>
        </Card>

        <Card className="border-4 bg-gray-100/30 backdrop-blur-sm dark:supports-[backdrop-filter]:bg-background/30">
          <CardContent className="pt-6">
            <div className="text-sm text-gray-600">Out for Delivery</div>
            <div className="text-2xl font-bold">{outForDeliveryOrders?.length || 0}</div>
            <div className="text-xs text-muted-foreground mt-1">
              In progress
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 🔔 NEW ORDERS - Need Confirmation */}
      {pendingOrders && pendingOrders.length > 0 && (
        <Card className="border-4 bg-yellow-50 border-yellow-300 mb-6">
          <CardHeader className="bg-yellow-100">
            <CardTitle className="flex items-center gap-2 text-yellow-800">
              <Bell className="size-5 animate-pulse" />
              🔔 NEW ORDERS - Need Confirmation ({pendingOrders.length})
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-4">
            <div className="space-y-3">
              {pendingOrders.map((order) => (
                <div key={order.id} className="p-4 rounded-lg border-2 border-yellow-300 bg-white">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <div className="font-bold text-lg">Order #{order.orderNumber}</div>
                      <div className="text-sm text-muted-foreground">{order.customerName} - {order.customerPhone}</div>
                      <div className="text-xs text-muted-foreground mt-1">
                        {order.deliveryAddress}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-green-600">${order.total?.toFixed(2)}</div>
                      <Badge variant="outline" className="mt-1">{order.type}</Badge>
                    </div>
                  </div>

                  {/* Order Items */}
                  {order.orderItems && order.orderItems.length > 0 && (
                    <div className="mb-3 space-y-1 bg-gray-50 p-2 rounded text-sm">
                      {order.orderItems.map((item) => (
                        <div key={item.id} className="flex justify-between">
                          <span>{item.quantity}x {item.menuItem?.name}</span>
                          <span>${(item.price * item.quantity).toFixed(2)}</span>
                        </div>
                      ))}
                    </div>
                  )}

                  <div className="flex gap-2 mt-3">
                    <Form method="post" className="flex-1">
                      <input type="hidden" name="action" value="confirm-order" />
                      <input type="hidden" name="orderId" value={order.id} />
                      <Button type="submit" className="w-full bg-green-600 hover:bg-green-700">
                        <CheckCircle className="size-4 mr-2" />
                        Confirm Order
                      </Button>
                    </Form>
                    <Form method="post">
                      <input type="hidden" name="action" value="reject-order" />
                      <input type="hidden" name="orderId" value={order.id} />
                      <Button type="submit" variant="destructive">
                        <XCircle className="size-4 mr-2" />
                        Reject
                      </Button>
                    </Form>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* ⏳ CONFIRMED - Kitchen is Cooking */}
      <Card className="border-4 bg-gray-100/30 backdrop-blur-sm dark:supports-[backdrop-filter]:bg-background/30 mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ChefHat className="size-5" />
            ⏳ CONFIRMED - Kitchen is Cooking ({confirmedOrders?.length || 0})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {confirmedOrders && confirmedOrders.length > 0 ? (
            <div className="space-y-3">
              {confirmedOrders.map((order) => (
                <div key={order.id} className="p-4 rounded-lg border-2 bg-white">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="font-bold">Order #{order.orderNumber}</div>
                      <div className="text-sm text-muted-foreground">
                        {order.orderItems?.length || 0} items - ${order.total?.toFixed(2)}
                      </div>
                    </div>
                    <Form method="post">
                      <input type="hidden" name="action" value="mark-ready" />
                      <input type="hidden" name="orderId" value={order.id} />
                      <Button type="submit" size="sm">
                        <Package className="size-4 mr-2" />
                        Mark Ready
                      </Button>
                    </Form>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-6 text-muted-foreground">
              No orders being prepared
            </div>
          )}
        </CardContent>
      </Card>

      {/* ✅ READY - Assign Driver */}
      <Card className="border-4 bg-green-50 border-green-300 mb-6">
        <CardHeader className="bg-green-100">
          <CardTitle className="flex items-center gap-2 text-green-800">
            <Package className="size-5" />
            ✅ READY - Assign Driver ({readyOrders?.length || 0})
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-4">
          {readyOrders && readyOrders.length > 0 ? (
            <div className="space-y-3">
              {readyOrders.map((order) => (
                <div key={order.id} className="p-4 rounded-lg border-2 border-green-300 bg-white">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <div className="font-bold">Order #{order.orderNumber}</div>
                      <div className="text-sm text-muted-foreground">{order.deliveryAddress}</div>
                      <div className="text-lg font-bold text-green-600 mt-1">
                        Collect: ${order.total?.toFixed(2)} CASH
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-2 items-center">
                    <select 
                      className="flex-1 border rounded px-3 py-2"
                      value={selectedDriver[order.id] || ''}
                      onChange={(e) => setSelectedDriver({...selectedDriver, [order.id]: e.target.value})}
                    >
                      <option value="">Select Driver</option>
                      {drivers && drivers.map((driver) => (
                        <option key={driver.id} value={driver.id}>
                          {driver.name} ({driver.activeDeliveries || 0} active)
                        </option>
                      ))}
                    </select>
                    <Button 
                      onClick={() => handleDriverAssign(order.id, selectedDriver[order.id])}
                      disabled={!selectedDriver[order.id]}
                    >
                      <Truck className="size-4 mr-2" />
                      Assign
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-6 text-muted-foreground">
              No orders ready for pickup
            </div>
          )}
        </CardContent>
      </Card>

      {/* 🚗 OUT FOR DELIVERY - Active */}
      <Card className="border-4 bg-gray-100/30 backdrop-blur-sm dark:supports-[backdrop-filter]:bg-background/30 mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Truck className="size-5" />
            🚗 OUT FOR DELIVERY - Active ({outForDeliveryOrders?.length || 0})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {outForDeliveryOrders && outForDeliveryOrders.length > 0 ? (
            <div className="space-y-3">
              {outForDeliveryOrders.map((order) => (
                <div key={order.id} className="p-4 rounded-lg border-2 bg-white">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="font-bold">Order #{order.orderNumber}</div>
                      <div className="text-sm text-muted-foreground">
                        Driver: {order.driver?.name || 'Unassigned'}
                      </div>
                      <div className="text-sm font-semibold text-green-600 mt-1">
                        Collect: ${order.total?.toFixed(2)} cash
                      </div>
                    </div>
                    <Badge className="bg-blue-600">OUT FOR DELIVERY</Badge>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-6 text-muted-foreground">
              No active deliveries
            </div>
          )}
        </CardContent>
      </Card>

      {/* 💰 VERIFY CASH - Driver Returned */}
      {deliveredOrders && deliveredOrders.length > 0 && (
        <Card className="border-4 bg-orange-50 border-orange-300 mb-6">
          <CardHeader className="bg-orange-100">
            <CardTitle className="flex items-center gap-2 text-orange-800">
              <DollarSign className="size-5" />
              💰 VERIFY CASH - Driver Returned ({deliveredOrders.length})
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-4">
            <div className="space-y-3">
              {deliveredOrders.map((order) => (
                <div key={order.id} className="p-4 rounded-lg border-2 border-orange-300 bg-white">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <div className="font-bold">Order #{order.orderNumber}</div>
                      <div className="text-sm text-muted-foreground">
                        Driver: {order.driver?.name}
                      </div>
                      <div className="text-lg font-bold text-green-600 mt-1">
                        Expected: ${order.total?.toFixed(2)}
                      </div>
                    </div>
                  </div>

                  <Form method="post" className="flex gap-2 items-center">
                    <input type="hidden" name="action" value="verify-cash" />
                    <input type="hidden" name="orderId" value={order.id} />
                    <Input 
                      type="number" 
                      name="amount" 
                      placeholder="Count cash" 
                      step="0.01"
                      defaultValue={order.total}
                      className="flex-1"
                    />
                    <Button type="submit" className="bg-green-600 hover:bg-green-700">
                      <CheckCircle className="size-4 mr-2" />
                      Verify & Complete
                    </Button>
                  </Form>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
