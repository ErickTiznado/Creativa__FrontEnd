// eslint-disable-next-line no-unused-vars
import { motion } from 'framer-motion';

export default function FadeIn({ 
  children, 
  delay = 0, 
  duration = 0.5, 
  direction = 'up', 
  className = '' 
}) {
  const variants = {
    hidden: {
      opacity: 0,
      y: direction === 'up' ? 20 : direction === 'down' ? -20 : 0,
      x: direction === 'left' ? 20 : direction === 'right' ? -20 : 0,
    },
    visible: {
      opacity: 1,
      y: 0,
      x: 0,
      transition: {
        duration: duration,
        delay: delay,
        ease: "easeOut"
      }
    }
  };

  return (
    <motion.div
      variants={variants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-50px" }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
