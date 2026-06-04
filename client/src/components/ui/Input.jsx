export default function Input({ label, icon: Icon, error, className = '', ...props }) {
  return (
    <div className="space-y-1.5">
      {label && (
        <label className="block text-sm text-luffy-muted font-medium">{label}</label>
      )}
      <div className="relative">
        {Icon && (
          <Icon className="absolute left-3 top-1/2 -translate-y-1/2 text-luffy-faint w-5 h-5" />
        )}
        <input
          className={`w-full bg-luffy-surface border border-white/5 rounded px-4 py-2.5 text-luffy-text placeholder:text-luffy-faint focus:outline-none focus:border-luffy-red/50 focus:ring-1 focus:ring-luffy-red/20 transition-all duration-200 ${Icon ? 'pl-10' : ''} ${error ? 'border-luffy-red' : ''} ${className}`}
          {...props}
        />
      </div>
      {error && <p className="text-xs text-luffy-red mt-1">{error}</p>}
    </div>
  );
}
