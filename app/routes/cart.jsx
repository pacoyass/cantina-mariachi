import { useLoaderData, Form, Link, redirect, useFetcher } from "react-router";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Badge } from "../components/ui/badge";
import { useTranslation } from 'react-i18next';
import { Trash2, Plus, Minus, ShoppingCart } from "../lib/lucide-shim.js";
import { formatCurrency } from '../lib/utils';

export const meta = () => [
  { title: "Cart - Cantina" },
  { name: "description", content: "Review your order" },
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
      return { 
        cart: cartData.data || { items: [], total: 0 },
        error: null 
      };
    } else {
      return { 
        cart: { items: [], total: 0 },
        error: "Failed to load cart" 
      };
    }
  } catch (error) {
    console.error('Cart loader error:', error);
    return { 
      cart: { items: [], total: 0 },
      error: "Failed to load cart" 
    };
  }
}

export async function action({ request }) {
  const formData = await request.formData();
  const action = formData.get("action");
  const url = new URL(request.url);
  const cookie = request.headers.get("cookie") || "";

  try {
    if (action === "remove") {
      const itemId = formData.get("itemId");
      
      const response = await fetch(`${url.origin}/api/cart/remove`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Cookie": cookie
        },
        body: JSON.stringify({ itemId })
      });

      if (response.ok) {
        return redirect("/cart");
      }
    }
    
    if (action === "update") {
      const itemId = formData.get("itemId");
      const quantity = formData.get("quantity");
      
      const response = await fetch(`${url.origin}/api/cart/update`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Cookie": cookie
        },
        body: JSON.stringify({ 
          itemId, 
          quantity: parseInt(quantity) 
        })
      });

      if (response.ok) {
        return redirect("/cart");
      }
    }
    
    if (action === "clear") {
      const response = await fetch(`${url.origin}/api/cart/clear`, {
        method: "DELETE",
        headers: {
          "Cookie": cookie
        }
      });

      if (response.ok) {
        return redirect("/cart");
      }
    }
    
  } catch (error) {
    console.error('Cart action error:', error);
  }

  // Default: redirect back to cart
  return redirect("/cart");
}

export default function CartPage() {
  const { cart, error } = useLoaderData();
  const { t, i18n } = useTranslation(['ui', 'menu']);
  const fetcher = useFetcher();

  // Check if we're in a loading state for optimistic UI
  const isUpdating = fetcher.state !== 'idle';

  if (error) {
    return (
      <main className="container mx-auto p-6">
        <div className="text-center py-12">
          <p className="text-red-500 mb-4">{error}</p>
          <Link to="/menu">
            <Button>Back to Menu</Button>
          </Link>
        </div>
      </main>
    );
  }

  const isEmpty = !cart.items || cart.items.length === 0;

  return (
    <main className="container mx-auto p-6 max-w-4xl">
      <div className="grid gap-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <ShoppingCart className="size-8" />
            {t('cart.title', { defaultValue: 'Your Cart' })}
          </h1>
          <Link to="/menu">
            <Button variant="outline">{t('buttons.continueShopping', { defaultValue: 'Continue Shopping' })}</Button>
          </Link>
        </div>

        {isEmpty ? (
          // Empty cart state
          <Card>
            <CardContent className="text-center py-12">
              <ShoppingCart className="size-16 mx-auto mb-4 text-muted-foreground" />
              <h2 className="text-xl font-semibold mb-2">{t('cart.empty')}</h2>
              <p className="text-muted-foreground mb-6">
                {t('cart.emptyDescription', { defaultValue: 'Add some delicious items from our menu' })}
              </p>
              <Link to="/menu">
                <Button size="lg">{t('buttons.browseMenu', { defaultValue: 'Browse Menu' })}</Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          // Cart with items
          <div className="grid lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-4">
              {/* Cart Items */}
              {cart.items.map((item) => (
                <Card key={item.itemId}>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-4">
                      {/* Item image placeholder */}
                      <div className="w-16 h-16 bg-muted rounded-md flex-shrink-0" />
                      
                      {/* Item details */}
                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium truncate">
                          {item.name || `Item ${item.itemId}`}
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          {formatCurrency(12.99, i18n.language)} {/* Mock price */}
                        </p>
                        {item.notes && (
                          <p className="text-xs text-muted-foreground mt-1">
                            Note: {item.notes}
                          </p>
                        )}
                      </div>
                      
                      {/* Quantity controls */}
                      <div className="flex items-center gap-2">
                        <Form method="post" className="inline">
                          <input type="hidden" name="action" value="update" />
                          <input type="hidden" name="itemId" value={item.itemId} />
                          <input type="hidden" name="quantity" value={Math.max(1, item.quantity - 1)} />
                          <Button 
                            type="submit" 
                            size="icon" 
                            variant="outline" 
                            className="size-8"
                            disabled={item.quantity <= 1 || isUpdating}
                          >
                            <Minus className="size-3" />
                          </Button>
                        </Form>
                        
                        <span className="w-8 text-center font-medium">{item.quantity}</span>
                        
                        <Form method="post" className="inline">
                          <input type="hidden" name="action" value="update" />
                          <input type="hidden" name="itemId" value={item.itemId} />
                          <input type="hidden" name="quantity" value={item.quantity + 1} />
                          <Button 
                            type="submit" 
                            size="icon" 
                            variant="outline" 
                            className="size-8"
                            disabled={isUpdating}
                          >
                            <Plus className="size-3" />
                          </Button>
                        </Form>
                      </div>
                      
                      {/* Remove button */}
                      <Form method="post" className="inline">
                        <input type="hidden" name="action" value="remove" />
                        <input type="hidden" name="itemId" value={item.itemId} />
                        <Button 
                          type="submit" 
                          size="icon" 
                          variant="ghost" 
                          className="size-8 text-red-500 hover:text-red-700"
                          disabled={isUpdating}
                        >
                          <Trash2 className="size-4" />
                        </Button>
                      </Form>
                    </div>
                  </CardContent>
                </Card>
              ))}
              
              {/* Clear cart button */}
              <div className="pt-4">
                <Form method="post" className="inline">
                  <input type="hidden" name="action" value="clear" />
                  <Button 
                    type="submit" 
                    variant="outline" 
                    className="text-red-500 hover:text-red-700"
                    disabled={isUpdating}
                  >
                    <Trash2 className="size-4 mr-2" />
                    {t('cart.clear', { defaultValue: 'Clear Cart' })}
                  </Button>
                </Form>
              </div>
            </div>
            
            {/* Order Summary */}
            <div className="lg:col-span-1">
              <Card className="sticky top-6">
                <CardHeader>
                  <CardTitle>{t('cart.orderSummary', { defaultValue: 'Order Summary' })}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between">
                    <span>{t('cart.subtotal')}</span>
                    <span>{formatCurrency(cart.total || 0, i18n.language)}</span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span>{t('cart.tax')}</span>
                    <span>{formatCurrency((cart.total || 0) * 0.1, i18n.language)}</span>
                  </div>
                  
                  <hr />
                  
                  <div className="flex justify-between font-bold">
                    <span>{t('cart.total')}</span>
                    <span>{formatCurrency((cart.total || 0) * 1.1, i18n.language)}</span>
                  </div>
                  
                  <div className="pt-4 space-y-2">
                    <Link to="/checkout" className="block">
                      <Button className="w-full" size="lg">
                        {t('buttons.checkout')}
                      </Button>
                    </Link>
                    
                    <div className="text-center">
                      <Badge variant="secondary" className="text-xs">
                        {t('cart.itemCount', { count: cart.items?.length || 0 })}
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}