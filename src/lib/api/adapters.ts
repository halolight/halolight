/**
 * API 类型适配器
 * 将后端 API 响应转换为前端类型
 */

import type {
  BackendCurrentUserResponse,
  BackendLoginResponse,
  BackendPaginatedResponse,
  BackendPermission,
  BackendRefreshTokenResponse,
  BackendRole,
  BackendUser,
  BackendUserStatus,
} from "./backend-types"
import type {
  AccountWithToken,
  CurrentUserResponse,
  LoginResponse,
} from "./client"
import type { ListData, Permission, Role, User, UserStatus } from "./types"

// ============================================================================
// 状态转换
// ============================================================================

/**
 * 将后端用户状态转换为前端用户状态
 * 后端使用大写枚举 (ACTIVE/INACTIVE/SUSPENDED)
 * 前端使用小写枚举 (active/inactive/suspended)
 */
export function adaptUserStatus(status: BackendUserStatus): UserStatus {
  return status.toLowerCase() as UserStatus
}

/**
 * 将前端用户状态转换为后端用户状态
 * 前端使用小写枚举 (active/inactive/suspended)
 * 后端使用大写枚举 (ACTIVE/INACTIVE/SUSPENDED)
 */
export function toBackendUserStatus(status: UserStatus): BackendUserStatus {
  return status.toUpperCase() as BackendUserStatus
}

// ============================================================================
// 权限转换
// ============================================================================

/**
 * 将后端权限对象数组转换为前端权限字符串数组
 * 前端权限格式: "resource:action" (如 "users:view")
 */
export function adaptBackendPermissions(
  permissions: BackendPermission[]
): Permission[] {
  return permissions.map((perm) => {
    const permissionString = `${perm.resource}:${perm.action}` as Permission
    return permissionString
  }) as Permission[]
}

/**
 * 将前端权限字符串解析为后端格式所需的 resource 和 action
 */
export function parsePermissionString(permission: Permission): {
  resource: string
  action: string
} {
  const [resource, action] = permission.split(":")
  return { resource, action }
}

// ============================================================================
// 角色转换
// ============================================================================

/**
 * 将后端角色对象转换为前端角色类型
 */
export function adaptBackendRole(backendRole: BackendRole): Role {
  return {
    id: backendRole.id,
    name: backendRole.name,
    label: backendRole.label,
    description: backendRole.description,
    permissions: adaptBackendPermissions(backendRole.permissions),
  }
}

/**
 * 将后端角色数组转换为前端角色数组
 */
export function adaptBackendRoles(backendRoles: BackendRole[]): Role[] {
  return backendRoles.map(adaptBackendRole)
}

// ============================================================================
// 用户转换
// ============================================================================

/**
 * 将后端用户对象转换为前端用户类型
 * 注意：后端用户可能有多个角色，前端目前只支持单一角色
 * 这里取第一个角色作为主角色
 */
export function adaptBackendUser(backendUser: BackendUser): User {
  // 如果后端没有返回角色，使用一个默认的游客角色
  const defaultRole: Role = {
    id: "guest",
    name: "guest",
    label: "访客",
    permissions: [],
  }

  // 获取第一个角色，如果没有则使用默认角色
  const primaryRole =
    backendUser.roles && backendUser.roles.length > 0
      ? adaptBackendRole(backendUser.roles[0])
      : defaultRole

  // 合并角色权限和用户直接权限
  const permissions = mergeUserPermissions(
    backendUser.roles,
    backendUser.permissions
  )

  return {
    id: backendUser.id,
    name: backendUser.name,
    email: backendUser.email,
    phone: backendUser.phone,
    avatar: backendUser.avatar,
    role: primaryRole,
    status: adaptUserStatus(backendUser.status),
    permissions,
    department: backendUser.department,
    position: backendUser.position,
    bio: backendUser.bio,
    createdAt: backendUser.createdAt || new Date().toISOString(),
    lastLoginAt: backendUser.lastLoginAt,
  }
}

/**
 * 将后端当前用户响应转换为前端用户类型
 */
export function adaptBackendCurrentUser(
  backendUser: BackendCurrentUserResponse
): User {
  const defaultRole: Role = {
    id: "guest",
    name: "guest",
    label: "访客",
    permissions: [],
  }

  const primaryRole =
    backendUser.roles && backendUser.roles.length > 0
      ? adaptBackendRole(backendUser.roles[0])
      : defaultRole

  // 合并角色权限和用户直接权限
  const permissions = mergeUserPermissions(
    backendUser.roles,
    backendUser.permissions
  )

  return {
    id: backendUser.id,
    name: backendUser.name,
    email: backendUser.email,
    phone: backendUser.phone,
    avatar: backendUser.avatar,
    role: primaryRole,
    status: adaptUserStatus(backendUser.status),
    permissions,
    department: backendUser.department,
    position: backendUser.position,
    bio: backendUser.bio,
    createdAt: backendUser.createdAt || new Date().toISOString(),
    lastLoginAt: backendUser.lastLoginAt,
  }
}

