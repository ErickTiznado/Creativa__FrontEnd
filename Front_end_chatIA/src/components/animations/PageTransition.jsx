// eslint-disable-next-line no-unused-vars
import { motion } from 'framer-motion';

const pageVariants = {
  initial: {
    opacity: 0,
  },
  enter: {
    opacity: 1,
    transition: {
      duration: 0.4,
      ease: [0.43, 0.13, 0.23, 0.96] // Custom smooth easing
    }
  },
  exit: {
    opacity: 0,
    transition: {
      duration: 0.3,
      ease: [0.43, 0.13, 0.23, 0.96]
    }
  }
};

export default function PageTransition({ children, className = '' }) {
  return (
    <motion.div
      initial="initial"
      animate="enter"
      exit="exit"
      variants={pageVariants}
      className={`w-full h-full ${className}`}
    >
      {children}
    </motion.div>
  );
}
