/**
 * API 类型定义中心
 * 所有 API 相关的类型定义都集中在这里
 */

// ============================================================================
// 通用响应类型
// ============================================================================

/** 标准 API 响应 */
export interface ApiResponse<T> {
  code: number
  data: T
  message: string
}

/** 分页响应 */
export interface PaginatedResponse<T> {
  code: number
  data: {
    list: T[]
    total: number
    page: number
    pageSize: number
  }
  message: string
}

/** 分页参数 */
export interface PaginationParams {
  page?: number
  pageSize?: number
}

/** 列表响应数据 */
export interface ListData<T> {
  list: T[]
  total: number
}

// ============================================================================
// 用户与权限
// ============================================================================

/** 权限类型 */
export type Permission =
  | "dashboard:view"
  | "users:view"
  | "users:create"
  | "users:edit"
  | "users:delete"
  | "analytics:view"
  | "analytics:export"
  | "settings:view"
  | "settings:edit"
  | "documents:view"
  | "documents:create"
  | "documents:edit"
  | "documents:delete"
  | "files:view"
  | "files:upload"
  | "files:delete"
  | "messages:view"
  | "messages:send"
  | "calendar:view"
  | "calendar:edit"
  | "notifications:view"
  | "notifications:manage"

/** 角色 */
export interface Role {
  id: string
  name: string
  label: string
  permissions: Permission[]
  description?: string
}

/** 用户状态 */
export type UserStatus = "active" | "inactive" | "suspended"

/** 用户 */
export interface User {
  id: string
  name: string
  email: string
  phone?: string
  avatar?: string
  role: Role
  status: UserStatus
  department?: string
  position?: string
  bio?: string
  createdAt: string
  lastLoginAt?: string
}

/** 用户创建请求 */
export type UserCreateRequest = Omit<User, "id" | "createdAt" | "lastLoginAt" | "role"> & {
  roleId: string
  password: string
}

/** 用户更新请求 */
export type UserUpdateRequest = Partial<Omit<User, "id" | "createdAt" | "lastLoginAt" | "role">> & {
  roleId?: string
}

/** 用户查询参数 */
export interface UserFilterParams extends PaginationParams {
  keyword?: string
  status?: UserStatus
  roleId?: string
}

/** 登录响应 */
export interface LoginResponse {
  user: User
  token: string
  expiresIn: number
}

// ============================================================================
// 仪表盘
// ============================================================================

/** 仪表盘统计 */
export interface DashboardStats {
  totalUsers: number
  activeUsers?: number
  totalRevenue: number
  totalOrders?: number
  conversionRate: number
  recentOrders?: number
  pendingTasks?: number
  userGrowth?: number
  revenueGrowth?: number
  orderGrowth?: number
  rateGrowth?: number
}

/** 图表数据 */
export interface ChartData {
  date: string
  value: number
  category?: string
}

/** 访问数据 */
export interface VisitData {
  date: string
  visits: number
  uniqueVisitors: number
  pageViews: number
}

/** 销售数据 */
export interface SalesData {
  month: string
  sales: number
  profit: number
}

/** 产品 */
export interface Product {
  id: string
  name: string
  category: string
  price: number
  sales: number
  stock: number
  image: string
}

/** 订单状态 */
export type OrderStatus = "pending" | "processing" | "shipped" | "delivered" | "cancelled"

/** 订单 */
export interface Order {
  id: string
  orderNo: string
  customer: string
  amount: number
  status: OrderStatus
  createdAt: string
}

/** 活动记录 */
export interface Activity {
  id: string
  user: string
  avatar: string
  action: string
  target: string
  time: string
}

/** 系统概览 */
export interface SystemOverview {
  cpu: number
  memory: number
  disk: number
  network: number
  uptime: number
  requests: number
  errors: number
  responseTime: number
}

// ============================================================================
// 通知
// ============================================================================

/** 通知类型 */
export type NotificationType = "system" | "user" | "message" | "task" | "alert"

