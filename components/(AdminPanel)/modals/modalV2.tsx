import React from "react";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

const ModalV2: React.FC<ModalProps> = ({ isOpen, onClose, title, children }) => {
  
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-gray-800 bg-opacity-50"
    >
      <div className="bg-white dark:bg-gray-700 rounded-lg shadow-lg w-full max-w-2xl p-5">
        {/* Header */}
        <div className="flex justify-between items-center border-b pb-3">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white">{title}</h3>
          <button
            className="text-gray-400 hover:text-gray-600 dark:hover:text-white"
            onClick={onClose}
          >
            ✕
          </button>
        </div>

        {/* Body */}
        <div className="py-4">{children}</div>
      </div>
    </div>
  );
};

export default ModalV2;
