import { motion } from 'framer-motion'
import { FileSearch, Target, BookOpen, ArrowUpRight } from 'lucide-react'

const features = [
  {
    icon: FileSearch,
    title: 'Smart Resume Analysis',
    description:
      'Upload your resume and job description. Our AI extracts structured data and identifies exactly where you stand.',
    color: 'primary',
    step: '01',
  },
  {
    icon: Target,
    title: 'Skill Gap Detection',
    description:
      'Get a detailed breakdown of matching skills, missing skills, and a weighted match score with actionable insights.',
    color: 'accent',
    step: '02',
  },
  {
    icon: BookOpen,
    title: 'Personalized Learning',
    description:
      'Receive curated learning recommendations and a tailored action plan to acquire the exact skills you need.',
    color: 'primary',
    step: '03',
  },
]

const colorMap = {
  primary: {
    bg: 'bg-primary-50',
    icon: 'text-primary-600',
    border: 'border-primary-100',
    hoverBorder: 'hover:border-primary-300',
    shadow: 'hover:shadow-primary-100',
    step: 'text-primary-200',
  },
  accent: {
    bg: 'bg-accent-50',
    icon: 'text-accent-600',
    border: 'border-accent-100',
    hoverBorder: 'hover:border-accent-300',
    shadow: 'hover:shadow-accent-100',
    step: 'text-accent-200',
  },
}

const Features = () => {
  return (
    <section id="features" className="py-24 bg-white relative">
      {/* Subtle top divider line */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-24 h-px bg-gradient-to-r from-transparent via-primary-300 to-transparent" />

      <div className="max-w-6xl mx-auto px-6">
        {/* Section Header */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary-50 border border-primary-100 text-primary-600 text-xs font-semibold uppercase tracking-wider mb-4">
            How It Works
          </span>
          <h2 className="mt-3 text-3xl sm:text-4xl font-bold text-text-primary tracking-tight">
            Everything you need to land your next role
          </h2>
          <p className="mt-4 max-w-xl mx-auto text-text-secondary text-lg">
            From analysis to action — our AI suite covers the complete journey from resume to job offer.
          </p>
        </motion.div>

        {/* Feature Cards */}
        <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
          {features.map((feature, index) => {
            const colors = colorMap[feature.color]
            return (
              <motion.div
                key={feature.title}
                className={`group relative p-8 rounded-2xl bg-white border ${colors.border} ${colors.hoverBorder} ${colors.shadow} hover:shadow-xl transition-all duration-300 cursor-default overflow-hidden`}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.15 }}
              >
                {/* Step number watermark */}
                <span className={`absolute -top-2 -right-2 text-7xl font-black ${colors.step} select-none pointer-events-none opacity-60`}>
                  {feature.step}
                </span>

                <div className={`relative inline-flex items-center justify-center w-12 h-12 rounded-xl ${colors.bg} ${colors.icon} mb-5 group-hover:scale-110 transition-transform duration-300`}>
                  <feature.icon size={24} strokeWidth={2} />
                </div>
                <h3 className="relative text-lg font-semibold text-text-primary mb-2 flex items-center gap-2">
                  {feature.title}
                  <ArrowUpRight size={14} className="text-text-muted opacity-0 group-hover:opacity-60 transition-opacity" />
                </h3>
                <p className="relative text-text-secondary text-sm leading-relaxed">{feature.description}</p>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

export default Features
