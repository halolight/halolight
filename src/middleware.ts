import type { NextRequest } from "next/server"
import { NextResponse } from "next/server"

import {
  isAuthRoute as checkAuthRoute,
  isPublicRoute as checkPublicRoute,
} from "@/config/routes"

/**
 * 安全响应头配置
 * 包含 CSP、XSS 防护、点击劫持防护等
 */
function addSecurityHeaders(response: NextResponse): NextResponse {
  // Content Security Policy - 限制资源加载来源
  // 注意：'unsafe-inline' 和 'unsafe-eval' 是为了兼容 Next.js 和一些 UI 库
  // 生产环境建议使用 nonce 替代 unsafe-inline
  const csp = [
    "default-src 'self'",
    "script-src 'self' 'unsafe-inline' 'unsafe-eval'",
    "style-src 'self' 'unsafe-inline'",
    "img-src 'self' data: blob: https:",
    "font-src 'self' data:",
    "connect-src 'self' https: wss:",
    "frame-ancestors 'none'",
    "base-uri 'self'",
    "form-action 'self'",
  ].join("; ")

  response.headers.set("Content-Security-Policy", csp)

  // 防止 XSS 攻击
  response.headers.set("X-Content-Type-Options", "nosniff")

  // 防止点击劫持
  response.headers.set("X-Frame-Options", "DENY")

  // 控制 Referrer 信息泄露
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin")

  // 启用浏览器 XSS 过滤（现代浏览器默认启用）
  response.headers.set("X-XSS-Protection", "1; mode=block")

  // 限制浏览器功能权限
  response.headers.set(
    "Permissions-Policy",
    "camera=(), microphone=(), geolocation=(), interest-cohort=()"
  )

  // HTML 文档不缓存，确保用户获取最新版本
  response.headers.set(
    "Cache-Control",
    "private, no-cache, no-store, max-age=0, must-revalidate"
  )

  return response
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const token = request.cookies.get("token")?.value

  const isPublicRoute = checkPublicRoute(pathname)
  const isAuthRoute = checkAuthRoute(pathname)

  // 如果用户已登录且尝试访问认证页面，重定向到首页
  if (token && isAuthRoute) {
    const response = NextResponse.redirect(new URL("/", request.url))
    return addSecurityHeaders(response)
  }

  // 如果用户未登录且尝试访问受保护页面，重定向到登录页
  if (!token && !isPublicRoute) {
    const loginUrl = new URL("/login", request.url)
    loginUrl.searchParams.set("redirect", pathname)
    const response = NextResponse.redirect(loginUrl)
    return addSecurityHeaders(response)
  }

  const response = NextResponse.next()
  return addSecurityHeaders(response)
}

export const config = {
  matcher: [
    /*
     * 匹配所有路径除了:
     * - api 路由
     * - _next 静态文件
     * - _next 图片优化
     * - favicon.ico
     * - 静态文件 (images, etc.)
     */
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\..*|_next).*)",
  ],
}
