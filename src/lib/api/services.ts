// API 服务基础配置
import {
  adaptBackendCurrentUser,
  adaptBackendRole,
  adaptBackendUser,
  adaptBackendUserList,
} from "./adapters"
import type {
  BackendCurrentUserResponse,
  BackendPaginatedResponse,
  BackendRole,
  BackendUser,
} from "./backend-types"
import { tokenStorage } from "./client"
import type {
  Activity,
  CalendarEvent,
  Conversation,
  DashboardStats,
  Document,
  FileItem,
  Folder,
  FolderCreateRequest,
  FolderUpdateRequest,
  ListData,
  LoginResponse,
  Message,
  Notification,
  Order,
  Product,
  Role,
  RoleCreateRequest,
  RoleDetail,
  RoleUpdateRequest,
  SalesData,
  StorageInfo,
  SystemOverview,
  Team,
  TeamCreateRequest,
  TeamUpdateRequest,
  User,
  VisitData,
} from "./types"

// ============================================================================
// 环境配置
// ============================================================================

const IS_MOCK_MODE = process.env.NEXT_PUBLIC_MOCK === "true"

/**
 * API 基础 URL 配置
 * - Mock 模式: /api（使用 Next.js 路由代理）
 * - 真实模式: 去除末尾的 /api 避免重复，然后拼接 /api
 */
const NORMALIZED_API_BASE = (
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000"
).replace(/\/api\/?$/, "")

const API_BASE = IS_MOCK_MODE ? "/api" : `${NORMALIZED_API_BASE}/api`

// ============================================================================
// 通用请求封装
// ============================================================================

/**
 * 通用 Fetch 请求封装
 * 注意：此函数主要用于非认证相关的简单请求
 * 对于需要 token 刷新的复杂场景，建议使用 apiClient（axios）
 */
async function request<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const url = `${API_BASE}${endpoint}`

  // 构建请求头
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  }

  // 合并自定义请求头
  if (options.headers) {
    Object.assign(headers, options.headers)
  }

  // 真实模式下添加 Authorization 头
  if (!IS_MOCK_MODE) {
    const token = tokenStorage.getAccessToken()
    if (token) {
      headers.Authorization = `Bearer ${token}`
    }
  }

  const response = await fetch(url, {
    ...options,
    headers,
  })

  if (!response.ok) {
    throw new Error(`HTTP ${response.status}: ${response.statusText}`)
  }

  const data = await response.json()

  // Mock 模式：支持包装和非包装两种格式
  if (IS_MOCK_MODE) {
    // 检查是否为包装格式
    if (typeof data === "object" && data && "code" in data && "data" in data) {
      if (data.code !== 200) {
        throw new Error((data as { message?: string }).message || "请求失败")
      }
      return (data as { data: T }).data
    }
    // 直接返回数据（非包装格式）
    return data as T
  }

  // 真实 API 模式：直接返回数据
  // 后端返回格式可能是：
  // 1. 直接返回实体对象 (如 User, Document 等)
  // 2. 分页格式 { data: [], meta: { total, page, limit } }
  return data as T
}

// ============================================================================
// 查询参数映射
// ============================================================================

/**
 * 将前端查询参数转换为后端命名
 * pageSize -> limit, keyword -> search
 */
function mapQueryParams(params?: {
  page?: number
  pageSize?: number
  keyword?: string
  status?: string
  role?: string
  type?: string
  search?: string
  [key: string]: string | number | boolean | undefined
}): string {
  if (!params) return ""

  const query = new URLSearchParams()

  Object.entries(params).forEach(([key, value]) => {
    if (value === undefined) return

    // 参数名称映射
    let mappedKey = key
    if (key === "pageSize") mappedKey = "limit"
    if (key === "keyword") mappedKey = "search"

    query.set(mappedKey, String(value))
  })

  return query.toString()
}

// ============================================================================
// 用户相关 API
// ============================================================================

