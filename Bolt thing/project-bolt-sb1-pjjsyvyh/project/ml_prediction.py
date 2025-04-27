#!/usr/bin/env python3
# ml_prediction.py - Machine learning model for financial predictions

import sys
import json
import pandas as pd
import numpy as np
from sklearn.linear_model import LinearRegression
from datetime import datetime, timedelta
import random

def load_data(file_path):
    """Load transaction data from CSV file"""
    try:
        df = pd.read_csv(file_path)
        df['date'] = pd.to_datetime(df['date'])
        return df
    except Exception as e:
        print(json.dumps({"error": f"Failed to load data: {str(e)}"}))
        sys.exit(1)

def predict_spending(df):
    """Generate spending predictions based on historical data"""
    try:
        # Group by date and calculate daily spending
        daily_spending = df.groupby(df['date'].dt.date)['amount'].sum().reset_index()
        
        # If we have less than 7 days of data, return a default prediction
        if len(daily_spending) < 7:
            return {
                "next_week_prediction": 1000,
                "confidence": "low",
                "message": "Not enough historical data for accurate prediction"
            }
        
        # Prepare data for regression model
        X = np.array(range(len(daily_spending))).reshape(-1, 1)
        y = daily_spending['amount'].values
        
        # Train linear regression model
        model = LinearRegression()
        model.fit(X, y)
        
        # Predict next 7 days
        next_week_indices = np.array(range(len(daily_spending), len(daily_spending) + 7)).reshape(-1, 1)
        next_week_predictions = model.predict(next_week_indices)
        
        # Calculate total predicted spending for next week
        total_prediction = sum(max(0, pred) for pred in next_week_predictions)
        
        # Calculate confidence score based on model's R² score
        confidence_score = model.score(X, y)
        confidence_level = "high" if confidence_score > 0.7 else "medium" if confidence_score > 0.4 else "low"
        
        return {
            "next_week_prediction": round(total_prediction, 2),
            "daily_predictions": [round(float(max(0, pred)), 2) for pred in next_week_predictions],
            "confidence": confidence_level,
            "confidence_score": round(confidence_score, 2),
            "message": "Prediction based on historical spending patterns"
        }
    except Exception as e:
        return {
            "error": f"Prediction failed: {str(e)}",
            "next_week_prediction": 0,
            "confidence": "none"
        }

def generate_tips(df):
    """Generate personalized financial tips based on spending patterns"""
    try:
        # If the dataframe is empty, return general tips
        if df.empty:
            return {
                "tips": [
                    "Start tracking your expenses to gain financial insights.",
                    "Create an emergency fund with 3-6 months of expenses.",
                    "Aim to save at least 20% of your income."
                ],
                "type": "general"
            }
        
        # Analyze spending patterns
        total_spent = df[df['amount'] < 0]['amount'].sum() * -1
        total_income = df[df['amount'] > 0]['amount'].sum()
        
        tips = []
        
        # Check income vs spending
        if total_spent > total_income * 0.9:
            tips.append("Your spending is close to or exceeding your income. Consider reducing expenses in non-essential categories.")
        
        # Check for days with unusually high spending
        daily_spending = df[df['amount'] < 0].groupby(df['date'].dt.date)['amount'].sum() * -1
        if not daily_spending.empty:
            avg_spending = daily_spending.mean()
            high_spending_days = daily_spending[daily_spending > avg_spending * 1.5]
            if not high_spending_days.empty:
                tips.append(f"You had {len(high_spending_days)} days with unusually high spending. Review these days to identify potential savings opportunities.")
        
        # Savings advice based on spending percentage
        if total_income > 0:
            savings_rate = 1 - (total_spent / total_income)
            if savings_rate < 0.1:
                tips.append("Your savings rate is less than 10%. Try to increase this to at least 20% by reducing discretionary spending.")
            elif savings_rate < 0.2:
                tips.append("Your savings rate is between 10-20%. You're on the right track, but could aim for 20-30% for better financial security.")
            else:
                tips.append("Great job! You're saving more than 20% of your income, which is a healthy savings rate.")
        
        # Add some general financial wisdom if we don't have enough specific tips
        if len(tips) < 3:
            general_tips = [
                "Consider automating your savings by setting up automatic transfers to your savings account.",
                "Review your subscriptions and cancel those you don't regularly use.",
                "Look for ways to increase your income through side gigs or career advancement.",
                "Invest in low-cost index funds for long-term wealth building.",
                "Use the 50/30/20 rule: 50% for needs, 30% for wants, and 20% for savings and debt repayment."
            ]
            while len(tips) < 3 and general_tips:
                tip = random.choice(general_tips)
                tips.append(tip)
                general_tips.remove(tip)
        
        return {
            "tips": tips,
            "type": "personalized",
            "analysis": {
                "total_spent": round(total_spent, 2),
                "total_income": round(total_income, 2),
                "savings_rate": round(1 - (total_spent / total_income), 2) if total_income > 0 else 0
            }
        }
    except Exception as e:
        return {
            "error": f"Tip generation failed: {str(e)}",
            "tips": [
                "Track your expenses regularly to gain financial insights.",
                "Create a budget to help control spending.",
                "Save at least 20% of your income for future needs."
            ],
            "type": "general"
        }

def main():
    """Main function to process command line arguments and run predictions"""
    if len(sys.argv) < 2:
        print(json.dumps({"error": "Please provide a data file path"}))
        sys.exit(1)
    
    file_path = sys.argv[1]
    mode = sys.argv[2] if len(sys.argv) > 2 else "predict"
    
    # Load data
    df = load_data(file_path)
    
    # Generate prediction or tips based on mode
    if mode == "tips":
        result = generate_tips(df)
    else:
        result = predict_spending(df)
    
    # Output result as JSON
    print(json.dumps(result))

if __name__ == "__main__":
    main()