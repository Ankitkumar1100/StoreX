import { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { useAuthStore } from './store/authStore';
import { applyTheme } from './store/themeStore';

// Public pages
import HomePage from './pages/HomePage';
import BrowsePage from './pages/BrowsePage';
import CategoriesPage from './pages/CategoriesPage';
import CategoryDetailPage from './pages/CategoryDetailPage';
import SoftwareDetailPage from './pages/SoftwareDetailPage';
import LoginPage from './pages/LoginPage';

// Admin pages
import AdminDashboardPage from './pages/AdminDashboardPage';
import AdminDashboardOverview from './pages/admin/AdminDashboardOverview';
import AdminUploadPage from './pages/admin/AdminUploadPage';
import AdminSoftwarePage from './pages/admin/AdminSoftwarePage';
import AdminStatisticsPage from './pages/admin/AdminStatisticsPage';
import AdminUsersPage from './pages/admin/AdminUsersPage';
import AdminSettingsPage from './pages/admin/AdminSettingsPage';

// Protected route component
interface ProtectedRouteProps {
  element: React.ReactNode;
  requireAdmin?: boolean;
}

const ProtectedRoute = ({ element, requireAdmin = false }: ProtectedRouteProps) => {
  const { user, isAdmin, isLoading } = useAuthStore();
  
  if (isLoading) {
    return <div className="min-h-screen bg-gray-950 flex items-center justify-center">
      <div className="animate-spin h-8 w-8 border-4 border-blue-400 rounded-full border-t-transparent"></div>
    </div>;
  }
  
  if (!user || (requireAdmin && !isAdmin)) {
    return <Navigate to="/login" />;
  }
  
  return <>{element}</>;
};

function App() {
  const { initialize } = useAuthStore();
  
  useEffect(() => {
    // Initialize authentication
    initialize();
    
    // Apply theme
    applyTheme();
    
    // Listen for theme changes
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = () => applyTheme();
    mediaQuery.addEventListener('change', handleChange);
    
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [initialize]);
  
  return (
    <Router>
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<HomePage />} />
        <Route path="/browse" element={<BrowsePage />} />
        <Route path="/categories" element={<CategoriesPage />} />
        <Route path="/categories/:categoryName" element={<CategoryDetailPage />} />
        <Route path="/software/:id" element={<SoftwareDetailPage />} />
        <Route path="/login" element={<LoginPage />} />
        
        {/* Admin routes */}
        <Route 
          path="/admin" 
          element={
            <ProtectedRoute 
              element={<AdminDashboardPage />} 
              requireAdmin={true} 
            />
          }
        >
          <Route index element={<AdminDashboardOverview />} />
          <Route path="upload" element={<AdminUploadPage />} />
          <Route path="software" element={<AdminSoftwarePage />} />
          <Route path="statistics" element={<AdminStatisticsPage />} />
          <Route path="users" element={<AdminUsersPage />} />
          <Route path="settings" element={<AdminSettingsPage />} />
          <Route path="*" element={<Navigate to="/admin" />} />
        </Route>
        
        {/* Fallback route */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
      
      <Toaster 
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: 'var(--toast-bg, #1f2937)',
            color: 'var(--toast-color, #f9fafb)',
            border: '1px solid var(--toast-border, #374151)'
          },
        }}
      />
    </Router>
  );
}

export default App;