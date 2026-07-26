import { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import Sidebar from '../components/dashboard/Sidebar'
import Overview from '../components/dashboard/Overview'
import NewAnalysis from '../components/analysis/NewAnalysis'
import AnalysisHistory from '../components/history/AnalysisHistory'
import LearningSkills from '../components/learning/LearningSkills'
import JobBoard from '../components/jobs/JobBoard'

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
  const isFixedSection = activeSection === 'jobs' || activeSection === 'learning'

  return (
    <div className="flex h-screen bg-[#f8fafc] overflow-hidden">
      <Sidebar activeSection={activeSection} onSectionChange={setActiveSection} />

      <main className={`flex-1 flex flex-col ${isFixedSection ? 'overflow-hidden' : 'overflow-y-auto'}`}>
        <div className={`p-4 sm:p-6 max-w-7xl mx-auto w-full flex-1 flex flex-col ${isFixedSection ? 'overflow-hidden min-h-0' : ''}`}>
          <motion.div
            key={activeSection}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
            className={`flex-1 flex flex-col ${isFixedSection ? 'overflow-hidden min-h-0' : ''}`}
          >
            <ActiveComponent onNavigate={setActiveSection} />
          </motion.div>
        </div>
      </main>
    </div>
  )
}

export default DashboardPage
