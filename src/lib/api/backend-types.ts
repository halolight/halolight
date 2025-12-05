/**
 * 后端 API 原始响应类型定义
 * 定义所有从 NestJS 后端接收的原始数据结构
 */

// ============================================================================
// 通用响应类型
// ============================================================================

/** 后端分页元数据 */
export interface BackendPaginationMeta {
  total: number
  page: number
  limit: number
  totalPages: number
}

/** 后端分页响应 */
export interface BackendPaginatedResponse<T> {
  data: T[]
  meta: BackendPaginationMeta
}

// ============================================================================
// 用户与权限
// ============================================================================

/** 后端用户状态（大写枚举） */
export type BackendUserStatus = "ACTIVE" | "INACTIVE" | "SUSPENDED"

/** 后端权限对象 */
export interface BackendPermission {
  id: string
  action: string
  resource: string
  description?: string
  createdAt?: string
}

/** 后端角色对象 */
export interface BackendRole {
  id: string
  name: string
  label: string
  description?: string
  permissions: BackendPermission[]
  createdAt?: string
  updatedAt?: string
}

/** 后端用户对象 */
export interface BackendUser {
  id: string
  email: string
  username?: string
  name: string
  avatar?: string
  status: BackendUserStatus
  phone?: string
  department?: string
  position?: string
  bio?: string
  roles?: BackendRole[]
  permissions?: BackendPermission[]
  createdAt?: string
  updatedAt?: string
  lastLoginAt?: string
}

/** 后端登录响应 */
export interface BackendLoginResponse {
  accessToken: string
  refreshToken: string
  user: BackendUser
}

/** 后端当前用户响应（/api/auth/me） */
export interface BackendCurrentUserResponse {
  id: string
  email: string
  username?: string
  name: string
  avatar?: string
  status: BackendUserStatus
  phone?: string
  department?: string
  position?: string
  bio?: string
  roles: BackendRole[]
  permissions: BackendPermission[]
  createdAt?: string
  updatedAt?: string
  lastLoginAt?: string
}

/** 后端用户列表分页响应 */
export type BackendUserListResponse = BackendPaginatedResponse<BackendUser>

/** 后端角色列表响应（数组形式） */
export type BackendRoleListResponse = BackendRole[]

// ============================================================================
// 认证相关
// ============================================================================

/** 后端登录请求 */
export interface BackendLoginRequest {
  email: string
  password: string
}

/** 后端注册请求 */
export interface BackendRegisterRequest {
  email: string
  username?: string
  name: string
  password: string
}

/** 后端刷新令牌响应 */
export interface BackendRefreshTokenResponse {
  accessToken: string
  refreshToken: string
}

// ============================================================================
// 用户管理
// ============================================================================

/** 后端创建用户请求 */
export interface BackendCreateUserRequest {
  email: string
  username?: string
  name: string
  password: string
  phone?: string
  department?: string
  position?: string
  bio?: string
  roleIds?: string[]
}

/** 后端更新用户请求 */
export interface BackendUpdateUserRequest {
  email?: string
  username?: string
  name?: string
  phone?: string
  avatar?: string
  department?: string
  position?: string
  bio?: string
  status?: BackendUserStatus
  roleIds?: string[]
}

/** 后端用户查询参数 */
export interface BackendUserQueryParams {
  page?: number
  limit?: number
  keyword?: string
  status?: BackendUserStatus
  roleId?: string
  sortBy?: string
  sortOrder?: "asc" | "desc"
}

// ============================================================================
// 角色管理
// ============================================================================

/** 后端创建角色请求 */
export interface BackendCreateRoleRequest {
  name: string
  label: string
  description?: string
  permissionIds: string[]
}

/** 后端更新角色请求 */
export interface BackendUpdateRoleRequest {
  name?: string
  label?: string
  description?: string
  permissionIds?: string[]
}

/** 后端角色查询参数 */
export interface BackendRoleQueryParams {
  page?: number
  limit?: number
  keyword?: string
}

// ============================================================================
// 权限管理
// ============================================================================

/** 后端权限查询响应 */
export type BackendPermissionListResponse = BackendPermission[]

/** 后端权限分组 */
export interface BackendPermissionGroup {
  group: string
  label: string
  permissions: BackendPermission[]
}
