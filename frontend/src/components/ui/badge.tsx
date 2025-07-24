import * as React from "react";

type BadgeVariant = "default" | "secondary" | "destructive" | "outline";

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
}

const badgeStyles = {
  default: "bg-blue-500 text-white border-blue-500",
  secondary: "bg-gray-200 text-gray-800 border-gray-200",
  destructive: "bg-red-500 text-white border-red-500",
  outline: "bg-transparent text-gray-700 border-gray-300"
};

function Badge({ className = "", variant = "default", children, ...props }: BadgeProps) {
  const baseStyles = "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium transition-colors";
  const variantStyles = badgeStyles[variant];
  
  return (
    <span 
      className={`${baseStyles} ${variantStyles} ${className}`} 
      {...props}
    >
      {children}
    </span>
  );
}

export { Badge };
