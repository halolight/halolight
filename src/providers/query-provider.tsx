"use client"

import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import * as React from "react"

/**
 * 查询缓存配置
 * 根据数据类型设置不同的缓存策略
 */
export const QUERY_CACHE_CONFIG = {
  /** 静态数据：角色、权限等不常变化的数据 */
  static: {
    staleTime: 30 * 60 * 1000, // 30分钟
    gcTime: 60 * 60 * 1000,    // 60分钟
  },
  /** 仪表盘数据：统计、图表等 */
  dashboard: {
    staleTime: 5 * 60 * 1000,  // 5分钟
    gcTime: 30 * 60 * 1000,    // 30分钟
  },
  /** 用户数据：用户列表、详情等 */
  user: {
    staleTime: 2 * 60 * 1000,  // 2分钟
    gcTime: 10 * 60 * 1000,    // 10分钟
  },
  /** 实时数据：消息、通知等需要频繁更新的数据 */
  realtime: {
    staleTime: 30 * 1000,      // 30秒
    gcTime: 5 * 60 * 1000,     // 5分钟
  },
  /** 默认配置 */
  default: {
    staleTime: 60 * 1000,      // 1分钟
    gcTime: 5 * 60 * 1000,     // 5分钟
  },
} as const

/**
 * 获取查询配置的辅助函数
 */
export function getQueryConfig(type: keyof typeof QUERY_CACHE_CONFIG = "default") {
  return QUERY_CACHE_CONFIG[type]
}

function makeQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        ...QUERY_CACHE_CONFIG.default,
        refetchOnWindowFocus: false,
        retry: 1,
        // 网络错误时重试延迟
        retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
      },
      mutations: {
        // mutation 失败时也重试一次
        retry: 1,
      },
    },
  })
}

let browserQueryClient: QueryClient | undefined = undefined

function getQueryClient() {
  if (typeof window === "undefined") {
    // Server: 每次创建新的
    return makeQueryClient()
  } else {
    // Browser: 复用同一个
    if (!browserQueryClient) browserQueryClient = makeQueryClient()
    return browserQueryClient
  }
}

export function QueryProvider({ children }: { children: React.ReactNode }) {
  const queryClient = getQueryClient()

  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  )
}
