import React from 'react';
import { Container } from 'react-bootstrap';
import Navbar from './Navbar';
import Footer from './Footer';

const Layout = ({ children }) => {
    return (
        <>
            <Navbar />
            <Container>
                <main className="py-3 min-vh-100">{children}</main>
            </Container>
            <Footer />
        </>
    );
};

export default Layout; 