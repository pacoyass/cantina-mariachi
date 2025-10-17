import { useLoaderData, Form, redirect, useOutletContext } from "react-router";
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../../../components/ui/card";
import { Button } from "../../../components/ui/button";
import { Badge } from "../../../components/ui/badge";
import { Input } from "../../../components/ui/input";
import { Label } from "../../../components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../../components/ui/tabs";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../../components/ui/select";
import { Alert, AlertDescription } from "../../../components/ui/alert";
import { UserSessionManagement } from "../../../components/shared/UserSessionManagement";
import { useTranslation } from 'react-i18next';
import { 
  Plus,
  Search,
  Edit,
  Trash2,
  Eye,
  EyeOff,
  Shield,
  User,
  Mail,
  Phone,
  AlertCircle,
  CheckCircle
} from "../../../lib/lucide-shim.js";

export const meta = () => [
  { title: "Users Management - Admin - Cantina" },
];

const userRoles = [
  { value: 'CUSTOMER', label: 'Customer', color: 'default' },
  { value: 'CASHIER', label: 'Cashier', color: 'secondary' },
  { value: 'DRIVER', label: 'Driver', color: 'secondary' },
  { value: 'ADMIN', label: 'Admin', color: 'destructive' },
  { value: 'OWNER', label: 'Owner', color: 'destructive' }
];

export async function loader({ request }) {
  const url = new URL(request.url);
  const cookie = request.headers.get("cookie") || "";
  const role = url.searchParams.get("role") || "";
  const search = url.searchParams.get("search") || "";
  const status = url.searchParams.get("status") || "";
  
  try {
    // Fetch both users and sessions data
    const [usersRes, sessionsRes] = await Promise.all([
      fetch(`${url.origin}/api/admin/users?${new URLSearchParams({
        role,
        search,
        status
      })}`, {
        headers: { cookie }
      }),
      fetch(`${url.origin}/api/admin/users/sessions`, {
        headers: { cookie }
      })
    ]);
    
    if (usersRes.ok) {
      const usersData = await usersRes.json();
      const sessionsData = sessionsRes.ok ? await sessionsRes.json() : { data: [] };
      
      return {
        users: usersData.data?.users || [],
        usersWithSessions: sessionsData.data || [],
        filters: { role, search, status }
      };
    }
  } catch (error) {
    console.error('Users loader error:', error);
  }
  
  // Mock data for development
  const mockUsers = [
    {
      id: '1',
      name: 'John Smith',
      email: 'john@cantina.com',
      phone: '+1234567890',
      role: 'ADMIN',
      isActive: true,
      createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
      lastLogin: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString()
    },
    {
      id: '2',
      name: 'Maria Garcia',
      email: 'maria@cantina.com',
      phone: '+1234567891',
      role: 'COOK',
      isActive: true,
      createdAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
      lastLogin: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString()
    },
    {
      id: '3',
      name: 'Carlos Rodriguez',
      email: 'carlos@cantina.com',
      phone: '+1234567892',
      role: 'WAITER',
      isActive: false,
      createdAt: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000).toISOString(),
      lastLogin: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()
    },
    {
      id: '4',
      name: 'Jane Doe',
      email: 'jane@example.com',
      phone: '+1234567893',
      role: 'CUSTOMER',
      isActive: true,
      createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
      lastLogin: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString()
    }
  ];
  
  return {
    users: mockUsers,
    usersWithSessions: [],
    filters: { role, search, status }
  };
}

