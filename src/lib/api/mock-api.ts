import {
  mockCalendarEvents,
  mockChartData,
  mockDashboardStats,
  mockDocuments,
  mockMessages,
  mockNotifications,
  mockRoles,
  mockUsers,
} from "./mock-data"
import type {
  ApiResponse,
  CalendarEvent,
  ChartData,
  DashboardStats,
  Document,
  Message,
  Notification,
  PaginatedResponse,
  Role,
  User,
} from "./types"

// 模拟网络延迟
const delay = (ms: number = 500) => new Promise((resolve) => setTimeout(resolve, ms))

// 用户相关 API
export const userApi = {
  // 获取用户列表
  async getUsers(params?: {
    page?: number
    pageSize?: number
    search?: string
    status?: string
    role?: string
  }): Promise<PaginatedResponse<User>> {
    await delay()
    let users = [...mockUsers]

    // 搜索过滤
    if (params?.search) {
      const search = params.search.toLowerCase()
      users = users.filter(
        (u) =>
          u.name.toLowerCase().includes(search) ||
          u.email.toLowerCase().includes(search)
      )
    }

    // 状态过滤
    if (params?.status && params.status !== "all") {
      users = users.filter((u) => u.status === params.status)
    }

    // 角色过滤
    if (params?.role && params.role !== "all") {
      users = users.filter((u) => u.role.id === params.role)
    }

    const page = params?.page || 1
    const pageSize = params?.pageSize || 10
    const start = (page - 1) * pageSize
    const paginatedUsers = users.slice(start, start + pageSize)

    return {
      code: 0,
      data: {
        list: paginatedUsers,
        total: users.length,
        page,
        pageSize,
      },
      message: "success",
    }
  },

  // 获取单个用户
  async getUser(id: string): Promise<ApiResponse<User | null>> {
    await delay(300)
    const user = mockUsers.find((u) => u.id === id)
    return {
      code: user ? 0 : 404,
      data: user || null,
      message: user ? "success" : "User not found",
    }
  },

  // 创建用户
  async createUser(
    data: Omit<User, "id" | "createdAt" | "lastLoginAt">
  ): Promise<ApiResponse<User>> {
    await delay(800)
    const newUser: User = {
      ...data,
      id: String(Date.now()),
      createdAt: new Date().toISOString(),
    }
    mockUsers.push(newUser)
    return {
      code: 0,
      data: newUser,
      message: "success",
    }
  },

  // 更新用户
  async updateUser(
    id: string,
    data: Partial<User>
  ): Promise<ApiResponse<User | null>> {
    await delay(600)
    const index = mockUsers.findIndex((u) => u.id === id)
    if (index === -1) {
      return { code: 404, data: null, message: "User not found" }
    }
    mockUsers[index] = { ...mockUsers[index], ...data }
    return { code: 0, data: mockUsers[index], message: "success" }
  },

  // 删除用户
  async deleteUser(id: string): Promise<ApiResponse<null>> {
    await delay(500)
    const index = mockUsers.findIndex((u) => u.id === id)
    if (index === -1) {
      return { code: 404, data: null, message: "User not found" }
    }
    mockUsers.splice(index, 1)
    return { code: 0, data: null, message: "success" }
  },
}

// 角色相关 API
export const roleApi = {
  async getRoles(): Promise<ApiResponse<Role[]>> {
    await delay(300)
    return { code: 0, data: mockRoles, message: "success" }
  },

  async getRole(id: string): Promise<ApiResponse<Role | null>> {
    await delay(200)
    const role = mockRoles.find((r) => r.id === id)
    return {
      code: role ? 0 : 404,
      data: role || null,
      message: role ? "success" : "Role not found",
    }
  },
}

// 通知相关 API
export const notificationApi = {
  async getNotifications(params?: {
    page?: number
    pageSize?: number
    type?: string
    read?: boolean
  }): Promise<PaginatedResponse<Notification>> {
    await delay()
    let notifications = [...mockNotifications]

    if (params?.type && params.type !== "all") {
      notifications = notifications.filter((n) => n.type === params.type)
    }

    if (params?.read !== undefined) {
      notifications = notifications.filter((n) => n.read === params.read)
    }

    const page = params?.page || 1
    const pageSize = params?.pageSize || 10
    const start = (page - 1) * pageSize
    const paginatedNotifications = notifications.slice(start, start + pageSize)

    return {
      code: 0,
      data: {
        list: paginatedNotifications,
        total: notifications.length,
        page,
        pageSize,
      },
      message: "success",
    }
  },

  async getUnreadCount(): Promise<ApiResponse<number>> {
    await delay(200)
    const count = mockNotifications.filter((n) => !n.read).length
    return { code: 0, data: count, message: "success" }
  },

  async markAsRead(id: string): Promise<ApiResponse<null>> {
    await delay(300)
    const notification = mockNotifications.find((n) => n.id === id)
    if (notification) {
      notification.read = true
    }
    return { code: 0, data: null, message: "success" }
  },

  async markAllAsRead(): Promise<ApiResponse<null>> {
    await delay(500)
    mockNotifications.forEach((n) => (n.read = true))
    return { code: 0, data: null, message: "success" }
  },

  async deleteNotification(id: string): Promise<ApiResponse<null>> {
    await delay(300)
    const index = mockNotifications.findIndex((n) => n.id === id)
    if (index !== -1) {
      mockNotifications.splice(index, 1)
    }
    return { code: 0, data: null, message: "success" }
  },
}

