"use client"

import { createContext, useState, useCallback } from "react"

export const ToastContext = createContext(null)

export const ToastProvider = ({ children }) => {
    const [toasts, setToasts] = useState([])

    const showToast = useCallback((message, type = "info") => {
        const id = Date.now().toString()
        const newToast = { id, message, type }

        setToasts((prev) => [...prev, newToast])

        // Auto remove toast after 5 seconds
        setTimeout(() => {
            setToasts((prev) => prev.filter((toast) => toast.id !== id))
        }, 5000)
    }, [])

    const removeToast = useCallback((id) => {
        setToasts((prev) => prev.filter((toast) => toast.id !== id))
    }, [])

    return <ToastContext.Provider value={{ toasts, showToast, removeToast }}>{children}</ToastContext.Provider>
}
