
import React from "react";

interface ProgressProps {
  value: number;
  className?: string;
}

export const Progress: React.FC<ProgressProps> = ({ value, className = "" }) => {
  return (
    <div className={`w-full bg-secondary rounded-full ${className}`}>
      <div
        className="bg-primary h-full rounded-full transition-all duration-300 ease-in-out"
        style={{ width: `${Math.min(100, Math.max(0, value))}%` }}
      />
    </div>
  );
};
