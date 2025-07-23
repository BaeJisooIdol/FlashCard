/**
 * Utility functions for text-to-speech functionality
 */

// Check if browser supports speech synthesis
const isSpeechSynthesisSupported = () => {
    return 'speechSynthesis' in window;
};

// Get available voices
const getVoices = () => {
    return new Promise((resolve) => {
        // Some browsers need a small delay to load voices
        let voices = window.speechSynthesis.getVoices();

        if (voices.length > 0) {
            resolve(voices);
            return;
        }

        // Chrome needs this event to get voices
        window.speechSynthesis.onvoiceschanged = () => {
            voices = window.speechSynthesis.getVoices();
            resolve(voices);
        };
    });
};

// Speak text with the provided options
const speak = async (text, options = {}) => {
    if (!isSpeechSynthesisSupported()) {
        console.error('Speech synthesis is not supported in this browser');
        return false;
    }

    // Cancel any ongoing speech
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);

    // Set default options
    utterance.rate = options.rate || 1; // Speed: 0.1 to 10
    utterance.pitch = options.pitch || 1; // Pitch: 0 to 2
    utterance.volume = options.volume || 1; // Volume: 0 to 1

    // Set language and voice if provided
    if (options.lang) {
        utterance.lang = options.lang;
    }

    if (options.voice) {
        utterance.voice = options.voice;
    }

    // Add event handlers if provided
    if (options.onStart) {
        utterance.onstart = options.onStart;
    }

    if (options.onEnd) {
        utterance.onend = options.onEnd;
    }

    if (options.onError) {
        utterance.onerror = options.onError;
    }

    // Start speaking
    window.speechSynthesis.speak(utterance);

    return true;
};

// Stop any ongoing speech
const stop = () => {
    if (isSpeechSynthesisSupported()) {
        window.speechSynthesis.cancel();
        return true;
    }
    return false;
};

// Pause speech
const pause = () => {
    if (isSpeechSynthesisSupported()) {
        window.speechSynthesis.pause();
        return true;
    }
    return false;
};

// Resume speech
const resume = () => {
    if (isSpeechSynthesisSupported()) {
        window.speechSynthesis.resume();
        return true;
    }
    return false;
};

// Check if speech synthesis is speaking
const isSpeaking = () => {
    if (isSpeechSynthesisSupported()) {
        return window.speechSynthesis.speaking;
    }
    return false;
};

// Export all functions
export const textToSpeech = {
    isSpeechSynthesisSupported,
    getVoices,
    speak,
    stop,
    pause,
    resume,
    isSpeaking
};

export default textToSpeech; 