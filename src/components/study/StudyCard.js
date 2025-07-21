import React, { useState, useEffect } from 'react';
import { Card, Button, Badge, ProgressBar } from 'react-bootstrap';
import { FaArrowLeft, FaArrowRight, FaSync } from 'react-icons/fa';

const StudyCard = ({ flashcards, currentIndex, setCurrentIndex }) => {
    const [flipped, setFlipped] = useState(false);
    const [animate, setAnimate] = useState(false);
    const currentFlashcard = flashcards[currentIndex];
    const progress = ((currentIndex + 1) / flashcards.length) * 100;

    useEffect(() => {
        // Reset flipped state when changing cards
        setFlipped(false);
        setAnimate(true);

        const timer = setTimeout(() => {
            setAnimate(false);
        }, 500);

        return () => clearTimeout(timer);
    }, [currentIndex]);

    const handleNext = () => {
        if (currentIndex < flashcards.length - 1) {
            setCurrentIndex(currentIndex + 1);
        }
    };

    const handlePrevious = () => {
        if (currentIndex > 0) {
            setCurrentIndex(currentIndex - 1);
        }
    };

    const handleFlip = () => {
        setFlipped(!flipped);
    };

    if (!currentFlashcard) {
        return <div>No flashcards available</div>;
    }

    return (
        <>
            <div className="mb-4">
                <ProgressBar
                    now={progress}
                    label={`${Math.round(progress)}%`}
                    variant="primary"
                    style={{ height: '10px' }}
                />
                <div className="d-flex justify-content-between mt-2">
                    <small>Card {currentIndex + 1} of {flashcards.length}</small>
                    <Badge bg="primary">{currentFlashcard.category}</Badge>
                </div>
            </div>

            {/* Fixed container with explicit dimensions */}
            <div className="flashcard-container d-flex justify-content-center align-items-center" style={{ position: 'relative', height: '200px', marginBottom: '20px' }}>
                <div
                    className={`flashcard ${flipped ? 'flipped' : ''} ${animate ? 'fade-in' : ''}`}
                    style={{ width: '80%' }}
                >
                    <div className="flashcard-inner">
                        <Card className="flashcard-front" style={{ position: 'absolute' }}>
                            <Card.Body onClick={handleFlip}>
                                <div className="d-flex flex-column h-100 justify-content-center">
                                    <div className="text-center mb-4">
                                        <h3 className="card-title">{currentFlashcard.question}</h3>
                                    </div>
                                    <div className="text-center">
                                        <small className="text-muted">Click to see answer</small>
                                    </div>
                                </div>
                            </Card.Body>
                        </Card>
                        <Card className="flashcard-back" style={{ position: 'absolute', width: '100%', height: '100%' }}>
                            <Card.Body onClick={handleFlip}>
                                <div className="d-flex flex-column h-100 justify-content-center">
                                    <div className="text-center mb-2">
                                        <h5 className="text-white mb-4">Answer</h5>
                                        <p className="lead">{currentFlashcard.answer}</p>
                                    </div>
                                    <div className="text-center mt-auto">
                                        <small className="text-white">Click to see question</small>
                                    </div>
                                </div>
                            </Card.Body>
                        </Card>
                    </div>
                </div>
            </div>

            <div className="d-flex justify-content-center mt-40">
                <div className="d-flex justify-content-between align-items-center" style={{ width: '80%' }}>
                    <Button
                        variant="outline-secondary"
                        onClick={handlePrevious}
                        disabled={currentIndex === 0}
                    >
                        <FaArrowLeft className="me-1" /> Previous
                    </Button>
                    <Button
                        variant="outline-primary"
                        onClick={handleFlip}
                    >
                        <FaSync className="me-1" /> Flip Card
                    </Button>
                    <Button
                        variant="outline-secondary"
                        onClick={handleNext}
                        disabled={currentIndex === flashcards.length - 1}
                    >
                        Next <FaArrowRight className="ms-1" />
                    </Button>
                </div>
            </div>
        </>
    );
};

export default StudyCard; 