export async function action({ request }) {
  const formData = await request.formData();
  const action = formData.get("action");
  const url = new URL(request.url);
  const cookie = request.headers.get("cookie") || "";

  if (action === "toggleStatus") {
    const userId = formData.get("userId");
    const isActive = formData.get("isActive") === "true";
    
    try {
      const response = await fetch(`${url.origin}/api/admin/users/${userId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Cookie": cookie
        },
        body: JSON.stringify({ isActive: !isActive })
      });

      if (response.ok) {
        return { success: true, message: "User status updated" };
      }
    } catch (error) {
      console.error('Toggle status error:', error);
    }
    
    return { success: false, message: "Failed to update user" };
  }

  if (action === "updateRole") {
    const userId = formData.get("userId");
    const newRole = formData.get("role");
    
    try {
      const response = await fetch(`${url.origin}/api/admin/users/${userId}/role`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Cookie": cookie
        },
        body: JSON.stringify({ role: newRole })
      });

      if (response.ok) {
        return { success: true, message: "User role updated" };
      }
    } catch (error) {
      console.error('Update role error:', error);
    }
    
    return { success: false, message: "Failed to update user role" };
  }

  if (action === "create") {
    const userData = {
      name: formData.get("name"),
      email: formData.get("email"),
      phone: formData.get("phone"),
      role: formData.get("role"),
      password: formData.get("password")
    };

    try {
      const response = await fetch(`${url.origin}/api/admin/users`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Cookie": cookie
        },
        body: JSON.stringify(userData)
      });

      if (response.ok) {
        return redirect("/admin/users");
      }
    } catch (error) {
      console.error('Create user error:', error);
    }
    
    return { success: false, message: "Failed to create user" };
  }

  return { success: false, message: "Unknown action" };
}

const getRoleBadgeVariant = (role) => {
  const roleConfig = userRoles.find(r => r.value === role);
  return roleConfig?.color || 'default';
};

export default function UsersManagement() {
  const { users, usersWithSessions, filters } = useLoaderData();
  const { user: currentUser } = useOutletContext() || {};
  const { t } = useTranslation(['admin', 'ui']);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [activeTab, setActiveTab] = useState('users');

  const filteredUsers = users.filter(user => {
    const matchesRole = !filters.role || user.role === filters.role;
    const matchesSearch = !filters.search || 
      user.name.toLowerCase().includes(filters.search.toLowerCase()) ||
      user.email.toLowerCase().includes(filters.search.toLowerCase());
    const matchesStatus = !filters.status || 
      (filters.status === 'active' && user.isActive) ||
      (filters.status === 'inactive' && !user.isActive);
    
    return matchesRole && matchesSearch && matchesStatus;
  });

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            {t('users.title', { defaultValue: 'Users Management' })}
          </h1>
          <p className="text-gray-600 mt-1">
            {t('users.subtitle', { defaultValue: 'Manage staff and customer accounts' })}
          </p>
        </div>
        {activeTab === 'users' && (
          <Button onClick={() => setShowCreateForm(true)}>
            <Plus className="size-4 mr-2" />
            {t('users.addUser', { defaultValue: 'Add User' })}
          </Button>
        )}
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="users">
            <User className="size-4 mr-2" />
            Users
          </TabsTrigger>
          <TabsTrigger value="sessions">
            <Shield className="size-4 mr-2" />
            Sessions
          </TabsTrigger>
        </TabsList>

        {/* Users Tab */}
        <TabsContent value="users" className="space-y-6 mt-6">

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>{t('users.filters', { defaultValue: 'Filters' })}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 size-4 text-gray-400" />
              <Input
                placeholder={t('users.searchPlaceholder', { defaultValue: 'Search users...' })}
                defaultValue={filters.search}
                className="pl-10"
              />
            </div>
            
            <Select defaultValue={filters.role}>
              <SelectTrigger>
                <SelectValue placeholder={t('users.allRoles', { defaultValue: 'All Roles' })} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">{t('users.allRoles', { defaultValue: 'All Roles' })}</SelectItem>
                {userRoles.map((role) => (
                  <SelectItem key={role.value} value={role.value}>
                    {role.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select defaultValue={filters.status}>
              <SelectTrigger>
                <SelectValue placeholder={t('users.allStatuses', { defaultValue: 'All Statuses' })} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">{t('users.allStatuses', { defaultValue: 'All Statuses' })}</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>

            <Button variant="outline">
              {t('users.clearFilters', { defaultValue: 'Clear Filters' })}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Users List */}
      <Card>
        <CardHeader>
          <CardTitle>
            {t('users.list', { defaultValue: 'Users' })} ({filteredUsers.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredUsers.map((user) => (
              <div key={user.id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                <div className="flex items-center justify-between">
                  {/* User Info */}
                  <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
                      <User className="size-5 text-primary-foreground" />
                    </div>
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="font-medium">{user.name}</span>
                        <Badge variant={getRoleBadgeVariant(user.role)}>
                          {userRoles.find(r => r.value === user.role)?.label || user.role}
                        </Badge>
                        <Badge variant={user.isActive ? "success" : "secondary"}>
                          {user.isActive ? 'Active' : 'Inactive'}
                        </Badge>
                      </div>
                      <div className="flex items-center space-x-4 text-sm text-gray-600 mt-1">
                        <div className="flex items-center">
                          <Mail className="size-3 mr-1" />
                          {user.email}
                        </div>
                        {user.phone && (
                          <div className="flex items-center">
                            <Phone className="size-3 mr-1" />
                            {user.phone}
                          </div>
                        )}
                      </div>
                      <div className="text-xs text-gray-500 mt-1">
                        Created: {new Date(user.createdAt).toLocaleDateString()}
                        {user.lastLogin && (
                          <span className="ml-4">
                            Last login: {new Date(user.lastLogin).toLocaleDateString()}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center space-x-2">
                    {/* Role Change */}
                    <Form method="post" className="inline">
                      <input type="hidden" name="action" value="updateRole" />
                      <input type="hidden" name="userId" value={user.id} />
                      <Select 
                        name="role" 
                        defaultValue={user.role}
                        onValueChange={(value) => {
                          // This would trigger the form submission in a real implementation
                          console.log('Role change:', value);
                        }}
                      >
                        <SelectTrigger className="w-32">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {userRoles.map((role) => (
                            <SelectItem key={role.value} value={role.value}>
                              {role.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </Form>

                    {/* Toggle Status */}
                    <Form method="post" className="inline">
                      <input type="hidden" name="action" value="toggleStatus" />
                      <input type="hidden" name="userId" value={user.id} />
                      <input type="hidden" name="isActive" value={user.isActive.toString()} />
                      <Button
                        type="submit"
                        variant="outline"
                        size="sm"
                        className={user.isActive ? 'text-green-600' : 'text-gray-400'}
                      >
                        {user.isActive ? <Eye className="size-4" /> : <EyeOff className="size-4" />}
                      </Button>
                    </Form>

                    {/* Edit */}
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setEditingUser(user)}
                    >
                      <Edit className="size-4" />
                    </Button>

                    {/* Delete (only for non-admin users) */}
                    {user.role !== 'OWNER' && user.role !== 'ADMIN' && (
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-red-600 hover:text-red-800"
                      >
                        <Trash2 className="size-4" />
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {filteredUsers.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              {t('users.noUsers', { defaultValue: 'No users found' })}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Create User Form Modal */}
      {showCreateForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle>
                {t('users.createUser', { defaultValue: 'Create New User' })}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Form method="post" className="space-y-4">
                <input type="hidden" name="action" value="create" />
                
                <div>
                  <Label htmlFor="name">{t('users.form.name', { defaultValue: 'Full Name' })}</Label>
                  <Input id="name" name="name" required />
                </div>
                
                <div>
                  <Label htmlFor="email">{t('users.form.email', { defaultValue: 'Email' })}</Label>
                  <Input id="email" name="email" type="email" required />
                </div>
                
                <div>
                  <Label htmlFor="phone">{t('users.form.phone', { defaultValue: 'Phone' })}</Label>
                  <Input id="phone" name="phone" type="tel" />
                </div>
                
                <div>
                  <Label htmlFor="role">{t('users.form.role', { defaultValue: 'Role' })}</Label>
                  <Select name="role" defaultValue="CUSTOMER">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {userRoles.map((role) => (
                        <SelectItem key={role.value} value={role.value}>
                          {role.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label htmlFor="password">{t('users.form.password', { defaultValue: 'Password' })}</Label>
                  <Input id="password" name="password" type="password" required />
                </div>
                
                <div className="flex justify-end space-x-3 pt-4">
                  <Button type="button" variant="outline" onClick={() => setShowCreateForm(false)}>
                    {t('users.form.cancel', { defaultValue: 'Cancel' })}
                  </Button>
                  <Button type="submit">
                    {t('users.form.create', { defaultValue: 'Create User' })}
                  </Button>
                </div>
              </Form>
            </CardContent>
          </Card>
        </div>
      )}
        </TabsContent>

        {/* Sessions Tab */}
        <TabsContent value="sessions" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="size-5" />
                User Session Management
              </CardTitle>
              <p className="text-sm text-muted-foreground mt-1">
                View and manage active sessions for all users. Revoke suspicious or unused sessions to enhance security.
              </p>
            </CardHeader>
            <CardContent>
              {usersWithSessions && usersWithSessions.length > 0 ? (
                <UserSessionManagement 
                  usersData={usersWithSessions} 
                  currentUser={currentUser}
                />
              ) : (
                <div className="text-center py-12">
                  <Shield className="size-12 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No Session Data Available</h3>
                  <p className="text-muted-foreground text-sm">
                    Unable to load user sessions. Please check your connection or try again later.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}