export const userService = {
  /**
   * 获取用户列表
   */
  getUsers: async (params?: {
    page?: number
    pageSize?: number
    keyword?: string
    status?: string
    role?: string
  }): Promise<ListData<User>> => {
    const query = mapQueryParams(params)
    const endpoint = `/users${query ? `?${query}` : ""}`

    if (IS_MOCK_MODE) {
      return request<ListData<User>>(endpoint)
    }

    // 真实模式：使用适配器转换后端分页响应
    const response =
      await request<BackendPaginatedResponse<BackendUser>>(endpoint)
    return adaptBackendUserList(response)
  },

  /**
   * 获取单个用户
   */
  getUser: async (id: string): Promise<User> => {
    if (IS_MOCK_MODE) {
      return request<User>(`/users/${id}`)
    }

    // 真实模式：使用适配器转换后端用户
    const backendUser = await request<BackendUser>(`/users/${id}`)
    // 使用 adaptBackendUser 而非 adaptBackendCurrentUser
    // 因为 getUser 返回的可能没有 permissions 字段（非当前用户）
    return adaptBackendUser(backendUser)
  },

  /**
   * 创建用户
   */
  createUser: (data: Partial<User>) =>
    request<User>("/users", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  /**
   * 更新用户
   */
  updateUser: (id: string, data: Partial<User>) =>
    request<User>(`/users/${id}`, {
      method: "PATCH",
      body: JSON.stringify(data),
    }),

  /**
   * 删除用户
   */
  deleteUser: (id: string) =>
    request<void>(`/users/${id}`, { method: "DELETE" }),

  /**
   * 更新用户状态
   * 后端期望大写状态值: ACTIVE, INACTIVE, SUSPENDED
   */
  updateUserStatus: (id: string, status: "active" | "inactive" | "suspended") =>
    request<User>(`/users/${id}/status`, {
      method: "PATCH",
      body: JSON.stringify({ status: status.toUpperCase() }),
    }),

  /**
   * 批量删除用户
   */
  batchDeleteUsers: (ids: string[]) =>
    request<void>("/users/batch-delete", {
      method: "POST",
      body: JSON.stringify({ ids }),
    }),

  /**
   * 登录（已废弃，请使用 authApi.login）
   * @deprecated 使用 authApi.login 代替
   */
  login: (email: string, password: string) =>
    request<LoginResponse>("/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    }),

  /**
   * 获取当前用户（已废弃，请使用 authApi.getCurrentUser）
   * @deprecated 使用 authApi.getCurrentUser 代替
   */
  getCurrentUser: async (): Promise<User | null> => {
    if (IS_MOCK_MODE) {
      const user = await request<User>("/user/current")
      return user
    }

    // 真实模式：使用适配器转换
    // /auth/me 返回 BackendCurrentUserResponse（包含必需的 permissions 字段）
    const backendUser = await request<BackendCurrentUserResponse>("/auth/me")
    return adaptBackendCurrentUser(backendUser)
  },

  /**
   * 获取角色列表
   */
  getRoles: async (): Promise<Role[]> => {
    if (IS_MOCK_MODE) {
      return request<Role[]>("/roles")
    }

    // 真实模式：使用适配器转换后端角色
    const backendRoles = await request<BackendRole[]>("/roles")
    return backendRoles.map(adaptBackendRole)
  },
}

// 仪表盘相关 API
export const dashboardService = {
  // 获取统计数据
  getStats: () => request<DashboardStats>("/dashboard/stats"),

  // 获取访问趋势
  getVisits: () => request<VisitData[]>("/dashboard/visits"),

  // 获取销售趋势
  getSales: () => request<SalesData[]>("/dashboard/sales"),

  // 获取热门产品
  getProducts: () => request<Product[]>("/dashboard/products"),

  // 获取最近订单
  getOrders: () => request<Order[]>("/dashboard/orders"),

  // 获取用户活动
  getActivities: () => request<Activity[]>("/dashboard/activities"),

  // 获取系统概览
  getOverview: () => request<SystemOverview>("/dashboard/overview"),
}

// 通知相关 API
export const notificationService = {
  // 获取通知列表
  getNotifications: () => request<Notification[]>("/notifications"),

  // 获取未读数量
  getUnreadCount: () => request<{ count: number }>("/notifications/unread-count"),

  // 标记已读
  markAsRead: (id: string) =>
    request<void>(`/notifications/${id}/read`, { method: "PUT" }),

  // 标记全部已读
  markAllAsRead: () =>
    request<void>("/notifications/read-all", { method: "PUT" }),

  // 删除通知
  deleteNotification: (id: string) =>
    request<void>(`/notifications/${id}`, { method: "DELETE" }),
}

// 文档相关 API
export const documentService = {
  // 获取文档列表
  getDocuments: async (params?: {
    page?: number
    pageSize?: number
    type?: string
    folder?: string
    search?: string
  }): Promise<ListData<Document>> => {
    const query = mapQueryParams(params)
    const endpoint = `/documents${query ? `?${query}` : ""}`

    if (IS_MOCK_MODE) {
      // Mock 模式返回数组
      const docs = await request<Document[]>(endpoint)
      return { list: docs, total: docs.length }
    }

    // 真实模式：后端返回 { data: [], meta: { total, page, limit } }
    const response = await request<{ data: Document[]; meta: { total: number } }>(endpoint)
    return { list: response.data, total: response.meta.total }
  },

  // 获取单个文档
  getDocument: (id: string) => request<Document>(`/documents/${id}`),

  // 创建文档
  createDocument: (data: Partial<Document>) =>
    request<Document>("/documents", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  // 更新文档
  updateDocument: (id: string, data: Partial<Document>) =>
    request<Document>(`/documents/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    }),

  // 删除文档
  deleteDocument: (id: string) =>
    request<void>(`/documents/${id}`, { method: "DELETE" }),

  // 分享文档
  shareDocument: (id: string, payload?: { userIds?: string[]; public?: boolean }) =>
    request<void>(`/documents/${id}/share`, {
      method: "POST",
      body: JSON.stringify(payload || {}),
    }),

  // 取消分享
  unshareDocument: (id: string) =>
    request<void>(`/documents/${id}/unshare`, {
      method: "POST",
    }),

  // 移动文档到文件夹
  moveDocument: (id: string, folder: string) =>
    request<void>(`/documents/${id}/move`, {
      method: "POST",
      body: JSON.stringify({ folder }),
    }),

  // 更新文档标签
  updateDocumentTags: (id: string, tags: string[]) =>
    request<void>(`/documents/${id}/tags`, {
      method: "POST",
      body: JSON.stringify({ tags }),
    }),

  // 重命名文档
  renameDocument: (id: string, title: string) =>
    request<Document>(`/documents/${id}/rename`, {
      method: "PATCH",
      body: JSON.stringify({ title }),
    }),

  // 批量删除文档
  batchDeleteDocuments: (ids: string[]) =>
    request<void>("/documents/batch-delete", {
      method: "POST",
      body: JSON.stringify({ ids }),
    }),
}

// 消息相关 API
export const messageService = {
  // 获取会话列表
  getConversations: () => request<Conversation[]>("/messages/conversations"),

  // 获取消息历史
  getMessages: (conversationId: string) =>
    request<Message[]>(`/messages/${conversationId}`),

  // 发送消息
  sendMessage: (conversationId: string, content: string, type: string = "text") =>
    request<Message>("/messages/send", {
      method: "POST",
      body: JSON.stringify({ conversationId, content, type }),
    }),

  // 标记已读
  markConversationRead: (conversationId: string) =>
    request<void>(`/messages/${conversationId}/read`, { method: "PUT" }),

  // 删除会话
  deleteConversation: (conversationId: string) =>
    request<void>(`/messages/${conversationId}`, { method: "DELETE" }),
}

// 日历相关 API
export const calendarService = {
  // 获取事件列表
  getEvents: (start?: string, end?: string) => {
    const params = new URLSearchParams()
    if (start) params.set("start", start)
    if (end) params.set("end", end)
    const query = params.toString()
    return request<CalendarEvent[]>(`/calendar/events${query ? `?${query}` : ""}`)
  },

  // 获取单个事件
  getEvent: (id: string) => request<CalendarEvent>(`/calendar/events/${id}`),

  // 创建事件
  createEvent: (data: Partial<CalendarEvent>) =>
    request<CalendarEvent>("/calendar/events", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  // 更新事件
  updateEvent: (id: string, data: Partial<CalendarEvent>) =>
    request<CalendarEvent>(`/calendar/events/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    }),

  // 删除事件
  deleteEvent: (id: string) =>
    request<void>(`/calendar/events/${id}`, { method: "DELETE" }),

  // 添加参与者
  addAttendees: (id: string, attendeeIds: string[]) =>
    request<void>(`/calendar/events/${id}/attendees`, {
      method: "POST",
      body: JSON.stringify({ attendeeIds }),
    }),

  // 移除参与者
  removeAttendee: (eventId: string, attendeeId: string) =>
    request<void>(`/calendar/events/${eventId}/attendees/${attendeeId}`, {
      method: "DELETE",
    }),

  // 重新安排事件时间
  rescheduleEvent: (id: string, data: { start: string; end: string }) =>
    request<CalendarEvent>(`/calendar/events/${id}/reschedule`, {
      method: "PATCH",
      body: JSON.stringify(data),
    }),

  // 批量删除事件
  batchDeleteEvents: (ids: string[]) =>
    request<void>("/calendar/events/batch-delete", {
      method: "POST",
      body: JSON.stringify({ ids }),
    }),
}

// 文件相关 API
export const fileService = {
  // 获取文件列表
  getFiles: async (params?: {
    path?: string
    page?: number
    pageSize?: number
    type?: string
    search?: string
  }): Promise<ListData<FileItem>> => {
    const query = mapQueryParams(params)
    const endpoint = `/files${query ? `?${query}` : ""}`

    if (IS_MOCK_MODE) {
      const files = await request<FileItem[]>(endpoint)
      return { list: files, total: files.length }
    }

    // 真实模式：后端返回 { data: [], meta: { total, page, limit } }
    const response = await request<{ data: FileItem[]; meta: { total: number } }>(endpoint)
    return { list: response.data, total: response.meta.total }
  },

  // 获取存储空间信息
  getStorage: () => request<StorageInfo>("/files/storage"),

  // 获取存储空间信息（别名）
  getStorageInfo: () => request<StorageInfo>("/files/storage-info"),

  // 上传文件
  uploadFile: async (file: File, path?: string): Promise<FileItem> => {
    const formData = new FormData()
    formData.append("file", file)
    if (path) formData.append("path", path)

    const url = `${API_BASE}/files/upload`

    // 构建请求头（不设置 Content-Type，让浏览器自动设置 multipart/form-data）
    const headers: Record<string, string> = {}
    if (!IS_MOCK_MODE) {
      const token = tokenStorage.getAccessToken()
      if (token) {
        headers.Authorization = `Bearer ${token}`
      }
    }

    const response = await fetch(url, {
      method: "POST",
      body: formData,
      headers,
    })

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`)
    }

    const data = await response.json()

    if (IS_MOCK_MODE) {
      if (typeof data === "object" && data && "code" in data && "data" in data) {
        if (data.code !== 200) {
          throw new Error((data as { message?: string }).message || "上传失败")
        }
        return (data as { data: FileItem }).data
      }
      return data as FileItem
    }

    return data as FileItem
  },

  // 创建文件夹
  createFolder: (name: string, path?: string) =>
    request<FileItem>("/files/folder", {
      method: "POST",
      body: JSON.stringify({ name, path }),
    }),

  // 删除文件
  deleteFile: (id: string) =>
    request<void>(`/files/${id}`, { method: "DELETE" }),

  // 移动文件
  moveFile: (id: string, targetPath: string) =>
    request<FileItem>(`/files/${id}/move`, {
      method: "POST",
      body: JSON.stringify({ targetPath }),
    }),

  // 重命名文件
  renameFile: (id: string, name: string) =>
    request<FileItem>(`/files/${id}/rename`, {
      method: "PATCH",
      body: JSON.stringify({ name }),
    }),

  // 复制文件
  copyFile: (id: string, targetPath: string) =>
    request<FileItem>(`/files/${id}/copy`, {
      method: "POST",
      body: JSON.stringify({ targetPath }),
    }),

  // 切换收藏状态
  toggleFavorite: (id: string, favorite?: boolean) =>
    request<FileItem>(`/files/${id}/favorite`, {
      method: "PATCH",
      body: favorite !== undefined ? JSON.stringify({ favorite }) : undefined,
    }),

  // 分享文件
  shareFile: (id: string, payload?: { userIds?: string[]; public?: boolean }) =>
    request<void>(`/files/${id}/share`, {
      method: "POST",
      body: JSON.stringify(payload || {}),
    }),

  // 获取文件下载链接
  getDownloadUrl: (id: string) =>
    request<{ url: string }>(`/files/${id}/download-url`),

  // 批量删除文件
  batchDeleteFiles: (ids: string[]) =>
    request<void>("/files/batch-delete", {
      method: "POST",
      body: JSON.stringify({ ids }),
    }),
}

// 团队相关 API
export const teamService = {
  // 获取团队列表
  getTeams: async (params?: {
    page?: number
    pageSize?: number
    search?: string
  }): Promise<ListData<Team>> => {
    const query = mapQueryParams(params)
    const endpoint = `/teams${query ? `?${query}` : ""}`

    if (IS_MOCK_MODE) {
      const teams = await request<Team[]>(endpoint)
      return { list: teams, total: teams.length }
    }

    // 真实模式：后端返回 { data: [], meta: { total, page, limit } }
    const response = await request<{ data: Team[]; meta: { total: number } }>(endpoint)
    return { list: response.data, total: response.meta.total }
  },

  // 获取单个团队
  getTeam: (id: string) => request<Team>(`/teams/${id}`),

  // 创建团队
  createTeam: (data: TeamCreateRequest) =>
    request<Team>("/teams", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  // 更新团队
  updateTeam: (id: string, data: TeamUpdateRequest) =>
    request<Team>(`/teams/${id}`, {
      method: "PATCH",
      body: JSON.stringify(data),
    }),

  // 删除团队
  deleteTeam: (id: string) =>
    request<void>(`/teams/${id}`, { method: "DELETE" }),

  // 添加成员
  addMember: (teamId: string, userId: string, role: "admin" | "member" = "member") =>
    request<void>(`/teams/${teamId}/members`, {
      method: "POST",
      body: JSON.stringify({ userId, role }),
    }),

  // 移除成员
  removeMember: (teamId: string, userId: string) =>
    request<void>(`/teams/${teamId}/members/${userId}`, { method: "DELETE" }),
}

// 角色相关 API（扩展）
export const roleService = {
  // 获取角色列表
  getRoles: () => request<RoleDetail[]>("/roles"),

  // 获取单个角色
  getRole: (id: string) => request<RoleDetail>(`/roles/${id}`),

  // 创建角色
  createRole: (data: RoleCreateRequest) =>
    request<RoleDetail>("/roles", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  // 更新角色
  updateRole: (id: string, data: RoleUpdateRequest) =>
    request<RoleDetail>(`/roles/${id}`, {
      method: "PATCH",
      body: JSON.stringify(data),
    }),

  // 删除角色
  deleteRole: (id: string) =>
    request<void>(`/roles/${id}`, { method: "DELETE" }),

  // 获取所有权限列表
  getPermissions: () => request<Array<{ key: string; label: string; group: string }>>("/permissions"),

  // 为角色分配权限
  assignPermissions: (roleId: string, permissionIds: string[]) =>
    request<void>(`/roles/${roleId}/permissions`, {
      method: "POST",
      body: JSON.stringify({ permissionIds }),
    }),
}

// 权限相关 API
export const permissionService = {
  // 获取所有权限
  getPermissions: () =>
    request<Array<{ id: string; action: string; resource: string; description?: string }>>("/permissions"),

  // 获取单个权限
  getPermission: (id: string) =>
    request<{ id: string; action: string; resource: string; description?: string }>(`/permissions/${id}`),

  // 创建权限
  createPermission: (data: { action: string; resource: string; description?: string }) =>
    request<{ id: string; action: string; resource: string; description?: string }>("/permissions", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  // 删除权限
  deletePermission: (id: string) =>
    request<void>(`/permissions/${id}`, { method: "DELETE" }),
}

// 文件夹相关 API
export const folderService = {
  // 获取文件夹列表
  getFolders: (parentId?: string) => {
    const query = parentId ? `?parentId=${parentId}` : ""
    return request<Folder[]>(`/folders${query}`)
  },

  // 获取单个文件夹
  getFolder: (id: string) => request<Folder>(`/folders/${id}`),

  // 创建文件夹
  createFolder: (data: FolderCreateRequest) =>
    request<Folder>("/folders", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  // 更新文件夹
  updateFolder: (id: string, data: FolderUpdateRequest) =>
    request<Folder>(`/folders/${id}`, {
      method: "PATCH",
      body: JSON.stringify(data),
    }),

  // 删除文件夹
  deleteFolder: (id: string) =>
    request<void>(`/folders/${id}`, { method: "DELETE" }),
}

// 重新导出类型供外部使用
export type {
  Activity,
  CalendarEvent,
  Conversation,
  DashboardStats,
  Document,
  FileItem,
  Folder,
  FolderCreateRequest,
  FolderUpdateRequest,
  ListData,
  LoginResponse,
  Message,
  Notification,
  Order,
  Product,
  Role,
  RoleDetail,
  SalesData,
  StorageInfo,
  SystemOverview,
  Team,
  User,
  VisitData,
} from "./types"