/**
 * 将后端用户数组转换为前端用户数组
 */
export function adaptBackendUsers(backendUsers: BackendUser[]): User[] {
  return backendUsers.map(adaptBackendUser)
}

// ============================================================================
// 分页数据转换
// ============================================================================

/**
 * 将后端分页响应转换为前端 ListData 格式
 */
export function adaptPaginatedResponse<TBackend, TFrontend>(
  response: BackendPaginatedResponse<TBackend>,
  adapter: (item: TBackend) => TFrontend
): ListData<TFrontend> {
  return {
    list: response.data.map(adapter),
    total: response.meta.total,
  }
}

/**
 * 将后端用户分页响应转换为前端格式
 */
export function adaptBackendUserList(
  response: BackendPaginatedResponse<BackendUser>
): ListData<User> {
  return adaptPaginatedResponse(response, adaptBackendUser)
}

/**
 * 将后端角色分页响应转换为前端格式（如果后端返回分页格式）
 */
export function adaptBackendRoleList(
  response: BackendPaginatedResponse<BackendRole>
): ListData<Role> {
  return adaptPaginatedResponse(response, adaptBackendRole)
}

// ============================================================================
// 工具函数
// ============================================================================

/**
 * 合并多个角色的权限（去重）
 * 当用户有多个角色时使用
 */
export function mergeRolePermissions(roles: BackendRole[]): Permission[] {
  const allPermissions = roles.flatMap((role) =>
    adaptBackendPermissions(role.permissions)
  )
  // 使用 Set 去重
  return Array.from(new Set(allPermissions))
}

/**
 * 合并用户的角色权限和直接权限
 * @param roles - 用户的角色列表
 * @param directPermissions - 用户的直接权限列表
 * @returns 去重后的所有权限
 */
function mergeUserPermissions(
  roles: BackendRole[] = [],
  directPermissions: BackendPermission[] = []
): Permission[] {
  const rolePermissions = mergeRolePermissions(roles)
  const selfPermissions = directPermissions.length
    ? adaptBackendPermissions(directPermissions)
    : []
  return Array.from(new Set([...rolePermissions, ...selfPermissions]))
}

/**
 * 检查用户是否拥有特定权限
 */
export function hasPermission(user: User, permission: Permission): boolean {
  return user.role.permissions.includes(permission)
}

/**
 * 检查用户是否拥有任一权限
 */
export function hasAnyPermission(
  user: User,
  permissions: Permission[]
): boolean {
  return permissions.some((perm) => user.role.permissions.includes(perm))
}

/**
 * 检查用户是否拥有所有权限
 */
export function hasAllPermissions(
  user: User,
  permissions: Permission[]
): boolean {
  return permissions.every((perm) => user.role.permissions.includes(perm))
}

// ============================================================================
// 认证相关转换
// ============================================================================

/**
 * 将后端登录响应转换为前端登录响应格式
 */
export function adaptBackendLoginResponse(
  response: BackendLoginResponse
): LoginResponse {
  const user = adaptBackendUser(response.user)
  const accountWithToken: AccountWithToken = {
    ...user,
    token: response.accessToken,
  }

  return {
    user: accountWithToken,
    token: response.accessToken,
    expiresIn: 86400, // 24小时，实际应该从后端JWT payload获取
    accounts: [accountWithToken], // 单账号模式，多账号需要后端支持
  }
}

/**
 * 将后端当前用户响应转换为前端当前用户响应格式
 */
export function adaptBackendCurrentUserResponse(
  response: BackendCurrentUserResponse
): CurrentUserResponse {
  const user = adaptBackendCurrentUser(response)
  const accountWithToken: AccountWithToken = {
    ...user,
    token: "", // token 由 Cookie 管理，这里不需要
  }

  return {
    user: accountWithToken,
    accounts: [accountWithToken],
  }
}

/**
 * 适配刷新Token响应
 */
export function adaptBackendRefreshResponse(response: BackendRefreshTokenResponse): {
  accessToken: string
  refreshToken: string
} {
  return {
    accessToken: response.accessToken,
    refreshToken: response.refreshToken,
  }
}
