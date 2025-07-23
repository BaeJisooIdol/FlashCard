import React, { useState, useEffect } from 'react';
import { Card, Badge, Button, ButtonGroup } from 'react-bootstrap';
import { FaEdit, FaTrash, FaEye, FaVolumeUp, FaVolumeMute, FaSync } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import textToSpeech from '../../utils/textToSpeech';
import './FlashcardItem.css';

const FlashcardItem = ({ flashcard, onDelete, showDeleteModal }) => {
    const [flipped, setFlipped] = useState(false);
    const [isSpeaking, setIsSpeaking] = useState(false);

    // Stop speaking when component unmounts
    useEffect(() => {
        return () => {
            if (isSpeaking) {
                textToSpeech.stop();
            }
        };
    }, [isSpeaking]);

    const handleFlip = (e) => {
        // Don't flip if clicking on a button or button group
        if (e.target.closest('.btn') || e.target.closest('.btn-group') ||
            e.target.tagName === 'A' || e.target.tagName === 'BUTTON' ||
            e.target.closest('a') || e.target.closest('button')) {
            return;
        }
        setFlipped(!flipped);
    };

    const handleDelete = () => {
        showDeleteModal(flashcard.id);
    };

    const handleSpeak = (e) => {
        e.stopPropagation(); // Prevent card flip

        if (!textToSpeech.isSpeechSynthesisSupported()) {
            return;
        }

        if (isSpeaking) {
            textToSpeech.stop();
            setIsSpeaking(false);
            return;
        }

        const textToRead = flipped ? flashcard.answer : flashcard.question;

        textToSpeech.speak(textToRead, {
            rate: 1.0,
            pitch: 1.0,
            onStart: () => setIsSpeaking(true),
            onEnd: () => setIsSpeaking(false),
            onError: () => setIsSpeaking(false)
        });
    };

    const renderCardControls = () => (
        <div className="card-controls d-flex justify-content-between align-items-start">
            <Badge bg="primary">{flashcard.category}</Badge>
            <ButtonGroup size="sm">
                <Button
                    variant={isSpeaking ? "outline-danger" : "outline-secondary"}
                    onClick={handleSpeak}
                    disabled={!textToSpeech.isSpeechSynthesisSupported()}
                    title={textToSpeech.isSpeechSynthesisSupported() ?
                        "Text-to-speech" :
                        "Text-to-speech not supported in your browser"
                    }
                >
                    {isSpeaking ? <FaVolumeMute /> : <FaVolumeUp />}
                </Button>
                <Button
                    variant="outline-info"
                    onClick={(e) => {
                        e.stopPropagation();
                        setFlipped(!flipped);
                    }}
                    title="Flip Card"
                >
                    <FaSync />
                </Button>
                <Button
                    as={Link}
                    to={`/flashcards/${flashcard.id}`}
                    variant="outline-primary"
                    title="View Details"
                >
                    <FaEye />
                </Button>
                <Button
                    as={Link}
                    to={`/flashcards/edit/${flashcard.id}`}
                    variant="outline-success"
                    title="Edit"
                >
                    <FaEdit />
                </Button>
                <Button
                    variant="outline-danger"
                    onClick={handleDelete}
                    title="Delete"
                >
                    <FaTrash />
                </Button>
            </ButtonGroup>
        </div>
    );

    return (
        <div className="flashcard-wrapper">
            {renderCardControls()}
            <div className="flashcard-container" onClick={handleFlip}>
                <div className={`flashcard-inner ${flipped ? 'flipped' : ''}`}>
                    <div className="flashcard-front">
                        <div className="flashcard-content">
                            <h6 className="text-muted mb-2">Question:</h6>
                            <p className="fw-bold">{flashcard.question}</p>
                            <div className="text-center mt-2">
                                <small className="text-muted">Click to see answer</small>
                            </div>
                        </div>
                    </div>
                    <div className="flashcard-back">
                        <div className="flashcard-content">
                            <h6 className="text-muted mb-2">Answer:</h6>
                            <p>{flashcard.answer}</p>
                            <div className="text-center mt-2">
                                <small className="text-muted">Click to see question</small>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FlashcardItem; 