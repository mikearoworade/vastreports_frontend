"use client"
import { Navigate } from "react-router-dom"
import { useAuth } from "../hooks/useAuth"
import LoadingSpinner from "./LoadingSpinner"

const ProtectedRoute = ({ children }) => {
    const { isAuthenticated, loading } = useAuth()

    // Show loading spinner while checking authentication
    if (loading) {
        return <LoadingSpinner />
    }

    // If not authenticated, redirect to login
    if (!isAuthenticated) {
        return <Navigate to="/login" replace />
    }

    // If authenticated, render the protected content
    return children
}

export default ProtectedRoute
