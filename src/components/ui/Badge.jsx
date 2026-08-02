export function Badge({ children, variant = 'default', className = '', ...props }) {
  const variants = {
    default: 'bg-ink-100 text-ink',
    success: 'bg-moss-100 text-moss',
    warning: 'bg-brass-100 text-brass',
    error: 'bg-alert-100 text-alert',
  };
  
  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </span>
  );
}
