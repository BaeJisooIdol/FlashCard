import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Form, Button, Image, Alert } from 'react-bootstrap';
import { FaSave, FaUpload } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const ProfilePage = () => {
    const { user, updateProfile, loading, isAuthenticated } = useAuth();
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        avatar: '',
    });
    const [validated, setValidated] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [previewAvatar, setPreviewAvatar] = useState('');

    useEffect(() => {
        // Redirect if not authenticated
        if (!isAuthenticated && !loading) {
            navigate('/login');
        }

        // Set form data from user
        if (user) {
            setFormData({
                username: user.username || '',
                email: user.email || '',
                avatar: user.avatar || '',
            });
            setPreviewAvatar(user.avatar || '');
        }
    }, [user, isAuthenticated, loading, navigate]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleAvatarChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        // Check file type
        if (!file.type.match('image.*')) {
            setError('Please select an image file');
            return;
        }

        // Check file size (max 2MB)
        if (file.size > 2 * 1024 * 1024) {
            setError('Image size should be less than 2MB');
            return;
        }

        const reader = new FileReader();
        reader.onload = (event) => {
            const avatarDataUrl = event.target.result;
            setFormData((prev) => ({
                ...prev,
                avatar: avatarDataUrl,
            }));
            setPreviewAvatar(avatarDataUrl);
        };
        reader.readAsDataURL(file);
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
        setSuccess('');

        const result = await updateProfile({
            username: formData.username,
            email: formData.email,
            avatar: formData.avatar,
        });

        if (result.success) {
            setSuccess('Profile updated successfully');
        } else {
            setError(result.message || 'Failed to update profile');
        }
    };

    if (loading) {
        return <div className="text-center py-5">Loading...</div>;
    }

    return (
        <Container className="py-5 fade-in">
            <h1 className="mb-4">My Profile</h1>

            <Row>
                <Col md={4} className="mb-4">
                    <Card className="shadow-sm">
                        <Card.Body className="text-center">
                            <div className="mb-3">
                                <Image
                                    src={previewAvatar || 'https://ui-avatars.com/api/?name=User&background=random'}
                                    roundedCircle
                                    className="profile-avatar"
                                    style={{ width: '150px', height: '150px', objectFit: 'cover' }}
                                />
                            </div>
                            <h4>{user?.username}</h4>
                            <p className="text-muted">{user?.email}</p>

                            <div className="mt-3">
                                <Form.Group controlId="avatarUpload">
                                    <Form.Label className="btn btn-outline-primary btn-sm">
                                        <FaUpload className="me-2" />
                                        Change Avatar
                                        <Form.Control
                                            type="file"
                                            accept="image/*"
                                            onChange={handleAvatarChange}
                                            style={{ display: 'none' }}
                                        />
                                    </Form.Label>
                                </Form.Group>
                            </div>
                        </Card.Body>
                    </Card>
                </Col>

                <Col md={8}>
                    <Card className="shadow-sm">
                        <Card.Body>
                            <h4 className="mb-4">Edit Profile</h4>

                            {error && <Alert variant="danger">{error}</Alert>}
                            {success && <Alert variant="success">{success}</Alert>}

                            <Form noValidate validated={validated} onSubmit={handleSubmit}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Username</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="username"
                                        value={formData.username}
                                        onChange={handleChange}
                                        required
                                    />
                                    <Form.Control.Feedback type="invalid">
                                        Please provide a username.
                                    </Form.Control.Feedback>
                                </Form.Group>

                                <Form.Group className="mb-4">
                                    <Form.Label>Email</Form.Label>
                                    <Form.Control
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        required
                                    />
                                    <Form.Control.Feedback type="invalid">
                                        Please provide a valid email.
                                    </Form.Control.Feedback>
                                </Form.Group>

                                <Button
                                    variant="primary"
                                    type="submit"
                                    disabled={loading}
                                >
                                    <FaSave className="me-2" />
                                    Save Changes
                                </Button>
                            </Form>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
};

export default ProfilePage; 