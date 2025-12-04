"use client"

import * as React from "react"

import type { AccountWithToken } from "@/lib/api/client"
import { mockRoles } from "@/lib/api/mock-data"
import type { Permission, Role } from "@/lib/api/types"
import { useAuthStore } from "@/stores/auth-store"

// 权限上下文
interface PermissionContextType {
  permissions: Permission[]
  role: Role | null
  activeAccount: AccountWithToken | null
  hasPermission: (permission: Permission) => boolean
  hasAnyPermission: (permissions: Permission[]) => boolean
  hasAllPermissions: (permissions: Permission[]) => boolean
}

const PermissionContext = React.createContext<PermissionContextType | null>(null)

export function PermissionProvider({ children }: { children: React.ReactNode }) {
  const { user, accounts, activeAccountId } = useAuthStore()

  const activeAccount = React.useMemo<AccountWithToken | null>(() => {
    if (activeAccountId) {
      return (
        accounts.find((account) => account.id === activeAccountId) ?? user ?? null
      )
    }
    return user ?? accounts[0] ?? null
  }, [accounts, activeAccountId, user])

  const role = React.useMemo(() => {
    const currentRole = activeAccount?.role
    if (!currentRole) return null

    return typeof currentRole === "string"
      ? mockRoles.find((r) => r.id === currentRole) || null
      : currentRole
  }, [activeAccount])

  const permissionSet = React.useMemo(
    () => new Set<string>(role?.permissions ?? []),
    [role]
  )

  const permissions = React.useMemo(
    () => (role?.permissions ?? []) as Permission[],
    [role]
  )

  const hasPermission = React.useCallback(
    (permission: Permission) => {
      if (permissionSet.has("*")) return true
      if (permissionSet.has(permission)) return true

      const [resource] = permission.split(":")
      return permissionSet.has(`${resource}:*`)
    },
    [permissionSet]
  )

  const hasAnyPermission = React.useCallback(
    (perms: Permission[]) => perms.some((p) => hasPermission(p)),
    [hasPermission]
  )

  const hasAllPermissions = React.useCallback(
    (perms: Permission[]) => perms.every((p) => hasPermission(p)),
    [hasPermission]
  )

  return (
    <PermissionContext.Provider
      value={{
        permissions,
        role,
        activeAccount,
        hasPermission,
        hasAnyPermission,
        hasAllPermissions,
      }}
    >
      {children}
    </PermissionContext.Provider>
  )
}

// Hook: 使用权限
export function usePermission() {
  const context = React.useContext(PermissionContext)
  if (!context) {
    throw new Error("usePermission must be used within PermissionProvider")
  }
  return context
}

// 权限守卫组件
interface PermissionGuardProps {
  permission?: Permission
  permissions?: Permission[]
  mode?: "any" | "all"
  fallback?: React.ReactNode
  children: React.ReactNode
}

export function PermissionGuard({
  permission,
  permissions,
  mode = "any",
  fallback = null,
  children,
}: PermissionGuardProps) {
  const { hasPermission, hasAnyPermission, hasAllPermissions } = usePermission()

  const hasAccess = React.useMemo(() => {
    if (permission) {
      return hasPermission(permission)
    }
    if (permissions) {
      return mode === "all"
        ? hasAllPermissions(permissions)
        : hasAnyPermission(permissions)
    }
    return true
  }, [permission, permissions, mode, hasPermission, hasAnyPermission, hasAllPermissions])

  if (!hasAccess) {
    return <>{fallback}</>
  }

  return <>{children}</>
}

// HOC: 高阶组件包装权限检查
export function withPermission<P extends object>(
  Component: React.ComponentType<P>,
  permission: Permission,
  Fallback?: React.ComponentType
) {
  return function PermissionWrappedComponent(props: P) {
    return (
      <PermissionGuard
        permission={permission}
        fallback={Fallback ? <Fallback /> : null}
      >
        <Component {...props} />
      </PermissionGuard>
    )
  }
}
