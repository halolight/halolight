/**
 * API Router - 统一的数据访问层
 *
 * 根据 NEXT_PUBLIC_MOCK 环境变量自动切换 Mock API 和真实 API。
 * Server Actions 和 React Query hooks 都通过此 router 获取数据，
 * 确保 Mock 模式在服务端和客户端都能正常工作。
 */

import { tokenStorage } from "./client"
import {
  calendarApi,
  documentApi,
  messageApi,
  notificationApi,
  roleApi,
  userApi,
} from "./mock-api"
import type {
  ApiResponse,
  CalendarEvent,
  Document,
  Message,
  Notification,
  PaginatedResponse,
  Role,
  User,
} from "./types"

// ============================================================================
// 类型定义
// ============================================================================

export interface ApiRouter {
  user: {
    getUsers: (params?: {
      page?: number
      pageSize?: number
      search?: string
      status?: string
      role?: string
    }) => Promise<PaginatedResponse<User>>
    getUser: (id: string) => Promise<ApiResponse<User | null>>
    createUser: (
      data: Omit<User, "id" | "createdAt" | "lastLoginAt">
    ) => Promise<ApiResponse<User>>
    updateUser: (id: string, data: Partial<User>) => Promise<ApiResponse<User | null>>
    deleteUser: (id: string) => Promise<ApiResponse<null>>
  }
  role: {
    getRoles: () => Promise<ApiResponse<Role[]>>
    getRole: (id: string) => Promise<ApiResponse<Role | null>>
  }
  document: {
    getDocuments: (params?: {
      page?: number
      pageSize?: number
      type?: string
      search?: string
    }) => Promise<PaginatedResponse<Document>>
    getDocument: (id: string) => Promise<ApiResponse<Document | null>>
  }
  notification: {
    getNotifications: (params?: {
      page?: number
      pageSize?: number
      type?: string
      read?: boolean
    }) => Promise<PaginatedResponse<Notification>>
    getUnreadCount: () => Promise<ApiResponse<number>>
    markAsRead: (id: string) => Promise<ApiResponse<null>>
    markAllAsRead: () => Promise<ApiResponse<null>>
    deleteNotification: (id: string) => Promise<ApiResponse<null>>
  }
  calendar: {
    getEvents: () => Promise<ApiResponse<CalendarEvent[]>>
    createEvent: (
      data: Omit<CalendarEvent, "id">
    ) => Promise<ApiResponse<CalendarEvent>>
    updateEvent: (
      id: string,
      data: Partial<CalendarEvent>
    ) => Promise<ApiResponse<CalendarEvent | null>>
    deleteEvent: (id: string) => Promise<ApiResponse<null>>
  }
  message: {
    getMessages: (params?: {
      page?: number
      pageSize?: number
    }) => Promise<PaginatedResponse<Message>>
    getUnreadCount: () => Promise<ApiResponse<number>>
    sendMessage: (content: string) => Promise<ApiResponse<Message>>
  }
}

// ============================================================================
// Mock API 实现
// ============================================================================

const mockApiRouter: ApiRouter = {
  user: {
    getUsers: userApi.getUsers,
    getUser: userApi.getUser,
    createUser: userApi.createUser,
    updateUser: userApi.updateUser,
    deleteUser: userApi.deleteUser,
  },
  role: {
    getRoles: roleApi.getRoles,
    getRole: roleApi.getRole,
  },
  document: {
    getDocuments: documentApi.getDocuments,
    getDocument: documentApi.getDocument,
  },
  notification: {
    getNotifications: notificationApi.getNotifications,
    getUnreadCount: notificationApi.getUnreadCount,
    markAsRead: notificationApi.markAsRead,
    markAllAsRead: notificationApi.markAllAsRead,
    deleteNotification: notificationApi.deleteNotification,
  },
  calendar: {
    getEvents: calendarApi.getEvents,
    createEvent: calendarApi.createEvent,
    updateEvent: calendarApi.updateEvent,
    deleteEvent: calendarApi.deleteEvent,
  },
  message: {
    getMessages: messageApi.getMessages,
    getUnreadCount: messageApi.getUnreadCount,
    sendMessage: messageApi.sendMessage,
  },
}

// ============================================================================
// Real API 实现（通过 fetch 调用后端）
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

/**
 * 将前端查询参数转换为后端命名
 * pageSize -> limit, keyword -> search
 */
