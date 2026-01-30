// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";

export default function LoadingSpinner({ size = 40, color = "#3b82f6", text = "Cargando..." }) {
  return (
    <div className="flex flex-col items-center justify-center p-4 space-y-4">
      <motion.div
        style={{
          width: size,
          height: size,
          border: `3px solid #e5e7eb`, // gray-200
          borderTop: `3px solid ${color}`,
          borderRadius: "50%",
        }}
        animate={{ rotate: 360 }}
        transition={{
          duration: 1,
          repeat: Infinity,
          ease: "linear", // Smooth continuous rotation
        }}
      />
      {text && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="text-sm text-gray-500 font-medium"
        >
          {text}
        </motion.p>
      )}
    </div>
  );
}
