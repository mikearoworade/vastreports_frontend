"use client"
import { useNavigate } from "react-router-dom"
import { LogOut, User, Mail, Shield, Home, Settings, BarChart3 } from "lucide-react"
import { useAuth } from "../hooks/useAuth"
import { useToast } from "../hooks/useToast"

const DashboardPage = () => {
    const { user, logout } = useAuth()
    const navigate = useNavigate()
    const { showToast } = useToast()

    const handleLogout = () => {
        logout()
        showToast("Successfully logged out", "success")
        navigate("/login")
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <header className="bg-white shadow-sm border-b">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        <div className="flex items-center">
                            <div className="flex-shrink-0">
                                <h1 className="text-2xl font-bold text-blue-900 font-serif">VastReports</h1>
                            </div>
                            <nav className="hidden md:ml-8 md:flex md:space-x-8">
                                <a
                                    href="#"
                                    className="text-gray-900 hover:text-blue-600 px-3 py-2 text-sm font-medium flex items-center gap-2"
                                >
                                    <Home className="w-4 h-4" />
                                    Dashboard
                                </a>
                                <a
                                    href="#"
                                    className="text-gray-500 hover:text-blue-600 px-3 py-2 text-sm font-medium flex items-center gap-2"
                                >
                                    <BarChart3 className="w-4 h-4" />
                                    Reports
                                </a>
                                <a
                                    href="#"
                                    className="text-gray-500 hover:text-blue-600 px-3 py-2 text-sm font-medium flex items-center gap-2"
                                >
                                    <Settings className="w-4 h-4" />
                                    Settings
                                </a>
                            </nav>
                        </div>
                        <div className="flex items-center space-x-4">
                            <span className="text-gray-700 hidden sm:block">Welcome, {user?.name || "User"}</span>
                            <button
                                onClick={handleLogout}
                                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors duration-200"
                            >
                                <LogOut className="w-4 h-4 mr-2" />
                                Logout
                            </button>
                        </div>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
                <div className="px-4 py-6 sm:px-0">
                    {/* Welcome Section */}
                    <div className="text-center mb-8">
                        <h2 className="text-3xl font-bold text-gray-900 mb-4">Welcome to VastReports Dashboard</h2>
                        <p className="text-gray-600 max-w-2xl mx-auto">
                            You have successfully authenticated and can now access your secure dashboard. This is a protected area
                            that requires authentication to access.
                        </p>
                    </div>

                    {/* Stats Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                        <div className="bg-white overflow-hidden shadow rounded-lg">
                            <div className="p-6">
                                <div className="flex items-center">
                                    <div className="flex-shrink-0">
                                        <Shield className="h-8 w-8 text-blue-600" />
                                    </div>
                                    <div className="ml-5 w-0 flex-1">
                                        <dl>
                                            <dt className="text-sm font-medium text-gray-500 truncate">Security Status</dt>
                                            <dd className="text-lg font-medium text-gray-900">Protected Access</dd>
                                        </dl>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white overflow-hidden shadow rounded-lg">
                            <div className="p-6">
                                <div className="flex items-center">
                                    <div className="flex-shrink-0">
                                        <User className="h-8 w-8 text-green-600" />
                                    </div>
                                    <div className="ml-5 w-0 flex-1">
                                        <dl>
                                            <dt className="text-sm font-medium text-gray-500 truncate">Profile Status</dt>
                                            <dd className="text-lg font-medium text-gray-900">Authenticated User</dd>
                                        </dl>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white overflow-hidden shadow rounded-lg">
                            <div className="p-6">
                                <div className="flex items-center">
                                    <div className="flex-shrink-0">
                                        <Mail className="h-8 w-8 text-purple-600" />
                                    </div>
                                    <div className="ml-5 w-0 flex-1">
                                        <dl>
                                            <dt className="text-sm font-medium text-gray-500 truncate">Email Status</dt>
                                            <dd className="text-lg font-medium text-gray-900">Verified</dd>
                                        </dl>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* User Information Card */}
                    <div className="max-w-md mx-auto bg-white overflow-hidden shadow-lg rounded-lg">
                        <div className="px-6 py-4">
                            <div className="flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full mx-auto mb-4">
                                <User className="w-8 h-8 text-white" />
                            </div>
                            <h3 className="text-lg font-semibold text-gray-900 text-center mb-4">Account Information</h3>

                            <div className="space-y-4">
                                <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                                    <User className="w-5 h-5 text-gray-400" />
                                    <div>
                                        <p className="text-sm font-medium text-gray-500">Full Name</p>
                                        <p className="text-gray-900">{user?.name || "John Doe"}</p>
                                    </div>
                                </div>

                                <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                                    <Mail className="w-5 h-5 text-gray-400" />
                                    <div>
                                        <p className="text-sm font-medium text-gray-500">Email Address</p>
                                        <p className="text-gray-900">{user?.email || "user@example.com"}</p>
                                    </div>
                                </div>

                                <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                                    <Shield className="w-5 h-5 text-gray-400" />
                                    <div>
                                        <p className="text-sm font-medium text-gray-500">Account Status</p>
                                        <p className="text-green-600 font-medium">Active & Verified</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Quick Actions */}
                    <div className="mt-8 text-center">
                        <h3 className="text-lg font-medium text-gray-900 mb-4">Quick Actions</h3>
                        <div className="flex flex-wrap justify-center gap-4">
                            <button
                                onClick={() => showToast("Profile settings coming soon!", "info")}
                                className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                            >
                                <Settings className="w-4 h-4 mr-2" />
                                Edit Profile
                            </button>
                            <button
                                onClick={() => showToast("Reports feature coming soon!", "info")}
                                className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                            >
                                <BarChart3 className="w-4 h-4 mr-2" />
                                View Reports
                            </button>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    )
}

export default DashboardPage
