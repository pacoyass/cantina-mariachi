import { useLoaderData } from "react-router";
import { Card, CardContent, CardHeader, CardTitle } from "../../../components/ui/card";
import { Badge } from "../../../components/ui/badge";
import { Button } from "../../../components/ui/button";
import { 
  TrendingUp, 
  DollarSign, 
  Users, 
  ShoppingBag, 
  Calendar,
  BarChart3,
  Download
} from "../../../lib/lucide-shim.js";

export const meta = () => [
  { title: "Analytics - Admin - Cantina" },
];

export async function loader({ request }) {
  const url = new URL(request.url);
  const cookie = request.headers.get("cookie") || "";
  
  try {
    const analyticsRes = await fetch(`${url.origin}/api/admin/analytics`, {
      headers: { cookie }
    });
    
    if (analyticsRes.ok) {
      const data = await analyticsRes.json();
      return { analytics: data.data || {} };
    }
  } catch (error) {
    console.error('Analytics loader error:', error);
  }
  
  // Mock data for development
  return {
    analytics: {
      revenue: {
        today: 1240.50,
        week: 8750.25,
        month: 35240.75,
        growth: 12.5
      },
      orders: {
        today: 45,
        week: 312,
        month: 1248,
        avgValue: 28.25
      },
      customers: {
        new: 24,
        returning: 156,
        total: 328
      },
      popular: [
        { name: 'Tacos al Pastor', orders: 145, revenue: 1885 },
        { name: 'Burrito Supreme', orders: 132, revenue: 1848 },
        { name: 'Quesadilla', orders: 98, revenue: 1176 },
        { name: 'Enchiladas', orders: 87, revenue: 1131 }
      ]
    }
  };
}

export default function AnalyticsPage() {
  const { analytics } = useLoaderData();

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Analytics</h1>
          <p className="text-gray-600 mt-1">Business insights and reports</p>
        </div>
        <Button variant="outline">
          <Download className="size-4 mr-2" />
          Export Report
        </Button>
      </div>

      {/* Revenue Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-gray-600">Today's Revenue</CardTitle>
              <DollarSign className="size-4 text-green-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${analytics.revenue?.today?.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground mt-1">
              +{analytics.revenue?.growth}% from yesterday
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-gray-600">This Month</CardTitle>
              <TrendingUp className="size-4 text-blue-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${analytics.revenue?.month?.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Week: ${analytics.revenue?.week?.toFixed(2)}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-gray-600">Orders Today</CardTitle>
              <ShoppingBag className="size-4 text-orange-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.orders?.today}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Avg: ${analytics.orders?.avgValue?.toFixed(2)}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-gray-600">Customers</CardTitle>
              <Users className="size-4 text-purple-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.customers?.total}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {analytics.customers?.new} new this month
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Popular Items */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="size-5" />
            Most Popular Items
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {analytics.popular?.map((item, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <Badge variant="outline" className="text-xs">
                    #{index + 1}
                  </Badge>
                  <div>
                    <p className="font-medium">{item.name}</p>
                    <p className="text-sm text-muted-foreground">{item.orders} orders</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-green-600">${item.revenue}</p>
                  <p className="text-xs text-muted-foreground">revenue</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Placeholder for charts */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Revenue Trend</CardTitle>
          </CardHeader>
          <CardContent className="h-64 flex items-center justify-center text-muted-foreground">
            <div className="text-center">
              <BarChart3 className="size-12 mx-auto mb-2 opacity-50" />
              <p>Chart visualization coming soon</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Order Distribution</CardTitle>
          </CardHeader>
          <CardContent className="h-64 flex items-center justify-center text-muted-foreground">
            <div className="text-center">
              <Calendar className="size-12 mx-auto mb-2 opacity-50" />
              <p>Chart visualization coming soon</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
