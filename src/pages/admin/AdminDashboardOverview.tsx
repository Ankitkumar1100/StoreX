import { useState, useEffect } from 'react';
import { Package, Download, ArrowUp, Users, Folder, Upload } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Card, CardContent } from '../../components/ui/Card';
import { supabase } from '../../lib/supabase';
import Button from '../../components/ui/Button';

interface StatCard {
  title: string;
  value: number | string;
  icon: React.ReactNode;
  change?: number;
  linkTo?: string;
}

export default function AdminDashboardOverview() {
  const [stats, setStats] = useState({
    totalSoftware: 0,
    totalDownloads: 0,
    totalCategories: 0,
    recentUploads: 0
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    const fetchStats = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        // Get total software count
        const { count: softwareCount, error: softwareError } = await supabase
          .from('software')
          .select('*', { count: 'exact', head: true });
        
        if (softwareError) throw softwareError;
        
        // Get total downloads
        const { data: downloadsData, error: downloadsError } = await supabase
          .from('software')
          .select('download_count');
        
        if (downloadsError) throw downloadsError;
        
        const totalDownloads = downloadsData?.reduce((sum, item) => sum + (item.download_count || 0), 0) || 0;
        
        // Get unique categories count
        const { data: categoriesData, error: categoriesError } = await supabase
          .from('software')
          .select('category')
          .not('category', 'is', null);
        
        if (categoriesError) throw categoriesError;
        
        const uniqueCategories = new Set(categoriesData?.map(item => item.category));
        
        // Get recent uploads (last 7 days)
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
        
        const { count: recentCount, error: recentError } = await supabase
          .from('software')
          .select('*', { count: 'exact', head: true })
          .gte('created_at', sevenDaysAgo.toISOString());
        
        if (recentError) throw recentError;
        
        setStats({
          totalSoftware: softwareCount || 0,
          totalDownloads,
          totalCategories: uniqueCategories.size,
          recentUploads: recentCount || 0
        });
      } catch (error) {
        console.error('Error fetching stats:', error);
        setError(error instanceof Error ? error.message : 'Failed to fetch statistics');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchStats();
  }, []);
  
  const statCards: StatCard[] = [
    {
      title: 'Total Software',
      value: stats.totalSoftware,
      icon: <Package className="h-6 w-6 text-blue-400" />,
      linkTo: '/admin/software'
    },
    {
      title: 'Total Downloads',
      value: stats.totalDownloads.toLocaleString(),
      icon: <Download className="h-6 w-6 text-green-400" />
    },
    {
      title: 'Categories',
      value: stats.totalCategories,
      icon: <Folder className="h-6 w-6 text-yellow-400" />,
      linkTo: '/admin/categories'
    },
    {
      title: 'Recent Uploads',
      value: stats.recentUploads,
      icon: <ArrowUp className="h-6 w-6 text-purple-400" />,
      change: 0,
      linkTo: '/admin/software'
    }
  ];
  
  if (error) {
    return (
      <div className="p-6 bg-red-900/20 rounded-lg">
        <h2 className="text-lg font-semibold text-red-300">Error</h2>
        <p className="mt-2 text-red-400">{error}</p>
      </div>
    );
  }
  
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-white">Dashboard</h1>
        <p className="mt-1 text-gray-400">
          Overview of your software platform
        </p>
      </div>
      
      {/* Stats grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {isLoading ? (
          Array(4).fill(0).map((_, index) => (
            <div key={index} className="bg-gray-800/50 rounded-lg h-32 animate-pulse"></div>
          ))
        ) : (
          statCards.map((stat, index) => (
            <Card key={index} className="bg-gray-800/50 hover:bg-gray-800 transition-colors border-gray-700">
              <CardContent className="p-6">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-sm font-medium text-gray-400">{stat.title}</p>
                    <p className="mt-2 text-3xl font-semibold text-white">{stat.value}</p>
                  </div>
                  <div className="p-2 bg-gray-800 rounded-full">
                    {stat.icon}
                  </div>
                </div>
                {stat.linkTo && (
                  <div className="mt-4">
                    <Link to={stat.linkTo} className="text-sm text-blue-400 hover:text-blue-300">
                      View details →
                    </Link>
                  </div>
                )}
              </CardContent>
            </Card>
          ))
        )}
      </div>
      
      {/* Quick actions */}
      <Card className="bg-gray-800/50 border-gray-700">
        <CardContent className="p-6">
          <h2 className="text-lg font-semibold text-white mb-4">Quick Actions</h2>
          <div className="flex flex-wrap gap-3">
            <Link to="/admin/upload">
              <Button leftIcon={<Upload className="h-4 w-4" />}>
                Upload Software
              </Button>
            </Link>
            <Link to="/admin/software">
              <Button variant="secondary" leftIcon={<Package className="h-4 w-4" />}>
                Manage Software
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
      
      {/* Recent activity */}
      <Card className="bg-gray-800/50 border-gray-700">
        <CardContent className="p-6">
          <h2 className="text-lg font-semibold text-white mb-4">Recent Activity</h2>
          {isLoading ? (
            <div className="space-y-3 animate-pulse">
              {Array(5).fill(0).map((_, index) => (
                <div key={index} className="h-10 bg-gray-800 rounded"></div>
              ))}
            </div>
          ) : (
            <p className="text-gray-400">
              Connect to analytics to view recent user activity.
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}