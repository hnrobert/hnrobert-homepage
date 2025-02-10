import React from "react";
import { FileStat } from "webdav";
import { FileIcon } from "./FileIcon";
import { formatFileSize } from "../utils/formatters";

interface FileItemProps {
  file: FileStat;
  downloadStatus: {
    filename: string;
    progress: number;
  } | null;
  onFileClick: (file: FileStat) => void;
  onCancelDownload: () => void;
  displayStyle: "row" | "grid";
}

export const FileItem: React.FC<FileItemProps> = ({
  file,
  downloadStatus,
  onFileClick,
  onCancelDownload,
  displayStyle,
}) => {
  const isDownloading = downloadStatus?.filename === file.basename;

  const baseStyles =
    "bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 " +
    (displayStyle === "row" ? "mb-2 w-full" : "");

  return (
    <div
      className={baseStyles}
      onClick={() => !downloadStatus && onFileClick(file)}
      style={{
        cursor: downloadStatus ? "default" : "pointer",
        opacity: downloadStatus && !isDownloading ? 0.7 : 1,
        pointerEvents: downloadStatus && !isDownloading ? "none" : "auto",
      }}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <FileIcon isDirectory={file.type === "directory"} />
          <span className="text-gray-700 truncate hover:text-blue-600">
            {file.basename}
          </span>
        </div>
        {isDownloading && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onCancelDownload();
            }}
            className="px-2 py-1 text-sm text-red-600 hover:text-red-800 rounded"
          >
            Cancel
          </button>
        )}
      </div>
      {file.type !== "directory" && displayStyle === "grid" && (
        <div className="mt-2 text-sm text-gray-500">
          <div className="flex justify-between items-center">
            <span>Size: {formatFileSize(file.size)}</span>
            {isDownloading && (
              <span className="text-blue-500">
                {downloadStatus.progress.toFixed(1)}%
              </span>
            )}
          </div>
          {isDownloading && (
            <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
              <div
                className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${downloadStatus.progress}%` }}
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
};
