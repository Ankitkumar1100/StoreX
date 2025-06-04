import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Moon, Computer, Download, Menu, X, User, LogOut } from 'lucide-react';
import Button from '../ui/Button';
import { useThemeStore, applyTheme } from '../../store/themeStore';
import { useAuthStore } from '../../store/authStore';

export default function Navbar() {
  const location = useLocation();
  const { theme, setTheme } = useThemeStore();
  const { user, isAdmin, signOut } = useAuthStore();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  
  useEffect(() => {
    applyTheme();
    
    // Listen for system theme changes
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = () => {
      if (theme === 'system') {
        applyTheme();
      }
    };
    
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [theme]);
  
  // Close menus when location changes
  useEffect(() => {
    setIsMobileMenuOpen(false);
    setIsUserMenuOpen(false);
  }, [location]);
  
  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Browse', path: '/browse' },
    { name: 'Categories', path: '/categories' },
  ];
  
  return (
    <nav className="bg-gray-900 border-b border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0 flex items-center">
              <Download className="h-8 w-8 text-blue-400" />
              <span className="ml-2 text-xl font-bold text-white">SoftwareHub</span>
            </Link>
            <div className="hidden md:block ml-10">
              <div className="flex items-center space-x-4">
                {navLinks.map((link) => (
                  <Link
                    key={link.path}
                    to={link.path}
                    className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                      location.pathname === link.path
                        ? 'bg-gray-800 text-white'
                        : 'text-gray-300 hover:bg-gray-800'
                    }`}
                  >
                    {link.name}
                  </Link>
                ))}
              </div>
            </div>
          </div>
          
          <div className="hidden md:block">
            <div className="flex items-center space-x-4">
              {/* Theme toggle */}
              <div className="relative">
                <button
                  type="button"
                  className="p-1 text-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 rounded-full"
                  onClick={() => {
                    const nextTheme = theme === 'dark' ? 'system' : 'dark';
                    setTheme(nextTheme);
                  }}
                >
                  {theme === 'dark' && <Moon className="h-6 w-6" />}
                  {theme === 'system' && <Computer className="h-6 w-6" />}
                </button>
              </div>

              {/* Auth buttons or user menu */}
              {!user ? (
                <div className="flex space-x-2">
                  <Link to="/login">
                    <Button variant="outline" size="sm">Log in</Button>
                  </Link>
                  {isAdmin && (
                    <Link to="/admin">
                      <Button size="sm">Admin Panel</Button>
                    </Link>
                  )}
                </div>
              ) : (
                <div className="relative">
                  <button
                    onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                    className="flex items-center text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    <div className="h-8 w-8 rounded-full bg-gray-700 flex items-center justify-center">
                      <User className="h-5 w-5 text-gray-300" />
                    </div>
                  </button>
                  
                  {isUserMenuOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-gray-900 rounded-md shadow-lg z-10 border border-gray-700">
                      <div className="py-1">
                        {isAdmin && (
                          <Link
                            to="/admin"
                            className="block px-4 py-2 text-sm text-gray-300 hover:bg-gray-800"
                          >
                            Admin Panel
                          </Link>
                        )}
                        <button
                          onClick={signOut}
                          className="w-full text-left block px-4 py-2 text-sm text-gray-300 hover:bg-gray-800"
                        >
                          <span className="flex items-center">
                            <LogOut className="mr-2 h-4 w-4" />
                            Sign out
                          </span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
          
          {/* Mobile menu button */}
          <div className="md:hidden flex items-center space-x-2">
            <button
              type="button"
              className="p-1 text-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 rounded-full"
              onClick={() => {
                const nextTheme = theme === 'dark' ? 'system' : 'dark';
                setTheme(nextTheme);
              }}
            >
              {theme === 'dark' && <Moon className="h-5 w-5" />}
              {theme === 'system' && <Computer className="h-5 w-5" />}
            </button>
            
            <button
              type="button"
              className="p-1 text-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 rounded-md"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>
      
      {/* Mobile menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-gray-900 border-b border-gray-800">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`block px-3 py-2 rounded-md text-base font-medium ${
                  location.pathname === link.path
                    ? 'bg-gray-800 text-white'
                    : 'text-gray-300 hover:bg-gray-800'
                }`}
              >
                {link.name}
              </Link>
            ))}
            
            {!user ? (
              <div className="pt-2 flex flex-col space-y-2">
                <Link to="/login">
                  <Button fullWidth variant="outline">Log in</Button>
                </Link>
                {isAdmin && (
                  <Link to="/admin">
                    <Button fullWidth>Admin Panel</Button>
                  </Link>
                )}
              </div>
            ) : (
              <div className="pt-2 border-t border-gray-800">
                {isAdmin && (
                  <Link
                    to="/admin"
                    className="block px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:bg-gray-800"
                  >
                    Admin Panel
                  </Link>
                )}
                <button
                  onClick={signOut}
                  className="w-full text-left block px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:bg-gray-800"
                >
                  <span className="flex items-center">
                    <LogOut className="mr-2 h-4 w-4" />
                    Sign out
                  </span>
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}