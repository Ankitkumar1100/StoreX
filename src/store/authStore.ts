import { create } from 'zustand';
import { supabase } from '../lib/supabase';
import type { User } from '@supabase/supabase-js';
import type { Profile } from '../lib/supabase';

type AuthState = {
  user: User | null;
  profile: Profile | null;
  isAdmin: boolean;
  isLoading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: any | null }>;
  signOut: () => Promise<void>;
  initialize: () => Promise<void>;
};

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  profile: null,
  isAdmin: false,
  isLoading: true,
  
  signIn: async (email, password) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    
    if (error) {
      return { error };
    }
    
    if (data.user) {
      await get().initialize();
    }
    
    return { error: null };
  },
  
  signOut: async () => {
    await supabase.auth.signOut();
    set({ user: null, profile: null, isAdmin: false });
  },
  
  initialize: async () => {
    set({ isLoading: true });
    
    // Get the current session
    const { data: { session } } = await supabase.auth.getSession();
    
    if (session?.user) {
      // Get user profile
      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', session.user.id)
        .single();
      
      set({ 
        user: session.user,
        profile,
        isAdmin: profile?.is_admin || false,
        isLoading: false
      });
    } else {
      set({ 
        user: null,
        profile: null,
        isAdmin: false,
        isLoading: false
      });
    }
  },
}));