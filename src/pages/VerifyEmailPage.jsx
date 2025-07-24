"use client"

import { useState, useEffect, useRef } from "react"
import { Link, useNavigate, useLocation } from "react-router-dom"
import { useForm } from "react-hook-form"
import { yupResolver } from "@hookform/resolvers/yup"
import * as yup from "yup"
import { AlertCircle, ArrowLeft, Shield, CheckCircle } from "lucide-react"
import { useToast } from "../hooks/useToast"
import { authService } from "../services/authService"
import Navbar from "../components/NavBar.jsx";

const verificationSchema = yup.object().shape({
    code: yup
        .string()
        .matches(/^\d{6}$/, "Verification code must be exactly 6 digits")
        .required("Verification code is required"),
})

const VerifyEmailPage = () => {
    const [isLoading, setIsLoading] = useState(false)
    const [isVerified, setIsVerified] = useState(false)
    const [timeLeft, setTimeLeft] = useState(300) // 5 minutes
    const [code, setCode] = useState(["", "", "", "", "", ""])
    const navigate = useNavigate()
    const location = useLocation()
    const { showToast } = useToast()
    const inputRefs = useRef([])

    const email = location.state?.email || "user@example.com"
    const verificationType = location.state?.type || "email-verification"

    const {
        handleSubmit,
        formState: { errors },
        setValue,
        trigger,
    } = useForm({
        resolver: yupResolver(verificationSchema),
        mode: "onChange",
    })

    // Check for token and email in URL query params (for email link verification)
    useEffect(() => {
        const urlParams = new URLSearchParams(location.search)
        const tokenFromUrl = urlParams.get("token")
        const emailFromUrl = urlParams.get("email")

        if (tokenFromUrl && emailFromUrl) {
            // Handle verification from email link with both token and email
            handleLinkVerification(tokenFromUrl, emailFromUrl)
        } else if (tokenFromUrl) {
            // Fallback: handle verification with just token (use email from state)
            handleLinkVerification(tokenFromUrl, email)
        }
    }, [location.search])

    // Timer countdown
    useEffect(() => {
        if (timeLeft > 0 && !isVerified) {
            const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000)
            return () => clearTimeout(timer)
        }
    }, [timeLeft, isVerified])

    // Handle verification from email link
    const handleLinkVerification = async (token, emailAddress) => {
        setIsLoading(true)
        try {
            await authService.verifyEmailFromLink(token, emailAddress)
            setIsVerified(true)
            showToast("Email verified successfully!", "success")

            setTimeout(() => {
                if (verificationType === "password-reset") {
                    navigate("/reset-password", { state: { email: emailAddress, token } })
                } else {
                    navigate("/login")
                }
            }, 2000)
        } catch (error) {
            console.error("Link verification error:", error)
            showToast(error.message || "Invalid verification link", "error")
        } finally {
            setIsLoading(false)
        }
    }

    // Format time display
    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60)
        const secs = seconds % 60
        return `${mins}:${secs.toString().padStart(2, "0")}`
    }

    // Handle code input change
    const handleCodeChange = (index, value) => {
        if (value.length > 1) return // Prevent multiple characters

        const newCode = [...code]
        newCode[index] = value

        setCode(newCode)
        setValue("code", newCode.join(""))
        trigger("code")

        // Auto-focus next input
        if (value && index < 5) {
            inputRefs.current[index + 1]?.focus()
        }
    }

    // Handle backspace
    const handleKeyDown = (index, e) => {
        if (e.key === "Backspace" && !code[index] && index > 0) {
            inputRefs.current[index - 1]?.focus()
        }
    }

    // Handle paste
    const handlePaste = (e) => {
        e.preventDefault()
        const pastedData = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6)

        if (pastedData.length === 6) {
            const newCode = pastedData.split("")
            setCode(newCode)
            setValue("code", pastedData)
            trigger("code")
            inputRefs.current[5]?.focus()
        }
    }

    const onSubmit = async (data) => {
        setIsLoading(true)

        try {
            // Call the actual API with email and token
            await authService.verifyEmail(data.code, email)

            setIsVerified(true)
            showToast("Email verified successfully!", "success")

            // Navigate based on verification type
            setTimeout(() => {
                navigate("/login")
            }, 3000)
        } catch (error) {
            console.error("Verification error:", error)
            showToast(error.message || "Invalid verification code. Please try again.", "error")
        } finally {
            setIsLoading(false)
        }
    }

    const handleResendCode = async () => {
        setIsLoading(true)
        try {
            if (verificationType === "password-reset") {
                await authService.forgotPassword(email)
            } else {
                // For email verification, you might need a separate resend endpoint
                // await authService.resendVerificationEmail(email)
                showToast("Please contact support to resend verification email", "info")
                return
            }

            setTimeLeft(300) // Reset timer
            setCode(["", "", "", "", "", ""]) // Clear code
            setValue("code", "")
            showToast("New verification code sent!", "success")
        } catch (error) {
            console.error("Resend code error:", error)
            showToast(error.message || "Failed to resend code", "error")
        } finally {
            setIsLoading(false)
        }
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
                            className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-900 to-purple-600 rounded-full mb-4">
                            {isVerified ? <CheckCircle className="w-8 h-8 text-white"/> :
                                <Shield className="w-8 h-8 text-white"/>}
                        </div>
                        <h1 className="text-2xl font-bold text-gray-900 mb-2">
                            {isVerified ? "Email Verified!" : "Verify Your Email"}
                        </h1>
                        <p className="text-gray-600">
                            {isVerified
                                ? "Your email has been successfully verified"
                                : `We've sent a 6-digit verification code to ${email}`}
                        </p>
                    </div>

                    {!isVerified ? (
                        <>
                            {/* Verification Form */}
                            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                                {/* Code Input */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-4 text-center">
                                        Enter Verification Code
                                    </label>
                                    <div className="flex justify-center space-x-3 mb-4">
                                        {code.map((digit, index) => (
                                            <input
                                                key={index}
                                                ref={(el) => (inputRefs.current[index] = el)}
                                                type="text"
                                                inputMode="numeric"
                                                maxLength={1}
                                                value={digit}
                                                onChange={(e) => handleCodeChange(index, e.target.value.replace(/\D/g, ""))}
                                                onKeyDown={(e) => handleKeyDown(index, e)}
                                                onPaste={handlePaste}
                                                className={`w-12 h-12 text-center text-xl font-bold border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200 ${
                                                    errors.code ? "border-red-500" : "border-gray-300"
                                                }`}
                                            />
                                        ))}
                                    </div>
                                    {errors.code && (
                                        <div
                                            className="flex items-center justify-center gap-2 mt-2 text-red-600 text-sm">
                                            <AlertCircle className="w-4 h-4"/>
                                            {errors.code.message}
                                        </div>
                                    )}
                                </div>

                                {/* Timer */}
                                <div className="text-center">
                                    <p className="text-sm text-gray-600">
                                        Code expires in{" "}
                                        <span
                                            className={`font-mono font-bold ${timeLeft < 60 ? "text-red-600" : "text-blue-600"}`}>
                    {formatTime(timeLeft)}
                  </span>
                                    </p>
                                </div>

                                {/* Submit Button */}
                                <button
                                    type="submit"
                                    disabled={code.join("").length !== 6 || isLoading}
                                    className={`w-full py-3 px-4 rounded-lg font-medium transition-all duration-200 ${
                                        code.join("").length === 6 && !isLoading
                                            ? "bg-gradient-to-r from-blue-900 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
                                            : "bg-gray-300 text-gray-500 cursor-not-allowed"
                                    }`}
                                >
                                    {isLoading ? (
                                        <div className="flex items-center justify-center gap-2">
                                            <div
                                                className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                            Verifying...
                                        </div>
                                    ) : (
                                        "Verify Email"
                                    )}
                                </button>
                            </form>

                            {/* Resend Code */}
                            <div className="text-center mt-6">
                                <p className="text-gray-600 text-sm mb-2">Didn't receive the code?</p>
                                <button
                                    onClick={handleResendCode}
                                    disabled={isLoading || timeLeft > 240} // Allow resend after 1 minute
                                    className={`font-medium transition-colors duration-200 ${
                                        timeLeft <= 240 && !isLoading
                                            ? "text-blue-600 hover:text-blue-800"
                                            : "text-gray-400 cursor-not-allowed"
                                    }`}
                                >
                                    {isLoading ? "Sending..." : "Resend Code"}
                                </button>
                                {timeLeft > 240 && (
                                    <p className="text-xs text-gray-500 mt-1">You can resend
                                        in {formatTime(timeLeft - 240)}</p>
                                )}
                            </div>
                        </>
                    ) : (
                        <>
                            {/* Success State */}
                            <div className="text-center space-y-6">
                                <div className="bg-green-50 border border-green-200 rounded-lg p-6">
                                    <CheckCircle className="w-12 h-12 text-green-600 mx-auto mb-4"/>
                                    <h3 className="text-lg font-semibold text-green-800 mb-2">Verification
                                        Successful!</h3>
                                    <p className="text-green-700 text-sm">
                                        {verificationType === "password-reset"
                                            ? "You can now reset your password"
                                            : "Your email has been verified. You can now sign in to your account."}
                                    </p>
                                </div>

                                <div className="flex items-center justify-center">
                                    <div
                                        className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                                    <span className="ml-3 text-gray-600">Redirecting...</span>
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

export default VerifyEmailPage
