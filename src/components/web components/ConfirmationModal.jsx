/**
 * ConfirmationModal.jsx - A generic modal component for user confirmations.
 */
import React from 'react';
import './ConfirmationModal.css';

/**
 * @function ConfirmationModal
 * @summary Displays a modal with a title, message, and customizable confirm/cancel actions.
 */
const ConfirmationModal = ({ title, message, onConfirm, onCancel, confirmText = 'Bevestigen', cancelText = 'Annuleren', showConfirmButton = true, customFooter = null }) => {
    return (
        <div className="modal-overlay">
            <div className="confirmation-modal-content">
                <h2>{title}</h2>
                {message && <p>{message}</p>}
                {customFooter ? customFooter : (
                    <div className="modal-actions">
                        <button onClick={onCancel} className="btn btn--secondary">{cancelText}</button>
                        {showConfirmButton && <button onClick={onConfirm} className="btn btn--danger">{confirmText}</button>}
                    </div>
                )}
            </div>
        </div>
    );
};

export default ConfirmationModal;
