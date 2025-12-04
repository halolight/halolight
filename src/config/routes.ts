/**
 * 路由与权限配置中心
 * 统一管理所有路由、权限映射和菜单配置
 */

import type { LucideIcon } from "lucide-react"
import {
  BarChart3,
  Calendar,
  FileText,
  FolderOpen,
  LayoutDashboard,
  Mail,
  Settings,
  ShieldCheck,
  Users,
} from "lucide-react"

import type { Permission } from "@/lib/api/types"

// ============================================================================
// 路由常量
// ============================================================================

/** 公开路由 - 无需认证即可访问 */
export const PUBLIC_ROUTES = [
  "/login",
  "/register",
  "/forgot-password",
  "/reset-password",
  "/terms",
  "/privacy",
] as const

/** 认证路由 - 已登录用户不能访问（如登录页） */
export const AUTH_ROUTES = [
  "/login",
  "/register",
  "/forgot-password",
  "/reset-password",
] as const

// ============================================================================
// 路由权限映射
// ============================================================================

/** 路由与权限的映射关系 */
export const ROUTE_PERMISSIONS: Record<string, Permission> = {
  "/": "dashboard:view",
  "/users": "users:view",
  "/analytics": "analytics:view",
  "/documents": "documents:view",
  "/files": "files:view",
  "/messages": "messages:view",
  "/calendar": "calendar:view",
  "/notifications": "notifications:view",
  "/accounts": "settings:view",
  "/settings": "settings:view",
  "/settings/teams": "settings:view",
  "/settings/teams/roles": "settings:view",
  "/profile": "settings:view",
  "/docs": "documents:view",
}

/** 路由与页面标题的映射 */
export const ROUTE_TITLES: Record<string, string> = {
  "/": "仪表盘",
  "/users": "用户管理",
  "/analytics": "数据分析",
  "/documents": "文档管理",
  "/files": "文件存储",
  "/messages": "消息中心",
  "/calendar": "日程安排",
  "/notifications": "通知中心",
  "/settings": "系统设置",
  "/settings/teams": "团队设置",
  "/settings/teams/roles": "角色管理",
  "/accounts": "账号与权限",
  "/profile": "个人资料",
  "/docs": "帮助文档",
}

// ============================================================================
// 权限规则（用于正则匹配）
// ============================================================================

export interface PermissionRule {
  /** 路由匹配正则 */
  pattern: RegExp
  /** 所需权限 */
  permission: Permission
  /** 页面标签 */
  label: string
}

/** 权限规则列表 - 用于动态路由匹配 */
export const PERMISSION_RULES: PermissionRule[] = [
  { pattern: /^\/$/, permission: "dashboard:view", label: "仪表盘" },
  { pattern: /^\/users/, permission: "users:view", label: "用户管理" },
  { pattern: /^\/analytics/, permission: "analytics:view", label: "数据分析" },
  { pattern: /^\/documents/, permission: "documents:view", label: "文档管理" },
  { pattern: /^\/files/, permission: "files:view", label: "文件存储" },
  { pattern: /^\/messages/, permission: "messages:view", label: "消息中心" },
  { pattern: /^\/calendar/, permission: "calendar:view", label: "日程安排" },
  { pattern: /^\/notifications/, permission: "notifications:view", label: "通知中心" },
  { pattern: /^\/settings/, permission: "settings:view", label: "系统设置" },
  { pattern: /^\/accounts/, permission: "settings:view", label: "账号与权限" },
  { pattern: /^\/profile/, permission: "settings:view", label: "个人资料" },
  { pattern: /^\/docs/, permission: "documents:view", label: "帮助文档" },
]

// ============================================================================
// 菜单配置
// ============================================================================

export interface MenuItem {
  /** 菜单标题 */
  title: string
  /** 菜单图标 */
  icon: LucideIcon
  /** 路由路径 */
  href: string
  /** 所需权限（可选，从 ROUTE_PERMISSIONS 自动获取） */
  permission?: Permission
  /** 子菜单（可选） */
  children?: MenuItem[]
}

/** 侧边栏菜单项配置 */
export const MENU_ITEMS: MenuItem[] = [
  { title: "仪表盘", icon: LayoutDashboard, href: "/" },
  { title: "用户管理", icon: Users, href: "/users" },
  {
    title: "内容管理",
    icon: FileText,
    href: "/documents",
    children: [
      { title: "文档管理", icon: FileText, href: "/documents" },
      { title: "文件存储", icon: FolderOpen, href: "/files" },
    ],
  },
  {
    title: "业务运营",
    icon: BarChart3,
    href: "/analytics",
    children: [
      { title: "数据分析", icon: BarChart3, href: "/analytics" },
      { title: "消息中心", icon: Mail, href: "/messages" },
      { title: "日程安排", icon: Calendar, href: "/calendar" },
    ],
  },
  { title: "账号与权限", icon: ShieldCheck, href: "/accounts" },
  {
    title: "系统设置",
    icon: Settings,
    href: "/settings",
    children: [
      {
        title: "团队设置",
        icon: Users,
        href: "/settings/teams",
        children: [
          { title: "角色管理", icon: ShieldCheck, href: "/settings/teams/roles" },
        ],
      },
    ],
  },
]

// ============================================================================
// 工具函数
// ============================================================================

/**
 * 检查路径是否为公开路由
 */
export function isPublicRoute(pathname: string): boolean {
  return PUBLIC_ROUTES.some((route) => pathname.startsWith(route))
}

/**
 * 检查路径是否为认证路由
 */
export function isAuthRoute(pathname: string): boolean {
  return AUTH_ROUTES.some((route) => pathname.startsWith(route))
}

/**
 * 获取路径所需的权限
 */
export function getRoutePermission(pathname: string): Permission | undefined {
  // 先尝试精确匹配
  if (pathname in ROUTE_PERMISSIONS) {
    return ROUTE_PERMISSIONS[pathname]
  }
  // 再尝试正则匹配
  const rule = PERMISSION_RULES.find((r) => r.pattern.test(pathname))
  return rule?.permission
}

/**
 * 获取路径对应的页面标题
 */
export function getRouteTitle(pathname: string): string {
  if (pathname in ROUTE_TITLES) {
    return ROUTE_TITLES[pathname]
  }
  const rule = PERMISSION_RULES.find((r) => r.pattern.test(pathname))
  return rule?.label ?? "Admin Pro"
}

/**
 * 根据路径查找匹配的权限规则
 */
export function findPermissionRule(pathname: string): PermissionRule | undefined {
  return PERMISSION_RULES.find((rule) => rule.pattern.test(pathname))
}

/**
 * 获取菜单项所需的权限
 */
export function getMenuPermission(href: string): Permission | undefined {
  return ROUTE_PERMISSIONS[href]
}
