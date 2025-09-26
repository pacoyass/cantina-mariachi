import { useLoaderData, Form, Link, redirect } from "react-router";
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Badge } from "../../components/ui/badge";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Textarea } from "../../components/ui/textarea";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/select";
import { useTranslation } from 'react-i18next';
import { 
  Plus,
  Search,
  Edit,
  Trash2,
  Eye,
  EyeOff,
  Star,
  ImageIcon
} from "../../lib/lucide-shim.js";
import { formatCurrency } from '../../lib/utils';

export const meta = () => [
  { title: "Menu Management - Admin - Cantina" },
];

export async function loader({ request }) {
  const url = new URL(request.url);
  const cookie = request.headers.get("cookie") || "";
  
  try {
    const [menuRes, categoriesRes] = await Promise.all([
      fetch(`${url.origin}/api/menu/items`, { headers: { cookie } }),
      fetch(`${url.origin}/api/menu/categories`, { headers: { cookie } })
    ]);
    
    const menuData = menuRes.ok ? await menuRes.json() : null;
    const categoriesData = categoriesRes.ok ? await categoriesRes.json() : null;
    
    return {
      menuItems: menuData?.data?.items || [],
      categories: categoriesData?.data?.categories || []
    };
  } catch (error) {
    console.error('Menu loader error:', error);
  }
  
  // Mock data for development
  const mockCategories = [
    { id: '1', name: 'Appetizers', order: 1 },
    { id: '2', name: 'Tacos', order: 2 },
    { id: '3', name: 'Burritos', order: 3 },
    { id: '4', name: 'Quesadillas', order: 4 },
    { id: '5', name: 'Beverages', order: 5 }
  ];
  
  const mockMenuItems = [
    {
      id: '1',
      name: 'Guacamole',
      description: 'Fresh avocado dip with lime and cilantro',
      price: 8.99,
      image: null,
      isVegetarian: true,
      isVegan: true,
      isAvailable: true,
      isSpecial: false,
      categoryId: '1',
      category: { name: 'Appetizers' },
      orderCount: 45
    },
    {
      id: '2',
      name: 'Tacos al Pastor',
      description: 'Marinated pork with pineapple, onion, and cilantro',
      price: 12.99,
      image: null,
      isVegetarian: false,
      isVegan: false,
      isAvailable: true,
      isSpecial: true,
      categoryId: '2',
      category: { name: 'Tacos' },
      orderCount: 89
    },
    {
      id: '3',
      name: 'Veggie Burrito',
      description: 'Black beans, rice, peppers, onions, and salsa',
      price: 11.99,
      image: null,
      isVegetarian: true,
      isVegan: false,
      isAvailable: false,
      isSpecial: false,
      categoryId: '3',
      category: { name: 'Burritos' },
      orderCount: 23
    }
  ];
  
  return {
    menuItems: mockMenuItems,
    categories: mockCategories
  };
}

