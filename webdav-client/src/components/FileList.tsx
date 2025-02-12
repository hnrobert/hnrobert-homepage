import React, { useState, useEffect } from "react";
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
  onFileClick: (file: FileStat) => Promise<void>;
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
  const [columnsPerRow, setColumnsPerRow] = useState(3);
  const { folders, files: fileItems } = separateFilesAndFolders(
    files,
    sortType
  );

  useEffect(() => {
    const updateColumns = () => {
      const width = window.innerWidth;
      if (width < 768) setColumnsPerRow(1);
      else if (width < 1024) setColumnsPerRow(2);
      else setColumnsPerRow(3);
    };

    updateColumns();
    window.addEventListener("resize", updateColumns);
    return () => window.removeEventListener("resize", updateColumns);
  }, []);

  return (
    <div className="space-y-8">
      {/* Folders Section */}
      <div className="space-y-2">
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
        <div className="border-b border-gray-200"></div>
      )}

      {/* Files Section - Using CSS Grid with auto-rows */}
      <div
        className="grid gap-4"
        style={{
          gridTemplateColumns: `repeat(${columnsPerRow}, 1fr)`,
          alignItems: "start",
        }}
      >
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
    </div>
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
