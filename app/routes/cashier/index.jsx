import { useLoaderData, Form, redirect } from "react-router";
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
  Receipt
} from "../../lib/lucide-shim.js";

export const meta = () => [
  { title: "Cashier Dashboard - Cantina" },
];

export async function loader({ request }) {
  const url = new URL(request.url);
  const cookie = request.headers.get("cookie") || "";
  
  try {
    const authRes = await fetch(`${url.origin}/api/users/me`, {
      headers: { cookie }
    });
    
    if (!authRes.ok) {
      throw redirect("/login?redirect=/cashier");
    }
    
    const authData = await authRes.json();
    const user = authData.data?.user;
    
    if (!user || user.role !== 'CASHIER') {
      throw redirect("/");
    }
    
    // Get cashier data
    const cashRes = await fetch(`${url.origin}/api/cashier/transactions`, {
      headers: { cookie }
    });
    
    if (cashRes.ok) {
      const data = await cashRes.json();
      return { 
        user,
        transactions: data.data?.transactions || [],
        stats: data.data?.stats || {}
      };
    }
  } catch (error) {
    if (error instanceof Response) throw error;
  }
  
  // Mock data
  return {
    user: { name: 'Cashier', role: 'CASHIER' },
    transactions: [
      {
        id: 'TXN-501',
        orderId: 'ORD-101',
        amount: 45.99,
        paymentMethod: 'CARD',
        status: 'PENDING',
        customer: 'John Doe',
        time: new Date().toISOString()
      },
      {
        id: 'TXN-500',
        orderId: 'ORD-100',
        amount: 32.50,
        paymentMethod: 'CASH',
        status: 'COMPLETED',
        customer: 'Jane Smith',
        time: new Date(Date.now() - 15 * 60000).toISOString()
      }
    ],
    stats: {
      todayTotal: 1240.50,
      transactionCount: 45,
      cashTotal: 380.25,
      cardTotal: 860.25,
      avgTransaction: 27.57
    }
  };
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

export default function CashierDashboard() {
  const { user, transactions, stats } = useLoaderData();
  const [showPaymentModal, setShowPaymentModal] = useState(false);

  const pendingTransactions = transactions.filter(t => t.status === 'PENDING');

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-green-100 p-3 rounded-lg">
              <DollarSign className="size-8 text-green-600" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">Cashier Dashboard</h1>
              <p className="text-gray-600">Welcome, {user.name}!</p>
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
        <Card>
          <CardContent className="pt-6">
            <div className="text-sm text-gray-600">Today's Total</div>
            <div className="text-2xl font-bold text-green-600">${stats.todayTotal}</div>
            <div className="text-xs text-muted-foreground mt-1">
              {stats.transactionCount} transactions
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="text-sm text-gray-600">Cash</div>
            <div className="text-2xl font-bold">${stats.cashTotal}</div>
            <div className="text-xs text-muted-foreground mt-1">
              {Math.round((stats.cashTotal / stats.todayTotal) * 100)}% of total
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="text-sm text-gray-600">Card Payments</div>
            <div className="text-2xl font-bold">${stats.cardTotal}</div>
            <div className="text-xs text-muted-foreground mt-1">
              {Math.round((stats.cardTotal / stats.todayTotal) * 100)}% of total
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="text-sm text-gray-600">Avg Transaction</div>
            <div className="text-2xl font-bold">${stats.avgTransaction}</div>
            <div className="text-xs text-muted-foreground mt-1">
              per order
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Pending Payments Alert */}
      {pendingTransactions.length > 0 && (
        <Card className="mb-6 border-orange-200 bg-orange-50">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <Bell className="size-5 text-orange-600" />
              <div>
                <div className="font-semibold">
                  {pendingTransactions.length} Pending Payments
                </div>
                <div className="text-sm text-muted-foreground">
                  Please process these orders
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Recent Transactions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Receipt className="size-5" />
            Recent Transactions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {transactions.map((txn) => (
              <div key={txn.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
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
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
