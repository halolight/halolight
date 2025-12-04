"use client"

import { Loader2 } from "lucide-react"
import { usePathname, useRouter } from "next/navigation"
import * as React from "react"

import { useAuthStore } from "@/stores/auth-store"

interface AuthProviderProps {
  children: React.ReactNode
}

// 公开路由列表
const publicRoutes = [
  "/login",
  "/register",
  "/forgot-password",
  "/reset-password",
]

export function AuthProvider({ children }: AuthProviderProps) {
  const pathname = usePathname()
  const router = useRouter()
  const { isAuthenticated, isLoading, checkAuth } = useAuthStore()
  const [isInitialized, setIsInitialized] = React.useState(false)

  const isPublicRoute = publicRoutes.some((route) =>
    pathname.startsWith(route)
  )

  React.useEffect(() => {
    const initAuth = async () => {
      const hasPersistedAuth = localStorage.getItem("auth-storage")
      // 先标记初始化完成，避免在公开页面被 checkAuth 阻塞导致跳转延迟
      setIsInitialized(true)

      if (!hasPersistedAuth || isPublicRoute) {
        await checkAuth()
      }
    }
    initAuth()
  }, [checkAuth, isPublicRoute])

  React.useEffect(() => {
    if (!isInitialized) return

    // 已登录用户访问认证页面时重定向到首页
    if (isAuthenticated && isPublicRoute) {
      router.push("/")
    }
  }, [isInitialized, isAuthenticated, isPublicRoute, router])

  // 公开路由不显示加载状态，避免登录页面闪烁
  const shouldShowLoading =
    !isInitialized || (!isAuthenticated && !isPublicRoute && isLoading)

  if (shouldShowLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-sm text-muted-foreground">加载中...</p>
        </div>
      </div>
    )
  }

  return <>{children}</>
}
