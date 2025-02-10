import React from "react";

interface PageHeaderProps {
  selectedImage: string;
  error?: string;
}

export const PageHeader: React.FC<PageHeaderProps> = ({
  selectedImage,
  error,
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
        <div className="mb-4 p-4 bg-red-100 text-red-700 rounded-lg">
          {error}
        </div>
      )}
    </>
  );
};
