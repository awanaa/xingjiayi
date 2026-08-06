import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

/**
 * 防止 CDN 缓存 Next.js RSC (text/x-component) 响应。
 *
 * 问题背景：又拍云 CDN 按 URL 缓存源站响应，而 Next.js 对带 RSC 头的
 * 请求（客户端导航 prefetch）返回 text/x-component 流式 payload，
 * 且静态页面的 RSC 响应也带 s-maxage=31536000。CDN 缓存该响应后，
 * 普通浏览器请求同一 URL 会拿到 RSC 空壳 → 页面白屏。
 *
 * 注意：Next.js 16 的 proxy 收到的 request.headers 已过滤 RSC 相关头
 * （RSC / Next-Router-State-Tree / Next-Router-Prefetch 都读不到），
 * 唯一可靠信号是 Accept: text/x-component。因此这里用多种信号组合，
 * 并额外把非 RSC 响应的 CDN TTL 缩短为 300s，万一漏判也不会长期污染。
 *
 * 解法：RSC 请求一律返回 no-store，CDN 只缓存正常 HTML 响应（短 TTL）。
 */
export function proxy(request: NextRequest) {
  const url = request.nextUrl;
  const accept = request.headers.get("accept") || "";
  const isRSC =
    accept.includes("text/x-component") ||
    url.searchParams.has("_rsc") ||
    request.headers.get("next-router-state-tree") !== null ||
    request.headers.get("next-router-prefetch") !== null ||
    request.headers.get("next-router-segment-prefetch") !== null ||
    request.headers.get("rsc") === "1";

  const response = NextResponse.next();
  response.headers.set("x-proxy-check", isRSC ? "rsc" : "html");

  if (isRSC) {
    response.headers.set("Cache-Control", "private, no-store, max-age=0");
    response.headers.set("CDN-Cache-Control", "no-store");
  } else {
    // 非 RSC(正常 HTML):允许 CDN 缓存,但缩短 TTL,防止万一出现
    // PPR postponed / 混合响应时缓存污染时间过长(默认 s-maxage=31536000 太久)
    response.headers.set("CDN-Cache-Control", "max-age=300");
  }

  return response;
}

export const config = {
  matcher: ["/", "/about", "/plant", "/portfolio", "/portal", "/admin"],
};
