// API 服务基础配置
import type {
  Activity,
  CalendarEvent,
  Conversation,
  DashboardStats,
  Document,
  FileItem,
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

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "/api"

// 通用请求封装
async function request<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const url = `${API_BASE}${endpoint}`

  const response = await fetch(url, {
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
    ...options,
  })

  const data = await response.json()

  if (data.code !== 200) {
    throw new Error(data.message || "请求失败")
  }

  return data.data
}

// 用户相关 API
export const userService = {
  // 获取用户列表
  getUsers: (params?: { page?: number; pageSize?: number; keyword?: string }) => {
    const query = new URLSearchParams(params as Record<string, string>).toString()
    return request<ListData<User>>(`/users${query ? `?${query}` : ""}`)
  },

  // 获取单个用户
  getUser: (id: string) => request<User>(`/users/${id}`),

  // 创建用户
  createUser: (data: Partial<User>) =>
    request<User>("/users", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  // 更新用户
  updateUser: (id: string, data: Partial<User>) =>
    request<User>(`/users/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    }),

  // 删除用户
  deleteUser: (id: string) =>
    request<void>(`/users/${id}`, { method: "DELETE" }),

  // 登录
  login: (email: string, password: string) =>
    request<LoginResponse>("/user/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    }),

  // 获取当前用户
  getCurrentUser: () => request<User>("/user/current"),

  // 获取角色列表
  getRoles: () => request<Role[]>("/roles"),
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
  getDocuments: () => request<Document[]>("/documents"),

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
}

// 文件相关 API
export const fileService = {
  // 获取文件列表
  getFiles: (path?: string) => {
    const params = path ? `?path=${encodeURIComponent(path)}` : ""
    return request<FileItem[]>(`/files${params}`)
  },

  // 获取存储空间信息
  getStorage: () => request<StorageInfo>("/files/storage"),

  // 上传文件
  uploadFile: (file: File, path?: string) => {
    const formData = new FormData()
    formData.append("file", file)
    if (path) formData.append("path", path)
    return request<FileItem>("/files/upload", {
      method: "POST",
      body: formData,
      headers: {}, // 让浏览器自动设置 Content-Type
    })
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
    request<void>(`/files/${id}/move`, {
      method: "PUT",
      body: JSON.stringify({ targetPath }),
    }),

  // 重命名文件
  renameFile: (id: string, name: string) =>
    request<void>(`/files/${id}/rename`, {
      method: "PUT",
      body: JSON.stringify({ name }),
    }),
}

// 团队相关 API
export const teamService = {
  // 获取团队列表
  getTeams: () => request<Team[]>("/teams"),

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
      method: "PUT",
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
  // 获取角色列表（带详情）
  getRoles: () => request<RoleDetail[]>("/roles/detail"),

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
      method: "PUT",
      body: JSON.stringify(data),
    }),

  // 删除角色
  deleteRole: (id: string) =>
    request<void>(`/roles/${id}`, { method: "DELETE" }),

  // 获取所有权限列表
  getPermissions: () => request<Array<{ key: string; label: string; group: string }>>("/permissions"),
}

// 重新导出类型供外部使用
export type {
  Activity,
  CalendarEvent,
  Conversation,
  DashboardStats,
  Document,
  FileItem,
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
