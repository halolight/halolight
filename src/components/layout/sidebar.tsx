"use client"

import { AnimatePresence, motion } from "framer-motion"
import { ChevronDown, ChevronLeft } from "lucide-react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import * as React from "react"
import { createPortal } from "react-dom"

import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import type { MenuItem } from "@/config/routes"
import { getMenuPermission, MENU_ITEMS } from "@/config/routes"
import type { Permission } from "@/lib/api/types"
import { cn } from "@/lib/utils"
import { usePermission } from "@/providers/permission-provider"
import { useNavigationStore } from "@/stores/navigation-store"

interface SidebarProps {
  collapsed: boolean
  onCollapsedChange: (collapsed: boolean) => void
  expandedWidth?: number | string
  collapsedWidth?: number | string
  fixed?: boolean
}

export function Sidebar({
  collapsed,
  onCollapsedChange,
  expandedWidth = 220,
  collapsedWidth = 72,
  fixed = true,
}: SidebarProps) {
  const pathname = usePathname()
  const router = useRouter()
  const startNavigation = useNavigationStore((state) => state.startNavigation)
  const { hasPermission } = usePermission()
  const [openKeys, setOpenKeys] = React.useState<Set<string>>(new Set())
  const [hoverPreview, setHoverPreview] = React.useState<{
    key: string
    rect: DOMRect
    items: MenuItem[]
  } | null>(null)
  const hoverCloseTimer = React.useRef<ReturnType<typeof setTimeout> | null>(null)

  // 封装 timer 操作，避免 ESLint refs 规则误报
  const clearHoverTimer = React.useCallback(() => {
    if (hoverCloseTimer.current) {
      clearTimeout(hoverCloseTimer.current)
      hoverCloseTimer.current = null
    }
  }, [])

  const setHoverTimer = React.useCallback((callback: () => void, delay: number) => {
    clearHoverTimer()
    hoverCloseTimer.current = setTimeout(callback, delay)
  }, [clearHoverTimer])

  const toggleOpen = React.useCallback((key: string) => {
    setOpenKeys((prev) => {
      const next = new Set(prev)
      if (next.has(key)) {
        next.delete(key)
      } else {
        next.add(key)
      }
      return next
    })
  }, [])

  React.useEffect(() => {
    const nextOpen = new Set<string>()
    const traverse = (items: typeof MENU_ITEMS) => {
      items.forEach((item) => {
        const isMatch = pathname === item.href || pathname.startsWith(`${item.href}/`)
        if (item.children?.length) {
          const hasActiveChild = item.children.some(
            (child) => pathname === child.href || pathname.startsWith(`${child.href}/`)
          )
          if (isMatch || hasActiveChild) {
            nextOpen.add(item.href)
          }
          traverse(item.children)
        }
      })
    }
    traverse(MENU_ITEMS)
    setOpenKeys(nextOpen)
  }, [pathname])

  const handleNavigate = React.useCallback(
    (href: string, label: string) => {
      const required = getMenuPermission(href)
      if (required && !hasPermission(required)) return
      if (pathname === href) {
        // 即使是当前页面，移动端也应关闭菜单
        onCollapsedChange(true)
        return
      }
      startNavigation({ path: href, label, source: "sidebar" })
      router.push(href)
      // 导航后关闭移动端侧边栏
      onCollapsedChange(true)
    },
    [hasPermission, pathname, router, startNavigation, onCollapsedChange]
  )

  const handleHoverItem = React.useCallback(
    (item: MenuItem, target: HTMLElement | null) => {
      if (!collapsed || !item.children?.length || !target) return
      clearHoverTimer()
      const rect = target.getBoundingClientRect()
      setHoverPreview({ key: item.href, rect, items: item.children })
    },
    [collapsed, clearHoverTimer]
  )

  const scheduleHoverClose = React.useCallback(() => {
    if (!collapsed) return
    setHoverTimer(() => setHoverPreview(null), 120)
  }, [collapsed, setHoverTimer])

  const cancelHoverClose = React.useCallback(() => {
    clearHoverTimer()
  }, [clearHoverTimer])

  React.useEffect(() => {
    return () => {
      clearHoverTimer()
    }
  }, [clearHoverTimer])

  React.useEffect(() => {
    if (!collapsed) {
      setHoverPreview(null)
      clearHoverTimer()
    }
  }, [collapsed, clearHoverTimer])

  return (
    <TooltipProvider delayDuration={0}>
      <motion.aside
        initial={false}
        animate={{ width: collapsed ? collapsedWidth : expandedWidth }}
        transition={{ duration: 0.2, ease: "easeInOut" }}
        className={cn(
          fixed ? "fixed left-0 top-0 h-screen" : "relative h-full",
          "z-40 border-r border-border bg-sidebar",
          "flex flex-col"
        )}
        style={{ pointerEvents: "auto" }}
      >
        {/* Logo */}
        <div className="flex h-16 items-center justify-between border-b border-border px-4">
          <AnimatePresence mode="wait">
            {!collapsed && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.15 }}
                className="flex items-center gap-2"
              >
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
                  <span className="text-sm font-bold text-primary-foreground">
                    A
                  </span>
                </div>
                <span className="font-semibold text-sidebar-foreground">
                  Admin Pro
                </span>
              </motion.div>
            )}
          </AnimatePresence>
          {collapsed && (
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary mx-auto">
              <span className="text-sm font-bold text-primary-foreground">
                A
              </span>
            </div>
          )}
        </div>

        {/* 导航菜单 */}
        <ScrollArea className="flex-1 py-4">
          <nav className="space-y-1 px-2" role="tree" aria-label="主导航菜单">
            {/* eslint-disable-next-line react-hooks/refs -- ref 只在回调中访问，非渲染时 */}
            {renderMenuItems({
              items: MENU_ITEMS,
              pathname,
              collapsed,
              openKeys,
              toggleOpen,
              handleNavigate,
              hasPermission,
              onHoverItem: handleHoverItem,
              onHoverEnd: scheduleHoverClose,
            })}
          </nav>
        </ScrollArea>

        {/* 折叠按钮 */}
        <div className="border-t border-border p-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onCollapsedChange(!collapsed)}
            className="w-full justify-center"
          >
            <motion.div
              animate={{ rotate: collapsed ? 180 : 0 }}
              transition={{ duration: 0.2 }}
            >
              <ChevronLeft className="h-4 w-4" />
            </motion.div>
            <AnimatePresence mode="wait">
              {!collapsed && (
                <motion.span
                  initial={{ opacity: 0, width: 0 }}
                  animate={{ opacity: 1, width: "auto" }}
                  exit={{ opacity: 0, width: 0 }}
                  className="ml-2"
                >
                  收起菜单
                </motion.span>
              )}
            </AnimatePresence>
          </Button>
        </div>

        {collapsed && hoverPreview &&
          createPortal(
            <AnimatePresence>
              <motion.div
                key={hoverPreview.key}
                initial={{ opacity: 0, x: -6 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -6 }}
                transition={{ duration: 0.12 }}
                className="fixed z-50 w-64 overflow-auto rounded-xl border bg-popover/95 shadow-xl backdrop-blur"
                style={{
                  top: hoverPreview.rect.top,
                  left: hoverPreview.rect.right + 8,
                  maxHeight: "75vh",
                }}
                onMouseEnter={cancelHoverClose}
                onMouseLeave={scheduleHoverClose}
              >
                <div className="p-2">
                  {renderCollapsedFlyout({
                    items: hoverPreview.items,
                    pathname,
                    handleNavigate,
                    hasPermission,
                  })}
                </div>
              </motion.div>
            </AnimatePresence>,
            document.body
          )}
      </motion.aside>
    </TooltipProvider>
  )
}

