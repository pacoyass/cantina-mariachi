import { useLoaderData, Form, useSearchParams, Link } from "react-router";
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../../../components/ui/card";
import { Button } from "../../../components/ui/button";
import { Badge } from "../../../components/ui/badge";
import { Input } from "../../../components/ui/input";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../../components/ui/select";
import { useTranslation } from 'react-i18next';
import { 
  Search,
  Filter,
  Download,
  Eye,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  Truck,
  MapPin
} from "../../../lib/lucide-shim.js";
import { formatCurrency } from '../../../lib/utils';

export const meta = () => [
  { title: "Orders Management - Admin - Cantina" },
];

export async function loader({ request }) {
  const url = new URL(request.url);
  const cookie = request.headers.get("cookie") || "";
  
  // Get query parameters for filtering
  const status = url.searchParams.get("status") || "";
  const type = url.searchParams.get("type") || "";
  const search = url.searchParams.get("search") || "";
  const page = parseInt(url.searchParams.get("page") || "1");
  const limit = 20;
  
  try {
    const ordersRes = await fetch(`${url.origin}/api/admin/orders?${new URLSearchParams({
      status,
      type,
      search,
      page: page.toString(),
      limit: limit.toString()
    })}`, {
      headers: { cookie }
    });
    
    if (ordersRes.ok) {
      const ordersData = await ordersRes.json();
      return {
        orders: ordersData.data?.orders || [],
        pagination: ordersData.data?.pagination || { page: 1, totalPages: 1, total: 0 },
        filters: { status, type, search }
      };
    }
  } catch (error) {
    console.error('Orders loader error:', error);
  }
  
  // Mock data for development
  const mockOrders = [
    {
      id: '1',
      orderNumber: 'ORD-001',
      customerName: 'John Doe',
      customerEmail: 'john@example.com',
      customerPhone: '+1234567890',
      total: 45.99,
      status: 'PENDING',
      type: 'DELIVERY',
      deliveryAddress: '123 Main St, City, State',
      createdAt: new Date().toISOString(),
      items: [
        { name: 'Tacos al Pastor', quantity: 2, price: 12.99 },
        { name: 'Guacamole', quantity: 1, price: 8.99 }
      ]
    },
    {
      id: '2',
      orderNumber: 'ORD-002',
      customerName: 'Jane Smith',
      customerEmail: 'jane@example.com',
      customerPhone: '+1234567891',
      total: 28.50,
      status: 'PREPARING',
      type: 'PICKUP',
      createdAt: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
      items: [
        { name: 'Burrito Bowl', quantity: 1, price: 15.99 },
        { name: 'Agua Fresca', quantity: 2, price: 6.25 }
      ]
    },
    {
      id: '3',
      orderNumber: 'ORD-003',
      customerName: 'Mike Johnson',
      customerEmail: 'mike@example.com',
      customerPhone: '+1234567892',
      total: 67.25,
      status: 'DELIVERED',
      type: 'DELIVERY',
      deliveryAddress: '456 Oak Ave, City, State',
      createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
      items: [
        { name: 'Family Meal Deal', quantity: 1, price: 59.99 },
        { name: 'Extra Salsa', quantity: 2, price: 3.63 }
      ]
    }
  ];
  
  return {
    orders: mockOrders,
    pagination: { page: 1, totalPages: 1, total: mockOrders.length },
    filters: { status, type, search }
  };
}

export async function action({ request }) {
  const formData = await request.formData();
  const action = formData.get("action");
  const orderId = formData.get("orderId");
  const url = new URL(request.url);
  const cookie = request.headers.get("cookie") || "";

  if (action === "updateStatus") {
    const newStatus = formData.get("status");
    
    try {
      const response = await fetch(`${url.origin}/api/admin/orders/${orderId}/status`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Cookie": cookie
        },
        body: JSON.stringify({ status: newStatus })
      });

      if (response.ok) {
        return { success: true, message: "Order status updated successfully" };
      }
    } catch (error) {
      console.error('Update status error:', error);
    }
    
    return { success: false, message: "Failed to update order status" };
  }

  return { success: false, message: "Unknown action" };
}

const getStatusIcon = (status) => {
  switch (status) {
    case 'PENDING':
      return <Clock className="size-4 text-yellow-500" />;
    case 'PREPARING':
    case 'READY':
      return <AlertCircle className="size-4 text-blue-500" />;
    case 'DELIVERED':
    case 'COMPLETED':
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
    case 'DELIVERED':
    case 'COMPLETED':
      return 'success';
    case 'CANCELLED':
      return 'destructive';
    default:
      return 'outline';
  }
};

const orderStatuses = [
  { value: 'PENDING', label: 'Pending' },
  { value: 'PREPARING', label: 'Preparing' },
  { value: 'READY', label: 'Ready' },
  { value: 'DELIVERED', label: 'Delivered' },
  { value: 'COMPLETED', label: 'Completed' },
  { value: 'CANCELLED', label: 'Cancelled' }
];