export async function action({ request }) {
  const formData = await request.formData();
  const action = formData.get("action");
  const url = new URL(request.url);
  const cookie = request.headers.get("cookie") || "";

  if (action === "toggleAvailability") {
    const itemId = formData.get("itemId");
    const isAvailable = formData.get("isAvailable") === "true";
    
    try {
      const response = await fetch(`${url.origin}/api/admin/menu/${itemId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Cookie": cookie
        },
        body: JSON.stringify({ isAvailable: !isAvailable })
      });

      if (response.ok) {
        return { success: true, message: "Item availability updated" };
      }
    } catch (error) {
      console.error('Toggle availability error:', error);
    }
    
    return { success: false, message: "Failed to update item" };
  }

  if (action === "delete") {
    const itemId = formData.get("itemId");
    
    try {
      const response = await fetch(`${url.origin}/api/admin/menu/${itemId}`, {
        method: "DELETE",
        headers: { "Cookie": cookie }
      });

      if (response.ok) {
        return { success: true, message: "Item deleted successfully" };
      }
    } catch (error) {
      console.error('Delete item error:', error);
    }
    
    return { success: false, message: "Failed to delete item" };
  }

  if (action === "create" || action === "update") {
    const itemData = {
      name: formData.get("name"),
      description: formData.get("description"),
      price: parseFloat(formData.get("price")),
      categoryId: formData.get("categoryId"),
      isVegetarian: formData.get("isVegetarian") === "on",
      isVegan: formData.get("isVegan") === "on",
      isSpecial: formData.get("isSpecial") === "on",
      isAvailable: formData.get("isAvailable") === "on"
    };

    const itemId = formData.get("itemId");
    const method = action === "create" ? "POST" : "PUT";
    const endpoint = action === "create" 
      ? `${url.origin}/api/admin/menu` 
      : `${url.origin}/api/admin/menu/${itemId}`;

    try {
      const response = await fetch(endpoint, {
        method,
        headers: {
          "Content-Type": "application/json",
          "Cookie": cookie
        },
        body: JSON.stringify(itemData)
      });

      if (response.ok) {
        return redirect("/admin/menu");
      }
    } catch (error) {
      console.error('Save item error:', error);
    }
    
    return { success: false, message: `Failed to ${action} item` };
  }

  return { success: false, message: "Unknown action" };
}

export default function MenuManagement() {
  const { menuItems, categories } = useLoaderData();
  const { t, i18n } = useTranslation(['admin', 'ui']);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [editingItem, setEditingItem] = useState(null);
  const [showForm, setShowForm] = useState(false);

  const filteredItems = menuItems.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = !selectedCategory || item.categoryId === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const resetForm = () => {
    setEditingItem(null);
    setShowForm(false);
  };

  const startEdit = (item) => {
    setEditingItem(item);
    setShowForm(true);
  };

  const startCreate = () => {
    setEditingItem(null);
    setShowForm(true);
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            {t('menu.title', { defaultValue: 'Menu Management' })}
          </h1>
          <p className="text-gray-600 mt-1">
            {t('menu.subtitle', { defaultValue: 'Manage your restaurant menu items and categories' })}
          </p>
        </div>
        <Button onClick={startCreate}>
          <Plus className="size-4 mr-2" />
          {t('menu.addItem', { defaultValue: 'Add Menu Item' })}
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>{t('menu.filters', { defaultValue: 'Filters' })}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 size-4 text-gray-400" />
              <Input
                placeholder={t('menu.searchPlaceholder', { defaultValue: 'Search menu items...' })}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger>
                <SelectValue placeholder={t('menu.allCategories', { defaultValue: 'All Categories' })} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">{t('menu.allCategories', { defaultValue: 'All Categories' })}</SelectItem>
                {categories.map((category) => (
                  <SelectItem key={category.id} value={category.id}>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Button 
              variant="outline" 
              onClick={() => {
                setSearchTerm("");
                setSelectedCategory("");
              }}
              disabled={!searchTerm && !selectedCategory}
            >
              {t('menu.clearFilters', { defaultValue: 'Clear Filters' })}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Menu Items Grid */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filteredItems.map((item) => (
          <Card key={item.id} className={`relative ${!item.isAvailable ? 'opacity-60' : ''}`}>
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="text-lg">{item.name}</CardTitle>
                  <div className="flex items-center space-x-1 mt-1">
                    <Badge variant="outline" className="text-xs">
                      {item.category?.name}
                    </Badge>
                    {item.isVegetarian && (
                      <Badge variant="secondary" className="text-xs">V</Badge>
                    )}
                    {item.isVegan && (
                      <Badge variant="secondary" className="text-xs">VG</Badge>
                    )}
                    {item.isSpecial && (
                      <Badge variant="default" className="text-xs">
                        <Star className="size-3 mr-1" />
                        Special
                      </Badge>
                    )}
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-bold text-lg">
                    {formatCurrency(item.price, i18n.language)}
                  </div>
                  {item.orderCount && (
                    <div className="text-xs text-gray-500">
                      {item.orderCount} orders
                    </div>
                  )}
                </div>
              </div>
            </CardHeader>
            
            <CardContent className="space-y-4">
              {/* Image placeholder */}
              <div className="aspect-video bg-gray-100 rounded-md flex items-center justify-center">
                {item.image ? (
                  <img src={item.image} alt={item.name} className="w-full h-full object-cover rounded-md" />
                ) : (
                  <ImageIcon className="size-8 text-gray-400" />
                )}
              </div>
              
              <p className="text-sm text-gray-600 line-clamp-2">
                {item.description}
              </p>
              
              {/* Actions */}
              <div className="flex items-center justify-between pt-2">
                <div className="flex space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => startEdit(item)}
                  >
                    <Edit className="size-4" />
                  </Button>
                  
                  <Form method="post" className="inline">
                    <input type="hidden" name="action" value="toggleAvailability" />
                    <input type="hidden" name="itemId" value={item.id} />
                    <input type="hidden" name="isAvailable" value={item.isAvailable.toString()} />
                    <Button
                      type="submit"
                      variant="outline"
                      size="sm"
                      className={item.isAvailable ? 'text-green-600' : 'text-gray-400'}
                    >
                      {item.isAvailable ? <Eye className="size-4" /> : <EyeOff className="size-4" />}
                    </Button>
                  </Form>
                  
                  <Form 
                    method="post" 
                    className="inline"
                    onSubmit={(e) => {
                      if (!confirm('Are you sure you want to delete this item?')) {
                        e.preventDefault();
                      }
                    }}
                  >
                    <input type="hidden" name="action" value="delete" />
                    <input type="hidden" name="itemId" value={item.id} />
                    <Button
                      type="submit"
                      variant="outline"
                      size="sm"
                      className="text-red-600 hover:text-red-800"
                    >
                      <Trash2 className="size-4" />
                    </Button>
                  </Form>
                </div>
                
                <Badge variant={item.isAvailable ? "success" : "secondary"}>
                  {item.isAvailable ? 'Available' : 'Unavailable'}
                </Badge>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredItems.length === 0 && (
        <Card>
          <CardContent className="text-center py-8">
            <p className="text-gray-500">
              {t('menu.noItems', { defaultValue: 'No menu items found' })}
            </p>
          </CardContent>
        </Card>
      )}

      {/* Edit/Create Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <CardHeader>
              <CardTitle>
                {editingItem 
                  ? t('menu.editItem', { defaultValue: 'Edit Menu Item' })
                  : t('menu.createItem', { defaultValue: 'Create Menu Item' })
                }
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Form method="post" className="space-y-4">
                <input type="hidden" name="action" value={editingItem ? "update" : "create"} />
                {editingItem && <input type="hidden" name="itemId" value={editingItem.id} />}
                
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div>
                    <Label htmlFor="name">{t('menu.form.name', { defaultValue: 'Name' })}</Label>
                    <Input
                      id="name"
                      name="name"
                      required
                      defaultValue={editingItem?.name || ""}
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="price">{t('menu.form.price', { defaultValue: 'Price' })}</Label>
                    <Input
                      id="price"
                      name="price"
                      type="number"
                      step="0.01"
                      required
                      defaultValue={editingItem?.price || ""}
                    />
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="categoryId">{t('menu.form.category', { defaultValue: 'Category' })}</Label>
                  <Select name="categoryId" defaultValue={editingItem?.categoryId || ""}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category.id} value={category.id}>
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label htmlFor="description">{t('menu.form.description', { defaultValue: 'Description' })}</Label>
                  <Textarea
                    id="description"
                    name="description"
                    required
                    defaultValue={editingItem?.description || ""}
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="isVegetarian"
                      name="isVegetarian"
                      defaultChecked={editingItem?.isVegetarian || false}
                    />
                    <Label htmlFor="isVegetarian">{t('menu.form.vegetarian', { defaultValue: 'Vegetarian' })}</Label>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="isVegan"
                      name="isVegan"
                      defaultChecked={editingItem?.isVegan || false}
                    />
                    <Label htmlFor="isVegan">{t('menu.form.vegan', { defaultValue: 'Vegan' })}</Label>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="isSpecial"
                      name="isSpecial"
                      defaultChecked={editingItem?.isSpecial || false}
                    />
                    <Label htmlFor="isSpecial">{t('menu.form.special', { defaultValue: 'Special Item' })}</Label>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="isAvailable"
                      name="isAvailable"
                      defaultChecked={editingItem?.isAvailable !== false}
                    />
                    <Label htmlFor="isAvailable">{t('menu.form.available', { defaultValue: 'Available' })}</Label>
                  </div>
                </div>
                
                <div className="flex justify-end space-x-3 pt-4">
                  <Button type="button" variant="outline" onClick={resetForm}>
                    {t('menu.form.cancel', { defaultValue: 'Cancel' })}
                  </Button>
                  <Button type="submit">
                    {editingItem 
                      ? t('menu.form.update', { defaultValue: 'Update' })
                      : t('menu.form.create', { defaultValue: 'Create' })
                    }
                  </Button>
                </div>
              </Form>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}