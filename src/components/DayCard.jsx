import styled from 'styled-components';
import { getMoodColor, getMoodLabel } from '../utils/moodUtils';

const DayCardContainer = styled.div`
  aspect-ratio: 1;
  border: 1px solid ${props => props.theme.border};
  border-radius: 8px;
  padding: 0.5rem;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  background-color: ${props => props.backgroundColor};
  position: relative;
  overflow: hidden;

  &:hover {
    transform: scale(1.05);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  }

  &:active {
    transform: scale(0.95);
  }

  &.empty {
    background-color: ${props => props.theme.cardBackground};
    cursor: default;

    &:hover {
      transform: none;
      box-shadow: none;
    }
  }
`;

const DayNumber = styled.div`
  font-weight: bold;
  color: ${props => props.theme.text};
  font-size: 0.9rem;
`;

const MoodRating = styled.div`
  font-size: 1.2rem;
  font-weight: bold;
  color: #333;
  text-align: center;
`;

const MoodLabel = styled.div`
  font-size: 0.65rem;
  color: #555;
  text-align: center;
  opacity: 0.8;
  text-transform: uppercase;
`;

const Tooltip = styled.div`
  position: absolute;
  bottom: 100%;
  left: 50%;
  transform: translateX(-50%) translateY(-5px);
  background-color: ${props => props.theme.text};
  color: ${props => props.theme.background};
  padding: 0.5rem 0.75rem;
  border-radius: 6px;
  white-space: nowrap;
  font-size: 0.8rem;
  opacity: 0;
  pointer-events: none;
  transition: opacity 0.3s ease;
  z-index: 10;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);

  &::after {
    content: '';
    position: absolute;
    top: 100%;
    left: 50%;
    transform: translateX(-50%);
    width: 0;
    height: 0;
    border-left: 4px solid transparent;
    border-right: 4px solid transparent;
    border-top: 4px solid ${props => props.theme.text};
  }
`;

const DayCard = ({ day, mood, onClick, isEmpty = false, isDark = false, theme = {} }) => {
  if (isEmpty) {
    return <DayCardContainer className="empty" theme={theme} />;
  }

  const backgroundColor = mood?.rating ? getMoodColor(mood.rating, isDark) : theme.cardBackground;
  const showTooltip = mood?.rating;
  const label = mood?.rating ? getMoodLabel(mood.rating) : '';

  return (
    <DayCardContainer
      backgroundColor={backgroundColor}
      onClick={onClick}
      theme={theme}
      title={showTooltip ? `${label} (Rating: ${mood.rating}/10)` : ''}
    >
      <DayNumber theme={theme}>{day}</DayNumber>
      {showTooltip && (
        <>
          <MoodRating>{mood.rating}</MoodRating>
          <MoodLabel>{label}</MoodLabel>
          <Tooltip theme={theme}>
            {label}: {mood.rating}/10
          </Tooltip>
        </>
      )}
    </DayCardContainer>
  );
};

export default DayCard;
