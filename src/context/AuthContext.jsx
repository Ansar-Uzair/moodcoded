import { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../utils/supabaseClient';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Check if user is already logged in
    const checkUser = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        setUser(session?.user || null);
      } catch (err) {
        console.error('Auth check failed:', err);
        setError('Failed to check authentication status. Please go back online.');
      } finally {
        setLoading(false);
      }
    };

    checkUser();

    // Subscribe to auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user || null);
      setError(null);
    });

    return () => subscription?.unsubscribe();
  }, []);

  const signup = async (username, password) => {
    try {
      setError(null);

      if (!username || username.length < 3) {
        throw new Error('Username must be at least 3 characters');
      }
      if (!password || password.length < 6) {
        throw new Error('Password must be at least 6 characters');
      }

      // Create auth account using generated email format
      const email = `${username.toLowerCase()}@moodcoded.app`;
      
      const { data, error: signupError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            username: username.toLowerCase(),
          },
        },
      });

      if (signupError) {
        if (signupError.message?.includes('already registered')) {
          throw new Error(`Username "${username}" is already taken`);
        }
        throw signupError;
      }

      // Create profile entry
      if (data.user) {
        const { error: profileError } = await supabase
          .from('profiles')
          .insert([{
            id: data.user.id,
            username: username.toLowerCase(),
          }]);

        if (profileError) {
          console.error('Profile creation error:', profileError);
        }
      }

      return { success: true, data };
    } catch (err) {
      const message = err.message || 'Signup failed. Please check your connection.';
      setError(message);
      return { success: false, error: message };
    }
  };

  const login = async (username, password) => {
    try {
      setError(null);

      const email = `${username.toLowerCase()}@moodcoded.app`;
      
      const { data, error: loginError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (loginError) {
        throw new Error('Invalid username or password');
      }

      return { success: true, data };
    } catch (err) {
      const message = err.message || 'Login failed. Please check your connection.';
      setError(message);
      return { success: false, error: message };
    }
  };

  const logout = async () => {
    try {
      setError(null);
      const { error: logoutError } = await supabase.auth.signOut();
      if (logoutError) throw logoutError;
    } catch (err) {
      const message = err.message || 'Logout failed. Please check your connection.';
      setError(message);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, error, signup, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
