"use client"

import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { useForm } from "react-hook-form"
import { yupResolver } from "@hookform/resolvers/yup"
import * as yup from "yup"
import { UserPlus, User, Shield, Mail, AlertCircle, Lock, Eye, EyeOff } from "lucide-react"
import { useAuth } from "../hooks/useAuth"
import { useToast } from "../hooks/useToast"
import Navbar from "../components/NavBar.jsx";

const registerSchema = yup.object().shape({
    firstname: yup
        .string()
        .min(2, "First name must be at least 2 characters")
        .max(50, "First name must be less than 50 characters")
        .matches(/^[a-zA-Z\s]+$/, "First name can only contain letters and spaces")
        .required("First name is required"),
    lastname: yup
        .string()
        .min(2, "Last name must be at least 2 characters")
        .max(50, "Last name must be less than 50 characters")
        .matches(/^[a-zA-Z\s]+$/, "Last name can only contain letters and spaces")
        .required("Last name is required"),
    username: yup
        .string()
        .min(3, "Username must be at least 3 characters")
        .max(20, "Username must be less than 20 characters")
        .matches(/^[a-zA-Z0-9_]+$/, "Username can only contain letters, numbers, and underscores")
        .required("Username is required"),
    email: yup.string().email("Invalid email format").required("Email is required"),
    password: yup
        .string()
        .min(8, "Password must be at least 8 characters")
        .matches(
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
            "Password must contain at least one uppercase letter, one lowercase letter, and one number",
        )
        .required("Password is required"),
    confirmPassword: yup
        .string()
        .oneOf([yup.ref("password")], "Passwords must match")
        .required("Confirm password is required"),
})

