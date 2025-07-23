import React, { useState } from 'react';
import { Container, Row, Col, Card, Form, Button, Alert } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { FaSignInAlt } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';

const LoginPage = () => {
    const [formData, setFormData] = useState({
        username: '',
        password: '',
    });
    const [validated, setValidated] = useState(false);
    const [error, setError] = useState('');
    const { login, loading } = useAuth();
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const form = e.currentTarget;

        if (form.checkValidity() === false) {
            e.stopPropagation();
            setValidated(true);
            return;
        }

        setError('');
        const { username, password } = formData;
        const result = await login(username, password);

        if (result.success) {
            navigate('/dashboard');
        } else {
            setError(result.message || 'Login failed. Please check your credentials.');
        }
    };

    return (
        <Container className="py-5 fade-in">
            <Row className="justify-content-center">
                <Col md={6} lg={5}>
                    <Card className="shadow">
                        <Card.Body className="p-4">
                            <div className="text-center mb-4">
                                <h2 className="mb-3">Login</h2>
                                <p className="text-muted">Sign in to access your flashcards</p>
                            </div>

                            {error && <Alert variant="danger">{error}</Alert>}

                            <Form noValidate validated={validated} onSubmit={handleSubmit}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Username</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="username"
                                        placeholder="Enter your username"
                                        value={formData.username}
                                        onChange={handleChange}
                                        required
                                    />
                                    <Form.Control.Feedback type="invalid">
                                        Please provide a username.
                                    </Form.Control.Feedback>
                                </Form.Group>

                                <Form.Group className="mb-4">
                                    <Form.Label>Password</Form.Label>
                                    <Form.Control
                                        type="password"
                                        name="password"
                                        placeholder="Enter your password"
                                        value={formData.password}
                                        onChange={handleChange}
                                        required
                                    />
                                    <Form.Control.Feedback type="invalid">
                                        Please provide a password.
                                    </Form.Control.Feedback>
                                </Form.Group>

                                <Button
                                    variant="primary"
                                    type="submit"
                                    className="w-100 mb-3"
                                    disabled={loading}
                                >
                                    {loading ? 'Logging in...' : (
                                        <>
                                            <FaSignInAlt className="me-2" />
                                            Login
                                        </>
                                    )}
                                </Button>
                            </Form>

                            <div className="text-center mt-3">
                                <p>
                                    Don't have an account?{' '}
                                    <Link to="/register" className="text-decoration-none">
                                        Register
                                    </Link>
                                </p>
                                <Link to="/" className="text-decoration-none">
                                    Back to Home
                                </Link>
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
};

export default LoginPage; 