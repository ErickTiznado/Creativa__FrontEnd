import React from 'react';
// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, X } from 'lucide-react';
import './ConfirmationModal.css';

const ConfirmationModal = ({ isOpen, onClose, onConfirm, title, message, isLoading }) => {
    return (
        <AnimatePresence>
            {isOpen && (
                <div className="confirmation-modal-overlay" onClick={onClose}>
                    <motion.div
                        className="confirmation-modal-content"
                        onClick={(e) => e.stopPropagation()}
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        transition={{ duration: 0.2 }}
                    >
                        <button className="confirmation-modal-close" onClick={onClose}>
                            <X size={20} />
                        </button>
                        
                        <div className="confirmation-modal-header">
                            <div className="confirmation-modal-icon">
                                <AlertTriangle size={32} color="#ef4444" />
                            </div>
                            <h3>{title}</h3>
                        </div>
                        
                        <div className="confirmation-modal-body">
                            <p>{message}</p>
                        </div>
                        
                        <div className="confirmation-modal-footer">
                            <button className="btn-cancel" onClick={onClose} disabled={isLoading}>
                                Cancelar
                            </button>
                            <button 
                                className="btn-confirm" 
                                onClick={onConfirm} 
                                disabled={isLoading}
                            >
                                {isLoading ? 'Eliminando...' : 'Eliminar'}
                            </button>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};

export default ConfirmationModal;
