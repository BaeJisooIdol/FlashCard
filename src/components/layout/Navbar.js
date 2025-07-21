import React, { useContext } from 'react';
import { Navbar, Container, Nav, Form } from 'react-bootstrap';
import { NavLink } from 'react-router-dom';
import { FaSun, FaMoon, FaHome, FaPlus, FaList, FaBook, FaChartBar, FaTachometerAlt } from 'react-icons/fa';
import { ThemeContext } from '../../context/ThemeContext';

const AppNavbar = () => {
    const { darkMode, toggleDarkMode } = useContext(ThemeContext);

    return (
        <Navbar
            expand="lg"
            bg={darkMode ? 'dark' : 'light'}
            variant={darkMode ? 'dark' : 'light'}
            className="mb-4 shadow-sm"
        >
            <Container>
                <Navbar.Brand as={NavLink} to="/" className="d-flex align-items-center">
                    <FaBook className="me-2" /> FlashCard App
                </Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="me-auto">
                        <Nav.Link as={NavLink} to="/">
                            <FaHome className="me-1" />
                            <span>Home</span>
                        </Nav.Link>
                        <Nav.Link as={NavLink} to="/flashcards">
                            <FaList className="me-1" />
                            <span>All Flashcards</span>
                        </Nav.Link>
                        <Nav.Link as={NavLink} to="/create">
                            <FaPlus className="me-1" />
                            <span>Create Flashcard</span>
                        </Nav.Link>
                        <Nav.Link as={NavLink} to="/study">
                            <FaBook className="me-1" />
                            <span>Study Mode</span>
                        </Nav.Link>
                        <Nav.Link as={NavLink} to="/quiz">
                            <FaChartBar className="me-1" />
                            <span>Quiz Mode</span>
                        </Nav.Link>
                        <Nav.Link as={NavLink} to="/dashboard">
                            <FaTachometerAlt className="me-1" />
                            <span>Dashboard</span>
                        </Nav.Link>
                    </Nav>
                    <Form className="d-flex align-items-center">
                        <Form.Label for="theme-switch" style={{ userSelect: 'none', cursor: 'pointer' }}>{
                            darkMode
                                ? <FaMoon className="text-warning" />
                                : <FaSun className="text-warning" />
                        }</Form.Label>
                        <Form.Check
                            type="switch"
                            id="theme-switch"
                            className="me-2 d-none"
                            checked={darkMode}
                            onChange={toggleDarkMode}
                        />
                    </Form>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
};

export default AppNavbar; 