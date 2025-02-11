import { useState } from "react";
import { FileStat } from "webdav";
import { downloadFile } from "../services/webdav";

export const useFileDownloader = (onError: (message: string) => void) => {
  const [downloadStatus, setDownloadStatus] = useState<{
    filename: string;
    progress: number;
    controller?: AbortController;
  } | null>(null);

  const handleFileDownload = async (file: FileStat) => {
    try {
      const { response, controller } = await downloadFile(
        file.filename,
        (progress) => {
          setDownloadStatus((prev) => ({
            ...prev!,
            progress,
          }));
        }
      );

      setDownloadStatus({
        filename: file.basename,
        progress: 0,
        controller,
      });

      const contentLength = Number(response.headers.get("Content-Length")) || 0;
      const reader = response.body?.getReader();
      const chunks: Uint8Array[] = [];
      let receivedLength = 0;

      while (true && reader) {
        const { done, value } = await reader.read();
        if (done) break;

        chunks.push(value);
        receivedLength += value.length;

        const progress = (receivedLength / contentLength) * 100;
        setDownloadStatus((prev) => ({
          ...prev!,
          progress: Math.min(progress, 100),
        }));
      }

      const blob = new Blob(chunks);
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = file.basename;

      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      if (error instanceof Error && error.name === "AbortError") {
        console.log("Download cancelled");
        onError("Download cancelled");
      } else {
        console.error("Download error:", error);
        onError(`Failed to download ${file.basename}: ${error}`);
      }
    } finally {
      setDownloadStatus(null);
    }
  };

  return {
    downloadStatus,
    handleFileDownload,
  };
};
