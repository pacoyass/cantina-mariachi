import Menu from "@/pages/menu/menu";
import { redirect } from "react-router";


export const meta = () => [
  { title: "Menu - Cantina" },
  { name: "description", content: "Explore our categories and items" },
];

export async function action({ request }) {
  const formData = await request.formData();
  const action = formData.get("action");
  const url = new URL(request.url);
  const cookie = request.headers.get("cookie") || "";

  if (action === "add") {
    const itemId = formData.get("itemId");
    const quantity = formData.get("quantity") || "1";
    const notes = formData.get("notes") || "";

    try {
      const response = await fetch(`${url.origin}/api/cart/add`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Cookie": cookie
        },
        body: JSON.stringify({
          itemId,
          quantity: parseInt(quantity),
          notes
        })
      });

      if (response.ok) {
        // Redirect back to menu to show updated state
        return redirect(`/menu${url.search}`);
      } else {
        // Handle error - for now just redirect back
        return redirect(`/menu${url.search}`);
      }
    } catch (error) {
      console.error('Failed to add item to cart:', error);
      return redirect(`/menu${url.search}`);
    }
  }

  // Default: redirect back to menu
  return redirect(`/menu${url.search}`);
}

export async function loader({ request }) {
  const url = new URL(request.url);
  const categoryId = url.searchParams.get("categoryId") || "";
  const cookie = request.headers.get("cookie") || "";

  async function jsonOrNull(res) {
    try { return await res.json(); } catch { return null; }
  }

  const lng = url.searchParams.get('lng') || request?.language || 'en';
  const [catRes, itemsRes, cmsRes] = await Promise.all([
    fetch(`${url.origin}/api/menu/categories`, { headers: { cookie } }),
    fetch(`${url.origin}/api/menu/items${categoryId ? `?categoryId=${encodeURIComponent(categoryId)}` : ""}`, { headers: { cookie } }),
    fetch(`${url.origin}/api/cms/menu?locale=${encodeURIComponent(lng)}`, { headers: { cookie } }),
  ]);
  const cats = await jsonOrNull(catRes);
  const items = await jsonOrNull(itemsRes);
  const cmsJson = await jsonOrNull(cmsRes);

  return {
    categories: cats?.data?.categories ?? [],
    items: items?.data?.items ?? [],
    activeCategoryId: categoryId,
    cms: cmsJson?.data?.page?.data || {},
  };
}



export default function MenuPage({loaderData}) {
  const { categories, items, activeCategoryId, cms } = loaderData;
  return (
    <div className="w-full h-svh min-h-max flex justify-center items-center">
    <Menu
   categories={categories} 
   items={items} 
   activeCategoryId={activeCategoryId} 
   cms={cms}
    />
   </div>
  );
}

