import { NextRequest, NextResponse } from 'next/server';
import { cacheManager, CACHE_TTL } from '../../../../../../lib/cache';

export async function GET(
  request: NextRequest,
  { params }: { params: { owner: string; repo: string } }
) {
  const { owner, repo } = params;
  const githubToken = process.env.GITHUB_TOKEN;

  if (!githubToken) {
    return NextResponse.json(
      { error: 'GitHub token not configured' },
      { status: 500 }
    );
  }

  try {
    // 生成缓存键
    const cacheKey = cacheManager.getRepoKey(owner, repo);

    // 检查缓存
    const cachedData = cacheManager.get(cacheKey);
    if (cachedData) {
      console.log(`[Cache HIT] Repository: ${owner}/${repo}`);
      return NextResponse.json(cachedData, {
        status: 200,
        headers: {
          'X-Cache': 'HIT',
          'Cache-Control': 'public, max-age=7200', // 客户端也缓存2小时
        },
      });
    }

    console.log(
      `[Cache MISS] Repository: ${owner}/${repo} - Fetching from GitHub`
    );

    // 并行获取仓库信息和语言信息
    const [repoResponse, languagesResponse] = await Promise.all([
      fetch(`https://api.github.com/repos/${owner}/${repo}`, {
        headers: {
          Accept: 'application/vnd.github.v3+json',
          Authorization: `Bearer ${githubToken}`,
          'User-Agent': 'hnrobert-homepage',
        },
      }),
      fetch(`https://api.github.com/repos/${owner}/${repo}/languages`, {
        headers: {
          Accept: 'application/vnd.github.v3+json',
          Authorization: `Bearer ${githubToken}`,
          'User-Agent': 'hnrobert-homepage',
        },
      }),
    ]);

    if (!repoResponse.ok) {
      const errorData = await repoResponse.json();
      return NextResponse.json(
        {
          error: `Failed to fetch repository: ${repoResponse.status} ${repoResponse.statusText}`,
          details: errorData,
        },
        { status: repoResponse.status }
      );
    }

    const repoData = await repoResponse.json();
    const languagesData = languagesResponse.ok
      ? await languagesResponse.json()
      : {};

    // 处理语言数据
    const totalBytes = Object.values(languagesData).reduce(
      (acc: number, bytes: any) => acc + bytes,
      0
    );
    const languages = Object.entries(languagesData)
      .map(([language, bytes]: [string, any]) => ({
        name: language,
        bytes,
        percentage:
          totalBytes > 0 ? ((bytes / totalBytes) * 100).toFixed(1) : '0',
      }))
      .sort((a, b) => b.bytes - a.bytes);

    // 构建返回数据
    const result = {
      id: repoData.id,
      name: repoData.name,
      full_name: repoData.full_name,
      description: repoData.description,
      html_url: repoData.html_url,
      homepage: repoData.homepage,
      language: repoData.language,
      languages: languages,
      topics: repoData.topics || [],
      stargazers_count: repoData.stargazers_count,
      forks_count: repoData.forks_count,
      license: repoData.license,
      created_at: repoData.created_at,
      updated_at: repoData.updated_at,
      pushed_at: repoData.pushed_at,
      archived: repoData.archived,
      disabled: repoData.disabled,
      open_issues_count: repoData.open_issues_count,
      default_branch: repoData.default_branch,
      size: repoData.size,
      watchers_count: repoData.watchers_count,
    };

    // 存入缓存（2小时）
    cacheManager.set(cacheKey, result, CACHE_TTL.TWO_HOURS);
    console.log(`[Cache SET] Repository: ${owner}/${repo}`);

    // 返回数据
    return NextResponse.json(result, {
      status: 200,
      headers: {
        'X-Cache': 'MISS',
        'Cache-Control': 'public, max-age=7200', // 客户端也缓存2小时
      },
    });
  } catch (error) {
    console.error('GitHub repository API error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch repository information' },
      { status: 500 }
    );
  }
}
