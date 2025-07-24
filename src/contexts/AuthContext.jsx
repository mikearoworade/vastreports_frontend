"use client"

import { createContext, useState, useEffect } from "react"
import { authService } from "../services/authService"

export const AuthContext = createContext(null)

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null)
    const [loading, setLoading] = useState(true)
    const [isAuthenticated, setIsAuthenticated] = useState(false)

    useEffect(() => {
        const initializeAuth = () => {
            try {
                // Check if user has valid tokens
                if (authService.isAuthenticated()) {
                    setIsAuthenticated(true)
                    // In a real app, you would fetch user profile here
                    setUser({
                        id: "1",
                        email: "user@example.com",
                        name: "John Doe",
                        username: "johndoe",
                    })
                } else {
                    // No valid authentication found
                    setIsAuthenticated(false)
                    setUser(null)
                }
            } catch (error) {
                console.error("Auth initialization error:", error)
                setIsAuthenticated(false)
                setUser(null)
            } finally {
                // Always set loading to false after checking
                setLoading(false)
            }
        }

        initializeAuth()
    }, [])

    const login = async (email, password) => {
        try {
            const res = await authService.login(email, password)
            if (res.data?.accessToken) {
                setIsAuthenticated(true)
                setUser({
                    id: "1",
                    email: email,
                    name: "John Doe",
                    username: "johndoe",
                })
                return { success: true }
            }
            return { success: false, message: "Invalid credentials" }
        } catch (error) {
            return { success: false, message: error.message || "Login failed" }
        }
    }

    const register = async (userData) => {
        try {
            await authService.register(userData)
            return { success: true }
        } catch (error) {
            return { success: false, message: error.message || "Registration failed" }
        }
    }

    const logout = () => {
        authService.logout()
        setIsAuthenticated(false)
        setUser(null)
    }

    return (
        <AuthContext.Provider value={{ user, isAuthenticated, loading, login, register, logout }}>
            {children}
        </AuthContext.Provider>
    )
}
