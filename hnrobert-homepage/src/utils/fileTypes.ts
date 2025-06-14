export type FileType =
  | "directory"
  | "image"
  | "video"
  | "torrent"
  | "installer"
  | "disk-image"
  | "archive"
  | "font"
  | "default";

const FILE_EXTENSIONS = {
  image: [".jpg", ".jpeg", ".png", ".gif", ".bmp", ".webp", ".svg", ".ico"],
  video: [".mp4", ".mkv", ".avi", ".mov", ".wmv", ".flv", ".webm", ".m4v"],
  torrent: [".torrent"],
  installer: [".exe", ".msi", ".pkg", ".dmg", ".app"],
  diskImage: [".iso", ".img"],
  archive: [".zip", ".rar", ".7z", ".tar", ".gz", ".bz2", ".xz"],
  font: [".ttf", ".otf", ".woff", ".woff2", ".eot"],
};

export const getFileType = (
  filename: string,
  isDirectory: boolean
): FileType => {
  if (isDirectory) return "directory";

  const extension = filename.toLowerCase().slice(filename.lastIndexOf("."));

  if (FILE_EXTENSIONS.image.includes(extension)) return "image";
  if (FILE_EXTENSIONS.video.includes(extension)) return "video";
  if (FILE_EXTENSIONS.torrent.includes(extension)) return "torrent";
  if (FILE_EXTENSIONS.installer.includes(extension)) return "installer";
  if (FILE_EXTENSIONS.diskImage.includes(extension)) return "disk-image";
  if (FILE_EXTENSIONS.archive.includes(extension)) return "archive";
  if (FILE_EXTENSIONS.font.includes(extension)) return "font";

  return "default";
};
