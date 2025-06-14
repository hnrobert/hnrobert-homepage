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
    <button
      onClick={() => onBack(currentPath)}
      className="bg-gray-100 hover:bg-gray-200 text-gray-700 py-2 px-4 rounded-lg transition-colors duration-200"
    >
      ← Back
    </button>
  );
};
