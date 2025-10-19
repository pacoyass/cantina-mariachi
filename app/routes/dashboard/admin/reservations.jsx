import { useLoaderData } from "react-router";
import { Card, CardContent, CardHeader, CardTitle } from "../../../components/ui/card";
import { Badge } from "../../../components/ui/badge";
import { Button } from "../../../components/ui/button";
import { Calendar, Users, Clock, MapPin } from "../../../lib/lucide-shim.js";

export const meta = () => [
  { title: "Reservations Management - Admin - Cantina" },
];

export async function loader({ request }) {
  const url = new URL(request.url);
  const cookie = request.headers.get("cookie") || "";
  
  try {
    const reservationsRes = await fetch(`${url.origin}/api/admin/reservations`, {
      headers: { cookie }
    });
    
    if (reservationsRes.ok) {
      const data = await reservationsRes.json();
      return { reservations: data.data || [] };
    }
  } catch (error) {
    console.error('Reservations loader error:', error);
  }
  
  // Mock data for development
  return {
    reservations: [
      {
        id: '1',
        customerName: 'John Doe',
        customerEmail: 'john@example.com',
        customerPhone: '+1234567890',
        date: new Date().toISOString().split('T')[0],
        time: '19:00',
        partySize: 4,
        status: 'CONFIRMED',
        notes: 'Birthday celebration',
        createdAt: new Date().toISOString()
      },
      {
        id: '2',
        customerName: 'Jane Smith',
        customerEmail: 'jane@example.com',
        customerPhone: '+1234567891',
        date: new Date(Date.now() + 86400000).toISOString().split('T')[0],
        time: '20:00',
        partySize: 2,
        status: 'PENDING',
        notes: 'Anniversary dinner',
        createdAt: new Date().toISOString()
      }
    ]
  };
}

const getStatusColor = (status) => {
  switch (status?.toLowerCase()) {
    case 'confirmed':
      return 'bg-green-100 text-green-800';
    case 'pending':
      return 'bg-yellow-100 text-yellow-800';
    case 'cancelled':
      return 'bg-red-100 text-red-800';
    case 'completed':
      return 'bg-blue-100 text-blue-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

export default function ReservationsManagement() {
  const { reservations } = useLoaderData();

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Reservations Management</h1>
          <p className="text-gray-600 mt-1">View and manage table reservations</p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline">{reservations.length} Total</Badge>
          <Badge className="bg-yellow-100 text-yellow-800">
            {reservations.filter(r => r.status === 'PENDING').length} Pending
          </Badge>
        </div>
      </div>

      {/* Reservations List */}
      <div className="grid gap-4">
        {reservations.map((reservation) => (
          <Card key={reservation.id}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div>
                    <CardTitle className="text-lg">{reservation.customerName}</CardTitle>
                    <p className="text-sm text-muted-foreground">{reservation.customerEmail}</p>
                  </div>
                  <Badge className={getStatusColor(reservation.status)}>
                    {reservation.status}
                  </Badge>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">View Details</Button>
                  {reservation.status === 'PENDING' && (
                    <>
                      <Button variant="default" size="sm">Confirm</Button>
                      <Button variant="destructive" size="sm">Cancel</Button>
                    </>
                  )}
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <Calendar className="size-4 text-muted-foreground" />
                  <span>{new Date(reservation.date).toLocaleDateString()}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="size-4 text-muted-foreground" />
                  <span>{reservation.time}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="size-4 text-muted-foreground" />
                  <span>{reservation.partySize} guests</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="size-4 text-muted-foreground" />
                  <span>{reservation.customerPhone}</span>
                </div>
              </div>
              {reservation.notes && (
                <p className="mt-3 text-sm text-muted-foreground">
                  <strong>Notes:</strong> {reservation.notes}
                </p>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
