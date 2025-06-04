import { useState, useEffect } from 'react';
import { Card, CardContent } from '../../components/ui/Card';
import { supabase } from '../../lib/supabase';
import { formatDate } from '../../lib/utils';

interface DailyStats {
  date: string;
  downloads: number;
  uploads: number;
}

export default function AdminStatisticsPage() {
  const [stats, setStats] = useState<DailyStats[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      setIsLoading(true);
      setError(null);

      try {
        // Get last 30 days of data
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

        // Get software uploads by date
        const { data: uploadsData, error: uploadsError } = await supabase
          .from('software')
          .select('created_at')
          .gte('created_at', thirtyDaysAgo.toISOString())
          .order('created_at', { ascending: true });

        if (uploadsError) throw uploadsError;

        // Get downloads by date (this would need a proper downloads table in a real app)
        const { data: downloadsData, error: downloadsError } = await supabase
          .from('software')
          .select('download_count, created_at')
          .gte('created_at', thirtyDaysAgo.toISOString());

        if (downloadsError) throw downloadsError;

        // Process data into daily stats
        const dailyStats: DailyStats[] = [];
        const today = new Date();

        for (let i = 0; i < 30; i++) {
          const date = new Date(today);
          date.setDate(date.getDate() - i);
          const dateStr = date.toISOString().split('T')[0];

          const uploads = uploadsData?.filter(item => 
            item.created_at.startsWith(dateStr)
          ).length || 0;

          const downloads = downloadsData?.filter(item =>
            item.created_at.startsWith(dateStr)
          ).reduce((sum, item) => sum + (item.download_count || 0), 0) || 0;

          dailyStats.unshift({
            date: dateStr,
            uploads,
            downloads
          });
        }

        setStats(dailyStats);
      } catch (error) {
        console.error('Error fetching statistics:', error);
        setError(error instanceof Error ? error.message : 'Failed to fetch statistics');
      } finally {
        setIsLoading(false);
      }
    };

    fetchStats();
  }, []);

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
        <h1 className="text-2xl font-bold text-white">Statistics</h1>
        <p className="mt-1 text-gray-400">
          Detailed analytics of your software platform
        </p>
      </div>

      <Card className="bg-gray-800/50 border-gray-700">
        <CardContent className="p-6">
          <h2 className="text-lg font-semibold text-white mb-4">30 Day Overview</h2>
          {isLoading ? (
            <div className="animate-pulse space-y-4">
              <div className="h-64 bg-gray-800 rounded"></div>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="text-left border-b border-gray-700">
                    <th className="pb-3 text-gray-400 font-medium">Date</th>
                    <th className="pb-3 text-gray-400 font-medium">Downloads</th>
                    <th className="pb-3 text-gray-400 font-medium">Uploads</th>
                  </tr>
                </thead>
                <tbody>
                  {stats.map((day) => (
                    <tr key={day.date} className="border-b border-gray-700/50">
                      <td className="py-3 text-gray-300">{formatDate(day.date)}</td>
                      <td className="py-3 text-gray-300">{day.downloads}</td>
                      <td className="py-3 text-gray-300">{day.uploads}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}