import { useLoaderData, Form, redirect } from "react-router";
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Badge } from "../../components/ui/badge";
import { 
  Utensils, 
  Plus,
  CheckCircle,
  Clock,
  User,
  Bell,
  Eye
} from "../../lib/lucide-shim.js";

export const meta = () => [
  { title: "Waiter Dashboard - Cantina" },
];

export async function loader({ request }) {
  const url = new URL(request.url);
  const cookie = request.headers.get("cookie") || "";
  
  try {
    const authRes = await fetch(`${url.origin}/api/users/me`, {
      headers: { cookie }
    });
    
    if (!authRes.ok) {
      throw redirect("/login?redirect=/waiter");
    }
    
    const authData = await authRes.json();
    const user = authData.data?.user;
    
    if (!user || user.role !== 'WAITER') {
      throw redirect("/");
    }
    
    // Get waiter's tables and orders
    const tablesRes = await fetch(`${url.origin}/api/waiter/tables`, {
      headers: { cookie }
    });
    
    if (tablesRes.ok) {
      const data = await tablesRes.json();
      return { 
        user,
        tables: data.data?.tables || []
      };
    }
  } catch (error) {
    if (error instanceof Response) throw error;
  }
  
  // Mock data
  return {
    user: { name: 'Waiter', role: 'WAITER' },
    tables: [
      {
        number: '5',
        status: 'occupied',
        guests: 4,
        orders: [
          { id: 'ORD-101', items: 3, total: 45.99, status: 'CONFIRMED' }
        ],
        timeSeated: new Date(Date.now() - 25 * 60000).toISOString()
      },
      {
        number: '12',
        status: 'occupied',
        guests: 2,
        orders: [
          { id: 'ORD-103', items: 2, total: 28.50, status: 'PREPARING' }
        ],
        timeSeated: new Date(Date.now() - 15 * 60000).toISOString()
      },
      {
        number: '3',
        status: 'available',
        guests: 0
      }
    ]
  };
}

const getTableStatusColor = (status) => {
  switch (status) {
    case 'occupied': return 'bg-orange-100 text-orange-800 border-orange-200';
    case 'available': return 'bg-green-100 text-green-800 border-green-200';
    case 'reserved': return 'bg-blue-100 text-blue-800 border-blue-200';
    default: return 'bg-gray-100 text-gray-800';
  }
};

const getTimeSince = (timeString) => {
  const mins = Math.floor((Date.now() - new Date(timeString)) / 60000);
  if (mins < 1) return 'Just now';
  return `${mins} mins`;
};

export default function WaiterDashboard() {
  const { user, tables } = useLoaderData();
  const [filter, setFilter] = useState('all');

  const filteredTables = tables.filter(table => {
    if (filter === 'all') return true;
    return table.status === filter;
  });

  const occupiedCount = tables.filter(t => t.status === 'occupied').length;
  const availableCount = tables.filter(t => t.status === 'available').length;

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-blue-100 p-3 rounded-lg">
              <Utensils className="size-8 text-blue-600" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">Waiter Dashboard</h1>
              <p className="text-gray-600">Welcome, {user.name}!</p>
            </div>
          </div>
          
          <Button>
            <Plus className="size-4 mr-2" />
            New Order
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-3 mb-6">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold">{occupiedCount}</div>
                <div className="text-sm text-gray-600">Occupied Tables</div>
              </div>
              <User className="size-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold">{availableCount}</div>
                <div className="text-sm text-gray-600">Available Tables</div>
              </div>
              <CheckCircle className="size-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold">{tables.length}</div>
                <div className="text-sm text-gray-600">Total Tables</div>
              </div>
              <Utensils className="size-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex gap-2 mb-6">
        <Button 
          variant={filter === 'all' ? 'default' : 'outline'}
          onClick={() => setFilter('all')}
        >
          All Tables
        </Button>
        <Button 
          variant={filter === 'occupied' ? 'default' : 'outline'}
          onClick={() => setFilter('occupied')}
        >
          Occupied ({occupiedCount})
        </Button>
        <Button 
          variant={filter === 'available' ? 'default' : 'outline'}
          onClick={() => setFilter('available')}
        >
          Available ({availableCount})
        </Button>
      </div>

      {/* Tables Grid */}
      <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-4">
        {filteredTables.map((table) => (
          <Card key={table.number} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-2xl">Table {table.number}</CardTitle>
                <Badge className={getTableStatusColor(table.status)}>
                  {table.status}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              {table.status === 'occupied' && (
                <>
                  <div className="flex items-center gap-2 text-sm">
                    <User className="size-4" />
                    <span>{table.guests} guests</span>
                  </div>
                  
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Clock className="size-4" />
                    <span>Seated {getTimeSince(table.timeSeated)}</span>
                  </div>

                  {table.orders?.map((order) => (
                    <div key={order.id} className="bg-gray-50 p-2 rounded text-sm">
                      <div className="flex justify-between mb-1">
                        <span className="font-medium">{order.id}</span>
                        <Badge variant="outline" className="text-xs">
                          {order.status}
                        </Badge>
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {order.items} items • ${order.total}
                      </div>
                    </div>
                  ))}

                  <div className="flex gap-2 pt-2">
                    <Button size="sm" variant="outline" className="flex-1">
                      <Eye className="size-3 mr-1" />
                      View
                    </Button>
                    <Button size="sm" className="flex-1">
                      <Plus className="size-3 mr-1" />
                      Add Order
                    </Button>
                  </div>
                </>
              )}
              
              {table.status === 'available' && (
                <Button className="w-full">
                  <Plus className="size-4 mr-2" />
                  Seat Guests
                </Button>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
