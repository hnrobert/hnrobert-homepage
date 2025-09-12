import { createClient } from "webdav";

export const client = createClient("https://hnrobert.space", {
  username: "web",
  password: "web",
});

export const downloadFile = async (
  filename: string,
  onProgress: (progress: number) => void
) => {
  const controller = new AbortController();
  const credentials = btoa("web:web");

  const decodedFilename = decodeURIComponent(filename);
  const encodedUrl = `https://hnrobert.space${encodeURI(
    decodedFilename
  ).replace(/%2F/g, "/")}`;

  console.log("Downloading file:", encodedUrl);
  const response = await fetch(encodedUrl, {
    headers: {
      Authorization: `Basic ${credentials}`,
    },
    signal: controller.signal,
  });

  console.log(
    "Response headers:",
    Object.fromEntries(response.headers.entries())
  );
  console.log("Response status:", response.status);

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(
      `HTTP error! status: ${response.status}, message: ${errorText}`
    );
  }

  const contentLength = response.headers.get("Content-Length");
  if (!contentLength) {
    throw new Error("Content-Length header is missing");
  }

  return { response, controller };
};

const CHUNK_SIZE = 1 * 1024 * 1024;
const MAX_RETRIES = 10;

export const downloadFileInChunks = async (
  filename: string,
  onProgress: (progress: number, receivedBytes: number) => void,
  controller: AbortController
) => {
  const credentials = btoa("web:web");
  const decodedFilename = decodeURIComponent(filename);
  const encodedUrl = `https://hnrobert.space${encodeURI(
    decodedFilename
  ).replace(/%2F/g, "/")}`;

  // Get file size first
  const headResponse = await fetch(encodedUrl, {
    method: "HEAD",
    headers: { Authorization: `Basic ${credentials}` },
    signal: controller.signal,
  });

  const contentLength = Number(headResponse.headers.get("Content-Length"));
  if (!contentLength) {
    throw new Error("Content-Length header is missing");
  }

  const chunks: Uint8Array[] = [];
  let receivedLength = 0;

  for (let start = 0; start < contentLength; start += CHUNK_SIZE) {
    const end = Math.min(start + CHUNK_SIZE - 1, contentLength - 1);
    let retries = 0;

    while (retries < MAX_RETRIES) {
      try {
        const response = await fetch(encodedUrl, {
          headers: {
            Authorization: `Basic ${credentials}`,
            Range: `bytes=${start}-${end}`,
          },
          signal: controller.signal,
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const chunk = await response.arrayBuffer();
        chunks.push(new Uint8Array(chunk));
        receivedLength += chunk.byteLength;
        onProgress((receivedLength / contentLength) * 100, receivedLength);
        break; // Success, exit retry loop
      } catch (error) {
        if (error instanceof Error && error.name === "AbortError") {
          throw error;
        }

        retries++;
        if (retries === MAX_RETRIES) {
          throw new Error(
            `Failed to download chunk after ${MAX_RETRIES} retries`
          );
        }
        await new Promise((resolve) => setTimeout(resolve, 1000 * retries));
      }
    }
  }

  return {
    blob: new Blob(chunks),
    contentLength,
    controller,
  };
};
