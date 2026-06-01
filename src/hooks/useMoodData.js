import { useState, useEffect, useCallback } from 'react';

const STORAGE_KEY = 'moodData';

const useMoodData = () => {
  const [moods, setMoods] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : {};
  });

  // Persist to localStorage whenever moods change
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(moods));
  }, [moods]);

  const getMood = useCallback((dateString) => {
    return moods[dateString] || null;
  }, [moods]);

  const saveMood = useCallback((dateString, rating, entry = '') => {
    setMoods(prev => ({
      ...prev,
      [dateString]: {
        rating: Math.max(1, Math.min(10, rating)), // Ensure 1-10
        entry: entry.trim(),
        timestamp: new Date().toISOString()
      }
    }));
  }, []);

  const deleteMood = useCallback((dateString) => {
    setMoods(prev => {
      const newMoods = { ...prev };
      delete newMoods[dateString];
      return newMoods;
    });
  }, []);

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

  const clearAllMoods = useCallback(() => {
    if (confirm('Are you sure? This will delete all mood data.')) {
      setMoods({});
      localStorage.removeItem(STORAGE_KEY);
    }
  }, []);

  return {
    moods,
    getMood,
    saveMood,
    deleteMood,
    getAllMoods,
    getMoodsForMonth,
    clearAllMoods
  };
};

export default useMoodData;
