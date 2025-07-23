import React, { useContext } from 'react';
import { Navbar as BootstrapNavbar, Container, Nav, Button, Image, NavDropdown } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { FaSun, FaMoon, FaUser, FaShare } from 'react-icons/fa';
import { ThemeContext } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';
import './Navbar.css';

const Navbar = () => {
    const { darkMode, toggleDarkMode } = useContext(ThemeContext);
    const { user, logout, isAuthenticated } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <BootstrapNavbar
            bg={darkMode ? 'dark' : 'light'}
            variant={darkMode ? 'dark' : 'light'}
            expand="lg"
            className="shadow-sm"
        >
            <Container>
                <BootstrapNavbar.Brand as={Link} to="/" className="fw-bold">
                    FlashCard App
                </BootstrapNavbar.Brand>
                <BootstrapNavbar.Toggle aria-controls="basic-navbar-nav" />
                <BootstrapNavbar.Collapse id="basic-navbar-nav">
                    <Nav className="me-auto">
                        <Nav.Link as={Link} to="/">Home</Nav.Link>
                        <Nav.Link as={Link} to="/shared-decks">
                            <FaShare className="me-1" />
                            Shared Decks
                        </Nav.Link>
                        {isAuthenticated && (
                            <>
                                <Nav.Link as={Link} to="/flashcards">Flashcards</Nav.Link>
                                <Nav.Link as={Link} to="/study">Study</Nav.Link>
                                <Nav.Link as={Link} to="/quiz">Quiz</Nav.Link>
                                <Nav.Link as={Link} to="/dashboard">Dashboard</Nav.Link>
                            </>
                        )}
                    </Nav>
                    <Nav className='d-flex align-items-center'>
                        <Button
                            variant={darkMode ? 'outline-light' : 'outline-dark'}
                            size="sm"
                            onClick={toggleDarkMode}
                            className="d-inline-flex align-items-center me-2"
                            style={{ borderRadius: '100%', height: '30px', width: '30px' }}
                        >
                            {darkMode ? <FaSun /> : <FaMoon />}
                        </Button>

                        {isAuthenticated ? (
                            <NavDropdown
                                title={
                                    <span>
                                        <Image
                                            src={user?.avatar || 'https://ui-avatars.com/api/?name=User&background=random'}
                                            roundedCircle
                                            width="24"
                                            height="24"
                                            className="me-1"
                                        />
                                        {user?.username}
                                    </span>
                                }
                                id="user-dropdown"
                                align="end"
                            >
                                <NavDropdown.Item as={Link} to="/profile">My Profile</NavDropdown.Item>
                                <NavDropdown.Item as={Link} to="/flashcards">My Flashcards</NavDropdown.Item>
                                <NavDropdown.Divider />
                                <NavDropdown.Item onClick={handleLogout}>Logout</NavDropdown.Item>
                            </NavDropdown>
                        ) : (
                            <>
                                <Nav.Link as={Link} to="/login" className="me-2">Login</Nav.Link>
                                <Button
                                    as={Link}
                                    to="/register"
                                    variant="primary"
                                    size="sm"
                                >
                                    <FaUser className="me-1" />
                                    Register
                                </Button>
                            </>
                        )}
                    </Nav>
                </BootstrapNavbar.Collapse>
            </Container>
        </BootstrapNavbar>
    );
};

export default Navbar; 