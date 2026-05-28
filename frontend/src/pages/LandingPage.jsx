import React from 'react'
import { motion } from 'framer-motion'
import { ArrowRight, Zap, BarChart3, Smile } from 'lucide-react'

export default function LandingPage({ onNavigate, darkMode }) {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.2, delayChildren: 0.3 }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: 'easeOut' }
    }
  }

  return (
    <div className={`min-h-screen flex flex-col items-center justify-center px-4 relative overflow-hidden`}>
      {/* Animated background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute w-96 h-96 bg-blue-500/20 rounded-full blur-3xl"
          animate={{
            x: [0, 100, -100, 0],
            y: [0, -100, 100, 0]
          }}
          transition={{ duration: 20, repeat: Infinity }}
          style={{ left: '-10%', top: '-10%' }}
        />
        <motion.div
          className="absolute w-96 h-96 bg-purple-500/20 rounded-full blur-3xl"
          animate={{
            x: [0, -100, 100, 0],
            y: [0, 100, -100, 0]
          }}
          transition={{ duration: 25, repeat: Infinity }}
          style={{ right: '-10%', bottom: '-10%' }}
        />
      </div>

      <motion.div
        className="relative z-10 max-w-4xl"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Badge */}
        <motion.div variants={itemVariants} className="flex justify-center mb-8">
          <div className={`px-4 py-2 rounded-full border backdrop-blur-sm ${
            darkMode
              ? 'border-blue-500/50 bg-blue-500/10 text-blue-300'
              : 'border-blue-400/50 bg-blue-400/10 text-blue-600'
          }`}>
            <span className="text-sm font-semibold flex items-center gap-2">
              <Zap size={16} /> Built with ML & React
            </span>
          </div>
        </motion.div>

        {/* Hero Title */}
        <motion.h1
          variants={itemVariants}
          className={`text-5xl md:text-6xl font-bold text-center mb-6 ${
            darkMode ? 'text-white' : 'text-gray-900'
          }`}
        >
          Predict Customer <span className="gradient-text">Spending</span> with AI
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          variants={itemVariants}
          className={`text-xl text-center mb-8 ${
            darkMode ? 'text-gray-300' : 'text-gray-600'
          } max-w-2xl mx-auto`}
        >
          Advanced Linear Regression model that predicts customer yearly spending based on engagement metrics. Built from real e-commerce data.
        </motion.p>

        {/* CTA Button */}
        <motion.div
          variants={itemVariants}
          className="flex justify-center mb-16"
        >
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onNavigate}
            className={`px-8 py-4 rounded-lg font-bold text-lg flex items-center gap-3 group ${
              darkMode
                ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:shadow-lg hover:shadow-blue-500/50'
                : 'bg-gradient-to-r from-blue-400 to-purple-500 text-white hover:shadow-lg hover:shadow-blue-400/50'
            }`}
          >
            Try Prediction
            <motion.span
              animate={{ x: [0, 5, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              <ArrowRight size={20} />
            </motion.span>
          </motion.button>
        </motion.div>

        {/* Features Grid */}
        <motion.div
          variants={itemVariants}
          className="grid md:grid-cols-3 gap-6"
        >
          {[
            { icon: <Zap size={24} />, title: 'Lightning Fast', desc: 'Real-time predictions powered by ML' },
            { icon: <BarChart3 size={24} />, title: 'Data-Driven', desc: 'Trained on 500+ customer records' },
            { icon: <Smile size={24} />, title: 'Easy to Use', desc: 'Simple sliders for all inputs' }
          ].map((feature, idx) => (
            <motion.div
              key={idx}
              whileHover={{ y: -5 }}
              className={`glass-effect p-6 text-center ${
                darkMode ? 'text-white' : 'text-gray-900'
              }`}
            >
              <div className="flex justify-center mb-4 text-blue-400">
                {feature.icon}
              </div>
              <h3 className="font-bold text-lg mb-2">{feature.title}</h3>
              <p className={darkMode ? 'text-gray-400' : 'text-gray-600'}>
                {feature.desc}
              </p>
            </motion.div>
          ))}
        </motion.div>

        {/* GitHub & LinkedIn */}
        <motion.div
          variants={itemVariants}
          className="mt-16 text-center"
        >
          <p className={`text-sm mb-4 ${darkMode ? 'text-gray-500' : 'text-gray-600'}`}>
            Open source • Made By 2nd year ECE Engineering Student :)
          </p>
          <div className="flex justify-center gap-4">
            <a
              href="#"
              className={`px-4 py-2 rounded-lg font-medium ${
                darkMode
                  ? 'bg-slate-800 text-gray-300 hover:bg-slate-700'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              GitHub
            </a>
            <a
              href="#"
              className={`px-4 py-2 rounded-lg font-medium ${
                darkMode
                  ? 'bg-slate-800 text-gray-300 hover:bg-slate-700'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              LinkedIn
            </a>
          </div>
        </motion.div>
      </motion.div>
    </div>
  )
}
