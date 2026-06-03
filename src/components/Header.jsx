import styled from 'styled-components';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
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

const Button = styled.button`
  background: ${props => props.variant === 'logout' ? '#e74c3c' : props.theme.accent};
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

const UserInfo = styled.span`
  font-size: 0.9rem;
  opacity: 0.7;
`;

const Header = () => {
  const { theme, isDark, toggleTheme } = useTheme();
  const { logout, user } = useAuth();
  const navigate = useNavigate();

  // Don't render header if not logged in
  if (!user) {
    return null;
  }

  const handleTitleClick = () => {
    navigate('/');
  };

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <HeaderContainer theme={theme}>
      <Title onClick={handleTitleClick} theme={theme}>
        🌙 Mood Journal
      </Title>
      <Controls>
        {user && <UserInfo>@{user.user_metadata?.username || 'user'}</UserInfo>}
        <Button onClick={toggleTheme} theme={theme}>
          {isDark ? '☀️ Light' : '🌙 Dark'}
        </Button>
        {user && (
          <Button onClick={handleLogout} variant="logout">
            Logout
          </Button>
        )}
      </Controls>
    </HeaderContainer>
  );
};

export default Header;
