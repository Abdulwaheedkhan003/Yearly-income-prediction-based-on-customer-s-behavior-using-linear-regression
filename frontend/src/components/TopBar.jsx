import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Globe, User } from 'lucide-react';
import AuthModal from './AuthModal';

export default function TopBar({ darkMode, setDarkMode, setCurrentPage }) {
  const [showLangDropdown, setShowLangDropdown] = useState(false);
  const [selectedLang, setSelectedLang] = useState('English');
  const [showAuthModal, setShowAuthModal] = useState(false);

  const languages = ['English', 'Tamil', 'Hindi', 'Japanese'];

  return (
    <>
      <nav className={`fixed top-0 w-full z-40 border-b backdrop-blur-md transition-colors ${
        darkMode ? 'border-slate-800 bg-slate-950/70' : 'border-gray-200 bg-white/70'
      }`}>
        <div className="max-w-screen-2xl mx-auto px-4 py-3 flex items-center justify-between">
          
          {/* Left: Language & Logo */}
          <div className="flex items-center gap-6">
            
            <div className="relative">
              <button 
                onClick={() => setShowLangDropdown(!showLangDropdown)}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-full backdrop-blur-md transition-all ${
                  darkMode ? 'bg-white/10 hover:bg-white/20 text-white' : 'bg-gray-200 hover:bg-gray-300 text-gray-800'
                }`}
              >
                <Globe size={16} />
                <span className="text-sm font-medium">{selectedLang}</span>
              </button>

              <AnimatePresence>
                {showLangDropdown && (
                  <motion.div 
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className={`absolute top-full left-0 mt-2 w-32 rounded-lg shadow-xl overflow-hidden backdrop-blur-xl border ${
                      darkMode ? 'bg-slate-900/90 border-slate-700' : 'bg-white/90 border-gray-200'
                    }`}
                  >
                    {languages.map(lang => (
                      <div 
                        key={lang}
                        onClick={() => { setSelectedLang(lang); setShowLangDropdown(false); }}
                        className={`px-4 py-2 cursor-pointer text-sm transition-colors ${
                          darkMode ? 'text-gray-200 hover:bg-slate-800' : 'text-gray-700 hover:bg-gray-100'
                        }`}
                      >
                        {lang}
                      </div>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <motion.div
              className="flex items-center gap-2 cursor-pointer"
              whileHover={{ scale: 1.05 }}
              onClick={() => setCurrentPage('landing')}
            >
              <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-lg shadow-blue-500/30">
                <span className="text-white font-bold text-lg">💰</span>
              </div>
              <span className={`font-bold text-xl tracking-tight hidden sm:block ${
                darkMode ? 'text-white' : 'text-gray-900'
              }`}>
                SpendSense AI
              </span>
            </motion.div>

          </div>

          {/* Right: Theme Toggle & Avatar */}
          <div className="flex items-center gap-4">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setDarkMode(!darkMode)}
              className={`p-2 rounded-xl transition-colors ${
                darkMode
                  ? 'bg-slate-800 text-yellow-400 hover:bg-slate-700'
                  : 'bg-gray-200 text-blue-600 hover:bg-gray-300'
              }`}
            >
              {darkMode ? '☀️' : '🌙'}
            </motion.button>

            <motion.button
              animate={{ y: [0, -3, 0] }}
              transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
              whileHover={{ scale: 1.1 }}
              onClick={() => setShowAuthModal(true)}
              className={`w-10 h-10 rounded-full flex items-center justify-center shadow-[0_0_15px_rgba(168,85,247,0.4)] border-2 transition-colors ${
                darkMode ? 'bg-slate-800 border-purple-500 text-purple-400' : 'bg-white border-blue-500 text-blue-600'
              }`}
            >
              <User size={20} />
            </motion.button>
          </div>
        </div>
      </nav>
      
      <AuthModal isOpen={showAuthModal} onClose={() => setShowAuthModal(false)} darkMode={darkMode} setCurrentPage={setCurrentPage} />
    </>
  );
}
