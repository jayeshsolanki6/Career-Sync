import Logo from '../common/Logo'

const Footer = () => {
  return (
    <footer className="border-t border-border bg-white">
      <div className="max-w-6xl mx-auto px-6 py-8 flex flex-col sm:flex-row items-center justify-between gap-4">
        <Logo size="sm" />
        <p className="text-sm text-text-muted">
          © {new Date().getFullYear()} CareerSync. Built with intelligence.
        </p>
      </div>
    </footer>
  )
}

export default Footer
