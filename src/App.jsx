import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom"
import { AuthProvider } from "./contexts/AuthContext"
import LoginPage from "./pages/LoginPage"
import RegisterPage from "./pages/RegisterPage"
import DashboardPage from "./pages/DashboardPage"
import ProtectedRoute from "./components/ProtectedRoute"
import PublicRoute from "./components/PublicRoute"
import { ToastProvider } from "./contexts/ToastContext"
import ToastContainer from "./components/ToastContainer"
import "./App.css"
import HomePage from "./pages/HomePage.jsx";
import ForgotPasswordPage from "./pages/ForgotPasswordPage.jsx";
import VerifyEmailPage from "./pages/VerifyEmailPage.jsx";
import ResetPasswordPage from "./pages/ResetPasswordPage.jsx";

function App() {
    return (
        <ToastProvider>
            <AuthProvider>
                <Router>
                    <div className="App">
                        <Routes>
                            {/* Public routes */}
                            <Route path="/home" element={<PublicRoute><HomePage /></PublicRoute>} />
                            <Route path="/login" element={<PublicRoute><LoginPage /></PublicRoute>} />
                            <Route path="/register" element={<PublicRoute><RegisterPage /></PublicRoute>} />
                            <Route path="/forgot-password" element={<PublicRoute><ForgotPasswordPage /></PublicRoute> } />
                            <Route path="/verify-email" element={ <PublicRoute><VerifyEmailPage /></PublicRoute>} />
                            <Route path="/reset-password" element={<PublicRoute><ResetPasswordPage /></PublicRoute>} />
                            {/* Protected routes */}
                            <Route path="/dashboard" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />

                            {/* Default route - redirect to dashboard (which will redirect to login if not authenticated) */}
                            <Route path="/" element={<Navigate to="/home" replace />} />

                            {/* Catch all - redirect to dashboard */}
                            <Route path="*" element={<Navigate to="/home" replace />} />
                        </Routes>

                        <ToastContainer />
                    </div>
                </Router>
            </AuthProvider>
        </ToastProvider>
    )
}

export default App
