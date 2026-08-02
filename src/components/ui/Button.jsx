export function Button({ children, variant = 'primary', size = 'md', className = '', ...props }) {
  const baseStyles = 'rounded font-semibold transition focus:outline-none focus:ring-2 focus:ring-offset-2';
  
  const variants = {
    primary: 'bg-signal text-white hover:bg-signal-600 focus:ring-signal',
    secondary: 'bg-ink-600 text-white hover:bg-ink-700 focus:ring-ink-600',
    outline: 'border-2 border-ink-600 text-ink hover:bg-ink-50 focus:ring-ink-600',
    ghost: 'text-ink hover:bg-ink-100 focus:ring-ink-600',
  };
  
  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg',
  };
  
  return (
    <button
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
