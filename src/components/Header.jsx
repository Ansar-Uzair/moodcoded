import styled from 'styled-components';
import { useTheme } from '../context/ThemeContext';
import { useNavigate } from 'react-router-dom';

const HeaderContainer = styled.header`
  background-color: ${props => props.theme.cardBackground};
  border-bottom: 1px solid ${props => props.theme.border};
  padding: 1rem 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const Title = styled.h1`
  font-size: 1.8rem;
  margin: 0;
  color: ${props => props.theme.text};
  cursor: pointer;
  transition: color 0.3s ease;

  &:hover {
    color: ${props => props.theme.accent};
  }
`;

const Controls = styled.div`
  display: flex;
  gap: 1rem;
  align-items: center;
`;

const ThemeToggleButton = styled.button`
  background: ${props => props.theme.accent};
  color: white;
  border: none;
  padding: 0.6rem 1.2rem;
  border-radius: 8px;
  cursor: pointer;
  font-size: 1rem;
  transition: all 0.3s ease;

  &:hover {
    transform: scale(1.05);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  }

  &:active {
    transform: scale(0.95);
  }
`;

const Header = () => {
  const { theme, isDark, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const handleTitleClick = () => {
    navigate('/');
  };

  return (
    <HeaderContainer theme={theme}>
      <Title onClick={handleTitleClick} theme={theme}>
        🌙 Mood Journal
      </Title>
      <Controls>
        <ThemeToggleButton onClick={toggleTheme} theme={theme}>
          {isDark ? '☀️ Light' : '🌙 Dark'}
        </ThemeToggleButton>
      </Controls>
    </HeaderContainer>
  );
};

export default Header;
