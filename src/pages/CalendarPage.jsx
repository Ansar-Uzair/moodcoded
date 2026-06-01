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

const CalendarPage = () => {
  const { theme } = useTheme();
  const { moods } = useMoodData();
  const currentDate = new Date();

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
