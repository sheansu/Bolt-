// server.js - Express server to connect React frontend with MySQL database and Python ML backend
import express from 'express';
import cors from 'cors';
import mysql from 'mysql2/promise';
import { PythonShell } from 'python-shell';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// Initialize environment variables
dotenv.config();

// Set up paths for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Create Express app
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'dist')));

// Database connection pool
const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'cashcat_database',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Route to check if server is running
app.get('/api/status', (req, res) => {
  res.json({ status: 'Server is running' });
});

// Get user data
app.get('/api/users/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const [rows] = await pool.query('SELECT * FROM users WHERE user_id = ?', [userId]);
    
    if (rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    const user = rows[0];
    res.json({
      id: user.user_id,
      firstName: user.first_name,
      lastName: user.last_name,
      birthdate: user.birthdate,
      accounts: {
        Cash: parseFloat(user.Cash) || 0,
        Gcash: parseFloat(user.Gcash) || 0,
        Debit_Card: parseFloat(user.Debit_Card) || 0,
        Credit_Card: parseFloat(user.Credit_Card) || 0
      }
    });
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({ error: 'Failed to fetch user data' });
  }
});

// Get transactions
app.get('/api/transactions', async (req, res) => {
  try {
    const { userId } = req.query;
    const query = `
      SELECT 
        tr.transaction_id, 
        tr.transaction_datetime,
        tr.currency_amount,
        at.name as account_type,
        tr.user_id
      FROM transaction_records tr
      JOIN account_type at ON tr.account_type = at.payment_method_id
      WHERE tr.user_id = ?
      ORDER BY tr.transaction_datetime DESC
    `;
    
    const [rows] = await pool.query(query, [userId]);
    res.json(rows);
  } catch (error) {
    console.error('Error fetching transactions:', error);
    res.status(500).json({ error: 'Failed to fetch transactions' });
  }
});

// Add a new transaction
app.post('/api/transactions', async (req, res) => {
  try {
    const { userId, amount, accountType, description } = req.body;
    
    // Insert transaction record
    const query = `
      INSERT INTO transaction_records 
      (transaction_datetime, user_id, currency_amount, account_type) 
      VALUES (NOW(), ?, ?, ?)
    `;
    
    const [result] = await pool.query(query, [userId, amount, accountType]);
    
    // Update user's account balance
    const accountColumn = getAccountColumnName(accountType);
    if (accountColumn) {
      await pool.query(
        `UPDATE users SET ${accountColumn} = ${accountColumn} + ? WHERE user_id = ?`,
        [amount, userId]
      );
    }
    
    res.status(201).json({ 
      id: result.insertId,
      message: 'Transaction added successfully' 
    });
  } catch (error) {
    console.error('Error adding transaction:', error);
    res.status(500).json({ error: 'Failed to add transaction' });
  }
});

// Helper function to map account type to column name
function getAccountColumnName(accountTypeId) {
  const mapping = {
    1: 'Cash',
    2: 'Gcash',
    3: 'Debit_Card',
    4: 'Credit_Card'
  };
  return mapping[accountTypeId];
}

// ML prediction endpoint
app.get('/api/predictions/spending', async (req, res) => {
  try {
    const { userId } = req.query;
    
    // Get transaction data for the user
    const [rows] = await pool.query(
      'SELECT transaction_datetime, currency_amount FROM transaction_records WHERE user_id = ?',
      [userId]
    );
    
    // Write transaction data to a temporary CSV file for the Python script
    const tempDataPath = path.join(__dirname, 'temp_data.csv');
    const fs = await import('fs');
    const csvData = 'date,amount\n' + rows.map(row => 
      `${new Date(row.transaction_datetime).toISOString().split('T')[0]},${row.currency_amount}`
    ).join('\n');
    
    fs.writeFileSync(tempDataPath, csvData);
    
    // Run Python prediction script
    const options = {
      mode: 'text',
      args: [tempDataPath]
    };
    
    PythonShell.run('ml_prediction.py', options).then(results => {
      // Parse prediction results
      const prediction = JSON.parse(results[0]);
      res.json(prediction);
      
      // Clean up temporary file
      fs.unlinkSync(tempDataPath);
    }).catch(err => {
      console.error('Python script error:', err);
      res.status(500).json({ error: 'Failed to generate prediction' });
    });
  } catch (error) {
    console.error('Error generating prediction:', error);
    res.status(500).json({ error: 'Failed to generate prediction' });
  }
});

// Financial tips endpoint
app.get('/api/insights/tips', async (req, res) => {
  try {
    const { userId } = req.query;
    
    // Get transaction data for the user
    const [rows] = await pool.query(
      'SELECT transaction_datetime, currency_amount FROM transaction_records WHERE user_id = ?',
      [userId]
    );
    
    // Write transaction data to a temporary file for the Python script
    const tempDataPath = path.join(__dirname, 'temp_tips_data.csv');
    const fs = await import('fs');
    const csvData = 'date,amount\n' + rows.map(row => 
      `${new Date(row.transaction_datetime).toISOString().split('T')[0]},${row.currency_amount}`
    ).join('\n');
    
    fs.writeFileSync(tempDataPath, csvData);
    
    // Run Python script for tips
    const options = {
      mode: 'text',
      args: [tempDataPath, 'tips']
    };
    
    PythonShell.run('ml_prediction.py', options).then(results => {
      // Parse tips results
      const tips = JSON.parse(results[0]);
      res.json(tips);
      
      // Clean up temporary file
      fs.unlinkSync(tempDataPath);
    }).catch(err => {
      console.error('Python script error:', err);
      res.status(500).json({ error: 'Failed to generate tips' });
    });
  } catch (error) {
    console.error('Error generating tips:', error);
    res.status(500).json({ error: 'Failed to generate tips' });
  }
});

// Catch-all route to serve the React app
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});