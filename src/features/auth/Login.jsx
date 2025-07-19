import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { Eye, EyeOff, Mail, Lock, AlertCircle, CheckCircle } from "lucide-react";
import {userData} from "../../data/user.js";

// Validation schema
const loginSchema = yup.object().shape({
    email: yup
        .string()
        .email("Please enter a valid email address")
        .required("Email is required"),
    password: yup
        .string()
        .required("Password is required"),
});

export default function LoginPage() {
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [loginError, setLoginError] = useState("");
    const [loginSuccess, setLoginSuccess] = useState(false);
    const [loggedInUser, setLoggedInUser] = useState(null);


    const {
        register,
        handleSubmit,
        formState: { errors, isValid },
        reset
    } = useForm({
        resolver: yupResolver(loginSchema),
        mode: "onChange",
    });

    const onSubmit = async (data) => {
        setIsLoading(true);
        setLoginError("");
        setLoginSuccess(false);

        // Simulate API call delay
        await new Promise((resolve) => setTimeout(resolve, 1500));

        // Check if user exists in our data
        const user = userData.find(
            (u) => u.email.toLowerCase() === data.email.toLowerCase() &&
                u.password === data.password
        );

        if (user) {
            setLoggedInUser(user);
            setLoginSuccess(true);
            console.log("Login successful:", { email: user.email, name: user.name });

            // In a real app, you would:
            // 1. Store auth token in secure storage
            // 2. Set user context/state
            // 3. Redirect to dashboard

        } else {
            setLoginError("Invalid email or password. Please check your credentials and try again.");
        }

        setIsLoading(false);
    };

    const handleGoogleSignIn = () => {
        console.log("Google Sign In clicked");
        // Implement Google OAuth logic here
        setLoginError("");
    };

    const handleFacebookSignIn = () => {
        console.log("Facebook Sign In clicked");
        // Implement Facebook OAuth logic here
        setLoginError("");
    };

    const handleLogout = () => {
        setLoggedInUser(null);
        setLoginSuccess(false);
        setLoginError("");
        reset();
    };

    // Success screen
    if (loginSuccess && loggedInUser) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50 flex items-center justify-center p-4">
                <div className="w-full max-w-md text-center">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-green-600 to-blue-600 rounded-full mb-4">
                        <CheckCircle className="w-8 h-8 text-white" />
                    </div>
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">
                        Welcome, {loggedInUser.name}!
                    </h1>
                    <p className="text-gray-600 mb-6">
                        You have successfully logged in to your account.
                    </p>
                    <div className="bg-white p-6 rounded-lg shadow-md mb-6">
                        <h2 className="text-lg font-semibold text-gray-800 mb-2">Account Details</h2>
                        <p className="text-gray-600">
                            <strong>Email:</strong> {loggedInUser.email}
                        </p>
                        <p className="text-gray-600">
                            <strong>Name:</strong> {loggedInUser.name}
                        </p>
                    </div>
                    <button
                        onClick={handleLogout}
                        className="w-full py-3 px-4 bg-gradient-to-r from-red-600 to-pink-600 text-white rounded-lg font-medium hover:from-red-700 hover:to-pink-700 transition-all duration-200 shadow-md hover:shadow-lg"
                    >
                        Logout
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4">
            <div className="w-full max-w-md">
                {/* Header */}
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full mb-4">
                        <Lock className="w-8 h-8 text-white" />
                    </div>
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">
                        Welcome Back
                    </h1>
                    <p className="text-gray-600">Sign in to your account to continue</p>
                </div>

                {/* Global Error Message */}
                {loginError && (
                    <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                        <div className="flex items-center gap-2 text-red-700">
                            <AlertCircle className="w-4 h-4" />
                            <span className="text-sm font-medium">Login Failed</span>
                        </div>
                        <p className="text-sm text-red-600 mt-1">{loginError}</p>
                    </div>
                )}

                {/* Social Login Buttons */}
                <div className="space-y-3 mb-6">
                    <button
                        onClick={handleGoogleSignIn}
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
                        onClick={handleFacebookSignIn}
                        className="w-full flex items-center justify-center gap-3 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 font-medium"
                    >
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                        </svg>
                        Continue with Facebook
                    </button>
                </div>

                {/* Divider */}
                <div className="relative flex items-center justify-center mb-6">
                    <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-gray-300"></div>
                    </div>
                    <div className="relative bg-white px-4 text-sm text-gray-500">
                        or continue with email
                    </div>
                </div>

                {/* Login Form */}
                <div className="space-y-6">
                    {/* Email Field */}
                    <div>
                        <label
                            htmlFor="email"
                            className="block text-sm font-medium text-gray-700 mb-2"
                        >
                            Email Address
                        </label>
                        <div className="relative">
                            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
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
                                <AlertCircle className="w-4 h-4" />
                                {errors.email.message}
                            </div>
                        )}
                    </div>

                    {/* Password Field */}
                    <div>
                        <label
                            htmlFor="password"
                            className="block text-sm font-medium text-gray-700 mb-2"
                        >
                            Password
                        </label>
                        <div className="relative">
                            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                            <input
                                {...register("password")}
                                type={showPassword ? "text" : "password"}
                                id="password"
                                className={`w-full pl-10 pr-12 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200 ${
                                    errors.password ? "border-red-500" : "border-gray-300"
                                }`}
                                placeholder="Enter your password"
                                autoComplete="current-password"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors duration-200"
                            >
                                {showPassword ? (
                                    <EyeOff className="w-5 h-5" />
                                ) : (
                                    <Eye className="w-5 h-5" />
                                )}
                            </button>
                        </div>
                        {errors.password && (
                            <div className="flex items-center gap-2 mt-2 text-red-600 text-sm">
                                <AlertCircle className="w-4 h-4" />
                                {errors.password.message}
                            </div>
                        )}
                    </div>

                    {/* Remember Me & Forgot Password */}
                    <div className="flex items-center justify-between">
                        <label className="flex items-center">
                            <input
                                type="checkbox"
                                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                            />
                            <span className="ml-2 text-sm text-gray-600">Remember me</span>
                        </label>
                        <a
                            href="#"
                            className="text-sm text-blue-600 hover:text-blue-800 transition-colors duration-200"
                            onClick={(e) => {
                                e.preventDefault();
                                alert("Forgot password functionality would be implemented here");
                            }}
                        >
                            Forgot password?
                        </a>
                    </div>

                    {/* Submit Button */}
                    <button
                        type="submit"
                        onClick={handleSubmit(onSubmit)}
                        disabled={!isValid || isLoading}
                        className={`w-full py-3 px-4 rounded-lg font-medium transition-all duration-200 ${
                            isValid && !isLoading
                                ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
                                : "bg-gray-300 text-gray-500 cursor-not-allowed"
                        }`}
                    >
                        {isLoading ? (
                            <div className="flex items-center justify-center gap-2">
                                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                Signing in...
                            </div>
                        ) : (
                            "Sign In"
                        )}
                    </button>
                </div>

                {/* Sign Up Link */}
                <div className="text-center mt-6">
                    <p className="text-gray-600">
                        Don't have an account?{" "}
                        <a
                            href="#"
                            className="text-blue-600 hover:text-blue-800 font-medium transition-colors duration-200"
                            onClick={(e) => {
                                e.preventDefault();
                                alert("Sign up functionality would be implemented here");
                            }}
                        >
                            Sign up
                        </a>
                    </p>
                </div>
            </div>
        </div>
    );
}