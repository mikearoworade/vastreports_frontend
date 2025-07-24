import BaseApiService, { APIError } from "./baseApiService.js";

class AuthService extends BaseApiService {
    constructor() {
        super("/auth"); // ✅ Only specify the prefix here
        this.loadTokensFromStorage();
    }

    saveTokensToStorage() {
        localStorage.setItem("access_token", this.token || "");
        localStorage.setItem("refresh_token", this.refreshToken || "");
    }

    loadTokensFromStorage() {
        const accessToken = localStorage.getItem("access_token")
        const refreshToken = localStorage.getItem("refresh_token")

        // Only set tokens if they exist and are not empty strings
        this.token = accessToken && accessToken !== "" ? accessToken : null
        this.refreshToken = refreshToken && refreshToken !== "" ? refreshToken : null
    }

    clearTokensFromStorage() {
        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");
    }

    logout() {
        this.clearTokens();
        this.clearTokensFromStorage();
    }

    isAuthenticated() {
        // Check if token exists and is not null/empty
        return !!(this.token && this.token !== "")
    }

    async loginmock(email, password) {
        // Mock successful login for demo purposes
        if (email === "user@example.com" && password === "password123") {
            const mockResponse = {
                data: {
                    accessToken: "mock-access-token",
                    refreshToken: "mock-refresh-token",
                    user: {
                        id: "1",
                        email: email,
                        name: "John Doe",
                    },
                },
                status: 200,
                headers: new Headers(),
            }

            this.setTokens(mockResponse.data.accessToken, mockResponse.data.refreshToken)
            this.saveTokensToStorage()
            return mockResponse
        }

        // For demo purposes, simulate API call
        throw new APIError("Invalid credentials", 401)
    }

    async registermock(userData) {
        // Mock successful registration
        return {
            data: { message: "Registration successful" },
            status: 201,
            headers: new Headers(),
        }
    }

    async login(email, password) {
        const res = await this.apiRequest(
            "/login",
            {
                method: "POST",
                body: JSON.stringify({ email, password }),
            },
            true
        );

        if (res.data.accessToken) {
            this.setTokens(res.data.accessToken, res.data.refreshToken);
            this.saveTokensToStorage();
        }

        return res;
    }

    async register(userData) {
        return this.apiRequest(
            "/register",
            {
                method: "POST",
                body: JSON.stringify(userData),
            },
            true
        );
    }

    /**
     * Verify email with token and email in request body
     * @param {string} token - 6-digit verification code
     * @param {string} email - User's email address
     * @returns {Promise} API response
     */
    async verifyEmail(token, email) {
        const res = await this.apiRequest(
            "/verify-email",
            {
                method: "POST",
                body: JSON.stringify({
                    email: email,
                    token: token,
                }),
            },
            true,
        );

        if (res.data.accessToken) {
            this.setTokens(res.data.accessToken, res.data.refreshToken);
            this.saveTokensToStorage();
        }

        return res;
    }

    /**
     * Verify email using token and email from URL query parameters
     * @param {string} token - Verification token from URL
     * @param {string} email - Email address from URL
     * @returns {Promise} API response
     */
    async verifyEmailFromLink(token, email) {
        const queryParams = new URLSearchParams({
            token: token,
            email: email,
        })

        const res = await this.apiRequest(
            `/verify-email?${queryParams.toString()}`,
            {
                method: "GET",
            },
            true,
        )

        if (res.data.accessToken) {
            this.setTokens(res.data.accessToken, res.data.refreshToken);
            this.saveTokensToStorage();
        }

        return res;
    }

    async refreshAccessToken() {
        if (!this.refreshToken)
            throw new APIError("No refresh token available", 401);

        const res = await this.apiRequest(
            "/refresh",
            {
                method: "POST",
                body: JSON.stringify({ refreshToken: this.refreshToken }),
            },
            true
        );

        if (res.data.accessToken) {
            this.setTokens(
                res.data.accessToken,
                res.data.refreshToken || this.refreshToken
            );
            this.saveTokensToStorage();
        }

        return res;
    }

    async forgotPassword(email) {
        return this.apiRequest(
            "/forgot-password",
            {
                method: "POST",
                body: JSON.stringify({ email }),
            },
            true
        );
    }

    async resetPassword(token, newPassword) {
        return this.apiRequest(
            "/reset-password",
            {
                method: "POST",
                body: JSON.stringify({ token, newPassword }),
            },
            true
        );
    }
}

export const authService = new AuthService();