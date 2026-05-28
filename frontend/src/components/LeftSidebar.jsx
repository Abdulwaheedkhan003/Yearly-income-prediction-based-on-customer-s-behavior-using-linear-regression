import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeftRight, Clock, ChevronDown, ChevronUp } from 'lucide-react';
import axios from 'axios';

// Utility for time ago
function timeAgo(dateString) {
  const date = new Date(dateString);
  const seconds = Math.floor((new Date() - date) / 1000);
  
  let interval = seconds / 31536000;
  if (interval > 1) return Math.floor(interval) + " years ago";
  interval = seconds / 2592000;
  if (interval > 1) return Math.floor(interval) + " months ago";
  interval = seconds / 86400;
  if (interval > 1) return Math.floor(interval) + " days ago";
  interval = seconds / 3600;
  if (interval > 1) return Math.floor(interval) + " hours ago";
  interval = seconds / 60;
  if (interval > 1) return Math.floor(interval) + " minutes ago";
  return "Just now";
}

export default function LeftSidebar({ darkMode, refreshTrigger }) {
  const [usd, setUsd] = useState(1);
  const [inr, setInr] = useState(83.5); // Static fallback rate
  const EXCHANGE_RATE = 83.5;

  const [history, setHistory] = useState([]);
  const [expandedId, setExpandedId] = useState(null);

  useEffect(() => {
    // Fetch history
    const fetchHistory = async () => {
      try {
        const response = await axios.get('/api/history');
        setHistory(response.data.history);
      } catch (err) {
        console.error("Failed to fetch history:", err);
      }
    };
    fetchHistory();
  }, [refreshTrigger]);

  const handleUsdChange = (e) => {
    const val = parseFloat(e.target.value) || 0;
    setUsd(val);
    setInr((val * EXCHANGE_RATE).toFixed(2));
  };

  const handleInrChange = (e) => {
    const val = parseFloat(e.target.value) || 0;
    setInr(val);
    setUsd((val / EXCHANGE_RATE).toFixed(2));
  };

  const toggleExpand = (id) => {
    setExpandedId(expandedId === id ? null : id);
  };

  return (
    <aside className={`w-full lg:w-80 flex-shrink-0 flex flex-col gap-6 lg:h-[calc(100vh-80px)] overflow-y-auto lg:sticky lg:top-20 p-4 custom-scrollbar`}>
      
      {/* Currency Converter */}
      <motion.div 
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className={`p-5 rounded-2xl border backdrop-blur-xl shadow-lg ${
          darkMode ? 'bg-slate-900/40 border-blue-500/30' : 'bg-white/60 border-blue-200'
        }`}
      >
        <h3 className={`font-bold mb-4 flex items-center gap-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
          <ArrowLeftRight size={18} className="text-blue-500" />
          Currency Converter
        </h3>
        
        <div className="flex flex-col gap-3">
          <div className="relative">
            <span className={`absolute left-3 top-1/2 -translate-y-1/2 font-medium ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>$</span>
            <input 
              type="number" 
              value={usd} 
              onChange={handleUsdChange}
              className={`w-full pl-8 pr-3 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                darkMode ? 'bg-slate-800/50 border-slate-700 text-white' : 'bg-gray-50 border-gray-200 text-gray-900'
              }`}
            />
          </div>
          
          <div className="relative">
            <span className={`absolute left-3 top-1/2 -translate-y-1/2 font-medium ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>₹</span>
            <input 
              type="number" 
              value={inr} 
              onChange={handleInrChange}
              className={`w-full pl-8 pr-3 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                darkMode ? 'bg-slate-800/50 border-slate-700 text-white' : 'bg-gray-50 border-gray-200 text-gray-900'
              }`}
            />
          </div>
        </div>
      </motion.div>

      {/* Prediction History */}
      <motion.div 
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.1 }}
        className={`flex-1 flex flex-col p-5 rounded-2xl border backdrop-blur-xl shadow-lg min-h-[300px] ${
          darkMode ? 'bg-slate-900/40 border-slate-700/50' : 'bg-white/60 border-gray-200'
        }`}
      >
        <h3 className={`font-bold mb-4 flex items-center gap-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
          <Clock size={18} className="text-purple-500" />
          Prediction History
        </h3>
        
        <div className="flex-1 overflow-y-auto pr-1 space-y-3 custom-scrollbar">
          {history.length === 0 ? (
            <p className={`text-sm italic text-center mt-10 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
              No predictions yet.
            </p>
          ) : (
            history.map((item) => (
              <div 
                key={item.id} 
                className={`p-3 rounded-xl border transition-colors ${
                  darkMode ? 'bg-slate-800/50 border-slate-700 hover:bg-slate-800' : 'bg-gray-50 border-gray-100 hover:bg-gray-100'
                }`}
              >
                <div 
                  className="flex justify-between items-center cursor-pointer"
                  onClick={() => toggleExpand(item.id)}
                >
                  <div>
                    <p className={`font-bold ${darkMode ? 'text-blue-400' : 'text-blue-600'}`}>
                      ${item.predicted_spend.toFixed(2)}
                    </p>
                    <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                      {timeAgo(item.timestamp)}
                    </p>
                  </div>
                  {expandedId === item.id ? (
                    <ChevronUp size={16} className={darkMode ? 'text-gray-400' : 'text-gray-500'} />
                  ) : (
                    <ChevronDown size={16} className={darkMode ? 'text-gray-400' : 'text-gray-500'} />
                  )}
                </div>
                
                {expandedId === item.id && (
                  <motion.div 
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className={`mt-3 pt-3 border-t text-xs space-y-1 ${darkMode ? 'border-slate-700 text-gray-300' : 'border-gray-200 text-gray-600'}`}
                  >
                    <div className="flex justify-between"><span>Session:</span> <span>{item.input_values.avg_session_length}m</span></div>
                    <div className="flex justify-between"><span>App:</span> <span>{item.input_values.time_on_app}m</span></div>
                    <div className="flex justify-between"><span>Web:</span> <span>{item.input_values.time_on_website}m</span></div>
                    <div className="flex justify-between"><span>Member:</span> <span>{item.input_values.length_of_membership}y</span></div>
                  </motion.div>
                )}
              </div>
            ))
          )}
        </div>
      </motion.div>
    </aside>
  );
}
