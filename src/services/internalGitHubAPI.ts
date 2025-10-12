export interface GitHubRepo {
  id: number;
  name: string;
  full_name: string;
  description: string | null;
  html_url: string;
  homepage: string | null;
  language: string | null;
  languages: Array<{
    name: string;
    bytes: number;
    percentage: string;
  }>;
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
  default_branch: string;
  size: number;
  watchers_count: number;
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
  status: 'active' | 'archived' | 'experimental';
  loading?: boolean;
  error?: string;
}

class InternalGitHubAPIService {
  private cache = new Map<string, { data: any; timestamp: number }>();
  private cacheExpiry = 10 * 60 * 1000; // 10 minutes

  private parseGitHubUrl(url: string): { owner: string; repo: string } | null {
    const match = url.match(/github\.com\/([^\/]+)\/([^\/]+)/);
    if (!match) return null;
    return { owner: match[1], repo: match[2] };
  }

  private async fetchWithCache<T>(endpoint: string): Promise<T> {
    const cacheKey = endpoint;
    const cached = this.cache.get(cacheKey);

    if (cached && Date.now() - cached.timestamp < this.cacheExpiry) {
      return cached.data;
    }

    try {
      const response = await fetch(endpoint);

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.error ||
            `API error: ${response.status} ${response.statusText}`
        );
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
    return this.fetchWithCache<GitHubRepo>(
      `/api/github/repos/${owner}/${repo}`
    );
  }

  async enrichProject(url: string): Promise<ProjectInfo> {
    const parsed = this.parseGitHubUrl(url);
    if (!parsed) {
      throw new Error('Invalid GitHub URL format');
    }

    try {
      const repoData = await this.getRepository(parsed.owner, parsed.repo);

      // 确定项目状态
      let status: 'active' | 'archived' | 'experimental' = 'active';
      if (repoData.archived) {
        status = 'archived';
      } else if (
        repoData.topics.includes('experimental') ||
        repoData.topics.includes('beta')
      ) {
        status = 'experimental';
      }

      // 提取主要编程语言
      const mainLanguages = repoData.languages
        .slice(0, 8)
        .map((lang) => lang.name);

      return {
        id: `${parsed.owner}/${parsed.repo}`,
        title: repoData.name.replace(/-/g, ' '),
        description: repoData.description || 'No description available',
        repository: url,
        language: repoData.language || 'Unknown',
        languages: mainLanguages,
        topics: repoData.topics,
        stars: repoData.stargazers_count,
        forks: repoData.forks_count,
        lastUpdated: repoData.updated_at,
        status,
      };
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error occurred';

      return {
        id: `${parsed.owner}/${parsed.repo}`,
        title: parsed.repo.replace(/-/g, ' '),
        description: 'Failed to load project information',
        repository: url,
        language: 'Unknown',
        languages: [],
        topics: [],
        stars: 0,
        forks: 0,
        lastUpdated: new Date().toISOString(),
        status: 'active',
        error: errorMessage,
      };
    }
  }

  async enrichProjects(urls: string[]): Promise<ProjectInfo[]> {
    const results = await Promise.allSettled(
      urls.map((url) => this.enrichProject(url))
    );

    return results.map((result, index) => {
      if (result.status === 'fulfilled') {
        return result.value;
      } else {
        // 处理失败的情况
        const parsed = this.parseGitHubUrl(urls[index]);
        return {
          id: parsed ? `${parsed.owner}/${parsed.repo}` : urls[index],
          title: parsed ? parsed.repo.replace(/-/g, ' ') : 'Unknown Project',
          description: 'Failed to load project information',
          repository: urls[index],
          language: 'Unknown',
          languages: [],
          topics: [],
          stars: 0,
          forks: 0,
          lastUpdated: new Date().toISOString(),
          status: 'active' as const,
          error: result.reason?.message || 'Failed to load project',
        };
      }
    });
  }

  // 获取初始占位符数据
  getPlaceholderProject(url: string): ProjectInfo {
    const parsed = this.parseGitHubUrl(url);

    return {
      id: parsed ? `${parsed.owner}/${parsed.repo}` : url,
      title: parsed ? parsed.repo.replace(/-/g, ' ') : 'Loading...',
      description: 'Loading project information...',
      repository: url,
      language: 'Loading...',
      languages: [],
      topics: [],
      stars: 0,
      forks: 0,
      lastUpdated: new Date().toISOString(),
      status: 'active',
      loading: true,
    };
  }
}

export const internalGitHubAPIService = new InternalGitHubAPIService();
