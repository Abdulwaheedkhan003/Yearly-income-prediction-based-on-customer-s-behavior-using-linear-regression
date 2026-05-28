import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, LogOut, User, Lock } from 'lucide-react';

export default function AuthModal({ isOpen, onClose, darkMode, setCurrentPage }) {
  const [isLogin, setIsLogin] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const authStatus = localStorage.getItem('isAuthenticated') === 'true';
    setIsAuthenticated(authStatus);
  }, [isOpen]);

  const handleAuth = (e) => {
    e.preventDefault();
    localStorage.setItem('isAuthenticated', 'true');
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    localStorage.setItem('isAuthenticated', 'false');
    setIsAuthenticated(false);
    setCurrentPage('landing');
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          />
          
          <motion.div
            initial={{ scale: 0.95, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 20 }}
            className={`relative w-full max-w-sm rounded-2xl overflow-hidden shadow-2xl border ${
              darkMode ? 'bg-slate-900 border-slate-700 text-white' : 'bg-white border-gray-200 text-gray-900'
            }`}
          >
            <div className={`p-4 border-b flex justify-between items-center ${darkMode ? 'border-slate-800' : 'border-gray-100'}`}>
              <h2 className="font-bold text-lg">{isAuthenticated ? 'Account Settings' : (isLogin ? 'Welcome Back' : 'Create Account')}</h2>
              <button onClick={onClose} className="p-1 rounded-full hover:bg-white/10 transition">
                <X size={20} />
              </button>
            </div>

            <div className="p-6">
              {isAuthenticated ? (
                <div className="flex flex-col items-center gap-6">
                  <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-lg shadow-purple-500/20">
                    <User size={40} className="text-white" />
                  </div>
                  <div className="text-center">
                    <p className="font-medium text-lg">Logged In User</p>
                    <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>user@spendsense.ai</p>
                  </div>
                  
                  <button 
                    onClick={handleLogout}
                    className="w-full py-3 rounded-xl font-bold bg-red-500 hover:bg-red-600 active:bg-red-700 text-white transition-all transform hover:scale-[1.02]"
                  >
                    <span className="flex items-center justify-center gap-2"><LogOut size={18} /> Logout</span>
                  </button>
                </div>
              ) : (
                <form onSubmit={handleAuth} className="flex flex-col gap-4">
                  <div>
                    <label className={`block text-sm font-medium mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Email</label>
                    <div className="relative">
                      <User size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                      <input 
                        type="email" 
                        required 
                        placeholder="you@example.com"
                        className={`w-full pl-10 pr-4 py-2.5 rounded-xl border focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors ${
                          darkMode ? 'bg-slate-800/50 border-slate-700 text-white placeholder-gray-500' : 'bg-gray-50 border-gray-200 text-gray-900 placeholder-gray-400'
                        }`}
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className={`block text-sm font-medium mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Password</label>
                    <div className="relative">
                      <Lock size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                      <input 
                        type="password" 
                        required 
                        placeholder="••••••••"
                        className={`w-full pl-10 pr-4 py-2.5 rounded-xl border focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors ${
                          darkMode ? 'bg-slate-800/50 border-slate-700 text-white placeholder-gray-500' : 'bg-gray-50 border-gray-200 text-gray-900 placeholder-gray-400'
                        }`}
                      />
                    </div>
                  </div>

                  <button type="submit" className="w-full mt-2 py-2.5 rounded-xl font-bold bg-blue-600 hover:bg-blue-700 text-white transition-colors">
                    {isLogin ? 'Login' : 'Register'}
                  </button>
                  
                  <div className="text-center mt-2">
                    <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                      {isLogin ? "Don't have an account? " : "Already have an account? "}
                    </span>
                    <button 
                      type="button" 
                      onClick={() => setIsLogin(!isLogin)}
                      className="text-sm text-blue-500 hover:text-blue-400 font-medium"
                    >
                      {isLogin ? 'Register' : 'Login'}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
