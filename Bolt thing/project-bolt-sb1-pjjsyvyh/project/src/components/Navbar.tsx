import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, X, User, DollarSign, PiggyBank, Settings, LogOut } from 'lucide-react';
import { useUser } from '../context/UserContext';

interface NavbarProps {
  isLoggedIn: boolean;
  setIsLoggedIn: (value: boolean) => void;
}

const Navbar = ({ isLoggedIn, setIsLoggedIn }: NavbarProps) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user } = useUser();
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('user');
    setIsLoggedIn(false);
    navigate('/login');
  };

  return (
    <nav className="bg-[#2c3e50] text-white shadow-md">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center py-4">
          <Link to="/" className="text-2xl font-bold flex items-center">
            <PiggyBank className="mr-2" />
            CashCat
          </Link>
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex space-x-8 items-center">
            {isLoggedIn && (
              <>
                <Link to="/dashboard" className="hover:text-blue-300 transition-colors duration-200">
                  Dashboard
                </Link>
                <Link to="/money-manager" className="hover:text-blue-300 transition-colors duration-200">
                  Money Manager
                </Link>
                <Link to="/savings" className="hover:text-blue-300 transition-colors duration-200">
                  Savings
                </Link>
                <Link to="/settings" className="hover:text-blue-300 transition-colors duration-200">
                  Settings
                </Link>
              </>
            )}
            
            {isLoggedIn ? (
              <div className="flex items-center gap-4">
                <div className="text-sm">
                  <span className="block font-medium">
                    {user?.firstName} {user?.lastName}
                  </span>
                </div>
                <button 
                  onClick={handleLogout}
                  className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md transition-colors duration-200"
                >
                  Logout
                </button>
              </div>
            ) : (
              <Link 
                to="/login" 
                className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md transition-colors duration-200"
              >
                Login
              </Link>
            )}
          </div>
          
          {/* Mobile menu button */}
          <div className="md:hidden">
            <button 
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="focus:outline-none"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
        
        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden py-4 slide-in">
            {isLoggedIn && (
              <div className="flex flex-col space-y-4">
                <Link 
                  to="/dashboard" 
                  className="flex items-center hover:bg-gray-700 px-4 py-2 rounded"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <User className="mr-2" size={18} />
                  Dashboard
                </Link>
                <Link 
                  to="/money-manager" 
                  className="flex items-center hover:bg-gray-700 px-4 py-2 rounded"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <DollarSign className="mr-2" size={18} />
                  Money Manager
                </Link>
                <Link 
                  to="/savings" 
                  className="flex items-center hover:bg-gray-700 px-4 py-2 rounded"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <PiggyBank className="mr-2" size={18} />
                  Savings
                </Link>
                <Link 
                  to="/settings" 
                  className="flex items-center hover:bg-gray-700 px-4 py-2 rounded"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <Settings className="mr-2" size={18} />
                  Settings
                </Link>
                <button 
                  onClick={() => {
                    handleLogout();
                    setIsMenuOpen(false);
                  }}
                  className="flex items-center text-left hover:bg-red-700 px-4 py-2 rounded text-red-300"
                >
                  <LogOut className="mr-2" size={18} />
                  Logout
                </button>
              </div>
            )}
            
            {!isLoggedIn && (
              <Link 
                to="/login" 
                className="block bg-blue-500 hover:bg-blue-600 text-white text-center px-4 py-2 rounded-md transition-colors duration-200"
                onClick={() => setIsMenuOpen(false)}
              >
                Login
              </Link>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;