import React from "react";

interface BackButtonProps {
  currentPath: string;
  onBack: (path: string) => void;
}

export const BackButton: React.FC<BackButtonProps> = ({
  currentPath,
  onBack,
}) => {
  if (currentPath === "/") return null;

  return (
    <div className="mb-4">
      <button
        onClick={() => onBack(currentPath)}
        className="flex items-center space-x-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-gray-700 transition-colors duration-200"
      >
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 19l-7-7 7-7"
          />
        </svg>
        <span>Back to Parent Directory</span>
      </button>
    </div>
  );
};
