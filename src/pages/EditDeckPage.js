import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Form, Button, Alert } from 'react-bootstrap';
import { FaSave, FaArrowLeft } from 'react-icons/fa';
import { Link, useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';
import { useToast } from '../context/ToastContext';

const EditDeckPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { showSuccess, showError } = useToast();

    const [formData, setFormData] = useState({
        name: '',
        description: '',
        isPublic: false
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [validated, setValidated] = useState(false);
    const [categories, setCategories] = useState([]);
    const [selectedCategories, setSelectedCategories] = useState([]);

    useEffect(() => {
        const fetchDeckData = async () => {
            try {
                setLoading(true);
                const deckData = await api.getDeckById(id);
                setFormData({
                    name: deckData.name || '',
                    description: deckData.description || '',
                    isPublic: deckData.isPublic || false
                });

                // If deck has categories, set them
                if (deckData.categories && Array.isArray(deckData.categories)) {
                    setSelectedCategories(deckData.categories);
                }
            } catch (error) {
                console.error('Error fetching deck:', error);
                setError('Failed to load deck data. Please try again.');
                showError('Failed to load deck data');
            } finally {
                setLoading(false);
            }
        };

        fetchDeckData();
    }, [id, showError]);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const categoriesData = await api.getCategories();
                console.log("Fetched categories:", categoriesData);
                setCategories(categoriesData);
            } catch (error) {
                console.error('Error fetching categories:', error);
                showError('Failed to load categories');
            }
        };

        fetchCategories();
    }, [showError]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    // We're now handling category changes directly in the checkbox onChange event

    const handleSubmit = async (e) => {
        e.preventDefault();
        const form = e.currentTarget;

        if (form.checkValidity() === false) {
            e.stopPropagation();
            setValidated(true);
            return;
        }

        try {
            setLoading(true);
            // Add selected categories to the form data
            const updatedFormData = {
                ...formData,
                categories: selectedCategories
            };

            await api.updateDeck(id, updatedFormData);

            // If categories are selected, add flashcards from those categories
            if (selectedCategories.length > 0) {
                console.log(`Adding flashcards from categories "${selectedCategories.join(', ')}" to deck ${id}`);
                const result = await api.addFlashcardsFromCategoriesToDeck(id, selectedCategories);
                if (result.success) {
                    showSuccess(`Deck updated successfully. ${result.message}`);
                } else {
                    showError(`Deck updated but ${result.message}`);
                }
            } else {
                showSuccess('Deck updated successfully. No changes to flashcards.');
            }

            navigate(`/shared-deck/${id}`);
        } catch (error) {
            console.error('Error updating deck:', error);
            setError('Failed to update deck. Please try again.');
            showError('Failed to update deck');
            setLoading(false);
        }
    };

    if (loading && !formData.name) {
        return <div className="text-center py-5">Loading...</div>;
    }

    return (
        <Container className="py-5 fade-in">
            <Row className="mb-4">
                <Col>
                    <Button
                        as={Link}
                        to={`/shared-deck/${id}`}
                        variant="outline-secondary"
                    >
                        <FaArrowLeft className="me-2" />
                        Back to Deck
                    </Button>
                </Col>
            </Row>

            <Row className="justify-content-center">
                <Col md={8}>
                    <Card className="shadow-sm">
                        <Card.Header>
                            <h2 className="mb-0">Edit Deck</h2>
                        </Card.Header>
                        <Card.Body>
                            {error && <Alert variant="danger">{error}</Alert>}

                            <Form noValidate validated={validated} onSubmit={handleSubmit}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Deck Name</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        required
                                    />
                                    <Form.Control.Feedback type="invalid">
                                        Please provide a deck name.
                                    </Form.Control.Feedback>
                                </Form.Group>

                                <Form.Group className="mb-3">
                                    <Form.Label>Description</Form.Label>
                                    <Form.Control
                                        as="textarea"
                                        rows={3}
                                        name="description"
                                        value={formData.description}
                                        onChange={handleChange}
                                    />
                                </Form.Group>

                                <Form.Group className="mb-3">
                                    <Form.Check
                                        type="checkbox"
                                        label="Make this deck public"
                                        name="isPublic"
                                        checked={formData.isPublic}
                                        onChange={handleChange}
                                    />
                                    <Form.Text className="text-muted">
                                        Public decks can be viewed by anyone and appear in search results.
                                    </Form.Text>
                                </Form.Group>

                                <Form.Group className="mb-4">
                                    <Form.Label>Add flashcards from categories</Form.Label>
                                    <div className="d-flex flex-wrap gap-2">
                                        {categories.map((category) => (
                                            <Form.Check
                                                key={category}
                                                type="checkbox"
                                                label={category}
                                                value={category}
                                                checked={selectedCategories.includes(category)}
                                                onChange={(e) => {
                                                    const newSelectedCategories = [...selectedCategories];
                                                    if (e.target.checked) {
                                                        newSelectedCategories.push(category);
                                                    } else {
                                                        newSelectedCategories.splice(newSelectedCategories.indexOf(category), 1);
                                                    }
                                                    setSelectedCategories(newSelectedCategories);
                                                }}
                                            />
                                        ))}
                                    </div>
                                    <Form.Text className="text-muted">
                                        Select categories to add flashcards to this deck. Existing flashcards will remain.
                                    </Form.Text>
                                </Form.Group>

                                <div className="d-grid">
                                    <Button
                                        variant="primary"
                                        type="submit"
                                        disabled={loading}
                                    >
                                        <FaSave className="me-2" />
                                        {loading ? 'Saving...' : 'Save Changes'}
                                    </Button>
                                </div>
                            </Form>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
};

export default EditDeckPage; 