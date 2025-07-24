import React, { useState, useEffect, useContext } from 'react';
import { Container, Row, Col, Card, ListGroup } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { FaBook, FaClipboardCheck, FaChartLine, FaAward } from 'react-icons/fa';
import StatCard from '../components/dashboard/StatCard';
import { useToast } from '../context/ToastContext';
import api from '../services/api';
import { ThemeContext } from '../context/ThemeContext';

const DashboardPage = () => {

    const { darkMode } = useContext(ThemeContext);

    const [flashcards, setFlashcards] = useState([]);
    const [categories, setCategories] = useState([]);
    const [quizResults, setQuizResults] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { showError } = useToast();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [flashcardsData, categoriesData, quizResultsData] = await Promise.all([
                    api.getFlashcards(),
                    api.getCategories(),
                    api.getQuizResults()
                ]);

                setFlashcards(flashcardsData);
                setCategories(categoriesData);
                setQuizResults(quizResultsData);
                setLoading(false);
            } catch (err) {
                console.error('Error fetching data:', err);
                setError('Failed to fetch data. Please try again later.');
                setLoading(false);
                showError('Failed to load dashboard data');
            }
        };

        fetchData();
    }, [showError]);

    // Calculate statistics
    const getTotalFlashcards = () => flashcards.length;

    const getCategoriesCount = () => categories.length;

    const getAverageQuizScore = () => {
        if (quizResults.length === 0) return 0;
        const totalScore = quizResults.reduce((acc, result) => {
            return acc + (result.correctAnswers / result.totalQuestions) * 100;
        }, 0);
        return Math.round(totalScore / quizResults.length);
    };

    const getRecentResults = () => {
        // Sort by date descending and take the last 5
        return [...quizResults]
            .sort((a, b) => new Date(b.date) - new Date(a.date))
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString();
    };

    if (loading) {
        return <div className="text-center py-5">Loading...</div>;
    }

    if (error) {
        return <div className="text-center py-5 text-danger">{error}</div>;
    }

    return (
        <Container className="fade-in">
            <h1 className="mb-4">Dashboard</h1>
            <p className="mb-4">Welcome to your flashcard learning dashboard. View your progress and statistics.</p>

            <Row>
                <Col lg={3} md={6} className="mb-4">
                    <StatCard
                        title="Total Flashcards"
                        value={getTotalFlashcards()}
                        icon={<FaBook />}
                        color="primary"
                    />
                </Col>
                <Col lg={3} md={6} className="mb-4">
                    <StatCard
                        title="Categories"
                        value={getCategoriesCount()}
                        icon={<FaClipboardCheck />}
                        color="success"
                    />
                </Col>
                <Col lg={3} md={6} className="mb-4">
                    <StatCard
                        title="Quiz Results"
                        value={quizResults.length}
                        icon={<FaChartLine />}
                        color="info"
                    />
                </Col>
                <Col lg={3} md={6} className="mb-4">
                    <StatCard
                        title="Avg. Score"
                        value={`${getAverageQuizScore()}%`}
                        icon={<FaAward />}
                        color="warning"
                    />
                </Col>
            </Row>

            <Row className="mt-4">
                <Col lg={6} className="mb-4">
                    <Card className="shadow-sm h-100">
                        <Card.Header>
                            <h5 className={`${darkMode ? 'text-white' : ''} mb-0`}>Flashcards by Category</h5>
                        </Card.Header>
                        <Card.Body>
                            {categories.map((category) => {
                                const count = flashcards.filter((f) => f.category === category).length;
                                const percentage = Math.round((count / flashcards.length) * 100) || 0;

                                return (
                                    <div key={category} className="mb-3">
                                        <div className="d-flex justify-content-between mb-1">
                                            <span className={`${darkMode ? 'text-white' : ''}`}>{category}</span>
                                            <span className={`${darkMode ? 'text-white' : ''}`}>{count} cards</span>
                                        </div>
                                        <div className="progress">
                                            <div
                                                className={`progress-bar bg-primary`}
                                                role="progressbar"
                                                style={{ width: `${percentage}%` }}
                                                aria-valuenow={percentage}
                                                aria-valuemin="0"
                                                aria-valuemax="100"
                                            >
                                                {percentage}%
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}

                            {categories.length === 0 && (
                                <div className="text-center py-4">
                                    <p>No categories available.</p>
                                </div>
                            )}
                        </Card.Body>
                    </Card>
                </Col>

                <Col lg={6} className="mb-4">
                    <Card className="shadow-sm h-100">
                        <Card.Header>
                            <h5 className={`${darkMode ? 'text-white' : ''} mb-0`}>Recent Quiz Results</h5>
                        </Card.Header>
                        <div style={{ maxHeight: '770px', overflowY: 'auto' }}>
                            <ListGroup variant="flush">
                                {getRecentResults().map((result, index) => {
                                    const score = Math.round((result.correctAnswers / result.totalQuestions) * 100);
                                    let badgeColor = 'danger';
                                    if (score >= 80) badgeColor = 'success';
                                    else if (score >= 60) badgeColor = 'warning';

                                    return (
                                        <ListGroup.Item key={index} className="d-flex justify-content-between align-items-center">
                                            <div>
                                                <div>{formatDate(result.date)}</div>
                                                <small className="text-muted">
                                                    {result.deckName || result.category}
                                                </small>
                                            </div>
                                            <div className="text-end">
                                                <span className={`badge bg-${badgeColor}`}>
                                                    {score}%
                                                </span>
                                                <div>
                                                    <small className="text-muted">
                                                        {result.correctAnswers}/{result.totalQuestions} correct
                                                    </small>
                                                </div>
                                            </div>
                                        </ListGroup.Item>
                                    );
                                })}

                                {quizResults.length === 0 && (
                                    <ListGroup.Item className="text-center py-4">
                                        <p>No quiz results available. Take a quiz to see your results here.</p>
                                    </ListGroup.Item>
                                )}
                            </ListGroup>
                        </div>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
};

export default DashboardPage; 