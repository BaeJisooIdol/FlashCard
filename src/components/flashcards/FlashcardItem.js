import React, { useState } from 'react';
import { Card, Badge, ButtonGroup, Button } from 'react-bootstrap';
import { FaEdit, FaTrash, FaEye, FaSync } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const FlashcardItem = ({ flashcard, onDelete, showControls = true }) => {
    const [flipped, setFlipped] = useState(false);

    const handleFlip = (e) => {
        // If we click on a button, don't flip the card
        if (e.target.closest('.btn') || e.target.closest('.btn-group')) {
            return;
        }
        setFlipped(!flipped);
    };

    return (
        <div className="flashcard-container" style={{ height: '300px', marginBottom: '20px' }}>
            <div className={`flashcard ${flipped ? 'flipped' : ''}`}>
                <div className="flashcard-inner">
                    <Card className="flashcard-front" style={{ position: 'absolute', width: '100%', height: '100%' }}>
                        <Card.Body onClick={handleFlip}>
                            <div className="d-flex flex-column h-100">
                                <div className="mb-auto">
                                    <Card.Title>{flashcard.question}</Card.Title>
                                    {flashcard.category && (
                                        <Badge bg="primary" className="mb-3">
                                            {flashcard.category}
                                        </Badge>
                                    )}
                                </div>

                                <div className="mt-3 text-center">
                                    {!showControls ? (
                                        <small className="text-muted">Click to flip</small>
                                    ) : (
                                        <ButtonGroup className="w-100">
                                            <Button
                                                as={Link}
                                                to={`/flashcards/${flashcard.id}`}
                                                variant="outline-primary"
                                                size="sm"
                                                onClick={(e) => e.stopPropagation()}
                                            >
                                                <FaEye className="me-1" /> View
                                            </Button>
                                            <Button
                                                as={Link}
                                                to={`/flashcards/edit/${flashcard.id}`}
                                                variant="outline-warning"
                                                size="sm"
                                                onClick={(e) => e.stopPropagation()}
                                            >
                                                <FaEdit className="me-1" /> Edit
                                            </Button>
                                            <Button
                                                variant="outline-danger"
                                                size="sm"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    onDelete(flashcard.id);
                                                }}
                                            >
                                                <FaTrash className="me-1" /> Delete
                                            </Button>
                                        </ButtonGroup>
                                    )}
                                    {showControls && (
                                        <Button
                                            variant="link"
                                            size="sm"
                                            className="mt-2 text-muted"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                setFlipped(!flipped);
                                            }}
                                        >
                                            <FaSync className="me-1" /> Flip to see answer
                                        </Button>
                                    )}
                                </div>
                            </div>
                        </Card.Body>
                    </Card>

                    <Card className="flashcard-back" style={{ position: 'absolute', width: '100%', height: '100%' }}>
                        <Card.Body onClick={handleFlip}>
                            <div className="d-flex flex-column h-100">
                                <div className="mb-auto">
                                    <Card.Title className="text-white">Answer</Card.Title>
                                    <Card.Text className="mt-3">{flashcard.answer}</Card.Text>
                                </div>
                                <div className="mt-3 text-center">
                                    <small className="text-white">Click to flip back</small>
                                </div>
                            </div>
                        </Card.Body>
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default FlashcardItem; 