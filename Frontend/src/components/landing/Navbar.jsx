import { useNavigate } from 'react-router-dom'
import Logo from '../common/Logo'
import Button from '../common/Button'

const Navbar = () => {
  const navigate = useNavigate()

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-lg border-b border-border/50">
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        <Logo />
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="sm" onClick={() => navigate('/auth')}>
            Log in
          </Button>
          <Button size="sm" onClick={() => navigate('/auth?mode=signup')}>
            Sign up
          </Button>
        </div>
      </div>
    </nav>
  )
}

export default Navbar
