import { motion } from 'framer-motion';

const variants = {
  primary: 'bg-luffy-red text-white hover:shadow-glow-red',
  ghost: 'bg-transparent border border-white/10 text-luffy-text hover:bg-white/5',
  gold: 'bg-luffy-gold text-black hover:shadow-glow-gold',
};

const sizes = {
  sm: 'px-3 py-1.5 text-sm',
  md: 'px-5 py-2.5 text-base',
  lg: 'px-8 py-3.5 text-lg',
};

export default function Button({ children, variant = 'primary', size = 'md', className = '', disabled, onClick, type = 'button' }) {
  return (
    <motion.button
      type={type}
      whileHover={{ scale: disabled ? 1 : 1.03 }}
      whileTap={{ scale: disabled ? 1 : 0.97 }}
      className={`inline-flex items-center justify-center rounded font-body font-medium transition-all duration-200 ${variants[variant]} ${sizes[size]} ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'} ${className}`}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </motion.button>
  );
}
