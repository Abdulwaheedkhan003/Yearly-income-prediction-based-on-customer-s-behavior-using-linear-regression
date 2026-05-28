import React from 'react';
import { motion } from 'framer-motion';
import { Info, MousePointer2, Calculator, BrainCircuit, LineChart } from 'lucide-react';

export default function RightSidebar({ darkMode }) {
  const steps = [
    { icon: MousePointer2, text: "Open the dashboard page" },
    { icon: Calculator, text: "Enter customer behavior details (Session Length, Time on App, Time on Website, Membership Length)" },
    { icon: BrainCircuit, text: "Click the Predict button" },
    { icon: LineChart, text: "View predicted yearly spending, confidence score, and AI insights" },
  ];

  return (
    <aside className={`w-full lg:w-80 flex-shrink-0 lg:h-[calc(100vh-80px)] overflow-y-auto lg:sticky lg:top-20 p-4 custom-scrollbar`}>
      <motion.div 
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        className={`p-6 rounded-2xl border backdrop-blur-xl shadow-lg relative overflow-hidden ${
          darkMode 
            ? 'bg-slate-900/40 border-purple-500/30 shadow-purple-500/10' 
            : 'bg-white/60 border-purple-200 shadow-purple-100'
        }`}
      >
        <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/10 rounded-full blur-3xl" />
        
        <div className="flex items-center gap-3 mb-6 relative z-10">
          <div className={`p-2 rounded-lg ${darkMode ? 'bg-purple-500/20 text-purple-400' : 'bg-purple-100 text-purple-600'}`}>
            <Info size={24} />
          </div>
          <h2 className={`font-bold text-lg ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            How to Use SpendSense AI
          </h2>
        </div>

        <div className="space-y-6 relative z-10">
          <p className={`text-sm leading-relaxed ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
            Welcome! This tool uses Machine Learning to forecast how much a customer will spend based on their engagement metrics.
          </p>

          <div className="space-y-4">
            {steps.map((step, idx) => (
              <div key={idx} className="flex items-start gap-3">
                <div className={`mt-0.5 flex-shrink-0 w-6 h-6 flex items-center justify-center rounded-full text-xs font-bold ${
                  darkMode ? 'bg-slate-800 text-purple-400 border border-purple-500/30' : 'bg-purple-50 text-purple-600 border border-purple-200'
                }`}>
                  {idx + 1}
                </div>
                <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  {step.text}
                </p>
              </div>
            ))}
          </div>

          <div className={`mt-6 p-4 rounded-xl border ${
            darkMode ? 'bg-blue-500/10 border-blue-500/30' : 'bg-blue-50 border-blue-200'
          }`}>
            <p className={`text-sm font-medium ${darkMode ? 'text-blue-300' : 'text-blue-800'}`}>
              💡 Tip: Use this information to understand customer value and tailor your marketing strategy.
            </p>
          </div>
        </div>
      </motion.div>
    </aside>
  );
}