function mapQueryParams(params?: Record<string, string | number | boolean | undefined>): string {
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

/**
 * 转换用户状态从后端格式到前端格式
 */
function transformUserStatus(status: string): string {
  const statusMap: Record<string, string> = {
    ACTIVE: "active",
    INACTIVE: "inactive",
    SUSPENDED: "suspended",
  }
  return statusMap[status] || status.toLowerCase()
}

/**
 * 转换用户数据从后端格式到前端格式
 */
function transformUser(user: Record<string, unknown>): Record<string, unknown> {
  return {
    ...user,
    status: transformUserStatus(user.status as string),
    // 如果后端没有返回 role 对象，创建一个默认的
    role: user.role || {
      id: "user",
      name: "user",
      label: "普通用户",
      permissions: [],
    },
  }
}

async function fetchApi<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  }

  // 真实模式下添加 Authorization 头
  if (!IS_MOCK_MODE) {
    const token = tokenStorage.getAccessToken()
    if (token) {
      headers.Authorization = `Bearer ${token}`
    }
  }

  const response = await fetch(`${API_BASE}${endpoint}`, {
    headers: {
      ...headers,
      ...options.headers,
    },
    ...options,
  })

  if (!response.ok) {
    throw new Error(`HTTP ${response.status}: ${response.statusText}`)
  }

  const data = await response.json()

  // Mock 模式：期望返回 { code: 200, data: T, message: string }
  if (IS_MOCK_MODE) {
    if (data.code !== 200 && data.code !== 0) {
      throw new Error(data.message || "请求失败")
    }
    return data
  }

  // 真实 API 模式：需要包装成统一格式
  // 后端直接返回数据或分页格式 {data: [], meta: {}}
  // 转换为前端期望的格式 {code: 200, data: {list: [], total, page, pageSize}}
  if (data && typeof data === "object" && "data" in data && "meta" in data) {
    // 分页响应格式转换
    const { data: list, meta } = data as { data: unknown[]; meta: { total: number; page: number; limit: number; totalPages: number } }

    // 检查是否是用户列表（通过 endpoint 判断）
    const isUserList = endpoint.startsWith("/users")
    const transformedList = isUserList
      ? (list as Record<string, unknown>[]).map(transformUser)
      : list

    return {
      code: 200,
      data: {
        list: transformedList,
        total: meta.total,
        page: meta.page,
        pageSize: meta.limit,
      },
      message: "success",
    } as T
  }

  return {
    code: 200,
    data,
    message: "success",
  } as T
}

const realApiRouter: ApiRouter = {
  user: {
    getUsers: (params) => {
      const query = mapQueryParams(params)
      return fetchApi(`/users${query ? `?${query}` : ""}`)
    },
    getUser: (id) => fetchApi(`/users/${id}`),
    createUser: (data) =>
      fetchApi("/users", {
        method: "POST",
        body: JSON.stringify(data),
      }),
    updateUser: (id, data) =>
      fetchApi(`/users/${id}`, {
        method: "PATCH",
        body: JSON.stringify(data),
      }),
    deleteUser: (id) =>
      fetchApi(`/users/${id}`, {
        method: "DELETE",
      }),
  },
  role: {
    getRoles: () => fetchApi("/roles"),
    getRole: (id) => fetchApi(`/roles/${id}`),
  },
  document: {
    getDocuments: (params) => {
      const query = mapQueryParams(params)
      return fetchApi(`/documents${query ? `?${query}` : ""}`)
    },
    getDocument: (id) => fetchApi(`/documents/${id}`),
  },
  notification: {
    getNotifications: (params) => {
      const query = mapQueryParams(params)
      return fetchApi(`/notifications${query ? `?${query}` : ""}`)
    },
    getUnreadCount: () => fetchApi("/notifications/unread-count"),
    markAsRead: (id) =>
      fetchApi(`/notifications/${id}/read`, { method: "PUT" }),
    markAllAsRead: () =>
      fetchApi("/notifications/read-all", { method: "PUT" }),
    deleteNotification: (id) =>
      fetchApi(`/notifications/${id}`, { method: "DELETE" }),
  },
  calendar: {
    getEvents: () => fetchApi("/calendar/events"),
    createEvent: (data) =>
      fetchApi("/calendar/events", {
        method: "POST",
        body: JSON.stringify(data),
      }),
    updateEvent: (id, data) =>
      fetchApi(`/calendar/events/${id}`, {
        method: "PUT",
        body: JSON.stringify(data),
      }),
    deleteEvent: (id) =>
      fetchApi(`/calendar/events/${id}`, { method: "DELETE" }),
  },
  message: {
    getMessages: (params) => {
      const query = mapQueryParams(params)
      return fetchApi(`/messages${query ? `?${query}` : ""}`)
    },
    getUnreadCount: () => fetchApi("/messages/unread-count"),
    sendMessage: (content) =>
      fetchApi("/messages/send", {
        method: "POST",
        body: JSON.stringify({ content }),
      }),
  },
}

// ============================================================================
// 导出
// ============================================================================

/**
 * 统一的 API Router
 * 根据 NEXT_PUBLIC_MOCK 环境变量自动选择 Mock 或 Real API
 */
export const apiRouter: ApiRouter =
  process.env.NEXT_PUBLIC_MOCK === "true" ? mockApiRouter : realApiRouter

/**
 * 检查是否处于 Mock 模式
 */
export const isMockMode = process.env.NEXT_PUBLIC_MOCK === "true"
