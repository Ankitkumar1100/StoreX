import { createClient } from '@supabase/supabase-js';

// Ensure environment variables are defined or provide fallbacks
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

// Create Supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Type definitions for Supabase tables
export type Software = {
  id: string;
  created_at: string;
  title: string;
  description: string;
  category: string;
  version: string;
  file_url: string;
  file_size: number;
  thumbnail_url: string | null;
  download_count: number;
  tags: string[];
  is_featured: boolean;
  author_id: string;
};

export type Profile = {
  id: string;
  created_at: string;
  username: string;
  avatar_url: string | null;
  is_admin: boolean;
};

// Helper functions for database operations
export const getSoftware = async () => {
  const { data, error } = await supabase
    .from('software')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching software:', error);
    return [];
  }

  return data;
};

export const getSoftwareById = async (id: string) => {
  const { data, error } = await supabase
    .from('software')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    console.error('Error fetching software:', error);
    return null;
  }

  return data;
};

export const incrementDownloadCount = async (id: string) => {
  const { error } = await supabase
    .from('software')
    .update({ download_count: supabase.rpc('increment', { row_id: id }) })
    .eq('id', id);

  if (error) {
    console.error('Error incrementing download count:', error);
  }
};