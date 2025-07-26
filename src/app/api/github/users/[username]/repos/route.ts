import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: { username: string } }
) {
  const { username } = params;
  const { searchParams } = new URL(request.url);

  // 支持查询参数
  const type = searchParams.get("type") || "owner"; // owner, member, all
  const sort = searchParams.get("sort") || "updated"; // created, updated, pushed, full_name
  const direction = searchParams.get("direction") || "desc"; // asc, desc
  const per_page = Math.min(
    parseInt(searchParams.get("per_page") || "30"),
    100
  );
  const page = parseInt(searchParams.get("page") || "1");

  const githubToken = process.env.GITHUB_TOKEN;

  if (!githubToken) {
    return NextResponse.json(
      { error: "GitHub token not configured" },
      { status: 500 }
    );
  }

  try {
    const queryParams = new URLSearchParams({
      type,
      sort,
      direction,
      per_page: per_page.toString(),
      page: page.toString(),
    });

    const response = await fetch(
      `https://api.github.com/users/${username}/repos?${queryParams}`,
      {
        headers: {
          Accept: "application/vnd.github.v3+json",
          Authorization: `Bearer ${githubToken}`,
          "User-Agent": "hnrobert-homepage",
        },
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      return NextResponse.json(
        {
          error: `Failed to fetch repositories: ${response.status} ${response.statusText}`,
          details: errorData,
        },
        { status: response.status }
      );
    }

    const repositories = await response.json();

    // 过滤和格式化数据
    const formattedRepos = repositories.map((repo: any) => ({
      id: repo.id,
      name: repo.name,
      full_name: repo.full_name,
      description: repo.description,
      html_url: repo.html_url,
      homepage: repo.homepage,
      language: repo.language,
      topics: repo.topics || [],
      stargazers_count: repo.stargazers_count,
      forks_count: repo.forks_count,
      license: repo.license,
      created_at: repo.created_at,
      updated_at: repo.updated_at,
      pushed_at: repo.pushed_at,
      archived: repo.archived,
      disabled: repo.disabled,
      fork: repo.fork,
      private: repo.private,
      size: repo.size,
      open_issues_count: repo.open_issues_count,
      default_branch: repo.default_branch,
      watchers_count: repo.watchers_count,
    }));

    // 获取分页信息
    const linkHeader = response.headers.get("Link");
    let pagination = {};

    if (linkHeader) {
      const links = linkHeader.split(",");
      links.forEach((link) => {
        const match = link.match(/<([^>]+)>;\s*rel="([^"]+)"/);
        if (match) {
          const url = new URL(match[1]);
          const rel = match[2];
          const pageNum = url.searchParams.get("page");
          if (pageNum) {
            pagination = { ...pagination, [rel]: parseInt(pageNum) };
          }
        }
      });
    }

    const result = {
      repositories: formattedRepos,
      pagination: {
        current_page: page,
        per_page,
        total_count: repositories.length,
        ...pagination,
      },
    };

    // 设置缓存头
    const headers = new Headers({
      "Content-Type": "application/json",
      "Cache-Control": "s-maxage=300, stale-while-revalidate=150", // 5分钟缓存
    });

    return new NextResponse(JSON.stringify(result), {
      status: 200,
      headers,
    });
  } catch (error) {
    console.error("GitHub repositories API error:", error);
    return NextResponse.json(
      { error: "Failed to fetch user repositories" },
      { status: 500 }
    );
  }
}
