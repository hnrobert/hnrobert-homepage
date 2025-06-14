import React from "react";
import { FileStat } from "webdav";
import { FileIcon } from "./FileIcon";
import { formatFileSize, formatDate } from "../utils/formatters";
import { getFileType } from "../utils/fileTypes";

interface FileItemProps {
  file: FileStat;
  downloadStatus: {
    filename: string;
    progress: number;
    speed: number;
  } | null;
  onFileClick: (file: FileStat) => void;
  onCancelDownload: () => void;
  displayStyle: "row" | "grid";
}

const formatSpeed = (bytesPerSecond: number): string => {
  if (bytesPerSecond === 0) return "0 B/s";
  if (bytesPerSecond < 1024) return `${bytesPerSecond.toFixed(1)} B/s`;
  if (bytesPerSecond < 1024 * 1024)
    return `${(bytesPerSecond / 1024).toFixed(1)} KB/s`;
  return `${(bytesPerSecond / (1024 * 1024)).toFixed(1)} MB/s`;
};

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
    (displayStyle === "row" ? "mb-2 w-full" : "h-full flex flex-col");

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
      <div className="flex items-start justify-between w-full">
        <div className="flex items-start space-x-2 min-w-0 flex-1">
          <div className="flex-shrink-0">
            <FileIcon
              type={getFileType(file.basename, file.type === "directory")}
            />
          </div>
          <span className="text-gray-700 hover:text-blue-600 break-all min-w-0 pr-2">
            {file.basename}
          </span>
        </div>
      </div>

      {file.type !== "directory" && (
        <div className="text-sm text-gray-500 mt-auto min-h-[1.5rem]">
          <div className="border-t border-white my-1" />
          <div className="flex justify-between items-center">
            <span>Size: {formatFileSize(file.size)}</span>
            <span className="text-xs text-gray-400">
              {formatDate(file.lastmod)}
            </span>
          </div>

          {isDownloading && (
            <div className="mt-3">
              <div className="flex items-center justify-between text-sm mb-2">
                <span className="text-blue-600 font-medium">
                  {downloadStatus.progress.toFixed(1)}%
                </span>
                <span className="text-gray-600">
                  {formatSpeed(downloadStatus.speed)}
                </span>
              </div>

              <div className="flex items-center space-x-2">
                <div className="flex-1">
                  <div className="overflow-hidden h-2 text-xs flex rounded-full border border-blue-200 bg-gray-50">
                    <div
                      className="bg-blue-500 shadow-lg transition-all duration-300 ease-in-out"
                      style={{ width: `${downloadStatus.progress}%` }}
                    />
                  </div>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onCancelDownload();
                  }}
                  className="text-sm text-red-600 hover:text-red-800 hover:bg-red-50 px-3 py-1 rounded-full transition-colors duration-200 whitespace-nowrap"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
