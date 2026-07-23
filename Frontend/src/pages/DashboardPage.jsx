import { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
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
  'history': AnalysisHistory,
  'learning': LearningSkills,
  'jobs': JobBoard,
}

const DashboardPage = () => {
  const [searchParams] = useSearchParams()
  const sectionParam = searchParams.get('section')
  const [activeSection, setActiveSection] = useState(sectionParam && sections[sectionParam] ? sectionParam : 'overview')

  useEffect(() => {
    if (sectionParam && sections[sectionParam]) {
      setActiveSection(sectionParam)
    } else {
      setActiveSection('overview')
    }
  }, [sectionParam])

  const ActiveComponent = sections[activeSection]

  return (
    <div className="flex h-screen bg-[#f8fafc] overflow-hidden">
      <Sidebar activeSection={activeSection} onSectionChange={setActiveSection} />

      <main className="flex-1 overflow-y-auto">
        <div className="p-4 sm:p-6 max-w-7xl mx-auto">
          <motion.div
            key={activeSection}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
          >
            <ActiveComponent onNavigate={setActiveSection} />
          </motion.div>
        </div>
      </main>
    </div>
  )
}

export default DashboardPage
