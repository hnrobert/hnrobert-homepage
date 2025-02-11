import React from "react";

export type SortType = "name" | "type";

interface SortSelectorProps {
  sortType: SortType;
  onSortChange: (type: SortType) => void;
}

export const SortSelector: React.FC<SortSelectorProps> = ({
  sortType,
  onSortChange,
}) => {
  return (
    <div className="flex items-center space-x-2">
      <span className="text-gray-600">Sort by:</span>
      <select
        value={sortType}
        onChange={(e) => onSortChange(e.target.value as SortType)}
        className="bg-gray-100 text-gray-700 py-2 px-3 rounded-lg border-none focus:ring-2 focus:ring-blue-500"
      >
        <option value="name">Name</option>
        <option value="type">Type</option>
      </select>
    </div>
  );
};