/** 通知 */
export interface Notification {
  id: string
  type: NotificationType
  title: string
  content: string
  read: boolean
  createdAt: string
  link?: string
  sender?: {
    id: string
    name: string
    avatar: string
  }
}

// ============================================================================
// 文档
// ============================================================================

/** 文档类型 */
export type DocumentType = "pdf" | "doc" | "document" | "image" | "spreadsheet" | "presentation" | "code" | "other"

/** 文档 */
export interface Document {
  id: string
  name?: string
  title?: string
  type: DocumentType
  size: number
  folder?: string
  content?: string
  author?: {
    id: string
    name: string
    avatar: string
  }
  createdBy?: string
  shared: boolean
  tags?: string[]
  views?: number
  createdAt: string
  updatedAt: string
  collaborators?: Array<{
    id: string
    name: string
    avatar: string
  }>
}

// ============================================================================
// 消息
// ============================================================================

/** 消息类型 */
export type MessageType = "text" | "image" | "file"

/** 消息发送者 */
export interface MessageSender {
  id: string
  name: string
  avatar?: string
}

/** 消息 */
export interface Message {
  id: string
  conversationId?: string
  sender: MessageSender
  type?: MessageType
  content: string
  createdAt: string
  read: boolean
}

/** 会话类型 */
export type ConversationType = "private" | "group"

/** 会话成员 */
export interface ConversationMember {
  id: string
  name: string
  avatar: string
}

/** 会话 */
export interface Conversation {
  id: string
  type: ConversationType
  name: string
  avatar: string
  lastMessage: string
  lastMessageTime: string
  unreadCount: number
  online: boolean
  members: ConversationMember[]
}

// ============================================================================
// 日历
// ============================================================================

/** 日历事件类型 */
export type CalendarEventType = "meeting" | "task" | "reminder" | "holiday"

/** 参会者状态 */
export type AttendeeStatus = "accepted" | "declined" | "pending"

/** 参会者 */
export interface CalendarAttendee {
  id: string
  name: string
  avatar: string
  status: AttendeeStatus
}

/** 日历事件 */
export interface CalendarEvent {
  id: string
  title: string
  description?: string
  start: string
  end: string
  type?: CalendarEventType
  color?: string
  allDay?: boolean
  location?: string
  attendees?: CalendarAttendee[]
  reminders?: string[]
  createdAt?: string
}

// ============================================================================
// 文件
// ============================================================================

/** 文件类型 */
export type FileType = "folder" | "image" | "video" | "audio" | "archive" | "document"

/** 文件项 */
export interface FileItem {
  id: string
  name: string
  type: FileType
  size: number | null
  items: number | null
  path: string
  mimeType: string
  thumbnail: string | null
  createdAt: string
  updatedAt: string
}

/** 存储信息 */
export interface StorageInfo {
  used: number
  total: number
  breakdown: {
    images: number
    videos: number
    audio: number
    documents: number
    archives: number
    others: number
  }
}

// ============================================================================
// 团队
// ============================================================================

/** 团队成员 */
export interface TeamMember {
  id: string
  userId: string
  name: string
  email: string
  avatar?: string
  role: "owner" | "admin" | "member"
  joinedAt: string
}

/** 团队 */
export interface Team {
  id: string
  name: string
  description?: string
  avatar?: string
  memberCount: number
  members?: TeamMember[]
  createdAt: string
  updatedAt: string
}

/** 团队创建请求 */
export interface TeamCreateRequest {
  name: string
  description?: string
}

/** 团队更新请求 */
export interface TeamUpdateRequest {
  name?: string
  description?: string
}

// ============================================================================
// 角色详情（扩展）
// ============================================================================

/** 角色详情 */
export interface RoleDetail extends Role {
  userCount: number
  createdAt: string
  updatedAt: string
}

/** 角色创建请求 */
export interface RoleCreateRequest {
  name: string
  label: string
  description?: string
  permissions: Permission[]
}

/** 角色更新请求 */
export interface RoleUpdateRequest {
  name?: string
  label?: string
  description?: string
  permissions?: Permission[]
}
