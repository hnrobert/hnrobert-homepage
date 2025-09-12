import { FileStat } from "webdav";

const SYSTEM_FILES = [
  ".DS_Store",
  "._.DS_Store",
  ".Spotlight-V100",
  ".Trashes",
  "ehthumbs.db",
  "Thumbs.db",
  "$RECYCLE.BIN",
];

const MAC_TEMP_PREFIX = "._";

export const filterSystemFiles = (files: FileStat[]): FileStat[] => {
  return files.filter((file) => {
    const filename = file.basename;
    return (
      !SYSTEM_FILES.includes(filename) && !filename.startsWith(MAC_TEMP_PREFIX)
    );
  });
};
