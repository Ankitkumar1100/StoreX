import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Download, Calendar, Tag, Clock, ArrowDown, Monitor } from 'lucide-react';
import MainLayout from '../components/layout/MainLayout';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import { Card, CardContent } from '../components/ui/Card';
import { formatDate, formatFileSize } from '../lib/utils';
import { getSoftwareById, incrementDownloadCount } from '../lib/supabase';
import type { Software } from '../lib/supabase';

export default function SoftwareDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [software, setSoftware] = useState<Software | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    const loadSoftware = async () => {
      if (!id) return;
      
      setIsLoading(true);
      setError(null);
      
      try {
        const data = await getSoftwareById(id);
        
        if (!data) {
          setError('Software not found');
          return;
        }
        
        setSoftware(data);
      } catch (err) {
        console.error('Error loading software:', err);
        setError('Failed to load software details');
      } finally {
        setIsLoading(false);
      }
    };
    
    loadSoftware();
  }, [id]);
  
  const handleDownload = async () => {
    if (!software) return;
    
    // Increment download count in the database
    await incrementDownloadCount(software.id);
    
    // Update local state
    setSoftware({
      ...software,
      download_count: software.download_count + 1
    });
    
    // Open the download URL
    window.open(software.file_url, '_blank');
  };
  
  if (isLoading) {
    return (
      <MainLayout>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="animate-pulse space-y-6">
            <div className="h-10 w-3/4 bg-gray-200 dark:bg-gray-700 rounded"></div>
            <div className="h-6 w-1/2 bg-gray-200 dark:bg-gray-700 rounded"></div>
            <div className="h-96 bg-gray-200 dark:bg-gray-700 rounded"></div>
            <div className="h-8 w-1/4 bg-gray-200 dark:bg-gray-700 rounded"></div>
            <div className="space-y-3">
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
            </div>
          </div>
        </div>
      </MainLayout>
    );
  }
  
  if (error || !software) {
    return (
      <MainLayout>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
          <div className="bg-red-50 dark:bg-red-900/20 p-6 rounded-lg">
            <h2 className="text-xl font-semibold text-red-800 dark:text-red-300">
              {error || 'Software not found'}
            </h2>
            <p className="mt-2 text-red-600 dark:text-red-400">
              We couldn't find the software you're looking for.
            </p>
            <div className="mt-4">
              <Link to="/browse">
                <Button variant="outline">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back to Browse
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </MainLayout>
    );
  }
  
  return (
    <MainLayout>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Back navigation */}
        <div className="mb-6">
          <Link to="/browse" className="inline-flex items-center text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200">
            <ArrowLeft className="mr-1 h-4 w-4" />
            Back to Browse
          </Link>
        </div>
        
        <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 overflow-hidden">
          {/* Header */}
          <div className="border-b border-gray-200 dark:border-gray-800 p-6">
            <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
                  {software.title}
                </h1>
                <div className="mt-1 flex flex-wrap items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                  <span className="flex items-center">
                    <Calendar className="mr-1 h-4 w-4" />
                    {formatDate(software.created_at)}
                  </span>
                  <span>•</span>
                  <span className="flex items-center">
                    <Tag className="mr-1 h-4 w-4" />
                    {software.category}
                  </span>
                  <span>•</span>
                  <span className="flex items-center">
                    <Clock className="mr-1 h-4 w-4" />
                    Version {software.version}
                  </span>
                </div>
              </div>
              
              <Button
                onClick={handleDownload}
                size="lg"
                className="flex-shrink-0"
                leftIcon={<Download className="h-4 w-4" />}
              >
                Download Now
              </Button>
            </div>
          </div>
          
          {/* Software details */}
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Main content */}
              <div className="md:col-span-2">
                {/* Thumbnail */}
                {software.thumbnail_url ? (
                  <div className="mb-6 rounded-lg overflow-hidden border border-gray-200 dark:border-gray-800">
                    <img
                      src={software.thumbnail_url}
                      alt={software.title}
                      className="w-full h-auto object-cover"
                    />
                  </div>
                ) : null}
                
                {/* Description */}
                <div className="prose dark:prose-invert max-w-none">
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Description</h2>
                  <p className="text-gray-700 dark:text-gray-300 whitespace-pre-line">
                    {software.description}
                  </p>
                </div>
                
                {/* Tags */}
                {software.tags && software.tags.length > 0 && (
                  <div className="mt-6">
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Tags</h2>
                    <div className="flex flex-wrap gap-2">
                      {software.tags.map((tag) => (
                        <Badge key={tag} variant="secondary">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              
              {/* Sidebar */}
              <div>
                <Card>
                  <CardContent className="p-4 space-y-4">
                    <div>
                      <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">File Size</h3>
                      <p className="mt-1 font-semibold text-gray-900 dark:text-white">
                        {formatFileSize(software.file_size)}
                      </p>
                    </div>
                    
                    <div>
                      <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Downloads</h3>
                      <p className="mt-1 font-semibold text-gray-900 dark:text-white flex items-center">
                        <ArrowDown className="h-4 w-4 mr-1 text-green-500" />
                        {software.download_count.toLocaleString()}
                      </p>
                    </div>
                    
                    <div>
                      <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Category</h3>
                      <Link to={`/categories/${software.category.toLowerCase()}`}>
                        <p className="mt-1 font-semibold text-blue-600 dark:text-blue-400 hover:underline">
                          {software.category}
                        </p>
                      </Link>
                    </div>
                    
                    <div>
                      <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Version</h3>
                      <p className="mt-1 font-semibold text-gray-900 dark:text-white">
                        {software.version}
                      </p>
                    </div>
                    
                    <div className="pt-2">
                      <Button
                        onClick={handleDownload}
                        fullWidth
                        leftIcon={<Download className="h-4 w-4" />}
                      >
                        Download Now
                      </Button>
                    </div>
                  </CardContent>
                </Card>
                
                <div className="mt-6 text-sm text-gray-500 dark:text-gray-400 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <div className="flex items-start">
                    <Monitor className="h-4 w-4 mr-2 mt-0.5" />
                    <p>
                      All software on SoftwareHub is tested for compatibility and safety. 
                      We recommend using antivirus software when installing any new programs.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}