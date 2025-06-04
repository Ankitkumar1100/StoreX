import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Folder, ChevronRight } from 'lucide-react';
import MainLayout from '../components/layout/MainLayout';
import { supabase } from '../lib/supabase';

type Category = {
  name: string;
  count: number;
};

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    const fetchCategories = async () => {
      setIsLoading(true);
      
      try {
        const { data, error } = await supabase
          .from('software')
          .select('category')
          .not('category', 'is', null);
        
        if (error) {
          throw error;
        }
        
        // Count occurrences of each category
        const categoryCounts = data.reduce((acc, item) => {
          const category = item.category;
          acc[category] = (acc[category] || 0) + 1;
          return acc;
        }, {} as Record<string, number>);
        
        // Convert to array of category objects
        const categoryArray = Object.entries(categoryCounts).map(([name, count]) => ({
          name,
          count
        }));
        
        // Sort by count (descending)
        categoryArray.sort((a, b) => b.count - a.count);
        
        setCategories(categoryArray);
      } catch (error) {
        console.error('Error fetching categories:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchCategories();
  }, []);
  
  return (
    <MainLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Software Categories</h1>
          <p className="mt-2 text-lg text-gray-600 dark:text-gray-400">
            Browse software by category to find what you're looking for
          </p>
        </div>
        
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse">
            {[...Array(9)].map((_, index) => (
              <div key={index} className="h-24 bg-gray-200 dark:bg-gray-800 rounded-lg"></div>
            ))}
          </div>
        ) : categories.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories.map((category) => (
              <Link 
                key={category.name}
                to={`/categories/${category.name.toLowerCase()}`}
                className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 p-6 hover:shadow-md transition-shadow"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="h-12 w-12 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center flex-shrink-0">
                      <Folder className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div className="ml-4">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{category.name}</h3>
                      <p className="text-gray-600 dark:text-gray-400">
                        {category.count} {category.count === 1 ? 'software' : 'softwares'}
                      </p>
                    </div>
                  </div>
                  <ChevronRight className="h-5 w-5 text-gray-400" />
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800">
            <Folder className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-lg font-medium text-gray-900 dark:text-white">No categories found</h3>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Start by adding some software with categories.
            </p>
          </div>
        )}
      </div>
    </MainLayout>
  );
}