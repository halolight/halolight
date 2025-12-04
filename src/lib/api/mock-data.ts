import type {
  CalendarEvent,
  ChartData,
  DashboardStats,
  Document,
  Message,
  Notification,
  Role,
  User,
} from "./types"

// 预定义角色
export const mockRoles: Role[] = [
  {
    id: "admin",
    name: "admin",
    label: "超级管理员",
    description: "拥有系统所有权限",
    permissions: [
      "dashboard:view",
      "users:view",
      "users:create",
      "users:edit",
      "users:delete",
      "analytics:view",
      "analytics:export",
      "settings:view",
      "settings:edit",
      "documents:view",
      "documents:create",
      "documents:edit",
      "documents:delete",
      "files:view",
      "files:upload",
      "files:delete",
      "messages:view",
      "messages:send",
      "calendar:view",
      "calendar:edit",
      "notifications:view",
      "notifications:manage",
    ],
  },
  {
    id: "manager",
    name: "manager",
    label: "管理员",
    description: "管理日常业务",
    permissions: [
      "dashboard:view",
      "users:view",
      "users:create",
      "users:edit",
      "analytics:view",
      "analytics:export",
      "documents:view",
      "documents:create",
      "documents:edit",
      "files:view",
      "files:upload",
      "messages:view",
      "messages:send",
      "calendar:view",
      "calendar:edit",
      "notifications:view",
    ],
  },
  {
    id: "editor",
    name: "editor",
    label: "编辑",
    description: "内容管理",
    permissions: [
      "dashboard:view",
      "documents:view",
      "documents:create",
      "documents:edit",
      "files:view",
      "files:upload",
      "messages:view",
      "messages:send",
      "calendar:view",
      "notifications:view",
    ],
  },
  {
    id: "viewer",
    name: "viewer",
    label: "访客",
    description: "只读权限",
    permissions: [
      "dashboard:view",
      "documents:view",
      "files:view",
      "messages:view",
      "calendar:view",
      "notifications:view",
    ],
  },
]

// Mock 用户数据
export const mockUsers: User[] = [
  {
    id: "1",
    name: "张三",
    email: "zhangsan@halolight.h7ml.cn",
    phone: "138-0000-0001",
    avatar: "/avatars/1.png",
    role: mockRoles[0],
    status: "active",
    createdAt: "2024-01-01T00:00:00Z",
    lastLoginAt: "2024-01-15T10:30:00Z",
  },
  {
    id: "2",
    name: "李四",
    email: "lisi@halolight.h7ml.cn",
    phone: "138-0000-0002",
    role: mockRoles[1],
    status: "active",
    createdAt: "2024-01-05T00:00:00Z",
    lastLoginAt: "2024-01-14T15:20:00Z",
  },
  {
    id: "3",
    name: "王五",
    email: "wangwu@halolight.h7ml.cn",
    phone: "138-0000-0003",
    role: mockRoles[2],
    status: "active",
    createdAt: "2024-01-08T00:00:00Z",
    lastLoginAt: "2024-01-13T09:45:00Z",
  },
  {
    id: "4",
    name: "赵六",
    email: "zhaoliu@halolight.h7ml.cn",
    phone: "138-0000-0004",
    role: mockRoles[3],
    status: "inactive",
    createdAt: "2024-01-10T00:00:00Z",
  },
  {
    id: "5",
    name: "陈七",
    email: "chenqi@halolight.h7ml.cn",
    phone: "138-0000-0005",
    role: mockRoles[2],
    status: "suspended",
    createdAt: "2024-01-12T00:00:00Z",
  },
]

