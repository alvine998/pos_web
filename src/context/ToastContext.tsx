import React, { createContext, useContext, useState, type ReactNode, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, AlertTriangle, XCircle, Info, X } from 'lucide-react';

type ToastType = 'success' | 'error' | 'warning' | 'info';

interface ToastMessage {
    id: string;
    message: string;
    type: ToastType;
}

interface ToastContextType {
    showToast: (message: string, type: ToastType) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const ToastProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [toasts, setToasts] = useState<ToastMessage[]>([]);

    const showToast = (message: string, type: ToastType) => {
        const id = Math.random().toString(36).substr(2, 9);
        setToasts(prev => [...prev, { id, message, type }]);
    };

    const removeToast = (id: string) => {
        setToasts(prev => prev.filter(t => t.id !== id));
    };

    return (
        <ToastContext.Provider value={{ showToast }}>
            {children}
            <div style={{ position: 'fixed', bottom: '24px', right: '24px', zIndex: 9999, display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <AnimatePresence>
                    {toasts.map(toast => (
                        <ToastItem key={toast.id} toast={toast} onRemove={removeToast} />
                    ))}
                </AnimatePresence>
            </div>
        </ToastContext.Provider>
    );
};

const ToastItem: React.FC<{ toast: ToastMessage; onRemove: (id: string) => void }> = ({ toast, onRemove }) => {
    useEffect(() => {
        const timer = setTimeout(() => onRemove(toast.id), 5000);
        return () => clearTimeout(timer);
    }, []);

    const config = {
        success: { icon: CheckCircle, color: '#10b981', bg: '#ecfdf5', border: '#d1fae5' },
        error: { icon: XCircle, color: '#ef4444', bg: '#fef2f2', border: '#fee2e2' },
        warning: { icon: AlertTriangle, color: '#f59e0b', bg: '#fffbeb', border: '#fef3c7' },
        info: { icon: Info, color: '#3b82f6', bg: '#eff6ff', border: '#dbeafe' },
    }[toast.type];

    return (
        <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
            style={{
                background: config.bg,
                border: `1px solid ${config.border}`,
                padding: '16px 20px',
                borderRadius: '16px',
                boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                minWidth: '300px',
                maxWidth: '450px'
            }}
        >
            <div style={{ color: config.color }}>
                <config.icon size={20} />
            </div>
            <p style={{ flex: 1, color: '#1e293b', fontSize: '0.925rem', fontWeight: '500', margin: 0 }}>{toast.message}</p>
            <button
                onClick={() => onRemove(toast.id)}
                style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', padding: '4px' }}
            >
                <X size={16} />
            </button>
        </motion.div>
    );
};

export const useToast = () => {
    const context = useContext(ToastContext);
    if (!context) throw new Error('useToast must be used within ToastProvider');
    return context;
};
