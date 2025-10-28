/**
 * 统一的缓存管理系统
 * 用于存储从 GitHub API 获取的数据
 */

interface CacheEntry<T> {
  data: T;
  timestamp: number;
  expiresAt: number;
}

class CacheManager {
  private cache: Map<string, CacheEntry<any>>;
  private defaultTTL: number;

  constructor(defaultTTL: number = 2 * 60 * 60 * 1000) {
    // 默认2小时
    this.cache = new Map();
    this.defaultTTL = defaultTTL;

    // 启动定期清理任务
    this.startCleanupTask();
  }

  /**
   * 生成缓存键
   */
  private generateKey(prefix: string, ...parts: string[]): string {
    return `${prefix}:${parts.join(':')}`;
  }

  /**
   * 获取缓存数据
   */
  get<T>(key: string): T | null {
    const entry = this.cache.get(key);

    if (!entry) {
      return null;
    }

    const now = Date.now();

    // 检查是否过期
    if (now > entry.expiresAt) {
      this.cache.delete(key);
      return null;
    }

    return entry.data as T;
  }

  /**
   * 设置缓存数据
   */
  set<T>(key: string, data: T, ttl?: number): void {
    const now = Date.now();
    const expirationTime = ttl || this.defaultTTL;

    this.cache.set(key, {
      data,
      timestamp: now,
      expiresAt: now + expirationTime,
    });
  }

  /**
   * 检查缓存是否存在且未过期
   */
  has(key: string): boolean {
    const entry = this.cache.get(key);

    if (!entry) {
      return false;
    }

    const now = Date.now();

    if (now > entry.expiresAt) {
      this.cache.delete(key);
      return false;
    }

    return true;
  }

  /**
   * 删除缓存
   */
  delete(key: string): boolean {
    return this.cache.delete(key);
  }

  /**
   * 清空所有缓存
   */
  clear(): void {
    this.cache.clear();
  }

  /**
   * 获取缓存统计信息
   */
  getStats(): {
    totalEntries: number;
    validEntries: number;
    expiredEntries: number;
  } {
    const now = Date.now();
    let validEntries = 0;
    let expiredEntries = 0;

    this.cache.forEach((entry) => {
      if (now > entry.expiresAt) {
        expiredEntries++;
      } else {
        validEntries++;
      }
    });

    return {
      totalEntries: this.cache.size,
      validEntries,
      expiredEntries,
    };
  }

  /**
   * 清理过期缓存
   */
  private cleanup(): void {
    const now = Date.now();
    const keysToDelete: string[] = [];

    this.cache.forEach((entry, key) => {
      if (now > entry.expiresAt) {
        keysToDelete.push(key);
      }
    });

    keysToDelete.forEach((key) => this.cache.delete(key));

    if (keysToDelete.length > 0) {
      console.log(`[Cache] Cleaned up ${keysToDelete.length} expired entries`);
    }
  }

  /**
   * 启动定期清理任务
   */
  private startCleanupTask(): void {
    // 每30分钟清理一次过期缓存
    setInterval(() => {
      this.cleanup();
    }, 30 * 60 * 1000);
  }

  /**
   * 生成仓库缓存键
   */
  getRepoKey(owner: string, repo: string): string {
    return this.generateKey('repo', owner, repo);
  }

  /**
   * 生成用户缓存键
   */
  getUserKey(username: string): string {
    return this.generateKey('user', username);
  }

  /**
   * 生成用户年度数据缓存键
   */
  getUserYearKey(username: string, year: number): string {
    return this.generateKey('user-year', username, year.toString());
  }
}

// 导出单例实例
export const cacheManager = new CacheManager(2 * 60 * 60 * 1000); // 2小时TTL

// 导出辅助函数
export const CACHE_TTL = {
  TWO_HOURS: 2 * 60 * 60 * 1000, // 2小时
  ONE_HOUR: 60 * 60 * 1000, // 1小时
  THIRTY_MINUTES: 30 * 60 * 1000, // 30分钟
  TEN_MINUTES: 10 * 60 * 1000, // 10分钟
  FIVE_MINUTES: 5 * 60 * 1000, // 5分钟
};
