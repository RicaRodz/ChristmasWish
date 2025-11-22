'use client';
import React, { createContext, useContext, useState, useEffect } from 'react';
import { createClient, SupabaseClient, User, AuthResponse, AuthTokenResponse, AuthError } from '@supabase/supabase-js';

// --- Type Definitions ---
interface AuthContextType {
  currentUser: User | null;
  loading: boolean;
  // signUp returns AuthResponse (contains data.user, data.session, error)
  signUp: (email: string, password: string) => Promise<AuthResponse>;
  
  // signInWithPassword returns AuthTokenResponse (contains data.user, data.session, error)
  signIn: (email: string, password: string) => Promise<AuthTokenResponse>;
  
  // signOut returns a simple object with an error property
  signOut: () => Promise<{ error: AuthError | null }>;
  
  supabase: SupabaseClient;
}

interface AuthProviderProps {
  children: React.ReactNode;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// --- Supabase Client Initialization ---
const supabaseUrl: string = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey: string = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

const supabase: SupabaseClient = createClient(supabaseUrl, supabaseAnonKey);

// --- Custom Hook ---
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// --- Auth Provider Component ---
export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const signUp = (email: string, password: string) => {
    return supabase.auth.signUp({ email, password });
  };

  const signIn = (email: string, password: string) => {
    return supabase.auth.signInWithPassword({ email, password });
  };

  const signOut = () => {
    return supabase.auth.signOut();
  };

  useEffect(() => {
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setCurrentUser(user);
      setLoading(false);
    };

    checkUser();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setCurrentUser(session?.user ?? null);
        setLoading(false);
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const value: AuthContextType = {
    currentUser,
    loading,
    signUp,
    signIn,
    signOut,
    supabase,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};