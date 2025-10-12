import { NextRequest, NextResponse } from 'next/server';
import { GitHubUserStats } from '../../../../../types/api';
import config from '../../../../../configs/config.json';

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

  // 读取配置
  const excludeLanguages = new Set(
    config.githubStats?.languageUse?.excludeLanguages || []
  );
  const excludeReposForLanguage = new Set(
    config.githubStats?.languageUse?.excludeRepos || []
  );
  const excludeReposForContribution = new Set(
    config.githubStats?.contributionStats?.excludeRepos || []
  );

  console.log('\n=== Configuration ===');
  console.log('Excluded languages:', Array.from(excludeLanguages));
  console.log(
    'Excluded repos for language stats:',
    Array.from(excludeReposForLanguage)
  );
  console.log(
    'Excluded repos for contribution stats:',
    Array.from(excludeReposForContribution)
  );

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

    // 计算需要查询的年份范围（从用户创建账号到现在）
    const now = new Date();
    const currentYear = now.getFullYear();

    // 计算一年前的日期（用于最近一年的贡献）
    const oneYearAgo = new Date();
    oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);
    const fromDate = oneYearAgo.toISOString();

    console.log(`\n=== Fetching GitHub Stats ===`);
    console.log(`Last year contributions: from ${fromDate} to now`);
    console.log(`Will also fetch yearly data for cumulative commits`);

    // 使用 GraphQL API 获取更详细的统计信息
    // 我们将查询多个年份的数据以累加总commit数
    const graphqlQuery = `
      query($username: String!, $from: DateTime!) {
        user(login: $username) {
          createdAt
          lastYearContributions: contributionsCollection(from: $from) {
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
            commitContributionsByRepository(maxRepositories: 100) {
              repository {
                name
                owner {
                  login
                }
                languages(first: 10, orderBy: {field: SIZE, direction: DESC}) {
                  edges {
                    size
                    node {
                      name
                    }
                  }
                }
              }
              contributions(first: 1) {
                totalCount
              }
            }
          }
          ownRepositories: repositories(first: 100, orderBy: {field: STARGAZERS, direction: DESC}, isFork: false) {
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
              languages(first: 10, orderBy: {field: SIZE, direction: DESC}) {
                edges {
                  size
                  node {
                    name
                  }
                }
              }
            }
          }
          contributedRepositories: repositoriesContributedTo(first: 100, contributionTypes: [COMMIT, PULL_REQUEST, ISSUE]) {
            nodes {
              owner {
                login
              }
              name
              languages(first: 10, orderBy: {field: SIZE, direction: DESC}) {
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
        variables: { username, from: fromDate },
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
    const ownRepositories = graphqlUser.ownRepositories.nodes;
    const contributedRepositories =
      graphqlUser.contributedRepositories?.nodes || [];
    const lastYearStats = graphqlUser.lastYearContributions;
    const userCreatedAt = new Date(graphqlUser.createdAt);

    console.log('\n=== User Account Info ===');
    console.log('Account created:', userCreatedAt.toISOString());
    console.log('Years active:', currentYear - userCreatedAt.getFullYear() + 1);

    // 逐年获取commit统计以累加总数
    console.log('\n=== Fetching Year-by-Year Commits ===');
    const yearlyCommits: { year: number; commits: number }[] = [];
    const startYear = userCreatedAt.getFullYear();

    for (let year = startYear; year <= currentYear; year++) {
      const yearStart = new Date(`${year}-01-01T00:00:00Z`).toISOString();
      const yearEnd = new Date(`${year}-12-31T23:59:59Z`).toISOString();

      const yearQuery = `
        query($username: String!, $from: DateTime!, $to: DateTime!) {
          user(login: $username) {
            contributionsCollection(from: $from, to: $to) {
              totalCommitContributions
              commitContributionsByRepository(maxRepositories: 100) {
                repository {
                  nameWithOwner
                }
                contributions(first: 1) {
                  totalCount
                }
              }
            }
          }
        }
      `;

      try {
        const yearResponse = await fetch('https://api.github.com/graphql', {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${githubToken}`,
            'Content-Type': 'application/json',
            'User-Agent': 'hnrobert-homepage',
          },
          body: JSON.stringify({
            query: yearQuery,
            variables: { username, from: yearStart, to: yearEnd },
          }),
        });

        if (yearResponse.ok) {
          const yearData = await yearResponse.json();
          const totalCommits =
            yearData.data?.user?.contributionsCollection
              ?.totalCommitContributions || 0;
          const repoCommits =
            yearData.data?.user?.contributionsCollection
              ?.commitContributionsByRepository || [];

          // 计算排除的仓库的commits
          let excludedCommits = 0;
          repoCommits.forEach((repo: any) => {
            const repoName = repo.repository?.nameWithOwner || '';
            if (excludeReposForContribution.has(repoName)) {
              const commits = repo.contributions?.totalCount || 0;
              excludedCommits += commits;
              console.log(`    Excluding ${repoName}: ${commits} commits`);
            }
          });

          const adjustedCommits = totalCommits - excludedCommits;
          yearlyCommits.push({ year, commits: adjustedCommits });
          console.log(
            `  ${year}: ${totalCommits} commits (${excludedCommits} excluded) = ${adjustedCommits} counted`
          );
        } else {
          console.warn(
            `  ${year}: Failed to fetch (status ${yearResponse.status})`
          );
          yearlyCommits.push({ year, commits: 0 });
        }
      } catch (error) {
        console.warn(`  ${year}: Error fetching -`, error);
        yearlyCommits.push({ year, commits: 0 });
      }
    }

    const cumulativeTotalCommits = yearlyCommits.reduce(
      (sum, y) => sum + y.commits,
      0
    );
    console.log(`Total commits (cumulative): ${cumulativeTotalCommits}`);

    // 计算统计信息（只统计自己拥有的仓库）
    // 添加详细的日志以便在终端看到计算过程
    console.log(`Computing totals for user: ${username}`);

    const totalStars = ownRepositories.reduce((sum: number, repo: any) => {
      const val = repo.stargazerCount || 0;
      console.log(`  repo owner=${repo.owner?.login || 'unknown'} star=${val}`);
      return sum + val;
    }, 0);

    const totalForks = ownRepositories.reduce((sum: number, repo: any) => {
      const val = repo.forkCount || 0;
      console.log(
        `  repo owner=${repo.owner?.login || 'unknown'} forks=${val}`
      );
      return sum + val;
    }, 0);

    // 统计语言使用情况（只计算与用户commit相关的代码）
    const languageMap = new Map<string, number>();

    console.log('\n=== Language Statistics (based on commits) ===');

    // 1. 统计自己拥有的仓库（这些仓库的代码都是你自己写的，使用完整统计）
    console.log('\n1. Own repositories (100% attribution):');
    ownRepositories.forEach((repo: any) => {
      const repoName = `${repo.owner?.login || 'unknown'}/${
        repo.name || 'unknown'
      }`;

      // 检查是否在排除列表中
      if (excludeReposForLanguage.has(repoName)) {
        console.log(`  Repo: ${repoName} [EXCLUDED from language stats]`);
        return;
      }

      if (repo.languages && repo.languages.edges) {
        console.log(`  Repo: ${repoName}`);
        repo.languages.edges.forEach((edge: any) => {
          const language = edge.node.name;

          // 检查语言是否在排除列表中
          if (excludeLanguages.has(language)) {
            console.log(`    - ${language}: ${edge.size} bytes [EXCLUDED]`);
            return;
          }

          const size = edge.size;
          console.log(`    - ${language}: ${size} bytes`);
          languageMap.set(language, (languageMap.get(language) || 0) + size);
        });
      }
    });

    // 2. 统计贡献过的其他仓库（根据commit占比来计算代码量）
    console.log('\n2. Contributed repositories (weighted by commit ratio):');
    if (lastYearStats && lastYearStats.commitContributionsByRepository) {
      lastYearStats.commitContributionsByRepository.forEach((contrib: any) => {
        if (
          contrib.repository &&
          contrib.repository.languages &&
          contrib.repository.languages.edges
        ) {
          const repoName = `${contrib.repository.owner?.login || 'unknown'}/${
            contrib.repository.name || 'unknown'
          }`;
          const commitCount = contrib.contributions.totalCount || 0;

          // 检查是否在排除列表中
          if (excludeReposForLanguage.has(repoName)) {
            console.log(
              `  Repo: ${repoName} (${commitCount} commits) [EXCLUDED from language stats]`
            );
            return;
          }

          // 计算贡献比例：你的commits / 总commits的估算
          // 由于我们只有你的commit数，我们用一个保守的权重
          // 假设中等活跃仓库有约100个commits，你的贡献按比例计算
          const estimatedWeight = Math.min(commitCount / 100, 0.8); // 最高80%权重

          // 只统计有实际commit的仓库
          if (commitCount > 0) {
            console.log(
              `  Repo: ${repoName} (${commitCount} commits, estimated contribution: ${(
                estimatedWeight * 100
              ).toFixed(1)}%)`
            );
            contrib.repository.languages.edges.forEach((edge: any) => {
              const language = edge.node.name;

              // 检查语言是否在排除列表中
              if (excludeLanguages.has(language)) {
                console.log(`    - ${language}: ${edge.size} bytes [EXCLUDED]`);
                return;
              }

              const rawSize = edge.size;
              const weightedSize = rawSize * estimatedWeight;
              console.log(
                `    - ${language}: ${rawSize} bytes × ${estimatedWeight.toFixed(
                  2
                )} = ${weightedSize.toFixed(0)} weighted bytes`
              );
              languageMap.set(
                language,
                (languageMap.get(language) || 0) + weightedSize
              );
            });
          }
        }
      });
    }

    // 不再统计contributedRepositories，因为已经在commitContributionsByRepository中包含了

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

    console.log('\n=== Total Language Distribution ===');
    languageStats.forEach((stat) => {
      console.log(
        `${stat.language}: ${stat.count.toFixed(0)} bytes (${stat.percentage}%)`
      );
    });

    // 额外：为 totalCommits 和 contributedRepos 提供可追踪的计算和回退逻辑
    console.log('\n=== Final Commit Statistics ===');
    console.log('Cumulative commits from yearly data:', cumulativeTotalCommits);
    console.log('Last year commits:', lastYearStats?.totalCommitContributions);
    console.log(
      'Last year repos:',
      lastYearStats?.totalRepositoriesWithContributedCommits
    );

    // 使用累加的年度提交数作为总提交数
    let derivedTotalCommits = cumulativeTotalCommits;

    // contributedRepos 回退逻辑：优先使用 lastYear 的数据，其次使用 contributedRepositories.length，再次使用 commitContributionsByRepository 的数量
    let derivedContributedRepos =
      lastYearStats?.totalRepositoriesWithContributedCommits ||
      contributedRepositories.length ||
      (lastYearStats?.commitContributionsByRepository
        ? lastYearStats.commitContributionsByRepository.length
        : 0);

    console.log('Final derived totals:', {
      derivedTotalCommits,
      derivedContributedRepos,
    });
    console.log('=================================\n');

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
        totalCommits: derivedTotalCommits, // 使用派生的提交总数
        contributedRepos: derivedContributedRepos, // 使用派生的贡献仓库数
        languageStats,
        yearlyContributions: {
          year: new Date().getFullYear(),
          total: lastYearStats?.contributionCalendar?.totalContributions || 0,
          commits: lastYearStats?.totalCommitContributions || 0,
          issues: lastYearStats?.totalIssueContributions || 0,
          pullRequests: lastYearStats?.totalPullRequestContributions || 0,
          reviews: lastYearStats?.totalPullRequestReviewContributions || 0,
          weeks: lastYearStats?.contributionCalendar?.weeks || [],
        },
      },
    };

    // 设置缓存头
    const headers = new Headers({
      'Content-Type': 'application/json',
      // 'Cache-Control': 's-maxage=300, stale-while-revalidate=150', // 5分钟缓存
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
