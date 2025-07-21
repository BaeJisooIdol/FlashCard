import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Form, Button, Card } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { FaSearch } from 'react-icons/fa';
import StudyCard from '../components/study/StudyCard';
import { useToast } from '../context/ToastContext';
import api from '../services/api';

const StudyPage = () => {
    const [flashcards, setFlashcards] = useState([]);
    const [filteredFlashcards, setFilteredFlashcards] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [selectedCategory, setSelectedCategory] = useState('');
    const { showError } = useToast();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [flashcardsData, categoriesData] = await Promise.all([
                    api.getFlashcards(),
                    api.getCategories()
                ]);

                setFlashcards(flashcardsData);
                setFilteredFlashcards(flashcardsData);
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

    useEffect(() => {
        // Filter flashcards when selected category changes
        if (selectedCategory) {
            const filtered = flashcards.filter(
                (flashcard) => flashcard.category === selectedCategory
            );
            setFilteredFlashcards(filtered);
            setCurrentIndex(0); // Reset to first card when filter changes
        } else {
            setFilteredFlashcards(flashcards);
            setCurrentIndex(0);
        }
    }, [selectedCategory, flashcards]);

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
                <p>Create some flashcards to start studying</p>
                <Button as={Link} to="/create" variant="primary" className="mt-3">
                    Create Flashcard
                </Button>
            </Container>
        );
    }

    return (
        <Container className="fade-in">
            <h1 className="mb-4">Study Mode</h1>
            <p className="mb-4">
                Flip through your flashcards to study. Click on a card to reveal the answer.
            </p>

            <Row className="mb-4">
                <Col md={6}>
                    <Form.Group>
                        <Form.Label>
                            <FaSearch className="me-2" /> Filter by Category
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

            {filteredFlashcards.length === 0 ? (
                <Card className="text-center p-5">
                    <Card.Body>
                        <h4>No flashcards found for this category</h4>
                        <p>Try selecting a different category or create new flashcards</p>
                    </Card.Body>
                </Card>
            ) : (
                <StudyCard
                    flashcards={filteredFlashcards}
                    currentIndex={currentIndex}
                    setCurrentIndex={setCurrentIndex}
                />
            )}
        </Container>
    );
};

export default StudyPage; 