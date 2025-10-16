import { useLoaderData, Form, redirect, useOutletContext } from "react-router";
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
} from "../../lib/lucide-shim.js";

export const meta = () => [
  { title: "Cashier Dashboard - Cantina" },
];

export async function loader({ request }) {
  const url = new URL(request.url);
  const cookie = request.headers.get("cookie") || "";
  
  try {

    // Get cashier data
    const cashRes = await fetch(`${url.origin}/api/cashier/transactions`, {
      headers: { cookie }
    });
    if (!cashRes.ok) {
      // Fallback
  return {
    transactions: [],
    orders: [],
    stats: { todayTotal: 0, transactionCount: 0, cashTotal: 0, cardTotal: 0, avgTransaction: 0 }
  }; 
    }
      const data = await cashRes.json();
      console.log("cashier res...",data);
      
      return { 
        transactions: data.data?.transactions || [],
        orders: data.data?.orders || [],
        stats: data.data?.stats || {}
      };
   
    
     
   
  } catch (error) {
    if (error instanceof Response) throw error;
    console.error('Cashier loader error:', error);
    throw redirect("/login?redirect=/cashier");
  }
}

export async function action({ request }) {
  const url = new URL(request.url);
  const cookie = request.headers.get("cookie") || "";
  const formData = await request.formData();
  const action = formData.get("action");
  
  try {
    if (action === "process-payment") {
      const orderId = formData.get("orderId");
      const paymentMethod = formData.get("paymentMethod");
      const amount = formData.get("amount");
      const notes = formData.get("notes");

      const res = await fetch(`${url.origin}/api/cashier/payments`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          cookie 
        },
        body: JSON.stringify({
          orderId,
          paymentMethod,
          amount: parseFloat(amount),
          notes
        })
      });

      if (res.ok) {
        return { success: true, message: "Payment processed successfully" };
      }
      const error = await res.json();
      return { success: false, message: error.error?.message || "Failed to process payment" };
    }
    
    if (action === "end-shift") {
      const res = await fetch(`${url.origin}/api/cashier/shift/end`, {
        method: 'POST',
        headers: { cookie }
      });

      if (res.ok) {
        const data = await res.json();
        return { success: true, message: "Shift ended successfully", report: data.data };
      }
      return { success: false, message: "Failed to end shift" };
    }
    
    return { success: false, message: "Unknown action" };
  } catch (error) {
    console.error('Cashier action error:', error);
    return { success: false, message: "Action failed" };
  }
}

const getPaymentIcon = (method) => {
  return method === 'CARD' ? <CreditCard className="size-4" /> : <DollarSign className="size-4" />;
};

