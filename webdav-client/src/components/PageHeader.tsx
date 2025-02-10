import React from "react";

interface PageHeaderProps {
  selectedImage: string;
  error?: string;
  onErrorClear: () => void;
}

export const PageHeader: React.FC<PageHeaderProps> = ({
  selectedImage,
  error,
  onErrorClear,
}) => {
  return (
    <>
      <div className="flex justify-center mb-8">
        <img
          src={selectedImage}
          alt="Title"
          className="w-auto max-w-[600px] min-w-[300px]"
        />
      </div>

      {error && (
        <div className="mb-4 p-4 bg-red-100 text-red-700 rounded-lg flex justify-between items-center">
          <span>{error}</span>
          <button
            onClick={onErrorClear}
            className="ml-4 p-1 hover:bg-red-200 rounded-full transition-colors duration-200"
            aria-label="Clear error"
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
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
      )}
    </>
  );
};
