import { FileStat } from "webdav";

// 自然排序比较函数
export const naturalCompare = (a: string, b: string): number => {
  const collator = new Intl.Collator(undefined, {
    numeric: true,
    sensitivity: "base",
  });
  return collator.compare(a, b);
};

// 文件排序函数
export const sortFiles = (items: FileStat[]): FileStat[] => {
  return [...items].sort((a, b) => naturalCompare(a.basename, b.basename));
};
