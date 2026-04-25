import { useState } from 'react'
import { motion } from 'framer-motion'
import Sidebar from '../components/dashboard/Sidebar'
import Overview from '../components/dashboard/Overview'
import NewAnalysis from '../components/dashboard/NewAnalysis'
import AnalysisHistory from '../components/dashboard/AnalysisHistory'
import LearningSkills from '../components/dashboard/LearningSkills'
import JobBoard from '../components/dashboard/JobBoard'

const sections = {
  'overview': Overview,
  'new-analysis': NewAnalysis,
  'learning': LearningSkills,
  'history': AnalysisHistory,
  'jobs': JobBoard,
}

const DashboardPage = () => {
  const [activeSection, setActiveSection] = useState('overview')

  const ActiveComponent = sections[activeSection]

  return (
    <div className="flex h-screen bg-surface-alt overflow-hidden">
      <Sidebar activeSection={activeSection} onSectionChange={setActiveSection} />

      <main className="flex-1 overflow-y-auto">
        <div className="p-6 lg:p-10">
          <motion.div
            key={activeSection}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25 }}
          >
            <ActiveComponent onNavigate={setActiveSection} />
          </motion.div>
        </div>
      </main>
    </div>
  )
}

export default DashboardPage