// 仪表盘 API
export const dashboardApi = {
  async getStats(): Promise<ApiResponse<DashboardStats>> {
    await delay()
    return { code: 0, data: mockDashboardStats, message: "success" }
  },

  async getChartData(): Promise<ApiResponse<ChartData[]>> {
    await delay(400)
    return { code: 0, data: mockChartData, message: "success" }
  },
}

// 文档 API
export const documentApi = {
  async getDocuments(params?: {
    page?: number
    pageSize?: number
    type?: string
    search?: string
  }): Promise<PaginatedResponse<Document>> {
    await delay()
    let documents = [...mockDocuments]

    if (params?.type && params.type !== "all") {
      documents = documents.filter((d) => d.type === params.type)
    }

    if (params?.search) {
      const search = params.search.toLowerCase()
      documents = documents.filter((d) =>
        (d.title ?? d.name ?? "").toLowerCase().includes(search)
      )
    }

    const page = params?.page || 1
    const pageSize = params?.pageSize || 10
    const start = (page - 1) * pageSize

    return {
      code: 0,
      data: {
        list: documents.slice(start, start + pageSize),
        total: documents.length,
        page,
        pageSize,
      },
      message: "success",
    }
  },

  async getDocument(id: string): Promise<ApiResponse<Document | null>> {
    await delay(300)
    const doc = mockDocuments.find((d) => d.id === id)
    return {
      code: doc ? 0 : 404,
      data: doc || null,
      message: doc ? "success" : "Document not found",
    }
  },
}

// 消息 API
export const messageApi = {
  async getMessages(params?: {
    page?: number
    pageSize?: number
  }): Promise<PaginatedResponse<Message>> {
    await delay()
    const page = params?.page || 1
    const pageSize = params?.pageSize || 20
    const start = (page - 1) * pageSize

    return {
      code: 0,
      data: {
        list: mockMessages.slice(start, start + pageSize),
        total: mockMessages.length,
        page,
        pageSize,
      },
      message: "success",
    }
  },

  async getUnreadCount(): Promise<ApiResponse<number>> {
    await delay(200)
    const count = mockMessages.filter((m) => !m.read).length
    return { code: 0, data: count, message: "success" }
  },

  async sendMessage(content: string): Promise<ApiResponse<Message>> {
    await delay(500)
    const message: Message = {
      id: String(Date.now()),
      sender: { id: "1", name: "我" },
      content,
      createdAt: new Date().toISOString(),
      read: true,
    }
    return { code: 0, data: message, message: "success" }
  },
}

// 日历 API
export const calendarApi = {
  async getEvents(): Promise<ApiResponse<CalendarEvent[]>> {
    await delay()
    return { code: 0, data: mockCalendarEvents, message: "success" }
  },

  async createEvent(
    data: Omit<CalendarEvent, "id">
  ): Promise<ApiResponse<CalendarEvent>> {
    await delay(500)
    const event: CalendarEvent = {
      ...data,
      id: String(Date.now()),
    }
    mockCalendarEvents.push(event)
    return { code: 0, data: event, message: "success" }
  },

  async updateEvent(
    id: string,
    data: Partial<CalendarEvent>
  ): Promise<ApiResponse<CalendarEvent | null>> {
    await delay(400)
    const index = mockCalendarEvents.findIndex((e) => e.id === id)
    if (index === -1) {
      return { code: 404, data: null, message: "Event not found" }
    }
    mockCalendarEvents[index] = { ...mockCalendarEvents[index], ...data }
    return { code: 0, data: mockCalendarEvents[index], message: "success" }
  },

  async deleteEvent(id: string): Promise<ApiResponse<null>> {
    await delay(300)
    const index = mockCalendarEvents.findIndex((e) => e.id === id)
    if (index !== -1) {
      mockCalendarEvents.splice(index, 1)
    }
    return { code: 0, data: null, message: "success" }
  },
}
