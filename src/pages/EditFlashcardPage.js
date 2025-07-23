import React, { useState, useEffect } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { useParams, useNavigate } from 'react-router-dom';
import FlashcardForm from '../components/flashcards/FlashcardForm';
import { useToast } from '../context/ToastContext';
import api from '../services/api';

const EditFlashcardPage = () => {
    const [flashcard, setFlashcard] = useState(null);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { id } = useParams();
    const navigate = useNavigate();
    const { showSuccess, showError } = useToast();

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch both flashcard and categories in parallel
                const [flashcardData, categoriesData] = await Promise.all([
                    api.getFlashcardById(id),
                    api.getCategories()
                ]);

                // Check if the flashcard belongs to the current user
                const currentUser = api.getCurrentUser();
                if (!currentUser || (flashcardData.userId && flashcardData.userId !== currentUser.id)) {
                    setError('You do not have permission to edit this flashcard');
                    setLoading(false);
                    return;
                }

                setFlashcard(flashcardData);
                setCategories(categoriesData);
                setLoading(false);
            } catch (err) {
                console.error('Error fetching data:', err);
                setError('Failed to fetch flashcard data. Please try again later.');
                setLoading(false);
                showError('Failed to load flashcard data');
            }
        };

        fetchData();
    }, [id, showError]);

    const handleSubmit = async (formData) => {
        try {
            // Preserve userId from the original flashcard
            const updatedFlashcard = {
                ...formData,
                userId: flashcard.userId
            };

            await api.updateFlashcard(id, updatedFlashcard);
            showSuccess('Flashcard updated successfully');
            navigate('/flashcards');
        } catch (err) {
            console.error('Error updating flashcard:', err);
            showError('Failed to update flashcard');
        }
    };

    if (loading) {
        return <div className="text-center py-5">Loading...</div>;
    }

    if (error) {
        return <div className="text-center py-5 text-danger">{error}</div>;
    }

    if (!flashcard) {
        return <div className="text-center py-5">Flashcard not found</div>;
    }

    return (
        <Container className="fade-in">
            <Row>
                <Col lg={8} className="mx-auto">
                    <h1 className="mb-4">Edit Flashcard</h1>
                    <p className="mb-4">
                        Update the form below to edit this flashcard.
                    </p>
                    <FlashcardForm
                        flashcard={flashcard}
                        categories={categories}
                        onSubmit={handleSubmit}
                        isEditing={true}
                    />
                </Col>
            </Row>
        </Container>
    );
};

export default EditFlashcardPage; 