import { NavLink } from "react-router";
import { 
  LayoutDashboard,
  Receipt,
  DollarSign,
  Clock,
  Settings,
  LogOut,
  Bell,
  TrendingUp
} from "../../lib/lucide-shim.js";

export function Sidebar({ user }) {
  const navigation = [
    { name: 'Dashboard', href: '/cashier', icon: LayoutDashboard },
    { name: 'Today\'s Orders', href: '/cashier#orders', icon: Receipt },
    { name: 'Cash Summary', href: '/cashier#cash', icon: DollarSign },
    { name: 'Shift Report', href: '/cashier#shift', icon: TrendingUp },
  ];

  return (
    <div className="flex h-[calc(100vh-3.5rem)] w-64 flex-col bg-white border-r border-gray-200 fixed left-0 z-0">
      {/* Header */}
      <div className="flex h-16 items-center gap-2 border-b px-6 bg-white">
        <div className="bg-green-600 p-2 rounded-lg">
          <DollarSign className="size-6 text-white" />
        </div>
        <div>
          <div className="font-bold text-lg">Cashier</div>
          <div className="text-xs text-gray-500">Coordinator</div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 px-3 py-4 overflow-y-auto">
        {navigation.map((item) => (
          <NavLink
            key={item.name}
            to={item.href}
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-green-50 text-green-700'
                  : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
              }`
            }
          >
            <item.icon className="size-5" />
            {item.name}
          </NavLink>
        ))}
      </nav>

      {/* User Info */}
      <div className="border-t p-4">
        <div className="flex items-center gap-3 mb-3">
          <div className="bg-green-100 p-2 rounded-full">
            <span className="text-green-700 font-bold text-sm">
              {user?.name?.charAt(0) || 'C'}
            </span>
          </div>
          <div className="flex-1 min-w-0">
            <div className="font-medium text-sm truncate">{user?.name || 'Cashier'}</div>
            <div className="text-xs text-gray-500 truncate">{user?.email}</div>
          </div>
        </div>
        <form action="/logout" method="post">
          <button
            type="submit"
            className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            <LogOut className="size-4" />
            Logout
          </button>
        </form>
      </div>
    </div>
  );
}
