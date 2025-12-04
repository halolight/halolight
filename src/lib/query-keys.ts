/**
 * React Query Keys 统一管理
 *
 * 集中管理所有 query keys，确保：
 * - 类型安全
 * - 避免 key 冲突
 * - 方便 invalidation
 */

// ============================================================================
// 用户相关
// ============================================================================

export const userKeys = {
  all: ["users"] as const,
  lists: () => [...userKeys.all, "list"] as const,
  list: (filters: Record<string, unknown>) =>
    [...userKeys.lists(), filters] as const,
  details: () => [...userKeys.all, "detail"] as const,
  detail: (id: string) => [...userKeys.details(), id] as const,
  current: () => [...userKeys.all, "current"] as const,
}

export const roleKeys = {
  all: ["roles"] as const,
  list: () => [...roleKeys.all, "list"] as const,
  detail: (id: string) => [...roleKeys.all, "detail", id] as const,
  permissions: () => [...roleKeys.all, "permissions"] as const,
}

// ============================================================================
// 团队相关
// ============================================================================

export const teamKeys = {
  all: ["teams"] as const,
  list: () => [...teamKeys.all, "list"] as const,
  detail: (id: string) => [...teamKeys.all, "detail", id] as const,
}

// ============================================================================
// 文档相关
// ============================================================================

export const documentKeys = {
  all: ["documents"] as const,
  lists: () => [...documentKeys.all, "list"] as const,
  list: (filters: Record<string, unknown>) =>
    [...documentKeys.lists(), filters] as const,
  details: () => [...documentKeys.all, "detail"] as const,
  detail: (id: string) => [...documentKeys.details(), id] as const,
}

// ============================================================================
// 日历相关
// ============================================================================

export const calendarKeys = {
  all: ["calendar"] as const,
  events: () => [...calendarKeys.all, "events"] as const,
  eventsByRange: (start?: string, end?: string) =>
    [...calendarKeys.events(), { start, end }] as const,
  event: (id: string) => [...calendarKeys.all, "event", id] as const,
}

// ============================================================================
// 通知相关
// ============================================================================

export const notificationKeys = {
  all: ["notifications"] as const,
  lists: () => [...notificationKeys.all, "list"] as const,
  list: (filters: Record<string, unknown>) =>
    [...notificationKeys.lists(), filters] as const,
  unreadCount: () => [...notificationKeys.all, "unread-count"] as const,
}

// ============================================================================
// 消息相关
// ============================================================================

export const messageKeys = {
  all: ["messages"] as const,
  conversations: () => [...messageKeys.all, "conversations"] as const,
  conversation: (id: string) =>
    [...messageKeys.conversations(), id] as const,
  messages: (conversationId: string) =>
    [...messageKeys.all, "messages", conversationId] as const,
  unreadCount: () => [...messageKeys.all, "unread-count"] as const,
}

// ============================================================================
// 文件相关
// ============================================================================

export const fileKeys = {
  all: ["files"] as const,
  lists: () => [...fileKeys.all, "list"] as const,
  list: (path?: string) => [...fileKeys.lists(), { path }] as const,
  storage: () => [...fileKeys.all, "storage"] as const,
}

// ============================================================================
// 仪表盘相关
// ============================================================================

export const dashboardKeys = {
  all: ["dashboard"] as const,
  stats: () => [...dashboardKeys.all, "stats"] as const,
  visits: () => [...dashboardKeys.all, "visits"] as const,
  sales: () => [...dashboardKeys.all, "sales"] as const,
  products: () => [...dashboardKeys.all, "products"] as const,
  orders: () => [...dashboardKeys.all, "orders"] as const,
  activities: () => [...dashboardKeys.all, "activities"] as const,
  overview: () => [...dashboardKeys.all, "overview"] as const,
}

// ============================================================================
// 工具函数
// ============================================================================

/**
 * 创建通用的分页查询 key
 */
export function createPaginatedKey<T extends string>(
  base: readonly T[],
  params: {
    page?: number
    pageSize?: number
    [key: string]: unknown
  }
) {
  return [...base, "paginated", params] as const
}

/**
 * 创建搜索查询 key
 */
export function createSearchKey<T extends string>(
  base: readonly T[],
  search: string
) {
  return [...base, "search", search] as const
}
