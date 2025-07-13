
import React, { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

interface UserProfile {
  id: string;
  full_name: string | null;
  primary_role: string | null;
  phone_number: string | null;
  email: string | null;
}

interface AuthContextType {
  user: any;
  profile: UserProfile | null;
  loading: boolean;
  signOut: (redirectTo?: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  // Helper to fetch profile
  const fetchProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("id, full_name, primary_role, phone_number, email")
        .eq("id", userId)
        .single();
      
      if (error) {
        console.error("Error fetching profile:", error);
        setProfile(null);
      } else {
        setProfile(data || null);
      }
    } catch (error) {
      console.error("Error fetching profile:", error);
      setProfile(null);
    }
  };

  useEffect(() => {
    let isInitialized = false;
    let isSigningOut = false;

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        console.log("Auth state change:", event, session?.user?.id);
        
        // If we're in the process of signing out, don't restore the session
        if (isSigningOut && event === 'TOKEN_REFRESHED') {
          console.log("Preventing session restoration during sign out");
          return;
        }
        
        setUser(session?.user ?? null);
        
        if (session?.user) {
          // Defer the profile fetch to avoid deadlock and handle loading properly
          setTimeout(async () => {
            await fetchProfile(session.user.id);
            if (!isInitialized) {
              isInitialized = true;
              setLoading(false);
            }
          }, 0);
        } else {
          setProfile(null);
          if (!isInitialized) {
            isInitialized = true;
            setLoading(false);
          }
        }
      }
    );

    // Get the current session
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      console.log("Initial session:", session?.user?.id);
      
      // If we already processed this through onAuthStateChange, don't duplicate
      if (!isInitialized) {
        setUser(session?.user ?? null);
        
        if (session?.user) {
          await fetchProfile(session.user.id);
        } else {
          setProfile(null);
        }
        
        isInitialized = true;
        setLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const signOut = async (redirectTo: string = '/') => {
    try {
      // Set flag to prevent session restoration
      let isSigningOut = true;
      
      // Clear the session completely
      await supabase.auth.signOut({ scope: 'global' });
      
      // Clear local state
      setUser(null);
      setProfile(null);
      
      // Clear any cached data
      if (typeof window !== 'undefined') {
        // Clear any localStorage items that might be related to auth
        localStorage.removeItem('supabase.auth.token');
        localStorage.removeItem('supabase.auth.expires_at');
        localStorage.removeItem('supabase.auth.refresh_token');
        
        // Clear any other potential auth-related items
        const keysToRemove = [];
        for (let i = 0; i < localStorage.length; i++) {
          const key = localStorage.key(i);
          if (key && key.includes('supabase') && key.includes('auth')) {
            keysToRemove.push(key);
          }
        }
        keysToRemove.forEach(key => localStorage.removeItem(key));
        
        // Navigate to the specified page (default to homepage)
        window.location.href = redirectTo;
      }
    } catch (error) {
      console.error('Sign out error:', error);
      // Even if there's an error, clear local state and redirect
      setUser(null);
      setProfile(null);
      if (typeof window !== 'undefined') {
        window.location.href = redirectTo;
      }
    }
  };

  return (
    <AuthContext.Provider value={{ user, profile, loading, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}; 
