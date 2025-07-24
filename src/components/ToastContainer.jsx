"use client"
import { useToast } from "../hooks/useToast"
import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from "lucide-react"

const ToastContainer = () => {
    const { toasts, removeToast } = useToast()

    const getToastIcon = (type) => {
        switch (type) {
            case "success":
                return <CheckCircle className="h-5 w-5 text-green-400" />
            case "error":
                return <AlertCircle className="h-5 w-5 text-red-400" />
            case "warning":
                return <AlertTriangle className="h-5 w-5 text-yellow-400" />
            case "info":
            default:
                return <Info className="h-5 w-5 text-blue-400" />
        }
    }

    const getToastStyles = (type) => {
        switch (type) {
            case "success":
                return "border-l-4 border-green-500"
            case "error":
                return "border-l-4 border-red-500"
            case "warning":
                return "border-l-4 border-yellow-500"
            case "info":
            default:
                return "border-l-4 border-blue-500"
        }
    }

    return (
        <div className="fixed top-4 right-4 z-50 space-y-2">
            {toasts.map((toast) => (
                <div
                    key={toast.id}
                    className={`w-[300px] sm:w-[400px] bg-white shadow-lg rounded-lg pointer-events-auto ring-1 ring-black ring-opacity-5 overflow-hidden ${getToastStyles(
                        toast.type,
                    )}`}
                >
                    <div className="p-4">
                        <div className="flex items-start">
                            <div className="flex-shrink-0">{getToastIcon(toast.type)}</div>
                            <div className="ml-3 w-0 flex-1 pt-0.5">
                                <p className="text-sm font-medium text-gray-900">{toast.message}</p>
                            </div>
                            <div className="ml-4 flex-shrink-0 flex">
                                <button
                                    className="bg-white rounded-md inline-flex text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                    onClick={() => removeToast(toast.id)}
                                >
                                    <span className="sr-only">Close</span>
                                    <X className="h-5 w-5" />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    )
}

export default ToastContainer