export default function CashierDashboard({loaderData,actionData}) {
  const { transactions, stats, orders } = loaderData;
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [activeTab, setActiveTab] = useState('orders');
  const {user}=useOutletContext();

  const pendingTransactions = transactions?.filter(t => t.status === 'PENDING') || [];
  const pendingOrders = orders?.filter(o => ['AWAITING_PAYMENT', 'READY','COMPLETED','PAYMENT_DISPUTED','PREPARING'].includes(o.status)) || [];
console.log("cashier transactions...",orders);

  return (
    <div className="min-h-screen p-4">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-green-600 dark:bg-green-100 p-3 rounded-lg">
              <DollarSign className="size-8 text-green-100 dark:text-green-600" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">Cashier Dashboard</h1>
              <p className="text-gray-600">Welcome, {user?.name}!</p>
            </div>
          </div>
          
          <Button variant="outline">
            <Receipt className="size-4 mr-2" />
            End Shift Report
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4 mb-6">
        <Card className="border-4 bg-gray-100/30 backdrop-blur-sm dark:supports-[backdrop-filter]:bg-background/30">
          <CardContent className="pt-6">
            <div className="text-sm text-gray-600">Today's Total</div>
            <div className="text-2xl font-bold text-green-600">${stats.todayTotal?.toFixed(2) || '0.00'}</div>
            <div className="text-xs text-muted-foreground mt-1">
              {stats.transactionCount || 0} transactions
            </div>
          </CardContent>
        </Card>

        <Card className="border-4 bg-gray-100/30 backdrop-blur-sm dark:supports-[backdrop-filter]:bg-background/30">
          <CardContent className="pt-6">
            <div className="text-sm text-gray-600">Cash</div>
            <div className="text-2xl font-bold">${stats.cashTotal?.toFixed(2) || '0.00'}</div>
            <div className="text-xs text-muted-foreground mt-1">
              {stats.todayTotal > 0 ? Math.round((stats.cashTotal / stats.todayTotal) * 100) : 0}% of total
            </div>
          </CardContent>
        </Card>
        <Card className="border-4 bg-gray-100/30 backdrop-blur-sm dark:supports-[backdrop-filter]:bg-background/30">
          <CardContent className="pt-6">
            <div className="text-sm text-gray-600">Card Payments</div>
            <div className="text-2xl font-bold">${stats.cardTotal?.toFixed(2) || '0.00'}</div>
            <div className="text-xs text-muted-foreground mt-1">
              {stats.todayTotal > 0 ? Math.round((stats.cardTotal / stats.todayTotal) * 100) : 0}% of total
            </div>
          </CardContent>
        </Card>

        <Card className="border-4 bg-gray-100/30 backdrop-blur-sm dark:supports-[backdrop-filter]:bg-background/30">
          <CardContent className="pt-6">
            <div className="text-sm text-gray-600">Avg Transaction</div>
            <div className="text-2xl font-bold">${stats.avgTransaction?.toFixed(2) || '0.00'}</div>
            <div className="text-xs text-muted-foreground mt-1">
              per order
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs for Orders vs Transactions */}
      <div className="flex gap-2 mb-6">
        <Button 
          variant={activeTab === 'orders' ? 'default' : 'outline'}
          onClick={() => setActiveTab('orders')}
        >
          <DollarSign className="size-4 mr-2" />
          Orders Awaiting Payment
          {orders.length > 0 && (
            <Badge variant="destructive" className="ml-2">
              {orders.length}
            </Badge>
          )}
        </Button>
        <Button 
          variant={activeTab === 'transactions' ? 'default' : 'outline'}
          onClick={() => setActiveTab('transactions')}
        >
          <Receipt className="size-4 mr-2" />
          Transactions History
        </Button>
      </div>

      {/* Orders Section */}
      {activeTab === 'orders' && (
        <Card className="border-4 bg-gray-100/30 backdrop-blur-sm dark:supports-[backdrop-filter]:bg-background/30">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="size-5" />
              Orders Awaiting Payment
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {orders && orders.length > 0 ? (
                orders.map((order) => (
                  <div key={order.id} className="p-4 rounded-lg border-4 bg-gray-200/30 backdrop-blur-sm dark:supports-[backdrop-filter]:bg-background/30">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <div className="font-bold text-lg">Order #{order.orderNumber}</div>
                        <div className="text-sm text-muted-foreground">{order.customerName}</div>
                        <div className="text-xs text-muted-foreground flex items-center gap-2 mt-1">
                          <Badge variant="outline" className="text-xs">{order.type}</Badge>
                          {order.tableNumber && <span>Table {order.tableNumber}</span>}
                        </div>
                      </div>
                      <Badge className={order.status === 'AWAITING_PAYMENT' ? 'bg-orange-100 text-orange-800' : 'bg-green-100 text-green-800'}>
                        {order.status}
                      </Badge>
                    </div>

                    {/* Order Items */}
                    {order.orderItems && order.orderItems.length > 0 && (
                      <div className="mb-3 space-y-1 bg-white/50 p-2 rounded">
                        {order.orderItems.map((item) => (
                          <div key={item.id} className="text-sm flex justify-between">
                            <span>{item.quantity}x {item.menuItem?.name}</span>
                            <span>${(item.price * item.quantity).toFixed(2)}</span>
                          </div>
                        ))}
                      </div>
                    )}

                    <div className="flex items-center justify-between pt-3 border-t">
                      <div>
                        <div className="text-sm text-muted-foreground">Total Amount</div>
                        <div className="text-2xl font-bold text-green-600">${order.total?.toFixed(2)}</div>
                      </div>

                      <div className="flex gap-2">
                        <Form method="post">
                          <input type="hidden" name="action" value="process-payment" />
                          <input type="hidden" name="orderId" value={order.id} />
                          <input type="hidden" name="paymentMethod" value="CASH" />
                          <input type="hidden" name="amount" value={order.total} />
                          <Button size="sm" variant="outline">
                            <DollarSign className="size-4 mr-1" />
                            Cash
                          </Button>
                        </Form>
                        <Form method="post">
                          <input type="hidden" name="action" value="process-payment" />
                          <input type="hidden" name="orderId" value={order.id} />
                          <input type="hidden" name="paymentMethod" value="CARD" />
                          <input type="hidden" name="amount" value={order.total} />
                          <Button size="sm">
                            <CreditCard className="size-4 mr-1" />
                            Card
                          </Button>
                        </Form>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <div className="bg-green-600 dark:bg-green-100 p-3 rounded-lg">
                    <CheckCircle className="size-8 text-green-100 dark:text-green-600" />
                  </div>
                  <h3 className="font-semibold text-lg mb-2">All Caught Up!</h3>
                  <p className="text-muted-foreground max-w-sm">
                    No orders waiting for payment at the moment.
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Recent Transactions */}
      {activeTab === 'transactions' && (
        <Card className="border-4 h-full min-h-max bg-gray-100/30 backdrop-blur-sm dark:supports-[backdrop-filter]:bg-background/30">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Receipt className="size-5" />
              Recent Transactions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {transactions && transactions.length > 0 ? (
                transactions.map((txn) => (
                  <div key={txn.id} className="flex items-center  justify-between p-3 rounded-lg border-4 bg-gray-200/30 backdrop-blur-sm dark:supports-[backdrop-filter]:bg-background/30">
                    <div className="flex items-center gap-3">
                      {getPaymentIcon(txn.paymentMethod)}
                      <div>
                        <div className="font-medium">{txn.orderId}</div>
                        <div className="text-sm text-muted-foreground">{txn.customer}</div>
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <div className="font-semibold">${txn.amount}</div>
                      <div className="flex items-center gap-2">
                        <Badge 
                          variant={txn.status === 'COMPLETED' ? 'default' : 'secondary'}
                          className="text-xs"
                        >
                          {txn.status}
                        </Badge>
                      </div>
                    </div>

                    {txn.status === 'PENDING' && (
                      <Form method="post">
                        <input type="hidden" name="action" value="process-payment" />
                        <input type="hidden" name="transactionId" value={txn.id} />
                        <Button size="sm">Process Payment</Button>
                      </Form>
                    )}
                  </div>
                ))
              ) : (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <div className="bg-green-600 dark:bg-green-100 p-3 rounded-lg">
                    <Receipt className="size-8 text-green-100 dark:text-green-600" />
                  </div>
                 
                  <h3 className="font-semibold text-lg mb-2">No transactions yet</h3>
                  <p className="text-muted-foreground max-w-sm mb-6">
                    Your recent transactions will appear here once you start processing payments.
                  </p>
                  <Button>
                    <Plus className="size-4 mr-2" />
                    Create Transaction
                  </Button>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
