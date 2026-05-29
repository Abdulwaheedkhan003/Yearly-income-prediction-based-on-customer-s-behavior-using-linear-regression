"""
SpendSense AI Backend - FastAPI
Predicts customer yearly spending using Linear Regression
Built from your e-commerce ML notebook
"""

from fastapi import FastAPI, HTTPException
from fastapi.staticfiles import StaticFiles
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import pickle
import numpy as np
import os
from pathlib import Path
import sqlite3
import json
from datetime import datetime

# Initialize FastAPI app
app = FastAPI(
    title="SpendSense AI API",
    description="Predict customer spending with ML",
    version="1.0.0"
)

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all origins (change in production)
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount static files for graphs
static_graphs_dir = os.path.join(Path(__file__).parent, "static", "graphs")
if not os.path.exists(static_graphs_dir):
    os.makedirs(static_graphs_dir, exist_ok=True)
app.mount("/graphs", StaticFiles(directory=static_graphs_dir), name="graphs")

# Load model
MODEL_PATH = Path(__file__).parent / "models" / "model.pkl"
FEATURES_PATH = Path(__file__).parent / "models" / "features.pkl"

try:
    with open(MODEL_PATH, 'rb') as f:
        model = pickle.load(f)
    
    with open(FEATURES_PATH, 'rb') as f:
        feature_names = pickle.load(f)
    
    print("✅ Model loaded successfully")
except FileNotFoundError:
    print("❌ Model files not found. Run train_model.py first")
    model = None
    feature_names = None

# Initialize Database
DB_PATH = Path(__file__).parent / "history.db"

def init_db():
    conn = sqlite3.connect(DB_PATH)
    c = conn.cursor()
    c.execute('''
        CREATE TABLE IF NOT EXISTS predictions (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            predicted_spend REAL,
            timestamp TEXT,
            input_values TEXT
        )
    ''')
    conn.commit()
    conn.close()

init_db()


# Request model
class PredictionRequest(BaseModel):
    avg_session_length: float
    time_on_app: float
    time_on_website: float
    length_of_membership: float

    class Config:
        example = {
            "avg_session_length": 34.5,
            "time_on_app": 12.7,
            "time_on_website": 39.6,
            "length_of_membership": 4.0
        }


# Response model
class PredictionResponse(BaseModel):
    predicted_spend: float
    confidence_score: float
    insights: str


@app.get("/")
def root():
    """Welcome endpoint"""
    return {
        "message": "🚀 SpendSense AI Backend",
        "docs": "/docs",
        "status": "online"
    }


@app.get("/health")
def health():
    """Health check endpoint"""
    return {
        "status": "ok",
        "model_loaded": model is not None
    }


@app.post("/predict")
def predict(request: PredictionRequest):
    """
    Predict customer yearly spending
    
    Input features from your ML notebook:
    - avg_session_length
    - time_on_app
    - time_on_website
    - length_of_membership
    """
    
    if model is None:
        raise HTTPException(status_code=500, detail="Model not loaded")
    
    try:
        # Prepare features in correct order
        features = np.array([[
            request.avg_session_length,
            request.time_on_app,
            request.time_on_website,
            request.length_of_membership
        ]])
        
        # Make prediction
        prediction = model.predict(features)[0]
        final_prediction = round(prediction, 2)

        # Dynamically generate personalized graphs for this user interaction
        try:
            from graph_generator import generate_graphs
            input_dict = {
                "avg_session_length": request.avg_session_length,
                "time_on_app": request.time_on_app,
                "time_on_website": request.time_on_website,
                "length_of_membership": request.length_of_membership
            }
            generate_graphs(active_inputs=input_dict, active_prediction=final_prediction)
        except Exception as graph_err:
            print(f"❌ Error generating personalized graphs: {graph_err}")
        
        # Generate insights based on features
        engagement_score = (
            request.avg_session_length +
            request.time_on_app +
            request.time_on_website
        ) / 3
        
        if engagement_score > 35:
            insights = "🔥 High engagement detected → Higher spending likelihood"
            confidence = min(0.95, 0.70 + (engagement_score / 100))
        elif engagement_score > 32:
            insights = "📈 Good engagement → Moderate spending expected"
            confidence = 0.75
        else:
            insights = "⚠️ Low engagement → Review marketing strategy"
            confidence = 0.60
        
        # Membership tenure boost
        if request.length_of_membership > 4:
            insights += " | Strong membership loyalty detected ✅"
            confidence = min(0.99, confidence + 0.1)
            
        final_confidence = round(confidence, 2)

        # Save to database
        try:
            conn = sqlite3.connect(DB_PATH)
            c = conn.cursor()
            input_data = {
                "avg_session_length": request.avg_session_length,
                "time_on_app": request.time_on_app,
                "time_on_website": request.time_on_website,
                "length_of_membership": request.length_of_membership
            }
            c.execute(
                "INSERT INTO predictions (predicted_spend, timestamp, input_values) VALUES (?, ?, ?)",
                (final_prediction, datetime.now().isoformat(), json.dumps(input_data))
            )
            conn.commit()
            conn.close()
        except Exception as db_err:
            print(f"Database error: {db_err}")
        
        return PredictionResponse(
            predicted_spend=final_prediction,
            confidence_score=final_confidence,
            insights=insights
        )
    
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Prediction error: {str(e)}")


@app.get("/features")
def get_features():
    """Get available features for prediction"""
    return {
        "features": feature_names,
        "description": "Features used in your ML model"
    }


@app.get("/history")
def get_history():
    """Get prediction history"""
    try:
        conn = sqlite3.connect(DB_PATH)
        c = conn.cursor()
        c.execute("SELECT id, predicted_spend, timestamp, input_values FROM predictions ORDER BY id DESC LIMIT 50")
        rows = c.fetchall()
        conn.close()
        
        history = []
        for row in rows:
            history.append({
                "id": row[0],
                "predicted_spend": row[1],
                "timestamp": row[2],
                "input_values": json.loads(row[3]) if row[3] else {}
            })
        return {"history": history}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Database error: {str(e)}")

@app.get("/metrics")
def get_metrics():
    """Get model performance metrics"""
    # True values computed with random_state=42, test_size=0.3
    # R2 = 0.9808757641125855, MAE = 8.43, RMSE = 10.19
    return {
        "accuracy": 98.09,
        "mae": 8.43,
        "rmse": 10.19,
        "description": "Model performance metrics based on test dataset (random_state=42, 30% test split)."
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
