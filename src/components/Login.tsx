import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Login.css';

interface LoginProps {
  setIsAuthenticated: (value: boolean) => void;
}

// Mock database of authorized users
const VALID_USERS = [
  {
    username: 'admin',
    password: 'SecurePass123!',
    role: 'administrator'
  },
  {
    username: 'guest',
    password: 'SafePassword456@',
    role: 'guest'
  }
];

export default function Login({ setIsAuthenticated }: LoginProps) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Find user with matching credentials
    const authenticatedUser = VALID_USERS.find(user => 
      user.username === username && 
      user.password === password
    );

    if (authenticatedUser) {
      // Create session token with expiration (1 hour)
      const sessionToken = JSON.stringify({
        username: authenticatedUser.username,
        role: authenticatedUser.role,
        expires: Date.now() + 3600000 // 1 hour in milliseconds
      });
      
      localStorage.setItem('authToken', sessionToken);
      setIsAuthenticated(true);
      navigate('/');
    } else {
      setError('Invalid credentials');
      // Security: Clear fields on failed attempt
      setUsername('');
      setPassword('');
    }
  };

  return (
    <div className="login-container">
      <div className="login-form">
        <h2>🔒 Secure Access Portal</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="username">Username</label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              autoComplete="username"
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
              required
            />
          </div>
          {error && <div className="error-message">{error}</div>}
          <button type="submit" className="login-button">
            Sign in
          </button>
        </form>
        
      </div>
    </div>
  );
}
