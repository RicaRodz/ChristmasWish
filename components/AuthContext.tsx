import React, { createContext, useContext, useState, useEffect } from 'react';
import { createClient, SupabaseClient, User } from '@supabase/supabase-js';

// --- Type Definitions ---

// Define the shape of the data provided by the AuthContext
interface AuthContextType {
  currentUser: User | null;
  loading: boolean;
  signUp: (email: string, password: string) => Promise<any>;
  signIn: (email: string, password: string) => Promise<any>;
  signOut: () => Promise<any>;
  supabase: SupabaseClient;
}

// Default value for context, using "as AuthContextType" for non-null assertion
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// --- Supabase Client Initialization ---
// NOTE: Use your actual environment variables here.
const supabaseUrl: string = process.env.NEXT_PUBLIC_SUPABASE_URL || 'YOUR_SUPABASE_PROJECT_URL'; 
const supabaseAnonKey: string = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'YOUR_SUPABASE_ANON_PUBLIC_KEY'; 

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
export const AuthProvider: React.FC = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // --- Auth API Methods ---
  const signUp = (email: string, password: string) => {
    return supabase.auth.signUp({ email, password });
  };

  const signIn = (email: string, password: string) => {
    return supabase.auth.signInWithPassword({ email, password });
  };

  const signOut = () => {
    return supabase.auth.signOut();
  };
  
  // --- Session Listener and Initial Check ---
  useEffect(() => {
    // 1. Check initial session
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setCurrentUser(user);
      setLoading(false);
    };

    checkUser();
    
    // 2. Listen for real-time auth changes
    const { data: authListener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        // Update user state whenever the authentication status changes
        setCurrentUser(session?.user ?? null);
        setLoading(false);
      }
    );

    return () => {
      authListener?.unsubscribe(); // Cleanup the listener
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