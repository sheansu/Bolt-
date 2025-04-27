import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser, fetchUserData } from '../context/UserContext';
import { UserCircle } from 'lucide-react';

interface LoginProps {
  setIsLoggedIn: (value: boolean) => void;
}

const Login = ({ setIsLoggedIn }: LoginProps) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { setUser, setLoading } = useUser();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!username || !password) {
      setError('Please enter both username and password');
      return;
    }
    
    try {
      setLoading(true);
      // In a real app, you would validate credentials with an API call
      // For demo, we'll use mock data and simulate the login
      const userData = await fetchUserData(1); // Use a fixed ID for demo
      
      setUser(userData);
      localStorage.setItem('user', JSON.stringify(userData));
      setIsLoggedIn(true);
      navigate('/dashboard');
    } catch (err) {
      setError('Invalid credentials. Please try again.');
      console.error('Login error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 card fade-in">
      <div className="flex flex-col items-center mb-6">
        <UserCircle size={64} className="text-blue-500 mb-2" />
        <h2 className="text-2xl font-bold text-gray-800">Welcome to CashCat</h2>
        <p className="text-gray-600">Sign in to manage your finances</p>
      </div>
      
      {error && (
        <div className="bg-red-100 text-red-700 p-3 rounded-md mb-4">
          {error}
        </div>
      )}
      
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="username" className="form-label">
            Username
          </label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="form-input"
            placeholder="Enter your username"
          />
        </div>
        
        <div className="mb-6">
          <label htmlFor="password" className="form-label">
            Password
          </label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="form-input"
            placeholder="Enter your password"
          />
        </div>
        
        <button
          type="submit"
          className="w-full btn btn-primary"
        >
          Sign In
        </button>
      </form>
      
      <div className="mt-6 text-center">
        <p className="text-sm text-gray-600">
          Don't have an account? <a href="#" className="text-blue-500 hover:underline">Sign up</a>
        </p>
      </div>
    </div>
  );
};

export default Login;