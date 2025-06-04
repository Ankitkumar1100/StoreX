import { Link } from 'react-router-dom';
import { Download, Calendar, ArrowDown } from 'lucide-react';
import { Card, CardContent } from '../ui/Card';
import Badge from '../ui/Badge';
import { formatDate, formatFileSize } from '../../lib/utils';
import type { Software } from '../../lib/supabase';

interface SoftwareCardProps {
  software: Software;
  className?: string;
}

export default function SoftwareCard({ software, className }: SoftwareCardProps) {
  return (
    <Card className={`overflow-hidden transition-all duration-300 hover:shadow-md ${className}`}>
      <div className="aspect-video relative bg-gray-100 dark:bg-gray-800">
        {software.thumbnail_url ? (
          <img
            src={software.thumbnail_url}
            alt={software.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Download className="h-12 w-12 text-gray-400" />
          </div>
        )}
        {software.is_featured && (
          <div className="absolute top-2 right-2">
            <Badge variant="success">Featured</Badge>
          </div>
        )}
      </div>
      
      <CardContent className="p-4">
        <Link to={`/software/${software.id}`}>
          <h3 className="text-lg font-semibold line-clamp-1 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
            {software.title}
          </h3>
        </Link>
        
        <div className="flex items-center mt-1 text-sm text-gray-500 dark:text-gray-400">
          <Calendar className="h-4 w-4 mr-1" />
          <span>{formatDate(software.created_at)}</span>
          <span className="mx-2">•</span>
          <span>{formatFileSize(software.file_size)}</span>
        </div>
        
        <p className="mt-2 text-sm text-gray-600 dark:text-gray-300 line-clamp-2">
          {software.description}
        </p>
        
        <div className="mt-3 flex flex-wrap gap-1.5">
          {software.category && (
            <Badge variant="secondary">
              {software.category}
            </Badge>
          )}
          {software.tags && software.tags.slice(0, 2).map((tag) => (
            <Badge key={tag} variant="outline">
              {tag}
            </Badge>
          ))}
        </div>
        
        <div className="mt-4 flex items-center justify-between">
          <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
            <ArrowDown className="h-4 w-4 mr-1" />
            <span>{software.download_count.toLocaleString()} downloads</span>
          </div>
          
          <Link to={`/software/${software.id}`}>
            <Badge 
              variant="default" 
              className="cursor-pointer flex items-center"
            >
              <Download className="h-3.5 w-3.5 mr-1" />
              Download
            </Badge>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}