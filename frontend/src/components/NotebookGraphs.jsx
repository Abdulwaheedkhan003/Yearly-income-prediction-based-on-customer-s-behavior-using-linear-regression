import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Loader2, TrendingUp, BarChart3, Activity, Users, ZoomIn, X } from 'lucide-react';

const GRAPH_META = [
  {
    id: 'actual_vs_pred',
    file: 'actual_vs_pred.png',
    title: 'Actual vs Predicted',
    description: 'How closely our model\'s predictions match real customer spending. Points near the diagonal line = accurate predictions.',
    icon: TrendingUp,
    accent: 'from-blue-500 to-blue-600',
    accentBorder: 'border-blue-500/30',
    accentText: 'text-blue-400',
  },
  {
    id: 'residuals',
    file: 'residuals.png',
    title: 'Prediction Errors',
    description: 'Distribution of how far off our predictions are. A bell curve centered at zero means the model is unbiased.',
    icon: Activity,
    accent: 'from-purple-500 to-purple-600',
    accentBorder: 'border-purple-500/30',
    accentText: 'text-purple-400',
  },
  {
    id: 'feature_importance',
    file: 'feature_importance.png',
    title: 'Feature Impact',
    description: 'Which customer attributes have the strongest effect on yearly spending. Longer bars = bigger impact.',
    icon: BarChart3,
    accent: 'from-cyan-500 to-teal-500',
    accentBorder: 'border-cyan-500/30',
    accentText: 'text-cyan-400',
  },
  {
    id: 'target_distribution',
    file: 'target_distribution.png',
    title: 'Spending Distribution',
    description: 'How yearly spending is distributed across all 500 customers in the training dataset.',
    icon: Users,
    accent: 'from-pink-500 to-rose-500',
    accentBorder: 'border-pink-500/30',
    accentText: 'text-pink-400',
  },
];

