import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Folder } from 'lucide-react';
import MainLayout from '../components/layout/MainLayout';
import SoftwareList from '../components/software/SoftwareList';
import Button from '../components/ui/Button';
import { supabase } from '../lib/supabase';
import { Software } from '../lib/supabase';

export default function CategoryDetailPage() {
  const { categoryName } = useParams<{ categoryName: string }>();
  const [isLoading, setIsLoading] = useState(true);
  const [software, setSoftware] = useState<Software[]>([]);
  
  useEffect(() => {
    const fetchSoftwareByCategory = async () => {
      if (!categoryName) return;
      
      setIsLoading(true);
      
      try {
        // First, try exact match
        let { data, error } = await supabase
          .from('software')
          .select('*')
          .eq('category', categoryName)
          .order('created_at', { ascending: false });
        
        // If no results, try case-insensitive match
        if ((!data || data.length === 0) && !error) {
          const { data: caseInsensitiveData, error: caseInsensitiveError } = await supabase
            .from('software')
            .select('*')
            .ilike('category', categoryName)
            .order('created_at', { ascending: false });
            
          if (!caseInsensitiveError) {
            data = caseInsensitiveData;
          }
        }
        
        if (error) {
          throw error;
        }
        
        setSoftware(data || []);
      } catch (error) {
        console.error('Error fetching software by category:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchSoftwareByCategory();
  }, [categoryName]);
  
  const formattedCategoryName = categoryName 
    ? categoryName.charAt(0).toUpperCase() + categoryName.slice(1) 
    : '';
  
  return (
    <MainLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="mb-8">
          <Link to="/categories" className="inline-flex items-center text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 mb-4">
            <ArrowLeft className="mr-1 h-4 w-4" />
            Back to Categories
          </Link>
          
          <div className="flex items-center">
            <div className="h-12 w-12 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
              <Folder className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            </div>
            <h1 className="ml-4 text-3xl font-bold text-gray-900 dark:text-white">
              {formattedCategoryName} Software
            </h1>
          </div>
        </div>
        
        {isLoading ? (
          <div className="animate-pulse space-y-6">
            <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded-lg w-1/4"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, index) => (
                <div key={index} className="rounded-lg overflow-hidden">
                  <div className="aspect-video bg-gray-300 dark:bg-gray-700"></div>
                  <div className="p-4 space-y-3 bg-gray-200 dark:bg-gray-800">
                    <div className="h-5 bg-gray-300 dark:bg-gray-700 rounded w-3/4"></div>
                    <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-1/2"></div>
                    <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-full"></div>
                    <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-full"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : software.length > 0 ? (
          <SoftwareList 
            title={`${formattedCategoryName} Software`} 
            category={categoryName} 
            showFilters={true} 
          />
        ) : (
          <div className="text-center py-12 bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800">
            <Folder className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-lg font-medium text-gray-900 dark:text-white">No software found</h3>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              No software found in the {formattedCategoryName} category.
            </p>
            <div className="mt-4">
              <Link to="/browse">
                <Button variant="outline">
                  Browse All Software
                </Button>
              </Link>
            </div>
          </div>
        )}
      </div>
    </MainLayout>
  );
}