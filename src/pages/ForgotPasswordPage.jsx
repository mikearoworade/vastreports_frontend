"use client"

import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { useForm } from "react-hook-form"
import { yupResolver } from "@hookform/resolvers/yup"
import * as yup from "yup"
import { Mail, AlertCircle, ArrowLeft, Send } from "lucide-react"
import { useToast } from "../hooks/useToast"
import { authService } from "../services/authService"
import Navbar from "../components/NavBar.jsx";

const forgotPasswordSchema = yup.object().shape({
    email: yup.string().email("Please enter a valid email address").required("Email is required"),
})

const ForgotPasswordPage = () => {
    const [isLoading, setIsLoading] = useState(false)
    const [emailSent, setEmailSent] = useState(false)
    const navigate = useNavigate()
    const { showToast } = useToast()

    const {
        register,
        handleSubmit,
        formState: { errors, isValid },
        getValues,
    } = useForm({
        resolver: yupResolver(forgotPasswordSchema),
        mode: "onChange",
    })

    const onSubmit = async (data) => {
        setIsLoading(true)

        try {
            // Call the actual API
            await authService.forgotPassword(data.email)

            setEmailSent(true)
            showToast("Password reset email sent successfully!", "success")

            // Navigate to verification page after 3 seconds
            setTimeout(() => {
                navigate("/login")
            }, 5000)
        } catch (error) {
            console.error("Forgot password error:", error)
            showToast(error.message || "Failed to send reset email. Please try again.", "error")
        } finally {
            setIsLoading(false)
        }
    }

    const handleResendEmail = async () => {
        const email = getValues("email")
        if (!email) {
            showToast("Please enter your email address first", "error")
            return
        }

        setIsLoading(true)
        try {
            await authService.forgotPassword(email)
            showToast("Reset email sent again!", "success")
        } catch (error) {
            console.error("Resend email error:", error)
            showToast(error.message || "Failed to resend email", "error")
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
            <Navbar />
            <div
                className="flex items-center justify-center p-10">
                <div className="w-full max-w-md">
                    {/* Header */}
                    <div className="text-center mb-8">
                        <div
                            className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-900 to-purple-600 rounded-full mb-4">
                            <Send className="w-8 h-8 text-white"/>
                        </div>
                        <h1 className="text-2xl font-bold text-gray-900 mb-2">Forgot Password?</h1>
                        <p className="text-gray-600">
                            {emailSent
                                ? "We've sent a verification code to your email"
                                : "Enter your email address and we'll send you a link to reset your password"}
                        </p>
                    </div>

                    {!emailSent ? (
                        <>
                            {/* Forgot Password Form */}
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
                                            placeholder="Enter your email address"
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
                                            Sending Reset Email...
                                        </div>
                                    ) : (
                                        "Send Reset Email"
                                    )}
                                </button>
                            </form>
                        </>
                    ) : (
                        <>
                            {/* Email Sent Success State */}
                            <div className="text-center space-y-6">
                                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                                    <div className="flex items-center justify-center space-x-2 text-green-800">
                                        <Send className="w-5 h-5"/>
                                        <span className="font-medium">Email sent successfully!</span>
                                    </div>
                                    <p className="text-green-700 text-sm mt-2">
                                        Check your inbox and follow the instructions to reset your password.
                                    </p>
                                </div>

                                <div className="space-y-4">
                                    <p className="text-gray-600 text-sm">Didn't receive the email? Check your spam
                                        folder or</p>

                                    <button
                                        onClick={handleResendEmail}
                                        disabled={isLoading}
                                        className="text-blue-600 hover:text-blue-800 font-medium transition-colors duration-200 disabled:opacity-50"
                                    >
                                        {isLoading ? "Sending..." : "Resend Email"}
                                    </button>
                                </div>
                            </div>
                        </>
                    )}

                    {/* Back to Login */}
                    <div className="text-center mt-8">
                        <Link
                            to="/login"
                            className="inline-flex items-center text-blue-600 hover:text-blue-800 font-medium transition-colors duration-200"
                        >
                            <ArrowLeft className="w-4 h-4 mr-2"/>
                            Back to Sign In
                        </Link>
                    </div>
                </div>
            </div>
        </div>

    )
}

export default ForgotPasswordPage