// Mock 通知数据
export const mockNotifications: Notification[] = [
  {
    id: "1",
    type: "user",
    title: "新用户注册",
    content: "用户 张三 刚刚完成注册",
    read: false,
    createdAt: new Date(Date.now() - 1000 * 60 * 5).toISOString(),
    link: "/users",
  },
  {
    id: "2",
    type: "system",
    title: "系统更新",
    content: "系统将于今晚 23:00 进行维护升级",
    read: false,
    createdAt: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
  },
  {
    id: "3",
    type: "task",
    title: "任务完成",
    content: "数据备份任务已完成",
    read: false,
    createdAt: new Date(Date.now() - 1000 * 60 * 60).toISOString(),
  },
  {
    id: "4",
    type: "alert",
    title: "安全警告",
    content: "检测到异常登录尝试",
    read: true,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
  },
  {
    id: "5",
    type: "user",
    title: "评论回复",
    content: "李四 回复了您的评论",
    read: true,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(),
    link: "/messages",
  },
]

// Mock 仪表盘统计
export const mockDashboardStats: DashboardStats = {
  totalUsers: 12453,
  activeUsers: 8234,
  totalRevenue: 543210,
  conversionRate: 12.5,
  recentOrders: 234,
  pendingTasks: 18,
}

// Mock 图表数据
export const mockChartData: ChartData[] = [
  { date: "2024-01-01", value: 4000, category: "访问量" },
  { date: "2024-01-02", value: 3000, category: "访问量" },
  { date: "2024-01-03", value: 5000, category: "访问量" },
  { date: "2024-01-04", value: 2780, category: "访问量" },
  { date: "2024-01-05", value: 1890, category: "访问量" },
  { date: "2024-01-06", value: 2390, category: "访问量" },
  { date: "2024-01-07", value: 3490, category: "访问量" },
]

// Mock 文档数据
export const mockDocuments: Document[] = [
  {
    id: "1",
    title: "项目计划书",
    type: "document",
    size: 1024 * 500,
    createdAt: "2024-01-10T00:00:00Z",
    updatedAt: "2024-01-15T10:30:00Z",
    createdBy: "张三",
    shared: true,
  },
  {
    id: "2",
    title: "财务报表",
    type: "spreadsheet",
    size: 1024 * 800,
    createdAt: "2024-01-08T00:00:00Z",
    updatedAt: "2024-01-14T15:20:00Z",
    createdBy: "李四",
    shared: false,
  },
  {
    id: "3",
    title: "产品演示",
    type: "presentation",
    size: 1024 * 1200,
    createdAt: "2024-01-05T00:00:00Z",
    updatedAt: "2024-01-13T09:45:00Z",
    createdBy: "王五",
    shared: true,
  },
]

// Mock 消息数据
export const mockMessages: Message[] = [
  {
    id: "1",
    sender: { id: "2", name: "李四", avatar: "/avatars/2.png" },
    content: "你好，项目进度如何？",
    createdAt: new Date(Date.now() - 1000 * 60 * 10).toISOString(),
    read: false,
  },
  {
    id: "2",
    sender: { id: "3", name: "王五" },
    content: "文档已经更新完成",
    createdAt: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
    read: false,
  },
  {
    id: "3",
    sender: { id: "4", name: "赵六" },
    content: "会议改到下午3点",
    createdAt: new Date(Date.now() - 1000 * 60 * 60).toISOString(),
    read: true,
  },
]

// Mock 日历事件
export const mockCalendarEvents: CalendarEvent[] = [
  {
    id: "1",
    title: "项目启动会",
    description: "讨论Q1项目计划",
    start: new Date(Date.now() + 1000 * 60 * 60 * 2).toISOString(),
    end: new Date(Date.now() + 1000 * 60 * 60 * 4).toISOString(),
    color: "#3b82f6",
  },
  {
    id: "2",
    title: "代码评审",
    start: new Date(Date.now() + 1000 * 60 * 60 * 24).toISOString(),
    end: new Date(Date.now() + 1000 * 60 * 60 * 26).toISOString(),
    color: "#10b981",
  },
  {
    id: "3",
    title: "产品发布",
    description: "v2.0 正式发布",
    start: new Date(Date.now() + 1000 * 60 * 60 * 48).toISOString(),
    end: new Date(Date.now() + 1000 * 60 * 60 * 48).toISOString(),
    allDay: true,
    color: "#f59e0b",
  },
]
