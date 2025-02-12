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
            <>
              <div className="flex items-center space-x-2 mt-2">
                <div className="flex-grow">
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${downloadStatus.progress}%` }}
                    />
                  </div>
                </div>
                <span className="text-blue-500 min-w-[4rem] text-right">
                  {downloadStatus.progress.toFixed(1)}%
                </span>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onCancelDownload();
                  }}
                  className="text-sm text-red-600 hover:text-red-800 px-2 py-1 rounded"
                >
                  Cancel
                </button>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
};
