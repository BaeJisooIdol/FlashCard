import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Button } from 'react-bootstrap';
import { FaPlus } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import FlashcardList from '../components/flashcards/FlashcardList';
import DeleteConfirmationModal from '../components/common/DeleteConfirmationModal';
import { useToast } from '../context/ToastContext';
import api from '../services/api';

const FlashcardPage = () => {
    const [flashcards, setFlashcards] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [deleteId, setDeleteId] = useState(null);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const { showSuccess, showError } = useToast();

    useEffect(() => {
        // Load flashcards and categories when the component mounts
        const fetchData = async () => {
            setLoading(true);
            try {
                const flashcardsData = await api.getFlashcards();
                const categoriesData = await api.getCategories();
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

    const handleDelete = async (id) => {
        setDeleteId(id);
        setShowDeleteModal(true);
    };

    const confirmDelete = async () => {
        try {
            await api.deleteFlashcard(deleteId);
            setFlashcards(flashcards.filter(flashcard => flashcard.id !== deleteId));
            showSuccess('Flashcard deleted successfully');
        } catch (err) {
            console.error('Error deleting flashcard:', err);
            showError('Failed to delete flashcard');
        }
        setShowDeleteModal(false);
        setDeleteId(null);
    };

    const cancelDelete = () => {
        setShowDeleteModal(false);
        setDeleteId(null);
    };

    if (loading) {
        return <div className="text-center py-5">Loading flashcards...</div>;
    }

    if (error) {
        return <div className="text-center py-5 text-danger">{error}</div>;
    }

    return (
        <Container className="fade-in">
            <Row className="mb-4">
                <Col>
                    <h1>All Flashcards</h1>
                    <p>Browse, search and manage your flashcards</p>
                </Col>
                <Col xs="auto">
                    <Button as={Link} to="/create" variant="primary">
                        <FaPlus className="me-1" /> Add New
                    </Button>
                </Col>
            </Row>

            {flashcards.length === 0 ? (
                <div className="text-center py-5">
                    <h3>No flashcards yet</h3>
                    <p>Create your first flashcard to get started</p>
                    <Button as={Link} to="/create" variant="primary" className="mt-2">
                        <FaPlus className="me-1" /> Create Flashcard
                    </Button>
                </div>
            ) : (
                <FlashcardList
                    flashcards={flashcards}
                    categories={categories}
                    onDelete={handleDelete}
                />
            )}

            <DeleteConfirmationModal
                show={showDeleteModal}
                onHide={cancelDelete}
                onConfirm={confirmDelete}
                itemName="flashcard"
            />
        </Container>
    );
};

export default FlashcardPage; 