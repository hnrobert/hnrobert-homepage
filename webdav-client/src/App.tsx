import React, { useEffect, useState } from "react";
import { createClient, FileStat } from "webdav";

const client = createClient("http://192.168.50.146:9970", {
  username: "robert",
  password: "060610",
});

function App() {
  const [files, setFiles] = useState<FileStat[]>([]);
  const [selectedImage, setSelectedImage] = useState<string>("");
  const [error, setError] = useState<string>("");

  useEffect(() => {
    const checkImageSize = () => {
      const width = window.innerWidth;
      setSelectedImage(
        width > 1024 ? "/assets/title-x2.png" : "/assets/title.png"
      );
    };

    checkImageSize();
    window.addEventListener("resize", checkImageSize);

    const getFiles = async () => {
      try {
        // Test connection first
        // const isAvailable = await client.exists("/").catch(() => false);

        // if (!isAvailable) {
        //   throw new Error("Cannot connect to WebDAV server");
        // }

        const directoryItems = await client.getDirectoryContents("/");
        setFiles(
          Array.isArray(directoryItems) ? directoryItems : directoryItems.data
        );
        setError(""); // Clear any previous errors
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : "Unknown error occurred";
        console.error("Error fetching files:", errorMessage);
        setError(`Failed to load files: ${errorMessage}`);
        setFiles([]);
      }
    };

    getFiles();
    return () => window.removeEventListener("resize", checkImageSize);
  }, []);

  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center mb-8">
          <img
            src={selectedImage}
            alt="Title"
            className="w-auto max-w-[600px] min-w-[300px]"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {files.map((file) => (
            <div
              key={file.filename}
              className="bg-white p-4 rounded-lg shadow-md"
            >
              <div className="flex items-center space-x-2">
                <svg
                  className="w-6 h-6 text-blue-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
                <span className="text-gray-700 truncate">{file.filename}</span>
              </div>
              <div className="mt-2 text-sm text-gray-500">
                Size: {(file.size / 1024).toFixed(2)} KB
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default App;
