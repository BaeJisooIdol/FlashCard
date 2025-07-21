import React from 'react';
import { Card, Button, ProgressBar, ListGroup } from 'react-bootstrap';
import { FaCheck, FaTimes, FaRedo, FaHome } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const QuizResult = ({ results, totalQuestions, onRetry }) => {
    const correctAnswers = results.filter(result => result.correct).length;
    const score = Math.round((correctAnswers / totalQuestions) * 100);

    // Determine the score color and message
    const getScoreColor = () => {
        if (score >= 80) return 'success';
        if (score >= 60) return 'warning';
        return 'danger';
    };

    const getScoreMessage = () => {
        if (score >= 80) return 'Excellent! You\'ve mastered these flashcards!';
        if (score >= 60) return 'Good job! Keep practicing to improve further.';
        return 'Keep practicing! You\'ll get better with time.';
    };

    return (
        <Card className="shadow-sm fade-in">
            <Card.Header className="text-center">
                <h4>Quiz Results</h4>
            </Card.Header>
            <Card.Body>
                <div className="text-center mb-4">
                    <h1 className={`display-4 text-${getScoreColor()}`}>{score}%</h1>
                    <p>{getScoreMessage()}</p>
                    <ProgressBar
                        className="mb-3"
                        now={score}
                        variant={getScoreColor()}
                        label={`${correctAnswers} of ${totalQuestions} correct`}
                    />
                </div>

                <h5>Question Summary</h5>
                <ListGroup variant="flush" className="mb-4">
                    {results.map((result, index) => (
                        <ListGroup.Item
                            key={index}
                            className={`d-flex justify-content-between align-items-center`}
                        >
                            <div className="d-flex align-items-center">
                                <span className={`me-2 text-${result.correct ? 'success' : 'danger'}`}>
                                    {result.correct ? <FaCheck /> : <FaTimes />}
                                </span>
                                <span>Question {index + 1}</span>
                            </div>
                            <div>
                                {result.correct ?
                                    <span className="text-success">Correct</span> :
                                    <span className="text-danger">Incorrect (You selected: {result.selected})</span>
                                }
                            </div>
                        </ListGroup.Item>
                    ))}
                </ListGroup>
            </Card.Body>
            <Card.Footer className="d-flex justify-content-between">
                <Button variant="outline-primary" onClick={onRetry}>
                    <FaRedo className="me-1" /> Try Again
                </Button>
                <Button variant="outline-secondary" as={Link} to="/">
                    <FaHome className="me-1" /> Home
                </Button>
            </Card.Footer>
        </Card>
    );
};

export default QuizResult; 