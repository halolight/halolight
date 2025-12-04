"use client"

import { AnimatePresence, motion } from "framer-motion"
import {
  Bell,
  Calendar,
  ChevronLeft,
  ChevronRight,
  FileText,
  FolderOpen,
  HelpCircle,
  Home,
  LineChart,
  Loader2,
  MessageSquare,
  Settings,
  ShieldCheck,
  User,
  Users,
  X,
} from "lucide-react"
import { usePathname, useRouter } from "next/navigation"
import * as React from "react"

import { Button } from "@/components/ui/button"
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuTrigger,
} from "@/components/ui/context-menu"
import { usePageCacheStore } from "@/hooks/use-keep-alive"
import { cn } from "@/lib/utils"
import { useNavigationStore } from "@/stores/navigation-store"
import { type Tab, useTabsStore } from "@/stores/tabs-store"
import { useUiSettingsStore } from "@/stores/ui-settings-store"

// 路径到标题的映射
const pathTitles: Record<string, string> = {
  "/": "首页",
  "/users": "用户管理",
  "/accounts": "账号与权限",
  "/analytics": "数据分析",
  "/settings": "系统设置",
  "/documents": "文档管理",
  "/files": "文件管理",
  "/messages": "消息中心",
  "/calendar": "日程管理",
  "/notifications": "通知中心",
  "/profile": "个人资料",
  "/docs": "帮助文档",
  "/settings/teams": "团队设置",
  "/settings/teams/roles": "角色管理",
}

// 路径到图标的映射
const pathIcons: Record<string, React.ComponentType<{ className?: string }>> = {
  "/": Home,
  "/users": Users,
  "/accounts": ShieldCheck,
  "/analytics": LineChart,
  "/settings": Settings,
  "/documents": FileText,
  "/files": FolderOpen,
  "/messages": MessageSquare,
  "/calendar": Calendar,
  "/notifications": Bell,
  "/profile": User,
  "/docs": HelpCircle,
  "/settings/teams": Settings,
  "/settings/teams/roles": ShieldCheck,
}

const resolveTitle = (path: string) => {
  const match = Object.entries(pathTitles).find(
    ([key]) => path === key || path.startsWith(`${key}/`)
  )
  return match ? match[1] : path.split("/").pop() || "新页面"
}

const resolveIcon = (path: string) => {
  const match = Object.entries(pathIcons).find(
    ([key]) => path === key || path.startsWith(`${key}/`)
  )
  return match ? match[1] : Home
}

