"use client"

import { AnimatePresence, motion } from "framer-motion"
import { ShieldOff } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import * as React from "react"

import { BackToTop } from "@/components/ui/back-to-top"
import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import { findPermissionRule } from "@/config/routes"
import { KeepAliveWrapper } from "@/hooks/use-keep-alive"
import type { Permission } from "@/lib/api/types"
import { PermissionGuard } from "@/providers/permission-provider"
import { useNavigationStore } from "@/stores/navigation-store"
import { useUiSettingsStore } from "@/stores/ui-settings-store"

import { CommandMenu } from "./command-menu"
import { Footer } from "./footer"
import { Header } from "./header"
import { PendingOverlay } from "./pending-overlay"
import { Sidebar } from "./sidebar"
import { TabBar } from "./tab-bar"

const SIDEBAR_COLLAPSED_KEY = "sidebar-collapsed"

interface AdminLayoutProps {
  children: React.ReactNode
}

export function AdminLayout({ children }: AdminLayoutProps) {
  const [sidebarCollapsed, setSidebarCollapsed] = React.useState(() => {
    // 初始化时从 localStorage 读取
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem(SIDEBAR_COLLAPSED_KEY)
      return saved === "true"
    }
    return false
  })
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false)
  const [commandOpen, setCommandOpen] = React.useState(false)
  const [isDesktop, setIsDesktop] = React.useState(true)
  const { pendingPath, label, source, finishNavigation } = useNavigationStore()
  const {
    showFooter,
    showTabBar,
    mobileHeaderFixed,
    mobileTabBarFixed,
    skin,
  } = useUiSettingsStore()
  const pathname = usePathname()

  // 使用集中配置获取权限规则
  const matchedRule = React.useMemo(
    () => findPermissionRule(pathname),
    [pathname]
  )
  const requiredPermission = matchedRule?.permission

  // 持久化侧边栏状态
  const handleSidebarCollapse = React.useCallback((collapsed: boolean) => {
    setSidebarCollapsed(collapsed)
    localStorage.setItem(SIDEBAR_COLLAPSED_KEY, String(collapsed))
  }, [])

  React.useEffect(() => {
    // 客户端挂载后读取存储的状态
    const saved = localStorage.getItem(SIDEBAR_COLLAPSED_KEY)
    if (saved !== null) {
      setSidebarCollapsed(saved === "true")
    }
  }, [])

  React.useEffect(() => {
    const checkIsDesktop = () => {
      setIsDesktop(window.innerWidth >= 1024)
    }
    checkIsDesktop()
    window.addEventListener("resize", checkIsDesktop)
    return () => window.removeEventListener("resize", checkIsDesktop)
  }, [])

  React.useEffect(() => {
    if (!pendingPath) return
    // 刷新场景下由 tabs 控制显隐，避免被同步路径立即关闭
    if (source === "tabbar-refresh") return
    if (pathname === pendingPath) {
      finishNavigation()
    }
  }, [pathname, pendingPath, source, finishNavigation])

  React.useEffect(() => {
    const root = document.documentElement
    if (skin === "default") {
      root.removeAttribute("data-skin")
      return
    }
    root.dataset.skin = skin
  }, [skin])

  const marginLeft = isDesktop ? (sidebarCollapsed ? 64 : 220) : 0
  const MOBILE_HEADER_HEIGHT = 64
  const MOBILE_TABBAR_HEIGHT = 48
  const additionalTopOffset =
    !isDesktop && mobileHeaderFixed ? MOBILE_HEADER_HEIGHT : 0
  const additionalTabOffset =
    !isDesktop && mobileTabBarFixed && showTabBar
      ? MOBILE_TABBAR_HEIGHT
      : 0
  const mainPaddingTop =
    !isDesktop && (additionalTopOffset || additionalTabOffset)
      ? 24 + additionalTopOffset + additionalTabOffset
      : undefined
  const guardedContent = requiredPermission ? (
    <PermissionGuard
      permission={requiredPermission}
      fallback={
        <PermissionFallback
          permission={requiredPermission}
          label={matchedRule?.label}
        />
      }
    >
      <KeepAliveWrapper>
        {children}
      </KeepAliveWrapper>
    </PermissionGuard>
  ) : (
    <KeepAliveWrapper>
      {children}
    </KeepAliveWrapper>
  )

  return (
    <div className="bg-background min-h-screen lg:h-dvh overflow-hidden flex flex-col">
      {/* 桌面端侧边栏 */}
      <div className="hidden lg:block">
        <Sidebar
          collapsed={sidebarCollapsed}
          onCollapsedChange={handleSidebarCollapse}
        />
      </div>

      {/* 移动端侧边栏 */}
      <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
        <SheetContent
          side="left"
          className="w-[280px] min-w-[220px] p-0"
          showCloseButton={false}
        >
          <SheetHeader className="sr-only">
            <SheetTitle>移动导航</SheetTitle>
            <SheetDescription>移动端侧边栏导航菜单</SheetDescription>
          </SheetHeader>
          <Sidebar
            collapsed={false}
            onCollapsedChange={() => setMobileMenuOpen(false)}
            expandedWidth="100%"
            fixed={false}
          />
        </SheetContent>
      </Sheet>

      {/* 主内容区 */}
      <motion.div
        initial={false}
        animate={{ marginLeft }}
        transition={{ duration: 0.2, ease: "easeInOut" }}
        className="relative flex flex-1 min-h-0 flex-col overflow-hidden"
      >
        <Header
          onMenuClick={() => setMobileMenuOpen(true)}
          onSearchClick={() => setCommandOpen(true)}
        />

        {/* 多标签栏 */}
        <AnimatePresence initial={false}>
          {showTabBar && (
            <motion.div
              key="tabbar"
              initial={{ opacity: 0, height: 0, y: -6 }}
              animate={{ opacity: 1, height: "auto", y: 0 }}
              exit={{ opacity: 0, height: 0, y: -6 }}
              transition={{ duration: 0.18 }}
              className="overflow-hidden"
            >
              <TabBar />
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence mode="wait">
          <motion.main
            id="main-scroll-container"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="flex-1 p-6 min-h-0 overflow-y-auto"
            style={mainPaddingTop ? { paddingTop: mainPaddingTop } : undefined}
          >
            {guardedContent}
          </motion.main>
        </AnimatePresence>
        <AnimatePresence initial={false}>
          {showFooter && (
            <motion.div
              key="footer"
              initial={{ opacity: 0, height: 0, y: 10 }}
              animate={{ opacity: 1, height: "auto", y: 0 }}
              exit={{ opacity: 0, height: 0, y: 10 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden"
            >
              <Footer />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* 命令面板 */}
      <CommandMenu open={commandOpen} onOpenChange={setCommandOpen} />

      {/* 返回顶部 */}
      <BackToTop
        threshold={200}
        duration={400}
        scrollContainerSelector="#main-scroll-container"
      />

      {/* 挂起加载 */}
      <PendingOverlay
        visible={!!pendingPath}
        label={label}
        mode={source === "tabbar-refresh" ? "refresh" : "navigate"}
        delay={source === "tabbar-refresh" ? 0 : undefined}
      />

    </div>
  )
}

function PermissionFallback({
  permission,
  label,
}: {
  permission?: Permission
  label?: string
}) {
  return (
    <div className="flex h-full items-center justify-center">
      <div className="max-w-md rounded-2xl border border-dashed border-border bg-card/40 p-8 text-center shadow-sm">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-destructive/10 text-destructive">
          <ShieldOff className="h-6 w-6" />
        </div>
        <h2 className="mt-4 text-xl font-semibold">权限不足</h2>
        <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
          您没有访问 {label || "该页面"} 所需的权限
          {permission ? `（${permission}）` : ""}。请尝试切换账号或联系管理员开通。
        </p>
        <div className="mt-6 flex items-center justify-center gap-3">
          <Button asChild variant="outline">
            <Link href="/">
              返回首页
            </Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
