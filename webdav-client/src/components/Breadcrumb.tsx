import React from "react";

interface BreadcrumbProps {
  path: string;
  onNavigate: (path: string) => void;
}

export const Breadcrumb: React.FC<BreadcrumbProps> = ({ path, onNavigate }) => {
  const segments = path.split("/").filter(Boolean);

  if (segments.length === 0) {
    return null;
  }

  return (
    <div className="flex items-center space-x-2 text-gray-600">
      {segments.map((segment, index) => {
        const currentPath = "/" + segments.slice(0, index + 1).join("/");
        return (
          <React.Fragment key={currentPath}>
            {index > 0 && <span className="text-gray-400">/</span>}
            <span
              className="hover:text-blue-600 cursor-pointer"
              onClick={() => onNavigate(currentPath)}
            >
              {segment}
            </span>
          </React.Fragment>
        );
      })}
    </div>
  );
};
