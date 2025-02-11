import React from "react";
import { Breadcrumb } from "./Breadcrumb";

interface BackButtonProps {
  currentPath: string;
  onBack: (path: string) => void;
  onNavigate: (path: string) => void;
}

export const BackButton: React.FC<BackButtonProps> = ({
  currentPath,
  onBack,
  onNavigate,
}) => {
  return (
    <div className="flex items-center mb-6 space-x-4">
      {currentPath !== "/" && (
        <button
          onClick={() => onBack(currentPath)}
          className="bg-gray-100 hover:bg-gray-200 text-gray-700 py-2 px-4 rounded-lg transition-colors duration-200"
        >
          ← Back
        </button>
      )}
      <Breadcrumb path={currentPath} onNavigate={onNavigate} />
    </div>
  );
};