export default function NotebookGraphs({ darkMode }) {
  const [loading, setLoading] = useState(true);
  const [loadedCount, setLoadedCount] = useState(0);
  const [expandedGraph, setExpandedGraph] = useState(null);
  const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8000';

  useEffect(() => {
    // Preload all images
    let loaded = 0;
    GRAPH_META.forEach((g) => {
      const img = new Image();
      img.onload = img.onerror = () => {
        loaded++;
        setLoadedCount(loaded);
        if (loaded >= GRAPH_META.length) {
          setLoading(false);
        }
      };
      img.src = `${API_BASE}/graphs/${g.file}`;
    });

    // Fallback timeout
    const timer = setTimeout(() => setLoading(false), 5000);
    return () => clearTimeout(timer);
  }, [API_BASE]);

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="w-full mt-10"
      >
        {/* Section Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center bg-gradient-to-br from-blue-500 to-purple-600 shadow-lg shadow-blue-500/20`}>
            <BarChart3 size={20} className="text-white" />
          </div>
          <div>
            <h3 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              Model Training Insights
            </h3>
            <p className={`text-xs ${darkMode ? 'text-slate-400' : 'text-gray-500'}`}>
              Generated from your Ecommerce Customers dataset · 500 samples · Linear Regression
            </p>
          </div>
        </div>

        {/* Loading State */}
        {loading ? (
          <div className={`rounded-2xl border p-12 flex flex-col items-center justify-center gap-4 ${
            darkMode ? 'bg-slate-900/60 border-slate-700/50' : 'bg-white/80 border-gray-200'
          }`}>
            <div className="relative">
              <Loader2 size={36} className={`animate-spin ${darkMode ? 'text-blue-400' : 'text-blue-600'}`} />
              <div className="absolute inset-0 blur-xl bg-blue-500/20 rounded-full" />
            </div>
            <p className={`font-medium ${darkMode ? 'text-slate-300' : 'text-gray-600'}`}>
              Loading model visualizations...
            </p>
            <div className={`w-48 h-1.5 rounded-full overflow-hidden ${darkMode ? 'bg-slate-800' : 'bg-gray-200'}`}>
              <motion.div
                className="h-full rounded-full bg-gradient-to-r from-blue-500 to-purple-500"
                initial={{ width: '0%' }}
                animate={{ width: `${(loadedCount / GRAPH_META.length) * 100}%` }}
                transition={{ duration: 0.3 }}
              />
            </div>
            <p className={`text-xs ${darkMode ? 'text-slate-500' : 'text-gray-400'}`}>
              {loadedCount}/{GRAPH_META.length} graphs loaded
            </p>
          </div>
        ) : (
          /* Graph Grid */
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {GRAPH_META.map((g, idx) => {
              const Icon = g.icon;
              return (
                <motion.div
                  key={g.id}
                  initial={{ opacity: 0, y: 20, scale: 0.97 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ delay: idx * 0.1, duration: 0.4, ease: 'easeOut' }}
                  className={`group rounded-2xl border overflow-hidden transition-all duration-300 ${
                    darkMode
                      ? `bg-slate-900/70 border-slate-700/40 hover:border-slate-600/60 hover:shadow-xl hover:shadow-blue-500/5`
                      : `bg-white border-gray-200 hover:border-gray-300 hover:shadow-xl hover:shadow-gray-200/50`
                  }`}
                >
                  {/* Card Header */}
                  <div className={`px-5 py-3.5 flex items-center justify-between border-b ${
                    darkMode ? 'border-slate-800/80' : 'border-gray-100'
                  }`}>
                    <div className="flex items-center gap-2.5">
                      <div className={`w-7 h-7 rounded-lg flex items-center justify-center bg-gradient-to-br ${g.accent} shadow-sm`}>
                        <Icon size={14} className="text-white" />
                      </div>
                      <div>
                        <h4 className={`text-sm font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                          {g.title}
                        </h4>
                      </div>
                    </div>
                    <button
                      onClick={() => setExpandedGraph(g)}
                      className={`p-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-200 ${
                        darkMode ? 'hover:bg-slate-800 text-slate-400' : 'hover:bg-gray-100 text-gray-400'
                      }`}
                      title="Expand"
                    >
                      <ZoomIn size={15} />
                    </button>
                  </div>

                  {/* Graph Image */}
                  <div
                    className="cursor-pointer"
                    onClick={() => setExpandedGraph(g)}
                  >
                    <img
                      src={`${API_BASE}/graphs/${g.file}`}
                      alt={g.title}
                      className="w-full h-auto block"
                      loading="lazy"
                    />
                  </div>

                  {/* Card Footer — Description */}
                  <div className={`px-5 py-3 border-t ${
                    darkMode ? 'border-slate-800/80' : 'border-gray-100'
                  }`}>
                    <p className={`text-xs leading-relaxed ${
                      darkMode ? 'text-slate-400' : 'text-gray-500'
                    }`}>
                      {g.description}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </motion.div>

      {/* ── Lightbox Modal ──────────────────────────────────────────────────── */}
      <AnimatePresence>
        {expandedGraph && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
            onClick={() => setExpandedGraph(null)}
          >
            <motion.div
              initial={{ scale: 0.85, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.85, opacity: 0 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className={`relative max-w-4xl w-full rounded-2xl overflow-hidden border shadow-2xl ${
                darkMode ? 'bg-slate-900 border-slate-700' : 'bg-white border-gray-200'
              }`}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Header */}
              <div className={`px-6 py-4 flex items-center justify-between border-b ${
                darkMode ? 'border-slate-800' : 'border-gray-100'
              }`}>
                <div className="flex items-center gap-3">
                  {(() => {
                    const Icon = expandedGraph.icon;
                    return (
                      <div className={`w-9 h-9 rounded-xl flex items-center justify-center bg-gradient-to-br ${expandedGraph.accent}`}>
                        <Icon size={18} className="text-white" />
                      </div>
                    );
                  })()}
                  <div>
                    <h3 className={`text-lg font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                      {expandedGraph.title}
                    </h3>
                    <p className={`text-xs ${darkMode ? 'text-slate-400' : 'text-gray-500'}`}>
                      {expandedGraph.description}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setExpandedGraph(null)}
                  className={`p-2 rounded-lg transition-colors ${
                    darkMode ? 'hover:bg-slate-800 text-slate-400' : 'hover:bg-gray-100 text-gray-400'
                  }`}
                >
                  <X size={20} />
                </button>
              </div>

              {/* Modal Image */}
              <div className={`p-4 ${darkMode ? 'bg-slate-950' : 'bg-gray-50'}`}>
                <img
                  src={`${API_BASE}/graphs/${expandedGraph.file}`}
                  alt={expandedGraph.title}
                  className="w-full h-auto rounded-lg"
                />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
