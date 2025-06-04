import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, X, Plus, Image } from 'lucide-react';
import Button from '../ui/Button';
import Input from '../ui/Input';
import { supabase } from '../../lib/supabase';
import { useAuthStore } from '../../store/authStore';
import toast from 'react-hot-toast';

export default function SoftwareUploadForm() {
  const { user } = useAuthStore();
  const [isUploading, setIsUploading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    version: '',
    category: '',
    tags: '',
    isFeatured: false
  });
  const [softwareFile, setSoftwareFile] = useState<File | null>(null);
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
  const [thumbnailPreview, setThumbnailPreview] = useState('');
  
  const onSoftwareDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      setSoftwareFile(acceptedFiles[0]);
    }
  }, []);
  
  const onThumbnailDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles[0]) {
      setThumbnailFile(acceptedFiles[0]);
      const previewUrl = URL.createObjectURL(acceptedFiles[0]);
      setThumbnailPreview(previewUrl);
    }
  }, []);
  
  const { getRootProps: getSoftwareRootProps, getInputProps: getSoftwareInputProps } = useDropzone({
    onDrop: onSoftwareDrop,
    maxFiles: 1,
    accept: {
      'application/zip': ['.zip'],
      'application/x-msdownload': ['.exe'],
      'application/x-apple-diskimage': ['.dmg'],
      'application/octet-stream': ['.app']
    }
  });
  
  const { getRootProps: getThumbnailRootProps, getInputProps: getThumbnailInputProps } = useDropzone({
    onDrop: onThumbnailDrop,
    maxFiles: 1,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.webp']
    }
  });
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target as HTMLInputElement;
    
    if (type === 'checkbox') {
      setFormData({
        ...formData,
        [name]: (e.target as HTMLInputElement).checked
      });
    } else {
      setFormData({
        ...formData,
        [name]: value
      });
    }
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!softwareFile || !user) return;
    
    try {
      setIsUploading(true);
      
      // Upload software file
      const softwareExt = softwareFile.name.split('.').pop();
      const softwareFileName = `${Date.now()}-${Math.random().toString(36).substring(2, 15)}.${softwareExt}`;
      const softwarePath = `software/${softwareFileName}`;
      
      const { error: softwareUploadError, data: softwareUploadData } = await supabase.storage
        .from('software-files')
        .upload(softwarePath, softwareFile);
      
      if (softwareUploadError) {
        throw new Error(`Error uploading software: ${softwareUploadError.message}`);
      }
      
      // Get public URL for software file
      const { data: softwareUrlData } = await supabase.storage
        .from('software-files')
        .getPublicUrl(softwarePath);
      
      let thumbnailUrl = null;
      
      // Upload thumbnail if provided
      if (thumbnailFile) {
        const thumbnailExt = thumbnailFile.name.split('.').pop();
        const thumbnailFileName = `${Date.now()}-${Math.random().toString(36).substring(2, 15)}.${thumbnailExt}`;
        const thumbnailPath = `thumbnails/${thumbnailFileName}`;
        
        const { error: thumbnailUploadError } = await supabase.storage
          .from('software-images')
          .upload(thumbnailPath, thumbnailFile);
        
        if (thumbnailUploadError) {
          console.error('Error uploading thumbnail:', thumbnailUploadError);
        } else {
          const { data: thumbnailUrlData } = await supabase.storage
            .from('software-images')
            .getPublicUrl(thumbnailPath);
          
          thumbnailUrl = thumbnailUrlData?.publicUrl;
        }
      }
      
      // Insert software record
      const { error: insertError } = await supabase
        .from('software')
        .insert({
          title: formData.title,
          description: formData.description,
          version: formData.version,
          category: formData.category,
          tags: formData.tags.split(',').map(tag => tag.trim()).filter(Boolean),
          file_url: softwareUrlData?.publicUrl,
          file_size: softwareFile.size,
          thumbnail_url: thumbnailUrl,
          is_featured: formData.isFeatured,
          author_id: user.id,
          download_count: 0
        });
      
      if (insertError) {
        throw new Error(`Error inserting software record: ${insertError.message}`);
      }
      
      // Reset form
      setFormData({
        title: '',
        description: '',
        version: '',
        category: '',
        tags: '',
        isFeatured: false
      });
      setSoftwareFile(null);
      setThumbnailFile(null);
      setThumbnailPreview('');
      
      toast.success('Software uploaded successfully!');
    } catch (error) {
      console.error('Error uploading software:', error);
      toast.error(`Upload failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsUploading(false);
    }
  };
  
  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="md:col-span-2">
          <Input
            label="Software Title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
            fullWidth
          />
        </div>
        
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
            Description
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows={4}
            required
            className="w-full px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 dark:text-gray-100"
          ></textarea>
        </div>
        
        <div>
          <Input
            label="Version"
            name="version"
            value={formData.version}
            onChange={handleChange}
            required
            fullWidth
          />
        </div>
        
        <div>
          <Input
            label="Category"
            name="category"
            value={formData.category}
            onChange={handleChange}
            required
            fullWidth
          />
        </div>
        
        <div className="md:col-span-2">
          <Input
            label="Tags"
            name="tags"
            value={formData.tags}
            onChange={handleChange}
            helperText="Comma-separated tags (e.g., utility, productivity, gaming)"
            fullWidth
          />
        </div>
        
        <div className="md:col-span-2">
          <label className="flex items-center space-x-2 cursor-pointer">
            <input
              type="checkbox"
              name="isFeatured"
              checked={formData.isFeatured}
              onChange={handleChange}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Feature this software (displayed prominently)
            </span>
          </label>
        </div>
        
        <div>
          <p className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
            Software File
          </p>
          <div
            {...getSoftwareRootProps()}
            className={`border-2 border-dashed rounded-lg p-6 cursor-pointer transition-colors ${
              softwareFile 
                ? 'border-green-500 bg-green-50 dark:bg-green-900/20' 
                : 'border-gray-300 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800'
            }`}
          >
            <input {...getSoftwareInputProps()} />
            <div className="flex flex-col items-center justify-center text-center">
              {softwareFile ? (
                <>
                  <div className="flex items-center justify-center h-12 w-12 rounded-full bg-green-100 dark:bg-green-900 mb-3">
                    <Upload className="h-6 w-6 text-green-600 dark:text-green-400" />
                  </div>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    {softwareFile.name}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {(softwareFile.size / (1024 * 1024)).toFixed(2)} MB
                  </p>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setSoftwareFile(null);
                    }}
                    className="mt-2 inline-flex items-center text-xs text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300"
                  >
                    <X className="h-3 w-3 mr-1" />
                    Remove file
                  </button>
                </>
              ) : (
                <>
                  <div className="flex items-center justify-center h-12 w-12 rounded-full bg-gray-100 dark:bg-gray-800 mb-3">
                    <Upload className="h-6 w-6 text-gray-600 dark:text-gray-400" />
                  </div>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    Drag and drop or click to upload
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    ZIP, EXE, DMG, or APP files
                  </p>
                </>
              )}
            </div>
          </div>
        </div>
        
        <div>
          <p className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
            Thumbnail Image (Optional)
          </p>
          <div
            {...getThumbnailRootProps()}
            className={`border-2 border-dashed rounded-lg p-6 cursor-pointer transition-colors ${
              thumbnailFile 
                ? 'border-green-500 bg-green-50 dark:bg-green-900/20' 
                : 'border-gray-300 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800'
            }`}
          >
            <input {...getThumbnailInputProps()} />
            <div className="flex flex-col items-center justify-center text-center">
              {thumbnailFile ? (
                <>
                  {thumbnailPreview && (
                    <div className="mb-3 relative">
                      <img
                        src={thumbnailPreview}
                        alt="Thumbnail preview"
                        className="h-24 w-auto rounded object-cover"
                      />
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setThumbnailFile(null);
                          setThumbnailPreview('');
                        }}
                        className="absolute -top-2 -right-2 bg-red-100 dark:bg-red-900 text-red-600 dark:text-red-400 rounded-full p-0.5"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  )}
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    {thumbnailFile.name}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {(thumbnailFile.size / (1024 * 1024)).toFixed(2)} MB
                  </p>
                </>
              ) : (
                <>
                  <div className="flex items-center justify-center h-12 w-12 rounded-full bg-gray-100 dark:bg-gray-800 mb-3">
                    <Image className="h-6 w-6 text-gray-600 dark:text-gray-400" />
                  </div>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    Drag and drop or click to upload
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    JPG, PNG, or WebP
                  </p>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
      
      <div className="flex justify-end">
        <Button
          type="submit"
          disabled={!softwareFile || isUploading}
          isLoading={isUploading}
        >
          Upload Software
        </Button>
      </div>
    </form>
  );
}