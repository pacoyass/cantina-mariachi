import { useState } from 'react';
import { Form, useActionData, useNavigation, redirect } from 'react-router';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Button } from '../components/ui/button';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
import { Alert, AlertDescription } from '../components/ui/alert';
import { Badge } from '../components/ui/badge';
import { useLoaderData } from 'react-router';
import { Calendar, Clock, Users, Phone, User, MessageSquare, AlertCircle, CheckCircle, MapPin, Utensils } from 'lucide-react';

export const meta = () => [
  { title: 'Table Reservations - Cantina Mariachi' },
  { name: 'description', content: 'Reserve your table at Cantina Mariachi. Enjoy authentic Mexican cuisine in our vibrant atmosphere.' },
];

export async function loader({ request }) {
  const url = new URL(request.url);
  const cookie = request.headers.get('cookie') || '';
  
  // Get available time slots
  const today = new Date();
  const availableDates = [];
  for (let i = 0; i < 14; i++) {
    const date = new Date(today);
    date.setDate(today.getDate() + i);
    availableDates.push(date.toISOString().split('T')[0]);
  }

  try {
    const res = await fetch(`${url.origin}/api/cms/reservations?locale=${encodeURIComponent('en')}`, { headers: { cookie } });
    const json = await res.json().catch(() => null);
    return { 
      cms: json?.data?.page?.data || {},
      availableDates,
      timeSlots: [
        '17:00', '17:30', '18:00', '18:30', '19:00', '19:30', 
        '20:00', '20:30', '21:00', '21:30', '22:00'
      ]
    };
  } catch {
    return { 
      cms: {},
      availableDates,
      timeSlots: [
        '17:00', '17:30', '18:00', '18:30', '19:00', '19:30', 
        '20:00', '20:30', '21:00', '21:30', '22:00'
      ]
    };
  }
}

export async function action({ request }) {
  const formData = await request.formData();
  const name = formData.get('name');
  const email = formData.get('email');
  const phone = formData.get('phone');
  const date = formData.get('date');
  const time = formData.get('time');
  const guests = formData.get('guests');
  const specialRequests = formData.get('specialRequests');

  // Validation
  const errors = {};
  
  if (!name || name.trim().length < 2) {
    errors.name = 'Name is required';
  }

  if (!email || !email.includes('@')) {
    errors.email = 'Valid email is required';
  }

  if (!phone || phone.length < 10) {
    errors.phone = 'Valid phone number is required';
  }

  if (!date) {
    errors.date = 'Date is required';
  }

  if (!time) {
    errors.time = 'Time is required';
  }

  if (!guests || guests < 1 || guests > 12) {
    errors.guests = 'Number of guests must be between 1 and 12';
  }

  if (Object.keys(errors).length > 0) {
    return {
      errors,
      fields: { name, email, phone, date, time, guests, specialRequests }
    };
  }

  try {
    const response = await fetch(`${new URL(request.url).origin}/api/reservations`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        customerName: name.trim(),
        customerEmail: email.toLowerCase().trim(),
        customerPhone: phone.trim(),
        date: new Date(date + 'T' + time),
        time,
        partySize: parseInt(guests),
        notes: specialRequests?.trim() || null
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      return {
        error: data.error?.message || 'Failed to make reservation',
        fields: { name, email, phone, date, time, guests, specialRequests }
      };
    }

    return redirect(`/reservations/confirmation?id=${data.data.reservation.id}`);
  } catch (error) {
    return {
      error: 'Network error. Please try again.',
      fields: { name, email, phone, date, time, guests, specialRequests }
    };
  }
}

