# CashCat - Money Management Application

CashCat is a comprehensive money management application that combines a React frontend, Express.js API, MySQL database, and Python machine learning backend to provide users with a powerful financial management tool.

## Features

- **User Authentication**: Secure login system to protect financial data
- **Dashboard**: Overview of financial health with charts and key metrics
- **Money Manager**: Track income and expenses across multiple accounts
- **Savings Goals**: Set and track progress towards savings targets
- **Machine Learning Insights**: Get personalized financial tips and spending predictions
- **Responsive Design**: Works on desktop, tablet, and mobile devices

## Technology Stack

- **Frontend**: React with TypeScript, Tailwind CSS, Chart.js
- **Backend API**: Express.js
- **Database**: MySQL
- **Machine Learning**: Python with scikit-learn

## Getting Started

### Prerequisites

- Node.js (v16+)
- MySQL Server
- Python 3.7+ with scikit-learn, pandas, and numpy packages

### Installation

1. Clone the repository
   ```
   git clone https://github.com/yourusername/cashcat.git
   cd cashcat
   ```

2. Install dependencies
   ```
   npm install
   ```

3. Set up the database
   ```
   mysql -u root -p < database/cashcat_database.sql
   ```

4. Configure environment variables
   ```
   cp .env.example .env
   ```
   Edit the `.env` file with your database credentials and other settings.

5. Start the development server
   ```
   npm run dev
   ```

6. In a separate terminal, start the Express API server
   ```
   npm run server
   ```

## Project Structure

```
cashcat/
├── public/              # Static files
├── src/                 # React frontend
│   ├── components/      # Reusable UI components
│   ├── context/         # React context providers
│   ├── pages/           # Application pages
│   ├── App.tsx          # Main application component
│   └── main.tsx         # Application entry point
├── server.js            # Express API server
├── ml_prediction.py     # Python ML model
└── database/            # Database scripts
```

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Icons provided by [Lucide React](https://lucide.dev/)
- Charts powered by [Chart.js](https://www.chartjs.org/)
