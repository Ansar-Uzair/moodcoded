import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import styled from 'styled-components';

const LoadingContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  font-size: 1.2rem;
  color: #888;
`;

const ProtectedRoute = ({ children }) => {
  const { user, loading, error } = useAuth();

  if (loading) {
    return <LoadingContainer>Loading...</LoadingContainer>;
  }

  if (error) {
    return (
      <LoadingContainer style={{ flexDirection: 'column', gap: '1rem' }}>
        <div>⚠️ Connection Error</div>
        <div style={{ fontSize: '0.9rem', color: '#c00' }}>{error}</div>
        <div style={{ fontSize: '0.8rem' }}>Please check your internet connection and refresh the page.</div>
      </LoadingContainer>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;
