import { useState } from 'react';
import { Form, useNavigation } from 'react-router';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock, Users, Phone, User, MessageSquare, AlertCircle, CheckCircle, MapPin, Utensils } from '@/lib/lucide-shim.js';

export default function Reservations({actionData,cms, availableDates, timeSlots}) {
  const { t } = useTranslation(['reservations', 'common']);
  const navigation = useNavigation();
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [guestCount, setGuestCount] = useState(2);
  const isSubmitting = navigation.state === 'submitting';
  return (
    <main className="container mx-auto px-4 py-8 max-w-6xl">
  {/* Header */}
  <div className="text-center lg:text-left py-6">
    <h1 className="text-3xl font-bold tracking-tight">{t('header.title')}</h1>
    <p className="text-muted-foreground mt-2">{t('header.subtitle')}</p>
  </div>
  
  <div className="grid gap-8 lg:grid-cols-2">
    {/* Left Column - Form */}
    <div className="space-y-6">
      {/* Reservation Form */}
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Utensils className="h-5 w-5 text-primary" />
            {t('form.details')}
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
              <h3 className="font-semibold text-sm uppercase tracking-wide text-muted-foreground">{t('form.contact')}</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Name */}
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-sm font-medium">{t('form.name')} *</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="name"
                      name="name"
                      placeholder={t('form.placeholders.name')}
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
                  <Label htmlFor="phone" className="text-sm font-medium">{t('form.phone')} *</Label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="phone"
                      name="phone"
                      type="tel"
                      placeholder={t('form.placeholders.phone')}
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
                <Label htmlFor="email" className="text-sm font-medium">{t('form.email')} *</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder={t('form.placeholders.email')}
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
              <h3 className="font-semibold text-sm uppercase tracking-wide text-muted-foreground">{t('form.details')}</h3>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Date */}
                <div className="space-y-2">
                  <Label htmlFor="date" className="text-sm font-medium">{t('form.date')} *</Label>
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
                  <Label htmlFor="time" className="text-sm font-medium">{t('form.time')} *</Label>
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
                      <option value="">{t('form.time')}</option>
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
                  <Label htmlFor="guests" className="text-sm font-medium">{t('form.guests')} *</Label>
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
              <Label htmlFor="specialRequests" className="text-sm font-medium">{t('form.specialRequests')}</Label>
              <div className="relative">
                <MessageSquare className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Textarea
                  id="specialRequests"
                  name="specialRequests"
                  placeholder={t('form.placeholders.requests')}
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
                  <span>{t('form.submitting')}</span>
                </div>
              ) : (
                <div className="flex items-center space-x-2">
                  <CheckCircle className="h-4 w-4" />
                  <span>{t('form.submit')}</span>
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
            {t('info.restaurant')}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h4 className="font-semibold">{t('info.location')}</h4>
            <p className="text-sm text-muted-foreground">
              123 Mexican Street, Casablanca, Morocco
            </p>
          </div>
          
          <div>
            <h4 className="font-semibold">{t('info.hours')}</h4>
            <div className="text-sm text-muted-foreground space-y-1">
              <p>Monday - Thursday: 5:00 PM - 10:00 PM</p>
              <p>Friday - Saturday: 5:00 PM - 11:00 PM</p>
              <p>Sunday: 5:00 PM - 9:00 PM</p>
            </div>
          </div>

          <div>
            <h4 className="font-semibold">{t('info.contact')}</h4>
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
          <CardTitle>{t('policies.title')}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm">
          <div className="flex items-start space-x-2">
            <Badge variant="secondary" className="mt-0.5">•</Badge>
            <p>{t('policies.items.0')}</p>
          </div>
          <div className="flex items-start space-x-2">
            <Badge variant="secondary" className="mt-0.5">•</Badge>
            <p>{t('policies.items.1')}</p>
          </div>
          <div className="flex items-start space-x-2">
            <Badge variant="secondary" className="mt-0.5">•</Badge>
            <p>{t('policies.items.2')}</p>
          </div>
          <div className="flex items-start space-x-2">
            <Badge variant="secondary" className="mt-0.5">•</Badge>
            <p>{t('policies.items.3')}</p>
          </div>
        </CardContent>
      </Card>
    </div>
  </div>

  {/* Full Width Atmosphere Card */}
  <div className="mt-8">
    <Card>
      <CardContent className="p-0">
        <div className="aspect-video bg-gradient-to-br from-orange-100 to-red-100 dark:from-orange-900/20 dark:to-red-900/20 rounded-t-lg flex items-center justify-center">
          <div className="text-center space-y-2">
            <Utensils className="h-12 w-12 mx-auto text-primary/60" />
            <p className="text-sm text-muted-foreground">{t('info.atmosphere')}</p>
          </div>
        </div>
        <div className="p-4">
          <h4 className="font-semibold mb-2">{t('info.atmosphereTitle')}</h4>
          <p className="text-sm text-muted-foreground">{t('info.atmosphereDesc')}</p>
        </div>
      </CardContent>
    </Card>
  </div>
</main>
//     <main className="container mx-auto px-4 py-8 max-w-6xl">
//         {/* Header */}
//         <div className="text-center lg:text-left py-6">
//           <h1 className="text-3xl font-bold tracking-tight">{t('header.title')}</h1>
//           <p className="text-muted-foreground mt-2">{t('header.subtitle')}</p>
//         </div>
//     <div className="grid gap-8 lg:grid-cols-2">
//       {/* Left Column - Form */}
//       <div className="space-y-6">
        

//         {/* Reservation Form */}
//         <Card className="shadow-lg">
//           <CardHeader>
//             <CardTitle className="flex items-center gap-2">
//               <Utensils className="h-5 w-5 text-primary" />
//               {t('form.details')}
//             </CardTitle>
//           </CardHeader>
//           <CardContent className="space-y-6">
//             {/* Success/Error Messages */}
//             {actionData?.error && (
//               <Alert variant="destructive">
//                 <AlertCircle className="h-4 w-4" />
//                 <AlertDescription>{actionData.error}</AlertDescription>
//               </Alert>
//             )}

//             <Form method="post" className="space-y-4">
//               {/* Contact Information */}
//               <div className="space-y-4">
//                 <h3 className="font-semibold text-sm uppercase tracking-wide text-muted-foreground">{t('form.contact')}</h3>
                
//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                   {/* Name */}
//                   <div className="space-y-2">
//                     <Label htmlFor="name" className="text-sm font-medium">{t('form.name')} *</Label>
//                     <div className="relative">
//                       <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
//                       <Input
//                         id="name"
//                         name="name"
//                         placeholder={t('form.placeholders.name')}
//                         defaultValue={actionData?.fields?.name || ''}
//                         className="pl-10"
//                         required
//                       />
//                     </div>
//                     {actionData?.errors?.name && (
//                       <p className="text-sm text-destructive">{actionData.errors.name}</p>
//                     )}
//                   </div>

//                   {/* Phone */}
//                   <div className="space-y-2">
//                     <Label htmlFor="phone" className="text-sm font-medium">{t('form.phone')} *</Label>
//                     <div className="relative">
//                       <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
//                       <Input
//                         id="phone"
//                         name="phone"
//                         type="tel"
//                         placeholder={t('form.placeholders.phone')}
//                         defaultValue={actionData?.fields?.phone || ''}
//                         className="pl-10"
//                         required
//                       />
//                     </div>
//                     {actionData?.errors?.phone && (
//                       <p className="text-sm text-destructive">{actionData.errors.phone}</p>
//                     )}
//                   </div>
//                 </div>

//                 {/* Email */}
//                 <div className="space-y-2">
//                   <Label htmlFor="email" className="text-sm font-medium">{t('form.email')} *</Label>
//                   <Input
//                     id="email"
//                     name="email"
//                     type="email"
//                     placeholder={t('form.placeholders.email')}
//                     defaultValue={actionData?.fields?.email || ''}
//                     required
//                   />
//                   {actionData?.errors?.email && (
//                     <p className="text-sm text-destructive">{actionData.errors.email}</p>
//                   )}
//                 </div>
//               </div>

//               {/* Reservation Details */}
//               <div className="space-y-4">
//                 <h3 className="font-semibold text-sm uppercase tracking-wide text-muted-foreground">{t('form.details')}</h3>

//                 <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//                   {/* Date */}
//                   <div className="space-y-2">
//                     <Label htmlFor="date" className="text-sm font-medium">{t('form.date')} *</Label>
//                     <div className="relative">
//                       <Calendar className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
//                       <Input
//                         id="date"
//                         name="date"
//                         type="date"
//                         min={availableDates[0]}
//                         max={availableDates[availableDates.length - 1]}
//                         value={selectedDate}
//                         onChange={(e) => setSelectedDate(e.target.value)}
//                         defaultValue={actionData?.fields?.date || ''}
//                         className="pl-10"
//                         required
//                       />
//                     </div>
//                     {actionData?.errors?.date && (
//                       <p className="text-sm text-destructive">{actionData.errors.date}</p>
//                     )}
//                   </div>

//                   {/* Time */}
//                   <div className="space-y-2">
//                     <Label htmlFor="time" className="text-sm font-medium">{t('form.time')} *</Label>
//                     <div className="relative">
//                       <Clock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
//                       <select
//                         id="time"
//                         name="time"
//                         value={selectedTime}
//                         onChange={(e) => setSelectedTime(e.target.value)}
//                         className="w-full pl-10 pr-4 py-2 border border-input bg-background text-sm rounded-md focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent"
//                         required
//                       >
//                         <option value="">{t('form.time')}</option>
//                         {timeSlots.map((slot) => (
//                           <option key={slot} value={slot}>
//                             {slot}
//                           </option>
//                         ))}
//                       </select>
//                     </div>
//                     {actionData?.errors?.time && (
//                       <p className="text-sm text-destructive">{actionData.errors.time}</p>
//                     )}
//                   </div>

//                   {/* Guests */}
//                   <div className="space-y-2">
//                     <Label htmlFor="guests" className="text-sm font-medium">{t('form.guests')} *</Label>
//                     <div className="relative">
//                       <Users className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
//                       <Input
//                         id="guests"
//                         name="guests"
//                         type="number"
//                         min="1"
//                         max="12"
//                         value={guestCount}
//                         onChange={(e) => setGuestCount(parseInt(e.target.value))}
//                         defaultValue={actionData?.fields?.guests || 2}
//                         className="pl-10"
//                         required
//                       />
//                     </div>
//                     {actionData?.errors?.guests && (
//                       <p className="text-sm text-destructive">{actionData.errors.guests}</p>
//                     )}
//                   </div>
//                 </div>
//               </div>

//               {/* Special Requests */}
//               <div className="space-y-2">
//                     <Label htmlFor="specialRequests" className="text-sm font-medium">{t('form.specialRequests')}</Label>
//                 <div className="relative">
//                   <MessageSquare className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
//                   <Textarea
//                     id="specialRequests"
//                     name="specialRequests"
//                     placeholder={t('form.placeholders.requests')}
//                     defaultValue={actionData?.fields?.specialRequests || ''}
//                     className="pl-10 min-h-[80px] resize-none"
//                   />
//                 </div>
//               </div>

//               {/* Submit Button */}
//               <Button
//                 type="submit"
//                 className="w-full"
//                 disabled={isSubmitting}
//                 size="lg"
//               >
//                 {isSubmitting ? (
//                   <div className="flex items-center space-x-2">
//                     <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
//                     <span>{t('form.submitting')}</span>
//                   </div>
//                 ) : (
//                   <div className="flex items-center space-x-2">
//                     <CheckCircle className="h-4 w-4" />
//                     <span>{t('form.submit')}</span>
//                   </div>
//                 )}
//               </Button>
//             </Form>
//           </CardContent>
//         </Card>
//       </div>

//       {/* Right Column - Info & Atmosphere */}
//       <div className="space-y-6">
//         {/* Restaurant Info */}
//         <Card>
//           <CardHeader>
//             <CardTitle className="flex items-center gap-2">
//               <MapPin className="h-5 w-5 text-primary" />
//               {t('info.restaurant')}
//             </CardTitle>
//           </CardHeader>
//           <CardContent className="space-y-4">
//             <div>
//               <h4 className="font-semibold">{t('info.location')}</h4>
//               <p className="text-sm text-muted-foreground">
//                 123 Mexican Street, Casablanca, Morocco
//               </p>
//             </div>
            
//             <div>
//               <h4 className="font-semibold">{t('info.hours')}</h4>
//               <div className="text-sm text-muted-foreground space-y-1">
//                 <p>Monday - Thursday: 5:00 PM - 10:00 PM</p>
//                 <p>Friday - Saturday: 5:00 PM - 11:00 PM</p>
//                 <p>Sunday: 5:00 PM - 9:00 PM</p>
//               </div>
//             </div>

//             <div>
//               <h4 className="font-semibold">{t('info.contact')}</h4>
//               <p className="text-sm text-muted-foreground">
//                 Phone: +212 522 123 456<br />
//                 Email: reservations@cantina-mariachi.com
//               </p>
//             </div>
//           </CardContent>
//         </Card>

//         {/* Policies */}
//         <Card>
//           <CardHeader>
//             <CardTitle>{t('policies.title')}</CardTitle>
//           </CardHeader>
//           <CardContent className="space-y-3 text-sm">
//             <div className="flex items-start space-x-2">
//               <Badge variant="secondary" className="mt-0.5">•</Badge>
//               <p>{t('policies.items.0')}</p>
//             </div>
//             <div className="flex items-start space-x-2">
//               <Badge variant="secondary" className="mt-0.5">•</Badge>
//               <p>{t('policies.items.1')}</p>
//             </div>
//             <div className="flex items-start space-x-2">
//               <Badge variant="secondary" className="mt-0.5">•</Badge>
//               <p>{t('policies.items.2')}</p>
//             </div>
//             <div className="flex items-start space-x-2">
//               <Badge variant="secondary" className="mt-0.5">•</Badge>
//               <p>{t('policies.items.3')}</p>
//             </div>
//           </CardContent>
//         </Card>
//    {/* Atmosphere Preview */}
//    <Card className="">
//           <CardContent className="p-0">
//             <div className="aspect-video bg-gradient-to-br from-orange-100 to-red-100 dark:from-orange-900/20 dark:to-red-900/20 rounded-t-lg flex items-center justify-center">
//               <div className="text-center space-y-2">
//                 <Utensils className="h-12 w-12 mx-auto text-primary/60" />
//                 <p className="text-sm text-muted-foreground">{t('info.atmosphere')}</p>
//               </div>
//             </div>
//             <div className="p-4">
//               <h4 className="font-semibold mb-2">{t('info.atmosphereTitle')}</h4>
//               <p className="text-sm text-muted-foreground">{t('info.atmosphereDesc')}</p>
//             </div>
//           </CardContent>
//         </Card>
       
//       </div>
    
//     </div>
//   </main>
  )
}
