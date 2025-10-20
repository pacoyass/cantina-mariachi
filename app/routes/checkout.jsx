import { redirect } from "react-router";
import Checkout from "@/pages/checkout";

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

export default function CheckoutPage({loaderData,actionData}) {
  const { cart ,error} = loaderData;
  const errors = actionData?.errors || error  || {};


  return (
<div className="w-full h-svh min-h-max flex justify-center items-center">
  <Checkout
  errors={errors}
  cart={cart}
  />
 </div>
  );
}