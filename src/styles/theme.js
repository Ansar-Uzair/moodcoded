/**
 * Theme configuration with color palettes
 */

const lightTheme = {
  name: 'light',
  background: '#FFFFFF',
  cardBackground: '#F9F9F9',
  text: '#333333',
  textSecondary: '#666666',
  border: '#E0E0E0',
  accent: '#6C63FF',
  accentLight: '#E8E4FF',
  moodColors: {
    1: '#FFB6C6', // Very Bad
    2: '#FFB6C6',
    3: '#FFD4A3', // Bad
    4: '#FFD4A3',
    5: '#FFFFBA', // Neutral
    6: '#FFFFBA',
    7: '#B6F5B6', // Good
    8: '#B6F5B6',
    9: '#A8D5FF', // Great
    10: '#A8D5FF'
  }
};

const darkTheme = {
  name: 'dark',
  background: '#1E1E1E',
  cardBackground: '#2D2D2D',
  text: '#EEEEEE',
  textSecondary: '#AAAAAA',
  border: '#444444',
  accent: '#8B7FFF',
  accentLight: '#3D3858',
  moodColors: {
    1: '#FF6B8A', // Very Bad
    2: '#FF6B8A',
    3: '#FFB347', // Bad
    4: '#FFB347',
    5: '#FFD700', // Neutral
    6: '#FFD700',
    7: '#6FCF97', // Good
    8: '#6FCF97',
    9: '#4A9EFF', // Great
    10: '#4A9EFF'
  }
};

export { lightTheme, darkTheme };
