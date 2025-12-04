import { PERMISSION_RULES, ROUTE_TITLES } from "./routes"

export interface TdkEntry {
  title: string
  description: string
  keywords: string
}

export const DEFAULT_TDK: TdkEntry = {
  title: "Admin Pro",
  description: "Admin Pro 企业级后台管理系统，为团队提供统一的数据、权限与运营控制中心。",
  keywords: "Admin Pro, 后台管理, 仪表盘, 运营",
}

export const ROUTE_TDK: Record<string, TdkEntry> = {
  "/": {
    title: "仪表盘",
    description:
      "可拖拽、可配置的仪表盘，支持添加/删除/重置部件，配置持久化本地存储。",
    keywords: "仪表盘, dashboard, 报表, Admin Pro",
  },
  "/analytics": {
    title: "数据分析",
    description: "深入了解您的网站流量和用户行为。",
    keywords: "数据分析, 报表, 流量指标, Admin Pro",
  },
  "/calendar": {
    title: "日程安排",
    description: "管理您的日程和任务。",
    keywords: "日程, 任务, 日历, 行程",
  },
  "/docs": {
    title: "帮助文档",
    description: "查找使用指南、教程和常见问题解答。",
    keywords: "文档, 教程, 常见问题, 指南",
  },
  "/documents": {
    title: "文档管理",
    description: "管理和组织您的所有文档。",
    keywords: "文档管理, 协作, 文件",
  },
  "/files": {
    title: "文件存储",
    description: "管理您的云端文件和文件夹。",
    keywords: "文件存储, 云端, 共享, 管理",
  },
  "/messages": {
    title: "消息中心",
    description: "管理您的消息和通知。",
    keywords: "消息, 通信, 聊天, Admin Pro",
  },
  "/notifications": {
    title: "通知中心",
    description: "查看和管理所有系统通知。",
    keywords: "通知, 系统通知, 报警",
  },
  "/profile": {
    title: "个人资料",
    description: "管理您的账户信息和偏好设置。",
    keywords: "个人资料, 账户设置, Admin Pro",
  },
  "/settings": {
    title: "系统设置",
    description: "管理您的账户设置和系统偏好。",
    keywords: "设置, 偏好, 系统管理",
  },
  "/settings/teams": {
    title: "团队设置",
    description: "管理团队信息、成员和组织架构。",
    keywords: "团队, 成员管理, 组织架构, Admin Pro",
  },
  "/settings/teams/roles": {
    title: "角色管理",
    description: "创建和管理系统角色，配置角色权限。",
    keywords: "角色管理, 权限配置, RBAC, Admin Pro",
  },
  "/users": {
    title: "用户管理",
    description: "管理系统用户、角色和权限。",
    keywords: "用户管理, 角色, 权限",
  },
  "/accounts": {
    title: "账号与权限",
    description: "查看可用账号、角色和权限，按需切换身份。",
    keywords: "账号, 权限切换, 角色",
  },
  "/login": {
    title: "登录",
    description: "输入账户凭证以访问 Admin Pro 后台。",
    keywords: "登录, 认证, Admin Pro",
  },
  "/register": {
    title: "注册",
    description: "创建 Admin Pro 账号，开始管理您的业务。",
    keywords: "注册, 创建账号, Admin Pro",
  },
  "/forgot-password": {
    title: "找回密码",
    description: "通过邮箱重设您的登录密码。",
    keywords: "找回密码, 重设, 安全",
  },
  "/reset-password": {
    title: "重置密码",
    description: "设置一个新的账户密码以恢复访问。",
    keywords: "重置密码, 找回账号, 安全",
  },
  "/terms": {
    title: "服务条款",
    description: "查看 Admin Pro 的服务条款、使用协议与权利义务。",
    keywords: "服务条款, 协议, 法律",
  },
  "/privacy": {
    title: "隐私政策",
    description: "了解我们如何收集、使用、存储和保护您的个人信息。",
    keywords: "隐私, 数据保护, 政策",
  },
}

export function getRouteTdk(pathname: string): TdkEntry {
  if (ROUTE_TDK[pathname]) {
    return ROUTE_TDK[pathname]
  }

  const permissionRule = PERMISSION_RULES.find((rule) => rule.pattern.test(pathname))
  if (permissionRule) {
    const title = permissionRule.label || ROUTE_TITLES[pathname] || DEFAULT_TDK.title
    return {
      title,
      description: `查看 ${title} 相关的数据与功能。`,
      keywords: `${title}, Admin Pro`,
    }
  }

  return DEFAULT_TDK
}
