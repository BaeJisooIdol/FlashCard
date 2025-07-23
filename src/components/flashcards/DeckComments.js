import React, { useState, useEffect } from 'react';
import { Card, Form, Button, ListGroup, Image, Badge } from 'react-bootstrap';
import { FaStar, FaRegStar, FaComment, FaTrash } from 'react-icons/fa';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import './DeckComments.css';

const DeckComments = ({ deckId }) => {
    const [comments, setComments] = useState([]);
    const [ratings, setRatings] = useState([]);
    const [newComment, setNewComment] = useState('');
    const [userRating, setUserRating] = useState(0);
    const [loading, setLoading] = useState(false);
    const [averageRating, setAverageRating] = useState(0);
    const { user } = useAuth();
    const { showSuccess, showError } = useToast();

    // Fetch comments and ratings on component mount
    useEffect(() => {
        if (deckId) {
            fetchComments();
            fetchRatings();
        }
    }, [deckId]);

    const fetchComments = async () => {
        try {
            setLoading(true);
            const data = await api.getComments(deckId);
            setComments(data);
        } catch (error) {
            console.error('Error fetching comments:', error);
            showError('Failed to fetch comments');
        } finally {
            setLoading(false);
        }
    };

    const fetchRatings = async () => {
        try {
            const data = await api.getDeckRatings(deckId);
            setRatings(data);

            // Calculate average rating
            if (data.length > 0) {
                const total = data.reduce((sum, rating) => sum + rating.score, 0);
                setAverageRating(Math.round((total / data.length) * 10) / 10);
            }

            // Set user's rating if they've already rated
            if (user) {
                const userRatingObj = data.find(r => r.userId === user.id);
                if (userRatingObj) {
                    setUserRating(userRatingObj.score);
                }
            }
        } catch (error) {
            console.error('Error fetching ratings:', error);
        }
    };

    const handleCommentSubmit = async (e) => {
        e.preventDefault();

        if (!newComment.trim()) {
            return;
        }

        try {
            setLoading(true);
            await api.addComment(deckId, newComment);
            setNewComment('');
            fetchComments();
            showSuccess('Comment added successfully');
        } catch (error) {
            console.error('Error adding comment:', error);
            showError('Failed to add comment');
        } finally {
            setLoading(false);
        }
    };

    const handleRatingChange = async (rating) => {
        try {
            setUserRating(rating);
            await api.rateDeck(deckId, rating);
            fetchRatings();
            showSuccess('Rating submitted successfully');
        } catch (error) {
            console.error('Error submitting rating:', error);
            showError('Failed to submit rating');
        }
    };

    const handleDeleteComment = async (commentId) => {
        try {
            setLoading(true);
            // In a real app, you would have an endpoint to delete a comment
            await fetch(`http://localhost:5000/comments/${commentId}`, {
                method: 'DELETE'
            });
            fetchComments();
            showSuccess('Comment deleted successfully');
        } catch (error) {
            console.error('Error deleting comment:', error);
            showError('Failed to delete comment');
        } finally {
            setLoading(false);
        }
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
    };

    return (
        <div className="deck-comments mt-4">
            <Card className="shadow-sm mb-4">
                <Card.Header>
                    <div className="d-flex justify-content-between align-items-center">
                        <h5 className="mb-0">
                            <FaStar className="me-2 text-warning" />
                            Rate this deck
                        </h5>
                        {averageRating > 0 && (
                            <Badge bg="warning" text="dark" className="p-2">
                                {averageRating} / 5 ({ratings.length} {ratings.length === 1 ? 'rating' : 'ratings'})
                            </Badge>
                        )}
                    </div>
                </Card.Header>
                <Card.Body>
                    <div className="d-flex justify-content-center">
                        {[1, 2, 3, 4, 5].map((star) => (
                            <span
                                key={star}
                                className="fs-3 mx-1"
                                style={{ cursor: 'pointer' }}
                                onClick={() => handleRatingChange(star)}
                            >
                                {star <= userRating ? (
                                    <FaStar className="text-warning" />
                                ) : (
                                    <FaRegStar className="text-warning" />
                                )}
                            </span>
                        ))}
                    </div>
                </Card.Body>
            </Card>

            <Card className="shadow-sm mb-4">
                <Card.Header>
                    <h5 className="mb-0">
                        <FaComment className="me-2" />
                        Comments ({comments.length})
                    </h5>
                </Card.Header>
                <Card.Body>
                    <Form onSubmit={handleCommentSubmit} className="mb-4">
                        <Form.Group className="mb-3">
                            <Form.Label>Add a comment</Form.Label>
                            <Form.Control
                                as="textarea"
                                rows={3}
                                placeholder="Write your comment here..."
                                value={newComment}
                                onChange={(e) => setNewComment(e.target.value)}
                                required
                            />
                        </Form.Group>
                        <Button
                            variant="primary"
                            type="submit"
                            disabled={loading || !newComment.trim()}
                        >
                            {loading ? 'Posting...' : 'Post Comment'}
                        </Button>
                    </Form>

                    {comments.length > 0 ? (
                        <ListGroup variant="flush" className="comment-list">
                            {comments.map((comment) => (
                                <ListGroup.Item key={comment.id} className="py-3">
                                    <div className="d-flex align-items-start">
                                        <Image
                                            src={comment.user.avatar}
                                            alt={comment.user.username}
                                            roundedCircle
                                            width="40"
                                            height="40"
                                            className="me-2"
                                        />
                                        <div className="flex-grow-1">
                                            <div className="d-flex justify-content-between align-items-center">
                                                <h6 className="mb-0">{comment.user.username}</h6>
                                                <small className="text-muted">{formatDate(comment.createdAt)}</small>
                                            </div>
                                            <p className="mt-2 mb-0">{comment.content}</p>
                                        </div>
                                        {user && user.id === comment.userId && (
                                            <Button
                                                variant="link"
                                                className="text-danger p-0 ms-2"
                                                onClick={() => handleDeleteComment(comment.id)}
                                                disabled={loading}
                                            >
                                                <FaTrash />
                                            </Button>
                                        )}
                                    </div>
                                </ListGroup.Item>
                            ))}
                        </ListGroup>
                    ) : (
                        <div className="text-center py-4">
                            <p className="text-muted">No comments yet. Be the first to comment!</p>
                        </div>
                    )}
                </Card.Body>
            </Card>
        </div>
    );
};

export default DeckComments; 