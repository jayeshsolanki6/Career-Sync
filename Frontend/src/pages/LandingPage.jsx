import { motion } from 'framer-motion'
import Navbar from '../components/landing/Navbar'
import Hero from '../components/landing/Hero'
import Features from '../components/landing/Features'
import Footer from '../components/landing/Footer'

const LandingPage = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="min-h-screen bg-surface-alt"
    >
      <Navbar />
      <main className="pt-16">
        <Hero />
        <Features />
      </main>
      <Footer />
    </motion.div>
  )
}

export default LandingPage
