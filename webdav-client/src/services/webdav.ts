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

  if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

  return { response, controller };
};
