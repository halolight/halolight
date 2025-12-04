/**
 * API Router - 统一的数据访问层
 *
 * 根据 NEXT_PUBLIC_MOCK 环境变量自动切换 Mock API 和真实 API。
 * Server Actions 和 React Query hooks 都通过此 router 获取数据，
 * 确保 Mock 模式在服务端和客户端都能正常工作。
 */

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

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "/api"

async function fetchApi<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const response = await fetch(`${API_BASE}${endpoint}`, {
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
    ...options,
  })

  const data = await response.json()

  // 兼容不同的响应格式
  if (data.code !== 0 && data.code !== 200) {
    throw new Error(data.message || "请求失败")
  }

  return data
}

const realApiRouter: ApiRouter = {
  user: {
    getUsers: (params) => {
      const query = new URLSearchParams(
        Object.entries(params || {}).reduce(
          (acc, [key, value]) => {
            if (value !== undefined) acc[key] = String(value)
            return acc
          },
          {} as Record<string, string>
        )
      ).toString()
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
        method: "PUT",
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
      const query = new URLSearchParams(
        Object.entries(params || {}).reduce(
          (acc, [key, value]) => {
            if (value !== undefined) acc[key] = String(value)
            return acc
          },
          {} as Record<string, string>
        )
      ).toString()
      return fetchApi(`/documents${query ? `?${query}` : ""}`)
    },
    getDocument: (id) => fetchApi(`/documents/${id}`),
  },
  notification: {
    getNotifications: (params) => {
      const query = new URLSearchParams(
        Object.entries(params || {}).reduce(
          (acc, [key, value]) => {
            if (value !== undefined) acc[key] = String(value)
            return acc
          },
          {} as Record<string, string>
        )
      ).toString()
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
      const query = new URLSearchParams(
        Object.entries(params || {}).reduce(
          (acc, [key, value]) => {
            if (value !== undefined) acc[key] = String(value)
            return acc
          },
          {} as Record<string, string>
        )
      ).toString()
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
