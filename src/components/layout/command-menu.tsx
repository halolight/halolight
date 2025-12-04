"use client"

import {
  BarChart3,
  Calendar,
  FileText,
  FolderOpen,
  LayoutDashboard,
  LogOut,
  Mail,
  Moon,
  Search,
  Settings,
  ShieldCheck,
  Sun,
  UserCheck,
  Users,
} from "lucide-react"
import { usePathname, useRouter } from "next/navigation"
import { useTheme } from "next-themes"
import * as React from "react"

import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from "@/components/ui/command"
import { CommandInputClear } from "@/components/ui/command-input-clear"
import type { Permission } from "@/lib/api/types"
import { usePermission } from "@/providers/permission-provider"
import { useAuthStore } from "@/stores/auth-store"
import { useNavigationStore } from "@/stores/navigation-store"

interface CommandMenuProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

const permissionByPath: Record<string, Permission> = {
  "/": "dashboard:view",
  "/users": "users:view",
  "/analytics": "analytics:view",
  "/documents": "documents:view",
  "/files": "files:view",
  "/messages": "messages:view",
  "/calendar": "calendar:view",
  "/notifications": "notifications:view",
  "/settings": "settings:view",
  "/accounts": "settings:view",
  "/docs": "documents:view",
}

export function CommandMenu({ open, onOpenChange }: CommandMenuProps) {
  const router = useRouter()
  const pathname = usePathname()
  const { setTheme } = useTheme()
  const { logout, accounts, activeAccountId, switchAccount } = useAuthStore()
  const { hasPermission } = usePermission()
  const startNavigation = useNavigationStore((state) => state.startNavigation)

  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        onOpenChange(!open)
      }
    }
    document.addEventListener("keydown", down)
    return () => document.removeEventListener("keydown", down)
  }, [open, onOpenChange])

  const runCommand = React.useCallback(
    (command: () => void | Promise<void>) => {
      onOpenChange(false)
      void command()
    },
    [onOpenChange]
  )

  const navigateTo = React.useCallback(
    (path: string, label: string) => {
      const required = permissionByPath[path]
      if (required && !hasPermission(required)) {
        return
      }
      if (pathname === path) {
        onOpenChange(false)
        return
      }
      startNavigation({ path, label, source: "command" })
      onOpenChange(false)
      router.push(path)
    },
    [hasPermission, onOpenChange, pathname, router, startNavigation]
  )

  return (
    <CommandDialog open={open} onOpenChange={onOpenChange} showCloseButton={false}>
      <CommandInputClear placeholder="输入命令或搜索..." />
      <CommandList>
          <CommandEmpty>未找到结果</CommandEmpty>
          <CommandGroup heading="导航">
            <CommandItem
              disabled={!hasPermission("dashboard:view")}
              onSelect={() => navigateTo("/", "仪表盘")}
            >
              <LayoutDashboard className="mr-2 h-4 w-4" />
              仪表盘
            </CommandItem>
            <CommandItem
              disabled={!hasPermission("users:view")}
              onSelect={() => navigateTo("/users", "用户管理")}
            >
              <Users className="mr-2 h-4 w-4" />
              用户管理
            </CommandItem>
            <CommandItem
              disabled={!hasPermission("analytics:view")}
              onSelect={() => navigateTo("/analytics", "数据分析")}
            >
              <BarChart3 className="mr-2 h-4 w-4" />
              数据分析
            </CommandItem>
            <CommandItem
              disabled={!hasPermission("documents:view")}
              onSelect={() => navigateTo("/documents", "文档管理")}
            >
              <FileText className="mr-2 h-4 w-4" />
              文档管理
            </CommandItem>
            <CommandItem
              disabled={!hasPermission("files:view")}
              onSelect={() => navigateTo("/files", "文件存储")}
            >
              <FolderOpen className="mr-2 h-4 w-4" />
              文件存储
            </CommandItem>
            <CommandItem
              disabled={!hasPermission("messages:view")}
              onSelect={() => navigateTo("/messages", "消息中心")}
            >
              <Mail className="mr-2 h-4 w-4" />
              消息中心
            </CommandItem>
            <CommandItem
              disabled={!hasPermission("calendar:view")}
              onSelect={() => navigateTo("/calendar", "日程安排")}
            >
              <Calendar className="mr-2 h-4 w-4" />
              日程安排
            </CommandItem>
            <CommandItem
              disabled={!hasPermission("settings:view")}
              onSelect={() => navigateTo("/accounts", "账号与权限")}
            >
              <ShieldCheck className="mr-2 h-4 w-4" />
              账号与权限
            </CommandItem>
            <CommandItem
              disabled={!hasPermission("settings:view")}
              onSelect={() => navigateTo("/settings", "系统设置")}
            >
              <Settings className="mr-2 h-4 w-4" />
              系统设置
            </CommandItem>
          </CommandGroup>
          <CommandSeparator />
          <CommandGroup heading="主题">
            <CommandItem onSelect={() => runCommand(() => setTheme("light"))}>
              <Sun className="mr-2 h-4 w-4" />
              浅色模式
            </CommandItem>
            <CommandItem onSelect={() => runCommand(() => setTheme("dark"))}>
              <Moon className="mr-2 h-4 w-4" />
              深色模式
            </CommandItem>
          </CommandGroup>
          <CommandSeparator />
          <CommandGroup heading="账号">
            {accounts.length === 0 && (
              <CommandItem disabled>暂无可切换的账号</CommandItem>
            )}
            {accounts.map((account) => (
              <CommandItem
                key={account.id}
                onSelect={() =>
                  runCommand(async () => {
                    if (account.id === activeAccountId) return
                    await switchAccount(account.id)
                  })
                }
              >
                <UserCheck className="mr-2 h-4 w-4" />
                切换为 {account.name}
                {activeAccountId === account.id && (
                  <CommandShortcut>当前</CommandShortcut>
                )}
              </CommandItem>
            ))}
          </CommandGroup>
          <CommandSeparator />
          <CommandGroup heading="操作">
            <CommandItem onSelect={() => runCommand(() => console.log("全局搜索"))}>
              <Search className="mr-2 h-4 w-4" />
              全局搜索
              <CommandShortcut>⌘F</CommandShortcut>
            </CommandItem>
            <CommandItem
              onSelect={() =>
                runCommand(async () => {
                  await logout()
                  router.push("/login")
                })
              }
            >
              <LogOut className="mr-2 h-4 w-4" />
              退出登录
              <CommandShortcut>⌘Q</CommandShortcut>
            </CommandItem>
          </CommandGroup>
      </CommandList>
    </CommandDialog>
  )
}
