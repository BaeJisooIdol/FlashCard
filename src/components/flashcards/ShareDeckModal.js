import React, { useState, useEffect } from 'react';
import { Modal, Button, Form, ListGroup, Badge } from 'react-bootstrap';
import { FaShare, FaTrash, FaUserEdit, FaEye } from 'react-icons/fa';
import api from '../../services/api';
import { useToast } from '../../context/ToastContext';

const ShareDeckModal = ({ show, onHide, deck }) => {
    const [username, setUsername] = useState('');
    const [permissions, setPermissions] = useState('read');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [collaborators, setCollaborators] = useState([]);
    const [users, setUsers] = useState([]);
    const { showSuccess, showError } = useToast();

    // Fetch collaborators when modal opens
    useEffect(() => {
        if (show && deck) {
            fetchCollaborators();
            fetchUsers();
        }
    }, [show, deck]);

    const fetchCollaborators = async () => {
        try {
            setLoading(true);
            const data = await api.getCollaborators(deck.id);
            setCollaborators(data);
        } catch (error) {
            console.error('Error fetching collaborators:', error);
            showError('Failed to fetch collaborators');
        } finally {
            setLoading(false);
        }
    };

    const fetchUsers = async () => {
        try {
            // Here we're just getting all users for simplicity
            const response = await fetch('http://localhost:5000/users');
            const data = await response.json();
            setUsers(data);
        } catch (error) {
            console.error('Error fetching users:', error);
        }
    };

    const handleShare = async (e) => {
        e.preventDefault();

        if (!username.trim()) {
            setError('Please enter a username');
            return;
        }

        try {
            setLoading(true);
            setError('');

            // Find user by username
            const user = users.find(u => u.username === username);

            if (!user) {
                setError('User not found');
                return;
            }

            // Check if already shared
            const alreadyShared = collaborators.some(c => c.user.username === username);
            if (alreadyShared) {
                setError('Already shared with this user');
                return;
            }

            // Share the deck
            await api.shareDeck(deck.id, user.id, permissions);

            // Add collaborator
            await api.addCollaborator(deck.id, user.id, permissions === 'write' ? 'editor' : 'viewer');

            // Refresh collaborators list
            fetchCollaborators();

            showSuccess('Deck shared successfully');
            setUsername('');
        } catch (error) {
            console.error('Error sharing deck:', error);
            setError('Failed to share deck');
            showError('Failed to share deck');
        } finally {
            setLoading(false);
        }
    };

    const handleRemoveCollaborator = async (collaboratorId, userId) => {
        try {
            setLoading(true);

            // Here we're simulating by making a DELETE request
            await fetch(`http://localhost:5000/collaborators/${collaboratorId}`, {
                method: 'DELETE'
            });

            // Also remove from deckShares
            const shares = await fetch(`http://localhost:5000/deckShares?deckId=${deck.id}&sharedWithUserId=${userId}`).then(res => res.json());

            if (shares.length > 0) {
                await fetch(`http://localhost:5000/deckShares/${shares[0].id}`, {
                    method: 'DELETE'
                });
            }

            // Refresh collaborators list
            fetchCollaborators();

            showSuccess('Collaborator removed successfully');
        } catch (error) {
            console.error('Error removing collaborator:', error);
            showError('Failed to remove collaborator');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal show={show} onHide={onHide} centered>
            <Modal.Header closeButton>
                <Modal.Title>
                    <FaShare className="me-2" />
                    Share Deck
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form onSubmit={handleShare}>
                    <Form.Group className="mb-3">
                        <Form.Label>Share with (username)</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="Enter username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            list="users-list"
                        />
                        <datalist id="users-list">
                            {users.map(user => (
                                <option key={user.id} value={user.username} />
                            ))}
                        </datalist>
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>Permissions</Form.Label>
                        <Form.Select
                            value={permissions}
                            onChange={(e) => setPermissions(e.target.value)}
                        >
                            <option value="read">View only</option>
                            <option value="write">Edit</option>
                        </Form.Select>
                    </Form.Group>

                    {error && <div className="text-danger mb-3">{error}</div>}

                    <Button
                        variant="primary"
                        type="submit"
                        className="w-100"
                        disabled={loading}
                    >
                        {loading ? 'Sharing...' : 'Share Deck'}
                    </Button>
                </Form>

                <hr />

                <h6>Collaborators</h6>
                {collaborators.length > 0 ? (
                    <ListGroup variant="flush">
                        {collaborators.map((collab) => (
                            <ListGroup.Item key={collab.id} className="d-flex justify-content-between align-items-center">
                                <div className="d-flex align-items-center">
                                    <img
                                        src={collab.user.avatar}
                                        alt={collab.user.username}
                                        style={{ width: '30px', height: '30px', borderRadius: '50%' }}
                                        className="me-2"
                                    />
                                    <span>{collab.user.username}</span>
                                    <Badge
                                        bg={collab.role === 'editor' ? 'success' : 'info'}
                                        className="ms-2"
                                    >
                                        {collab.role === 'editor' ? (
                                            <><FaUserEdit className="me-1" /> Editor</>
                                        ) : (
                                            <><FaEye className="me-1" /> Viewer</>
                                        )}
                                    </Badge>
                                </div>
                                <Button
                                    variant="danger"
                                    size="sm"
                                    onClick={() => handleRemoveCollaborator(collab.id, collab.userId)}
                                    disabled={loading}
                                >
                                    <FaTrash />
                                </Button>
                            </ListGroup.Item>
                        ))}
                    </ListGroup>
                ) : (
                    <p className="text-muted">No collaborators yet</p>
                )}
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={onHide}>
                    Close
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default ShareDeckModal; 