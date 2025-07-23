import React from 'react';
import { Container } from 'react-bootstrap';
import Navbar from './Navbar';
import Footer from './Footer';
import './Layout.css';

const Layout = ({ children }) => {
    return (
        <div className="layout-wrapper">
            <Navbar />
            <div className="layout-content">
                <Container>
                    <main className="py-3">{children}</main>
                </Container>
            </div>
            <Footer />
        </div>
    );
};

export default Layout; 