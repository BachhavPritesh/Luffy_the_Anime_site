export default function Badge({ children, variant = 'default', className = '' }) {
  const variants = {
    default: 'bg-luffy-surface2 text-luffy-text',
    red: 'bg-luffy-red/20 text-luffy-red',
    gold: 'bg-luffy-gold/20 text-luffy-gold',
    teal: 'bg-luffy-teal/20 text-luffy-teal',
  };

  return (
    <span className={`inline-flex items-center px-2 py-0.5 text-xs font-medium rounded ${variants[variant]} ${className}`}>
      {children}
    </span>
  );
}
