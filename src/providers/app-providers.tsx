"use client"

import * as React from "react"

import { MockProvider } from "@/components/mock-provider"
import { TdkManager } from "@/components/tdk-manager"
import { CookieConsent } from "@/components/ui/cookie-consent"
import { AuthProvider } from "@/providers/auth-provider"
import { ErrorProvider } from "@/providers/error-provider"
import { PermissionProvider } from "@/providers/permission-provider"
import { QueryProvider } from "@/providers/query-provider"
import { ThemeProvider } from "@/providers/theme-provider"
import { WebSocketProvider } from "@/providers/websocket-provider"

interface AppProvidersProps {
  children: React.ReactNode
}

/**
 * 应用级 Provider 组合
 *
 * Provider 层级说明（从外到内）：
 * 1. ThemeProvider - 主题管理，最外层以确保所有组件可访问主题
 * 2. MockProvider - Mock 数据拦截，在实际请求之前处理
 * 3. QueryProvider - React Query 客户端，管理所有数据请求
 * 4. AuthProvider - 认证状态管理，依赖 QueryProvider
 * 5. PermissionProvider - 权限管理，依赖 AuthProvider 获取用户信息
 * 6. WebSocketProvider - WebSocket 连接，依赖认证状态
 * 7. ErrorProvider - 错误收集与展示，最内层以捕获所有错误
 */
export function AppProviders({ children }: AppProvidersProps) {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <MockProvider>
        <QueryProvider>
          <AuthProvider>
            <PermissionProvider>
              <WebSocketProvider>
                <ErrorProvider>
                  <TdkManager />
                  {children}
                </ErrorProvider>
              </WebSocketProvider>
            </PermissionProvider>
          </AuthProvider>
        </QueryProvider>
      </MockProvider>
      <CookieConsent />
    </ThemeProvider>
  )
}

/**
 * 创建 Provider 组合的辅助函数
 * 用于动态组合多个 Provider
 *
 * @example
 * ```tsx
 * const providers = [
 *   [ThemeProvider, { attribute: "class" }],
 *   [QueryProvider, {}],
 *   [AuthProvider, {}],
 * ] as const
 *
 * const CombinedProvider = composeProviders(providers)
 * ```
 */
export function composeProviders(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  providers: Array<[React.ComponentType<any>, Record<string, unknown>]>
): React.FC<{ children: React.ReactNode }> {
  return function ComposedProvider({ children }) {
    return providers.reduceRight(
      (acc, [Provider, props]) => <Provider {...props}>{acc}</Provider>,
      children
    ) as React.ReactElement
  }
}
