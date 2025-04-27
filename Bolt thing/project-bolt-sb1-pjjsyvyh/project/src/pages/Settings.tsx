import { useState, useEffect } from 'react';
import { useUser } from '../context/UserContext';
import { Settings as SettingsIcon, User, Bell, Lock, HelpCircle, Save } from 'lucide-react';

const Settings = () => {
  const { user, setUser } = useUser();
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [birthdate, setBirthdate] = useState('');
  const [theme, setTheme] = useState('light');
  const [currency, setCurrency] = useState('PHP');
  const [notifications, setNotifications] = useState(true);
  const [weeklyReport, setWeeklyReport] = useState(true);
  const [savingsAlert, setSavingsAlert] = useState(true);
  const [successMessage, setSuccessMessage] = useState('');
  
  useEffect(() => {
    if (user) {
      setFirstName(user.firstName);
      setLastName(user.lastName);
      setBirthdate(user.birthdate);
    }
    
    // Check local storage for settings
    const storedTheme = localStorage.getItem('theme');
    const storedCurrency = localStorage.getItem('currency');
    const storedNotifications = localStorage.getItem('notifications');
    const storedWeeklyReport = localStorage.getItem('weeklyReport');
    const storedSavingsAlert = localStorage.getItem('savingsAlert');
    
    if (storedTheme) setTheme(storedTheme);
    if (storedCurrency) setCurrency(storedCurrency);
    if (storedNotifications) setNotifications(storedNotifications === 'true');
    if (storedWeeklyReport) setWeeklyReport(storedWeeklyReport === 'true');
    if (storedSavingsAlert) setSavingsAlert(storedSavingsAlert === 'true');
  }, [user]);
  
  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (user && setUser) {
      const updatedUser = {
        ...user,
        firstName,
        lastName,
        birthdate
      };
      
      setUser(updatedUser);
      localStorage.setItem('user', JSON.stringify(updatedUser));
      showSuccessMessage('Profile saved successfully!');
    }
  };
  
  const handleSavePreferences = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Save to local storage
    localStorage.setItem('theme', theme);
    localStorage.setItem('currency', currency);
    
    showSuccessMessage('Preferences saved successfully!');
  };
  
  const handleSaveNotifications = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Save to local storage
    localStorage.setItem('notifications', notifications.toString());
    localStorage.setItem('weeklyReport', weeklyReport.toString());
    localStorage.setItem('savingsAlert', savingsAlert.toString());
    
    showSuccessMessage('Notification settings saved successfully!');
  };
  
  const showSuccessMessage = (message: string) => {
    setSuccessMessage(message);
    setTimeout(() => {
      setSuccessMessage('');
    }, 3000);
  };

  return (
    <div className="fade-in">
      <h1 className="text-3xl font-bold mb-6 flex items-center">
        <SettingsIcon className="mr-2" size={28} /> Settings
      </h1>
      
      {successMessage && (
        <div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 mb-6 rounded animate-pulse">
          {successMessage}
        </div>
      )}
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Settings */}
        <div className="card">
          <div className="flex items-center mb-4">
            <User className="mr-2 text-blue-500" size={20} />
            <h2 className="text-xl font-bold">Profile Information</h2>
          </div>
          
          <form onSubmit={handleSaveProfile}>
            <div className="mb-4">
              <label htmlFor="firstName" className="form-label">First Name</label>
              <input
                type="text"
                id="firstName"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                className="form-input"
              />
            </div>
            
            <div className="mb-4">
              <label htmlFor="lastName" className="form-label">Last Name</label>
              <input
                type="text"
                id="lastName"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                className="form-input"
              />
            </div>
            
            <div className="mb-4">
              <label htmlFor="birthdate" className="form-label">Birthdate</label>
              <input
                type="date"
                id="birthdate"
                value={birthdate}
                onChange={(e) => setBirthdate(e.target.value)}
                className="form-input"
              />
            </div>
            
            <button type="submit" className="w-full btn btn-primary flex items-center justify-center">
              <Save size={18} className="mr-2" /> Save Profile
            </button>
          </form>
        </div>
        
        {/* App Preferences */}
        <div className="card">
          <div className="flex items-center mb-4">
            <SettingsIcon className="mr-2 text-purple-500" size={20} />
            <h2 className="text-xl font-bold">App Preferences</h2>
          </div>
          
          <form onSubmit={handleSavePreferences}>
            <div className="mb-4">
              <label htmlFor="theme" className="form-label">Theme</label>
              <select
                id="theme"
                value={theme}
                onChange={(e) => setTheme(e.target.value)}
                className="form-input"
              >
                <option value="light">Light</option>
                <option value="dark">Dark</option>
                <option value="system">System Default</option>
              </select>
            </div>
            
            <div className="mb-4">
              <label htmlFor="currency" className="form-label">Currency</label>
              <select
                id="currency"
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
                className="form-input"
              >
                <option value="PHP">Philippine Peso (₱)</option>
                <option value="USD">US Dollar ($)</option>
                <option value="EUR">Euro (€)</option>
                <option value="JPY">Japanese Yen (¥)</option>
              </select>
            </div>
            
            <div className="mb-4">
              <label className="form-label">Data Privacy</label>
              <div className="mt-2 space-y-2">
                <label className="flex items-center">
                  <input 
                    type="checkbox" 
                    checked={true}
                    className="rounded text-blue-500 mr-2 focus:ring-blue-500" 
                    disabled
                  />
                  <span className="text-sm text-gray-700">Store data locally</span>
                </label>
                
                <label className="flex items-center">
                  <input 
                    type="checkbox" 
                    checked={true}
                    className="rounded text-blue-500 mr-2 focus:ring-blue-500" 
                    disabled
                  />
                  <span className="text-sm text-gray-700">Enable ML features</span>
                </label>
              </div>
            </div>
            
            <button type="submit" className="w-full btn btn-primary flex items-center justify-center">
              <Save size={18} className="mr-2" /> Save Preferences
            </button>
          </form>
        </div>
        
        {/* Notification Settings */}
        <div className="card">
          <div className="flex items-center mb-4">
            <Bell className="mr-2 text-yellow-500" size={20} />
            <h2 className="text-xl font-bold">Notification Settings</h2>
          </div>
          
          <form onSubmit={handleSaveNotifications}>
            <div className="mb-6">
              <div className="space-y-4">
                <label className="flex items-center justify-between">
                  <span className="text-gray-700">Push Notifications</span>
                  <div className="relative inline-block w-12 h-6 transition duration-200 ease-in-out rounded-full">
                    <input
                      type="checkbox"
                      id="pushNotifications"
                      checked={notifications}
                      onChange={(e) => setNotifications(e.target.checked)}
                      className="absolute w-6 h-6 transition-all duration-200 ease-in-out bg-white rounded-full appearance-none cursor-pointer peer checked:bg-blue-500 checked:translate-x-6 border border-gray-300"
                    />
                    <label
                      htmlFor="pushNotifications"
                      className="block h-full overflow-hidden rounded-full cursor-pointer peer-checked:bg-blue-100 bg-gray-200"
                    ></label>
                  </div>
                </label>
                
                <label className="flex items-center justify-between">
                  <span className="text-gray-700">Weekly Report Email</span>
                  <div className="relative inline-block w-12 h-6 transition duration-200 ease-in-out rounded-full">
                    <input
                      type="checkbox"
                      id="weeklyReport"
                      checked={weeklyReport}
                      onChange={(e) => setWeeklyReport(e.target.checked)}
                      className="absolute w-6 h-6 transition-all duration-200 ease-in-out bg-white rounded-full appearance-none cursor-pointer peer checked:bg-blue-500 checked:translate-x-6 border border-gray-300"
                    />
                    <label
                      htmlFor="weeklyReport"
                      className="block h-full overflow-hidden rounded-full cursor-pointer peer-checked:bg-blue-100 bg-gray-200"
                    ></label>
                  </div>
                </label>
                
                <label className="flex items-center justify-between">
                  <span className="text-gray-700">Savings Goal Alerts</span>
                  <div className="relative inline-block w-12 h-6 transition duration-200 ease-in-out rounded-full">
                    <input
                      type="checkbox"
                      id="savingsAlert"
                      checked={savingsAlert}
                      onChange={(e) => setSavingsAlert(e.target.checked)}
                      className="absolute w-6 h-6 transition-all duration-200 ease-in-out bg-white rounded-full appearance-none cursor-pointer peer checked:bg-blue-500 checked:translate-x-6 border border-gray-300"
                    />
                    <label
                      htmlFor="savingsAlert"
                      className="block h-full overflow-hidden rounded-full cursor-pointer peer-checked:bg-blue-100 bg-gray-200"
                    ></label>
                  </div>
                </label>
              </div>
            </div>
            
            <button type="submit" className="w-full btn btn-primary flex items-center justify-center">
              <Save size={18} className="mr-2" /> Save Notification Settings
            </button>
          </form>
        </div>
      </div>
      
      {/* Additional Options */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
        <div className="card">
          <div className="flex items-center mb-4">
            <Lock className="mr-2 text-red-500" size={20} />
            <h2 className="text-xl font-bold">Security</h2>
          </div>
          
          <div className="space-y-4">
            <button className="w-full text-left py-2 px-4 rounded hover:bg-gray-100 transition-colors flex items-center">
              <span className="flex-1">Change Password</span>
              <span className="text-gray-400">→</span>
            </button>
            
            <button className="w-full text-left py-2 px-4 rounded hover:bg-gray-100 transition-colors flex items-center">
              <span className="flex-1">Enable Two-Factor Authentication</span>
              <span className="text-gray-400">→</span>
            </button>
            
            <button className="w-full text-left py-2 px-4 rounded hover:bg-gray-100 transition-colors flex items-center">
              <span className="flex-1">Manage Connected Accounts</span>
              <span className="text-gray-400">→</span>
            </button>
            
            <div className="border-t pt-4">
              <button className="text-red-500 hover:text-red-700 transition-colors text-sm">
                Delete Account
              </button>
            </div>
          </div>
        </div>
        
        <div className="card">
          <div className="flex items-center mb-4">
            <HelpCircle className="mr-2 text-green-500" size={20} />
            <h2 className="text-xl font-bold">Help & Support</h2>
          </div>
          
          <div className="space-y-4">
            <button className="w-full text-left py-2 px-4 rounded hover:bg-gray-100 transition-colors flex items-center">
              <span className="flex-1">FAQs</span>
              <span className="text-gray-400">→</span>
            </button>
            
            <button className="w-full text-left py-2 px-4 rounded hover:bg-gray-100 transition-colors flex items-center">
              <span className="flex-1">Contact Support</span>
              <span className="text-gray-400">→</span>
            </button>
            
            <button className="w-full text-left py-2 px-4 rounded hover:bg-gray-100 transition-colors flex items-center">
              <span className="flex-1">Privacy Policy</span>
              <span className="text-gray-400">→</span>
            </button>
            
            <button className="w-full text-left py-2 px-4 rounded hover:bg-gray-100 transition-colors flex items-center">
              <span className="flex-1">Terms of Service</span>
              <span className="text-gray-400">→</span>
            </button>
          </div>
          
          <div className="mt-4 text-center text-sm text-gray-500">
            <p>CashCat Version 1.0.0</p>
            <p>© 2025 CashCat Financial Services</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;