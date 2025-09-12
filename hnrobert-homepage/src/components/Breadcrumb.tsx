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
    <div className="flex flex-wrap p-2 items-center gap-2 text-gray-600">
      {segments.map((segment, index) => {
        const currentPath = "/" + segments.slice(0, index + 1).join("/");
        const isLastSegment = index === segments.length - 1;

        return (
          <React.Fragment key={currentPath}>
            {index > 0 && <span className="text-gray-400 shrink-0">/</span>}
            <span
              className={`hover:text-blue-600 cursor-pointer ${
                isLastSegment ? "flex-grow break-all" : "truncate max-w-[200px]"
              }`}
              title={segment}
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
