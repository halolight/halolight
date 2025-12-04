import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { render, type RenderOptions } from "@testing-library/react"
import * as React from "react"

import { ThemeProvider } from "@/providers/theme-provider"

/**
 * 创建测试用的 QueryClient
 */
export function createTestQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
        gcTime: 0,
        staleTime: 0,
      },
      mutations: {
        retry: false,
      },
    },
  })
}

/**
 * 测试用 Provider 包装器
 */
function AllProviders({ children }: { children: React.ReactNode }) {
  const queryClient = createTestQueryClient()

  return (
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </ThemeProvider>
  )
}

/**
 * 自定义 render 函数，自动包装 Providers
 */
function customRender(
  ui: React.ReactElement,
  options?: Omit<RenderOptions, "wrapper">
) {
  return render(ui, { wrapper: AllProviders, ...options })
}

// 重新导出所有 testing-library 方法
export * from "@testing-library/react"
export { customRender as render }
