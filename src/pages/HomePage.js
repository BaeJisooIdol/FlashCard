import React from 'react';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { FaBook, FaChartBar, FaShare, FaVolumeUp, FaUsers, FaUserPlus } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';

const HomePage = () => {
    const { isAuthenticated } = useAuth();

    return (
        <Container className="py-5 fade-in">
            <Row className="mb-5">
                <Col>
                    <div className="text-center">
                        <h1 className="display-4 mb-4">Welcome to FlashCard App</h1>
                        <p className="lead">
                            Create, study, and master any subject with our powerful flashcard system.
                            Now with text-to-speech, sharing, and collaboration features!
                        </p>
                        {!isAuthenticated && (
                            <div className="mt-4">
                                <Button as={Link} to="/register" variant="primary" size="lg" className="me-3">
                                    <FaUserPlus className="me-2" />
                                    Sign Up Free
                                </Button>
                                <Button as={Link} to="/login" variant="outline-primary" size="lg">
                                    Login
                                </Button>
                            </div>
                        )}
                    </div>
                </Col>
            </Row>

            <h2 className="text-center mb-4">Features</h2>
            <Row className="mb-5">
                <Col md={4} className="mb-4">
                    <Card className="h-100 shadow-sm">
                        <Card.Body className="text-center">
                            <div className="feature-icon mb-3">
                                <FaBook className="text-primary" style={{ fontSize: '3rem' }} />
                            </div>
                            <Card.Title>Create & Study</Card.Title>
                            <Card.Text>
                                Create custom flashcards and organize them into decks.
                                Study at your own pace with our intuitive interface.
                            </Card.Text>
                            <Button
                                as={Link}
                                to={isAuthenticated ? "/flashcards" : "/register"}
                                variant="outline-primary"
                            >
                                Get Started
                            </Button>
                        </Card.Body>
                    </Card>
                </Col>
                <Col md={4} className="mb-4">
                    <Card className="h-100 shadow-sm">
                        <Card.Body className="text-center">
                            <div className="feature-icon mb-3">
                                <FaVolumeUp className="text-success" style={{ fontSize: '3rem' }} />
                            </div>
                            <Card.Title>Text-to-Speech</Card.Title>
                            <Card.Text>
                                Listen to your flashcards with our text-to-speech feature.
                                Perfect for language learning and auditory learners.
                            </Card.Text>
                            <Button
                                as={Link}
                                to={isAuthenticated ? "/study" : "/register"}
                                variant="outline-success"
                            >
                                Try It Out
                            </Button>
                        </Card.Body>
                    </Card>
                </Col>
                <Col md={4} className="mb-4">
                    <Card className="h-100 shadow-sm">
                        <Card.Body className="text-center">
                            <div className="feature-icon mb-3">
                                <FaChartBar className="text-info" style={{ fontSize: '3rem' }} />
                            </div>
                            <Card.Title>Track Progress</Card.Title>
                            <Card.Text>
                                Monitor your study progress with detailed statistics.
                                See your improvement over time and focus on weak areas.
                            </Card.Text>
                            <Button
                                as={Link}
                                to={isAuthenticated ? "/dashboard" : "/register"}
                                variant="outline-info"
                            >
                                View Dashboard
                            </Button>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>

            <h2 className="text-center mb-4">New Features</h2>
            <Row>
                <Col md={6} className="mb-4">
                    <Card className="h-100 shadow-sm border-primary">
                        <Card.Body className="text-center">
                            <div className="feature-icon mb-3">
                                <FaShare className="text-primary" style={{ fontSize: '3rem' }} />
                            </div>
                            <Card.Title>Share & Collaborate</Card.Title>
                            <Card.Text>
                                Share your flashcard decks with friends or make them public.
                                Collaborate on decks with other users in real-time.
                                Add comments and ratings to public decks.
                            </Card.Text>
                            <Button
                                as={Link}
                                to="/shared-decks"
                                variant="primary"
                            >
                                Explore Shared Decks
                            </Button>
                        </Card.Body>
                    </Card>
                </Col>
                <Col md={6} className="mb-4">
                    <Card className="h-100 shadow-sm border-success">
                        <Card.Body className="text-center">
                            <div className="feature-icon mb-3">
                                <FaUsers className="text-success" style={{ fontSize: '3rem' }} />
                            </div>
                            <Card.Title>User Profiles</Card.Title>
                            <Card.Text>
                                Create your personal profile with a custom avatar.
                                Keep track of your flashcards, study progress, and shared decks.
                                Connect with other learners and build your knowledge together.
                            </Card.Text>
                            <Button
                                as={Link}
                                to={isAuthenticated ? "/profile" : "/register"}
                                variant="success"
                            >
                                {isAuthenticated ? "View Profile" : "Create Profile"}
                            </Button>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
};

export default HomePage; 