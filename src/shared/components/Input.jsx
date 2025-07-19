import {AlertCircle} from "lucide-react";
import {forwardRef, useState} from "react";

// Reusable Input Component
const Input = forwardRef(({
                              label,
                              type = "text",
                              placeholder,
                              error,
                              icon: Icon,
                              showPasswordToggle = false,
                              className = "",
                              ...props
                          }, ref) => {
    const [showPassword, setShowPassword] = useState(false);

    const inputType = showPasswordToggle ? (showPassword ? "text" : "password") : type;

    return (
        <div className="space-y-2">
            {label && (
                <label className="block text-sm font-medium text-gray-700">
                    {label}
                </label>
            )}

            <div className="relative">
                {Icon && (
                    <Icon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                )}

                <input
                    ref={ref}
                    type={inputType}
                    placeholder={placeholder}
                    className={`w-full ${Icon ? 'pl-10' : 'pl-4'} ${showPasswordToggle ? 'pr-12' : 'pr-4'} py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200 ${
                        error ? "border-red-500" : "border-gray-300"
                    } ${className}`}
                    {...props}
                />

                {showPasswordToggle && (
                    <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                        {showPassword ? (
                            <EyeOff className="w-5 h-5" />
                        ) : (
                            <Eye className="w-5 h-5" />
                        )}
                    </button>
                )}
            </div>

            {error && (
                <div className="flex items-center gap-2 text-red-600 text-sm">
                    <AlertCircle className="w-4 h-4" />
                    {error}
                </div>
            )}
        </div>
    );
});

Input.displayName = "Input";