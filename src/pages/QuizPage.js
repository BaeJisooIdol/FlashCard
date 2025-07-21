import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Form, Button, Card } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { FaPlay, FaFilter } from 'react-icons/fa';
import QuizCard from '../components/quiz/QuizCard';
import QuizResult from '../components/quiz/QuizResult';
import { useToast } from '../context/ToastContext';
import api from '../services/api';

const QuizPage = () => {
    const [flashcards, setFlashcards] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedCategory, setSelectedCategory] = useState('');
    const [isQuizStarted, setIsQuizStarted] = useState(false);
    const [quizFlashcards, setQuizFlashcards] = useState([]);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [quizResults, setQuizResults] = useState([]);
    const [isQuizFinished, setIsQuizFinished] = useState(false);
    const { showError, showSuccess } = useToast();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [flashcardsData, categoriesData] = await Promise.all([
                    api.getFlashcards(),
                    api.getCategories()
                ]);

                setFlashcards(flashcardsData);
                setCategories(categoriesData);
                setLoading(false);
            } catch (err) {
                console.error('Error fetching data:', err);
                setError('Failed to fetch data. Please try again later.');
                setLoading(false);
                showError('Failed to load flashcards');
            }
        };

        fetchData();
    }, [showError]);

    // Helper function to shuffle array
    const shuffleArray = (array) => {
        const newArray = [...array];
        for (let i = newArray.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
        }
        return newArray;
    };

    // Generate incorrect options for multiple choice
    const generateOptions = (correctAnswer, allFlashcards) => {
        // Get all answers except the correct one
        const otherAnswers = allFlashcards
            .map(fc => fc.answer)
            .filter(answer => answer !== correctAnswer);

        // Shuffle and take up to 3
        const incorrectOptions = shuffleArray(otherAnswers).slice(0, 3);

        // Combine correct answer and incorrect options, then shuffle
        return shuffleArray([correctAnswer, ...incorrectOptions]);
    };

    // Start the quiz
    const startQuiz = () => {
        // Filter flashcards by category if selected
        let quizCards = selectedCategory
            ? flashcards.filter(fc => fc.category === selectedCategory)
            : flashcards;

        // If there are no flashcards in the selected category, show error
        if (quizCards.length === 0) {
            showError('No flashcards available for this category');
            return;
        }

        // Shuffle the cards for random order
        quizCards = shuffleArray(quizCards);

        // Prepare quiz cards with options
        const preparedQuizCards = quizCards.map(card => ({
            ...card,
            options: generateOptions(card.answer, flashcards)
        }));

        setQuizFlashcards(preparedQuizCards);
        setCurrentQuestionIndex(0);
        setQuizResults([]);
        setIsQuizStarted(true);
        setIsQuizFinished(false);
    };

    // Handle answering a question
    const handleAnswer = (isCorrect, selectedOption) => {
        // Record the result
        setQuizResults(prev => [
            ...prev,
            {
                questionId: quizFlashcards[currentQuestionIndex].id,
                question: quizFlashcards[currentQuestionIndex].question,
                correct: isCorrect,
                selected: selectedOption,
                correctAnswer: quizFlashcards[currentQuestionIndex].answer
            }
        ]);

        // Move to next question or end quiz
        if (currentQuestionIndex < quizFlashcards.length - 1) {
            setTimeout(() => {
                setCurrentQuestionIndex(prev => prev + 1);
            }, 1000);
        } else {
            // End of quiz
            setTimeout(() => {
                setIsQuizFinished(true);
                showSuccess('Quiz completed!');

                // Save the quiz result to the backend
                const saveResult = async () => {
                    try {
                        const result = {
                            date: new Date().toISOString(),
                            category: selectedCategory || 'All Categories',
                            totalQuestions: quizFlashcards.length,
                            correctAnswers: quizResults.filter(r => r.correct).length + (isCorrect ? 1 : 0)
                        };
                        await api.saveQuizResult(result);
                    } catch (err) {
                        console.error('Error saving quiz result:', err);
                    }
                };

                saveResult();
            }, 1000);
        }
    };

    // Retry the quiz
    const retryQuiz = () => {
        startQuiz();
    };

    if (loading) {
        return <div className="text-center py-5">Loading...</div>;
    }

    if (error) {
        return <div className="text-center py-5 text-danger">{error}</div>;
    }

    if (flashcards.length === 0) {
        return (
            <Container className="text-center py-5 fade-in">
                <h2>No Flashcards Available</h2>
                <p>Create some flashcards to start a quiz</p>
                <Button as={Link} to="/create" variant="primary" className="mt-3">
                    Create Flashcard
                </Button>
            </Container>
        );
    }

    return (
        <Container className="fade-in">
            <h1 className="mb-4">Quiz Mode</h1>

            {!isQuizStarted ? (
                // Quiz setup
                <div>
                    <p className="mb-4">
                        Test your knowledge with a quiz. Select a category and start the quiz.
                    </p>

                    <Row className="mb-4">
                        <Col md={6}>
                            <Form.Group>
                                <Form.Label>
                                    <FaFilter className="me-2" /> Select Category
                                </Form.Label>
                                <Form.Select
                                    value={selectedCategory}
                                    onChange={(e) => setSelectedCategory(e.target.value)}
                                >
                                    <option value="">All Categories</option>
                                    {categories.map((category) => (
                                        <option key={category} value={category}>
                                            {category}
                                        </option>
                                    ))}
                                </Form.Select>
                            </Form.Group>
                        </Col>
                    </Row>

                    <Button
                        variant="primary"
                        onClick={startQuiz}
                        className="mb-3"
                    >
                        <FaPlay className="me-2" /> Start Quiz
                    </Button>
                </div>
            ) : isQuizFinished ? (
                // Quiz finished - show results
                <QuizResult
                    results={quizResults}
                    totalQuestions={quizFlashcards.length}
                    onRetry={retryQuiz}
                />
            ) : (
                // Quiz in progress - show current question
                <QuizCard
                    question={quizFlashcards[currentQuestionIndex].question}
                    correctAnswer={quizFlashcards[currentQuestionIndex].answer}
                    options={quizFlashcards[currentQuestionIndex].options}
                    onAnswer={handleAnswer}
                    currentIndex={currentQuestionIndex}
                    totalQuestions={quizFlashcards.length}
                    category={quizFlashcards[currentQuestionIndex].category}
                />
            )}
        </Container>
    );
};

export default QuizPage; 