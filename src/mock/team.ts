import Mock from "mockjs"

// 权限分组定义
export const permissionGroups = [
  {
    group: "仪表盘",
    permissions: [{ key: "dashboard:view", label: "查看仪表盘" }],
  },
  {
    group: "用户管理",
    permissions: [
      { key: "users:view", label: "查看用户" },
      { key: "users:create", label: "创建用户" },
      { key: "users:edit", label: "编辑用户" },
      { key: "users:delete", label: "删除用户" },
    ],
  },
  {
    group: "数据分析",
    permissions: [
      { key: "analytics:view", label: "查看分析" },
      { key: "analytics:export", label: "导出数据" },
    ],
  },
  {
    group: "文档管理",
    permissions: [
      { key: "documents:view", label: "查看文档" },
      { key: "documents:create", label: "创建文档" },
      { key: "documents:edit", label: "编辑文档" },
      { key: "documents:delete", label: "删除文档" },
    ],
  },
  {
    group: "文件存储",
    permissions: [
      { key: "files:view", label: "查看文件" },
      { key: "files:upload", label: "上传文件" },
      { key: "files:delete", label: "删除文件" },
    ],
  },
  {
    group: "消息中心",
    permissions: [
      { key: "messages:view", label: "查看消息" },
      { key: "messages:send", label: "发送消息" },
    ],
  },
  {
    group: "日程安排",
    permissions: [
      { key: "calendar:view", label: "查看日程" },
      { key: "calendar:edit", label: "编辑日程" },
    ],
  },
  {
    group: "通知中心",
    permissions: [
      { key: "notifications:view", label: "查看通知" },
      { key: "notifications:manage", label: "管理通知" },
    ],
  },
  {
    group: "系统设置",
    permissions: [
      { key: "settings:view", label: "查看设置" },
      { key: "settings:edit", label: "编辑设置" },
    ],
  },
]

// 扁平化权限列表
export const allPermissions = permissionGroups.flatMap((g) =>
  g.permissions.map((p) => ({ ...p, group: g.group }))
)

// 角色详情数据
const rolesDetail = [
  {
    id: "admin",
    name: "admin",
    label: "超级管理员",
    description: "拥有系统所有权限",
    permissions: ["*"],
    userCount: 3,
    createdAt: "2024-01-01 00:00:00",
    updatedAt: "2024-06-15 10:30:00",
  },
  {
    id: "manager",
    name: "manager",
    label: "管理员",
    description: "可管理用户和内容",
    permissions: [
      "dashboard:view",
      "users:view",
      "users:create",
      "users:edit",
      "documents:view",
      "documents:create",
      "documents:edit",
      "files:view",
      "files:upload",
      "messages:view",
      "messages:send",
      "calendar:view",
      "calendar:edit",
      "settings:view",
    ],
    userCount: 8,
    createdAt: "2024-01-15 09:00:00",
    updatedAt: "2024-07-20 14:20:00",
  },
  {
    id: "editor",
    name: "editor",
    label: "编辑员",
    description: "可编辑文档和内容",
    permissions: [
      "dashboard:view",
      "documents:view",
      "documents:create",
      "documents:edit",
      "files:view",
      "files:upload",
      "messages:view",
    ],
    userCount: 15,
    createdAt: "2024-02-01 11:00:00",
    updatedAt: "2024-08-10 09:15:00",
  },
  {
    id: "viewer",
    name: "viewer",
    label: "访客",
    description: "仅可查看内容",
    permissions: [
      "dashboard:view",
      "documents:view",
      "files:view",
      "messages:view",
      "calendar:view",
    ],
    userCount: 42,
    createdAt: "2024-02-15 08:30:00",
    updatedAt: "2024-09-01 16:45:00",
  },
]

