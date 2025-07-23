import React, { useState } from 'react';
import { Row, Col, Form, InputGroup } from 'react-bootstrap';
import { FaSearch, FaFilter } from 'react-icons/fa';
import FlashcardItem from './FlashcardItem';

const FlashcardList = ({ flashcards, onDelete, categories }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('');

    // Filter flashcards based on search term and category
    const filteredFlashcards = flashcards.filter(flashcard => {
        const matchesSearch = flashcard.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
            flashcard.answer.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesCategory = selectedCategory === '' || flashcard.category === selectedCategory;

        return matchesSearch && matchesCategory;
    });

    return (
        <>
            <Row className="mb-4">
                <Col md={6}>
                    <InputGroup>
                        <InputGroup.Text>
                            <FaSearch />
                        </InputGroup.Text>
                        <Form.Control
                            type="text"
                            placeholder="Search flashcards..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </InputGroup>
                </Col>
                <Col md={6}>
                    <InputGroup>
                        <InputGroup.Text>
                            <FaFilter />
                        </InputGroup.Text>
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
                    </InputGroup>
                </Col>
            </Row>

            {filteredFlashcards.length === 0 ? (
                <div className="text-center my-5">
                    <h4>No flashcards found</h4>
                    <p>Try changing your search or filter criteria</p>
                </div>
            ) : (
                <Row>
                    {filteredFlashcards.map((flashcard) => (
                        <Col key={flashcard.id} md={6} lg={4} className="mb-4">
                            <FlashcardItem
                                flashcard={flashcard}
                                onDelete={onDelete}
                                showDeleteModal={onDelete}
                            />
                        </Col>
                    ))}
                </Row>
            )}
        </>
    );
};

export default FlashcardList; 