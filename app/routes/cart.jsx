import Cart from "@/pages/cart";
import { redirect } from "react-router";


export const meta = () => [
  { title: "Cart - Cantina" },
  { name: "description", content: "Review your order" },
];

export async function loader( { request } )
{
  const url = new URL( request.url );
  const cookie = request.headers.get( "cookie" ) || "";

  try {
    // Get cart from session/cookie
    const cartRes = await fetch( `${url.origin}/api/cart`, {
      headers: { cookie }
    } );

    if ( cartRes.ok ) {
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
  } catch ( error ) {
    console.error( 'Cart loader error:', error );
    return {
      cart: { items: [], total: 0 },
      error: "Failed to load cart"
    };
  }
}

export async function action( { request } )
{
  const formData = await request.formData();
  const action = formData.get( "action" );
  const url = new URL( request.url );
  const cookie = request.headers.get( "cookie" ) || "";

  try {
    if ( action === "remove" ) {
      const itemId = formData.get( "itemId" );

      const response = await fetch( `${url.origin}/api/cart/remove`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Cookie": cookie
        },
        body: JSON.stringify( { itemId } )
      } );

      if ( response.ok ) {
        return redirect( "/cart" );
      }
    }

    if ( action === "update" ) {
      const itemId = formData.get( "itemId" );
      const quantity = formData.get( "quantity" );

      const response = await fetch( `${url.origin}/api/cart/update`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Cookie": cookie
        },
        body: JSON.stringify( {
          itemId,
          quantity: parseInt( quantity )
        } )
      } );

      if ( response.ok ) {
        return redirect( "/cart" );
      }
    }

    if ( action === "clear" ) {
      const response = await fetch( `${url.origin}/api/cart/clear`, {
        method: "DELETE",
        headers: {
          "Cookie": cookie
        }
      } );

      if ( response.ok ) {
        return redirect( "/cart" );
      }
    }

  } catch ( error ) {
    console.error( 'Cart action error:', error );
  }

  // Default: redirect back to cart
  return redirect( "/cart" );
}

export default function CartPage( { loaderData, actionData } )
{
  const { cart, error } = loaderData;




  return (
    <div className="w-full h-svh min-h-max flex justify-center items-center">
      <Cart
        error={error}
        cart={cart}
      />
    </div>
  );
}