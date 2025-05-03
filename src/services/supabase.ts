
import { createClient } from '@supabase/supabase-js';

// Check for environment variables
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

// Types for our database tables
export type UserRole = 'teacher' | 'parent';

export interface UserProfile {
  id: string;
  email: string;
  role: UserRole;
  full_name?: string;
  school?: string;
  created_at: string;
}

export interface StudentWork {
  id: string;
  student_name: string;
  subject: string;
  image_url: string;
  parent_id: string;
  teacher_id?: string;
  feedback?: string;
  error_type?: string;
  remediation?: string;
  created_at: string;
}

export interface LessonPlan {
  id: string;
  title: string;
  objectives: string;
  materials: string;
  steps: string;
  assessment: string;
  teacher_id: string;
  grade_level: string;
  created_at: string;
}

// Create Supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Check if we have valid credentials
const hasCredentials = supabaseUrl && supabaseAnonKey;
if (!hasCredentials) {
  console.error('Missing Supabase credentials. Please set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY environment variables.');
}

export const getCurrentUser = async () => {
  const { data: { user }, error } = await supabase.auth.getUser();
  if (error) {
    console.error('Error fetching current user:', error);
    return null;
  }
  return user;
};

export const getUserProfile = async (userId: string): Promise<UserProfile | null> => {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single();
  
  if (error) {
    console.error('Error fetching user profile:', error);
    return null;
  }
  
  return data as UserProfile;
};

export const signOut = async () => {
  const { error } = await supabase.auth.signOut();
  if (error) {
    throw error;
  }
  return true;
};

// Add helper function to create profile after signup
export const createUserProfile = async (userId: string, email: string, role: UserRole, fullName?: string) => {
  const { error } = await supabase.from('profiles').insert([
    {
      id: userId,
      email,
      role,
      full_name: fullName || '',
      created_at: new Date().toISOString()
    }
  ]);

  if (error) {
    console.error('Error creating user profile:', error);
    throw error;
  }
}

// Add helper function to check if profiles table exists
export const checkProfilesTable = async () => {
  const { error } = await supabase.from('profiles').select('id').limit(1);
  return !error;
}
