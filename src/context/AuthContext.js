import React, { createContext, useState, useContext, useEffect } from 'react';
import api from '../services/api';
import { useToast } from './ToastContext';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const { showSuccess, showError } = useToast();

    // Check if user is already logged in on mount
    useEffect(() => {
        const checkAuth = async () => {
            try {
                const currentUser = api.getCurrentUser();
                if (currentUser) {
                    setUser(currentUser);
                }
            } catch (error) {
                console.error('Authentication error:', error);
            } finally {
                setLoading(false);
            }
        };

        checkAuth();
    }, []);

    // Login function
    const login = async (username, password) => {
        try {
            setLoading(true);
            const result = await api.login(username, password);

            if (result.success) {
                setUser(result.user);
                showSuccess(`Welcome back, ${result.user.username}!`);
                return { success: true };
            } else {
                showError(result.message || 'Login failed');
                return { success: false, message: result.message };
            }
        } catch (error) {
            console.error('Login error:', error);
            showError('An error occurred during login');
            return { success: false, message: 'An error occurred during login' };
        } finally {
            setLoading(false);
        }
    };

    // Register function
    const register = async (userData) => {
        try {
            setLoading(true);
            const result = await api.register(userData);

            if (result.success) {
                setUser(result.user);
                showSuccess('Registration successful!');
                return { success: true };
            } else {
                showError(result.message || 'Registration failed');
                return { success: false, message: result.message };
            }
        } catch (error) {
            console.error('Registration error:', error);
            showError('An error occurred during registration');
            return { success: false, message: 'An error occurred during registration' };
        } finally {
            setLoading(false);
        }
    };

    // Logout function
    const logout = () => {
        api.logout();
        setUser(null);
        showSuccess('Logged out successfully');
    };

    // Update user profile
    const updateProfile = async (userData) => {
        try {
            if (!user) {
                return { success: false, message: 'Not authenticated' };
            }

            setLoading(true);
            const updatedUser = await api.updateUserProfile(user.id, userData);

            if (updatedUser) {
                setUser({ ...user, ...userData });
                showSuccess('Profile updated successfully');
                return { success: true };
            } else {
                showError('Failed to update profile');
                return { success: false, message: 'Failed to update profile' };
            }
        } catch (error) {
            console.error('Update profile error:', error);
            showError('An error occurred while updating profile');
            return { success: false, message: 'An error occurred while updating profile' };
        } finally {
            setLoading(false);
        }
    };

    return (
        <AuthContext.Provider value={{
            user,
            loading,
            login,
            register,
            logout,
            updateProfile,
            isAuthenticated: !!user
        }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);

export default AuthProvider; 