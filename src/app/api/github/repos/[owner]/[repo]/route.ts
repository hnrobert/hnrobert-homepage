import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: { owner: string; repo: string } }
) {
  const { owner, repo } = params;
  const githubToken = process.env.GITHUB_TOKEN;

  if (!githubToken) {
    return NextResponse.json(
      { error: "GitHub token not configured" },
      { status: 500 }
    );
  }

  try {
    // 并行获取仓库信息和语言信息
    const [repoResponse, languagesResponse] = await Promise.all([
      fetch(`https://api.github.com/repos/${owner}/${repo}`, {
        headers: {
          Accept: "application/vnd.github.v3+json",
          Authorization: `Bearer ${githubToken}`,
          "User-Agent": "hnrobert-homepage",
        },
      }),
      fetch(`https://api.github.com/repos/${owner}/${repo}/languages`, {
        headers: {
          Accept: "application/vnd.github.v3+json",
          Authorization: `Bearer ${githubToken}`,
          "User-Agent": "hnrobert-homepage",
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
          totalBytes > 0 ? ((bytes / totalBytes) * 100).toFixed(1) : "0",
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

    // 设置缓存头
    const headers = new Headers({
      "Content-Type": "application/json",
      "Cache-Control": "s-maxage=600, stale-while-revalidate=300", // 10分钟缓存
    });

    return new NextResponse(JSON.stringify(result), {
      status: 200,
      headers,
    });
  } catch (error) {
    console.error("GitHub repository API error:", error);
    return NextResponse.json(
      { error: "Failed to fetch repository information" },
      { status: 500 }
    );
  }
}
