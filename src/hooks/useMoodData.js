import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../utils/supabaseClient';
import { useAuth } from '../context/AuthContext';

const useMoodData = () => {
  const { user } = useAuth();
  const [moods, setMoods] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch moods from Supabase on user login
  useEffect(() => {
    if (!user) {
      setMoods({});
      setLoading(false);
      return;
    }

    const fetchMoods = async () => {
      try {
        setError(null);
        const { data, error: fetchError } = await supabase
          .from('moods')
          .select('*')
          .eq('user_id', user.id);

        if (fetchError) throw fetchError;

        // Convert array to object keyed by date
        const moodsByDate = {};
        if (data && Array.isArray(data)) {
          data.forEach(mood => {
            moodsByDate[mood.date] = {
              rating: mood.rating,
              entry: mood.entry,
              timestamp: mood.timestamp,
            };
          });
        }
        setMoods(moodsByDate);
        setLoading(false);
      } catch (err) {
        console.error('Failed to fetch moods:', err);
        setError('Failed to load mood data. Please check your connection.');
        setLoading(false);
      }
    };

    fetchMoods();

    // Subscribe to real-time changes
    const channel = supabase
      .channel('moods')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'moods',
          filter: `user_id=eq.${user.id}`,
        },
        (payload) => {
          if (payload.eventType === 'INSERT' || payload.eventType === 'UPDATE') {
            setMoods(prev => ({
              ...prev,
              [payload.new.date]: {
                rating: payload.new.rating,
                entry: payload.new.entry,
                timestamp: payload.new.timestamp,
              },
            }));
          } else if (payload.eventType === 'DELETE') {
            setMoods(prev => {
              const updated = { ...prev };
              delete updated[payload.old.date];
              return updated;
            });
          }
        }
      )
      .subscribe();

    return () => {
      channel.unsubscribe();
    };
  }, [user]);

  const getMood = useCallback((dateString) => {
    return moods[dateString] || null;
  }, [moods]);

  const saveMood = useCallback(async (dateString, rating, entry = '') => {
    if (!user) {
      setError('User not authenticated');
      return;
    }

    try {
      setError(null);
      const moodData = {
        user_id: user.id,
        date: dateString,
        rating: Math.max(1, Math.min(10, rating)),
        entry: entry.trim(),
        timestamp: new Date().toISOString(),
      };

      // Try to update existing mood, if it doesn't exist, insert new one
      const { error: upsertError } = await supabase
        .from('moods')
        .upsert([moodData], { onConflict: 'user_id,date' });

      if (upsertError) throw upsertError;

      // Update local state optimistically
      setMoods(prev => ({
        ...prev,
        [dateString]: {
          rating: moodData.rating,
          entry: moodData.entry,
          timestamp: moodData.timestamp,
        },
      }));
    } catch (err) {
      console.error('Failed to save mood:', err);
      setError('Failed to save mood. Please check your connection and try again.');
    }
  }, [user]);

  const deleteMood = useCallback(async (dateString) => {
    if (!user) {
      setError('User not authenticated');
      return;
    }

    try {
      setError(null);
      const { error: deleteError } = await supabase
        .from('moods')
        .delete()
        .eq('user_id', user.id)
        .eq('date', dateString);

      if (deleteError) throw deleteError;

      // Update local state optimistically
      setMoods(prev => {
        const updated = { ...prev };
        delete updated[dateString];
        return updated;
      });
    } catch (err) {
      console.error('Failed to delete mood:', err);
      setError('Failed to delete mood. Please check your connection and try again.');
    }
  }, [user]);

  const getAllMoods = useCallback(() => {
    return moods;
  }, [moods]);

  const getMoodsForMonth = useCallback((year, month) => {
    const monthStr = `${year}-${String(month).padStart(2, '0')}`;
    const monthMoods = {};
    Object.entries(moods).forEach(([date, mood]) => {
      if (date.startsWith(monthStr)) {
        monthMoods[date] = mood;
      }
    });
    return monthMoods;
  }, [moods]);

  const clearAllMoods = useCallback(async () => {
    if (!user) {
      setError('User not authenticated');
      return;
    }

    if (!confirm('Are you sure? This will delete all mood data.')) {
      return;
    }

    try {
      setError(null);
      const { error: deleteError } = await supabase
        .from('moods')
        .delete()
        .eq('user_id', user.id);

      if (deleteError) throw deleteError;

      setMoods({});
    } catch (err) {
      console.error('Failed to clear moods:', err);
      setError('Failed to clear moods. Please check your connection and try again.');
    }
  }, [user]);

  return {
    moods,
    getMood,
    saveMood,
    deleteMood,
    getAllMoods,
    getMoodsForMonth,
    clearAllMoods,
    loading,
    error,
  };
};

export default useMoodData;
