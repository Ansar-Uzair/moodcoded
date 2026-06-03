import styled from 'styled-components';
import Calendar from '../components/Calendar';
import StatsPanel from '../components/StatsPanel';
import { useTheme } from '../context/ThemeContext';
import useMoodData from '../hooks/useMoodData';

const PageContainer = styled.div`
  max-width: 1400px;
  margin: 0 auto;
  padding: 2rem;
  background-color: ${props => props.theme.background};
  min-height: calc(100vh - 74px); // Account for header
`;

const ContentGrid = styled.div`
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 2rem;
  
  @media (max-width: 1024px) {
    grid-template-columns: 1fr;
  }
`;

const LoadingContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: calc(100vh - 74px);
  font-size: 1.2rem;
  color: #888;
`;

const ErrorContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: calc(100vh - 74px);
  flex-direction: column;
  gap: 1rem;
  color: #c00;
  padding: 2rem;
`;

const CalendarPage = () => {
  const { theme } = useTheme();
  const { moods, loading, error } = useMoodData();
  const currentDate = new Date();

  if (loading) {
    return <LoadingContainer>Loading your moods...</LoadingContainer>;
  }

  if (error) {
    return (
      <ErrorContainer>
        <div>⚠️ Error loading moods</div>
        <div style={{ fontSize: '0.9rem' }}>{error}</div>
      </ErrorContainer>
    );
  }

  return (
    <PageContainer theme={theme}>
      <ContentGrid>
        <Calendar moods={moods} />
        <StatsPanel moods={moods} currentDate={currentDate} />
      </ContentGrid>
    </PageContainer>
  );
};

export default CalendarPage;
