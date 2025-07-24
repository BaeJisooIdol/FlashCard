import axios from 'axios';

const API_URL = 'http://localhost:5000';

// Create axios instance with auth header
const axiosInstance = axios.create({
    baseURL: API_URL
});

// Add interceptor to add auth token to requests
axiosInstance.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('authToken');
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export const api = {
    // Auth methods
    login: async (username, password) => {
        // For json-server, we'll simulate by checking if the user exists
        const response = await axios.get(`${API_URL}/users?username=${username}`);
        console.log(response);
        const user = response.data[0];

        if (user && user.password === password) {
            // Here we'll simulate by creating a simple token
            const token = btoa(`${username}:${password}`);
            localStorage.setItem('authToken', token);
            localStorage.setItem('currentUser', JSON.stringify({
                id: user.id,
                username: user.username,
                email: user.email,
                avatar: user.avatar
            }));
            return { success: true, user: { id: user.id, username: user.username, email: user.email, avatar: user.avatar } };
        }

        return { success: false, message: 'Invalid credentials' };
    },

    register: async (userData) => {
        // Check if username already exists
        const usernameCheck = await axios.get(`${API_URL}/users?username=${userData.username}`);
        if (usernameCheck.data.length > 0) {
            return { success: false, message: 'Username already exists' };
        }

        // Check if email already exists
        const emailCheck = await axios.get(`${API_URL}/users?email=${userData.email}`);
        if (emailCheck.data.length > 0) {
            return { success: false, message: 'Email already exists' };
        }

        // Generate avatar if not provided
        if (!userData.avatar) {
            userData.avatar = `https://ui-avatars.com/api/?name=${encodeURIComponent(userData.username)}&background=random`;
        }

        // Add timestamps
        userData.createdAt = new Date().toISOString();

        // Create user
        const response = await axios.post(`${API_URL}/users`, userData);

        // Auto login after registration
        if (response.data) {
            return await api.login(userData.username, userData.password);
        }

        return { success: false, message: 'Registration failed' };
    },

    logout: () => {
        localStorage.removeItem('authToken');
        localStorage.removeItem('currentUser');
        return { success: true };
    },

    getCurrentUser: () => {
        const userStr = localStorage.getItem('currentUser');
        return userStr ? JSON.parse(userStr) : null;
    },

    updateUserProfile: async (userId, userData) => {
        const response = await axiosInstance.put(`${API_URL}/users/${userId}`, userData);

        // Update local storage with new user data
        if (response.data) {
            const currentUser = api.getCurrentUser();
            if (currentUser && currentUser.id === userId) {
                localStorage.setItem('currentUser', JSON.stringify({
                    ...currentUser,
                    ...userData
                }));
            }
        }

        return response.data;
    },

    // Deck methods
    getDecks: async (userId = null) => {
        try {
            let url = `${API_URL}/decks`;
            if (userId) {
                url += `?userId=${userId}`;
            }
            const response = await axiosInstance.get(url);
            return response.data;
        } catch (error) {
            console.error('Error fetching decks:', error);
            return [];
        }
    },

    getPublicDecks: async () => {
        try {
            const response = await axios.get(`${API_URL}/decks?isPublic=true`);
            return response.data;
        } catch (error) {
            console.error('Error fetching public decks:', error);
            // Return empty array instead of throwing error
            return [];
        }
    },

    getDeckById: async (id) => {
        const response = await axiosInstance.get(`${API_URL}/decks/${id}`);
        return response.data;
    },

    createDeck: async (deck, categories = []) => {
        // Add timestamps
        deck.createdAt = new Date().toISOString();
        deck.updatedAt = new Date().toISOString();

        // Ensure categories is always an array
        if (!deck.categories) {
            deck.categories = [];
        }

        // Create the deck first
        const response = await axiosInstance.post(`${API_URL}/decks`, deck);
        const newDeck = response.data;

        // If categories are provided, add all flashcards from those categories belonging to the user
        if (categories && categories.length > 0) {
            try {
                const currentUser = api.getCurrentUser();
                if (currentUser) {
                    // Get all flashcards belonging to the user
                    const allFlashcardsResponse = await axiosInstance.get(`${API_URL}/flashcards?userId=${currentUser.id}`);
                    const allFlashcards = allFlashcardsResponse.data;

                    console.log(`Attempting to add flashcards from categories: "${categories.join(', ')}"`);
                    console.log(`Available flashcards:`, allFlashcards.map(f => ({ id: f.id, category: f.category })));

                    // Filter flashcards by categories and user, and only those that don't already belong to a deck
                    const userFlashcardsInCategories = allFlashcards.filter(
                        flashcard => {
                            const categoryMatch = categories.includes(flashcard.category);
                            const userMatch = flashcard.userId === currentUser.id;
                            const noDeckMatch = !flashcard.deckId || flashcard.deckId === null || flashcard.deckId === "";

                            if (!categoryMatch) {
                                console.log(`Flashcard ${flashcard.id} category "${flashcard.category}" doesn't match any of "${categories.join(', ')}"`);
                            }

                            return categoryMatch && userMatch && noDeckMatch;
                        }
                    );

                    console.log(`Found ${userFlashcardsInCategories.length} matching flashcards`);

                    // Update each flashcard to be associated with this deck
                    for (const flashcard of userFlashcardsInCategories) {
                        const updatedFlashcard = { ...flashcard, deckId: newDeck.id };
                        await axiosInstance.put(`${API_URL}/flashcards/${flashcard.id}`, updatedFlashcard);
                    }
                }
            } catch (error) {
                console.error('Error adding flashcards from categories to deck:', error);
            }
        }

        return newDeck;
    },

    updateDeck: async (id, deck) => {
        // Update timestamp
        deck.updatedAt = new Date().toISOString();

        // Ensure categories is always an array
        if (!deck.categories) {
            deck.categories = [];
        }

        // First, get the existing deck data
        const existingDeck = await api.getDeckById(id);

        // Merge the existing deck with the updates
        const updatedDeck = { ...existingDeck, ...deck };

        const response = await axiosInstance.put(`${API_URL}/decks/${id}`, updatedDeck);
        return response.data;
    },

    deleteDeck: async (id) => {
        // Delete the deck only, not the flashcards
        await axiosInstance.delete(`${API_URL}/decks/${id}`);
        return true;
    },

    // Method to add flashcards from a category to an existing deck
    addFlashcardsFromCategoryToDeck: async (deckId, category) => {
        // If category is empty/none, don't add any flashcards
        if (!category || category === "none" || category === "") {
            return { success: true, message: "Empty deck created successfully" };
        }

        try {
            const currentUser = api.getCurrentUser();
            if (currentUser) {
                // Get all flashcards belonging to the current user
                const allFlashcardsResponse = await axiosInstance.get(`${API_URL}/flashcards?userId=${currentUser.id}`);
                const allFlashcards = allFlashcardsResponse.data;

                console.log(`Attempting to add flashcards from category: "${category}" to deck: ${deckId}`);
                console.log(`Available flashcards:`, allFlashcards.map(f => ({ id: f.id, category: f.category })));

                // Get existing flashcards in the deck to avoid duplicates
                const existingDeckFlashcards = await api.getFlashcardsByDeck(deckId);
                const existingFlashcardIds = new Set(existingDeckFlashcards.map(f => f.id));

                // Filter flashcards by category and user, excluding ones already in the deck
                const userFlashcardsInCategory = allFlashcards.filter(
                    flashcard => {
                        const categoryMatch = flashcard.category === category;
                        const userMatch = flashcard.userId === currentUser.id;
                        const notInDeckAlready = !existingFlashcardIds.has(flashcard.id);
                        const noDeckMatch = !flashcard.deckId || flashcard.deckId === null || flashcard.deckId === "";

                        if (!categoryMatch) {
                            console.log(`Flashcard ${flashcard.id} category "${flashcard.category}" doesn't match "${category}"`);
                        }

                        return categoryMatch && userMatch && notInDeckAlready && noDeckMatch;
                    }
                );

                console.log(`Found ${userFlashcardsInCategory.length} matching flashcards to add to deck ${deckId}`);

                // Update each flashcard to be associated with this deck
                for (const flashcard of userFlashcardsInCategory) {
                    const updatedFlashcard = { ...flashcard, deckId: deckId };
                    await axiosInstance.put(`${API_URL}/flashcards/${flashcard.id}`, updatedFlashcard);
                }

                return {
                    success: true,
                    message: `Added ${userFlashcardsInCategory.length} flashcards from category ${category} to deck`
                };
            }
            return { success: false, message: "User not authenticated" };
        } catch (error) {
            console.error('Error adding flashcards from category to deck:', error);
            return { success: false, message: error.message };
        }
    },

    // Method to add flashcards from multiple categories to an existing deck
    addFlashcardsFromCategoriesToDeck: async (deckId, categories) => {
        // If categories array is empty, don't add any flashcards
        if (!categories || !Array.isArray(categories) || categories.length === 0) {
            return { success: true, message: "No categories selected" };
        }

        try {
            const currentUser = api.getCurrentUser();
            if (currentUser) {
                // Get all flashcards belonging to the current user
                const allFlashcardsResponse = await axiosInstance.get(`${API_URL}/flashcards?userId=${currentUser.id}`);
                const allFlashcards = allFlashcardsResponse.data;

                console.log(`Attempting to add flashcards from categories: "${categories.join(', ')}" to deck: ${deckId}`);
                console.log(`Available flashcards:`, allFlashcards.map(f => ({ id: f.id, category: f.category })));

                // Get existing flashcards in the deck to avoid duplicates
                const existingDeckFlashcards = await api.getFlashcardsByDeck(deckId);
                const existingFlashcardIds = new Set(existingDeckFlashcards.map(f => f.id));

                // Filter flashcards by categories and user, excluding ones already in the deck
                const userFlashcardsInCategories = allFlashcards.filter(
                    flashcard => {
                        const categoryMatch = categories.includes(flashcard.category);
                        const userMatch = flashcard.userId === currentUser.id;
                        const notInDeckAlready = !existingFlashcardIds.has(flashcard.id);
                        const noDeckMatch = !flashcard.deckId || flashcard.deckId === null || flashcard.deckId === "";

                        if (!categoryMatch && flashcard.category) {
                            console.log(`Flashcard ${flashcard.id} category "${flashcard.category}" doesn't match any of "${categories.join(', ')}"`);
                        }

                        return categoryMatch && userMatch && notInDeckAlready && noDeckMatch;
                    }
                );

                console.log(`Found ${userFlashcardsInCategories.length} matching flashcards to add to deck ${deckId}`);

                // Update each flashcard to be associated with this deck
                for (const flashcard of userFlashcardsInCategories) {
                    const updatedFlashcard = { ...flashcard, deckId: deckId };
                    await axiosInstance.put(`${API_URL}/flashcards/${flashcard.id}`, updatedFlashcard);
                }

                return {
                    success: true,
                    message: `Added ${userFlashcardsInCategories.length} flashcards from ${categories.length} categories to deck`
                };
            }
            return { success: false, message: "User not authenticated" };
        } catch (error) {
            console.error('Error adding flashcards from categories to deck:', error);
            return { success: false, message: error.message };
        }
    },

    // Flashcard methods
    getFlashcards: async () => {
        try {
            const currentUser = api.getCurrentUser();
            if (currentUser) {
                const response = await axiosInstance.get(`${API_URL}/flashcards?userId=${currentUser.id}`);
                return response.data;
            }
            return [];
        } catch (error) {
            console.error('Error fetching flashcards:', error);
            return [];
        }
    },

    getFlashcardsByDeck: async (deckId) => {
        try {
            const currentUser = api.getCurrentUser();
            if (!currentUser) {
                return [];
            }

            // First, get the deck to check permissions
            const deck = await api.getDeckById(deckId);

            // If the deck doesn't exist, return empty array
            if (!deck) {
                return [];
            }

            // Check if user is the owner of the deck
            const isOwner = deck.userId === currentUser.id;

            // If not owner, check if the deck is shared with the user
            let hasAccess = isOwner;

            if (!hasAccess && deck.isPublic) {
                // If deck is public, user has access
                hasAccess = true;
            }

            if (!hasAccess) {
                // Check if deck is shared with the user
                try {
                    const response = await axiosInstance.get(`${API_URL}/deckShares?deckId=${deckId}&sharedWithUserId=${currentUser.id}`);
                    hasAccess = response.data.length > 0;
                } catch (error) {
                    console.error('Error checking deck sharing:', error);
                }
            }

            // If user has no access, return empty array
            if (!hasAccess) {
                return [];
            }

            // Get flashcards for this deck
            console.log(`Fetching flashcards for deck ID: ${deckId}`);
            const response = await axiosInstance.get(`${API_URL}/flashcards?deckId=${deckId}`);
            const flashcards = response.data;
            console.log(`Retrieved ${flashcards.length} flashcards with deckId=${deckId}:`,
                flashcards.map(f => ({ id: f.id, question: f.question, deckId: f.deckId })));

            // Ensure we're only returning flashcards that actually belong to this deck
            const filteredFlashcards = flashcards.filter(flashcard => flashcard.deckId === deckId);
            console.log(`After filtering, ${filteredFlashcards.length} flashcards remain for deck ${deckId}`);

            return filteredFlashcards;
        } catch (error) {
            console.error(`Error fetching flashcards for deck ${deckId}:`, error);
            return [];
        }
    },

    getFlashcardById: async (id) => {
        const response = await axiosInstance.get(`${API_URL}/flashcards/${id}`);
        return response.data;
    },

    createFlashcard: async (flashcard) => {
        // Add timestamps and userId
        const currentUser = api.getCurrentUser();
        if (currentUser) {
            flashcard.userId = currentUser.id;
        }

        flashcard.createdAt = new Date().toISOString();
        flashcard.updatedAt = new Date().toISOString();

        const response = await axiosInstance.post(`${API_URL}/flashcards`, flashcard);
        return response.data;
    },

    updateFlashcard: async (id, flashcard) => {
        // Update timestamp
        flashcard.updatedAt = new Date().toISOString();

        // First, get the existing flashcard data
        const existingFlashcard = await api.getFlashcardById(id);

        // Ensure userId is preserved
        if (!flashcard.userId && existingFlashcard.userId) {
            flashcard.userId = existingFlashcard.userId;
        }

        // Merge the existing flashcard with the updates
        const updatedFlashcard = { ...existingFlashcard, ...flashcard };

        const response = await axiosInstance.put(`${API_URL}/flashcards/${id}`, updatedFlashcard);
        return response.data;
    },

    deleteFlashcard: async (id) => {
        try {
            // Get the flashcard first to check ownership
            const flashcard = await api.getFlashcardById(id);
            const currentUser = api.getCurrentUser();

            // Check if the user is authorized to delete this flashcard
            if (!currentUser || (flashcard.userId && flashcard.userId !== currentUser.id)) {
                throw new Error('You do not have permission to delete this flashcard');
            }

            await axiosInstance.delete(`${API_URL}/flashcards/${id}`);
            return true;
        } catch (error) {
            console.error('Error deleting flashcard:', error);
            throw error;
        }
    },

    removeFlashcardFromDeck: async (id) => {
        try {
            // Get the flashcard first
            const flashcard = await api.getFlashcardById(id);
            const currentUser = api.getCurrentUser();

            // Check if the user is authorized to modify this flashcard
            if (!currentUser || (flashcard.userId && flashcard.userId !== currentUser.id)) {
                throw new Error('You do not have permission to modify this flashcard');
            }

            // Update the flashcard to remove the deckId
            const updatedFlashcard = { ...flashcard, deckId: null };
            const response = await axiosInstance.put(`${API_URL}/flashcards/${id}`, updatedFlashcard);
            return response.data;
        } catch (error) {
            console.error('Error removing flashcard from deck:', error);
            throw error;
        }
    },

    // Category methods
    getCategories: async () => {
        const response = await axios.get(`${API_URL}/categories`);
        // Extract the category names from the category objects
        const categories = response.data.map(category => category.name);
        console.log("Retrieved categories:", categories);
        return categories;
    },

    // Quiz results methods
    saveQuizResult: async (result) => {
        // Add user ID from current user
        const currentUser = api.getCurrentUser();
        if (currentUser) {
            result.userId = currentUser.id;
        }

        const response = await axiosInstance.post(`${API_URL}/quizResults`, result);
        return response.data;
    },

    getQuizResults: async (userId = null) => {
        try {
            const currentUser = api.getCurrentUser();
            if (!userId && currentUser) {
                userId = currentUser.id;
            }

            let url = `${API_URL}/quizResults`;
            if (userId) {
                url += `?userId=${userId}`;
            }
            const response = await axiosInstance.get(url);
            return response.data;
        } catch (error) {
            console.error('Error fetching quiz results:', error);
            return [];
        }
    },

    // Sharing methods
    shareDeck: async (deckId, sharedWithUserId, permissions = 'read') => {
        const currentUser = api.getCurrentUser();
        if (!currentUser) {
            return { success: false, message: 'Not authenticated' };
        }

        const shareData = {
            deckId,
            sharedByUserId: currentUser.id,
            sharedWithUserId,
            permissions,
            sharedAt: new Date().toISOString()
        };

        const response = await axiosInstance.post(`${API_URL}/deckShares`, shareData);
        return response.data;
    },

    getSharedDecks: async () => {
        try {
            const currentUser = api.getCurrentUser();
            if (!currentUser) {
                return [];
            }

            const response = await axiosInstance.get(`${API_URL}/deckShares?sharedWithUserId=${currentUser.id}`);

            // Fetch the actual deck data for each shared deck
            const sharedDecks = [];
            for (const share of response.data) {
                try {
                    const deck = await api.getDeckById(share.deckId);
                    sharedDecks.push({
                        ...deck,
                        permissions: share.permissions,
                        sharedBy: share.sharedByUserId
                    });
                } catch (deckError) {
                    console.error(`Error fetching shared deck ${share.deckId}:`, deckError);
                    // Skip this deck and continue with others
                }
            }

            return sharedDecks;
        } catch (error) {
            console.error('Error fetching shared decks:', error);
            return [];
        }
    },

    // Collaborator methods
    addCollaborator: async (deckId, userId, role = 'editor') => {
        const collaboratorData = {
            deckId,
            userId,
            role,
            addedAt: new Date().toISOString()
        };

        const response = await axiosInstance.post(`${API_URL}/collaborators`, collaboratorData);
        return response.data;
    },

    getCollaborators: async (deckId) => {
        const response = await axiosInstance.get(`${API_URL}/collaborators?deckId=${deckId}`);

        // Fetch user details for each collaborator
        const collaborators = [];
        for (const collab of response.data) {
            const userResponse = await axios.get(`${API_URL}/users/${collab.userId}`);
            collaborators.push({
                ...collab,
                user: {
                    id: userResponse.data.id,
                    username: userResponse.data.username,
                    avatar: userResponse.data.avatar
                }
            });
        }

        return collaborators;
    },

    // Comments methods
    addComment: async (deckId, content) => {
        const currentUser = api.getCurrentUser();
        if (!currentUser) {
            return { success: false, message: 'Not authenticated' };
        }

        const commentData = {
            deckId,
            userId: currentUser.id,
            content,
            createdAt: new Date().toISOString()
        };

        const response = await axiosInstance.post(`${API_URL}/comments`, commentData);
        return response.data;
    },

    getComments: async (deckId) => {
        try {
            const response = await axios.get(`${API_URL}/comments?deckId=${deckId}`);

            // Fetch user details for each comment
            const comments = [];
            for (const comment of response.data) {
                try {
                    const userResponse = await axios.get(`${API_URL}/users/${comment.userId}`);
                    comments.push({
                        ...comment,
                        user: {
                            id: userResponse.data.id,
                            username: userResponse.data.username,
                            avatar: userResponse.data.avatar
                        }
                    });
                } catch (userError) {
                    console.error(`Error fetching user for comment ${comment.id}:`, userError);
                    // Add comment with default user info
                    comments.push({
                        ...comment,
                        user: {
                            id: comment.userId,
                            username: "Unknown User",
                            avatar: "https://ui-avatars.com/api/?name=Unknown&background=random"
                        }
                    });
                }
            }

            return comments;
        } catch (error) {
            console.error(`Error fetching comments for deck ${deckId}:`, error);
            return [];
        }
    },

    // Rating methods
    rateDeck: async (deckId, score) => {
        const currentUser = api.getCurrentUser();
        if (!currentUser) {
            return { success: false, message: 'Not authenticated' };
        }

        // Check if user has already rated this deck
        const existingRating = await axiosInstance.get(`${API_URL}/ratings?deckId=${deckId}&userId=${currentUser.id}`);

        if (existingRating.data.length > 0) {
            // Update existing rating
            const rating = existingRating.data[0];
            rating.score = score;
            rating.createdAt = new Date().toISOString();

            const response = await axiosInstance.put(`${API_URL}/ratings/${rating.id}`, rating);
            return response.data;
        } else {
            // Create new rating
            const ratingData = {
                deckId,
                userId: currentUser.id,
                score,
                createdAt: new Date().toISOString()
            };

            const response = await axiosInstance.post(`${API_URL}/ratings`, ratingData);
            return response.data;
        }
    },

    getDeckRatings: async (deckId) => {
        try {
            const response = await axios.get(`${API_URL}/ratings?deckId=${deckId}`);
            return response.data;
        } catch (error) {
            console.error(`Error fetching ratings for deck ${deckId}:`, error);
            return [];
        }
    },

    // User progress methods
    updateUserProgress: async (flashcardId, deckId, confidenceLevel) => {
        const currentUser = api.getCurrentUser();
        if (!currentUser) {
            return { success: false, message: 'Not authenticated' };
        }

        // Calculate next review date based on confidence level
        // Simple spaced repetition algorithm
        const now = new Date();
        let nextReviewDate;

        switch (confidenceLevel) {
            case 1: // Very difficult
                nextReviewDate = new Date(now.getTime() + 1 * 24 * 60 * 60 * 1000); // 1 day
                break;
            case 2: // Difficult
                nextReviewDate = new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000); // 3 days
                break;
            case 3: // Moderate
                nextReviewDate = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000); // 1 week
                break;
            case 4: // Easy
                nextReviewDate = new Date(now.getTime() + 14 * 24 * 60 * 60 * 1000); // 2 weeks
                break;
            case 5: // Very easy
                nextReviewDate = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000); // 1 month
                break;
            default:
                nextReviewDate = new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000); // Default: 3 days
        }

        // Check if progress record exists
        const existingProgress = await axiosInstance.get(`${API_URL}/userProgress?userId=${currentUser.id}&flashcardId=${flashcardId}`);

        if (existingProgress.data.length > 0) {
            // Update existing progress
            const progress = existingProgress.data[0];
            progress.lastStudied = now.toISOString();
            progress.confidenceLevel = confidenceLevel;
            progress.nextReviewDate = nextReviewDate.toISOString();

            const response = await axiosInstance.put(`${API_URL}/userProgress/${progress.id}`, progress);
            return response.data;
        } else {
            // Create new progress
            const progressData = {
                userId: currentUser.id,
                flashcardId,
                deckId,
                lastStudied: now.toISOString(),
                confidenceLevel,
                nextReviewDate: nextReviewDate.toISOString()
            };

            const response = await axiosInstance.post(`${API_URL}/userProgress`, progressData);
            return response.data;
        }
    },

    getUserProgress: async (userId = null) => {
        if (!userId) {
            const currentUser = api.getCurrentUser();
            if (!currentUser) {
                return [];
            }
            userId = currentUser.id;
        }

        const response = await axiosInstance.get(`${API_URL}/userProgress?userId=${userId}`);
        return response.data;
    }
};

export default api; 