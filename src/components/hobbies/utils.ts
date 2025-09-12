import { HobbyData } from "./types";

/**
 * 检查图片是否为GIF格式
 */
export const isGifImage = (imagePath: string): boolean => {
  return imagePath.toLowerCase().endsWith(".gif");
};

/**
 * 查找hobby对应的图片（只使用已知存在的图片）
 */
export const findHobbyImage = (
  hobbyName: string
): { path: string; isGif: boolean } | null => {
  // 已知存在的图片映射
  const knownImages: Record<string, string> = {
    Cycling: "Cycling.png",
    Running: "Running.png",
    "Watching Movies": "Watching-Movies.png",
    "Video Editing": "Video-Editing.png",
    Orienteering: "Orienteering.png",
  };

  // 如果在已知映射中找到，直接返回
  if (knownImages[hobbyName]) {
    const imagePath = `/assets/hobbies/${knownImages[hobbyName]}`;
    return {
      path: imagePath,
      isGif: knownImages[hobbyName].endsWith(".gif"),
    };
  }

  return null;
};

/**
 * 处理hobbies数据，为每个hobby查找对应的图片
 */
export const processHobbiesData = (hobbies: string[]): HobbyData[] => {
  const processedHobbies: HobbyData[] = [];

  for (const hobby of hobbies) {
    const [emoji, ...nameParts] = hobby.split(" ");
    const name = nameParts.join(" ");

    const imageInfo = findHobbyImage(name);

    processedHobbies.push({
      emoji,
      name,
      hasImage: !!imageInfo,
      imagePath: imageInfo?.path,
      isGif: imageInfo?.isGif || false,
    });
  }

  return processedHobbies;
};
