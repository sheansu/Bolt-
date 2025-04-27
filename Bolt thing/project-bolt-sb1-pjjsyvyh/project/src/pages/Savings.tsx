import { useState, useEffect } from 'react';
import { useUser } from '../context/UserContext';
import { PiggyBank, TrendingUp, AlertCircle, Plus } from 'lucide-react';

interface SavingsGoal {
  id: number;
  name: string;
  current: number;
  target: number;
  deadline?: string;
}

interface SavingsContribution {
  id: number;
  date: string;
  goalId: number;
  amount: number;
}

const Savings = () => {
  const { user } = useUser();
  const [goals, setGoals] = useState<SavingsGoal[]>([]);
  const [contributions, setContributions] = useState<SavingsContribution[]>([]);
  const [newGoalName, setNewGoalName] = useState('');
  const [newGoalTarget, setNewGoalTarget] = useState('');
  const [newGoalDeadline, setNewGoalDeadline] = useState('');
  const [selectedGoal, setSelectedGoal] = useState<number | null>(null);
  const [contributionAmount, setContributionAmount] = useState('');
  const [showNewGoalForm, setShowNewGoalForm] = useState(false);
  const [financialTip, setFinancialTip] = useState('');
  
  // Load data from local storage
  useEffect(() => {
    const storedGoals = localStorage.getItem('savingsGoals');
    const storedContributions = localStorage.getItem('savingsContributions');
    
    if (storedGoals) {
      setGoals(JSON.parse(storedGoals));
    } else {
      // Sample data
      const sampleGoals: SavingsGoal[] = [
        { id: 1, name: 'Emergency Fund', current: 500, target: 2000, deadline: '2025-12-31' },
        { id: 2, name: 'Vacation', current: 150, target: 1500, deadline: '2025-08-15' },
      ];
      setGoals(sampleGoals);
      localStorage.setItem('savingsGoals', JSON.stringify(sampleGoals));
    }
    
    if (storedContributions) {
      setContributions(JSON.parse(storedContributions));
    } else {
      // Sample data
      const sampleContributions: SavingsContribution[] = [
        { id: 1, date: '2025-03-15', goalId: 1, amount: 200 },
        { id: 2, date: '2025-03-25', goalId: 1, amount: 300 },
        { id: 3, date: '2025-03-28', goalId: 2, amount: 150 },
      ];
      setContributions(sampleContributions);
      localStorage.setItem('savingsContributions', JSON.stringify(sampleContributions));
    }
    
    // Set a random financial tip
    const tips = [
      "Aim to save at least 20% of your monthly income.",
      "Set up automatic transfers to your savings goals to maintain consistency.",
      "Consider the 50/30/20 rule: 50% for needs, 30% for wants, and 20% for savings.",
      "Having an emergency fund of 3-6 months of expenses is recommended."
    ];
    setFinancialTip(tips[Math.floor(Math.random() * tips.length)]);
    
  }, []);
  
  // Format as Philippine Peso
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-PH', {
      style: 'currency',
      currency: 'PHP',
      minimumFractionDigits: 2
    }).format(amount);
  };
  
  const handleAddGoal = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newGoalName.trim()) {
      alert('Please enter a goal name');
      return;
    }
    
    const targetAmount = parseFloat(newGoalTarget);
    if (isNaN(targetAmount) || targetAmount <= 0) {
      alert('Please enter a valid target amount');
      return;
    }
    
    const newGoal: SavingsGoal = {
      id: Date.now(),
      name: newGoalName.trim(),
      current: 0,
      target: targetAmount,
      deadline: newGoalDeadline || undefined
    };
    
    const updatedGoals = [...goals, newGoal];
    setGoals(updatedGoals);
    localStorage.setItem('savingsGoals', JSON.stringify(updatedGoals));
    
    // Reset form
    setNewGoalName('');
    setNewGoalTarget('');
    setNewGoalDeadline('');
    setShowNewGoalForm(false);
  };
  
  const handleAddContribution = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedGoal) {
      alert('Please select a goal');
      return;
    }
    
    const amount = parseFloat(contributionAmount);
    if (isNaN(amount) || amount <= 0) {
      alert('Please enter a valid amount');
      return;
    }
    
    // Add contribution
    const newContribution: SavingsContribution = {
      id: Date.now(),
      date: new Date().toISOString().split('T')[0],
      goalId: selectedGoal,
      amount
    };
    
    const updatedContributions = [...contributions, newContribution];
    setContributions(updatedContributions);
    localStorage.setItem('savingsContributions', JSON.stringify(updatedContributions));
    
    // Update goal progress
    const updatedGoals = goals.map(goal => {
      if (goal.id === selectedGoal) {
        return {
          ...goal,
          current: goal.current + amount
        };
      }
      return goal;
    });
    
    setGoals(updatedGoals);
    localStorage.setItem('savingsGoals', JSON.stringify(updatedGoals));
    
    // Reset form
    setContributionAmount('');
  };
  
  const getGoalById = (id: number) => {
    return goals.find(goal => goal.id === id);
  };
  
  const calculateGoalPercentage = (goal: SavingsGoal) => {
    return Math.min(100, Math.round((goal.current / goal.target) * 100));
  };
  
  const getGoalStatus = (goal: SavingsGoal) => {
    const percentage = calculateGoalPercentage(goal);
    if (percentage < 25) return 'bg-red-500';
    if (percentage < 50) return 'bg-yellow-500';
    if (percentage < 75) return 'bg-blue-500';
    return 'bg-green-500';
  };
  
  const calculateTotalSaved = () => {
    return goals.reduce((total, goal) => total + goal.current, 0);
  };
  
  const calculateTotalTarget = () => {
    return goals.reduce((total, goal) => total + goal.target, 0);
  };

  return (
    <div className="fade-in">
      <h1 className="text-3xl font-bold mb-6">Savings Goals</h1>
      
      {/* Savings Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="card bg-blue-50 border-l-4 border-blue-500">
          <div className="flex justify-between">
            <div>
              <p className="text-blue-500 font-medium">Total Saved</p>
              <p className="text-2xl font-bold">{formatCurrency(calculateTotalSaved())}</p>
            </div>
            <PiggyBank className="text-blue-500" size={32} />
          </div>
        </div>
        
        <div className="card bg-green-50 border-l-4 border-green-500">
          <div className="flex justify-between">
            <div>
              <p className="text-green-500 font-medium">Overall Progress</p>
              <p className="text-2xl font-bold">
                {Math.round((calculateTotalSaved() / calculateTotalTarget()) * 100)}%
              </p>
            </div>
            <TrendingUp className="text-green-500" size={32} />
          </div>
        </div>
        
        <div className="card bg-yellow-50 border-l-4 border-yellow-500">
          <div className="flex justify-between">
            <div>
              <p className="text-yellow-500 font-medium">Active Goals</p>
              <p className="text-2xl font-bold">{goals.length}</p>
            </div>
            <AlertCircle className="text-yellow-500" size={32} />
          </div>
        </div>
      </div>
      
      {/* Financial Tip */}
      {financialTip && (
        <div className="card bg-blue-50 border border-blue-100 mb-6 slide-in">
          <div className="flex items-start">
            <div className="bg-blue-500 p-2 rounded-md mr-4">
              <AlertCircle className="text-white" size={24} />
            </div>
            <div>
              <h3 className="font-semibold text-lg text-gray-800 mb-1">Savings Tip</h3>
              <p className="text-gray-600">{financialTip}</p>
            </div>
          </div>
        </div>
      )}
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Active Goals */}
        <div className="lg:col-span-2">
          <div className="card">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold">Your Savings Goals</h2>
              <button
                onClick={() => setShowNewGoalForm(true)}
                className="btn btn-primary flex items-center"
              >
                <Plus size={18} className="mr-1" /> New Goal
              </button>
            </div>
            
            {goals.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                No savings goals yet. Create your first goal!
              </div>
            ) : (
              <div className="space-y-4">
                {goals.map(goal => (
                  <div key={goal.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-semibold text-lg">{goal.name}</h3>
                      <div className="text-sm text-gray-500">
                        {goal.deadline && `Target date: ${goal.deadline}`}
                      </div>
                    </div>
                    
                    <div className="flex justify-between text-sm text-gray-600 mb-2">
                      <span>Progress: {calculateGoalPercentage(goal)}%</span>
                      <span>
                        {formatCurrency(goal.current)} / {formatCurrency(goal.target)}
                      </span>
                    </div>
                    
                    <div className="w-full bg-gray-200 rounded-full h-2.5 mb-4">
                      <div 
                        className={`${getGoalStatus(goal)} h-2.5 rounded-full transition-all duration-500 ease-out`}
                        style={{ width: `${calculateGoalPercentage(goal)}%` }}
                      ></div>
                    </div>
                    
                    <div className="flex justify-end">
                      <button
                        onClick={() => setSelectedGoal(goal.id)}
                        className="text-sm text-blue-500 hover:text-blue-700 font-medium"
                      >
                        Add Contribution
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
          
          {/* Recent Contributions */}
          <div className="card mt-6">
            <h2 className="text-xl font-bold mb-4">Recent Contributions</h2>
            
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="py-2 px-4 text-left">Date</th>
                    <th className="py-2 px-4 text-left">Goal</th>
                    <th className="py-2 px-4 text-right">Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {contributions.length === 0 ? (
                    <tr>
                      <td colSpan={3} className="py-4 text-center text-gray-500">
                        No contributions yet
                      </td>
                    </tr>
                  ) : (
                    contributions
                      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                      .slice(0, 5)
                      .map(contribution => {
                        const goal = getGoalById(contribution.goalId);
                        return (
                          <tr key={contribution.id} className="border-b border-gray-100">
                            <td className="py-3 px-4">{contribution.date}</td>
                            <td className="py-3 px-4">{goal?.name || 'Unknown Goal'}</td>
                            <td className="py-3 px-4 text-right font-medium text-green-500">
                              {formatCurrency(contribution.amount)}
                            </td>
                          </tr>
                        );
                      })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
        
        {/* Form Section */}
        <div className="lg:col-span-1">
          {showNewGoalForm ? (
            <div className="card">
              <h2 className="text-xl font-bold mb-4">Create New Goal</h2>
              <form onSubmit={handleAddGoal}>
                <div className="mb-4">
                  <label htmlFor="goalName" className="form-label">Goal Name</label>
                  <input
                    type="text"
                    id="goalName"
                    value={newGoalName}
                    onChange={(e) => setNewGoalName(e.target.value)}
                    className="form-input"
                    placeholder="e.g., Emergency Fund"
                    required
                  />
                </div>
                
                <div className="mb-4">
                  <label htmlFor="targetAmount" className="form-label">Target Amount (₱)</label>
                  <input
                    type="number"
                    id="targetAmount"
                    value={newGoalTarget}
                    onChange={(e) => setNewGoalTarget(e.target.value)}
                    className="form-input"
                    placeholder="Enter target amount"
                    min="1"
                    step="0.01"
                    required
                  />
                </div>
                
                <div className="mb-6">
                  <label htmlFor="deadline" className="form-label">Target Date (Optional)</label>
                  <input
                    type="date"
                    id="deadline"
                    value={newGoalDeadline}
                    onChange={(e) => setNewGoalDeadline(e.target.value)}
                    className="form-input"
                  />
                </div>
                
                <div className="flex gap-2">
                  <button type="submit" className="flex-1 btn btn-primary">
                    Create Goal
                  </button>
                  <button 
                    type="button" 
                    onClick={() => setShowNewGoalForm(false)}
                    className="flex-1 btn bg-gray-200 text-gray-700 hover:bg-gray-300"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          ) : (
            <div className="card">
              <h2 className="text-xl font-bold mb-4">Add Contribution</h2>
              {goals.length === 0 ? (
                <div className="text-center py-4 text-gray-500">
                  Create a goal first to add contributions
                </div>
              ) : (
                <form onSubmit={handleAddContribution}>
                  <div className="mb-4">
                    <label htmlFor="goalSelect" className="form-label">Select Goal</label>
                    <select
                      id="goalSelect"
                      value={selectedGoal || ''}
                      onChange={(e) => setSelectedGoal(parseInt(e.target.value))}
                      className="form-input"
                      required
                    >
                      <option value="">-- Select a goal --</option>
                      {goals.map(goal => (
                        <option key={goal.id} value={goal.id}>
                          {goal.name} ({formatCurrency(goal.current)}/{formatCurrency(goal.target)})
                        </option>
                      ))}
                    </select>
                  </div>
                  
                  <div className="mb-6">
                    <label htmlFor="contributionAmount" className="form-label">Amount (₱)</label>
                    <input
                      type="number"
                      id="contributionAmount"
                      value={contributionAmount}
                      onChange={(e) => setContributionAmount(e.target.value)}
                      className="form-input"
                      placeholder="Enter amount"
                      min="1"
                      step="0.01"
                      required
                    />
                  </div>
                  
                  <button type="submit" className="w-full btn btn-primary">
                    Add Contribution
                  </button>
                </form>
              )}
            </div>
          )}
          
          {/* ML Insights */}
          <div className="card mt-6 bg-indigo-50">
            <h2 className="text-xl font-bold mb-4">Savings Insights</h2>
            <div className="space-y-4">
              <div className="border-l-4 border-indigo-500 pl-3 py-1">
                <h3 className="font-semibold">Projected Completion</h3>
                <p className="text-sm text-gray-600">
                  Based on your current rate of saving, you'll reach your emergency fund goal in approximately 3 months.
                </p>
              </div>
              
              <div className="border-l-4 border-green-500 pl-3 py-1">
                <h3 className="font-semibold">Saving Potential</h3>
                <p className="text-sm text-gray-600">
                  By reducing weekly food expenses by 10%, you could add ₱800 monthly to your savings.
                </p>
              </div>
              
              <div className="border-l-4 border-purple-500 pl-3 py-1">
                <h3 className="font-semibold">Recommendation</h3>
                <p className="text-sm text-gray-600">
                  Consider setting up automatic weekly transfers to accelerate your progress.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Savings;