interface RenderMenuItemsProps {
  items: typeof MENU_ITEMS
  pathname: string
  collapsed: boolean
  openKeys: Set<string>
  toggleOpen: (key: string) => void
  handleNavigate: (href: string, label: string) => void
  hasPermission: (permission: Permission) => boolean
  onHoverItem?: (item: MenuItem, target: HTMLElement | null) => void
  onHoverEnd?: () => void
  depth?: number
}

function renderMenuItems({
  items,
  pathname,
  collapsed,
  openKeys,
  toggleOpen,
  handleNavigate,
  hasPermission,
  onHoverItem,
  onHoverEnd,
  depth = 0,
}: RenderMenuItemsProps) {
  return items.map((item) => {
    const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`)
    const hasChildren = !!item.children?.length
    const isOpen = openKeys.has(item.href)
    const Icon = item.icon
    const required = getMenuPermission(item.href)
    const allowed = required ? hasPermission(required) : true

    const linkContent = (
      <Link
        href={item.href}
        onClick={(e) => {
          e.preventDefault()
          handleNavigate(item.href, item.title)
        }}
        className={cn(
          "group relative flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all",
          allowed
            ? "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
            : "opacity-60 cursor-not-allowed",
          isActive && allowed
            ? "bg-sidebar-accent text-sidebar-accent-foreground"
            : "text-sidebar-foreground/70"
        )}
        aria-disabled={!allowed}
      >
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <Icon className="h-5 w-5 shrink-0" />
        </motion.div>
        <AnimatePresence mode="wait">
          {!collapsed && (
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
              className="truncate"
            >
              {item.title}
            </motion.span>
          )}
        </AnimatePresence>
        {hasChildren && (
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault()
              e.stopPropagation()
              toggleOpen(item.href)
            }}
            aria-expanded={isOpen}
            aria-label={isOpen ? `收起 ${item.title}` : `展开 ${item.title}`}
            className="ml-auto flex h-6 w-6 items-center justify-center rounded hover:bg-sidebar-accent/60 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
          >
            <ChevronDown
              className={cn(
                "h-4 w-4 transition-transform duration-200",
                isOpen ? "rotate-180" : ""
              )}
            />
          </button>
        )}
        {isActive && (
          <motion.div
            layoutId="activeIndicator"
            className="absolute left-0 h-8 w-1 rounded-r-full bg-primary"
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          />
        )}
      </Link>
    )

    if (collapsed) {
      return (
        <div
          key={item.href}
          className="relative"
          role="treeitem"
          aria-level={depth + 1}
          aria-selected={isActive}
          aria-expanded={hasChildren ? isOpen : undefined}
          onMouseEnter={(e) => onHoverItem?.(item, e.currentTarget)}
          onMouseLeave={onHoverEnd}
        >
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="relative">{linkContent}</div>
            </TooltipTrigger>
            <TooltipContent side="right" sideOffset={10}>
              {item.title}
            </TooltipContent>
          </Tooltip>
        </div>
      )
    }

    return (
      <div
        key={item.href}
        className="relative"
        role="treeitem"
        aria-level={depth + 1}
        aria-selected={isActive}
        aria-expanded={hasChildren ? isOpen : undefined}
      >
        {linkContent}
        <AnimatePresence initial={false}>
          {hasChildren && isOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2, ease: "easeInOut" }}
              className="relative ml-4 mt-1 border-l border-border/50 pl-3"
              role="group"
            >
              {renderMenuItems({
                items: item.children!,
                pathname,
                collapsed,
                openKeys,
                toggleOpen,
                handleNavigate,
                hasPermission,
                depth: depth + 1,
              })}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    )
  })
}

function renderCollapsedFlyout({
  items,
  pathname,
  handleNavigate,
  hasPermission,
  depth = 0,
}: {
  items: MenuItem[]
  pathname: string
  handleNavigate: (href: string, label: string) => void
  hasPermission: (permission: Permission) => boolean
  depth?: number
}) {
  return items.map((item) => {
    const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`)
    const hasChildren = !!item.children?.length
    const Icon = item.icon
    const required = getMenuPermission(item.href)
    const allowed = required ? hasPermission(required) : true

    return (
      <div key={item.href} className="space-y-0.5">
        <button
          type="button"
          onClick={() => allowed && handleNavigate(item.href, item.title)}
          disabled={!allowed}
          className={cn(
            "flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-left transition-colors",
            allowed
              ? "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
              : "opacity-60 cursor-not-allowed",
            isActive && allowed
              ? "bg-sidebar-accent text-sidebar-accent-foreground"
              : "text-sidebar-foreground/80"
          )}
        >
          <Icon className="h-4 w-4 shrink-0" />
          <span className="truncate">{item.title}</span>
        </button>
        {hasChildren && (
          <div className="ml-4 border-l border-border/50 pl-3">
            {renderCollapsedFlyout({
              items: item.children!,
              pathname,
              handleNavigate,
              hasPermission,
              depth: depth + 1,
            })}
          </div>
        )}
      </div>
    )
  })
}
