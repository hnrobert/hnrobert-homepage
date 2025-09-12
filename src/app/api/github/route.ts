import { NextRequest, NextResponse } from "next/server";

// GitHub API代理端点
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const endpoint = searchParams.get("endpoint");

  if (!endpoint) {
    return NextResponse.json(
      { error: "Missing endpoint parameter" },
      { status: 400 }
    );
  }

  const githubToken = process.env.GITHUB_TOKEN;

  if (!githubToken) {
    return NextResponse.json(
      { error: "GitHub token not configured" },
      { status: 500 }
    );
  }

  try {
    const githubUrl = `https://api.github.com${endpoint}`;

    const response = await fetch(githubUrl, {
      headers: {
        Accept: "application/vnd.github.v3+json",
        Authorization: `Bearer ${githubToken}`,
        "User-Agent": "hnrobert-homepage",
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      return NextResponse.json(
        {
          error: `GitHub API error: ${response.status} ${response.statusText}`,
          details: errorData,
        },
        { status: response.status }
      );
    }

    const data = await response.json();

    // 设置缓存头
    const headers = new Headers({
      "Content-Type": "application/json",
      "Cache-Control": "s-maxage=600, stale-while-revalidate=300", // 10分钟缓存，5分钟stale-while-revalidate
    });

    return new NextResponse(JSON.stringify(data), {
      status: 200,
      headers,
    });
  } catch (error) {
    console.error("GitHub API proxy error:", error);
    return NextResponse.json(
      { error: "Failed to fetch from GitHub API" },
      { status: 500 }
    );
  }
}

// 支持POST请求用于更复杂的GitHub API操作
export async function POST(request: NextRequest) {
  const githubToken = process.env.GITHUB_TOKEN;

  if (!githubToken) {
    return NextResponse.json(
      { error: "GitHub token not configured" },
      { status: 500 }
    );
  }

  try {
    const { endpoint, method = "GET", body } = await request.json();

    if (!endpoint) {
      return NextResponse.json(
        { error: "Missing endpoint parameter" },
        { status: 400 }
      );
    }

    const githubUrl = `https://api.github.com${endpoint}`;

    const fetchOptions: RequestInit = {
      method,
      headers: {
        Accept: "application/vnd.github.v3+json",
        Authorization: `Bearer ${githubToken}`,
        "User-Agent": "hnrobert-homepage",
        "Content-Type": "application/json",
      },
    };

    if (body && (method === "POST" || method === "PUT" || method === "PATCH")) {
      fetchOptions.body = JSON.stringify(body);
    }

    const response = await fetch(githubUrl, fetchOptions);

    if (!response.ok) {
      const errorData = await response.json();
      return NextResponse.json(
        {
          error: `GitHub API error: ${response.status} ${response.statusText}`,
          details: errorData,
        },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("GitHub API proxy error:", error);
    return NextResponse.json(
      { error: "Failed to process GitHub API request" },
      { status: 500 }
    );
  }
}
