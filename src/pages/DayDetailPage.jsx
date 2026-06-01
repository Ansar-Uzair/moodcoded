import styled from 'styled-components';
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import useMoodData from '../hooks/useMoodData';
import { formatDisplayDate, parseDate } from '../utils/dateUtils';
import { getMoodColor, getMoodLabel } from '../utils/moodUtils';

const PageContainer = styled.div`
  max-width: 600px;
  margin: 2rem auto;
  padding: 2rem;
  background-color: ${props => props.theme.background};
  min-height: calc(100vh - 74px);
`;

const FormCard = styled.div`
  background-color: ${props => props.theme.cardBackground};
  border-radius: 12px;
  padding: 2rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
`;

const Title = styled.h1`
  color: ${props => props.theme.text};
  margin: 0 0 0.5rem 0;
  font-size: 1.8rem;
`;

const Subtitle = styled.div`
  color: ${props => props.theme.textSecondary};
  margin-bottom: 2rem;
  font-size: 1.1rem;
`;

const FormGroup = styled.div`
  margin-bottom: 2rem;
`;

const Label = styled.label`
  display: block;
  color: ${props => props.theme.text};
  font-weight: bold;
  margin-bottom: 1rem;
  font-size: 1.1rem;
`;

const SliderContainer = styled.div`
  display: flex;
  gap: 1rem;
  align-items: center;
`;

const SliderInput = styled.input`
  flex: 1;
  height: 8px;
  border-radius: 4px;
  background: linear-gradient(
    to right,
    #FFB6C6 0%,
    #FFD4A3 20%,
    #FFFFBA 40%,
    #B6F5B6 60%,
    #A8D5FF 100%
  );
  outline: none;
  -webkit-appearance: none;
  appearance: none;

  &::-webkit-slider-thumb {
    -webkit-appearance: none;
    appearance: none;
    width: 24px;
    height: 24px;
    border-radius: 50%;
    background: ${props => props.theme.accent};
    cursor: pointer;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
    transition: transform 0.2s ease;

    &:hover {
      transform: scale(1.2);
    }
  }

  &::-moz-range-thumb {
    width: 24px;
    height: 24px;
    border-radius: 50%;
    background: ${props => props.theme.accent};
    cursor: pointer;
    border: none;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
    transition: transform 0.2s ease;

    &:hover {
      transform: scale(1.2);
    }
  }
`;

const RatingDisplay = styled.div`
  min-width: 60px;
  text-align: center;
`;

const RatingValue = styled.div`
  font-size: 1.5rem;
  font-weight: bold;
  color: ${props => props.moodColor};
  margin-bottom: 0.25rem;
`;

const RatingLabel = styled.div`
  font-size: 0.85rem;
  color: ${props => props.theme.textSecondary};
  text-transform: uppercase;
`;

const TextArea = styled.textarea`
  width: 100%;
  min-height: 200px;
  padding: 1rem;
  border: 1px solid ${props => props.theme.border};
  border-radius: 8px;
  background-color: ${props => props.theme.background};
  color: ${props => props.theme.text};
  font-family: inherit;
  font-size: 1rem;
  resize: vertical;
  transition: border-color 0.3s ease;

  &:focus {
    outline: none;
    border-color: ${props => props.theme.accent};
    box-shadow: 0 0 0 3px ${props => props.theme.accentLight};
  }

  &::placeholder {
    color: ${props => props.theme.textSecondary};
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 1rem;
  margin-top: 2rem;
`;

const Button = styled.button`
  flex: 1;
  padding: 1rem;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  }

  &:active {
    transform: translateY(0);
  }
`;

const SaveButton = styled(Button)`
  background: ${props => props.theme.accent};
  color: white;
`;

const CancelButton = styled(Button)`
  background: ${props => props.theme.border};
  color: ${props => props.theme.text};
`;

const DeleteButton = styled(Button)`
  background: #ff6b6b;
  color: white;
  margin-top: 1rem;
`;

const DayDetailPage = () => {
  const { date } = useParams();
  const navigate = useNavigate();
  const { theme } = useTheme();
  const { getMood, saveMood, deleteMood } = useMoodData();

  const [rating, setRating] = useState(5);
  const [entry, setEntry] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const mood = getMood(date);
    if (mood) {
      setRating(mood.rating || 5);
      setEntry(mood.entry || '');
    }
    setIsLoading(false);
  }, [date, getMood]);

  const handleSave = () => {
    saveMood(date, parseInt(rating), entry);
    navigate('/');
  };

  const handleDelete = () => {
    if (confirm('Delete mood entry for this day?')) {
      deleteMood(date);
      navigate('/');
    }
  };

  const moodColor = getMoodColor(rating, false);
  const moodLabel = getMoodLabel(rating);

  if (isLoading) {
    return (
      <PageContainer theme={theme}>
        <FormCard theme={theme}>
          <Title theme={theme}>Loading...</Title>
        </FormCard>
      </PageContainer>
    );
  }

  return (
    <PageContainer theme={theme}>
      <FormCard theme={theme}>
        <Title theme={theme}>📝 Mood Entry</Title>
        <Subtitle theme={theme}>{formatDisplayDate(date)}</Subtitle>

        <FormGroup>
          <Label theme={theme}>How are you feeling?</Label>
          <SliderContainer>
            <SliderInput
              type="range"
              min="1"
              max="10"
              value={rating}
              onChange={(e) => setRating(e.target.value)}
              theme={theme}
            />
            <RatingDisplay>
              <RatingValue moodColor={moodColor}>
                {rating}/10
              </RatingValue>
              <RatingLabel theme={theme}>{moodLabel}</RatingLabel>
            </RatingDisplay>
          </SliderContainer>
        </FormGroup>

        <FormGroup>
          <Label theme={theme}>Diary Entry</Label>
          <TextArea
            value={entry}
            onChange={(e) => setEntry(e.target.value)}
            placeholder="Write about your day, thoughts, or feelings..."
            theme={theme}
          />
        </FormGroup>

        <ButtonGroup>
          <CancelButton onClick={() => navigate('/')} theme={theme}>
            Cancel
          </CancelButton>
          <SaveButton onClick={handleSave} theme={theme}>
            Save Entry
          </SaveButton>
        </ButtonGroup>

        {getMood(date) && (
          <DeleteButton onClick={handleDelete} theme={theme}>
            Delete Entry
          </DeleteButton>
        )}
      </FormCard>
    </PageContainer>
  );
};

export default DayDetailPage;
