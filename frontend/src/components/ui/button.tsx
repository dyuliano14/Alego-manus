import React from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "outline" | "ghost";
  size?: "xs" | "sm" | "md" | "lg";
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = "default",
  size = "md",
  className = "",
  ...props
}) => {
  const baseClasses =
    "inline-flex items-center justify-center font-medium rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2";

  const variantClasses = {
    default:
      "bg-blue-500 text-white hover:bg-blue-600 focus:ring-blue-500 shadow-md hover:shadow-lg",
    outline:
      "border border-gray-300 bg-white hover:bg-gray-50 hover:text-gray-900 focus:ring-blue-500 text-gray-700",
    ghost: "hover:bg-gray-100 hover:text-gray-900 focus:ring-blue-500 text-gray-700",
  };

  const sizeClasses = {
    xs: "h-8 px-3 text-xs min-h-[32px]",
    sm: "h-10 px-4 text-sm min-h-[40px]",
    md: "h-12 px-6 py-3 min-h-[48px] text-base touch-manipulation",
    lg: "h-14 px-8 text-lg min-h-[56px] touch-manipulation",
  };

  return (
    <button
      className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};
