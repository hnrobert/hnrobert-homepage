import React from "react";
import { Breadcrumb } from "./Breadcrumb";
import { SortSelector, SortType } from "./SortSelector";

interface BackButtonProps {
  currentPath: string;
  onBack: (path: string) => void;
  onNavigate: (path: string) => void;
  sortType: SortType;
  onSortChange: (type: SortType) => void;
}

export const BackButton: React.FC<BackButtonProps> = ({
  currentPath,
  onBack,
  onNavigate,
  sortType,
  onSortChange,
}) => {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          {currentPath !== "/" && (
            <button
              onClick={() => onBack(currentPath)}
              className="bg-gray-100 hover:bg-gray-200 text-gray-700 py-2 px-4 rounded-lg transition-colors duration-200"
            >
              ← Back
            </button>
          )}
        </div>
        <SortSelector sortType={sortType} onSortChange={onSortChange} />
      </div>
      <Breadcrumb path={currentPath} onNavigate={onNavigate} />
    </div>
  );
};
