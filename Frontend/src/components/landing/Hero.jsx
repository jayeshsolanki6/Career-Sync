import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowRight, CheckCircle2, AlertCircle, Sparkles, Target, ShieldCheck } from 'lucide-react'
import Button from '../common/Button'

const sampleRoles = [
  {
    id: 'frontend',
    title: 'Senior Frontend Engineer',
    company: 'Vercel / Stripe',
    matchScore: 92,
    matchedSkills: ['React 19', 'TypeScript', 'Tailwind', 'Performance Optimization'],
    missingSkills: ['WebAssembly', 'System Architecture'],
    recommendedCourse: 'Advanced WebAssembly & Core Vitals Strategy'
  },
  {
    id: 'aiml',
    title: 'AI / LLM Platform Engineer',
    company: 'OpenAI / Anthropic',
    matchScore: 86,
    matchedSkills: ['Python', 'PyTorch', 'RAG Pipelines', 'Vector DBs'],
    missingSkills: ['CUDA Kernels', 'Distributed Inference'],
    recommendedCourse: 'Deep Learning Systems Scaling & GPU Optimization'
  },
  {
    id: 'product',
    title: 'Staff Product Architect',
    company: 'Linear / Figma',
    matchScore: 95,
    matchedSkills: ['Product Strategy', 'System Design', 'User Research', 'API Design'],
    missingSkills: ['Fintech Compliance'],
    recommendedCourse: 'Enterprise Regulatory Systems & Security'
  }
]

const Hero = () => {
  const navigate = useNavigate()
  const [selectedRole, setSelectedRole] = useState(sampleRoles[0])

  return (
    <section className="relative pt-20 pb-20 lg:pt-16 lg:pb-20 bg-white overflow-hidden">
      <div className="max-w-6xl mx-auto px-6">
        <div className="grid lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Left Column (7 cols): Hero Headlines & CTAs */}
          <div className="lg:col-span-7 space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
            >
              <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#f8fafc] border border-[#e2e8f0] text-[#0f172a] text-xs font-semibold uppercase tracking-wider">
                <span className="w-2 h-2 rounded-full bg-[#10b981]" />
                Career Intelligence Platform
              </span>
            </motion.div>

            <motion.h1
              className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-[#0f172a] leading-[1.1] tracking-tight font-display"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              Bridge your resume to your dream role with precision.
            </motion.h1>

            <motion.p
              className="text-base sm:text-lg text-[#475569] leading-relaxed max-w-xl font-normal"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              Upload your resume and job description. CareerSync extracts structured skill gaps, computes a precision match score, and generates a personalized learning roadmap.
            </motion.p>

            <motion.div
              className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-2"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <Button size="lg" icon={ArrowRight} onClick={() => navigate('/auth?mode=signup')}>
                Get Started Free
              </Button>
              <Button variant="secondary" size="lg" onClick={() => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })}>
                See How It Works
              </Button>
            </motion.div>

            {/* Quick Proof Badges */}
            <motion.div
              className="flex items-center gap-6 pt-2 text-xs font-medium text-[#64748b]"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              <span className="flex items-center gap-1.5">
                <CheckCircle2 size={15} className="text-[#10b981]" /> No credit card required
              </span>
              <span className="flex items-center gap-1.5">
                <ShieldCheck size={15} className="text-[#10b981]" /> Instant AI Gap Analysis
              </span>
            </motion.div>
          </div>

          {/* Right Column (5 cols): Minimal Executive Diagnostic Panel */}
          <div className="lg:col-span-5">
            <motion.div
              className="bg-white border border-[#e2e8f0] rounded-xl p-6 shadow-sm"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              {/* Panel Top Header */}
              <div className="flex items-center justify-between pb-4 border-b border-[#e2e8f0]">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-[#10b981]" />
                  <span className="text-xs font-bold uppercase tracking-wider text-[#0f172a]">
                    Diagnostic Engine Preview
                  </span>
                </div>
              </div>

              {/* Role Switcher Tabs */}
              <div className="flex gap-1.5 my-4 overflow-x-auto pb-1">
                {sampleRoles.map((role) => (
                  <button
                    key={role.id}
                    onClick={() => setSelectedRole(role)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all whitespace-nowrap cursor-pointer ${
                      selectedRole.id === role.id
                        ? 'bg-[#0f172a] text-white shadow-xs'
                        : 'bg-[#f8fafc] text-[#475569] border border-[#e2e8f0] hover:text-[#0f172a]'
                    }`}
                  >
                    {role.title.split(' ')[0]} {role.title.split(' ')[1]}
                  </button>
                ))}
              </div>

              {/* Diagnostic Content Payload */}
              <motion.div
                key={selectedRole.id}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.25 }}
                className="bg-[#f8fafc] border border-[#e2e8f0] rounded-lg p-4 space-y-4"
              >
                {/* Target Role & Score */}
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-semibold text-[#0f172a] text-sm font-display">
                      {selectedRole.title}
                    </h3>
                    <p className="text-xs text-[#64748b] mt-0.5">{selectedRole.company}</p>
                  </div>
                  <div className="text-right bg-white px-2.5 py-1 rounded-md border border-[#e2e8f0]">
                    <div className="text-lg font-bold text-[#0f172a] font-display">
                      {selectedRole.matchScore}%
                    </div>
                    <div className="text-[9px] uppercase font-bold text-[#10b981]">Match Score</div>
                  </div>
                </div>

                {/* Matched Skills */}
                <div>
                  <div className="text-xs font-medium text-[#0f172a] mb-1.5 flex items-center gap-1.5">
                    <CheckCircle2 size={13} className="text-[#10b981]" /> Matched Skills
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {selectedRole.matchedSkills.map((skill) => (
                      <span
                        key={skill}
                        className="px-2 py-0.5 rounded bg-white border border-[#e2e8f0] text-[#334155] text-[11px] font-medium"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Missing Skills */}
                <div>
                  <div className="text-xs font-medium text-[#0f172a] mb-1.5 flex items-center gap-1.5">
                    <AlertCircle size={13} className="text-[#d97706]" /> Identified Skill Gaps
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {selectedRole.missingSkills.map((skill) => (
                      <span
                        key={skill}
                        className="px-2 py-0.5 rounded bg-[#fffbe5] border border-[#fde68a] text-[#b45309] text-[11px] font-medium"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Recommended Roadmap */}
                <div className="pt-2 border-t border-[#e2e8f0]">
                  <div className="text-[10px] font-semibold text-[#64748b] uppercase tracking-wider mb-1">
                    Recommended Action
                  </div>
                  <p className="text-xs font-medium text-[#0f172a] bg-white p-2 rounded border border-[#e2e8f0]">
                    ⚡ {selectedRole.recommendedCourse}
                  </p>
                </div>
              </motion.div>
            </motion.div>
          </div>

        </div>
      </div>
    </section>
  )
}

export default Hero
