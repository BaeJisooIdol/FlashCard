import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Badge, ListGroup, Alert } from 'react-bootstrap';
import { FaGlobe, FaLock, FaUser, FaClock, FaArrowLeft, FaShare, FaEdit, FaTrash } from 'react-icons/fa';
import { Link, useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import DeckComments from '../components/flashcards/DeckComments';
import ShareDeckModal from '../components/flashcards/ShareDeckModal';
import DeleteConfirmationModal from '../components/common/DeleteConfirmationModal';
import './SharedDeckDetailPage.css';

const SharedDeckDetailPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user, isAuthenticated } = useAuth();
    const { showError, showSuccess } = useToast();

    const [deck, setDeck] = useState(null);
    const [flashcards, setFlashcards] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [showShareModal, setShowShareModal] = useState(false);
    const [isOwner, setIsOwner] = useState(false);
    const [canEdit, setCanEdit] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [flashcardToDelete, setFlashcardToDelete] = useState(null);

    useEffect(() => {
        fetchDeckData();
    }, [id]);

    const fetchDeckData = async () => {
        try {
            setLoading(true);
            setError('');

            // Fetch deck details
            const deckData = await api.getDeckById(id);
            setDeck(deckData);

            // Check if user is owner
            if (isAuthenticated && user && deckData.userId === user.id) {
                setIsOwner(true);
                setCanEdit(true);
            }

            // Check if user has edit permissions (if not owner)
            if (isAuthenticated && user && !isOwner) {
                // Check collaborators
                const collaborators = await api.getCollaborators(id);
                const userCollaborator = collaborators.find(c => c.userId === user.id);
                if (userCollaborator && userCollaborator.role === 'editor') {
                    setCanEdit(true);
                }

                // Check shared permissions
                const response = await fetch(`http://localhost:5000/deckShares?deckId=${id}&sharedWithUserId=${user.id}`);
                const shares = await response.json();
                if (shares.length > 0 && shares[0].permissions === 'write') {
                    setCanEdit(true);
                }
            }

            // Fetch flashcards
            const flashcardsData = await api.getFlashcardsByDeck(id);
            setFlashcards(flashcardsData);

        } catch (error) {
            console.error('Error fetching deck data:', error);
            setError('Failed to fetch deck data. The deck might not exist or you might not have permission to view it.');
            showError('Failed to fetch deck data');
        } finally {
            setLoading(false);
        }
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString();
    };

    const handleDeleteClick = (flashcard) => {
        setFlashcardToDelete(flashcard);
        setShowDeleteModal(true);
    };

    const handleDeleteConfirm = async () => {
        if (!flashcardToDelete) return;

        try {
            await api.removeFlashcardFromDeck(flashcardToDelete.id);
            setFlashcards(flashcards.filter(card => card.id !== flashcardToDelete.id));
            showSuccess('Flashcard removed from deck successfully');
        } catch (error) {
            console.error('Error removing flashcard from deck:', error);
            showError('Failed to remove flashcard from deck');
        } finally {
            setShowDeleteModal(false);
            setFlashcardToDelete(null);
        }
    };

    if (loading) {
        return <div className="text-center py-5">Loading...</div>;
    }

    if (error || !deck) {
        return (
            <Container className="py-5">
                <Alert variant="danger">
                    {error || 'Deck not found'}
                </Alert>
                <Button as={Link} to="/shared-decks" variant="secondary">
                    <FaArrowLeft className="me-2" />
                    Back to Shared Decks
                </Button>
            </Container>
        );
    }

    return (
        <Container className="py-4 shared-deck-container">
            <Button
                as={Link}
                to="/shared-decks"
                variant="outline-secondary"
                className="mb-4"
            >
                <FaArrowLeft className="me-2" />
                Back to Shared Decks
            </Button>

            <Row className="deck-content">
                <Col lg={8}>
                    <Card className="shadow-sm mb-4" style={{ height: 'unset' }}>
                        <Card.Header className="d-flex justify-content-between align-items-center">
                            <h2 className="mb-0">{deck.name}</h2>
                            <div>
                                {deck.isPublic ? (
                                    <Badge bg="success">
                                        <FaGlobe className="me-1" /> Public
                                    </Badge>
                                ) : (
                                    <Badge bg="secondary">
                                        <FaLock className="me-1" /> Shared
                                    </Badge>
                                )}
                            </div>
                        </Card.Header>
                        <Card.Body>
                            <div className="mb-3 d-flex align-items-center">
                                <FaUser className="me-2 text-muted" />
                                <span>Created by: {deck.userId === user?.id ? 'You' : 'Another User'}</span>
                            </div>

                            <div className="mb-3 d-flex align-items-center">
                                <FaClock className="me-2 text-muted" />
                                <span>Created: {formatDate(deck.createdAt)}</span>
                                {deck.updatedAt !== deck.createdAt && (
                                    <span className="ms-3">
                                        (Updated: {formatDate(deck.updatedAt)})
                                    </span>
                                )}
                            </div>

                            <p className="lead">{deck.description || 'No description provided.'}</p>

                            {/* Display all categories */}
                            <div className="mt-4 mb-4">
                                <h5>Categories</h5>
                                <div className="d-flex flex-wrap gap-2 mt-2">
                                    {deck.categories && deck.categories.length > 0 ?
                                        deck.categories.map((category, index) => (
                                            <Badge key={index} bg="info" className="p-2">{category}</Badge>
                                        )) :
                                        <span className="text-muted">No categories assigned</span>
                                    }
                                </div>
                            </div>

                            <div className="mt-4">
                                <h5>Flashcards ({flashcards.length})</h5>
                                {flashcards.length > 0 ? (
                                    <ListGroup variant="flush" className="flashcard-list">
                                        {flashcards.map((card, index) => (
                                            <ListGroup.Item key={card.id}>
                                                <div className="d-flex justify-content-between align-items-center">
                                                    <div>
                                                        <span className="fw-bold me-2">{index + 1}.</span>
                                                        {card.question}
                                                    </div>
                                                    <div className="d-flex align-items-center">
                                                        <Badge bg="primary" className="me-2">{card.category}</Badge>
                                                        {canEdit && (
                                                            <Button
                                                                variant="outline-danger"
                                                                size="sm"
                                                                onClick={() => handleDeleteClick(card)}
                                                            >
                                                                <FaTrash />
                                                            </Button>
                                                        )}
                                                    </div>
                                                </div>
                                            </ListGroup.Item>
                                        ))}
                                    </ListGroup>
                                ) : (
                                    <p className="text-muted">This deck has no flashcards yet.</p>
                                )}
                            </div>
                        </Card.Body>
                        <Card.Footer>
                            <div className="d-flex gap-2 flex-wrap">
                                <Button
                                    variant="primary"
                                    as={Link}
                                    to={`/study/${id}`}
                                    disabled={flashcards.length === 0}
                                    className="me-2"
                                >
                                    Study This Deck
                                </Button>
                                <Button
                                    variant="success"
                                    as={Link}
                                    to={`/quiz/${id}?autoStart=true`}
                                    disabled={flashcards.length === 0}
                                >
                                    Quiz Mode
                                </Button>

                                {isOwner && (
                                    <Button
                                        variant="outline-primary"
                                        onClick={() => setShowShareModal(true)}
                                    >
                                        <FaShare className="me-1" />
                                        Share
                                    </Button>
                                )}

                                {canEdit && (
                                    <Button
                                        variant="outline-success"
                                        as={Link}
                                        to={`/edit-deck/${id}`}
                                    >
                                        <FaEdit className="me-1" />
                                        Edit
                                    </Button>
                                )}
                            </div>
                        </Card.Footer>
                    </Card>

                    {/* Comments and ratings section (only for public decks) */}
                    {deck.isPublic && (
                        <DeckComments deckId={id} />
                    )}
                </Col>

                <Col lg={4}>
                    <Card className="shadow-sm mb-4 study-options-card">
                        <Card.Header>
                            <h5 className="mb-0">Study Options</h5>
                        </Card.Header>
                        <Card.Body>
                            <div className="d-grid gap-2">
                                <Button
                                    variant="primary"
                                    as={Link}
                                    to={`/study/${id}`}
                                    disabled={flashcards.length === 0}
                                >
                                    Study Mode
                                </Button>
                                <Button
                                    variant="success"
                                    as={Link}
                                    to={`/quiz/${id}?autoStart=true`}
                                    disabled={flashcards.length === 0}
                                >
                                    Quiz Mode
                                    {flashcards.length < 4 && (
                                        <span className="ms-2">
                                            (Need at least 4 cards)
                                        </span>
                                    )}
                                </Button>
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>

            {/* Share Modal */}
            {isOwner && (
                <ShareDeckModal
                    show={showShareModal}
                    onHide={() => setShowShareModal(false)}
                    deck={deck}
                />
            )}

            {/* Delete Confirmation Modal */}
            <DeleteConfirmationModal
                show={showDeleteModal}
                onHide={() => setShowDeleteModal(false)}
                onConfirm={handleDeleteConfirm}
                itemName="flashcard"
                title="Remove Flashcard"
                message="Are you sure you want to remove this flashcard from the deck? The flashcard will still be available in your collection."
                confirmButtonText="Remove from Deck"
                confirmButtonVariant="warning"
            />
        </Container>
    );
};

export default SharedDeckDetailPage; 