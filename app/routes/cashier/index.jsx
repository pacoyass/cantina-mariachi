import { useLoaderData, Form, redirect, useOutletContext, useSubmit } from "react-router";
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Badge } from "../../components/ui/badge";
import { Input } from "../../components/ui/input";
import { Sidebar } from "../../components/cashier/Sidebar";
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
  ArrowRight,
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
    const preparingOrders = orders.filter(o => o.status === 'PREPARING');
    const readyOrders = orders.filter(o => o.status === 'READY');
    const outForDeliveryOrders = orders.filter(o => o.status === 'OUT_FOR_DELIVERY');
    const deliveredOrders = orders.filter(o => o.status === 'DELIVERED');

    return { 
      transactions: transactionsData?.data?.transactions || [],
      orders: transactionsData?.data?.orders || [],
      stats: transactionsData?.data?.stats || {},
      drivers: driversData?.data || [],
      pendingOrders,
      preparingOrders,
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
    // Confirm order (PENDING → PREPARING)
    if (action === "confirm-order") {
      const orderId = formData.get("orderId");
      const res = await fetch(`${url.origin}/api/cashier/orders/${orderId}/confirm`, {
        method: 'POST',
        headers: { cookie }
      });
      if (res.ok) {
        return { success: true, message: "Order confirmed and sent to kitchen" };
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

    // Mark order ready (PREPARING → READY)
    if (action === "mark-ready") {
      const orderId = formData.get("orderId");
      const res = await fetch(`${url.origin}/api/cashier/orders/${orderId}/ready`, {
        method: 'POST',
        headers: { cookie }
      });
      if (res.ok) {
        return { success: true, message: "Order marked ready for pickup" };
      }
      return { success: false, message: "Failed to mark order ready" };
    }

    // Assign driver (READY → OUT_FOR_DELIVERY)
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

    // Verify cash (DELIVERED → COMPLETED)
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
          notes: "COD verified by cashier"
        })
      });
      if (res.ok) {
        return { success: true, message: "Cash verified, order completed" };
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
    preparingOrders,
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
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <Sidebar user={user} />

      {/* Main Content */}
      <div className="flex-1 ml-64 overflow-y-auto">
        <div className="p-6">
          {/* Header */}
          <div className="mb-6">
            <h1 className="text-3xl font-bold">Order Coordinator Dashboard</h1>
            <p className="text-gray-600">Complete order workflow management - {user?.name}</p>
          </div>

          {/* Stats Cards */}
          <div className="grid gap-4 md:grid-cols-4 mb-6">
            <Card className="border-l-4 border-l-green-500">
              <CardContent className="pt-6">
                <div className="text-sm text-gray-600">Today's Revenue</div>
                <div className="text-2xl font-bold text-green-600">${stats.todayTotal?.toFixed(2) || '0.00'}</div>
                <div className="text-xs text-muted-foreground mt-1">
                  {stats.transactionCount || 0} completed orders
                </div>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-l-yellow-500">
              <CardContent className="pt-6">
                <div className="text-sm text-gray-600">Pending</div>
                <div className="text-2xl font-bold text-yellow-600">{pendingOrders?.length || 0}</div>
                <div className="text-xs text-muted-foreground mt-1">
                  Need confirmation
                </div>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-l-blue-500">
              <CardContent className="pt-6">
                <div className="text-sm text-gray-600">In Progress</div>
                <div className="text-2xl font-bold text-blue-600">
                  {(preparingOrders?.length || 0) + (readyOrders?.length || 0)}
                </div>
                <div className="text-xs text-muted-foreground mt-1">
                  Preparing + Ready
                </div>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-l-purple-500">
              <CardContent className="pt-6">
                <div className="text-sm text-gray-600">Out for Delivery</div>
                <div className="text-2xl font-bold text-purple-600">{outForDeliveryOrders?.length || 0}</div>
                <div className="text-xs text-muted-foreground mt-1">
                  Active deliveries
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Workflow Progress Bar */}
          <div className="mb-6 bg-white p-4 rounded-lg border">
            <h3 className="font-semibold mb-3">Order Workflow</h3>
            <div className="flex items-center gap-2 text-sm">
              <div className="flex items-center gap-1 px-3 py-1 bg-yellow-100 text-yellow-800 rounded">
                <Bell className="size-4" />
                <span>1. Confirm</span>
              </div>
              <ArrowRight className="size-4 text-gray-400" />
              <div className="flex items-center gap-1 px-3 py-1 bg-orange-100 text-orange-800 rounded">
                <ChefHat className="size-4" />
                <span>2. Kitchen</span>
              </div>
              <ArrowRight className="size-4 text-gray-400" />
              <div className="flex items-center gap-1 px-3 py-1 bg-green-100 text-green-800 rounded">
                <Package className="size-4" />
                <span>3. Ready</span>
              </div>
              <ArrowRight className="size-4 text-gray-400" />
              <div className="flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-800 rounded">
                <Truck className="size-4" />
                <span>4. Assign Driver</span>
              </div>
              <ArrowRight className="size-4 text-gray-400" />
              <div className="flex items-center gap-1 px-3 py-1 bg-purple-100 text-purple-800 rounded">
                <DollarSign className="size-4" />
                <span>5. Verify Cash</span>
              </div>
              <ArrowRight className="size-4 text-gray-400" />
              <div className="flex items-center gap-1 px-3 py-1 bg-gray-800 text-white rounded">
                <CheckCircle className="size-4" />
                <span>6. Complete</span>
              </div>
            </div>
          </div>

          {/* STEP 1: NEW ORDERS - Need Confirmation */}
          {pendingOrders && pendingOrders.length > 0 && (
            <Card className="mb-6 border-l-4 border-l-yellow-500">
              <CardHeader className="bg-yellow-50">
                <CardTitle className="flex items-center gap-2 text-yellow-800">
                  <Bell className="size-5 animate-pulse" />
                  STEP 1: New Orders ({pendingOrders.length})
                  <Badge variant="destructive" className="ml-2">{pendingOrders.length} PENDING</Badge>
                </CardTitle>
                <p className="text-sm text-yellow-700">Review and confirm to send to kitchen</p>
              </CardHeader>
              <CardContent className="pt-4">
                <div className="space-y-3">
                  {pendingOrders.map((order) => (
                    <div key={order.id} className="p-4 rounded-lg border-2 border-yellow-300 bg-white">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <div className="font-bold text-lg">Order #{order.orderNumber}</div>
                          <div className="text-sm text-muted-foreground">{order.customerName} - {order.customerPhone}</div>
                          <div className="text-xs text-muted-foreground mt-1">{order.deliveryAddress}</div>
                        </div>
                        <div className="text-right">
                          <div className="text-2xl font-bold text-green-600">${order.total?.toFixed(2)}</div>
                          <Badge variant="outline" className="mt-1">COD</Badge>
                        </div>
                      </div>

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
                            Confirm & Send to Kitchen
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

          {/* STEP 2: Kitchen is Preparing */}
          <Card className="mb-6 border-l-4 border-l-orange-500">
            <CardHeader className="bg-orange-50">
              <CardTitle className="flex items-center gap-2 text-orange-800">
                <ChefHat className="size-5" />
                STEP 2: Kitchen Preparing ({preparingOrders?.length || 0})
              </CardTitle>
              <p className="text-sm text-orange-700">Mark as ready when kitchen finishes</p>
            </CardHeader>
            <CardContent className="pt-4">
              {preparingOrders && preparingOrders.length > 0 ? (
                <div className="space-y-3">
                  {preparingOrders.map((order) => (
                    <div key={order.id} className="p-4 rounded-lg border-2 border-orange-200 bg-white flex items-center justify-between">
                      <div>
                        <div className="font-bold">Order #{order.orderNumber}</div>
                        <div className="text-sm text-muted-foreground">
                          {order.orderItems?.length || 0} items - ${order.total?.toFixed(2)} COD
                        </div>
                      </div>
                      <Form method="post">
                        <input type="hidden" name="action" value="mark-ready" />
                        <input type="hidden" name="orderId" value={order.id} />
                        <Button type="submit" size="sm" className="bg-green-600">
                          <Package className="size-4 mr-2" />
                          Mark Ready
                        </Button>
                      </Form>
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

          {/* STEP 3: Ready - Assign Driver */}
          <Card className="mb-6 border-l-4 border-l-green-500">
            <CardHeader className="bg-green-50">
              <CardTitle className="flex items-center gap-2 text-green-800">
                <Package className="size-5" />
                STEP 3: Ready for Pickup ({readyOrders?.length || 0})
              </CardTitle>
              <p className="text-sm text-green-700">Assign driver for delivery</p>
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
                          className="bg-blue-600"
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

          {/* STEP 4: Out for Delivery - Waiting for Driver Confirmation */}
          <Card className="mb-6 border-l-4 border-l-blue-500">
            <CardHeader className="bg-blue-50">
              <CardTitle className="flex items-center gap-2 text-blue-800">
                <Truck className="size-5" />
                STEP 4: Out for Delivery ({outForDeliveryOrders?.length || 0})
              </CardTitle>
              <p className="text-sm text-blue-700">Waiting for driver to confirm delivery</p>
            </CardHeader>
            <CardContent className="pt-4">
              {outForDeliveryOrders && outForDeliveryOrders.length > 0 ? (
                <div className="space-y-3">
                  {outForDeliveryOrders.map((order) => (
                    <div key={order.id} className="p-4 rounded-lg border-2 border-blue-200 bg-white">
                      <div className="flex items-start justify-between">
                        <div>
                          <div className="font-bold">Order #{order.orderNumber}</div>
                          <div className="text-sm text-muted-foreground">
                            Driver: {order.driver?.name || 'Unassigned'}
                          </div>
                          <div className="text-sm font-semibold text-green-600 mt-1">
                            To Collect: ${order.total?.toFixed(2)} cash
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

          {/* STEP 5: Verify Cash - Driver Returned */}
          {deliveredOrders && deliveredOrders.length > 0 && (
            <Card className="mb-6 border-l-4 border-l-purple-500">
              <CardHeader className="bg-purple-50">
                <CardTitle className="flex items-center gap-2 text-purple-800">
                  <DollarSign className="size-5" />
                  STEP 5: Verify Cash ({deliveredOrders.length})
                  <Badge variant="destructive" className="ml-2">{deliveredOrders.length} NEED VERIFICATION</Badge>
                </CardTitle>
                <p className="text-sm text-purple-700">Driver delivered and returned - count and verify cash</p>
              </CardHeader>
              <CardContent className="pt-4">
                <div className="space-y-3">
                  {deliveredOrders.map((order) => (
                    <div key={order.id} className="p-4 rounded-lg border-2 border-purple-300 bg-white">
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
                        <div className="flex-1">
                          <label className="text-sm text-gray-600">Count Cash:</label>
                          <Input 
                            type="number" 
                            name="amount" 
                            placeholder="Enter amount received" 
                            step="0.01"
                            defaultValue={order.total}
                            className="mt-1"
                          />
                        </div>
                        <Button type="submit" className="bg-green-600 hover:bg-green-700 mt-6">
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
      </div>
    </div>
  );
}
