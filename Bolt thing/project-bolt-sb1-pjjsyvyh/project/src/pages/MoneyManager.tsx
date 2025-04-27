import { useState, useEffect } from 'react';
import { useUser } from '../context/UserContext';
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Trash2, PlusCircle } from 'lucide-react';

// Register Chart.js components
ChartJS.register(ArcElement, Tooltip, Legend);

interface Transaction {
  id: number;
  date: string;
  type: string;
  category: string;
  amount: number;
  description: string;
  account: string;
}

const CATEGORIES = [
  "Food", "Transportation", "Housing", "Entertainment", 
  "Shopping", "Health", "Education", "Utilities", "Other"
];

const ACCOUNTS = ["Cash", "Gcash", "Debit_Card", "Credit_Card"];

const MoneyManager = () => {
  const { user, setUser } = useUser();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [transactionType, setTransactionType] = useState('expense');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('Food');
  const [description, setDescription] = useState('');
  const [account, setAccount] = useState('Cash');
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredTransactions, setFilteredTransactions] = useState<Transaction[]>([]);
  
  // Load transactions from local storage
  useEffect(() => {
    const storedTransactions = localStorage.getItem('transactions');
    if (storedTransactions) {
      setTransactions(JSON.parse(storedTransactions));
    } else {
      // Sample data if none exists
      const sampleTransactions = [
        {
          id: 1,
          date: new Date().toISOString().split('T')[0],
          type: 'expense',
          category: 'Food',
          amount: -150,
          description: 'Grocery shopping',
          account: 'Cash'
        },
        {
          id: 2,
          date: new Date().toISOString().split('T')[0],
          type: 'income',
          category: 'Salary',
          amount: 1500,
          description: 'Monthly salary',
          account: 'Debit_Card'
        }
      ];
      setTransactions(sampleTransactions);
      localStorage.setItem('transactions', JSON.stringify(sampleTransactions));
    }
  }, []);
  
  // Filter transactions based on search query
  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredTransactions(transactions);
    } else {
      const query = searchQuery.toLowerCase();
      const filtered = transactions.filter(transaction => 
        transaction.category.toLowerCase().includes(query) ||
        transaction.description.toLowerCase().includes(query) ||
        transaction.account.toLowerCase().includes(query)
      );
      setFilteredTransactions(filtered);
    }
  }, [searchQuery, transactions]);
  
  // Format as Philippine Peso
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-PH', {
      style: 'currency',
      currency: 'PHP',
      minimumFractionDigits: 2
    }).format(amount);
  };
  
  const calculateBalance = () => {
    return transactions.reduce((sum, transaction) => sum + transaction.amount, 0);
  };
  
  const handleAddTransaction = (e: React.FormEvent) => {
    e.preventDefault();
    
    const amountValue = parseFloat(amount);
    if (isNaN(amountValue) || amountValue <= 0) {
      alert('Please enter a valid positive amount');
      return;
    }
    
    const newTransaction = {
      id: Date.now(),
      date: new Date().toISOString().split('T')[0],
      type: transactionType,
      category,
      amount: transactionType === 'expense' ? -amountValue : amountValue,
      description,
      account
    };
    
    // Update user account balance
    if (user && setUser) {
      const updatedUser = { ...user };
      const accountKey = account as keyof typeof user.accounts;
      updatedUser.accounts[accountKey] += newTransaction.amount;
      setUser(updatedUser);
    }
    
    const updatedTransactions = [...transactions, newTransaction];
    setTransactions(updatedTransactions);
    localStorage.setItem('transactions', JSON.stringify(updatedTransactions));
    
    // Reset form
    setAmount('');
    setDescription('');
  };
  
  const handleDeleteTransaction = (id: number) => {
    const transactionToDelete = transactions.find(t => t.id === id);
    if (!transactionToDelete) return;
    
    // Reverse the transaction effect on account balance
    if (user && setUser && transactionToDelete) {
      const updatedUser = { ...user };
      const accountKey = transactionToDelete.account as keyof typeof user.accounts;
      updatedUser.accounts[accountKey] -= transactionToDelete.amount;
      setUser(updatedUser);
    }
    
    const updatedTransactions = transactions.filter(transaction => transaction.id !== id);
    setTransactions(updatedTransactions);
    localStorage.setItem('transactions', JSON.stringify(updatedTransactions));
  };
  
  // Prepare chart data
  const prepareChartData = () => {
    const expensesByCategory: Record<string, number> = {};
    
    transactions
      .filter(t => t.amount < 0)
      .forEach(transaction => {
        if (expensesByCategory[transaction.category]) {
          expensesByCategory[transaction.category] += Math.abs(transaction.amount);
        } else {
          expensesByCategory[transaction.category] = Math.abs(transaction.amount);
        }
      });
    
    return {
      labels: Object.keys(expensesByCategory),
      datasets: [
        {
          data: Object.values(expensesByCategory),
          backgroundColor: [
            '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', 
            '#9966FF', '#FF9F40', '#8AC24A', '#F7464A',
            '#2ecc71', '#3498db', '#9b59b6', '#f39c12'
          ],
          borderWidth: 1
        }
      ]
    };
  };

  return (
    <div className="fade-in">
      <h1 className="text-3xl font-bold mb-6">Money Manager</h1>
      
      {/* Balance Card */}
      <div className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-lg p-6 shadow-lg mb-6">
        <h2 className="text-xl font-semibold mb-2">Current Balance</h2>
        <div className="text-4xl font-bold">{formatCurrency(calculateBalance())}</div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* Add Transaction Form */}
        <div className="lg:col-span-1">
          <div className="card">
            <div className="flex items-center mb-4">
              <PlusCircle className="mr-2 text-blue-500" size={24} />
              <h2 className="text-xl font-bold">Add Transaction</h2>
            </div>
            
            <form onSubmit={handleAddTransaction}>
              <div className="mb-4">
                <label className="form-label">Transaction Type</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    className={`py-2 rounded-md font-medium transition-colors ${
                      transactionType === 'expense' 
                        ? 'bg-red-500 text-white' 
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
                    onClick={() => setTransactionType('expense')}
                  >
                    Expense
                  </button>
                  <button
                    type="button"
                    className={`py-2 rounded-md font-medium transition-colors ${
                      transactionType === 'income' 
                        ? 'bg-green-500 text-white' 
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
                    onClick={() => setTransactionType('income')}
                  >
                    Income
                  </button>
                </div>
              </div>
              
              <div className="mb-4">
                <label htmlFor="amount" className="form-label">Amount (₱)</label>
                <input
                  type="number"
                  id="amount"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="Enter amount"
                  className="form-input"
                  min="0.01"
                  step="0.01"
                  required
                />
              </div>
              
              <div className="mb-4">
                <label htmlFor="category" className="form-label">Category</label>
                <select
                  id="category"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="form-input"
                  required
                >
                  {CATEGORIES.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>
              
              <div className="mb-4">
                <label htmlFor="account" className="form-label">Account</label>
                <select
                  id="account"
                  value={account}
                  onChange={(e) => setAccount(e.target.value)}
                  className="form-input"
                  required
                >
                  {ACCOUNTS.map(acc => (
                    <option key={acc} value={acc}>{acc.replace('_', ' ')}</option>
                  ))}
                </select>
              </div>
              
              <div className="mb-6">
                <label htmlFor="description" className="form-label">Description (Optional)</label>
                <input
                  type="text"
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Enter description"
                  className="form-input"
                />
              </div>
              
              <button type="submit" className="w-full btn btn-primary">
                Add Transaction
              </button>
            </form>
          </div>
        </div>
        
        {/* Chart */}
        <div className="lg:col-span-2">
          <div className="card h-full">
            <h2 className="text-xl font-bold mb-4">Expense Distribution</h2>
            <div className="h-80">
              <Doughnut 
                data={prepareChartData()} 
                options={{
                  plugins: {
                    legend: {
                      position: 'right',
                    },
                    tooltip: {
                      callbacks: {
                        label: function(context) {
                          const label = context.label || '';
                          const value = context.parsed || 0;
                          const total = context.dataset.data.reduce((a: number, b: number) => a + b, 0);
                          const percentage = Math.round((value / total) * 100);
                          return `${label}: ${formatCurrency(value)} (${percentage}%)`;
                        }
                      }
                    }
                  },
                  maintainAspectRatio: false,
                }} 
              />
            </div>
          </div>
        </div>
      </div>
      
      {/* Transactions List */}
      <div className="card">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
          <h2 className="text-xl font-bold mb-2 md:mb-0">Transaction History</h2>
          <input
            type="text"
            placeholder="Search transactions..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="form-input md:w-64"
          />
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50">
                <th className="py-3 px-4 text-left">Date</th>
                <th className="py-3 px-4 text-left">Account</th>
                <th className="py-3 px-4 text-left">Category</th>
                <th className="py-3 px-4 text-left">Description</th>
                <th className="py-3 px-4 text-right">Amount</th>
                <th className="py-3 px-4 text-center">Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredTransactions.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-4 px-4 text-center text-gray-500">
                    No transactions found
                  </td>
                </tr>
              ) : (
                filteredTransactions.map(transaction => (
                  <tr key={transaction.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-3 px-4">{transaction.date}</td>
                    <td className="py-3 px-4">{transaction.account.replace('_', ' ')}</td>
                    <td className="py-3 px-4">{transaction.category}</td>
                    <td className="py-3 px-4">{transaction.description || '-'}</td>
                    <td className={`py-3 px-4 text-right font-medium ${
                      transaction.amount < 0 ? 'text-red-500' : 'text-green-500'
                    }`}>
                      {formatCurrency(Math.abs(transaction.amount))}
                    </td>
                    <td className="py-3 px-4 text-center">
                      <button
                        onClick={() => handleDeleteTransaction(transaction.id)}
                        className="text-red-500 hover:text-red-700 transition-colors"
                        title="Delete transaction"
                      >
                        <Trash2 size={18} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default MoneyManager;