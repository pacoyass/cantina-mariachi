import { useLoaderData, Link } from "react-router";
import { Card, CardContent, CardHeader, CardTitle } from "../../../components/ui/card";
import { Button } from "../../../components/ui/button";
import { Badge } from "../../../components/ui/badge";
import { useTranslation } from 'react-i18next';
import { 
  ShoppingBag, 
  Users, 
  ChefHat, 
  Calendar,
  TrendingUp,
  DollarSign,
  Clock,
  AlertCircle,
  CheckCircle,
  XCircle
} from "../../../lib/lucide-shim.js";
import { formatCurrency } from '../../../lib/utils';

export const meta = () => [
  { title: "Dashboard - Admin - Cantina" },
];

export async function loader({ request }) {
  const url = new URL(request.url);
  const cookie = request.headers.get("cookie") || "";
  
  try {
    // Get comprehensive dashboard data
    const [ordersRes, revenueRes, menuRes, usersRes, recentOrdersRes] = await Promise.all([
      fetch(`${url.origin}/api/admin/stats/orders`, { headers: { cookie } }),
      fetch(`${url.origin}/api/admin/stats/revenue`, { headers: { cookie } }),
      fetch(`${url.origin}/api/admin/stats/menu`, { headers: { cookie } }),
      fetch(`${url.origin}/api/admin/stats/users`, { headers: { cookie } }),
      fetch(`${url.origin}/api/admin/orders/recent?limit=5`, { headers: { cookie } })
    ]);
    
    const stats = {
      orders: ordersRes.ok ? (await ordersRes.json()).data : {
        total: 156,
        pending: 8,
        completed: 142,
        cancelled: 6,
        today: 12,
        growth: 15.3
      },
      revenue: revenueRes.ok ? (await revenueRes.json()).data : {
        today: 1240.50,
        month: 24580.75,
        growth: 8.2,
        avgOrder: 35.25
      },
      menu: menuRes.ok ? (await menuRes.json()).data : {
        total: 48,
        available: 44,
        outOfStock: 4,
        categories: 8
      },
      users: usersRes.ok ? (await usersRes.json()).data : {
        total: 328,
        active: 89,
        new: 24,
        growth: 12.1
      }
    };
    
    const recentOrders = recentOrdersRes.ok ? (await recentOrdersRes.json()).data : [
      {
        id: '1',
        orderNumber: 'ORD-001',
        customerName: 'John Doe',
        total: 45.99,
        status: 'PENDING',
        type: 'DELIVERY',
        createdAt: new Date().toISOString()
      },
      {
        id: '2',
        orderNumber: 'ORD-002', 
        customerName: 'Jane Smith',
        total: 28.50,
        status: 'PREPARING',
        type: 'PICKUP',
        createdAt: new Date(Date.now() - 30 * 60 * 1000).toISOString()
      }
    ];
    
    return { stats, recentOrders };
  } catch (error) {
    console.error('Dashboard loader error:', error);
    // Return mock data for development
    return {
      stats: {
        orders: { total: 156, pending: 8, completed: 142, cancelled: 6, today: 12, growth: 15.3 },
        revenue: { today: 1240.50, month: 24580.75, growth: 8.2, avgOrder: 35.25 },
        menu: { total: 48, available: 44, outOfStock: 4, categories: 8 },
        users: { total: 328, active: 89, new: 24, growth: 12.1 }
      },
      recentOrders: []
    };
  }
}

const getStatusIcon = (status) => {
  switch (status) {
    case 'PENDING':
      return <Clock className="size-4 text-yellow-500" />;
    case 'PREPARING':
    case 'READY':
      return <AlertCircle className="size-4 text-blue-500" />;
    case 'COMPLETED':
    case 'DELIVERED':
      return <CheckCircle className="size-4 text-green-500" />;
    case 'CANCELLED':
      return <XCircle className="size-4 text-red-500" />;
    default:
      return <Clock className="size-4 text-gray-500" />;
  }
};

const getStatusBadgeVariant = (status) => {
  switch (status) {
    case 'PENDING':
      return 'secondary';
    case 'PREPARING':
    case 'READY':
      return 'default';
    case 'COMPLETED':
    case 'DELIVERED':
      return 'success';
    case 'CANCELLED':
      return 'destructive';
    default:
      return 'outline';
  }
};