// 团队数据
const teams = [
  {
    id: "team-1",
    name: "产品研发部",
    description: "负责产品设计与开发",
    avatar: Mock.Random.image("100x100", "#3B82F6", "#fff", "研"),
    memberCount: 12,
    members: [
      {
        id: "m-1",
        userId: "u-1",
        name: "张三",
        email: "zhangsan@example.com",
        avatar: Mock.Random.image("100x100", Mock.Random.color(), "#fff", "张"),
        role: "owner",
        joinedAt: "2024-01-01 09:00:00",
      },
      {
        id: "m-2",
        userId: "u-2",
        name: "李四",
        email: "lisi@example.com",
        avatar: Mock.Random.image("100x100", Mock.Random.color(), "#fff", "李"),
        role: "admin",
        joinedAt: "2024-01-15 10:30:00",
      },
      {
        id: "m-3",
        userId: "u-3",
        name: "王五",
        email: "wangwu@example.com",
        avatar: Mock.Random.image("100x100", Mock.Random.color(), "#fff", "王"),
        role: "member",
        joinedAt: "2024-02-01 14:00:00",
      },
    ],
    createdAt: "2024-01-01 00:00:00",
    updatedAt: "2024-10-15 11:20:00",
  },
  {
    id: "team-2",
    name: "市场营销部",
    description: "负责市场推广和品牌建设",
    avatar: Mock.Random.image("100x100", "#10B981", "#fff", "营"),
    memberCount: 8,
    members: [],
    createdAt: "2024-02-01 00:00:00",
    updatedAt: "2024-09-20 15:30:00",
  },
  {
    id: "team-3",
    name: "客户服务部",
    description: "负责客户支持和售后服务",
    avatar: Mock.Random.image("100x100", "#F59E0B", "#fff", "客"),
    memberCount: 15,
    members: [],
    createdAt: "2024-03-01 00:00:00",
    updatedAt: "2024-11-01 09:45:00",
  },
  {
    id: "team-4",
    name: "运维技术部",
    description: "负责系统运维和技术支持",
    avatar: Mock.Random.image("100x100", "#8B5CF6", "#fff", "运"),
    memberCount: 6,
    members: [],
    createdAt: "2024-04-15 00:00:00",
    updatedAt: "2024-10-28 14:10:00",
  },
]

// 获取团队列表
Mock.mock("/api/teams", "get", () => {
  return {
    code: 200,
    message: "success",
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    data: teams.map(({ members, ...team }) => team),
  }
})

// 获取单个团队（含成员）
Mock.mock(/\/api\/teams\/[a-zA-Z0-9-]+$/, "get", (options: { url: string }) => {
  const id = options.url.split("/").pop()
  const team = teams.find((t) => t.id === id)
  if (!team) {
    return { code: 404, message: "团队不存在", data: null }
  }
  return { code: 200, message: "success", data: team }
})

// 创建团队
Mock.mock("/api/teams", "post", () => {
  return {
    code: 200,
    message: "创建成功",
    data: {
      id: Mock.Random.guid(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      memberCount: 0,
    },
  }
})

// 更新团队
Mock.mock(/\/api\/teams\/[a-zA-Z0-9-]+$/, "put", () => {
  return {
    code: 200,
    message: "更新成功",
    data: { updatedAt: new Date().toISOString() },
  }
})

// 删除团队
Mock.mock(/\/api\/teams\/[a-zA-Z0-9-]+$/, "delete", () => {
  return { code: 200, message: "删除成功", data: null }
})

// 获取角色详情列表
Mock.mock("/api/roles/detail", "get", () => {
  return { code: 200, message: "success", data: rolesDetail }
})

// 获取单个角色
Mock.mock(/\/api\/roles\/[a-zA-Z0-9-]+$/, "get", (options: { url: string }) => {
  const id = options.url.split("/").pop()
  const role = rolesDetail.find((r) => r.id === id)
  if (!role) {
    return { code: 404, message: "角色不存在", data: null }
  }
  return { code: 200, message: "success", data: role }
})

// 创建角色
Mock.mock("/api/roles", "post", () => {
  return {
    code: 200,
    message: "创建成功",
    data: {
      id: Mock.Random.guid(),
      userCount: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  }
})

// 更新角色
Mock.mock(/\/api\/roles\/[a-zA-Z0-9-]+$/, "put", () => {
  return {
    code: 200,
    message: "更新成功",
    data: { updatedAt: new Date().toISOString() },
  }
})

// 删除角色
Mock.mock(/\/api\/roles\/[a-zA-Z0-9-]+$/, "delete", () => {
  return { code: 200, message: "删除成功", data: null }
})

// 获取权限列表
Mock.mock("/api/permissions", "get", () => {
  return { code: 200, message: "success", data: allPermissions }
})

const teamMock = {}
export default teamMock
