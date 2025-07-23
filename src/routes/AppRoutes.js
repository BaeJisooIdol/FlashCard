import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import HomePage from '../pages/HomePage';
import FlashcardPage from '../pages/FlashcardPage';
import CreateFlashcardPage from '../pages/CreateFlashcardPage';
import EditFlashcardPage from '../pages/EditFlashcardPage';
import FlashcardDetailPage from '../pages/FlashcardDetailPage';
import StudyPage from '../pages/StudyPage';
import QuizPage from '../pages/QuizPage';
import DashboardPage from '../pages/DashboardPage';
import NotFoundPage from '../pages/NotFoundPage';
import LoginPage from '../pages/LoginPage';
import RegisterPage from '../pages/RegisterPage';
import ProfilePage from '../pages/ProfilePage';
import SharedDecksPage from '../pages/SharedDecksPage';
import SharedDeckDetailPage from '../pages/SharedDeckDetailPage';
import EditDeckPage from '../pages/EditDeckPage';
import Layout from '../components/layout/Layout';
import { useAuth } from '../context/AuthContext';

// Protected route component
const ProtectedRoute = ({ children }) => {
    const { isAuthenticated, loading } = useAuth();

    if (loading) {
        return <div className="text-center py-5">Loading...</div>;
    }

    if (!isAuthenticated) {
        return <Navigate to="/login" />;
    }

    return children;
};

const AppRoutes = () => {
    return (
        <Routes>
            {/* Public routes */}
            <Route path="/" element={<Layout><HomePage /></Layout>} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/shared-decks" element={<Layout><SharedDecksPage /></Layout>} />
            <Route path="/shared-deck/:id" element={<Layout><SharedDeckDetailPage /></Layout>} />

            {/* Protected routes */}
            <Route path="/dashboard" element={
                <ProtectedRoute>
                    <Layout><DashboardPage /></Layout>
                </ProtectedRoute>
            } />
            <Route path="/profile" element={
                <ProtectedRoute>
                    <Layout><ProfilePage /></Layout>
                </ProtectedRoute>
            } />
            <Route path="/flashcards" element={
                <ProtectedRoute>
                    <Layout><FlashcardPage /></Layout>
                </ProtectedRoute>
            } />
            <Route path="/flashcards/:id" element={
                <ProtectedRoute>
                    <Layout><FlashcardDetailPage /></Layout>
                </ProtectedRoute>
            } />
            <Route path="/flashcards/edit/:id" element={
                <ProtectedRoute>
                    <Layout><EditFlashcardPage /></Layout>
                </ProtectedRoute>
            } />
            <Route path="/create" element={
                <ProtectedRoute>
                    <Layout><CreateFlashcardPage /></Layout>
                </ProtectedRoute>
            } />
            <Route path="/edit-deck/:id" element={
                <ProtectedRoute>
                    <Layout><EditDeckPage /></Layout>
                </ProtectedRoute>
            } />
            <Route path="/study" element={
                <ProtectedRoute>
                    <Layout><StudyPage /></Layout>
                </ProtectedRoute>
            } />
            <Route path="/study/:deckId" element={
                <ProtectedRoute>
                    <Layout><StudyPage /></Layout>
                </ProtectedRoute>
            } />
            <Route path="/quiz" element={
                <ProtectedRoute>
                    <Layout><QuizPage /></Layout>
                </ProtectedRoute>
            } />
            <Route path="/quiz/:deckId" element={
                <ProtectedRoute>
                    <Layout><QuizPage /></Layout>
                </ProtectedRoute>
            } />

            {/* Catch all */}
            <Route path="*" element={<Layout><NotFoundPage /></Layout>} />
        </Routes>
    );
};

export default AppRoutes;