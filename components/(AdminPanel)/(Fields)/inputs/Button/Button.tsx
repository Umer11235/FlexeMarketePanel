"use client";

import React from "react";

interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  width?: string;
  disabled?: boolean;
}

const Button: React.FC<ButtonProps> = ({
  children,
  onClick,
  width = "w-44",
  disabled = false,
}) => {
  return (
    <button
      onClick={onClick}
      className={`bg-gray-900 py-2 text-white rounded-md ${width}`}
    disabled={disabled}
    >
      {children}
    </button>
  );
};

export default Button;
