import { FileStat } from "webdav";
import { getFileType } from "./fileTypes";
import { SortType } from "../components/SortSelector";

export const naturalCompare = (a: string, b: string): number => {
  const collator = new Intl.Collator(undefined, {
    numeric: true,
    sensitivity: "base",
  });
  return collator.compare(a, b);
};

export const sortFiles = (
  items: FileStat[],
  sortType: SortType
): FileStat[] => {
  return [...items].sort((a, b) => {
    if (sortType === "type") {
      const typeA = getFileType(a.basename, a.type === "directory");
      const typeB = getFileType(b.basename, b.type === "directory");
      const typeCompare = naturalCompare(typeA, typeB);
      return typeCompare !== 0
        ? typeCompare
        : naturalCompare(a.basename, b.basename);
    }
    return naturalCompare(a.basename, b.basename);
  });
};
