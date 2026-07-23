import { FileSearch, Target, BookOpen, ArrowUpRight, Zap, ShieldCheck } from 'lucide-react'
import { motion } from 'framer-motion'

const features = [
  {
    icon: FileSearch,
    title: 'Smart Resume Analysis',
    description:
      'Upload your resume and job description. Our AI parses work history, technical stacks, and experience depth in seconds.',
    badgeText: '01 / Parsing Engine',
    uiFragment: (
      <div className="bg-[#f8fafc] rounded-lg p-3 text-[#0f172a] text-xs font-mono border border-[#e2e8f0] mt-4 space-y-1.5">
        <div className="flex items-center justify-between text-[11px] text-[#64748b]">
          <span>resume_parse_v2.json</span>
          <span className="text-[#10b981] font-medium">100% Extracted</span>
        </div>
        <div className="flex gap-1.5 flex-wrap pt-1 font-sans">
          <span className="px-2 py-0.5 rounded bg-white border border-[#e2e8f0] text-[11px] font-medium">React (5 yrs)</span>
          <span className="px-2 py-0.5 rounded bg-white border border-[#e2e8f0] text-[11px] font-medium">Node.js (4 yrs)</span>
          <span className="px-2 py-0.5 rounded bg-white border border-[#e2e8f0] text-[11px] font-medium">AWS (2 yrs)</span>
        </div>
      </div>
    )
  },
  {
    icon: Target,
    title: 'Skill Gap Detection',
    description:
      'Get a weighted breakdown of matching skills vs missing requirements, with deep contextual relevance scoring.',
    badgeText: '02 / Diagnostic Matrix',
    uiFragment: (
      <div className="bg-[#f8fafc] rounded-lg p-3 text-[#0f172a] text-xs font-sans border border-[#e2e8f0] mt-4 space-y-2">
        <div className="flex justify-between items-center">
          <span className="font-medium text-xs text-[#0f172a]">Role Requirements Sync</span>
          <span className="text-[#10b981] font-bold">88% Match</span>
        </div>
        <div className="w-full bg-[#e2e8f0] h-1.5 rounded-full overflow-hidden">
          <div className="bg-[#0f172a] h-full rounded-full w-[88%]" />
        </div>
        <div className="flex justify-between text-[11px] text-[#64748b] pt-0.5">
          <span>14 Matched</span>
          <span className="text-[#d97706] font-medium">2 Actionable Gaps</span>
        </div>
      </div>
    )
  },
  {
    icon: BookOpen,
    title: 'Personalized Learning Path',
    description:
      'Receive tailored learning modules, targeted interview prep, and actionable projects to close your gaps fast.',
    badgeText: '03 / Growth Roadmap',
    uiFragment: (
      <div className="bg-[#f8fafc] rounded-lg p-3 text-[#0f172a] text-xs font-sans border border-[#e2e8f0] mt-4 space-y-2">
        <div className="flex items-center gap-2 font-medium text-[#0f172a]">
          <Zap size={14} className="text-[#10b981]" /> Curated Action Item
        </div>
        <p className="text-[11px] text-[#475569] leading-relaxed">
          System Design: Microservices Event Sourcing pattern hands-on lab (2 hrs).
        </p>
      </div>
    )
  },
]

const Features = () => {
  return (
    <section id="features" className="py-20 bg-white relative border-t border-[#e2e8f0]">
      <div className="max-w-6xl mx-auto px-6">
        
        {/* Section Header */}
        <motion.div
          className="text-center mb-14 space-y-3"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4 }}
        >
          <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#f8fafc] border border-[#e2e8f0] text-[#0f172a] text-xs font-semibold uppercase tracking-wider">
            Diagnostic Process
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold text-[#0f172a] tracking-tight font-display">
            How CareerSync powers your job search
          </h2>
          <p className="max-w-xl mx-auto text-[#475569] text-base leading-relaxed font-normal">
            From resume upload to career offer — structured AI intelligence for every milestone.
          </p>
        </motion.div>

        {/* Minimal Executive Cards Grid */}
        <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              className="bg-white border border-[#e2e8f0] rounded-xl p-6 shadow-xs hover:shadow-md hover:border-[#cbd5e1] transition-all duration-300 flex flex-col justify-between"
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.12 }}
            >
              <div>
                {/* Top Badge & Icon */}
                <div className="flex items-center justify-between mb-5">
                  <span className="px-2.5 py-0.5 rounded-full text-[11px] font-mono font-medium bg-[#f8fafc] border border-[#e2e8f0] text-[#64748b]">
                    {feature.badgeText}
                  </span>
                  <div className="w-8 h-8 rounded-lg bg-[#f8fafc] border border-[#e2e8f0] flex items-center justify-center text-[#0f172a]">
                    <feature.icon size={18} />
                  </div>
                </div>

                {/* Card Title & Description */}
                <h3 className="text-lg font-bold text-[#0f172a] mb-2 font-display">
                  {feature.title}
                </h3>
                <p className="text-sm leading-relaxed text-[#475569] font-normal">
                  {feature.description}
                </p>
              </div>

              {/* Embedded UI Fragment */}
              {feature.uiFragment}
            </motion.div>
          ))}
        </div>

        {/* Pre-Footer Band */}
        <motion.div
          className="mt-16 bg-[#f8fafc] border border-[#e2e8f0] rounded-xl p-8 md:p-10 flex flex-col md:flex-row items-center justify-between gap-6"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4 }}
        >
          <div className="space-y-1.5 text-center md:text-left">
            <h3 className="text-xl sm:text-2xl font-bold text-[#0f172a] font-display">
              Ready to transform your career trajectory?
            </h3>
            <p className="text-sm text-[#475569] max-w-md font-normal">
              Analyze your gap profile and accelerate your dream job offer with precision.
            </p>
          </div>
          <button
            onClick={() => window.location.href = '/auth?mode=signup'}
            className="bg-[#0f172a] hover:bg-[#1e293b] text-white font-medium px-6 py-3 rounded-lg text-sm transition-all whitespace-nowrap cursor-pointer active:scale-95"
          >
            Get Started Free
          </button>
        </motion.div>

      </div>
    </section>
  )
}

export default Features
