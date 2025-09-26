import { useLoaderData, Form, redirect, useActionData, Link } from "react-router";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Textarea } from "../components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "../components/ui/radio-group";
import { Badge } from "../components/ui/badge";
import { useTranslation } from 'react-i18next';
import { CreditCard, MapPin, Clock, ShoppingCart } from "../lib/lucide-shim.js";
import { formatCurrency } from '../lib/utils';

export const meta = () => [
  { title: "Checkout - Cantina" },
  { name: "description", content: "Complete your order" },
];

export async function loader({ request }) {
  const url = new URL(request.url);
  const cookie = request.headers.get("cookie") || "";
  
  try {
    // Get cart from session/cookie
    const cartRes = await fetch(`${url.origin}/api/cart`, {
      headers: { cookie }
    });
    
    if (cartRes.ok) {
      const cartData = await cartRes.json();
      const cart = cartData.data || { items: [], total: 0 };
      
      // Redirect to cart if empty
      if (!cart.items || cart.items.length === 0) {
        throw redirect("/cart");
      }
      
      return { 
        cart,
        error: null 
      };
    } else {
      throw redirect("/cart");
    }
  } catch (error) {
    if (error instanceof Response) throw error; // Re-throw redirects
    console.error('Checkout loader error:', error);
    throw redirect("/cart");
  }
}

export async function action({ request }) {
  const formData = await request.formData();
  const url = new URL(request.url);
  const cookie = request.headers.get("cookie") || "";

  // Extract form data
  const orderData = {
    customerName: formData.get("customerName"),
    customerEmail: formData.get("customerEmail"),
    customerPhone: formData.get("customerPhone"),
    type: formData.get("orderType"), // "DELIVERY" or "PICKUP"
    notes: formData.get("notes") || "",
    deliveryAddress: formData.get("deliveryAddress") || "",
    deliveryInstructions: formData.get("deliveryInstructions") || "",
  };

  // Basic validation
  const errors = {};
  if (!orderData.customerName?.trim()) {
    errors.customerName = "Name is required";
  }
  if (!orderData.customerEmail?.trim()) {
    errors.customerEmail = "Email is required";
  }
  if (!orderData.customerPhone?.trim()) {
    errors.customerPhone = "Phone is required";
  }
  if (!orderData.type) {
    errors.orderType = "Please select delivery or pickup";
  }
  if (orderData.type === "DELIVERY" && !orderData.deliveryAddress?.trim()) {
    errors.deliveryAddress = "Delivery address is required";
  }

  // Return errors if validation fails
  if (Object.keys(errors).length > 0) {
    return { errors, success: false };
  }

  try {
    // Create order via API
    const response = await fetch(`${url.origin}/api/orders`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Cookie": cookie
      },
      body: JSON.stringify(orderData)
    });

    if (response.ok) {
      const result = await response.json();
      const order = result.data;
      
      // Clear cart after successful order
      await fetch(`${url.origin}/api/cart/clear`, {
        method: "DELETE",
        headers: { "Cookie": cookie }
      });
      
      // Redirect to order confirmation
      return redirect(`/orders/${order.orderNumber}`);
    } else {
      const errorData = await response.json();
      return { 
        errors: { general: errorData.message || "Failed to create order" }, 
        success: false 
      };
    }
  } catch (error) {
    console.error('Checkout action error:', error);
    return { 
      errors: { general: "Failed to create order. Please try again." }, 
      success: false 
    };
  }
}

