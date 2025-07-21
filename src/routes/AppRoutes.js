import React from 'react';
import { Routes, Route } from 'react-router-dom';
import HomePage from '../pages/HomePage';
import FlashcardPage from '../pages/FlashcardPage';
import CreateFlashcardPage from '../pages/CreateFlashcardPage';
import EditFlashcardPage from '../pages/EditFlashcardPage';
import FlashcardDetailPage from '../pages/FlashcardDetailPage';
import StudyPage from '../pages/StudyPage';
import QuizPage from '../pages/QuizPage';
import DashboardPage from '../pages/DashboardPage';
import NotFoundPage from '../pages/NotFoundPage';
import Layout from '../components/layout/Layout';

const AppRoutes = () => {
    return (
        <Routes>
            <Route path="/" element={<Layout><HomePage /></Layout>} />
            <Route path="/flashcards" element={<Layout><FlashcardPage /></Layout>} />
            <Route path="/flashcards/:id" element={<Layout><FlashcardDetailPage /></Layout>} />
            <Route path="/flashcards/edit/:id" element={<Layout><EditFlashcardPage /></Layout>} />
            <Route path="/create" element={<Layout><CreateFlashcardPage /></Layout>} />
            <Route path="/study" element={<Layout><StudyPage /></Layout>} />
            <Route path="/quiz" element={<Layout><QuizPage /></Layout>} />
            <Route path="/dashboard" element={<Layout><DashboardPage /></Layout>} />
            <Route path="*" element={<Layout><NotFoundPage /></Layout>} />
        </Routes>
    );
};

export default AppRoutes; 