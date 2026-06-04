import { motion } from 'framer-motion';

export default function PageWrapper({ children }) {
  return (
    <motion.main
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
      className="min-h-screen pt-16 pb-16 md:pb-0"
    >
      {children}
    </motion.main>
  );
}
