import React, { useState, useEffect } from 'react';
import { Card, Button, Badge, ProgressBar, ButtonGroup } from 'react-bootstrap';
import { FaArrowLeft, FaArrowRight, FaSync, FaVolumeUp, FaVolumeMute } from 'react-icons/fa';
import textToSpeech from '../../utils/textToSpeech';

const StudyCard = ({ flashcards, currentIndex, setCurrentIndex }) => {
    const [flipped, setFlipped] = useState(false);
    const [animate, setAnimate] = useState(false);
    const [isSpeaking, setIsSpeaking] = useState(false);
    const [selectedVoice, setSelectedVoice] = useState(null);
    const [voices, setVoices] = useState([]);

    const currentFlashcard = flashcards[currentIndex];
    const progress = ((currentIndex + 1) / flashcards.length) * 100;

    // Load available voices on component mount
    useEffect(() => {
        const loadVoices = async () => {
            if (textToSpeech.isSpeechSynthesisSupported()) {
                const availableVoices = await textToSpeech.getVoices();
                setVoices(availableVoices);

                // Set a default voice (preferably English)
                const englishVoice = availableVoices.find(voice =>
                    voice.lang.includes('en-') || voice.lang.includes('en_')
                );
                setSelectedVoice(englishVoice || availableVoices[0]);
            }
        };

        loadVoices();

        // Clean up any ongoing speech when component unmounts
        return () => {
            textToSpeech.stop();
        };
    }, []);

    useEffect(() => {
        // Reset flipped state when changing cards
        setFlipped(false);
        setAnimate(true);

        // Stop any ongoing speech when changing cards
        textToSpeech.stop();
        setIsSpeaking(false);

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

    const handleFlip = (e) => {
        // Don't flip if clicking on a button or button group
        if (e && (e.target.closest('.btn') || e.target.closest('.btn-group') ||
            e.target.tagName === 'BUTTON' || e.target.tagName === 'A' ||
            e.target.closest('button') || e.target.closest('a'))) {
            return;
        }
        setFlipped(!flipped);
    };

    const handleSpeak = (e) => {
        if (e) e.stopPropagation(); // Prevent card flip

        if (!textToSpeech.isSpeechSynthesisSupported()) {
            return;
        }

        if (isSpeaking) {
            textToSpeech.stop();
            setIsSpeaking(false);
            return;
        }

        const textToRead = flipped ? currentFlashcard.answer : currentFlashcard.question;

        textToSpeech.speak(textToRead, {
            voice: selectedVoice,
            rate: 1.0,
            pitch: 1.0,
            onStart: () => setIsSpeaking(true),
            onEnd: () => setIsSpeaking(false),
            onError: () => setIsSpeaking(false)
        });
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
            <div className="flashcard-container d-flex justify-content-center align-items-center"
                style={{
                    position: 'relative',
                    height: '200px',
                    marginBottom: '20px',
                    cursor: 'pointer'
                }}
                onClick={handleFlip}
            >
                <div
                    className={`flashcard ${flipped ? 'flipped' : ''} ${animate ? 'fade-in' : ''}`}
                    style={{ width: '80%' }}
                >
                    <div className="flashcard-inner">
                        <Card className="flashcard-front" style={{ position: 'absolute', userSelect: 'none' }}>
                            <Card.Body>
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
                        <Card className="flashcard-back" style={{ position: 'absolute', width: '100%', height: '100%', userSelect: 'none' }}>
                            <Card.Body>
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
                <div className="d-flex justify-content-between align-items-end" style={{ width: '80%' }}>
                    <Button
                        variant="outline-secondary"
                        onClick={handlePrevious}
                        disabled={currentIndex === 0}
                        className='d-inline-flex align-items-center'
                    >
                        <FaArrowLeft className="me-1" /> <span>Previous</span>
                    </Button>

                    <ButtonGroup>
                        <Button
                            variant="outline-primary"
                            onClick={(e) => {
                                e.stopPropagation();
                                handleFlip();
                            }}
                        >
                            <FaSync className="me-1" /> Flip Card
                        </Button>

                        <Button
                            variant={isSpeaking ? "outline-danger" : "outline-success"}
                            onClick={handleSpeak}
                            disabled={!textToSpeech.isSpeechSynthesisSupported()}
                            title={textToSpeech.isSpeechSynthesisSupported() ?
                                "Text-to-speech" :
                                "Text-to-speech not supported in your browser"
                            }
                        >
                            {isSpeaking ? <FaVolumeMute className="me-1" /> : <FaVolumeUp className="me-1" />}
                            {isSpeaking ? "Stop" : "Listen"}
                        </Button>
                    </ButtonGroup>

                    <Button
                        variant="outline-secondary"
                        onClick={handleNext}
                        disabled={currentIndex === flashcards.length - 1}
                        className='d-inline-flex align-items-center'
                    >
                        <span>Next</span> <FaArrowRight className="ms-1" />
                    </Button>
                </div>
            </div>
        </>
    );
};

export default StudyCard; 