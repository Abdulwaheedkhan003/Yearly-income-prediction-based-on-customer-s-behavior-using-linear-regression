import React, { useState } from 'react'
import LandingPage from './pages/LandingPage'
import Dashboard from './pages/Dashboard'
import TopBar from './components/TopBar'
import LeftSidebar from './components/LeftSidebar'
import RightSidebar from './components/RightSidebar'
import FloatingHelpButton from './components/FloatingHelpButton'
import './App.css'

function App() {
  const [currentPage, setCurrentPage] = useState('landing')
  const [darkMode, setDarkMode] = useState(true)
  const [refreshTrigger, setRefreshTrigger] = useState(0)

  const handlePredictionMade = () => {
    setRefreshTrigger(prev => prev + 1)
  }

  return (
    <div className={darkMode ? 'dark' : ''}>
      <div className={`min-h-screen transition-colors ${
        darkMode 
          ? 'bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950' 
          : 'bg-gradient-to-br from-gray-50 to-gray-100'
      }`}>
        
        {/* Fixed Top Navigation */}
        <TopBar darkMode={darkMode} setDarkMode={setDarkMode} setCurrentPage={setCurrentPage} />

        {/* Main 3-Column Layout */}
        <div className="pt-20 max-w-screen-2xl mx-auto flex flex-col lg:flex-row relative">
          
          {/* Left Sidebar (Utilities & History) */}
          {currentPage === 'dashboard' && (
            <LeftSidebar darkMode={darkMode} refreshTrigger={refreshTrigger} />
          )}

          {/* Center Main Dashboard Content */}
          <main className="flex-1 w-full max-w-full overflow-x-hidden min-h-[calc(100vh-80px)]">
            {currentPage === 'landing' ? (
              <LandingPage onNavigate={() => setCurrentPage('dashboard')} darkMode={darkMode} />
            ) : (
              <Dashboard darkMode={darkMode} onPredictionMade={handlePredictionMade} />
            )}
          </main>

          {/* Right Sidebar (How To Use Guide) */}
          {currentPage === 'dashboard' && (
            <RightSidebar darkMode={darkMode} />
          )}

        </div>

        {/* Global Support / Help Button */}
        <FloatingHelpButton darkMode={darkMode} />

      </div>
    </div>
  )
}

export default App
