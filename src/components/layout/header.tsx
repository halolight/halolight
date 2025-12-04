"use client"

import { motion } from "framer-motion"
import { AlertTriangle, Bell, HelpCircle, LogOut, Menu, Search, Settings, User } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import * as React from "react"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { cn } from "@/lib/utils"
import { useAuthStore } from "@/stores/auth-store"
import { useErrorStore } from "@/stores/error-store"
import { useNavigationStore } from "@/stores/navigation-store"
import { useUiSettingsStore } from "@/stores/ui-settings-store"

import { QuickSettings } from "./quick-settings"

interface HeaderProps {
  onMenuClick: () => void
  onSearchClick: () => void
}

export function Header({ onMenuClick, onSearchClick }: HeaderProps) {
  const router = useRouter()
  const { user, accounts, activeAccountId, switchAccount, logout } = useAuthStore()
  const startNavigation = useNavigationStore((state) => state.startNavigation)
  const errors = useErrorStore((state) => state.errors)
  const unreadErrors = useErrorStore((state) => state.unreadCount())
  const markErrorsRead = useErrorStore((state) => state.markAllRead)
  const clearErrors = useErrorStore((state) => state.clear)

  // 优化：使用 useCallback 缓存回调函数
  const handleLogout = React.useCallback(async () => {
    await logout()
    router.push("/login")
  }, [logout, router])

  const handleNavigate = React.useCallback((href: string, label: string) => {
    startNavigation({ path: href, label, source: "header" })
    router.push(href)
  }, [startNavigation, router])

  const handleSwitchAccount = React.useCallback(async (accountId: string) => {
    if (accountId === activeAccountId) return
    try {
      await switchAccount(accountId)
    } catch {
      // 错误已在 store 中处理
    }
  }, [activeAccountId, switchAccount])

  const handleClearErrors = React.useCallback(() => {
    markErrorsRead()
    clearErrors()
  }, [markErrorsRead, clearErrors])

  // 优化：使用 useMemo 缓存账号列表
  const accountList = React.useMemo(
    () => (accounts.length > 0 ? accounts : user ? [user] : []),
    [accounts, user]
  )
  const mobileHeaderFixed = useUiSettingsStore(
    (state) => state.mobileHeaderFixed
  )

  const headerPositionClasses = mobileHeaderFixed ? "fixed inset-x-0 top-0" : "relative"

  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.3 }}
      className={cn(
        "z-50 flex h-16 items-center justify-between border-b border-border bg-background/95 px-4 backdrop-blur supports-[backdrop-filter]:bg-background/60",
        "lg:sticky lg:top-0",
        headerPositionClasses
      )}
    >
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          className="lg:hidden"
          onClick={onMenuClick}
        >
          <Menu className="h-5 w-5" />
        </Button>

        {/* 搜索栏 */}
        <Button
          variant="outline"
          className="hidden w-64 justify-start text-muted-foreground sm:flex"
          onClick={onSearchClick}
        >
          <Search className="mr-2 h-4 w-4" />
          <span>搜索...</span>
          <kbd className="pointer-events-none ml-auto inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground">
            <span className="text-xs">⌘</span>K
          </kbd>
        </Button>
      </div>

      <div className="flex items-center gap-2">
        {/* 搜索按钮（移动端） */}
        <Button
          variant="ghost"
          size="icon"
          className="sm:hidden"
          onClick={onSearchClick}
        >
          <Search className="h-5 w-5" />
        </Button>

        {/* 通知 */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="h-5 w-5" />
              <Badge className="absolute -right-1 -top-1 h-5 w-5 rounded-full p-0 text-xs">
                3
              </Badge>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-80">
            <DropdownMenuLabel className="flex items-center justify-between">
              <span>通知</span>
              <Link
                href="/notifications"
                onClick={(e) => {
                  e.preventDefault()
                  handleNavigate("/notifications", "通知中心")
                }}
                className="text-xs font-normal text-primary hover:underline"
              >
                查看全部
              </Link>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              asChild
              onClick={(e) => {
                e.preventDefault()
                handleNavigate("/notifications", "通知中心")
              }}
            >
              <Link href="/notifications" className="flex flex-col items-start gap-1 cursor-pointer">
                <p className="font-medium">新用户注册</p>
                <p className="text-xs text-muted-foreground">
                  用户 张三 刚刚完成注册
                </p>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem
              asChild
              onClick={(e) => {
                e.preventDefault()
                handleNavigate("/notifications", "通知中心")
              }}
            >
              <Link href="/notifications" className="flex flex-col items-start gap-1 cursor-pointer">
                <p className="font-medium">系统更新</p>
                <p className="text-xs text-muted-foreground">
                  系统将于今晚 23:00 进行维护
                </p>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem
              asChild
              onClick={(e) => {
                e.preventDefault()
                handleNavigate("/notifications", "通知中心")
              }}
            >
              <Link href="/notifications" className="flex flex-col items-start gap-1 cursor-pointer">
                <p className="font-medium">任务完成</p>
                <p className="text-xs text-muted-foreground">
                  数据备份任务已完成
                </p>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              asChild
              onClick={(e) => {
                e.preventDefault()
                handleNavigate("/notifications", "通知中心")
              }}
            >
              <Link
                href="/notifications"
                className="w-full text-center text-sm text-muted-foreground hover:text-foreground cursor-pointer justify-center"
              >
                查看所有通知
              </Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* 错误收集 */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="relative">
              <AlertTriangle className="h-5 w-5" />
              {unreadErrors > 0 && (
                <Badge className="absolute -right-1 -top-1 h-5 min-w-5 px-1.5 rounded-full p-0 text-[10px]">
                  {unreadErrors > 99 ? "99+" : unreadErrors}
                </Badge>
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-80">
            <DropdownMenuLabel className="flex items-center justify-between">
              <span>错误收集</span>
              <Button
                variant="ghost"
                size="sm"
                className="h-7 px-2 text-xs"
                onClick={handleClearErrors}
              >
                清空
              </Button>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup className="max-h-72 overflow-auto">
              {errors.length === 0 && (
                <div className="py-3 text-sm text-muted-foreground text-center">
                  暂无错误
                </div>
              )}
              {errors.map((err) => (
                <DropdownMenuItem key={err.id} className="flex items-start gap-2">
                  <div className="flex flex-col">
                    <span className="text-xs text-muted-foreground">
                      {new Date(err.timestamp).toLocaleTimeString()}
                    </span>
                    <span className="text-sm font-medium text-foreground leading-snug">
                      {err.message}
                    </span>
                    {err.detail && (
                      <span className="text-xs text-muted-foreground line-clamp-2">
                        {err.detail}
                      </span>
                    )}
                  </div>
                  <Badge variant="secondary" className="ml-auto">
                    {err.source}
                  </Badge>
                </DropdownMenuItem>
              ))}
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => {
                markErrorsRead()
              }}
              className="text-primary cursor-pointer"
            >
              标记已读
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* 界面设置 */}
        <QuickSettings />

        {/* 用户菜单 */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative h-9 w-9 rounded-full">
              <Avatar className="h-9 w-9">
                <AvatarImage src="/avatar.png" alt="用户头像" />
                <AvatarFallback>
                  {user?.name?.charAt(0) || "AD"}
                </AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium">{user?.name || "管理员"}</p>
                <p className="text-xs text-muted-foreground">
                  {user?.email || "admin@halolight.h7ml.cn"}
                </p>
              </div>
            </DropdownMenuLabel>
            {accountList.length > 0 && (
              <>
                <DropdownMenuSeparator />
                <DropdownMenuLabel className="text-xs text-muted-foreground">
                  快速切换账号
                </DropdownMenuLabel>
                <DropdownMenuGroup>
                  {accountList.map((account) => (
                    <DropdownMenuItem
                      key={account.id}
                      className="cursor-pointer gap-2"
                      onClick={() => handleSwitchAccount(account.id)}
                    >
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={account.avatar} alt={account.name} />
                        <AvatarFallback>
                          {account.name?.charAt(0) || "A"}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex flex-col">
                        <span className="text-sm font-medium leading-tight">
                          {account.name}
                        </span>
                        <span className="text-[11px] text-muted-foreground leading-tight">
                          {account.role?.label || account.role?.name} · {account.email}
                        </span>
                      </div>
                      {activeAccountId === account.id && (
                        <Badge variant="secondary" className="ml-auto">
                          当前
                        </Badge>
                      )}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuGroup>
              </>
            )}
            <DropdownMenuSeparator />
            <DropdownMenuItem
              asChild
              onClick={(e) => {
                e.preventDefault()
                handleNavigate("/profile", "个人资料")
              }}
            >
              <Link href="/profile" className="cursor-pointer">
                <User className="mr-2 h-4 w-4" />
                个人资料
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem
              asChild
              onClick={(e) => {
                e.preventDefault()
                handleNavigate("/settings", "账户设置")
              }}
            >
              <Link href="/settings" className="cursor-pointer">
                <Settings className="mr-2 h-4 w-4" />
                账户设置
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem
              asChild
              onClick={(e) => {
                e.preventDefault()
                handleNavigate("https://halolight.docs.h7ml.cn/", "帮助文档")
              }}
            >
              <Link href="https://halolight.docs.h7ml.cn/" className="cursor-pointer">
                <HelpCircle className="mr-2 h-4 w-4" />
                帮助文档
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="text-destructive cursor-pointer"
              onClick={handleLogout}
            >
              <LogOut className="mr-2 h-4 w-4" />
              退出登录
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </motion.header>
  )
}
