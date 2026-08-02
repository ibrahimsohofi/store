export function Input({ className = '', error, ...props }) {
  return (
    <input
      className={`w-full px-4 py-2 border rounded bg-white text-ink placeholder-ink-400 focus:outline-none focus:ring-2 focus:ring-signal focus:border-transparent ${
        error ? 'border-alert' : 'border-ink-300'
      } ${className}`}
      {...props}
    />
  );
}

export function Label({ children, className = '', ...props }) {
  return (
    <label className={`block text-sm font-medium text-ink mb-1 ${className}`} {...props}>
      {children}
    </label>
  );
}
