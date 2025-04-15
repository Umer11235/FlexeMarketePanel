"use client";

import React from "react";

interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  width?: string;
}

const Button: React.FC<ButtonProps> = ({
  children,
  onClick,
  width = "w-44",
}) => {
  return (
    <button
      onClick={onClick}
      className={`bg-gray-900 py-2 text-white rounded-md   ${width}`}
    >
      {children}
    </button>
  );
};

export default Button;
