import { NextRequest, NextResponse } from 'next/server';
import { GitHubUserStats } from '../../../../../types/api';

export async function GET(
  request: NextRequest,
  { params }: { params: { username: string } }
) {
  const { username } = params;
  const githubToken = process.env.GITHUB_TOKEN;

  if (!githubToken) {
    return NextResponse.json(
      { error: 'GitHub token not configured' },
      { status: 500 }
    );
  }

  try {
    // 验证用户名格式
    if (
      !username ||
      typeof username !== 'string' ||
      !/^[a-zA-Z0-9-]+$/.test(username)
    ) {
      return NextResponse.json(
        { error: 'Invalid username format' },
        { status: 400 }
      );
    }

    // 获取基本用户信息
    const userResponse = await fetch(
      `https://api.github.com/users/${username}`,
      {
        headers: {
          Accept: 'application/vnd.github.v3+json',
          Authorization: `Bearer ${githubToken}`,
          'User-Agent': 'hnrobert-homepage',
        },
      }
    );

    if (!userResponse.ok) {
      if (userResponse.status === 404) {
        return NextResponse.json({ error: 'User not found' }, { status: 404 });
      }

      const errorData = await userResponse.json().catch(() => ({}));
      return NextResponse.json(
        {
          error: `Failed to fetch user: ${userResponse.status} ${userResponse.statusText}`,
          details: errorData,
        },
        { status: userResponse.status }
      );
    }

    const userData = await userResponse.json();

    // 验证用户数据
    if (!userData.login) {
      return NextResponse.json(
        { error: 'Invalid user data received' },
        { status: 500 }
      );
    }

    // 使用 GraphQL API 获取更详细的统计信息
    const graphqlQuery = `
      query($username: String!) {
        user(login: $username) {
          contributionsCollection {
            totalCommitContributions
            totalIssueContributions
            totalPullRequestContributions
            totalPullRequestReviewContributions
            totalRepositoriesWithContributedCommits
            contributionCalendar {
              totalContributions
              weeks {
                contributionDays {
                  contributionCount
                  date
                }
              }
            }
          }
          repositories(first: 100, orderBy: {field: STARGAZERS, direction: DESC}, isFork: false) {
            nodes {
              stargazerCount
              forkCount
              isFork
              owner {
                login
              }
              primaryLanguage {
                name
              }
              languages(first: 10) {
                edges {
                  size
                  node {
                    name
                  }
                }
              }
            }
          }
        }
      }
    `;

    const graphqlResponse = await fetch('https://api.github.com/graphql', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${githubToken}`,
        'Content-Type': 'application/json',
        'User-Agent': 'hnrobert-homepage',
      },
      body: JSON.stringify({
        query: graphqlQuery,
        variables: { username },
      }),
    });

    if (!graphqlResponse.ok) {
      // Fall back to REST API if GraphQL fails
      console.warn(
        `GraphQL API failed (${graphqlResponse.status}), falling back to basic stats`
      );

      return NextResponse.json({
        user: {
          login: userData.login,
          name: userData.name,
          avatar_url: userData.avatar_url,
          bio: userData.bio,
          blog: userData.blog,
          location: userData.location,
          email: userData.email,
          company: userData.company,
          public_repos: userData.public_repos,
          public_gists: userData.public_gists,
          followers: userData.followers,
          following: userData.following,
          created_at: userData.created_at,
          updated_at: userData.updated_at,
        },
        stats: {
          totalStars: 0,
          totalForks: 0,
          totalCommits: 0,
          contributedRepos: 0,
          languageStats: [],
          yearlyContributions: {
            year: new Date().getFullYear(),
            total: 0,
            weeks: [],
          },
        },
      });
    }

    const graphqlData = await graphqlResponse.json();

    if (graphqlData.errors) {
      console.warn('GraphQL errors:', graphqlData.errors);
      // Fall back to basic user data
      return NextResponse.json({
        user: {
          login: userData.login,
          name: userData.name,
          avatar_url: userData.avatar_url,
          bio: userData.bio,
          blog: userData.blog,
          location: userData.location,
          email: userData.email,
          company: userData.company,
          public_repos: userData.public_repos,
          public_gists: userData.public_gists,
          followers: userData.followers,
          following: userData.following,
          created_at: userData.created_at,
          updated_at: userData.updated_at,
        },
        stats: {
          totalStars: 0,
          totalForks: 0,
          totalCommits: 0,
          contributedRepos: 0,
          languageStats: [],
          yearlyContributions: {
            year: new Date().getFullYear(),
            total: 0,
            weeks: [],
          },
        },
      });
    }

    // 验证GraphQL响应数据
    if (!graphqlData.data || !graphqlData.data.user) {
      throw new Error('Invalid GraphQL response structure');
    }

    // 处理数据
    const { user: graphqlUser } = graphqlData.data;
    const repositories = graphqlUser.repositories.nodes;

    // 只统计非fork且属于用户自己的仓库
    const ownRepositories = repositories.filter(
      (repo: any) => !repo.isFork && repo.owner.login === username
    );

    // 计算统计信息
    const totalStars = ownRepositories.reduce(
      (sum: number, repo: any) => sum + repo.stargazerCount,
      0
    );
    const totalForks = ownRepositories.reduce(
      (sum: number, repo: any) => sum + repo.forkCount,
      0
    );

    // 统计语言使用情况（只统计自己的仓库）
    const languageMap = new Map<string, number>();
    ownRepositories.forEach((repo: any) => {
      if (repo.languages && repo.languages.edges) {
        repo.languages.edges.forEach((edge: any) => {
          const language = edge.node.name;
          const size = edge.size;
          languageMap.set(language, (languageMap.get(language) || 0) + size);
        });
      }
    });

    const totalLanguageSize = Array.from(languageMap.values()).reduce(
      (sum, size) => sum + size,
      0
    );
    const languageStats = Array.from(languageMap.entries())
      .map(([language, size]) => ({
        language,
        count: size,
        percentage:
          totalLanguageSize > 0
            ? Math.round((size / totalLanguageSize) * 100 * 100) / 100
            : 0,
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 8); // 只取前8种语言

    // 构建返回数据
    const result: GitHubUserStats = {
      user: {
        login: userData.login,
        name: userData.name,
        avatar_url: userData.avatar_url,
        bio: userData.bio,
        blog: userData.blog,
        location: userData.location,
        email: userData.email,
        company: userData.company,
        public_repos: userData.public_repos,
        public_gists: userData.public_gists,
        followers: userData.followers,
        following: userData.following,
        created_at: userData.created_at,
        updated_at: userData.updated_at,
      },
      stats: {
        totalStars,
        totalForks,
        totalCommits:
          graphqlUser.contributionsCollection.totalCommitContributions,
        contributedRepos:
          graphqlUser.contributionsCollection
            .totalRepositoriesWithContributedCommits,
        languageStats,
        yearlyContributions: {
          year: new Date().getFullYear(),
          total:
            graphqlUser.contributionsCollection.contributionCalendar
              .totalContributions,
          commits: graphqlUser.contributionsCollection.totalCommitContributions,
          issues: graphqlUser.contributionsCollection.totalIssueContributions,
          pullRequests:
            graphqlUser.contributionsCollection.totalPullRequestContributions,
          reviews:
            graphqlUser.contributionsCollection
              .totalPullRequestReviewContributions,
          weeks: graphqlUser.contributionsCollection.contributionCalendar.weeks,
        },
      },
    };

    // 设置缓存头
    const headers = new Headers({
      'Content-Type': 'application/json',
      'Cache-Control': 's-maxage=300, stale-while-revalidate=150', // 5分钟缓存
    });

    return new NextResponse(JSON.stringify(result), {
      status: 200,
      headers,
    });
  } catch (error) {
    console.error('GitHub user stats API error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch user statistics' },
      { status: 500 }
    );
  }
}
