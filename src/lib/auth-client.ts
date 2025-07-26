import { createAuthClient } from "better-auth/react";

// Get the base URL based on the environment
const getBaseUrl = () => {
    if (typeof window !== "undefined") {
        // Client-side: use the current origin
        return window.location.origin;
    }
    // Server-side: use localhost
    return "http://localhost:3000";
};

export const authClient = createAuthClient({
    baseURL: getBaseUrl(),
    credentials: "include" // Important for CORS with credentials
});

export const { signIn, signUp, useSession } = authClient;
