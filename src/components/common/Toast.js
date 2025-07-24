import React, { useState, useEffect } from 'react';
import { Toast as BootstrapToast } from 'react-bootstrap';
import { FaCheckCircle, FaExclamationTriangle, FaInfoCircle } from 'react-icons/fa';
import './Toast.css'; // We'll create this CSS file for animations
import { MdOutlineError } from 'react-icons/md';

const Toast = ({ show, onClose, variant, message, delay = 3000 }) => {
    const [visible, setVisible] = useState(show);
    const [animationState, setAnimationState] = useState('toast-enter');

    useEffect(() => {
        if (show) {
            setVisible(true);
            setAnimationState('toast-enter');
            // Start exit animation before the toast is removed
            const exitTimer = setTimeout(() => {
                setAnimationState('toast-exit');
            }, delay - 500); // Start exit animation 500ms before closing

            // Close the toast after the delay
            const closeTimer = setTimeout(() => {
                setVisible(false);
                onClose();
            }, delay);

            return () => {
                clearTimeout(exitTimer);
                clearTimeout(closeTimer);
            };
        }
    }, [show, delay, onClose]);

    // Define icons and backgrounds based on variant
    const getToastProps = () => {
        switch (variant) {
            case 'success':
                return {
                    icon: <FaCheckCircle className="me-2" />,
                    headerClass: 'toast-header-success',
                    bodyClass: 'toast-body-success',
                    text: 'white'
                };
            case 'danger':
            case 'error':
                return {
                    icon: <MdOutlineError className="me-2" />,
                    headerClass: 'toast-header-danger',
                    bodyClass: 'toast-body-danger',
                    text: 'white'
                };
            case 'warning':
                return {
                    icon: <FaExclamationTriangle className="me-2" />,
                    headerClass: 'toast-header-warning',
                    bodyClass: 'toast-body-warning',
                    text: 'dark'
                };
            case 'info':
            default:
                return {
                    icon: <FaInfoCircle className="me-2" />,
                    headerClass: 'toast-header-info',
                    bodyClass: 'toast-body-info',
                    text: 'white'
                };
        }
    };

    const { icon, headerClass, bodyClass, text } = getToastProps();

    const handleClose = () => {
        setAnimationState('toast-exit');
        // Wait for animation to complete before actually closing
        setTimeout(() => {
            setVisible(false);
            onClose();
        }, 300);
    };

    if (!visible) return null;

    return (
        <div className={`custom-toast-wrapper ${animationState}`}>
            <BootstrapToast
                show={true}
                onClose={handleClose}
                className={`mb-3 custom-toast`}
                animation={true}
                autohide={false}
            >
                <BootstrapToast.Header className={headerClass} closeButton closeVariant={text === 'white' ? 'white' : undefined}>
                    <strong className="me-auto d-flex align-items-center">
                        {icon} Notification
                    </strong>
                </BootstrapToast.Header>
                <BootstrapToast.Body className={bodyClass}>{message}</BootstrapToast.Body>
            </BootstrapToast>
        </div>
    );
};

export default Toast; 