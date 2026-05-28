import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HelpCircle, X, Mail, User, Phone, Linkedin } from 'lucide-react';

export default function FloatingHelpButton({ darkMode }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        animate={{ boxShadow: ['0 0 0 0 rgba(59,130,246,0.4)', '0 0 0 15px rgba(59,130,246,0)'] }}
        transition={{ repeat: Infinity, duration: 2 }}
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-50 flex items-center gap-2 px-4 py-3 rounded-full bg-blue-600 text-white font-medium shadow-lg hover:bg-blue-700 transition-colors"
      >
        <HelpCircle size={20} />
        <span className="hidden sm:inline">Need Help?</span>
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className={`relative w-full max-w-sm rounded-2xl overflow-hidden shadow-2xl border ${
                darkMode ? 'bg-slate-900 border-slate-700 text-white' : 'bg-white border-gray-200 text-gray-900'
              }`}
            >
              <div className={`p-4 border-b flex justify-between items-center ${darkMode ? 'border-slate-800' : 'border-gray-100'}`}>
                <h2 className="font-bold text-lg flex items-center gap-2"><HelpCircle size={20} className="text-blue-500" /> Support & Contact</h2>
                <button onClick={() => setIsOpen(false)} className="p-1 rounded-full hover:bg-white/10 transition">
                  <X size={20} />
                </button>
              </div>

              <div className="p-6 space-y-4">
                <a href="#" className={`flex items-center gap-4 p-3 rounded-xl border transition-colors ${darkMode ? 'bg-slate-800/50 border-slate-700 hover:bg-slate-800' : 'bg-gray-50 border-gray-200 hover:bg-gray-100'}`}>
                  <Linkedin size={20} className="text-blue-500" />
                  <div>
                    <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>LinkedIn</p>
                    <p className="font-medium text-sm">Connect on LinkedIn</p>
                  </div>
                </a>

                <a href="mailto:240392.ec@rmkec.ac.in" className={`flex items-center gap-4 p-3 rounded-xl border transition-colors ${darkMode ? 'bg-slate-800/50 border-slate-700 hover:bg-slate-800' : 'bg-gray-50 border-gray-200 hover:bg-gray-100'}`}>
                  <Mail size={20} className="text-blue-500" />
                  <div>
                    <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Email</p>
                    <p className="font-medium text-sm">240392.ec@rmkec.ac.in</p>
                  </div>
                </a>

                <div className={`flex items-center gap-4 p-3 rounded-xl border ${darkMode ? 'bg-slate-800/50 border-slate-700' : 'bg-gray-50 border-gray-200'}`}>
                  <User size={20} className="text-blue-500" />
                  <div>
                    <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Author</p>
                    <p className="font-medium text-sm">ABDUL WAHEED KHAN.S</p>
                  </div>
                </div>

                <div className={`flex items-center gap-4 p-3 rounded-xl border ${darkMode ? 'bg-slate-800/50 border-slate-700' : 'bg-gray-50 border-gray-200'}`}>
                  <Phone size={20} className="text-blue-500" />
                  <div>
                    <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Phone</p>
                    <p className="font-medium text-sm">9787622404</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