export default function CheckoutPage() {
  const { cart } = useLoaderData();
  const actionData = useActionData();
  const { t, i18n } = useTranslation(['ui', 'auth']);
  
  const errors = actionData?.errors || {};
  const subtotal = cart.total || 0;
  const tax = subtotal * 0.1;
  const total = subtotal + tax;

  return (
    <main className="container mx-auto p-6 max-w-6xl">
      <div className="grid lg:grid-cols-2 gap-8">
        {/* Order Form */}
        <div className="space-y-6">
          <div className="flex items-center gap-2">
            <CreditCard className="size-6" />
            <h1 className="text-3xl font-bold">{t('checkout.title', { defaultValue: 'Checkout' })}</h1>
          </div>

          <Form method="post" className="space-y-6">
            {/* Customer Information */}
            <Card>
              <CardHeader>
                <CardTitle>{t('checkout.customerInfo', { defaultValue: 'Customer Information' })}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="customerName">{t('fields.name', { ns: 'auth' })}</Label>
                    <Input 
                      id="customerName" 
                      name="customerName" 
                      required 
                      placeholder={t('placeholders.name', { ns: 'auth' })}
                      className={errors.customerName ? "border-red-500" : ""}
                    />
                    {errors.customerName && (
                      <p className="text-sm text-red-500 mt-1">{errors.customerName}</p>
                    )}
                  </div>
                  
                  <div>
                    <Label htmlFor="customerPhone">{t('fields.phone', { ns: 'auth' })}</Label>
                    <Input 
                      id="customerPhone" 
                      name="customerPhone" 
                      type="tel" 
                      required 
                      placeholder={t('placeholders.phone', { ns: 'auth' })}
                      className={errors.customerPhone ? "border-red-500" : ""}
                    />
                    {errors.customerPhone && (
                      <p className="text-sm text-red-500 mt-1">{errors.customerPhone}</p>
                    )}
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="customerEmail">{t('fields.email', { ns: 'auth' })}</Label>
                  <Input 
                    id="customerEmail" 
                    name="customerEmail" 
                    type="email" 
                    required 
                    placeholder={t('placeholders.email', { ns: 'auth' })}
                    className={errors.customerEmail ? "border-red-500" : ""}
                  />
                  {errors.customerEmail && (
                    <p className="text-sm text-red-500 mt-1">{errors.customerEmail}</p>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Order Type */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="size-5" />
                  {t('checkout.orderType', { defaultValue: 'Order Type' })}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <RadioGroup name="orderType" className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="DELIVERY" id="delivery" />
                    <Label htmlFor="delivery" className="flex-1">
                      <div className="font-medium">{t('checkout.delivery', { defaultValue: 'Delivery' })}</div>
                      <div className="text-sm text-muted-foreground">
                        {t('checkout.deliveryDesc', { defaultValue: 'We\'ll deliver to your address' })}
                      </div>
                    </Label>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="PICKUP" id="pickup" />
                    <Label htmlFor="pickup" className="flex-1">
                      <div className="font-medium">{t('checkout.pickup', { defaultValue: 'Pickup' })}</div>
                      <div className="text-sm text-muted-foreground">
                        {t('checkout.pickupDesc', { defaultValue: 'Pick up from our restaurant' })}
                      </div>
                    </Label>
                  </div>
                </RadioGroup>
                {errors.orderType && (
                  <p className="text-sm text-red-500 mt-2">{errors.orderType}</p>
                )}
              </CardContent>
            </Card>

            {/* Delivery Address (conditional) */}
            <Card>
              <CardHeader>
                <CardTitle>{t('checkout.deliveryDetails', { defaultValue: 'Delivery Details' })}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="deliveryAddress">
                    {t('checkout.address', { defaultValue: 'Address' })}
                  </Label>
                  <Textarea 
                    id="deliveryAddress" 
                    name="deliveryAddress" 
                    placeholder={t('checkout.addressPlaceholder', { defaultValue: 'Enter your full delivery address...' })}
                    className={errors.deliveryAddress ? "border-red-500" : ""}
                  />
                  {errors.deliveryAddress && (
                    <p className="text-sm text-red-500 mt-1">{errors.deliveryAddress}</p>
                  )}
                </div>
                
                <div>
                  <Label htmlFor="deliveryInstructions">
                    {t('checkout.instructions', { defaultValue: 'Delivery Instructions (Optional)' })}
                  </Label>
                  <Textarea 
                    id="deliveryInstructions" 
                    name="deliveryInstructions" 
                    placeholder={t('checkout.instructionsPlaceholder', { defaultValue: 'Special delivery instructions...' })}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Order Notes */}
            <Card>
              <CardHeader>
                <CardTitle>{t('checkout.orderNotes', { defaultValue: 'Order Notes' })}</CardTitle>
              </CardHeader>
              <CardContent>
                <Textarea 
                  name="notes" 
                  placeholder={t('checkout.notesPlaceholder', { defaultValue: 'Any special requests or notes...' })}
                />
              </CardContent>
            </Card>

            {/* Error Message */}
            {errors.general && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-md">
                <p className="text-red-600">{errors.general}</p>
              </div>
            )}

            {/* Submit Button */}
            <Button type="submit" className="w-full" size="lg">
              <Clock className="size-4 mr-2" />
              {t('checkout.placeOrder', { defaultValue: 'Place Order' })}
            </Button>
          </Form>
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <Card className="sticky top-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ShoppingCart className="size-5" />
                {t('cart.orderSummary', { defaultValue: 'Order Summary' })}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Cart Items */}
              <div className="space-y-3">
                {cart.items.map((item) => (
                  <div key={item.itemId} className="flex justify-between items-start">
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium truncate">
                        {item.name || `Item ${item.itemId}`}
                      </h4>
                      <p className="text-sm text-muted-foreground">
                        Qty: {item.quantity} × {formatCurrency(12.99, i18n.language)}
                      </p>
                      {item.notes && (
                        <p className="text-xs text-muted-foreground">
                          Note: {item.notes}
                        </p>
                      )}
                    </div>
                    <div className="font-medium">
                      {formatCurrency(item.quantity * 12.99, i18n.language)}
                    </div>
                  </div>
                ))}
              </div>
              
              <hr />
              
              {/* Totals */}
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>{t('cart.subtotal')}</span>
                  <span>{formatCurrency(subtotal, i18n.language)}</span>
                </div>
                
                <div className="flex justify-between">
                  <span>{t('cart.tax')}</span>
                  <span>{formatCurrency(tax, i18n.language)}</span>
                </div>
                
                <hr />
                
                <div className="flex justify-between font-bold text-lg">
                  <span>{t('cart.total')}</span>
                  <span>{formatCurrency(total, i18n.language)}</span>
                </div>
              </div>
              
              <div className="pt-4">
                <Badge variant="secondary" className="w-full justify-center">
                  {t('cart.itemCount', { count: cart.items?.length || 0 })}
                </Badge>
              </div>
              
              <div className="pt-2">
                <Link to="/cart" className="block">
                  <Button variant="outline" className="w-full">
                    {t('buttons.editCart', { defaultValue: 'Edit Cart' })}
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  );
}