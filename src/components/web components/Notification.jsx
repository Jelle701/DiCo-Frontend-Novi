/**
 * Notification.jsx - A dismissible notification component.
 */
import React, { useEffect } from 'react';
import './Notification.css';

/**
 * @function Notification
 * @summary Displays a timed, dismissible notification message.
 */
const Notification = ({ message, type, onClose }) => {
    useEffect(() => {
        const timer = setTimeout(() => {
            onClose();
        }, 5000);

        return () => clearTimeout(timer);
    }, [onClose]);

    return (
        <div className={`notification ${type}`}>
            <p>{message}</p>
            <button onClick={onClose} className="close-btn">&times;</button>
        </div>
    );
};

export default Notification;
