import React, { useState, useEffect } from 'react';
import { Card, Button, Form, ProgressBar, Badge } from 'react-bootstrap';
import { FaArrowRight, FaCheck, FaTimes } from 'react-icons/fa';

const QuizCard = ({
    question,
    correctAnswer,
    options,
    onAnswer,
    currentIndex,
    totalQuestions,
    category
}) => {
    const [selectedOption, setSelectedOption] = useState('');
    const [isAnswered, setIsAnswered] = useState(false);
    const [isCorrect, setIsCorrect] = useState(null);
    const progress = ((currentIndex + 1) / totalQuestions) * 100;

    useEffect(() => {
        // Reset state when question changes
        setSelectedOption('');
        setIsAnswered(false);
        setIsCorrect(null);
    }, [question]);

    const handleOptionSelect = (option) => {
        if (isAnswered) return;
        setSelectedOption(option);
    };

    const handleSubmit = () => {
        if (!selectedOption || isAnswered) return;

        const correct = selectedOption === correctAnswer;
        setIsCorrect(correct);
        setIsAnswered(true);

        // Call the parent handler after a delay to show the result
        setTimeout(() => {
            onAnswer(correct, selectedOption);
        }, 1500);
    };

    const getOptionClass = (option) => {
        if (!isAnswered) {
            return selectedOption === option ? 'selected' : '';
        }

        if (option === correctAnswer) {
            return 'correct';
        }

        if (selectedOption === option && selectedOption !== correctAnswer) {
            return 'incorrect';
        }

        return '';
    };

    return (
        <Card className="quiz-card shadow-sm fade-in">
            <Card.Header>
                <div className="mb-2">
                    <ProgressBar now={progress} label={`${Math.round(progress)}%`} />
                </div>
                <div className="d-flex justify-content-between">
                    <span>Question {currentIndex + 1} of {totalQuestions}</span>
                    <Badge bg="primary">{category}</Badge>
                </div>
            </Card.Header>
            <Card.Body>
                <Card.Title className="mb-4">{question}</Card.Title>
                <Form>
                    {options.map((option, index) => (
                        <div
                            key={index}
                            className={`quiz-option ${getOptionClass(option)}`}
                            onClick={() => handleOptionSelect(option)}
                        >
                            <Form.Check
                                type="radio"
                                id={`option-${index}`}
                                label={option}
                                name="quiz-option"
                                checked={selectedOption === option}
                                onChange={() => { }}
                                disabled={isAnswered}
                            />
                        </div>
                    ))}
                </Form>

                {isAnswered && (
                    <div className={`mt-3 text-${isCorrect ? 'success' : 'danger'} text-center`}>
                        {isCorrect ? (
                            <p><FaCheck /> Correct answer!</p>
                        ) : (
                            <p><FaTimes /> Incorrect! The correct answer is: {correctAnswer}</p>
                        )}
                    </div>
                )}
            </Card.Body>
            <Card.Footer className="d-flex justify-content-between">
                <div></div>
                <Button
                    variant="primary"
                    onClick={handleSubmit}
                    disabled={!selectedOption || isAnswered}
                >
                    {isAnswered ? 'Next' : 'Submit'} {isAnswered && <FaArrowRight />}
                </Button>
            </Card.Footer>
        </Card>
    );
};

export default QuizCard; 