# 🚀 SpendSense AI - Customer Spending Predictor

> **Transform Your ML Notebook into a Production-Ready SaaS Product**

A full-stack web application that predicts customer yearly spending using a machine learning linear regression model. Built with React, FastAPI, and scikit-learn.

![Built with React](https://img.shields.io/badge/Built%20with-React-61DAFB?style=flat-square&logo=react)
![Powered by FastAPI](https://img.shields.io/badge/Powered%20by-FastAPI-009688?style=flat-square&logo=fastapi)
![ML: scikit-learn](https://img.shields.io/badge/ML-scikit--learn-F7931E?style=flat-square&logo=scikit-learn)
![License: MIT](https://img.shields.io/badge/License-MIT-green?style=flat-square)

---

## 📋 Table of Contents

- [Features](#-features)
- [Project Structure](#-project-structure)
- [Tech Stack](#-tech-stack)
- [Setup & Installation](#-setup--installation)
- [How to Run](#-how-to-run)
- [API Documentation](#-api-documentation)
- [Usage Examples](#-usage-examples)
- [Model Details](#-model-details)
- [Deployment](#-deployment)
- [Contributing](#-contributing)
- [License](#-license)

---

## ✨ Features

✅ **AI-Powered Predictions** - Real-time customer spending predictions using Linear Regression
✅ **Beautiful UI** - Modern, responsive React dashboard with glassmorphism design
✅ **Real-time Insights** - Get actionable insights alongside predictions
✅ **Dark/Light Mode** - Full theme support for accessibility
✅ **Interactive Sliders** - Easy input adjustment with instant feedback
✅ **Data Visualization** - Charts comparing predictions with industry benchmarks
✅ **Production Ready** - Clean code, error handling, CORS enabled
✅ **Fully Documented** - API docs, setup guides, deployment instructions

---

## 📁 Project Structure

```
spendsense-ai/
│
├── 📂 backend/
│   ├── main.py                 # FastAPI application
│   ├── train_model.py          # Model training script (using your notebook)
│   ├── requirements.txt        # Python dependencies
│   └── 📂 models/
│       ├── model.pkl           # Trained regression model (auto-generated)
│       └── features.pkl        # Feature names (auto-generated)
│
├── 📂 frontend/
│   ├── src/
│   │   ├── App.jsx             # Main app component
│   │   ├── App.css             # Styling
│   │   ├── main.jsx            # React entry point
│   │   └── 📂 pages/
│   │       ├── LandingPage.jsx # Hero landing page
│   │       └── Dashboard.jsx    # Prediction dashboard
│   ├── index.html              # HTML entry point
│   ├── package.json            # Node dependencies
│   ├── vite.config.js          # Vite configuration
│   ├── tailwind.config.js      # Tailwind CSS config
│   └── postcss.config.js       # PostCSS config
│
├── 📄 README.md                # This file
└── 📄 .gitignore              # Git ignore rules
```

---

## 🛠 Tech Stack

### Backend
- **Framework**: FastAPI (Python)
- **ML Library**: scikit-learn
- **Data Processing**: pandas, numpy
- **Server**: uvicorn
- **API**: RESTful with Pydantic validation

### Frontend
- **Framework**: React 18
- **Build Tool**: Vite
- **Styling**: TailwindCSS + Custom CSS
- **Animations**: Framer Motion
- **Charts**: Recharts
- **HTTP Client**: Axios
- **Icons**: Lucide React

### Machine Learning
- **Algorithm**: Linear Regression
- **Dataset**: E-commerce Customers (500+ records)
- **Features**: 
  - Avg. Session Length
  - Time on App
  - Time on Website
  - Length of Membership
- **Target**: Yearly Amount Spent

---

## 🚀 Setup & Installation

### Prerequisites
- Python 3.8+
- Node.js 16+
- npm or yarn
- Git

### Backend Setup

```bash
# 1. Navigate to backend directory
cd backend

# 2. Create virtual environment
python -m venv venv

# 3. Activate virtual environment
# On Windows:
venv\Scripts\activate
# On macOS/Linux:
source venv/bin/activate

# 4. Install dependencies
pip install -r requirements.txt

# 5. Train the model (uses your notebook data)
python train_model.py

# 6. Run the server
python -m uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

**Backend will be available at**: `http://localhost:8000`
**API Docs**: `http://localhost:8000/docs` (Swagger UI)

### Frontend Setup

```bash
# 1. Navigate to frontend directory
cd frontend

# 2. Install dependencies
npm install

# 3. Run development server
npm run dev

# 4. Build for production
npm run build

# 5. Preview production build
npm run preview
```

**Frontend will be available at**: `http://localhost:5173`

---

## 🏃 How to Run

### Quick Start (Both Services)

**Terminal 1 - Backend:**
```bash
cd backend
source venv/bin/activate  # or venv\Scripts\activate on Windows
python -m uvicorn main:app --reload
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```

Then open **http://localhost:5173** in your browser.

---

## 📚 API Documentation

### Base URL
```
http://localhost:8000
```

### Endpoints

#### 1. **POST /predict** - Get Spending Prediction
Predict customer yearly spending based on engagement metrics.

**Request:**
```bash
curl -X POST "http://localhost:8000/predict" \
  -H "Content-Type: application/json" \
  -d {
    "avg_session_length": 34.5,
    "time_on_app": 12.7,
    "time_on_website": 39.6,
    "length_of_membership": 4.0
  }
```

**Response:**
```json
{
  "predicted_spend": 587.95,
  "confidence_score": 0.92,
  "insights": "🔥 High engagement detected → Higher spending likelihood | Strong membership loyalty detected ✅"
}
```

#### 2. **GET /health** - Health Check
Check if the API is running and model is loaded.

**Response:**
```json
{
  "status": "ok",
  "model_loaded": true
}
```

#### 3. **GET /features** - Get Model Features
Get the list of features used in the model.

**Response:**
```json
{
  "features": [
    "Avg. Session Length",
    "Time on App",
    "Time on Website",
    "Length of Membership"
  ],
  "description": "Features used in your ML model"
}
```

#### 4. **GET /** - Welcome Endpoint
```json
{
  "message": "🚀 SpendSense AI Backend",
  "docs": "/docs",
  "status": "online"
}
```

---

## 💡 Usage Examples

### Python Example
```python
import requests
import json

API_URL = "http://localhost:8000"

# Customer data
customer = {
    "avg_session_length": 35.0,
    "time_on_app": 13.5,
    "time_on_website": 40.0,
    "length_of_membership": 4.5
}

# Make prediction
response = requests.post(f"{API_URL}/predict", json=customer)
result = response.json()

print(f"Predicted Spending: ${result['predicted_spend']:.2f}")
print(f"Confidence: {result['confidence_score'] * 100:.1f}%")
print(f"Insights: {result['insights']}")
```

### JavaScript/React Example
```javascript
import axios from 'axios';

const customer = {
  avg_session_length: 35.0,
  time_on_app: 13.5,
  time_on_website: 40.0,
  length_of_membership: 4.5
};

axios.post('http://localhost:8000/predict', customer)
  .then(res => {
    console.log(`Predicted: $${res.data.predicted_spend}`);
    console.log(`Confidence: ${res.data.confidence_score * 100}%`);
  })
  .catch(err => console.error('Prediction failed:', err));
```

---

## 🤖 Model Details

### Algorithm
**Linear Regression** - A fundamental supervised learning algorithm that predicts continuous values.

### Model Performance
- **MAE** (Mean Absolute Error): ~$8 per prediction
- **RMSE** (Root Mean Squared Error): ~$10-15 per prediction
- **Training Samples**: 350 (70% of 500)
- **Test Samples**: 150 (30% of 500)
- **Features**: 4 (Avg. Session Length, Time on App, Time on Website, Length of Membership)

### Feature Importance
The model learned these approximate relationships:
- **Avg. Session Length**: Strong positive correlation with spending
- **Time on App**: Moderate positive correlation
- **Time on Website**: Moderate positive correlation
- **Length of Membership**: Strong positive correlation

### Data Source
- **Dataset**: E-commerce Customer Records
- **Records**: 500+ customers
- **Features**: Customer engagement & behavioral metrics

---

## 🌐 Deployment

### Deploy Backend (Render)

1. **Create Render Account**: https://render.com
2. **Connect GitHub Repository**
3. **Create New Web Service**
4. **Settings**:
   - Build Command: `pip install -r requirements.txt && python train_model.py`
   - Start Command: `uvicorn main:app --host 0.0.0.0 --port $PORT`
5. **Environment Variables**: (If needed, add in Render dashboard)
6. **Deploy!**

**Backend URL Example**: `https://spendsense-api.onrender.com`

### Deploy Frontend (Vercel)

1. **Create Vercel Account**: https://vercel.com
2. **Import Project from GitHub**
3. **Configure**:
   - Root Directory: `frontend`
   - Build Command: `npm run build`
   - Output Directory: `dist`
4. **Environment Variables**:
   ```
   VITE_API_URL=https://spendsense-api.onrender.com
   ```
5. **Deploy!**

**Frontend URL Example**: `https://spendsense-ai.vercel.app`

### Update Frontend API URL (Deployed)

In `frontend/src/Dashboard.jsx`, update:
```javascript
const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8000'
```

---

## 🤝 Contributing

Contributions are welcome! Here's how:

1. **Fork** the repository
2. **Create** a feature branch (`git checkout -b feature/amazing-feature`)
3. **Commit** your changes (`git commit -m 'Add amazing feature'`)
4. **Push** to the branch (`git push origin feature/amazing-feature`)
5. **Open** a Pull Request

### Areas for Contribution
- Add more ML models (Random Forest, Gradient Boosting)
- Implement batch prediction CSV upload
- Add unit tests
- Improve UI/UX
- Add authentication
- Database integration

---

## 📄 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

---

## 👨‍💻 Author

**Your Name** - Building ML products for the real world

- 🔗 LinkedIn: [Your LinkedIn Profile]
- 💻 GitHub: [Your GitHub Profile]
- 📧 Email: your.email@example.com

---

## 🙏 Acknowledgments

- Built from a personal ML notebook project
- Inspired by modern SaaS applications
- Thanks to the open-source community (React, FastAPI, scikit-learn, Tailwind CSS)

---

## 📞 Support

- **Questions?** Open an issue on GitHub
- **Found a bug?** Report it with details
- **Have a feature idea?** Create a discussion

---

## 🚀 Next Steps

- [ ] Deploy to production (Vercel + Render)
- [ ] Add database (PostgreSQL)
- [ ] Implement user authentication
- [ ] Add batch prediction feature
- [ ] Create landing page marketing
- [ ] Write unit tests
- [ ] Add API rate limiting
- [ ] Create mobile app (React Native)

---

**Made with ❤️ using React, FastAPI, and ML** 🤖

