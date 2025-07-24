"use client"

import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { useForm } from "react-hook-form"
import { yupResolver } from "@hookform/resolvers/yup"
import * as yup from "yup"
import { Eye, EyeOff, Mail, Lock, AlertCircle } from "lucide-react"
import { useAuth } from "../hooks/useAuth"
import { useToast } from "../hooks/useToast"
import Navbar from "../components/NavBar.jsx";

const loginSchema = yup.object().shape({
    email: yup.string().email("Please enter a valid email address").required("Email is required"),
    password: yup.string().required("Password is required"),
})

const LoginPage = () => {
    const [showPassword, setShowPassword] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const navigate = useNavigate()
    const { login } = useAuth()
    const { showToast } = useToast()

    const {
        register,
        handleSubmit,
        formState: { errors, isValid },
    } = useForm({
        resolver: yupResolver(loginSchema),
        mode: "onChange",
    })

    const onSubmit = async (data) => {
        setIsLoading(true)

        try {
            const result = await login(data.email, data.password)

            if (result.success) {
                showToast("Login successful! Welcome back.", "success")
                navigate("/dashboard")
            } else {
                showToast(result.message || "Invalid credentials", "error")
            }
        } catch (error) {
            showToast("An unexpected error occurred", "error")
        } finally {
            setIsLoading(false)
        }
    }

    const handleSocialLogin = (provider) => {
        showToast(`${provider} OAuth integration coming soon!`, "info")
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
            <Navbar/>
            <div
                className="flex items-center justify-center p-10">
                <div className="w-full max-w-md">
                    {/* Header */}
                    <div className="text-center mb-8">
                        <div
                            className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-900 to-purple-600 rounded-full mb-2">
                            <Lock className="w-8 h-8 text-white"/>
                        </div>
                        {/*<h1 className="text-3xl font-bold text-blue-900 font-serif">VastReports</h1>*/}
                        <p className="text-gray-600">Sign in to your account to continue</p>
                    </div>

                    {/* Social Login Buttons */}
                    <div className="space-y-3 mb-6">
                        <button
                            onClick={() => handleSocialLogin("Google")}
                            className="w-full flex items-center justify-center gap-3 px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors duration-200 font-medium"
                        >
                            <svg className="w-5 h-5" viewBox="0 0 24 24">
                                <path
                                    fill="#4285F4"
                                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                                />
                                <path
                                    fill="#34A853"
                                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                                />
                                <path
                                    fill="#FBBC05"
                                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                                />
                                <path
                                    fill="#EA4335"
                                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                                />
                            </svg>
                            Continue with Google
                        </button>

                        <button
                            onClick={() => handleSocialLogin("Facebook")}
                            className="w-full flex items-center justify-center gap-4 px-3 py-3 border border-gray-300 rounded-lg bg-gradient-to-r from-blue-900 to-purple-600 text-white hover:bg-blue-950 transition-colors duration-200"
                        >
                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                <path
                                    d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                            </svg>
                            Continue with Facebook
                        </button>
                    </div>

                    {/* Divider */}
                    <div className="relative flex items-center justify-center mb-6">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-gray-300"></div>
                        </div>
                        <div className="relative bg-white px-4 text-sm text-gray-500">or continue with email</div>
                    </div>

                    {/* Login Form */}
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                        {/* Email Field */}
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                                Email Address
                            </label>
                            <div className="relative">
                                <Mail
                                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5"/>
                                <input
                                    {...register("email")}
                                    id="email"
                                    type="email"
                                    placeholder="Enter your email"
                                    className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200 ${
                                        errors.email ? "border-red-500" : "border-gray-300"
                                    }`}
                                    autoComplete="email"
                                />
                            </div>
                            {errors.email && (
                                <div className="flex items-center gap-2 mt-2 text-red-600 text-sm">
                                    <AlertCircle className="w-4 h-4"/>
                                    {errors.email.message}
                                </div>
                            )}
                        </div>

                        {/* Password Field */}
                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                                Password
                            </label>
                            <div className="relative">
                                <Lock
                                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5"/>
                                <input
                                    {...register("password")}
                                    id="password"
                                    type={showPassword ? "text" : "password"}
                                    placeholder="Enter your password"
                                    className={`w-full pl-10 pr-12 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200 ${
                                        errors.password ? "border-red-500" : "border-gray-300"
                                    }`}
                                    autoComplete="current-password"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors duration-200"
                                >
                                    {showPassword ? <EyeOff className="w-5 h-5"/> : <Eye className="w-5 h-5"/>}
                                </button>
                            </div>
                            {errors.password && (
                                <div className="flex items-center gap-2 mt-2 text-red-600 text-sm">
                                    <AlertCircle className="w-4 h-4"/>
                                    {errors.password.message}
                                </div>
                            )}
                        </div>

                        {/* Remember Me & Forgot Password */}
                        <div className="flex items-center justify-between">
                            <label className="flex items-center">
                                <input type="checkbox"
                                       className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"/>
                                <span className="ml-2 text-sm text-gray-600">Remember me</span>
                            </label>
                            <button
                                type="button"
                                className="text-sm text-blue-600 hover:text-blue-800 transition-colors duration-200"
                            >
                                <Link to="/forgot-password">Forgot password?</Link>
                            </button>
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={!isValid || isLoading}
                            className={`w-full py-3 px-4 rounded-lg font-medium transition-all duration-200 ${
                                isValid && !isLoading
                                    ? "bg-gradient-to-r from-blue-900 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
                                    : "bg-gray-300 text-gray-500 cursor-not-allowed"
                            }`}
                        >
                            {isLoading ? (
                                <div className="flex items-center justify-center gap-2">
                                    <div
                                        className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                    Signing in...
                                </div>
                            ) : (
                                "Sign In"
                            )}
                        </button>
                    </form>

                    {/* Sign Up Link */}
                    <div className="text-center mt-6">
                        <p className="text-gray-600">
                            Don't have an account?{" "}
                            <Link
                                to="/register"
                                className="text-blue-600 hover:text-blue-800 font-medium transition-colors duration-200"
                            >
                                Sign up
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>

    )
}

export default LoginPage
