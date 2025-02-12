import React from "react";
import { FileStat } from "webdav";
import { FileItem } from "./FileItem";
import { sortFiles } from "../utils/sorting";
import { SortType } from "./SortSelector";

interface FileListProps {
  files: FileStat[];
  downloadStatus: {
    filename: string;
    progress: number;
    controller?: AbortController;
  } | null;
  onFileClick: (file: FileStat) => void;
  onCancelDownload: () => void;
  sortType: SortType;
}

export const FileList: React.FC<FileListProps> = ({
  files,
  downloadStatus,
  onFileClick,
  onCancelDownload,
  sortType,
}) => {
  const { folders, files: fileItems } = separateFilesAndFolders(
    files,
    sortType
  );

  return (
    <>
      {/* Folders Section */}
      <div className="mb-8">
        {folders.map((folder) => (
          <FileItem
            key={folder.filename}
            file={folder}
            downloadStatus={downloadStatus}
            onFileClick={onFileClick}
            onCancelDownload={onCancelDownload}
            displayStyle="row"
          />
        ))}
      </div>

      {/* Separator */}
      {folders.length > 0 && fileItems.length > 0 && (
        <div className="border-b border-gray-200 mb-8"></div>
      )}

      {/* Files Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {fileItems.map((file) => (
          <FileItem
            key={file.filename}
            file={file}
            downloadStatus={downloadStatus}
            onFileClick={onFileClick}
            onCancelDownload={onCancelDownload}
            displayStyle="grid"
          />
        ))}
      </div>
    </>
  );
};

const separateFilesAndFolders = (items: FileStat[], sortType: SortType) => {
  const folders = sortFiles(
    items.filter((item) => item.type === "directory"),
    sortType
  );
  const files = sortFiles(
    items.filter((item) => item.type !== "directory"),
    sortType
  );
  return { folders, files };
};
