// Reusable Button Component
const Button = ({
                    children,
                    variant = "primary",
                    size = "md",
                    disabled = false,
                    loading = false,
                    className = "",
                    onClick,
                    type = "button",
                    ...props
                }) => {
    const baseStyles = "font-medium rounded-lg transition-all duration-200 flex items-center justify-center gap-2";

    const variants = {
        primary: "bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700 shadow-md hover:shadow-lg",
        secondary: "border border-gray-300 text-gray-700 hover:bg-gray-50",
        social: "border border-gray-300 text-gray-700 hover:bg-gray-50",
        facebook: "bg-blue-600 text-white hover:bg-blue-700"
    };

    const sizes = {
        sm: "px-3 py-2 text-sm",
        md: "px-4 py-3 text-base",
        lg: "px-6 py-4 text-lg"
    };

    const disabledStyles = disabled || loading ? "bg-gray-300 text-gray-500 cursor-not-allowed hover:bg-gray-300 hover:shadow-none" : "";

    return (
        <button
            type={type}
            disabled={disabled || loading}
            onClick={onClick}
            className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${disabledStyles} ${className}`}
            {...props}
        >
            {loading ? (
                <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Loading...
                </>
            ) : (
                children
            )}
        </button>
    );
};

export default Button;