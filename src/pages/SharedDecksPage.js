import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Nav, Badge, Form, InputGroup, Modal, Alert } from 'react-bootstrap';
import { FaSearch, FaShare, FaLock, FaGlobe, FaStar, FaComment, FaUser, FaPlus, FaEdit, FaTrash } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import './SharedDecksPage.css';

const SharedDecksPage = () => {
    const [activeTab, setActiveTab] = useState('public');
    const [publicDecks, setPublicDecks] = useState([]);
    const [sharedWithMe, setSharedWithMe] = useState([]);
    const [myDecks, setMyDecks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const { user, isAuthenticated } = useAuth();
    const { showSuccess, showError } = useToast();

    // State for create/edit deck modal
    const [showDeckModal, setShowDeckModal] = useState(false);
    const [deckFormData, setDeckFormData] = useState({
        name: '',
        description: '',
        isPublic: false
    });
    const [selectedCategories, setSelectedCategories] = useState([]);
    const [categories, setCategories] = useState([]);
    const [editingDeckId, setEditingDeckId] = useState(null);
    const [validated, setValidated] = useState(false);

    // State for delete confirmation
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [deckToDelete, setDeckToDelete] = useState(null);

    useEffect(() => {
        fetchDecks();
    }, [activeTab, isAuthenticated]);

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

    const fetchDecks = async () => {
        try {
            setLoading(true);

            if (activeTab === 'public') {
                const data = await api.getPublicDecks();

                // Fetch additional data for each deck
                const decksWithDetails = await Promise.all(
                    data.map(async (deck) => {
                        // Get flashcard count
                        const flashcards = await api.getFlashcardsByDeck(deck.id);

                        // Get ratings
                        const ratings = await api.getDeckRatings(deck.id);
                        const averageRating = ratings.length > 0
                            ? Math.round((ratings.reduce((sum, r) => sum + r.score, 0) / ratings.length) * 10) / 10
                            : 0;

                        // Get comments
                        const comments = await api.getComments(deck.id);

                        // Get user details
                        const response = await fetch(`http://localhost:5000/users/${deck.userId}`);
                        const user = await response.json();

                        // Determine primary category
                        let primaryCategory = "Uncategorized";
                        if (flashcards.length > 0) {
                            // Count occurrences of each category
                            const categoryCounts = {};
                            flashcards.forEach(card => {
                                if (card.category) {
                                    categoryCounts[card.category] = (categoryCounts[card.category] || 0) + 1;
                                }
                            });

                            // Find the most common category
                            let maxCount = 0;
                            Object.entries(categoryCounts).forEach(([category, count]) => {
                                if (count > maxCount) {
                                    maxCount = count;
                                    primaryCategory = category;
                                }
                            });
                        }

                        return {
                            ...deck,
                            flashcardCount: flashcards.length,
                            averageRating,
                            ratingCount: ratings.length,
                            commentCount: comments.length,
                            primaryCategory,
                            allCategories: Array.from(new Set([...flashcards.map(card => card.category), ...(deck.categories || [])])).filter(Boolean),
                            user
                        };
                    })
                );

                setPublicDecks(decksWithDetails);
            } else if (activeTab === 'shared' && isAuthenticated) {
                const data = await api.getSharedDecks();

                // Fetch additional data for each deck
                const decksWithDetails = await Promise.all(
                    data.map(async (deck) => {
                        // Get flashcard count
                        const flashcards = await api.getFlashcardsByDeck(deck.id);

                        // Get user details
                        const response = await fetch(`http://localhost:5000/users/${deck.userId}`);
                        const user = await response.json();

                        // Determine primary category
                        let primaryCategory = "Uncategorized";
                        if (flashcards.length > 0) {
                            // Count occurrences of each category
                            const categoryCounts = {};
                            flashcards.forEach(card => {
                                if (card.category) {
                                    categoryCounts[card.category] = (categoryCounts[card.category] || 0) + 1;
                                }
                            });

                            // Find the most common category
                            let maxCount = 0;
                            Object.entries(categoryCounts).forEach(([category, count]) => {
                                if (count > maxCount) {
                                    maxCount = count;
                                    primaryCategory = category;
                                }
                            });
                        }

                        return {
                            ...deck,
                            flashcardCount: flashcards.length,
                            primaryCategory,
                            allCategories: Array.from(new Set([...flashcards.map(card => card.category), ...(deck.categories || [])])).filter(Boolean),
                            user
                        };
                    })
                );

                setSharedWithMe(decksWithDetails);
            } else if (activeTab === 'my-decks' && isAuthenticated && user) {
                const data = await api.getDecks(user.id);

                // Fetch additional data for each deck
                const decksWithDetails = await Promise.all(
                    data.map(async (deck) => {
                        // Get flashcard count
                        const flashcards = await api.getFlashcardsByDeck(deck.id);

                        // Determine primary category
                        let primaryCategory = "Uncategorized";
                        if (flashcards.length > 0) {
                            // Count occurrences of each category
                            const categoryCounts = {};
                            flashcards.forEach(card => {
                                if (card.category) {
                                    categoryCounts[card.category] = (categoryCounts[card.category] || 0) + 1;
                                }
                            });

                            // Find the most common category
                            let maxCount = 0;
                            Object.entries(categoryCounts).forEach(([category, count]) => {
                                if (count > maxCount) {
                                    maxCount = count;
                                    primaryCategory = category;
                                }
                            });
                        }

                        return {
                            ...deck,
                            flashcardCount: flashcards.length,
                            primaryCategory,
                            allCategories: Array.from(new Set([...flashcards.map(card => card.category), ...(deck.categories || [])])).filter(Boolean)
                        };
                    })
                );

                setMyDecks(decksWithDetails);
            }
        } catch (error) {
            console.error('Error fetching decks:', error);
            showError('Failed to fetch decks');
        } finally {
            setLoading(false);
        }
    };

    const handleCreateDeck = () => {
        setDeckFormData({
            name: '',
            description: '',
            isPublic: false,
            categories: []
        });
        setSelectedCategories([]);
        setEditingDeckId(null);
        setValidated(false);
        setShowDeckModal(true);
    };

    const handleEditDeck = (deck) => {
        setDeckFormData({
            name: deck.name,
            description: deck.description || '',
            isPublic: deck.isPublic || false,
            categories: deck.categories || []
        });
        setSelectedCategories(deck.categories || []);
        setEditingDeckId(deck.id);
        setValidated(false);
        setShowDeckModal(true);
    };

    const handleDeleteDeck = (deck) => {
        setDeckToDelete(deck);
        setShowDeleteModal(true);
    };

    const handleDeckFormChange = (e) => {
        const { name, value, type, checked } = e.target;
        setDeckFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleDeckFormSubmit = async (e) => {
        e.preventDefault();
        const form = e.currentTarget;

        if (form.checkValidity() === false) {
            e.stopPropagation();
            setValidated(true);
            return;
        }

        try {
            setLoading(true);
            console.log("Selected categories:", selectedCategories);

            if (editingDeckId) {
                // Update existing deck
                await api.updateDeck(editingDeckId, deckFormData);

                // If categories are selected, add flashcards from those categories
                if (selectedCategories && selectedCategories.length > 0) {
                    console.log(`Adding flashcards from categories "${selectedCategories.join(', ')}" to existing deck ${editingDeckId}`);
                    const result = await api.addFlashcardsFromCategoriesToDeck(editingDeckId, selectedCategories);
                    if (result.success) {
                        showSuccess(`Deck updated successfully. ${result.message}`);
                    } else {
                        showError(`Deck updated but ${result.message}`);
                    }
                } else {
                    showSuccess('Deck updated successfully. No changes to flashcards.');
                }
            } else {
                // Create new deck
                const newDeck = {
                    ...deckFormData,
                    userId: user.id,
                    categories: selectedCategories
                };
                console.log(`Creating new deck with categories "${selectedCategories.join(', ')}"`);
                const createdDeck = await api.createDeck(newDeck, selectedCategories);

                // Check if flashcards were added by checking if the selected categories are valid
                if (selectedCategories && selectedCategories.length > 0) {
                    // Get the flashcards that were added to verify
                    const deckFlashcards = await api.getFlashcardsByDeck(createdDeck.id);
                    console.log(`Retrieved ${deckFlashcards.length} flashcards for new deck ${createdDeck.id}`);
                    if (deckFlashcards && deckFlashcards.length > 0) {
                        showSuccess(`Deck created successfully with ${deckFlashcards.length} flashcards from ${selectedCategories.length} categories.`);
                    } else {
                        showSuccess('Deck created successfully, but no flashcards were available to add from the selected categories.');
                    }
                } else {
                    showSuccess('Empty deck created successfully. You can add flashcards later.');
                }
            }

            setShowDeckModal(false);

            // Refresh decks if on my-decks tab
            if (activeTab === 'my-decks') {
                fetchDecks();
            }
        } catch (error) {
            console.error('Error saving deck:', error);
            showError('Failed to save deck');
        } finally {
            setLoading(false);
        }
    };

    const confirmDeleteDeck = async () => {
        if (!deckToDelete) return;

        try {
            setLoading(true);
            await api.deleteDeck(deckToDelete.id);
            showSuccess('Deck deleted successfully');
            setShowDeleteModal(false);
            setDeckToDelete(null);

            // Refresh decks
            fetchDecks();
        } catch (error) {
            console.error('Error deleting deck:', error);
            showError('Failed to delete deck');
        } finally {
            setLoading(false);
        }
    };

    const getFilteredDecks = () => {
        let decks;

        if (activeTab === 'public') {
            decks = publicDecks;
        } else if (activeTab === 'shared') {
            decks = sharedWithMe;
        } else {
            decks = myDecks;
        }

        return decks.filter(deck =>
            deck.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (deck.description && deck.description.toLowerCase().includes(searchTerm.toLowerCase())) ||
            (deck.user && deck.user.username && deck.user.username.toLowerCase().includes(searchTerm.toLowerCase()))
        );
    };

    const filteredDecks = getFilteredDecks();

    return (
        <Container className="py-5 fade-in">
            <h1 className="mb-4">Flashcard Decks</h1>

            <div className="d-flex justify-content-between align-items-center mb-4">
                <Nav variant="tabs">
                    <Nav.Item>
                        <Nav.Link
                            active={activeTab === 'public'}
                            onClick={() => setActiveTab('public')}
                        >
                            <FaGlobe className="me-2" />
                            Public Decks
                        </Nav.Link>
                    </Nav.Item>
                    {isAuthenticated && (
                        <>
                            <Nav.Item>
                                <Nav.Link
                                    active={activeTab === 'shared'}
                                    onClick={() => setActiveTab('shared')}
                                >
                                    <FaShare className="me-2" />
                                    Shared With Me
                                </Nav.Link>
                            </Nav.Item>
                            <Nav.Item>
                                <Nav.Link
                                    active={activeTab === 'my-decks'}
                                    onClick={() => setActiveTab('my-decks')}
                                >
                                    <FaUser className="me-2" />
                                    My Decks
                                </Nav.Link>
                            </Nav.Item>
                        </>
                    )}
                </Nav>

                {isAuthenticated && activeTab === 'my-decks' && (
                    <Button
                        variant="primary"
                        onClick={handleCreateDeck}
                    >
                        <FaPlus className="me-2" />
                        Create Deck
                    </Button>
                )}
            </div>

            <InputGroup className="mb-4">
                <InputGroup.Text>
                    <FaSearch />
                </InputGroup.Text>
                <Form.Control
                    placeholder="Search decks by name, description, or creator..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </InputGroup>

            {loading ? (
                <div className="text-center py-5">Loading...</div>
            ) : filteredDecks.length > 0 ? (
                <Row>
                    {filteredDecks.map(deck => (
                        <Col md={6} lg={4} key={deck.id} className="mb-4">
                            <Card className="h-100 shadow-sm">
                                <Card.Header>
                                    <div className="d-flex justify-content-between align-items-center">
                                        <h5 className="mb-0">{deck.name}</h5>
                                        {deck.isPublic ? (
                                            <Badge bg="success">
                                                <FaGlobe className="me-1" /> Public
                                            </Badge>
                                        ) : (
                                            <Badge bg="secondary">
                                                <FaLock className="me-1" /> Private
                                            </Badge>
                                        )}
                                    </div>
                                </Card.Header>
                                <Card.Body>
                                    {activeTab !== 'my-decks' && deck.user && (
                                        <div className="mb-3 d-flex align-items-center">
                                            <img
                                                src={deck.user.avatar}
                                                alt={deck.user.username}
                                                style={{ width: '30px', height: '30px', borderRadius: '50%' }}
                                                className="me-2"
                                            />
                                            <span className="text-muted">
                                                <FaUser className="me-1" /> {deck.user.username}
                                            </span>
                                        </div>
                                    )}

                                    <p className="card-text">{deck.description || 'No description provided.'}</p>

                                    <div className="d-flex justify-content-between mt-3">
                                        <div className="d-flex flex-wrap gap-2">
                                            <Badge bg="primary">{deck.flashcardCount} cards</Badge>
                                            {deck.allCategories && deck.allCategories.map((category, index) => (
                                                <Badge key={index} bg="info">{category}</Badge>
                                            ))}
                                        </div>

                                        {activeTab === 'public' && (
                                            <div>
                                                <Badge bg="info" className="me-2">
                                                    <FaComment className="me-1" /> {deck.commentCount}
                                                </Badge>
                                                <Badge bg="warning" text="dark">
                                                    <FaStar className="me-1" />
                                                    {deck.averageRating > 0 ? deck.averageRating : 'No ratings'}
                                                </Badge>
                                            </div>
                                        )}

                                        {activeTab === 'shared' && (
                                            <Badge
                                                bg={deck.permissions === 'write' ? 'success' : 'info'}
                                            >
                                                {deck.permissions === 'write' ? 'Can Edit' : 'View Only'}
                                            </Badge>
                                        )}


                                    </div>
                                </Card.Body>
                                <Card.Footer>
                                    <div className={activeTab === 'my-decks' ? 'd-flex gap-2' : 'd-grid'}>
                                        <Button
                                            as={Link}
                                            to={`/shared-deck/${deck.id}`}
                                            variant="primary"
                                            className={activeTab === 'my-decks' ? 'flex-grow-1' : ''}
                                        >
                                            View Deck
                                        </Button>

                                        {activeTab === 'my-decks' && (
                                            <>
                                                <Button
                                                    variant="outline-success"
                                                    onClick={() => handleEditDeck(deck)}
                                                >
                                                    <FaEdit />
                                                </Button>
                                                <Button
                                                    variant="outline-danger"
                                                    onClick={() => handleDeleteDeck(deck)}
                                                >
                                                    <FaTrash />
                                                </Button>
                                            </>
                                        )}
                                    </div>
                                </Card.Footer>
                            </Card>
                        </Col>
                    ))}
                </Row>
            ) : (
                <div className="text-center py-5">
                    <p className="text-muted">
                        {activeTab === 'public'
                            ? 'No public decks found.'
                            : activeTab === 'shared'
                                ? 'No decks have been shared with you yet.'
                                : 'You haven\'t created any decks yet.'}
                    </p>

                    {activeTab === 'my-decks' && (
                        <Button
                            variant="primary"
                            onClick={handleCreateDeck}
                            className="mt-3"
                        >
                            <FaPlus className="me-2" />
                            Create Your First Deck
                        </Button>
                    )}
                </div>
            )}

            {/* Create/Edit Deck Modal */}
            <Modal show={showDeckModal} onHide={() => setShowDeckModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>{editingDeckId ? 'Edit Deck' : 'Create New Deck'}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form noValidate validated={validated} onSubmit={handleDeckFormSubmit}>
                        <Form.Group className="mb-3">
                            <Form.Label>Deck Name</Form.Label>
                            <Form.Control
                                type="text"
                                name="name"
                                value={deckFormData.name}
                                onChange={handleDeckFormChange}
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
                                value={deckFormData.description}
                                onChange={handleDeckFormChange}
                            />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Check
                                type="checkbox"
                                label="Make this deck public"
                                name="isPublic"
                                checked={deckFormData.isPublic}
                                onChange={handleDeckFormChange}
                            />
                            <Form.Text className="text-muted">
                                Public decks can be viewed by anyone and appear in search results.
                            </Form.Text>
                        </Form.Group>

                        <Form.Group className="mb-4">
                            <Form.Label>Add flashcards from categories (optional)</Form.Label>
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
                                {editingDeckId
                                    ? 'Select categories to add flashcards to this deck, or leave empty to keep it as is. Existing flashcards will remain.'
                                    : 'Select categories to add flashcards to this deck, or leave empty to create an empty deck.'}
                            </Form.Text>
                        </Form.Group>

                        <div className="d-flex justify-content-end">
                            <Button
                                variant="secondary"
                                onClick={() => setShowDeckModal(false)}
                                className="me-2"
                            >
                                Cancel
                            </Button>
                            <Button
                                variant="primary"
                                type="submit"
                                disabled={loading}
                            >
                                {loading ? 'Saving...' : (editingDeckId ? 'Update' : 'Create')}
                            </Button>
                        </div>
                    </Form>
                </Modal.Body>
            </Modal>

            {/* Delete Confirmation Modal */}
            <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Delete Deck</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <p>Are you sure you want to delete the deck "{deckToDelete?.name}"?</p>
                    <Alert variant="warning">
                        This action cannot be undone. The deck will be deleted but the flashcards will remain in the system.
                    </Alert>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
                        Cancel
                    </Button>
                    <Button variant="danger" onClick={confirmDeleteDeck} disabled={loading}>
                        {loading ? 'Deleting...' : 'Delete'}
                    </Button>
                </Modal.Footer>
            </Modal>
        </Container>
    );
};

export default SharedDecksPage; 