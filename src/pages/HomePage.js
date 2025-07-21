import React, { useContext } from 'react';
import { Row, Col, Card, Button, Container } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { FaBook, FaPlus, FaChartBar, FaBrain, FaLightbulb } from 'react-icons/fa';
import { ThemeContext } from '../context/ThemeContext';

const HomePage = () => {
    const { darkMode } = useContext(ThemeContext);

    return (
        <div className="fade-in">
            {/* Hero Section */}
            <div
                className={`py-5 text-center ${darkMode ? 'bg-dark text-white' : 'bg-light'}`}
                style={{ marginTop: '-1rem', marginBottom: '2rem', borderRadius: '0 0 15px 15px' }}
            >
                <Container>
                    <Row className="justify-content-center">
                        <Col lg={8}>
                            <FaBrain className="mb-3" style={{ fontSize: '3rem', color: 'var(--primary-color)' }} />
                            <h1 className="display-4 fw-bold mb-3">Boost Your Learning</h1>
                            <p className="lead mb-4">
                                Use flashcards to enhance memory retention, increase understanding,
                                and master any subject with ease.
                            </p>
                            <div className="d-grid gap-2 d-sm-flex justify-content-sm-center">
                                <Button as={Link} to="/study" size="lg" variant="primary" className="px-4 gap-3">
                                    <FaBook className="me-2" /> Start Studying
                                </Button>
                                <Button as={Link} to="/create" size="lg" variant="outline-primary" className="px-4">
                                    <FaPlus className="me-2" /> Create Flashcard
                                </Button>
                            </div>
                        </Col>
                    </Row>
                </Container>
            </div>

            {/* Features Section */}
            <Container>
                <h2 className="text-center mb-4">Why Use FlashCard App?</h2>
                <Row>
                    <Col md={4} className="mb-4">
                        <Card className="h-100 shadow-sm">
                            <Card.Body className="text-center">
                                <div className="feature-icon mb-3">
                                    <FaLightbulb style={{ fontSize: '2.5rem', color: 'var(--primary-color)' }} />
                                </div>
                                <h5>Effective Learning</h5>
                                <Card.Text>
                                    Flashcards use active recall, one of the most effective techniques for memorization and learning.
                                </Card.Text>
                            </Card.Body>
                        </Card>
                    </Col>
                    <Col md={4} className="mb-4">
                        <Card className="h-100 shadow-sm">
                            <Card.Body className="text-center">
                                <div className="feature-icon mb-3">
                                    <FaBook style={{ fontSize: '2.5rem', color: 'var(--primary-color)' }} />
                                </div>
                                <h5>Study Anywhere</h5>
                                <Card.Text>
                                    Access your flashcards on any device, making it easy to study during short breaks or on the go.
                                </Card.Text>
                            </Card.Body>
                        </Card>
                    </Col>
                    <Col md={4} className="mb-4">
                        <Card className="h-100 shadow-sm">
                            <Card.Body className="text-center">
                                <div className="feature-icon mb-3">
                                    <FaChartBar style={{ fontSize: '2.5rem', color: 'var(--primary-color)' }} />
                                </div>
                                <h5>Track Progress</h5>
                                <Card.Text>
                                    Monitor your learning progress with quiz results and statistics to focus on areas that need improvement.
                                </Card.Text>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>

                {/* Call to Action */}
                <div className="text-center my-5 py-3">
                    <h3 className="mb-3">Ready to start learning?</h3>
                    <Button as={Link} to="/flashcards" size="lg" variant="primary">
                        View All Flashcards
                    </Button>
                </div>
            </Container>
        </div>
    );
};

export default HomePage; 