import React from "react";
import { FileStat } from "webdav";
import { FileItem } from "./FileItem";

interface FileListProps {
  files: FileStat[];
  downloadStatus: {
    filename: string;
    progress: number;
    controller?: AbortController;
  } | null;
  onFileClick: (file: FileStat) => void;
}

export const FileList: React.FC<FileListProps> = ({
  files,
  downloadStatus,
  onFileClick,
}) => {
  const { folders, files: fileItems } = separateFilesAndFolders(files);

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
            onCancelDownload={() => downloadStatus?.controller?.abort()}
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
            onCancelDownload={() => downloadStatus?.controller?.abort()}
            displayStyle="grid"
          />
        ))}
      </div>
    </>
  );
};

const separateFilesAndFolders = (items: FileStat[]) => {
  const folders = items.filter((item) => item.type === "directory");
  const files = items.filter((item) => item.type !== "directory");
  return { folders, files };
};
