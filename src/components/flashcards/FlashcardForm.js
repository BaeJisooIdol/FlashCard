import React, { useState, useEffect } from 'react';
import { Form, Button, Card } from 'react-bootstrap';
import { FaSave, FaTimes } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const FlashcardForm = ({ flashcard = {}, categories = [], onSubmit, isEditing = false }) => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        question: '',
        answer: '',
        categories: [],
    });
    const [validated, setValidated] = useState(false);

    useEffect(() => {
        if (isEditing && flashcard) {
            setFormData({
                question: flashcard.question || '',
                answer: flashcard.answer || '',
                categories: flashcard.categories || [],
            });
        }
    }, [isEditing, flashcard]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleCategoriesChange = (e) => {
        const selectedOptions = Array.from(e.target.selectedOptions, option => option.value);
        setFormData(prev => ({
            ...prev,
            categories: selectedOptions
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const form = e.currentTarget;

        if (form.checkValidity() === false) {
            e.stopPropagation();
            setValidated(true);
            return;
        }

        onSubmit(formData);
    };

    return (
        <Card className="shadow-sm">
            <Card.Body>
                <Form noValidate validated={validated} onSubmit={handleSubmit}>
                    <Form.Group className="mb-3">
                        <Form.Label>Question</Form.Label>
                        <Form.Control
                            type="text"
                            name="question"
                            placeholder="Enter the question"
                            value={formData.question}
                            onChange={handleChange}
                            required
                        />
                        <Form.Control.Feedback type="invalid">
                            Please provide a question.
                        </Form.Control.Feedback>
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>Answer</Form.Label>
                        <Form.Control
                            as="textarea"
                            rows={3}
                            name="answer"
                            placeholder="Enter the answer"
                            value={formData.answer}
                            onChange={handleChange}
                            required
                        />
                        <Form.Control.Feedback type="invalid">
                            Please provide an answer.
                        </Form.Control.Feedback>
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>Categories</Form.Label>
                        <Form.Select
                            name="categories"
                            value={formData.categories}
                            onChange={handleCategoriesChange}
                            required
                            multiple
                        >
                            {categories.map((category) => (
                                <option key={category} value={category}>
                                    {category}
                                </option>
                            ))}
                        </Form.Select>
                        <Form.Text className="text-muted">
                            Hold Ctrl (or Cmd on Mac) to select multiple categories.
                        </Form.Text>
                        <Form.Control.Feedback type="invalid">
                            Please select at least one category.
                        </Form.Control.Feedback>
                    </Form.Group>

                    <div className="d-flex justify-content-between">
                        <Button variant="primary" type="submit">
                            <FaSave className="me-2" />
                            {isEditing ? 'Update Flashcard' : 'Create Flashcard'}
                        </Button>
                        <Button variant="secondary" onClick={() => navigate(-1)}>
                            <FaTimes className="me-2" />
                            Cancel
                        </Button>
                    </div>
                </Form>
            </Card.Body>
        </Card>
    );
};

export default FlashcardForm; 