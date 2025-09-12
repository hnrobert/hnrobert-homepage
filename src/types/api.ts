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
    method: "GET";
    response: GitHubRepositoryData;
  };

  // 获取用户仓库列表
  getUserRepositories: {
    path: `/api/github/users/${string}/repos`;
    method: "GET";
    params?: {
      type?: "owner" | "member" | "all";
      sort?: "created" | "updated" | "pushed" | "full_name";
      direction?: "asc" | "desc";
      per_page?: number;
      page?: number;
    };
    response: GitHubRepositoriesResponse;
  };

  // 通用GitHub API代理
  genericAPI: {
    path: "/api/github";
    method: "GET" | "POST";
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
