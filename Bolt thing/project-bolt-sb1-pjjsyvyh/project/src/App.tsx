import { useState, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import MoneyManager from './pages/MoneyManager';
import Savings from './pages/Savings';
import Settings from './pages/Settings';
import { UserProvider } from './context/UserContext';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  
  // Check if user is already logged in
  useEffect(() => {
    const user = localStorage.getItem('user');
    if (user) {
      setIsLoggedIn(true);
    }
  }, []);

  return (
    <UserProvider>
      <div className="min-h-screen bg-gray-100">
        <Navbar isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} />
        <div className="container mx-auto px-4 py-6">
          <Routes>
            <Route path="/login" element={<Login setIsLoggedIn={setIsLoggedIn} />} />
            <Route path="/dashboard" element={isLoggedIn ? <Dashboard /> : <Navigate to="/login" />} />
            <Route path="/money-manager" element={isLoggedIn ? <MoneyManager /> : <Navigate to="/login" />} />
            <Route path="/savings" element={isLoggedIn ? <Savings /> : <Navigate to="/login" />} />
            <Route path="/settings" element={isLoggedIn ? <Settings /> : <Navigate to="/login" />} />
            <Route path="/" element={<Navigate to={isLoggedIn ? "/dashboard" : "/login"} />} />
          </Routes>
        </div>
      </div>
    </UserProvider>
  );
}

export default App;