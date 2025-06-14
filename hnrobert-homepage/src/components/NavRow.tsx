import React from "react";
import { BackButton } from "./BackButton";
import { Breadcrumb } from "./Breadcrumb";
import { SortSelector, SortType } from "./SortSelector";

interface NavRowProps {
  currentPath: string;
  onBack: (path: string) => void;
  onNavigate: (path: string) => void;
  sortType: SortType;
  onSortChange: (type: SortType) => void;
}

export const NavRow: React.FC<NavRowProps> = ({
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
          <BackButton currentPath={currentPath} onBack={onBack} />
        </div>
        <SortSelector sortType={sortType} onSortChange={onSortChange} />
      </div>
      <Breadcrumb path={currentPath} onNavigate={onNavigate} />
    </div>
  );
};