export default function ReservationsPage() {
  const { t } = useTranslation(['reservations', 'common']);
  const { cms, availableDates, timeSlots } = useLoaderData();
  const actionData = useActionData();
  const navigation = useNavigation();
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [guestCount, setGuestCount] = useState(2);
  const isSubmitting = navigation.state === 'submitting';

  return (
    <main className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="grid gap-8 lg:grid-cols-2">
        {/* Left Column - Form */}
        <div className="space-y-6">
          {/* Header */}
          <div className="text-center lg:text-left">
            <h1 className="text-3xl font-bold tracking-tight">Reserve Your Table</h1>
            <p className="text-muted-foreground mt-2">
              Book your dining experience at Cantina Mariachi
            </p>
          </div>

          {/* Reservation Form */}
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Utensils className="h-5 w-5 text-primary" />
                Reservation Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Success/Error Messages */}
              {actionData?.error && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{actionData.error}</AlertDescription>
                </Alert>
              )}

              <Form method="post" className="space-y-4">
                {/* Contact Information */}
                <div className="space-y-4">
                  <h3 className="font-semibold text-sm uppercase tracking-wide text-muted-foreground">
                    Contact Information
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Name */}
                    <div className="space-y-2">
                      <Label htmlFor="name" className="text-sm font-medium">
                        Full Name *
                      </Label>
                      <div className="relative">
                        <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="name"
                          name="name"
                          placeholder="Your full name"
                          defaultValue={actionData?.fields?.name || ''}
                          className="pl-10"
                          required
                        />
                      </div>
                      {actionData?.errors?.name && (
                        <p className="text-sm text-destructive">{actionData.errors.name}</p>
                      )}
                    </div>

                    {/* Phone */}
                    <div className="space-y-2">
                      <Label htmlFor="phone" className="text-sm font-medium">
                        Phone Number *
                      </Label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="phone"
                          name="phone"
                          type="tel"
                          placeholder="Your phone number"
                          defaultValue={actionData?.fields?.phone || ''}
                          className="pl-10"
                          required
                        />
                      </div>
                      {actionData?.errors?.phone && (
                        <p className="text-sm text-destructive">{actionData.errors.phone}</p>
                      )}
                    </div>
                  </div>

                  {/* Email */}
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-sm font-medium">
                      Email Address *
                    </Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      placeholder="your.email@example.com"
                      defaultValue={actionData?.fields?.email || ''}
                      required
                    />
                    {actionData?.errors?.email && (
                      <p className="text-sm text-destructive">{actionData.errors.email}</p>
                    )}
                  </div>
                </div>

                {/* Reservation Details */}
                <div className="space-y-4">
                  <h3 className="font-semibold text-sm uppercase tracking-wide text-muted-foreground">
                    Reservation Details
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {/* Date */}
                    <div className="space-y-2">
                      <Label htmlFor="date" className="text-sm font-medium">
                        Date *
                      </Label>
                      <div className="relative">
                        <Calendar className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="date"
                          name="date"
                          type="date"
                          min={availableDates[0]}
                          max={availableDates[availableDates.length - 1]}
                          value={selectedDate}
                          onChange={(e) => setSelectedDate(e.target.value)}
                          defaultValue={actionData?.fields?.date || ''}
                          className="pl-10"
                          required
                        />
                      </div>
                      {actionData?.errors?.date && (
                        <p className="text-sm text-destructive">{actionData.errors.date}</p>
                      )}
                    </div>

                    {/* Time */}
                    <div className="space-y-2">
                      <Label htmlFor="time" className="text-sm font-medium">
                        Time *
                      </Label>
                      <div className="relative">
                        <Clock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <select
                          id="time"
                          name="time"
                          value={selectedTime}
                          onChange={(e) => setSelectedTime(e.target.value)}
                          className="w-full pl-10 pr-4 py-2 border border-input bg-background text-sm rounded-md focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent"
                          required
                        >
                          <option value="">Select time</option>
                          {timeSlots.map((slot) => (
                            <option key={slot} value={slot}>
                              {slot}
                            </option>
                          ))}
                        </select>
                      </div>
                      {actionData?.errors?.time && (
                        <p className="text-sm text-destructive">{actionData.errors.time}</p>
                      )}
                    </div>

                    {/* Guests */}
                    <div className="space-y-2">
                      <Label htmlFor="guests" className="text-sm font-medium">
                        Guests *
                      </Label>
                      <div className="relative">
                        <Users className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="guests"
                          name="guests"
                          type="number"
                          min="1"
                          max="12"
                          value={guestCount}
                          onChange={(e) => setGuestCount(parseInt(e.target.value))}
                          defaultValue={actionData?.fields?.guests || 2}
                          className="pl-10"
                          required
                        />
                      </div>
                      {actionData?.errors?.guests && (
                        <p className="text-sm text-destructive">{actionData.errors.guests}</p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Special Requests */}
                <div className="space-y-2">
                  <Label htmlFor="specialRequests" className="text-sm font-medium">
                    Special Requests (Optional)
                  </Label>
                  <div className="relative">
                    <MessageSquare className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Textarea
                      id="specialRequests"
                      name="specialRequests"
                      placeholder="Any special dietary requirements, celebration details, or seating preferences..."
                      defaultValue={actionData?.fields?.specialRequests || ''}
                      className="pl-10 min-h-[80px] resize-none"
                    />
                  </div>
                </div>

                {/* Submit Button */}
                <Button
                  type="submit"
                  className="w-full"
                  disabled={isSubmitting}
                  size="lg"
                >
                  {isSubmitting ? (
                    <div className="flex items-center space-x-2">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      <span>Making Reservation...</span>
                    </div>
                  ) : (
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="h-4 w-4" />
                      <span>Reserve Table</span>
                    </div>
                  )}
                </Button>
              </Form>
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Info & Atmosphere */}
        <div className="space-y-6">
          {/* Restaurant Info */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5 text-primary" />
                Restaurant Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-semibold">Location</h4>
                <p className="text-sm text-muted-foreground">
                  123 Mexican Street, Casablanca, Morocco
                </p>
              </div>
              
              <div>
                <h4 className="font-semibold">Operating Hours</h4>
                <div className="text-sm text-muted-foreground space-y-1">
                  <p>Monday - Thursday: 5:00 PM - 10:00 PM</p>
                  <p>Friday - Saturday: 5:00 PM - 11:00 PM</p>
                  <p>Sunday: 5:00 PM - 9:00 PM</p>
                </div>
              </div>

              <div>
                <h4 className="font-semibold">Contact</h4>
                <p className="text-sm text-muted-foreground">
                  Phone: +212 522 123 456<br />
                  Email: reservations@cantina-mariachi.com
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Policies */}
          <Card>
            <CardHeader>
              <CardTitle>Reservation Policies</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div className="flex items-start space-x-2">
                <Badge variant="secondary" className="mt-0.5">•</Badge>
                <p>Reservations are held for 15 minutes past the reserved time</p>
              </div>
              <div className="flex items-start space-x-2">
                <Badge variant="secondary" className="mt-0.5">•</Badge>
                <p>Large parties (8+) may require a deposit</p>
              </div>
              <div className="flex items-start space-x-2">
                <Badge variant="secondary" className="mt-0.5">•</Badge>
                <p>Cancellations accepted up to 2 hours before reservation</p>
              </div>
              <div className="flex items-start space-x-2">
                <Badge variant="secondary" className="mt-0.5">•</Badge>
                <p>We accommodate dietary restrictions with advance notice</p>
              </div>
            </CardContent>
          </Card>

          {/* Atmosphere Preview */}
          <Card>
            <CardContent className="p-0">
              <div className="aspect-video bg-gradient-to-br from-orange-100 to-red-100 dark:from-orange-900/20 dark:to-red-900/20 rounded-t-lg flex items-center justify-center">
                <div className="text-center space-y-2">
                  <Utensils className="h-12 w-12 mx-auto text-primary/60" />
                  <p className="text-sm text-muted-foreground">Vibrant Mexican Atmosphere</p>
                </div>
              </div>
              <div className="p-4">
                <h4 className="font-semibold mb-2">Experience Authentic Mexico</h4>
                <p className="text-sm text-muted-foreground">
                  Enjoy our warm, colorful atmosphere with traditional music, 
                  handcrafted decorations, and the aroma of fresh Mexican cuisine.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  );
}