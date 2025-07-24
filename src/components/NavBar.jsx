"use client"

import { useState } from "react"
import { Menu, X, LogOut, User, Bell, Home, Shield, Phone, BarChart3 } from "lucide-react"
import { Link, useLocation } from "react-router-dom"
import { useAuth } from "../hooks/useAuth"

export default function Navbar() {
    const [isMenuOpen, setIsMenuOpen] = useState(false)
    const { user, isAuthenticated, logout } = useAuth()
    const location = useLocation()

    const handleLogout = () => {
        logout()
        setIsMenuOpen(false)
    }

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen)
    }

    const closeMenu = () => {
        setIsMenuOpen(false)
    }

    const navigationLinks = [
        { to: "/", label: "Home", icon: Home },
        { to: "/posts", label: "Safety Feeds", icon: Shield },
        { to: "/emergency-contact", label: "Emergency Contacts", icon: Phone },
    ]

    const isActiveLink = (path) => {
        return location.pathname === path
    }

    return (
        <>
            <nav className="sticky top-0 z-50 bg-gradient-to-r from-blue-900 to-purple-600 shadow-lg">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16">
                        {/* Logo Section */}
                        <div className="flex items-center">
                            <Link to="/" className="flex items-center space-x-3" onClick={closeMenu}>
                                <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
                                    <div className="w-5 h-5 bg-gradient-to-r from-pink-500 to-teal-500 rounded"></div>
                                </div>
                                <h1 className="text-white font-bold font-mono text-xl sm:text-2xl">VastReports</h1>
                            </Link>
                        </div>

                        {/* Desktop Navigation */}
                        <div className="hidden md:block">
                            <div className="ml-10 flex items-baseline space-x-4">
                                {navigationLinks.map((link) => {
                                    const Icon = link.icon
                                    return (
                                        <Link
                                            key={link.to}
                                            to={link.to}
                                            className={`px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 flex items-center space-x-2 ${
                                                isActiveLink(link.to)
                                                    ? "bg-blue-700 text-white"
                                                    : "text-blue-100 hover:bg-blue-700 hover:text-white"
                                            }`}
                                        >
                                            <Icon className="w-4 h-4" />
                                            <span>{link.label}</span>
                                        </Link>
                                    )
                                })}
                            </div>
                        </div>

                        {/* Desktop Right Section */}
                        <div className="hidden md:flex items-center space-x-4">
                            {/* Notifications */}
                            <Link
                                to="/notifications"
                                className="relative p-2 text-blue-100 hover:text-white hover:bg-blue-700 rounded-md transition-colors duration-200"
                            >
                                <Bell className="w-5 h-5" />
                                <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></span>
                            </Link>

                            {/* User Section */}
                            {isAuthenticated ? (
                                <div className="flex items-center space-x-3">
                                    <Link
                                        to="/dashboard"
                                        className="flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium text-blue-100 hover:bg-blue-700 hover:text-white transition-colors duration-200"
                                    >
                                        <BarChart3 className="w-4 h-4" />
                                        <span>Dashboard</span>
                                    </Link>

                                    <div className="flex items-center space-x-2 px-3 py-2 bg-blue-700 rounded-md">
                                        <div className="w-6 h-6 bg-white rounded-full flex items-center justify-center">
                                            <User className="w-4 h-4 text-blue-800" />
                                        </div>
                                        <span className="text-white text-sm font-medium">{user?.name?.split(" ")[0] || "User"}</span>
                                    </div>

                                    <button
                                        onClick={handleLogout}
                                        className="p-2 text-blue-100 hover:text-white hover:bg-red-600 rounded-md transition-colors duration-200"
                                        title="Logout"
                                    >
                                        <LogOut className="w-5 h-5" />
                                    </button>
                                </div>
                            ) : (
                                <Link
                                    to="/login"
                                    className="bg-white text-blue-800 px-4 py-2 rounded-md hover:bg-blue-50 font-medium transition-colors duration-200"
                                >
                                    Sign In
                                </Link>
                            )}
                        </div>

                        {/* Mobile menu button */}
                        <div className="md:hidden">
                            <button
                                onClick={toggleMenu}
                                className="inline-flex items-center justify-center p-2 rounded-md text-blue-100 hover:text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white transition-colors duration-200"
                                aria-expanded="false"
                            >
                                <span className="sr-only">Open main menu</span>
                                {isMenuOpen ? (
                                    <X className="block h-6 w-6" aria-hidden="true" />
                                ) : (
                                    <Menu className="block h-6 w-6" aria-hidden="true" />
                                )}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Mobile Navigation Menu */}
                <div
                    className={`md:hidden transition-all duration-300 ease-in-out ${
                        isMenuOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0 overflow-hidden"
                    }`}
                >
                    <div className="px-2 pt-2 pb-3 space-y-1 bg-blue-900 border-t border-blue-700">
                        {navigationLinks.map((link) => {
                            const Icon = link.icon
                            return (
                                <Link
                                    key={link.to}
                                    to={link.to}
                                    onClick={closeMenu}
                                    className={`flex items-center space-x-3 px-3 py-2 rounded-md text-base font-medium transition-colors duration-200 ${
                                        isActiveLink(link.to)
                                            ? "bg-blue-700 text-white"
                                            : "text-blue-100 hover:bg-blue-700 hover:text-white"
                                    }`}
                                >
                                    <Icon className="w-5 h-5" />
                                    <span>{link.label}</span>
                                </Link>
                            )
                        })}

                        {/* Mobile Notifications */}
                        <Link
                            to="/notifications"
                            onClick={closeMenu}
                            className="flex items-center space-x-3 px-3 py-2 rounded-md text-base font-medium text-blue-100 hover:bg-blue-700 hover:text-white transition-colors duration-200"
                        >
                            <div className="relative">
                                <Bell className="w-5 h-5" />
                                <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></span>
                            </div>
                            <span>Notifications</span>
                        </Link>

                        {/* Mobile User Section */}
                        {isAuthenticated ? (
                            <>
                                <Link
                                    to="/dashboard"
                                    onClick={closeMenu}
                                    className="flex items-center space-x-3 px-3 py-2 rounded-md text-base font-medium text-blue-100 hover:bg-blue-700 hover:text-white transition-colors duration-200"
                                >
                                    <BarChart3 className="w-5 h-5" />
                                    <span>Dashboard</span>
                                </Link>

                                <div className="flex items-center space-x-3 px-3 py-2 bg-blue-700 rounded-md mx-3 my-2">
                                    <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
                                        <User className="w-5 h-5 text-blue-800" />
                                    </div>
                                    <div className="flex-1">
                                        <div className="text-white font-medium">{user?.name || "User"}</div>
                                        <div className="text-blue-200 text-sm">{user?.email || "user@example.com"}</div>
                                    </div>
                                </div>

                                <button
                                    onClick={handleLogout}
                                    className="flex items-center space-x-3 px-3 py-2 rounded-md text-base font-medium text-blue-100 hover:bg-red-600 hover:text-white transition-colors duration-200 w-full text-left"
                                >
                                    <LogOut className="w-5 h-5" />
                                    <span>Sign Out</span>
                                </button>
                            </>
                        ) : (
                            <Link
                                to="/login"
                                onClick={closeMenu}
                                className="block px-3 py-2 rounded-md text-base font-medium bg-white text-blue-800 hover:bg-blue-50 transition-colors duration-200 mx-3 my-2 text-center"
                            >
                                Sign In
                            </Link>
                        )}
                    </div>
                </div>
            </nav>

            {/* Mobile menu overlay */}
            {isMenuOpen && <div className="fixed inset-0 bg-black bg-opacity-25 z-40 md:hidden" onClick={closeMenu}></div>}
        </>
    )
}
