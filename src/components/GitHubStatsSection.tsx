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
    const [hoveredLanguage, setHoveredLanguage] = useState<string | null>(null);

    useEffect(() => {
        let isMounted = true; // 防止组件卸载后更新状态

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

                if (isMounted) {
                    setStats(data);
                }
            } catch (err) {
                console.error('Failed to load GitHub stats:', err);
                if (isMounted) {
                    if (err instanceof Error) {
                        if (err.name === 'AbortError') {
                            setError('Request timed out. Please try again.');
                        } else {
                            setError(err.message);
                        }
                    } else {
                        setError('Unknown error occurred');
                    }
                }
            } finally {
                if (isMounted) {
                    setLoading(false);
                }
            }
        };

        if (username) {
            fetchStats();
        }

        return () => {
            isMounted = false; // 清理函数，标记组件已卸载
        };
    }, [username]);

    // 数字动画效果
    useEffect(() => {
        if (!stats) return;

        const animateNumbers = () => {
            const numbers = document.querySelectorAll('.stat-number[data-target], .contribution-number[data-target]');

            numbers.forEach((element) => {
                const target = parseInt(element.getAttribute('data-target') || '0');
                const duration = 2000; // 2秒动画
                const steps = 60;
                const increment = target / steps;
                let current = 0;
                let step = 0;

                const timer = setInterval(() => {
                    step++;
                    current = Math.min(Math.ceil(increment * step), target);
                    element.textContent = current.toLocaleString();

                    if (step >= steps || current >= target) {
                        clearInterval(timer);
                        element.textContent = target.toLocaleString();
                    }
                }, duration / steps);
            });
        };

        // 延迟一点开始动画，让DOM先渲染
        const timeout = setTimeout(animateNumbers, 100);
        return () => clearTimeout(timeout);
    }, [stats]);

    if (loading) {
        return (
            <section className="section">
                <div className="glass-card">
                    <h2 className="section-title">GitHub Stats</h2>

                    {/* Skeleton for main stats grid */}
                    <div className="stats-main-grid">
                        <div className="stat-box skeleton-box">
                            <div className="stat-item">
                                <div className="skeleton-stat"></div>
                                <div className="stat-label">Followers</div>
                            </div>
                            <div className="stat-item">
                                <div className="skeleton-stat"></div>
                                <div className="stat-label">Total Stars</div>
                            </div>
                        </div>
                        <div className="stat-box skeleton-box">
                            <div className="stat-item">
                                <div className="skeleton-stat"></div>
                                <div className="stat-label">Public Repos</div>
                            </div>
                            <div className="stat-item">
                                <div className="skeleton-stat"></div>
                                <div className="stat-label">Contributed Repos</div>
                            </div>
                        </div>
                        <div className="stat-box stat-box-wide skeleton-box">
                            <div className="stat-item">
                                <div className="skeleton-stat"></div>
                                <div className="stat-label">Total Commits</div>
                            </div>
                            <div className="contributions-detail">
                                <div className="contributions-title">Contributions Last Year</div>
                                <div className="contributions-grid">
                                    <div className="contribution-item">
                                        <span className="skeleton-contribution-number"></span>
                                        <span className="contribution-label">Commits</span>
                                    </div>
                                    <div className="contribution-item">
                                        <span className="skeleton-contribution-number"></span>
                                        <span className="contribution-label">PRs</span>
                                    </div>
                                    <div className="contribution-item">
                                        <span className="skeleton-contribution-number"></span>
                                        <span className="contribution-label">Issues</span>
                                    </div>
                                    <div className="contribution-item">
                                        <span className="skeleton-contribution-number"></span>
                                        <span className="contribution-label">Reviews</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Skeleton for languages section */}
                    <div className="languages-section skeleton-box">
                        <h3 className="languages-title">Most Used Languages</h3>
                        <div className="skeleton-bar"></div>
                        <div className="skeleton-legend"></div>
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

    const topLanguages = stats.stats.languageStats.slice(0, 8);
    const contributionData = stats.stats.yearlyContributions;

    // 计算top 8语言的总和，重新归一化百分比以占满100%
    const totalPercentage = topLanguages.reduce((sum, lang) => sum + lang.percentage, 0);
    const normalizedLanguages = topLanguages.map(lang => ({
        ...lang,
        normalizedPercentage: (lang.percentage / totalPercentage) * 100
    }));

    return (
        <section className="section">
            <div className="glass-card">
                <h2 className="section-title">GitHub Stats</h2>
                {/* 第一大板块：主要统计数据 */}
                <div className="stats-main-grid">
                    {/* 方框1: Followers & Total Stars */}
                    <div className="stat-box">
                        <div className="stat-item">
                            <div className="stat-number" data-target={stats.user.followers}>
                                0
                            </div>
                            <div className="stat-label">Followers</div>
                        </div>
                        <div className="stat-item">
                            <div className="stat-number" data-target={stats.stats.totalStars}>
                                0
                            </div>
                            <div className="stat-label">Total Stars</div>
                        </div>
                    </div>

                    {/* 方框2: Public Repos & Contributed Repos */}
                    <div className="stat-box">
                        <div className="stat-item">
                            <div className="stat-number" data-target={stats.user.public_repos}>0</div>
                            <div className="stat-label">Public Repos</div>
                        </div>
                        <div className="stat-item">
                            <div className="stat-number" data-target={stats.stats.contributedRepos}>0</div>
                            <div className="stat-label">Contributed Repos</div>
                        </div>
                    </div>

                    {/* 方框3: Total Commits & Last Year Contributions */}
                    <div className="stat-box stat-box-wide">
                        <div className="stat-item">
                            <div className="stat-number" data-target={stats.stats.totalCommits}>
                                0
                            </div>
                            <div className="stat-label">Total Commits</div>
                        </div>
                        <div className="contributions-detail">
                            <div className="contributions-title">Contributions Last Year</div>
                            <div className="contributions-grid">
                                <div className="contribution-item">
                                    <span className="contribution-number" data-target={contributionData.commits}>
                                        0
                                    </span>
                                    <span className="contribution-label">Commits</span>
                                </div>
                                <div className="contribution-item">
                                    <span className="contribution-number" data-target={contributionData.pullRequests}>
                                        0
                                    </span>
                                    <span className="contribution-label">PRs</span>
                                </div>
                                <div className="contribution-item">
                                    <span className="contribution-number" data-target={contributionData.issues}>
                                        0
                                    </span>
                                    <span className="contribution-label">Issues</span>
                                </div>
                                <div className="contribution-item">
                                    <span className="contribution-number" data-target={contributionData.reviews}>
                                        0
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

                    {/* 横向彩色进度条 */}
                    <div className="languages-bar-container">
                        {normalizedLanguages.map((lang, index) => (
                            <div
                                key={lang.language}
                                className={`language-bar-segment ${hoveredLanguage === lang.language ? 'hovered' : ''}`}
                                data-language={lang.language}
                                style={{
                                    width: `${lang.normalizedPercentage}%`,
                                    backgroundColor: getLanguageColor(lang.language),
                                    animationDelay: `${index * 0.1}s`,
                                }}
                                title={`${lang.language}: ${lang.percentage.toFixed(1)}%`}
                                onMouseEnter={() => setHoveredLanguage(lang.language)}
                                onMouseLeave={() => setHoveredLanguage(null)}
                            ></div>
                        ))}
                    </div>

                    {/* 图例 */}
                    <div className="languages-legend">
                        {normalizedLanguages.map((lang) => (
                            <div
                                key={lang.language}
                                className={`legend-item ${hoveredLanguage === lang.language ? 'hovered' : ''}`}
                                data-language={lang.language}
                                onMouseEnter={() => setHoveredLanguage(lang.language)}
                                onMouseLeave={() => setHoveredLanguage(null)}
                            >
                                <div
                                    className="legend-color"
                                    style={{
                                        backgroundColor: getLanguageColor(lang.language),
                                    }}
                                ></div>
                                <span className="legend-name">{lang.language}</span>
                                <span className="legend-percentage">{lang.percentage.toFixed(1)}%</span>
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
