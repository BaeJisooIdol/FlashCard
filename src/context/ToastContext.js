import React, { createContext, useState, useContext } from 'react';
import Toast from '../components/common/Toast';

export const ToastContext = createContext();

export const useToast = () => useContext(ToastContext);

export const ToastProvider = ({ children }) => {
    const [toasts, setToasts] = useState([]);

    const showToast = (message, variant = 'info', delay = 3000) => {
        const id = Date.now();
        setToasts(prev => [...prev, { id, message, variant, delay }]);
        return id;
    };

    const hideToast = (id) => {
        // Use a callback to ensure we're working with the latest state
        setToasts(prev => prev.filter(toast => toast.id !== id));
    };

    // Convenience methods
    const showSuccess = (message, delay = 3000) => showToast(message, 'success', delay);
    const showError = (message, delay = 3000) => showToast(message, 'danger', delay);
    const showWarning = (message, delay = 3000) => showToast(message, 'warning', delay);
    const showInfo = (message, delay = 3000) => showToast(message, 'info', delay);

    return (
        <ToastContext.Provider
            value={{
                showToast,
                hideToast,
                showSuccess,
                showError,
                showWarning,
                showInfo
            }}
        >
            {children}
            <div className="toast-container">
                {toasts.map(toast => (
                    <Toast
                        key={toast.id}
                        show={true}
                        onClose={() => hideToast(toast.id)}
                        message={toast.message}
                        variant={toast.variant}
                        delay={toast.delay}
                    />
                ))}
            </div>
        </ToastContext.Provider>
    );
};

export default ToastProvider; 