// eslint-disable-next-line no-unused-vars
import { motion } from 'framer-motion';
import { Image as ImageIcon } from 'lucide-react';

export default function ScanningPlaceholder({ width = '100%', height = '100%', text = 'Construyendo imagen...' }) {
    return (
        <div style={{
            position: 'relative',
            width: width,
            height: height,
            backgroundColor: 'rgba(0, 0, 0, 0.3)',
            borderRadius: '8px',
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            border: '1px solid var(--color-border)',
        }}>
             {/* Background Pulse */}
            <motion.div
                style={{
                    position: 'absolute',
                    inset: 0,
                    background: 'linear-gradient(45deg, rgba(255,255,255,0.02) 25%, transparent 25%, transparent 50%, rgba(255,255,255,0.02) 50%, rgba(255,255,255,0.02) 75%, transparent 75%, transparent)',
                    backgroundSize: '20px 20px'
                }}
                animate={{
                    backgroundPosition: ['0px 0px', '40px 40px']
                }}
                transition={{
                    repeat: Infinity,
                    duration: 2,
                    ease: "linear"
                }}
            />

            {/* Scanning Line */}
            <motion.div
                style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    height: '4px',
                    background: 'linear-gradient(90deg, transparent, var(--color-primary), transparent)',
                    boxShadow: '0 0 15px var(--color-primary)',
                    zIndex: 10
                }}
                animate={{
                    top: ['0%', '100%']
                }}
                transition={{
                    repeat: Infinity,
                    duration: 2.5,
                    ease: "easeInOut"
                }}
            />

            {/* Content Fading In/Out or Pulsing */}
            <motion.div
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 2, repeat: Infinity }}
                style={{ zIndex: 5, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10 }}
            >
                <ImageIcon size={48} style={{ color: 'var(--color-primary)', opacity: 0.5 }} />
                <span style={{ 
                    fontSize: '0.9rem', 
                    color: 'var(--color-text-secondary)',
                    letterSpacing: '0.05em',
                    textTransform: 'uppercase'
                }}>
                    {text}
                </span>
            </motion.div>
        </div>
    );
}
