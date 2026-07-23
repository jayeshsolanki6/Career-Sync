const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  disabled = false,
  loading = false,
  icon: Icon,
  onClick,
  type = 'button',
  className = '',
  ...props
}) => {
  const baseStyles =
    'inline-flex items-center justify-center font-medium rounded-lg transition-all duration-200 cursor-pointer focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-[#0f172a] disabled:opacity-50 disabled:cursor-not-allowed'

  const variants = {
    primary:
      'bg-[#0f172a] text-white hover:bg-[#1e293b] shadow-xs active:scale-[0.98]',
    secondary:
      'bg-white text-[#0f172a] border border-[#e2e8f0] hover:bg-[#f8fafc] hover:border-[#cbd5e1] active:scale-[0.98]',
    ghost:
      'bg-transparent text-[#475569] hover:text-[#0f172a] hover:bg-[#f8fafc]',
    danger:
      'bg-red-600 text-white hover:bg-red-700 active:scale-[0.98]',
  }

  const sizes = {
    sm: 'px-3.5 h-9 text-xs gap-1.5',
    md: 'px-5 h-11 text-sm gap-2',
    lg: 'px-7 h-12 text-base gap-2.5',
  }

  return (
    <button
      type={type}
      disabled={disabled || loading}
      onClick={onClick}
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${fullWidth ? 'w-full' : ''} ${className}`}
      {...props}
    >
      {loading ? (
        <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
      ) : Icon ? (
        <Icon size={size === 'sm' ? 14 : size === 'lg' ? 20 : 16} />
      ) : null}
      {children}
    </button>
  )
}

export default Button
