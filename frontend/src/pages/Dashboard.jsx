import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar } from 'recharts'
import { Loader, TrendingUp, AlertCircle } from 'lucide-react'
import axios from 'axios'
import NotebookGraphs from '../components/NotebookGraphs'
import AIExplanation from '../components/AIExplanation'

export default function Dashboard({ darkMode, onPredictionMade }) {
  const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8000'

  const [inputs, setInputs] = useState({
    avg_session_length: 34.5,
    time_on_app: 12.7,
    time_on_website: 39.6,
    length_of_membership: 4.0
  })

  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  // Sample data for visualization
  const chartData = [
    { name: 'Your Input', predicted: result?.predicted_spend || 0, avg: 500 },
    { name: 'Industry Avg', predicted: 500, avg: 500 },
    { name: 'High Spender', predicted: 750, avg: 750 }
  ]

  const handleSliderChange = (key, value) => {
    setInputs(prev => ({
      ...prev,
      [key]: parseFloat(value)
    }))
  }

  const handlePredict = async () => {
    setLoading(true)
    setError(null)
    try {
      const response = await axios.post(`${API_BASE}/predict`, inputs)
      setResult(response.data)
      if (onPredictionMade) onPredictionMade()
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to get prediction. Make sure backend is running on http://localhost:8000')
      console.error('Prediction error:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleRandomSample = () => {
    setInputs({
      avg_session_length: 32 + Math.random() * 5,
      time_on_app: 10 + Math.random() * 5,
      time_on_website: 35 + Math.random() * 8,
      length_of_membership: 2 + Math.random() * 4
    })
  }

  const sliderStyle = `
    w-full h-2 rounded-lg appearance-none cursor-pointer
    ${darkMode ? 'bg-slate-700' : 'bg-gray-300'}
  `

  return (
    <div className={`min-h-screen py-8 px-4 ${
      darkMode ? 'bg-slate-950' : 'bg-gray-50'
    }`}>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h2 className={`text-4xl font-bold mb-2 ${
            darkMode ? 'text-white' : 'text-gray-900'
          }`}>
            Prediction Dashboard
          </h2>
          <p className={darkMode ? 'text-gray-400' : 'text-gray-600'}>
            Adjust the sliders and get instant AI predictions
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Input Panel */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className={`glass-effect p-8 h-fit sticky top-8`}
          >
            <h3 className={`text-2xl font-bold mb-6 ${
              darkMode ? 'text-white' : 'text-gray-900'
            }`}>
              Customer Input
            </h3>

            {/* Sliders */}
            <div className="space-y-6">
              {[
                { key: 'avg_session_length', label: 'Avg. Session Length', min: 20, max: 45, step: 0.1 },
                { key: 'time_on_app', label: 'Time on App', min: 5, max: 20, step: 0.1 },
                { key: 'time_on_website', label: 'Time on Website', min: 20, max: 50, step: 0.1 },
                { key: 'length_of_membership', label: 'Membership Duration (years)', min: 1, max: 6, step: 0.1 }
              ].map(({ key, label, min, max, step }) => (
                <div key={key}>
                  <div className="flex justify-between mb-2">
                    <label className={`font-semibold ${
                      darkMode ? 'text-gray-300' : 'text-gray-700'
                    }`}>
                      {label}
                    </label>
                    <span className="text-blue-400 font-bold">
                      {inputs[key].toFixed(1)}
                    </span>
                  </div>
                  <input
                    type="range"
                    min={min}
                    max={max}
                    step={step}
                    value={inputs[key]}
                    onChange={(e) => handleSliderChange(key, e.target.value)}
                    className={sliderStyle}
                  />
                </div>
              ))}
            </div>

            {/* Buttons */}
            <div className="mt-8 space-y-3">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handlePredict}
                disabled={loading}
                className={`w-full py-3 rounded-lg font-bold text-white transition flex items-center justify-center gap-2 ${
                  loading
                    ? 'bg-gray-600 cursor-not-allowed'
                    : 'bg-gradient-to-r from-blue-500 to-purple-600 hover:shadow-lg hover:shadow-blue-500/50'
                }`}
              >
                {loading ? (
                  <>
                    <Loader size={20} className="animate-spin" />
                    Predicting...
                  </>
                ) : (
                  <>
                    <TrendingUp size={20} />
                    Predict Spending
                  </>
                )}
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleRandomSample}
                className={`w-full py-3 rounded-lg font-semibold transition ${
                  darkMode
                    ? 'bg-slate-800 text-gray-300 hover:bg-slate-700'
                    : 'bg-gray-300 text-gray-800 hover:bg-gray-400'
                }`}
              >
                🎲 Try Random Sample
              </motion.button>
            </div>
          </motion.div>

          {/* Output Panel */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="space-y-6"
          >
            {/* Result Card */}
            {result ? (
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className={`glass-effect p-8`}
              >
                <h3 className={`text-lg font-semibold mb-4 ${
                  darkMode ? 'text-gray-400' : 'text-gray-600'
                }`}>
                  Prediction Result
                </h3>

                <motion.div
                  animate={{ scale: [1, 1.05, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="text-center py-8"
                >
                  <p className={`text-sm ${
                    darkMode ? 'text-gray-500' : 'text-gray-600'
                  } mb-2`}>
                    Predicted Yearly Spending
                  </p>
                  <h2 className="text-5xl font-bold gradient-text mb-2">
                    ${result.predicted_spend?.toFixed(2)}
                  </h2>
                  <div className="flex items-center justify-center gap-2 mb-4">
                    <div className={`w-3 h-3 rounded-full ${
                      result.confidence_score > 0.8 ? 'bg-green-500' : 'bg-yellow-500'
                    }`} />
                    <span className={darkMode ? 'text-gray-400' : 'text-gray-600'}>
                      {(result.confidence_score * 100).toFixed(0)}% Confidence
                    </span>
                  </div>
                </motion.div>

                {/* Insights */}
                <div className={`p-4 rounded-lg border-l-4 ${
                  darkMode
                    ? 'bg-blue-500/10 border-blue-500 text-blue-300'
                    : 'bg-blue-100 border-blue-500 text-blue-800'
                }`}>
                  <p className="flex items-start gap-3">
                    <AlertCircle size={20} className="flex-shrink-0 mt-0.5" />
                    <span>{result.insights}</span>
                  </p>
                </div>
              </motion.div>
            ) : (
              <div className={`glass-effect p-8 text-center h-64 flex items-center justify-center ${
                darkMode ? 'text-gray-400' : 'text-gray-600'
              }`}>
                <div>
                  <p className="text-lg font-semibold mb-2">Adjust inputs & predict</p>
                  <p>Click "Predict Spending" to see results</p>
                </div>
              </div>
            )}

            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`p-4 rounded-lg border-l-4 ${
                  darkMode
                    ? 'bg-red-500/10 border-red-500 text-red-300'
                    : 'bg-red-100 border-red-500 text-red-800'
                }`}
              >
                <p className="flex items-start gap-3">
                  <AlertCircle size={20} className="flex-shrink-0" />
                  <span>{error}</span>
                </p>
              </motion.div>
            )}

            {/* Chart */}
            {result && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className={`glass-effect p-6`}
              >
                <h3 className={`text-lg font-semibold mb-4 ${
                  darkMode ? 'text-white' : 'text-gray-900'
                }`}>
                  Spending Comparison
                </h3>
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke={darkMode ? '#334155' : '#e5e7eb'} />
                    <XAxis stroke={darkMode ? '#9ca3af' : '#6b7280'} />
                    <YAxis stroke={darkMode ? '#9ca3af' : '#6b7280'} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: darkMode ? '#1e293b' : '#fff',
                        border: `1px solid ${darkMode ? '#475569' : '#e5e7eb'}`,
                        borderRadius: '8px'
                      }}
                      labelStyle={{ color: darkMode ? '#fff' : '#000' }}
                    />
                    <Legend />
                    <Bar dataKey="predicted" fill="#3b82f6" radius={[8, 8, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </motion.div>
            )}
          </motion.div>
        </div>

        {/* --- NEW ADDITIONS BELOW PREDICTION GRID --- */}
        {result && (
          <div className="mt-8">
            <NotebookGraphs darkMode={darkMode} />
            <AIExplanation darkMode={darkMode} result={result} inputs={inputs} />
          </div>
        )}

        {/* Model Accuracy Footer */}
        <div className="mt-16 mb-8 text-center pb-8 border-t border-gray-200 dark:border-slate-800 pt-8">
          <p className={`text-sm font-medium ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
            Model Accuracy (R² Score): <span className={`font-bold ${darkMode ? 'text-green-400' : 'text-green-600'}`}>98.09%</span>
          </p>
          <p className={`text-xs mt-1 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
            Computed on 30% held-out test data (random_state=42). MAE: $8.43 · RMSE: $10.19
          </p>
        </div>

      </div>
    </div>
  )
}
