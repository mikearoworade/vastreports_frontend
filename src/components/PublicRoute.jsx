"use client"

import { Navigate } from "react-router-dom"
import { useAuth } from "../hooks/useAuth"
import LoadingSpinner from "./LoadingSpinner"

const PublicRoute = ({ children }) => {
    const { isAuthenticated, loading } = useAuth()

    if (loading) {
        return <LoadingSpinner />
    }

    if (isAuthenticated) {
        return <Navigate to="/dashboard" replace />
    }

    return children
}

export default PublicRoute
