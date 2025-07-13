export interface GitHubRepo {
  id: number;
  name: string;
  full_name: string;
  description: string | null;
  html_url: string;
  homepage: string | null;
  language: string | null;
  languages_url: string;
  topics: string[];
  stargazers_count: number;
  forks_count: number;
  license: {
    key: string;
    name: string;
    spdx_id: string;
  } | null;
  created_at: string;
  updated_at: string;
  pushed_at: string;
  archived: boolean;
  disabled: boolean;
  open_issues_count: number;
}

export interface GitHubLanguages {
  [language: string]: number;
}

export interface ProjectInfo {
  id: string;
  title: string;
  description: string;
  repository: string;
  language: string;
  languages: string[];
  topics: string[];
  stars: number;
  forks: number;
  lastUpdated: string;
  status: "active" | "archived" | "experimental";
  loading?: boolean;
  error?: string;
}

class GitHubAPIService {
  private baseUrl = "https://api.github.com";
  private cache = new Map<string, { data: any; timestamp: number }>();
  private cacheExpiry = 10 * 60 * 1000; // 10 minutes
  private authToken: string | null = null;

  constructor() {
    // 尝试从环境变量获取 GitHub token
    this.authToken =
      process.env.GITHUB_TOKEN || process.env.NEXT_PUBLIC_GITHUB_TOKEN || null;

    if (!this.authToken) {
      console.warn(
        "GitHub token not found. API requests will be rate-limited."
      );
    }
  }

  private parseGitHubUrl(url: string): { owner: string; repo: string } | null {
    const match = url.match(/github\.com\/([^\/]+)\/([^\/]+)/);
    if (!match) return null;
    return { owner: match[1], repo: match[2] };
  }

  private getHeaders(): HeadersInit {
    const headers: HeadersInit = {
      Accept: "application/vnd.github.v3+json",
      "User-Agent": "hnrobert-homepage",
    };

    if (this.authToken) {
      headers["Authorization"] = `Bearer ${this.authToken}`;
    }

    return headers;
  }

  private async fetchWithCache<T>(endpoint: string): Promise<T> {
    const cacheKey = endpoint;
    const cached = this.cache.get(cacheKey);

    if (cached && Date.now() - cached.timestamp < this.cacheExpiry) {
      return cached.data;
    }

    try {
      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        headers: this.getHeaders(),
      });

      if (!response.ok) {
        const errorText = await response.text();
        let errorMessage = `GitHub API error: ${response.status} ${response.statusText}`;

        try {
          const errorData = JSON.parse(errorText);
          if (errorData.message) {
            errorMessage += ` - ${errorData.message}`;
          }
          if (response.status === 403 && errorData.documentation_url) {
            errorMessage += ` (Rate limit documentation: ${errorData.documentation_url})`;
          }
        } catch (e) {
          // 如果解析错误响应失败，使用原始错误信息
        }

        throw new Error(errorMessage);
      }

      const data = await response.json();
      this.cache.set(cacheKey, { data, timestamp: Date.now() });
      return data;
    } catch (error) {
      // Return cached data if available, even if expired
      if (cached) {
        console.warn(
          `Using cached data for ${endpoint} due to API error:`,
          error
        );
        return cached.data;
      }
      throw error;
    }
  }

  async getRepository(owner: string, repo: string): Promise<GitHubRepo> {
    return this.fetchWithCache<GitHubRepo>(`/repos/${owner}/${repo}`);
  }

  async getRepositoryLanguages(
    owner: string,
    repo: string
  ): Promise<GitHubLanguages> {
    return this.fetchWithCache<GitHubLanguages>(
      `/repos/${owner}/${repo}/languages`
    );
  }

  async enrichProject(url: string): Promise<ProjectInfo> {
    const parsed = this.parseGitHubUrl(url);
    if (!parsed) {
      throw new Error("Invalid GitHub URL format");
    }

    try {
      // 获取仓库基本信息
      const repoData = await this.getRepository(parsed.owner, parsed.repo);

      // 获取语言信息
      let languages: string[] = [];
      let primaryLanguage = repoData.language || "Unknown";

      try {
        const languagesData = await this.getRepositoryLanguages(
          parsed.owner,
          parsed.repo
        );
        languages = Object.keys(languagesData);
        if (languages.length > 0) {
          primaryLanguage = languages[0];
        }
      } catch (error) {
        console.warn(
          `Failed to fetch languages for ${parsed.owner}/${parsed.repo}:`,
          error
        );
        if (repoData.language) {
          languages = [repoData.language];
        }
      }

      // 确定项目状态
      let status: "active" | "archived" | "experimental" = "active";
      if (repoData.archived) {
        status = "archived";
      } else if (repoData.topics && repoData.topics.includes("experimental")) {
        status = "experimental";
      }

      return {
        id: `${parsed.owner}/${parsed.repo}`,
        title: repoData.name.replace(/-/g, " "),
        description: repoData.description || "No description available",
        repository: url,
        language: primaryLanguage,
        languages: languages,
        topics: repoData.topics || [],
        stars: repoData.stargazers_count || 0,
        forks: repoData.forks_count || 0,
        lastUpdated: repoData.updated_at || new Date().toISOString(),
        status: status,
      };
    } catch (error) {
      console.error(`Failed to enrich project ${url}:`, error);

      const errorMessage =
        error instanceof Error ? error.message : "Unknown error occurred";

      return {
        id: `${parsed.owner}/${parsed.repo}`,
        title: parsed.repo.replace(/-/g, " "),
        description: "Failed to load project information",
        repository: url,
        language: "Unknown",
        languages: [],
        topics: [],
        stars: 0,
        forks: 0,
        lastUpdated: new Date().toISOString(),
        status: "active",
        error: errorMessage,
      };
    }
  }

  async enrichProjects(urls: string[]): Promise<ProjectInfo[]> {
    const results = await Promise.allSettled(
      urls.map((url) => this.enrichProject(url))
    );

    return results.map((result, index) => {
      if (result.status === "fulfilled") {
        return result.value;
      } else {
        // 处理失败的情况
        const parsed = this.parseGitHubUrl(urls[index]);
        return {
          id: parsed ? `${parsed.owner}/${parsed.repo}` : urls[index],
          title: parsed ? parsed.repo.replace(/-/g, " ") : "Unknown Project",
          description: "Failed to load project information",
          repository: urls[index],
          language: "Unknown",
          languages: [],
          topics: [],
          stars: 0,
          forks: 0,
          lastUpdated: new Date().toISOString(),
          status: "active" as const,
          error: result.reason?.message || "Failed to load project",
        };
      }
    });
  }

  // 获取初始占位符数据
  getPlaceholderProject(url: string): ProjectInfo {
    const parsed = this.parseGitHubUrl(url);

    return {
      id: parsed ? `${parsed.owner}/${parsed.repo}` : url,
      title: parsed ? parsed.repo.replace(/-/g, " ") : "Loading...",
      description: "Loading project information...",
      repository: url,
      language: "Loading...",
      languages: [],
      topics: [],
      stars: 0,
      forks: 0,
      lastUpdated: new Date().toISOString(),
      status: "active",
      loading: true,
    };
  }
}

export const gitHubAPIService = new GitHubAPIService();
