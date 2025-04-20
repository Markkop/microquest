import { HTMLMotionProps, motion } from "framer-motion";
import React from "react";

interface ButtonProps {
  children?: React.ReactNode;
  variant?: "primary" | "secondary" | "gradient" | "icon";
  size?: "sm" | "md" | "lg";
  isLoading?: boolean;
  icon?: React.ReactNode;
  className?: string;
  disabled?: boolean;
  onClick?: () => void;
  type?: "button" | "submit" | "reset";
}

const Button: React.FC<ButtonProps> = ({
  children,
  variant = "primary",
  size = "md",
  isLoading = false,
  icon,
  className = "",
  disabled,
  onClick,
  type = "button",
}) => {
  // Size classes
  const sizeClasses = {
    sm: "py-1 px-2 text-sm",
    md: "py-2 px-4",
    lg: "py-3 px-6 text-lg",
  };

  // Variant classes
  const variantClasses = {
    primary: "bg-primary-600 hover:bg-primary-700 text-white",
    secondary: "bg-gray-200 hover:bg-gray-300 text-gray-800",
    gradient: "bg-gradient-to-r from-primary-600 to-accent-600 text-white",
    icon: "h-8 w-8 rounded-full flex items-center justify-center",
  };

  // Icon variant specific styling
  const iconVariantClasses = {
    primary: "border border-primary-200 text-primary-600 hover:bg-primary-50",
    secondary: "border border-gray-200 text-gray-600 hover:bg-gray-50",
    gradient: "border border-primary-200 text-primary-600 hover:bg-primary-50",
    icon: "",
  };

  const baseClasses =
    "font-medium rounded-lg transition-all focus:outline-none";

  // Generate final classes based on variant and size
  const buttonClasses = `
    ${baseClasses}
    ${
      variant === "icon" ? iconVariantClasses[variant] : variantClasses[variant]
    }
    ${variant === "icon" ? "" : sizeClasses[size]}
    ${disabled || isLoading ? "opacity-70 cursor-not-allowed" : ""}
    ${className}
  `.trim();

  const motionProps: HTMLMotionProps<"button"> = {
    className: buttonClasses,
    disabled: disabled || isLoading,
    onClick,
    type,
    whileHover: !disabled && !isLoading ? { scale: 1.02 } : undefined,
    whileTap: !disabled && !isLoading ? { scale: 0.98 } : undefined,
  };

  return (
    <motion.button {...motionProps}>
      {isLoading ? (
        <span className="flex items-center justify-center">
          <svg
            className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
          {children}
        </span>
      ) : (
        <>
          {icon ? (
            <span className="flex items-center justify-center">
              {icon} {children}
            </span>
          ) : (
            children
          )}
        </>
      )}
    </motion.button>
  );
};

export default Button;
