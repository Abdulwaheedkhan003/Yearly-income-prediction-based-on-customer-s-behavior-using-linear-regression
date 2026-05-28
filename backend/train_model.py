"""
Train the Linear Regression model for SpendSense AI
This script uses the exact logic from your Jupyter notebook
"""

import pandas as pd
import pickle
import os
from sklearn.model_selection import train_test_split
from sklearn.linear_model import LinearRegression
from sklearn.metrics import mean_absolute_error, mean_squared_error
import math

# Load data
df = pd.read_csv(r"C:\Users\U.SIDDIQ ALIKHAN\Desktop\Linear regression\Ecommerce Customers.csv")

# Features and target (same as your notebook)
X = df[['Avg. Session Length', 'Time on App', 'Time on Website', 'Length of Membership']]
y = df['Yearly Amount Spent']

# Train-test split (same as your notebook)
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.3, random_state=42)

# Train the model (same as your notebook)
lm = LinearRegression()
lm.fit(X_train, y_train)

# Predictions
predictions = lm.predict(X_test)

# Metrics
mae = mean_absolute_error(y_test, predictions)
mse = mean_squared_error(y_test, predictions)
rmse = math.sqrt(mse)

print("=" * 50)
print("MODEL TRAINING COMPLETE ✅")
print("=" * 50)
print(f"Mean Absolute Error: ${mae:.2f}")
print(f"Mean Squared Error: {mse:.2f}")
print(f"Root Mean Squared Error: ${rmse:.2f}")
print("=" * 50)

# Save model (same as your notebook)
script_dir = os.path.dirname(os.path.abspath(__file__))
models_dir = os.path.join(script_dir, 'models')
os.makedirs(models_dir, exist_ok=True)
pickle.dump(lm, open(os.path.join(models_dir, 'model.pkl'), 'wb'))
print("Model saved to: models/model.pkl ✅")

# Save feature names for API
with open(os.path.join(models_dir, 'features.pkl'), 'wb') as f:
    pickle.dump(X.columns.tolist(), f)
print("Features saved ✅")
