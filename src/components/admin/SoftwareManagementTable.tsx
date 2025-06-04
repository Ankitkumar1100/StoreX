import { useState, useEffect } from 'react';
import { Edit, Trash, MoreHorizontal, Download } from 'lucide-react';
import Button from '../ui/Button';
import { supabase } from '../../lib/supabase';
import { formatDate, formatFileSize } from '../../lib/utils';
import type { Software } from '../../lib/supabase';
import toast from 'react-hot-toast';

export default function SoftwareManagementTable() {
  const [software, setSoftware] = useState<Software[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);
  
  const loadSoftware = async () => {
    setIsLoading(true);
    const { data, error } = await supabase
      .from('software')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('Error loading software:', error);
      toast.error('Failed to load software');
    } else {
      setSoftware(data || []);
    }
    setIsLoading(false);
  };
  
  useEffect(() => {
    loadSoftware();
  }, []);
  
  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this software? This action cannot be undone.')) {
      return;
    }
    
    setIsDeleting(id);
    
    try {
      const { error } = await supabase
        .from('software')
        .delete()
        .match({ id });
      
      if (error) {
        throw new Error(error.message);
      }
      
      // Update local state
      setSoftware(software.filter(item => item.id !== id));
      toast.success('Software deleted successfully');
    } catch (error) {
      console.error('Error deleting software:', error);
      toast.error('Failed to delete software');
    } finally {
      setIsDeleting(null);
    }
  };
  
  if (isLoading) {
    return (
      <div className="animate-pulse">
        <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded mb-4"></div>
        {[...Array(5)].map((_, index) => (
          <div key={index} className="h-16 bg-gray-200 dark:bg-gray-700 rounded mb-2"></div>
        ))}
      </div>
    );
  }
  
  if (software.length === 0) {
    return (
      <div className="text-center py-12 bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800">
        <Download className="mx-auto h-12 w-12 text-gray-400" />
        <h3 className="mt-2 text-lg font-medium text-gray-900 dark:text-white">No software found</h3>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Start by uploading your first software.</p>
      </div>
    );
  }
  
  return (
    <div className="overflow-x-auto bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800">
      <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-800">
        <thead className="bg-gray-50 dark:bg-gray-800/50">
          <tr>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              Software
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              Category
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              Version
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              Downloads
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              Date
            </th>
            <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-800">
          {software.map((item) => (
            <tr key={item.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50">
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center">
                  <div className="h-10 w-10 flex-shrink-0 bg-gray-100 dark:bg-gray-800 rounded flex items-center justify-center">
                    {item.thumbnail_url ? (
                      <img
                        src={item.thumbnail_url}
                        alt={item.title}
                        className="h-10 w-10 rounded object-cover"
                      />
                    ) : (
                      <Download className="h-5 w-5 text-gray-400" />
                    )}
                  </div>
                  <div className="ml-4">
                    <div className="text-sm font-medium text-gray-900 dark:text-white">{item.title}</div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">{formatFileSize(item.file_size)}</div>
                  </div>
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                {item.category}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                {item.version}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                {item.download_count.toLocaleString()}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                {formatDate(item.created_at)}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <div className="flex justify-end space-x-2">
                  <Button
                    size="sm"
                    variant="ghost"
                    className="text-blue-600 dark:text-blue-400"
                    onClick={() => {/* Edit functionality would go here */}}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="text-red-600 dark:text-red-400"
                    onClick={() => handleDelete(item.id)}
                    isLoading={isDeleting === item.id}
                  >
                    <Trash className="h-4 w-4" />
                  </Button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}