export function TabBar() {
  const router = useRouter()
  const pathname = usePathname()
  const startNavigation = useNavigationStore((state) => state.startNavigation)
  const finishNavigation = useNavigationStore((state) => state.finishNavigation)
  const tabsContainerRef = React.useRef<HTMLDivElement>(null)
  const [canScrollLeft, setCanScrollLeft] = React.useState(false)
  const [canScrollRight, setCanScrollRight] = React.useState(false)
  const showTabBar = useUiSettingsStore((state) => state.showTabBar)
  const mobileTabBarFixed = useUiSettingsStore(
    (state) => state.mobileTabBarFixed
  )
  const mobileHeaderFixed = useUiSettingsStore(
    (state) => state.mobileHeaderFixed
  )
  const [refreshingTabId, setRefreshingTabId] = React.useState<string | null>(null)
  const [isPending, startTransition] = React.useTransition()
  const refreshTimeoutRef = React.useRef<NodeJS.Timeout | null>(null)

  const { tabs, activeTabId, addTab, removeTab, setActiveTab, clearTabs, getTabByPath, updateTab } =
    useTabsStore()

  // 检查滚动状态
  const checkScroll = React.useCallback(() => {
    const container = tabsContainerRef.current
    if (!container) return

    setCanScrollLeft(container.scrollLeft > 0)
    setCanScrollRight(
      container.scrollLeft < container.scrollWidth - container.clientWidth
    )
  }, [])

  // 滚动到活动标签
  const scrollToActiveTab = React.useCallback(() => {
    const container = tabsContainerRef.current
    if (!container) return

    const activeTab = container.querySelector(`[data-tab-id="${activeTabId}"]`)
    if (activeTab) {
      activeTab.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "center" })
    }
  }, [activeTabId])

  // 监听路由变化，自动添加标签
  React.useEffect(() => {
    if (pathname) {
      const existingTab = getTabByPath(pathname)
      const title = resolveTitle(pathname)
      if (existingTab) {
        setActiveTab(existingTab.id)
        if (existingTab.title !== title) {
          updateTab(existingTab.id, { title })
        }
      } else {
        addTab({ title, path: pathname, icon: resolveIcon(pathname).displayName })
      }
    }
  }, [pathname, addTab, setActiveTab, getTabByPath, updateTab])

  // 监听标签变化，检查滚动
  React.useEffect(() => {
    checkScroll()
    scrollToActiveTab()
  }, [tabs, activeTabId, checkScroll, scrollToActiveTab])

  // 监听容器大小变化
  React.useEffect(() => {
    const container = tabsContainerRef.current
    if (!container) return

    const observer = new ResizeObserver(checkScroll)
    observer.observe(container)

    container.addEventListener("scroll", checkScroll)

    return () => {
      observer.disconnect()
      container.removeEventListener("scroll", checkScroll)
    }
  }, [checkScroll])

  const scroll = (direction: "left" | "right") => {
    const container = tabsContainerRef.current
    if (!container) return

    const scrollAmount = 200
    container.scrollBy({
      left: direction === "left" ? -scrollAmount : scrollAmount,
      behavior: "smooth",
    })
  }

  const handleTabClick = (tab: Tab) => {
    setActiveTab(tab.id)
    if (pathname !== tab.path) {
      startNavigation({ path: tab.path, label: tab.title, source: "tabbar" })
    }
    router.push(tab.path)
  }

  const handleCloseTab = (e: React.MouseEvent, tab: Tab) => {
    e.stopPropagation()
    if (tab.closable === false) return

    const currentIndex = tabs.findIndex((t) => t.id === tab.id)
    removeTab(tab.id)

    // 如果关闭的是当前标签，跳转到相邻标签
    if (tab.id === activeTabId) {
      const nextTab = tabs[currentIndex + 1] || tabs[currentIndex - 1]
      if (nextTab) {
        router.push(nextTab.path)
      }
    }
  }

  const handleCloseOthers = (tab: Tab) => {
    const otherTabs = tabs.filter((t) => t.id !== tab.id && t.closable !== false)
    otherTabs.forEach((t) => removeTab(t.id))
    setActiveTab(tab.id)
    if (pathname !== tab.path) {
      startNavigation({ path: tab.path, label: tab.title, source: "tabbar" })
    }
    router.push(tab.path)
  }

  const handleCloseRight = (tab: Tab) => {
    const tabIndex = tabs.findIndex((t) => t.id === tab.id)
    const rightTabs = tabs.slice(tabIndex + 1).filter((t) => t.closable !== false)
    rightTabs.forEach((t) => removeTab(t.id))
  }

  const handleCloseAll = () => {
    clearTabs()
    startNavigation({ path: "/", label: "首页", source: "tabbar" })
    router.push("/")
  }

  const handleRefreshTab = React.useCallback(
    (tab: Tab) => {
      const isCurrent = tab.path === pathname
      startNavigation({
        path: tab.path,
        label: `正在刷新 ${tab.title}`,
        source: "tabbar-refresh",
      })
      usePageCacheStore.getState().clearPageState(tab.path)
      setRefreshingTabId(tab.id)
      if (refreshTimeoutRef.current) {
        clearTimeout(refreshTimeoutRef.current)
      }
      refreshTimeoutRef.current = setTimeout(() => {
        setRefreshingTabId(null)
        finishNavigation()
      }, 5000)

      const runRefresh = () => startTransition(() => router.refresh())

      if (isCurrent) {
        runRefresh()
        return
      }

      setActiveTab(tab.id)
      router.push(tab.path)
      setTimeout(runRefresh, 50)
    },
    [finishNavigation, pathname, router, setActiveTab, startNavigation]
  )

  React.useEffect(() => {
    if (!refreshingTabId) return
    if (isPending) return
    if (refreshTimeoutRef.current) {
      clearTimeout(refreshTimeoutRef.current)
      refreshTimeoutRef.current = null
    }
    const timer = setTimeout(() => {
      setRefreshingTabId(null)
      finishNavigation()
    }, 250)
    return () => clearTimeout(timer)
  }, [finishNavigation, isPending, refreshingTabId])

  React.useEffect(() => {
    return () => {
      if (refreshTimeoutRef.current) {
        clearTimeout(refreshTimeoutRef.current)
      }
    }
  }, [])

  if (!showTabBar) return null
  if (tabs.length <= 1) return null

  const tabBarPositionClasses = mobileTabBarFixed
    ? [
        "fixed",
        "left-0",
        "right-0",
        mobileHeaderFixed ? "top-16" : "top-0",
      ]
    : "relative"

  return (
    <div
      className={cn(
        "flex h-12 items-center border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60",
        tabBarPositionClasses,
        "lg:static",
        "z-40"
      )}
    >
      {/* 左滚动按钮 */}
      {canScrollLeft && (
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 shrink-0"
          onClick={() => scroll("left")}
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
      )}

      {/* 标签容器 */}
      <div
        ref={tabsContainerRef}
        className="flex-1 flex items-center overflow-x-auto scrollbar-hide"
      >
        <AnimatePresence mode="popLayout">
          {tabs.map((tab) => (
            <motion.div
              key={tab.id}
              layout
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.15 }}
            >
              <ContextMenu>
                <ContextMenuTrigger asChild>
                  <div
                    data-tab-id={tab.id}
                    className={cn(
                      "group flex items-center gap-1 px-3 py-2 border-r border-border cursor-pointer transition-colors relative min-w-[100px] max-w-[200px]",
                      activeTabId === tab.id
                        ? "bg-background text-foreground"
                        : "bg-muted/50 text-muted-foreground hover:bg-muted hover:text-foreground"
                    )}
                    onClick={() => handleTabClick(tab)}
                  >
                    {/* 活动指示器 */}
                    {activeTabId === tab.id && (
                      <motion.div
                        layoutId="activeTab"
                        className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary"
                      />
                    )}

                    {/* 图标 */}
                    {pathIcons[tab.path]
                      ? React.createElement(pathIcons[tab.path], { className: "h-3.5 w-3.5 shrink-0" })
                      : null}

                    {/* 标题 */}
                    <span className="truncate text-sm flex items-center gap-1">
                      <span>{tab.title}</span>
                      {refreshingTabId === tab.id && (
                        <Loader2 className="h-3 w-3 animate-spin text-primary" />
                      )}
                    </span>

                    {/* 关闭按钮 */}
                    {tab.closable !== false && (
                      <Button
                        variant="ghost"
                        size="icon"
                        className={cn(
                          "h-4 w-4 p-0 transition-opacity ml-1 shrink-0 hover:bg-muted-foreground/20 rounded-sm",
                          activeTabId === tab.id
                            ? "opacity-100"
                            : "opacity-0 group-hover:opacity-100 sm:opacity-0"
                        )}
                        onClick={(e) => handleCloseTab(e, tab)}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    )}
                  </div>
                </ContextMenuTrigger>
                <ContextMenuContent>
                  <ContextMenuItem onClick={() => handleRefreshTab(tab)}>
                    刷新页面
                  </ContextMenuItem>
                  <ContextMenuSeparator />
                  {tab.closable !== false && (
                    <ContextMenuItem onClick={(e) => handleCloseTab(e as React.MouseEvent, tab)}>
                      关闭标签
                    </ContextMenuItem>
                  )}
                  <ContextMenuItem onClick={() => handleCloseOthers(tab)}>
                    关闭其他
                  </ContextMenuItem>
                  <ContextMenuItem onClick={() => handleCloseRight(tab)}>
                    关闭右侧
                  </ContextMenuItem>
                  <ContextMenuSeparator />
                  <ContextMenuItem onClick={handleCloseAll}>
                    关闭所有
                  </ContextMenuItem>
                </ContextMenuContent>
              </ContextMenu>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* 右滚动按钮 */}
      {canScrollRight && (
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 shrink-0"
          onClick={() => scroll("right")}
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      )}
    </div>
  )
}
