// GitHub API 响应类型定义
export interface GitHubAPIResponse<T = any> {
  data?: T;
  error?: string;
  details?: any;
}

export interface GitHubRepoLanguage {
  name: string;
  bytes: number;
  percentage: string;
}

export interface GitHubRepositoryData {
  id: number;
  name: string;
  full_name: string;
  description: string | null;
  html_url: string;
  homepage: string | null;
  language: string | null;
  languages: GitHubRepoLanguage[];
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
  fork: boolean;
  private: boolean;
  size: number;
  open_issues_count: number;
  default_branch: string;
  watchers_count: number;
}

export interface GitHubRepositoriesResponse {
  repositories: GitHubRepositoryData[];
  pagination: {
    current_page: number;
    per_page: number;
    total_count: number;
    first?: number;
    prev?: number;
    next?: number;
    last?: number;
  };
}

export interface GitHubAPIEndpoints {
  // 获取单个仓库信息
  getRepository: {
    path: `/api/github/repos/${string}/${string}`;
    method: 'GET';
    response: GitHubRepositoryData;
  };

  // 通用GitHub API代理
  genericAPI: {
    path: '/api/github';
    method: 'GET' | 'POST';
    params?: {
      endpoint?: string;
    };
    body?: {
      endpoint: string;
      method?: string;
      body?: any;
    };
    response: any;
  };
}

// API错误类型
export interface APIError {
  error: string;
  details?: any;
  status?: number;
}

// API请求选项
export interface APIRequestOptions {
  cache?: boolean;
  cacheTime?: number;
  retries?: number;
}

// API客户端配置
export interface APIClientConfig {
  baseUrl?: string;
  defaultCacheTime?: number;
  defaultRetries?: number;
  timeout?: number;
}

// GitHub用户统计数据类型
export interface GitHubUserStats {
  user: {
    login: string;
    name: string | null;
    avatar_url: string;
    bio: string | null;
    blog: string | null;
    location: string | null;
    email: string | null;
    company: string | null;
    public_repos: number;
    public_gists: number;
    followers: number;
    following: number;
    created_at: string;
    updated_at: string;
  };
  stats: {
    totalStars: number;
    totalForks: number;
    totalCommits: number;
    contributedRepos: number;
    languageStats: Array<{
      language: string;
      count: number;
      percentage: number;
    }>;
    yearlyContributions: {
      year: number;
      total: number;
      commits: number;
      issues: number;
      pullRequests: number;
      reviews: number;
      weeks: Array<{
        contributionDays: Array<{
          contributionCount: number;
          date: string;
        }>;
      }>;
    };
  };
}
