import React from 'react';
import { Modal, Button } from 'react-bootstrap';
import { FaExclamationTriangle, FaTrash, FaTimes } from 'react-icons/fa';

const DeleteConfirmationModal = ({
    show,
    onHide,
    onConfirm,
    itemName,
    title = "Confirm Deletion",
    message,
    confirmButtonText = "Delete",
    confirmButtonVariant = "danger"
}) => {
    return (
        <Modal show={show} onHide={onHide} centered backdrop="static">
            <Modal.Header closeButton>
                <Modal.Title className="text-danger d-flex align-items-center">
                    <FaExclamationTriangle className="me-2" /> {title}
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {message ? (
                    <p>{message}</p>
                ) : (
                    <p>Are you sure you want to delete this {itemName || 'item'}?</p>
                )}
                <p className="text-danger"><strong>This action cannot be undone.</strong></p>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={onHide}>
                    <FaTimes className="me-1" /> Cancel
                </Button>
                <Button variant={confirmButtonVariant} onClick={onConfirm}>
                    <FaTrash className="me-1" /> {confirmButtonText}
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default DeleteConfirmationModal; 