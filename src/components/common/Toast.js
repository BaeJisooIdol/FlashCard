import React, { useState, useEffect } from 'react';
import { Toast as BootstrapToast } from 'react-bootstrap';
import { FaCheckCircle, FaExclamationTriangle, FaInfoCircle, FaTimesCircle } from 'react-icons/fa';

const Toast = ({ show, onClose, variant, message, delay = 3000 }) => {
    const [visible, setVisible] = useState(show);

    useEffect(() => {
        setVisible(show);
    }, [show]);

    useEffect(() => {
        if (visible) {
            const timer = setTimeout(() => {
                setVisible(false);
                onClose();
            }, delay);

            return () => clearTimeout(timer);
        }
    }, [visible, delay, onClose]);

    // Define icons and backgrounds based on variant
    const getToastProps = () => {
        switch (variant) {
            case 'success':
                return {
                    icon: <FaCheckCircle className="me-2" />,
                    bg: 'success',
                    text: 'white'
                };
            case 'danger':
            case 'error':
                return {
                    icon: <FaTimesCircle className="me-2" />,
                    bg: 'danger',
                    text: 'white'
                };
            case 'warning':
                return {
                    icon: <FaExclamationTriangle className="me-2" />,
                    bg: 'warning',
                    text: 'dark'
                };
            case 'info':
            default:
                return {
                    icon: <FaInfoCircle className="me-2" />,
                    bg: 'info',
                    text: 'white'
                };
        }
    };

    const { icon, bg, text } = getToastProps();

    const handleClose = () => {
        setVisible(false);
        onClose();
    };

    return (
        <BootstrapToast
            show={visible}
            onClose={handleClose}
            className="mb-3"
            bg={bg}
            text={text}
            animation={true}
            autohide={false}
        >
            <BootstrapToast.Header closeButton closeVariant={text === 'white' ? 'white' : undefined}>
                <strong className="me-auto d-flex align-items-center">
                    {icon} Notification
                </strong>
            </BootstrapToast.Header>
            <BootstrapToast.Body>{message}</BootstrapToast.Body>
        </BootstrapToast>
    );
};

export default Toast; 