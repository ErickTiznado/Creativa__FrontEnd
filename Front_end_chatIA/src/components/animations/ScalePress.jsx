// eslint-disable-next-line no-unused-vars
import { motion } from 'framer-motion';

export default function ScalePress({ children, className = '', onClick }) {
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      transition={{ type: "spring", stiffness: 400, damping: 17 }}
      className={`cursor-pointer ${className}`}
      onClick={onClick}
    >
      {children}
    </motion.div>
  );
}
