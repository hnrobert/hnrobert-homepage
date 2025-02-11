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

  const encodedUrl = `https://hnrobert.space${encodeURI(filename).replace(
    /%2F/g,
    "/"
  )}`;

  const response = await fetch(encodedUrl, {
    headers: {
      Authorization: `Basic ${credentials}`,
    },
    signal: controller.signal,
  });

  if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

  return { response, controller };
};
