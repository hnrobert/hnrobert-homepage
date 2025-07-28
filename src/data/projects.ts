import configData from "../configs/config.json";
import {
  internalGitHubAPIService,
  type ProjectInfo,
} from "../services/internalGitHubAPI";
import { gitHubAPIService } from "../services/githubAPI"; // 保持向后兼容

// Legacy interface for backward compatibility
export interface Project {
  id: string;
  title: string;
  description: string;
  tech: string[];
  category: string;
  repository: string;
  languages: string[];
  features: string[];
  status: string;
  version?: string;
  license: string;
  platform?: string;
  targetGame?: string;
}

// New interface that uses GitHub API
export type WebProject = ProjectInfo;

// Convert project to legacy format for compatibility
function projectToLegacy(project: ProjectInfo): Project {
  return {
    id: project.id,
    title: project.title,
    description: project.description,
    tech: project.languages.length > 0 ? project.languages : [project.language],
    category: project.topics[0] || "software",
    repository: project.repository,
    languages: project.languages,
    features: [],
    status: project.status,
    license: "Unknown",
  };
}

// Cache for loaded projects
let projectsCache: ProjectInfo[] | null = null;
let lastCacheTime = 0;
const CACHE_DURATION = 10 * 60 * 1000; // 10 minutes

export async function loadProjects(): Promise<ProjectInfo[]> {
  // Return cached data if available and fresh
  if (projectsCache && Date.now() - lastCacheTime < CACHE_DURATION) {
    return projectsCache;
  }

  try {
    const projectUrls = configData.featuredProjects as string[];
    // 优先使用内部API服务，提供更好的认证和缓存
    const projects = await internalGitHubAPIService.enrichProjects(projectUrls);

    // Cache the results
    projectsCache = projects;
    lastCacheTime = Date.now();

    return projects;
  } catch (error) {
    console.error(
      "Failed to load projects with internal API, falling back to direct API:",
      error
    );

    try {
      // 回退到直接GitHub API调用
      const projectUrls = configData.featuredProjects as string[];
      const projects = await gitHubAPIService.enrichProjects(projectUrls);

      projectsCache = projects;
      lastCacheTime = Date.now();

      return projects;
    } catch (fallbackError) {
      console.error(
        "Failed to load projects with fallback API:",
        fallbackError
      );

      // Return cached data if available, even if expired
      if (projectsCache) {
        return projectsCache;
      }

      // Fallback: return placeholder data
      const projectUrls = configData.featuredProjects as string[];
      return projectUrls.map((url) =>
        internalGitHubAPIService.getPlaceholderProject(url)
      );
    }
  }
}

export function getPlaceholderProjects(): ProjectInfo[] {
  const projectUrls = configData.featuredProjects as string[];
  return projectUrls.map((url) =>
    internalGitHubAPIService.getPlaceholderProject(url)
  );
}

// Legacy export for backward compatibility
export async function loadLegacyProjects(): Promise<Project[]> {
  const projects = await loadProjects();
  return projects.map(projectToLegacy);
}

// Export project URLs for direct access
export const projectUrlList: string[] = configData.featuredProjects as string[];
