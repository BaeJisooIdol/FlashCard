import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Button, Card, Badge } from 'react-bootstrap';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { FaEdit, FaTrash, FaArrowLeft, FaSync } from 'react-icons/fa';
import DeleteConfirmationModal from '../components/common/DeleteConfirmationModal';
import { useToast } from '../context/ToastContext';
import api from '../services/api';

const FlashcardDetailPage = () => {
    const [flashcard, setFlashcard] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const { id } = useParams();
    const navigate = useNavigate();
    const { showSuccess, showError } = useToast();
    const [flipped, setFlipped] = useState(false);

    useEffect(() => {
        const fetchFlashcard = async () => {
            try {
                const data = await api.getFlashcardById(id);
                setFlashcard(data);
                setLoading(false);
            } catch (err) {
                console.error('Error fetching flashcard:', err);
                setError('Failed to fetch flashcard. Please try again later.');
                setLoading(false);
                showError('Failed to load flashcard');
            }
        };

        fetchFlashcard();
    }, [id, showError]);

    const handleDelete = () => {
        setShowDeleteModal(true);
    };

    const confirmDelete = async () => {
        try {
            await api.deleteFlashcard(id);
            showSuccess('Flashcard deleted successfully');
            navigate('/flashcards');
        } catch (err) {
            console.error('Error deleting flashcard:', err);
            showError('Failed to delete flashcard');
        }
        setShowDeleteModal(false);
    };

    const handleFlip = () => {
        setFlipped(!flipped);
    };

    if (loading) {
        return <div className="text-center py-5">Loading...</div>;
    }

    if (error) {
        return <div className="text-center py-5 text-danger">{error}</div>;
    }

    if (!flashcard) {
        return <div className="text-center py-5">Flashcard not found</div>;
    }

    return (
        <Container className="fade-in">
            <Row className="mb-4">
                <Col>
                    <Button
                        as={Link}
                        to="/flashcards"
                        variant="outline-secondary"
                        className="mb-3"
                    >
                        <FaArrowLeft className="me-1" /> Back to Flashcards
                    </Button>
                    <h1>Flashcard Details</h1>
                </Col>
            </Row>

            <Row className="justify-content-center">
                <Col lg={8}>
                    <div className="flashcard-container" style={{ height: '400px', marginBottom: '20px' }}>
                        <div className={`flashcard ${flipped ? 'flipped' : ''}`}>
                            <div className="flashcard-inner">
                                <Card className="flashcard-front" style={{ position: 'absolute', width: '100%', height: '100%' }}>
                                    <Card.Body onClick={handleFlip}>
                                        <div className="d-flex flex-column h-100">
                                            <div className="d-flex justify-content-between align-items-center mb-4">
                                                <h4 className="mb-0">Question</h4>
                                                {flashcard.category && (
                                                    <Badge bg="primary" pill>
                                                        {flashcard.category}
                                                    </Badge>
                                                )}
                                            </div>

                                            <div className="flex-grow-1 d-flex align-items-center justify-content-center">
                                                <h3 className="text-center">{flashcard.question}</h3>
                                            </div>

                                            <div className="mt-auto text-center pt-3">
                                                <Button
                                                    variant="link"
                                                    className="text-muted"
                                                    size="sm"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleFlip();
                                                    }}
                                                >
                                                    <FaSync className="me-2" /> Click to flip and see the answer
                                                </Button>
                                            </div>
                                        </div>
                                    </Card.Body>
                                </Card>

                                <Card className="flashcard-back" style={{ position: 'absolute', width: '100%', height: '100%' }}>
                                    <Card.Body onClick={handleFlip}>
                                        <div className="d-flex flex-column h-100">
                                            <div className="mb-4">
                                                <h4 className="text-white mb-0">Answer</h4>
                                            </div>

                                            <div className="flex-grow-1 d-flex align-items-center justify-content-center">
                                                <p className="lead text-center text-white">{flashcard.answer}</p>
                                            </div>

                                            <div className="mt-auto text-center pt-3">
                                                <Button
                                                    variant="link"
                                                    className="text-white"
                                                    size="sm"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleFlip();
                                                    }}
                                                >
                                                    <FaSync className="me-2" /> Click to flip back to the question
                                                </Button>
                                            </div>
                                        </div>
                                    </Card.Body>
                                </Card>
                            </div>
                        </div>
                    </div>

                    <div className="d-flex justify-content-center mt-4">
                        <Button
                            as={Link}
                            to={`/flashcards/edit/${id}`}
                            variant="outline-primary"
                            className="me-2"
                        >
                            <FaEdit className="me-1" /> Edit
                        </Button>
                        <Button
                            variant="outline-danger"
                            onClick={handleDelete}
                        >
                            <FaTrash className="me-1" /> Delete
                        </Button>
                    </div>
                </Col>
            </Row>

            <DeleteConfirmationModal
                show={showDeleteModal}
                onHide={() => setShowDeleteModal(false)}
                onConfirm={confirmDelete}
                itemName="flashcard"
            />
        </Container>
    );
};

export default FlashcardDetailPage; 