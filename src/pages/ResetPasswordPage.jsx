"use client"

import { useState, useEffect } from "react"
import { Link, useNavigate, useLocation } from "react-router-dom"
import { useForm } from "react-hook-form"
import { yupResolver } from "@hookform/resolvers/yup"
import * as yup from "yup"
import { Lock, Eye, EyeOff, AlertCircle, ArrowLeft, CheckCircle } from "lucide-react"
import { useToast } from "../hooks/useToast"
import { authService } from "../services/authService"

const resetPasswordSchema = yup.object().shape({
    newPassword: yup
        .string()
        .min(8, "Password must be at least 8 characters")
        .matches(
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
            "Password must contain at least one uppercase letter, one lowercase letter, and one number",
        )
        .required("Password is required"),
    confirmPassword: yup
        .string()
        .oneOf([yup.ref("newPassword")], "Passwords must match")
        .required("Confirm password is required"),
    token: yup.string().required("Reset token is required"), // Add token validation
})

const ResetPasswordPage = () => {
    const [showPassword, setShowPassword] = useState(false)
    const [showConfirmPassword, setShowConfirmPassword] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [isReset, setIsReset] = useState(false)
    const [tokenValid, setTokenValid] = useState(true)
    const navigate = useNavigate()
    const location = useLocation()
    const { showToast } = useToast()

    const email = location.state?.email || ""
    const verificationToken = location.state?.token || ""

    // Check for token in URL query params
    const urlParams = new URLSearchParams(location.search)
    const tokenFromUrl = urlParams.get("token")
    const finalToken = tokenFromUrl || verificationToken

    const {
        register,
        handleSubmit,
        setValue,
        formState: { errors, isValid },
    } = useForm({
        resolver: yupResolver(resetPasswordSchema),
        mode: "onChange",
        defaultValues: {
            token: finalToken, // Set default token value
        },
    })

    // Validate token on component mount
    useEffect(() => {
        if (finalToken) {
            setValue("token", finalToken) // Set token in form
            validateToken(finalToken)
        } else {
            setTokenValid(false)
            showToast("Invalid or missing reset token", "error")
        }
    }, [finalToken, setValue])

    const validateToken = async (token) => {
        try {
            // Optional: validate token before allowing password reset
            // await authService.validateResetToken(token)
            setTokenValid(true)
        } catch (error) {
            console.error("Token validation error:", error)
            setTokenValid(false)
            showToast("Invalid or expired reset token", "error")
        }
    }

    const onSubmit = async (data) => {
        if (!data.token) {
            showToast("Reset token is missing", "error")
            return
        }

        setIsLoading(true)

        try {
            // console.log(data.token, data.newPassword);
            // Call the actual API with token from form data and newPassword
            await authService.resetPassword(data.token, data.newPassword)

            setIsReset(true)
            showToast("Password reset successfully!", "success")

            // Navigate to login after 3 seconds
            setTimeout(() => {
                navigate("/login")
            }, 3000)
        } catch (error) {
            console.error("Reset password error:", error)
            showToast(error.message || "Failed to reset password. Please try again.", "error")
        } finally {
            setIsLoading(false)
        }
    }

    // If token is invalid, show error state
    if (!tokenValid) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 ">
                <div className="flex items-center justify-center p-10">
                    <div className="w-full max-w-md text-center">
                        <div className="inline-flex items-center justify-center w-16 h-16 bg-red-100 rounded-full mb-4">
                            <AlertCircle className="w-8 h-8 text-red-600"/>
                        </div>
                        <h1 className="text-2xl font-bold text-gray-900 mb-2">Invalid Reset Link</h1>
                        <p className="text-gray-600 mb-6">
                            This password reset link is invalid or has expired. Please request a new one.
                        </p>
                        <Link
                            to="/forgot-password"
                            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
                        >
                            Request New Reset Link
                        </Link>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
            <div className="flex items-center justify-center p-10">
                <div className="w-full max-w-md">
                    {/* Header */}
                    <div className="text-center mb-8">
                        <div
                            className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-900 to-purple-600 rounded-full mb-4">
                            {isReset ? <CheckCircle className="w-8 h-8 text-white"/> :
                                <Lock className="w-8 h-8 text-white"/>}
                        </div>
                        <h1 className="text-2xl font-bold text-gray-900 mb-2">
                            {isReset ? "Password Reset!" : "Reset Your Password"}
                        </h1>
                        <p className="text-gray-600">
                            {isReset ? "Your password has been successfully reset" : "Enter your new password below"}
                        </p>
                    </div>

                    {!isReset ? (
                        <>
                            {/* Reset Password Form */}
                            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                                {/* Hidden Token Field */}
                                <input {...register("token")} type="hidden" value={finalToken}/>

                                {/* New Password Field */}
                                <div>
                                    <label htmlFor="newPassword"
                                           className="block text-sm font-medium text-gray-700 mb-2">
                                        New Password
                                    </label>
                                    <div className="relative">
                                        <Lock
                                            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5"/>
                                        <input
                                            {...register("newPassword")}
                                            id="newPassword"
                                            type={showPassword ? "text" : "password"}
                                            placeholder="Enter your new password"
                                            className={`w-full pl-10 pr-12 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200 ${
                                                errors.password ? "border-red-500" : "border-gray-300"
                                            }`}
                                            autoComplete="new-password"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors duration-200"
                                        >
                                            {showPassword ? <EyeOff className="w-5 h-5"/> : <Eye className="w-5 h-5"/>}
                                        </button>
                                    </div>
                                    {errors.newPassword && (
                                        <div className="flex items-center gap-2 mt-2 text-red-600 text-sm">
                                            <AlertCircle className="w-4 h-4"/>
                                            {errors.newPassword.message}
                                        </div>
                                    )}
                                </div>

                                {/* Confirm Password Field */}
                                <div>
                                    <label htmlFor="confirmPassword"
                                           className="block text-sm font-medium text-gray-700 mb-2">
                                        Confirm New Password
                                    </label>
                                    <div className="relative">
                                        <Lock
                                            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5"/>
                                        <input
                                            {...register("confirmPassword")}
                                            id="confirmPassword"
                                            type={showConfirmPassword ? "text" : "password"}
                                            placeholder="Confirm your new password"
                                            className={`w-full pl-10 pr-12 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200 ${
                                                errors.confirmPassword ? "border-red-500" : "border-gray-300"
                                            }`}
                                            autoComplete="new-password"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors duration-200"
                                        >
                                            {showConfirmPassword ? <EyeOff className="w-5 h-5"/> :
                                                <Eye className="w-5 h-5"/>}
                                        </button>
                                    </div>
                                    {errors.confirmPassword && (
                                        <div className="flex items-center gap-2 mt-2 text-red-600 text-sm">
                                            <AlertCircle className="w-4 h-4"/>
                                            {errors.confirmPassword.message}
                                        </div>
                                    )}
                                </div>

                                {/* Password Requirements */}
                                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                                    <h4 className="text-sm font-medium text-blue-800 mb-2">Password Requirements:</h4>
                                    <ul className="text-xs text-blue-700 space-y-1">
                                        <li>• At least 8 characters long</li>
                                        <li>• Contains at least one uppercase letter</li>
                                        <li>• Contains at least one lowercase letter</li>
                                        <li>• Contains at least one number</li>
                                    </ul>
                                </div>

                                {/* Token Display (for debugging - can be removed in production) */}
                                {process.env.NODE_ENV === "development" && finalToken && (
                                    <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
                                        <p className="text-xs text-gray-600">
                                            <strong>Debug - Reset Token:</strong> {finalToken}
                                        </p>
                                    </div>
                                )}

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
                                            Resetting Password...
                                        </div>
                                    ) : (
                                        "Reset Password"
                                    )}
                                </button>
                            </form>
                        </>
                    ) : (
                        <>
                            {/* Success State */}
                            <div className="text-center space-y-6">
                                <div className="bg-green-50 border border-green-200 rounded-lg p-6">
                                    <CheckCircle className="w-12 h-12 text-green-600 mx-auto mb-4"/>
                                    <h3 className="text-lg font-semibold text-green-800 mb-2">Password Reset
                                        Successful!</h3>
                                    <p className="text-green-700 text-sm">
                                        Your password has been successfully reset. You can now sign in with your new
                                        password.
                                    </p>
                                </div>

                                <div className="flex items-center justify-center">
                                    <div
                                        className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                                    <span className="ml-3 text-gray-600">Redirecting to sign in...</span>
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

export default ResetPasswordPage