import React, { useContext } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { FaHeart, FaGithub, FaLinkedin } from 'react-icons/fa';
import { ThemeContext } from '../../context/ThemeContext';

const Footer = () => {
    const { darkMode } = useContext(ThemeContext);

    return (
        <footer className={`py-4 mt-5 ${darkMode ? 'bg-dark text-white' : 'bg-light text-dark'}`}>
            <Container>
                <Row className="text-center">
                    <Col md={6} className="text-md-start">
                        <p className="mb-0">&copy; {new Date().getFullYear()} FlashCard App</p>
                    </Col>
                    <Col md={6} className="text-md-end">
                        <p className="mb-0">
                            Made with <FaHeart className="text-danger mx-1" /> by Group 03
                        </p>
                    </Col>
                </Row>
            </Container>
        </footer>
    );
};

export default Footer; 