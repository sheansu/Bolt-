import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useUser } from '../context/UserContext';
import { Doughnut, Line } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, PointElement, LineElement, Title } from 'chart.js';
import { 
  CreditCard, 
  Wallet, 
  Smartphone, 
  DollarSign, 
  ArrowUpRight, 
  ArrowDownRight,
  TrendingUp,
  AlertCircle
} from 'lucide-react';

// Register Chart.js components
ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, PointElement, LineElement, Title);

interface Transaction {
  id: number;
  date: string;
  type: string;
  category: string;
  amount: number;
  description: string;
}

const Dashboard = () => {
  const { user } = useUser();
  const [tip, setTip] = useState('');
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [totalBalance, setTotalBalance] = useState(0);
  const [lastMonthChange, setLastMonthChange] = useState(0);

  // Simulate loading transactions and calculating balances
  useEffect(() => {
    if (user) {
      // Calculate total balance from all accounts
      const total = Object.values(user.accounts).reduce((sum, amount) => sum + amount, 0);
      setTotalBalance(total);
      
      // Simulate monthly change (would come from actual data in a real app)
      setLastMonthChange(Math.random() > 0.5 ? 12.5 : -8.2);
      
      // Simulate fetching transactions
      setTransactions([
        {
          id: 1,
          date: '2025-04-01',
          type: 'expense',
          category: 'Food',
          amount: -120,
          description: 'Grocery shopping'
        },
        {
          id: 2,
          date: '2025-04-02',
          type: 'income',
          category: 'Salary',
          amount: 1500,
          description: 'Monthly salary'
        },
        {
          id: 3,
          date: '2025-04-03',
          type: 'expense',
          category: 'Entertainment',
          amount: -50,
          description: 'Movie tickets'
        },
        {
          id: 4,
          date: '2025-04-05',
          type: 'expense',
          category: 'Transportation',
          amount: -75,
          description: 'Gas'
        },
      ]);
      
      // Simulate ML-generated financial tip
      const tips = [
        "Based on your spending patterns, you could save ₱500 this month by reducing food expenses.",
        "Your entertainment spending is higher than average. Consider setting a budget limit.",
        "You've been consistent with savings goals. Great job maintaining financial discipline!",
        "Consider allocating more to your emergency fund based on your current income level."
      ];
      setTip(tips[Math.floor(Math.random() * tips.length)]);
    }
  }, [user]);
  
  // Format as Philippine Peso
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-PH', {
      style: 'currency',
      currency: 'PHP',
      minimumFractionDigits: 2
    }).format(amount);
  };
  
  // Prepare chart data
  const accountData = {
    labels: ['Cash', 'GCash', 'Debit Card', 'Credit Card'],
    datasets: [
      {
        data: user ? [user.accounts.Cash, user.accounts.Gcash, user.accounts.Debit_Card, user.accounts.Credit_Card] : [],
        backgroundColor: ['#3498db', '#2ecc71', '#9b59b6', '#e74c3c'],
        borderWidth: 1,
      },
    ],
  };
  
  const spendingTrendData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        label: 'Income',
        data: [1200, 1900, 1500, 1800, 2000, 2200],
        borderColor: '#2ecc71',
        backgroundColor: 'rgba(46, 204, 113, 0.1)',
        tension: 0.4,
      },
      {
        label: 'Expenses',
        data: [900, 1200, 1100, 1300, 1400, 1100],
        borderColor: '#e74c3c',
        backgroundColor: 'rgba(231, 76, 60, 0.1)',
        tension: 0.4,
      },
    ],
  };

  return (
    <div className="fade-in">
      <h1 className="text-3xl font-bold mb-6">Financial Dashboard</h1>
      
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="card bg-blue-50 border-l-4 border-blue-500">
          <div className="flex justify-between">
            <div>
              <p className="text-blue-500 font-medium">Total Balance</p>
              <p className="text-2xl font-bold">{formatCurrency(totalBalance)}</p>
            </div>
            <DollarSign className="text-blue-500" size={32} />
          </div>
        </div>
        
        <div className="card bg-green-50 border-l-4 border-green-500">
          <div className="flex justify-between">
            <div>
              <p className="text-green-500 font-medium">Monthly Change</p>
              <p className="text-2xl font-bold flex items-center">
                {lastMonthChange > 0 ? 
                  <>
                    <ArrowUpRight className="text-green-500 mr-1" size={20} />
                    <span className="text-green-500">{lastMonthChange}%</span>
                  </> : 
                  <>
                    <ArrowDownRight className="text-red-500 mr-1" size={20} />
                    <span className="text-red-500">{Math.abs(lastMonthChange)}%</span>
                  </>
                }
              </p>
            </div>
            <TrendingUp className={lastMonthChange > 0 ? "text-green-500" : "text-red-500"} size={32} />
          </div>
        </div>
        
        <div className="card bg-purple-50 border-l-4 border-purple-500">
          <div className="flex justify-between">
            <div>
              <p className="text-purple-500 font-medium">Savings Goal</p>
              <p className="text-2xl font-bold">65%</p>
              <div className="w-full bg-gray-200 rounded-full h-2.5 mt-2">
                <div className="bg-purple-500 h-2.5 rounded-full" style={{ width: '65%' }}></div>
              </div>
            </div>
            <PiggyBank className="text-purple-500" size={32} />
          </div>
        </div>
        
        <div className="card bg-yellow-50 border-l-4 border-yellow-500">
          <div className="flex justify-between">
            <div>
              <p className="text-yellow-500 font-medium">Upcoming Bills</p>
              <p className="text-2xl font-bold">{formatCurrency(350)}</p>
              <p className="text-xs text-gray-500">Due in 5 days</p>
            </div>
            <AlertCircle className="text-yellow-500" size={32} />
          </div>
        </div>
      </div>
      
      {/* ML Insight Card */}
      {tip && (
        <div className="card bg-blue-50 border border-blue-100 mb-6 slide-in">
          <div className="flex items-start">
            <div className="bg-blue-500 p-2 rounded-md mr-4">
              <AlertCircle className="text-white" size={24} />
            </div>
            <div>
              <h3 className="font-semibold text-lg text-gray-800 mb-1">Financial Insight</h3>
              <p className="text-gray-600">{tip}</p>
            </div>
          </div>
        </div>
      )}
      
      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <div className="card">
          <h2 className="text-xl font-bold mb-4">Account Distribution</h2>
          <div className="h-64">
            <Doughnut 
              data={accountData} 
              options={{
                plugins: {
                  legend: {
                    position: 'right',
                  },
                },
                maintainAspectRatio: false,
              }} 
            />
          </div>
        </div>
        
        <div className="card">
          <h2 className="text-xl font-bold mb-4">Income vs Expenses</h2>
          <div className="h-64">
            <Line 
              data={spendingTrendData}
              options={{
                plugins: {
                  legend: {
                    position: 'top',
                  },
                },
                scales: {
                  y: {
                    beginAtZero: true
                  }
                },
                maintainAspectRatio: false,
              }}  
            />
          </div>
        </div>
      </div>
      
      {/* Accounts Section */}
      <div className="card mb-6">
        <h2 className="text-xl font-bold mb-4">Your Accounts</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-blue-50 rounded-lg p-4">
            <div className="flex items-center mb-2">
              <Wallet className="text-blue-500 mr-2" size={20} />
              <h3 className="font-semibold">Cash</h3>
            </div>
            <p className="text-2xl font-bold">{formatCurrency(user?.accounts.Cash || 0)}</p>
          </div>
          
          <div className="bg-green-50 rounded-lg p-4">
            <div className="flex items-center mb-2">
              <Smartphone className="text-green-500 mr-2" size={20} />
              <h3 className="font-semibold">GCash</h3>
            </div>
            <p className="text-2xl font-bold">{formatCurrency(user?.accounts.Gcash || 0)}</p>
          </div>
          
          <div className="bg-purple-50 rounded-lg p-4">
            <div className="flex items-center mb-2">
              <CreditCard className="text-purple-500 mr-2" size={20} />
              <h3 className="font-semibold">Debit Card</h3>
            </div>
            <p className="text-2xl font-bold">{formatCurrency(user?.accounts.Debit_Card || 0)}</p>
          </div>
          
          <div className="bg-red-50 rounded-lg p-4">
            <div className="flex items-center mb-2">
              <CreditCard className="text-red-500 mr-2" size={20} />
              <h3 className="font-semibold">Credit Card</h3>
            </div>
            <p className="text-2xl font-bold">{formatCurrency(user?.accounts.Credit_Card || 0)}</p>
          </div>
        </div>
      </div>
      
      {/* Recent Transactions */}
      <div className="card">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Recent Transactions</h2>
          <Link to="/money-manager" className="text-blue-500 hover:underline text-sm">View All</Link>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50">
                <th className="py-2 px-4 text-left">Date</th>
                <th className="py-2 px-4 text-left">Category</th>
                <th className="py-2 px-4 text-left">Description</th>
                <th className="py-2 px-4 text-right">Amount</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((transaction) => (
                <tr key={transaction.id} className="border-b border-gray-100">
                  <td className="py-3 px-4">{transaction.date}</td>
                  <td className="py-3 px-4">{transaction.category}</td>
                  <td className="py-3 px-4">{transaction.description}</td>
                  <td className={`py-3 px-4 text-right font-medium ${transaction.amount < 0 ? 'text-red-500' : 'text-green-500'}`}>
                    {formatCurrency(transaction.amount)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;