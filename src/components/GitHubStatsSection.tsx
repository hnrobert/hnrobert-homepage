'use client';

import React, { useState, useEffect } from 'react';
import { GitHubUserStats } from '../types/api';

interface GitHubStatsProps {
  username: string;
  className?: string;
}

export const GitHubStatsSection: React.FC<GitHubStatsProps> = ({
  username,
}) => {
  const [stats, setStats] = useState<GitHubUserStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        setError(null);

        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout

        const response = await fetch(`/api/github/users/${username}`, {
          signal: controller.signal,
        });

        clearTimeout(timeoutId);

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(
            errorData.error || `HTTP ${response.status}: ${response.statusText}`
          );
        }

        const data = await response.json();

        // Validate data structure
        if (!data.user || !data.stats) {
          throw new Error('Invalid data structure received from API');
        }

        setStats(data);
      } catch (err) {
        console.error('Failed to load GitHub stats:', err);
        if (err instanceof Error) {
          if (err.name === 'AbortError') {
            setError('Request timed out. Please try again.');
          } else {
            setError(err.message);
          }
        } else {
          setError('Unknown error occurred');
        }
      } finally {
        setLoading(false);
      }
    };

    if (username) {
      fetchStats();
    }
  }, [username]);

  if (loading) {
    return (
      <section className="section">
        <div className="section-container">
          <h2 className="section-title">GitHub Stats</h2>
          <div className="github-stats-loading">
            <div className="stats-skeleton">
              <div className="skeleton-animate">
                <div className="skeleton-line skeleton-line-long"></div>
                <div className="skeleton-line skeleton-line-medium"></div>
                <div className="skeleton-line skeleton-line-short"></div>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  const handleRetry = () => {
    setError(null);
    setStats(null);
    // Trigger useEffect by changing the dependency
    setLoading(true);
  };

  if (error || (!stats && !loading)) {
    return (
      <section className={`github-stats-section`}>
        <div className="section-container">
          <h2 className="section-title">GitHub Stats</h2>
          <div className="github-stats-error">
            <p>Failed to load GitHub statistics</p>
            {error && <p className="error-detail">{error}</p>}
            <button
              className="retry-button"
              onClick={handleRetry}
              disabled={loading}
            >
              {loading ? 'Retrying...' : 'Try Again'}
            </button>
          </div>
        </div>
      </section>
    );
  }

  if (!stats) {
    return null;
  }

  const topLanguages = stats.stats.languageStats.slice(0, 5);
  const contributionData = stats.stats.yearlyContributions;

  return (
    <section className="section">
      <div className="glass-card">
        <h2 className="section-title">GitHub Stats</h2>
        {/* 第一大板块：主要统计数据 */}
        <div className="stats-main-grid">
          {/* 方框1: Followers & Total Stars */}
          <div className="stat-box">
            <div className="stat-item">
              <div className="stat-number">
                {stats.user.followers.toLocaleString()}
              </div>
              <div className="stat-label">Followers</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">
                {stats.stats.totalStars.toLocaleString()}
              </div>
              <div className="stat-label">Total Stars</div>
            </div>
          </div>

          {/* 方框2: Public Repos & Contributed Repos */}
          <div className="stat-box">
            <div className="stat-item">
              <div className="stat-number">{stats.user.public_repos}</div>
              <div className="stat-label">Public Repos</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">{stats.stats.contributedRepos}</div>
              <div className="stat-label">Contributed Repos</div>
            </div>
          </div>

          {/* 方框3: Total Commits & Last Year Contributions */}
          <div className="stat-box stat-box-wide">
            <div className="stat-item">
              <div className="stat-number">
                {stats.stats.totalCommits.toLocaleString()}
              </div>
              <div className="stat-label">Total Commits</div>
            </div>
            <div className="contributions-detail">
              <div className="contributions-title">Contributions Last Year</div>
              <div className="contributions-grid">
                <div className="contribution-item">
                  <span className="contribution-number">
                    {contributionData.commits.toLocaleString()}
                  </span>
                  <span className="contribution-label">Commits</span>
                </div>
                <div className="contribution-item">
                  <span className="contribution-number">
                    {contributionData.pullRequests.toLocaleString()}
                  </span>
                  <span className="contribution-label">PRs</span>
                </div>
                <div className="contribution-item">
                  <span className="contribution-number">
                    {contributionData.issues.toLocaleString()}
                  </span>
                  <span className="contribution-label">Issues</span>
                </div>
                <div className="contribution-item">
                  <span className="contribution-number">
                    {contributionData.reviews.toLocaleString()}
                  </span>
                  <span className="contribution-label">Reviews</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 第二大板块：编程语言统计 */}
        <div className="languages-section">
          <h3 className="languages-title">Most Used Languages</h3>
          <div className="languages-grid">
            {topLanguages.map((lang, index) => (
              <div key={lang.language} className="language-item">
                <div className="language-info">
                  <div
                    className="language-color"
                    style={{
                      backgroundColor: getLanguageColor(lang.language),
                    }}
                  ></div>
                  <span className="language-name">{lang.language}</span>
                  <span className="language-percentage">
                    {lang.percentage}%
                  </span>
                </div>
                <div className="language-bar">
                  <div
                    className="language-progress"
                    style={{
                      width: `${lang.percentage}%`,
                      backgroundColor: getLanguageColor(lang.language),
                    }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

// 获取语言对应的颜色
function getLanguageColor(language: string): string {
  const colors: Record<string, string> = {
    TypeScript: '#3178c6',
    JavaScript: '#f1e05a',
    Python: '#3572A5',
    Java: '#b07219',
    'C++': '#f34b7d',
    C: '#555555',
    'C#': '#239120',
    Go: '#00ADD8',
    Rust: '#dea584',
    Swift: '#ffac45',
    Kotlin: '#A97BFF',
    PHP: '#4F5D95',
    Ruby: '#701516',
    HTML: '#e34c26',
    CSS: '#1572B6',
    Vue: '#4FC08D',
    React: '#61DAFB',
    Shell: '#89e051',
    Dockerfile: '#384d54',
    YAML: '#cb171e',
    JSON: '#292929',
    Markdown: '#083fa1',
    SQL: '#e38c00',
  };

  return colors[language] || '#586069';
}

// 获取贡献度对应的颜色
function getContributionColor(count: number): string {
  if (count === 0) return '#ebedf0';
  if (count <= 3) return '#9be9a8';
  if (count <= 6) return '#40c463';
  if (count <= 9) return '#30a14e';
  return '#216e39';
}