export default function OrdersManagement() {
  const { orders, pagination, filters } = useLoaderData();
  const { t, i18n } = useTranslation(['admin', 'ui']);
  const [searchParams, setSearchParams] = useSearchParams();
  const [selectedOrder, setSelectedOrder] = useState(null);

  const updateFilter = (key, value) => {
    const newParams = new URLSearchParams(searchParams);
    if (value) {
      newParams.set(key, value);
    } else {
      newParams.delete(key);
    }
    newParams.delete('page'); // Reset to first page when filtering
    setSearchParams(newParams);
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            {t('orders.title', { defaultValue: 'Orders Management' })}
          </h1>
          <p className="text-gray-600 mt-1">
            {t('orders.subtitle', { defaultValue: 'Manage and track all customer orders' })}
          </p>
        </div>
        <div className="flex space-x-3">
          <Button variant="outline">
            <Download className="size-4 mr-2" />
            {t('orders.export', { defaultValue: 'Export' })}
          </Button>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Filter className="size-5 mr-2" />
            {t('orders.filters', { defaultValue: 'Filters' })}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 size-4 text-gray-400" />
              <Input
                placeholder={t('orders.searchPlaceholder', { defaultValue: 'Search orders...' })}
                value={filters.search}
                onChange={(e) => updateFilter('search', e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Status Filter */}
            <Select value={filters.status} onValueChange={(value) => updateFilter('status', value)}>
              <SelectTrigger>
                <SelectValue placeholder={t('orders.allStatuses', { defaultValue: 'All Statuses' })} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">{t('orders.allStatuses', { defaultValue: 'All Statuses' })}</SelectItem>
                {orderStatuses.map((status) => (
                  <SelectItem key={status.value} value={status.value}>
                    {status.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Type Filter */}
            <Select value={filters.type} onValueChange={(value) => updateFilter('type', value)}>
              <SelectTrigger>
                <SelectValue placeholder={t('orders.allTypes', { defaultValue: 'All Types' })} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">{t('orders.allTypes', { defaultValue: 'All Types' })}</SelectItem>
                <SelectItem value="DELIVERY">Delivery</SelectItem>
                <SelectItem value="PICKUP">Pickup</SelectItem>
              </SelectContent>
            </Select>

            {/* Clear Filters */}
            <Button 
              variant="outline" 
              onClick={() => setSearchParams({})}
              disabled={!filters.search && !filters.status && !filters.type}
            >
              {t('orders.clearFilters', { defaultValue: 'Clear Filters' })}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Orders List */}
      <Card>
        <CardHeader>
          <CardTitle>
            {t('orders.list', { defaultValue: 'Orders' })} ({pagination.total})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {orders.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              {t('orders.noOrders', { defaultValue: 'No orders found' })}
            </div>
          ) : (
            <div className="space-y-4">
              {orders.map((order) => (
                <div key={order.id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                  <div className="flex items-center justify-between">
                    {/* Order Info */}
                    <div className="flex items-center space-x-4">
                      {getStatusIcon(order.status)}
                      <div>
                        <div className="flex items-center space-x-2">
                          <span className="font-medium">{order.orderNumber}</span>
                          <Badge variant={getStatusBadgeVariant(order.status)}>
                            {order.status}
                          </Badge>
                          {order.type === 'DELIVERY' && (
                            <Badge variant="outline">
                              <Truck className="size-3 mr-1" />
                              Delivery
                            </Badge>
                          )}
                          {order.type === 'PICKUP' && (
                            <Badge variant="outline">
                              <MapPin className="size-3 mr-1" />
                              Pickup
                            </Badge>
                          )}
                        </div>
                        <div className="text-sm text-gray-600 mt-1">
                          {order.customerName} • {order.customerPhone}
                        </div>
                        {order.deliveryAddress && (
                          <div className="text-xs text-gray-500 mt-1">
                            {order.deliveryAddress}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Order Details */}
                    <div className="flex items-center space-x-4">
                      <div className="text-right">
                        <div className="font-medium">
                          {formatCurrency(order.total, i18n.language)}
                        </div>
                        <div className="text-sm text-gray-500">
                          {new Date(order.createdAt).toLocaleDateString()} {new Date(order.createdAt).toLocaleTimeString()}
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex items-center space-x-2">
                        {order.status === 'PENDING' && (
                          <Form method="post" className="inline">
                            <input type="hidden" name="action" value="updateStatus" />
                            <input type="hidden" name="orderId" value={order.id} />
                            <input type="hidden" name="status" value="PREPARING" />
                            <Button type="submit" size="sm">
                              Start Preparing
                            </Button>
                          </Form>
                        )}
                        
                        {order.status === 'PREPARING' && (
                          <Form method="post" className="inline">
                            <input type="hidden" name="action" value="updateStatus" />
                            <input type="hidden" name="orderId" value={order.id} />
                            <input type="hidden" name="status" value="READY" />
                            <Button type="submit" size="sm" variant="outline">
                              Mark Ready
                            </Button>
                          </Form>
                        )}

                        <Button variant="ghost" size="sm" onClick={() => setSelectedOrder(order)}>
                          <Eye className="size-4" />
                        </Button>
                      </div>
                    </div>
                  </div>

                  {/* Order Items */}
                  {order.items && (
                    <div className="mt-3 pl-8 border-l-2 border-gray-100">
                      <div className="text-sm text-gray-600">
                        {order.items.map((item, index) => (
                          <div key={index} className="flex justify-between">
                            <span>{item.quantity}× {item.name}</span>
                            <span>{formatCurrency(item.price, i18n.language)}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Pagination */}
      {pagination.totalPages > 1 && (
        <div className="flex justify-center space-x-2">
          {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map((page) => (
            <Button
              key={page}
              variant={pagination.page === page ? "default" : "outline"}
              size="sm"
              onClick={() => {
                const newParams = new URLSearchParams(searchParams);
                newParams.set('page', page.toString());
                setSearchParams(newParams);
              }}
            >
              {page}
            </Button>
          ))}
        </div>
      )}
    </div>
  );
}