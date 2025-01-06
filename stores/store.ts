import { create } from "zustand";

// Define the interface for the store
interface ClientAuthState {
    isAuthenticated: boolean;
    login: () => void;
    logout: () => void;
}

// Create the Zustand store with persistence
export const useClientAuthStore = create<ClientAuthState>((set) => ({
    // Initialize state from localStorage
    isAuthenticated: typeof window !== "undefined" && localStorage.getItem("client_lock_code") === "true",

    // Login action
    login: () => {
        localStorage.setItem("client_lock_code", "true"); // Save to localStorage
        set({ isAuthenticated: true }); // Update state
    },

    // Logout action
    logout: () => {
        localStorage.removeItem("client_lock_code"); // Remove from localStorage
        set({ isAuthenticated: false }); // Update state
    },
}));




// Define the interface for the store
interface HandlerAuthState {
    isAuthenticated: boolean;
    login: () => void;
    logout: () => void;
}

// Create the Zustand store with persistence
export const useHandlerAuthStore = create<HandlerAuthState>((set) => ({
    // Initialize state from localStorage
    isAuthenticated: typeof window !== "undefined" && localStorage.getItem("handler_lock_code") === "true",

    // Login action
    login: () => {
        localStorage.setItem("handler_lock_code", "true"); // Save to localStorage
        set({ isAuthenticated: true }); // Update state
    },

    // Logout action
    logout: () => {
        localStorage.removeItem("handler_lock_code"); // Remove from localStorage
        set({ isAuthenticated: false }); // Update state
    },
}));