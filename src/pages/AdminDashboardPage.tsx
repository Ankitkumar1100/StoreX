import { useEffect } from 'react';
import { useNavigate, Link, Outlet, useLocation } from 'react-router-dom';
import { LayoutDashboard, Upload, List, Package, BarChart, User, Settings } from 'lucide-react';
import { useAuthStore } from '../store/authStore';

export default function AdminDashboardPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, isAdmin, isLoading } = useAuthStore();
  
  useEffect(() => {
    if (!isLoading && (!user || !isAdmin)) {
      navigate('/login');
    }
  }, [user, isAdmin, isLoading, navigate]);
  
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-100 dark:bg-gray-950 flex items-center justify-center">
        <div className="animate-spin h-8 w-8 border-4 border-blue-600 dark:border-blue-400 rounded-full border-t-transparent"></div>
      </div>
    );
  }
  
  const navigation = [
    { name: 'Dashboard', icon: LayoutDashboard, href: '/admin' },
    { name: 'Upload Software', icon: Upload, href: '/admin/upload' },
    { name: 'Manage Software', icon: Package, href: '/admin/software' },
    { name: 'Statistics', icon: BarChart, href: '/admin/statistics' },
    { name: 'Users', icon: User, href: '/admin/users' },
    { name: 'Settings', icon: Settings, href: '/admin/settings' }
  ];
  
  const isActive = (path: string) => {
    if (path === '/admin') {
      return location.pathname === '/admin';
    }
    return location.pathname.startsWith(path);
  };
  
  return (
    <div className="min-h-screen flex bg-gray-100 dark:bg-gray-950">
      {/* Sidebar */}
      <div className="w-64 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 hidden md:block">
        <div className="h-16 flex items-center px-6 border-b border-gray-200 dark:border-gray-800">
          <Link to="/" className="flex items-center space-x-2">
            <Package className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            <span className="font-bold text-gray-900 dark:text-white">Admin Panel</span>
          </Link>
        </div>
        
        <div className="py-4">
          <nav className="px-3 space-y-1">
            {navigation.map((item) => {
              const active = isActive(item.href);
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`flex items-center px-3 py-2 rounded-md text-sm font-medium ${
                    active 
                      ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400' 
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800'
                  }`}
                >
                  <item.icon className={`mr-3 h-5 w-5 ${
                    active 
                      ? 'text-blue-600 dark:text-blue-400' 
                      : 'text-gray-500 dark:text-gray-400'
                  }`} />
                  {item.name}
                </Link>
              );
            })}
          </nav>
        </div>
      </div>
      
      {/* Mobile nav */}
      <div className="md:hidden bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 fixed top-0 left-0 right-0 z-10">
        <div className="px-4 h-14 flex items-center justify-between">
          <Link to="/" className="flex items-center space-x-2">
            <Package className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            <span className="font-bold text-gray-900 dark:text-white">Admin</span>
          </Link>
          
          <Link to="/" className="text-gray-600 dark:text-gray-300">
            <List className="h-6 w-6" />
          </Link>
        </div>
        
        <div className="flex overflow-x-auto px-4 py-2 border-t border-gray-200 dark:border-gray-800">
          {navigation.map((item) => {
            const active = isActive(item.href);
            return (
              <Link
                key={item.name}
                to={item.href}
                className={`flex flex-col items-center px-3 py-1 rounded-md text-xs ${
                  active 
                    ? 'text-blue-600 dark:text-blue-400' 
                    : 'text-gray-600 dark:text-gray-400'
                }`}
              >
                <item.icon className="h-5 w-5 mb-1" />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </div>
      </div>
      
      {/* Content */}
      <div className="flex-1 flex flex-col md:ml-64 md:mt-0 mt-24">
        <div className="flex-1 py-6 px-4 sm:px-6 md:px-8">
          <Outlet />
        </div>
      </div>
    </div>
  );
}