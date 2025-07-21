import React, { useState, useEffect } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import FlashcardForm from '../components/flashcards/FlashcardForm';
import { useToast } from '../context/ToastContext';
import api from '../services/api';

const CreateFlashcardPage = () => {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const { showSuccess, showError } = useToast();

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const categoriesData = await api.getCategories();
                setCategories(categoriesData);
                setLoading(false);
            } catch (err) {
                console.error('Error fetching categories:', err);
                showError('Failed to load categories');
                setLoading(false);
            }
        };

        fetchCategories();
    }, [showError]);

    const handleSubmit = async (formData) => {
        try {
            await api.createFlashcard(formData);
            showSuccess('Flashcard created successfully');
            navigate('/flashcards');
        } catch (err) {
            console.error('Error creating flashcard:', err);
            showError('Failed to create flashcard');
        }
    };

    if (loading) {
        return <div className="text-center py-5">Loading...</div>;
    }

    return (
        <Container className="fade-in">
            <Row>
                <Col lg={8} className="mx-auto">
                    <h1 className="mb-4">Create New Flashcard</h1>
                    <p className="mb-4">
                        Fill in the form below to create a new flashcard. All fields are required.
                    </p>
                    <FlashcardForm
                        categories={categories}
                        onSubmit={handleSubmit}
                    />
                </Col>
            </Row>
        </Container>
    );
};

export default CreateFlashcardPage; 