const RegisterPage = () => {
    const [showPassword, setShowPassword] = useState(false)
    const [showConfirmPassword, setShowConfirmPassword] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const navigate = useNavigate()
    const { register: registerUser } = useAuth()
    const { showToast } = useToast()

    const {
        register,
        handleSubmit,
        formState: { errors, isValid },
    } = useForm({
        resolver: yupResolver(registerSchema),
        mode: "onChange",
    })

    const onSubmit = async (data) => {
        setIsLoading(true)

        try {
            const { confirmPassword, ...formData } = data
            const result = await registerUser(formData)

            if (result.success) {
                showToast("Account created! Please verify your email to continue.", "success")
                navigate("/verify-email", {
                    state: {
                        email: data.email,
                        type: "email-verification",
                    },
                })
            } else {
                showToast(result.message || "Registration failed", "error")
            }
        } catch (error) {
            showToast("An unexpected error occurred", "error")
        } finally {
            setIsLoading(false)
        }
    }

    const handleSocialSignUp = (provider) => {
        showToast(`${provider} OAuth integration coming soon!`, "info")
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
            <Navbar/>
            <div
                className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4">
                <div className="w-full max-w-md my-10">
                    {/* Header */}
                    <div className="text-center mb-8">
                        <div
                            className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-900 to-purple-600 rounded-full mb-2">
                            <UserPlus className="text-white w-8 h-8"/>
                        </div>
                        {/*<h1 className="text-3xl font-bold text-blue-900 font-serif">VastReports</h1>*/}
                        <p className="text-gray-600">Sign up to be a part of the community to ensure safe
                            environment</p>
                    </div>

                    {/* Social Sign Up */}
                    <div className="space-y-3 mb-6">
                        <button
                            onClick={() => handleSocialSignUp("Google")}
                            className="w-full flex items-center justify-center gap-4 px-3 py-3 border border-gray-300 hover:bg-gray-50 rounded-lg transition-colors duration-200"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 48 48">
                                <path
                                    fill="#FFC107"
                                    d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"
                                ></path>
                                <path
                                    fill="#FF3D00"
                                    d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"
                                ></path>
                                <path
                                    fill="#4CAF50"
                                    d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"
                                ></path>
                                <path
                                    fill="#1976D2"
                                    d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z"
                                ></path>
                            </svg>
                            Sign up with Google
                        </button>

                        <button
                            onClick={() => handleSocialSignUp("Facebook")}
                            className="w-full flex items-center justify-center gap-4 px-3 py-3 border border-gray-300 rounded-lg bg-gradient-to-r from-blue-900 to-purple-600 text-white hover:bg-blue-950 transition-colors duration-200"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 16 16">
                                <path fill="#fff"
                                      d="M8,0C3.582,0,0,3.582,0,8s3.582,8,8,8s8-3.582,8-8S12.418,0,8,0z"></path>
                                <path
                                    fill="#1e3a8a"
                                    d="M9.082,10.12h2.071l0.326-2.104H9.082V6.868c0-0.875,0.286-1.65,1.104-1.65h1.312V3.383	c-0.23-0.03-0.719-0.099-1.641-0.099c-1.924,0-3.054,1.016-3.054,3.334v1.398H4.824v2.104h1.979v5.781C7.196,15.961,7.592,16,8,16	c0.368,0,0.729-0.033,1.082-0.082V10.12z"
                                ></path>
                            </svg>
                            Sign up with Facebook
                        </button>
                    </div>

                    {/* Divider */}
                    <div className="relative flex items-center justify-center mb-6">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-gray-300"></div>
                        </div>
                        <div className="relative bg-white px-4 text-sm text-gray-500">or sign up with email</div>
                    </div>

                    {/* Sign up Form */}
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                        {/* Firstname and Lastname */}
                        <div className="w-full flex-col sm:flex-row flex gap-4">
                            <div className="flex-1">
                                <label htmlFor="firstname" className="block text-sm font-medium text-gray-700 mb-2">
                                    First Name
                                </label>
                                <div className="relative">
                                    <User
                                        className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5"/>
                                    <input
                                        {...register("firstname")}
                                        id="firstname"
                                        type="text"
                                        placeholder="Enter your first name"
                                        className="w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200"
                                    />
                                </div>
                                {errors.firstname && (
                                    <div className="flex items-center gap-2 mt-2 text-red-600 text-sm">
                                        <AlertCircle className="w-4 h-4"/>
                                        {errors.firstname.message}
                                    </div>
                                )}
                            </div>

                            <div className="flex-1">
                                <label htmlFor="lastname" className="block text-sm font-medium text-gray-700 mb-2">
                                    Last Name
                                </label>
                                <div className="relative">
                                    <User
                                        className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5"/>
                                    <input
                                        {...register("lastname")}
                                        id="lastname"
                                        type="text"
                                        placeholder="Enter your last name"
                                        className="w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200"
                                    />
                                </div>
                                {errors.lastname && (
                                    <div className="flex items-center gap-2 mt-2 text-red-600 text-sm">
                                        <AlertCircle className="w-4 h-4"/>
                                        {errors.lastname.message}
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Username */}
                        <div>
                            <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-2">
                                Username
                            </label>
                            <div className="relative">
                                <Shield
                                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5"/>
                                <input
                                    {...register("username")}
                                    id="username"
                                    type="text"
                                    placeholder="Enter your username"
                                    className="w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200"
                                />
                            </div>
                            {errors.username && (
                                <div className="flex items-center gap-2 mt-2 text-red-600 text-sm">
                                    <AlertCircle className="w-4 h-4"/>
                                    {errors.username.message}
                                </div>
                            )}
                        </div>

                        {/* Email Address */}
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                                Email Address
                            </label>
                            <div className="relative">
                                <Mail
                                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5"/>
                                <input
                                    {...register("email")}
                                    type="email"
                                    id="email"
                                    className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200 ${
                                        errors.email ? "border-red-500" : "border-gray-300"
                                    }`}
                                    placeholder="Enter your email"
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

                        {/* Password */}
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
                                    placeholder="Create a strong password"
                                    className="w-full pl-10 pr-12 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200"
                                />
                                <button
                                    type="button"
                                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors duration-200"
                                    onClick={() => setShowPassword(!showPassword)}
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

                        {/* Confirm Password */}
                        <div>
                            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
                                Confirm Password
                            </label>
                            <div className="relative">
                                <Lock
                                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5"/>
                                <input
                                    {...register("confirmPassword")}
                                    id="confirmPassword"
                                    type={showConfirmPassword ? "text" : "password"}
                                    placeholder="Confirm your Password"
                                    className="w-full pl-10 pr-12 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200"
                                />
                                <button
                                    type="button"
                                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors duration-200"
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                >
                                    {showConfirmPassword ? <EyeOff className="w-5 h-5"/> : <Eye className="w-5 h-5"/>}
                                </button>
                            </div>
                            {errors.confirmPassword && (
                                <div className="flex items-center gap-2 mt-2 text-red-600 text-sm">
                                    <AlertCircle className="w-4 h-4"/>
                                    {errors.confirmPassword.message}
                                </div>
                            )}
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={!isValid || isLoading}
                            className={`w-full py-3 px-4 rounded-lg font-medium transition-all duration-200 ${
                                isValid && !isLoading
                                    ? "bg-gradient-to-r from-blue-900 to-purple-600 text-white hover:from-blue-700 hover:to-purple-600 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
                                    : "bg-gray-300 text-gray-500 cursor-not-allowed"
                            }`}
                        >
                            {isLoading ? (
                                <div className="flex items-center justify-center gap-2">
                                    <div
                                        className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                    Creating account...
                                </div>
                            ) : (
                                "Sign up"
                            )}
                        </button>

                        {/* Sign In Link */}
                        <div className="text-center mt-6">
                            <p className="text-gray-600">
                                Already have an account?{" "}
                                <Link
                                    to="/login"
                                    className="text-blue-600 hover:text-blue-800 font-medium transition-colors duration-200"
                                >
                                    Sign in
                                </Link>
                            </p>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default RegisterPage