export default function AdminDashboard() {
  const { stats, recentOrders } = useLoaderData();
  const { t, i18n } = useTranslation(['admin', 'ui']);

  return (
    <div className="p-6 space-y-6 ">
      {/* Header */}
      <div className="tracking-wide">
        <h1 className="text-3xl font-bold ">
          {t('dashboard.title', { defaultValue: 'Dashboard' })}
        </h1>
        <p className="font-light mt-1">
          {t('dashboard.subtitle', { defaultValue: 'Welcome back! Here\'s what\'s happening today.' })}
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 ">
        {/* Orders */}
        <Card className="border-b-4 bg-gray-100/30 backdrop-blur-sm dark:supports-[backdrop-filter]:bg-background/30">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {t('dashboard.stats.orders', { defaultValue: 'Total Orders' })}
            </CardTitle>
            <ShoppingBag className="size-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.orders.total}</div>
            <div className="flex items-center text-xs text-muted-foreground">
              <TrendingUp className="size-3 mr-1 text-green-500" />
              +{stats.orders.growth}% from last month
            </div>
          </CardContent>
        </Card>

        {/* Revenue */}
        <Card className="border-b-4 bg-gray-100/30 backdrop-blur-sm dark:supports-[backdrop-filter]:bg-background/30" >
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {t('dashboard.stats.revenue', { defaultValue: 'Monthly Revenue' })}
            </CardTitle>
            <DollarSign className="size-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(stats.revenue.month, i18n.language)}
            </div>
            <div className="flex items-center text-xs text-muted-foreground">
              <TrendingUp className="size-3 mr-1 text-green-500" />
              +{stats.revenue.growth}% from last month
            </div>
          </CardContent>
        </Card>

        {/* Menu Items */}
        <Card className="border-b-4 bg-gray-100/30 backdrop-blur-sm dark:supports-[backdrop-filter]:bg-background/30" >
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {t('dashboard.stats.menu', { defaultValue: 'Menu Items' })}
            </CardTitle>
            <ChefHat className="size-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.menu.available}</div>
            <div className="text-xs text-muted-foreground">
              {stats.menu.outOfStock} out of stock
            </div>
          </CardContent>
        </Card>

        {/* Users */}
        <Card className="border-b-4 bg-gray-100/30 backdrop-blur-sm dark:supports-[backdrop-filter]:bg-background/30" >
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {t('dashboard.stats.users', { defaultValue: 'Total Users' })}
            </CardTitle>
            <Users className="size-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.users.total}</div>
            <div className="flex items-center text-xs text-muted-foreground">
              <TrendingUp className="size-3 mr-1 text-green-500" />
              +{stats.users.growth}% from last month
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        {/* Pending Orders */}
        <Card className="border-b-4 bg-gray-100/30 backdrop-blur-sm dark:supports-[backdrop-filter]:bg-background/30">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              {t('dashboard.pendingOrders', { defaultValue: 'Pending Orders' })}
              <Badge variant="destructive">{stats.orders.pending}</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              {t('dashboard.pendingOrdersDesc', { defaultValue: 'Orders requiring immediate attention' })}
            </p>
            <Link to="/admin/orders?status=pending">
              <Button className="w-full">
                {t('dashboard.viewOrders', { defaultValue: 'View Orders' })}
              </Button>
            </Link>
          </CardContent>
        </Card>

        {/* Today's Revenue */}
        <Card className="border-b-4 bg-gray-100/30 backdrop-blur-sm dark:supports-[backdrop-filter]:bg-background/30">
          <CardHeader>
            <CardTitle>
              {t('dashboard.todayRevenue', { defaultValue: 'Today\'s Revenue' })}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold mb-2">
              {formatCurrency(stats.revenue.today, i18n.language)}
            </div>
            <p className="text-sm text-muted-foreground mb-4">
              From {stats.orders.today} orders today
            </p>
            <Link to="/admin/analytics">
              <Button variant="outline" className="w-full">
                {t('dashboard.viewAnalytics', { defaultValue: 'View Analytics' })}
              </Button>
            </Link>
          </CardContent>
        </Card>

        {/* Quick Add */}
        <Card className="border-b-4 bg-gray-100/30 backdrop-blur-sm dark:supports-[backdrop-filter]:bg-background/30" >
          <CardHeader>
            <CardTitle>
              {t('dashboard.quickActions', { defaultValue: 'Quick Actions' })}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <Link to="/admin/menu/new" className="block">
              <Button variant="outline" className="w-full">
                <ChefHat className="size-4 mr-2" />
                {t('dashboard.addMenuItem', { defaultValue: 'Add Menu Item' })}
              </Button>
            </Link>
            <Link to="/admin/users/new" className="block">
              <Button variant="outline" className="w-full">
                <Users className="size-4 mr-2" />
                {t('dashboard.addUser', { defaultValue: 'Add Staff User' })}
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>

      {/* Recent Orders */}
      <Card className="border-b-4 bg-gray-100/30 backdrop-blur-sm dark:supports-[backdrop-filter]:bg-background/30" >
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            {t('dashboard.recentOrders', { defaultValue: 'Recent Orders' })}
            <Link to="/admin/orders">
              <Button variant="outline" size="sm">
                {t('dashboard.viewAll', { defaultValue: 'View All' })}
              </Button>
            </Link>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {recentOrders.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              {t('dashboard.noRecentOrders', { defaultValue: 'No recent orders' })}
            </div>
          ) : (
            <div className="space-y-4">
              {recentOrders.map((order) => (
                <div key={order.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center space-x-4">
                    {getStatusIcon(order.status)}
                    <div>
                      <div className="font-medium">{order.orderNumber}</div>
                      <div className="text-sm text-muted-foreground">
                        {order.customerName} • {order.type}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <Badge variant={getStatusBadgeVariant(order.status)}>
                      {order.status}
                    </Badge>
                    <div className="text-right">
                      <div className="font-medium">
                        {formatCurrency(order.total, i18n.language)}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {new Date(order.createdAt).toLocaleTimeString()}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}