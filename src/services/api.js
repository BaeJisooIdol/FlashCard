import axios from 'axios';

const API_URL = 'http://localhost:5000';

export const api = {
    // Flashcard methods
    getFlashcards: async () => {
        const response = await axios.get(`${API_URL}/flashcards`);
        return response.data;
    },

    getFlashcardById: async (id) => {
        const response = await axios.get(`${API_URL}/flashcards/${id}`);
        return response.data;
    },

    createFlashcard: async (flashcard) => {
        const response = await axios.post(`${API_URL}/flashcards`, flashcard);
        return response.data;
    },

    updateFlashcard: async (id, flashcard) => {
        const response = await axios.put(`${API_URL}/flashcards/${id}`, flashcard);
        return response.data;
    },

    deleteFlashcard: async (id) => {
        await axios.delete(`${API_URL}/flashcards/${id}`);
        return true;
    },

    // Category methods
    getCategories: async () => {
        const response = await axios.get(`${API_URL}/categories`);
        // Extract the category names from the category objects
        return response.data.map(category => category.name);
    },

    // Quiz results methods
    saveQuizResult: async (result) => {
        const response = await axios.post(`${API_URL}/quizResults`, result);
        return response.data;
    },

    getQuizResults: async () => {
        const response = await axios.get(`${API_URL}/quizResults`);
        return response.data;
    }
};

export default api; 