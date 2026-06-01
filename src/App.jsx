import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import styled from 'styled-components';
import { ThemeProvider, useTheme } from './context/ThemeContext';
import Header from './components/Header';
import CalendarPage from './pages/CalendarPage';
import DayDetailPage from './pages/DayDetailPage';

const AppWrapper = styled.div`
  background-color: ${props => props.theme.background};
  color: ${props => props.theme.text};
  min-height: 100vh;
  transition: background-color 0.3s ease, color 0.3s ease;
`;

const AppContent = () => {
  const { theme } = useTheme();

  return (
    <AppWrapper theme={theme}>
      <Router>
        <Header />
        <Routes>
          <Route path="/" element={<CalendarPage />} />
          <Route path="/day/:date" element={<DayDetailPage />} />
        </Routes>
      </Router>
    </AppWrapper>
  );
};

const App = () => {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
};

export default App;
