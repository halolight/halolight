import Mock from "mockjs"

const Random = Mock.Random

// 角色列表
export const roles = [
  { id: "admin", name: "admin", label: "超级管理员", permissions: ["*"] },
  { id: "editor", name: "editor", label: "编辑员", permissions: ["dashboard:view", "users:view", "documents:*"] },
  { id: "viewer", name: "viewer", label: "访客", permissions: ["dashboard:view"] },
]

// 获取随机角色对象
function getRandomRole() {
  return roles[Math.floor(Math.random() * roles.length)]
}

// 生成用户列表
Mock.mock("/api/users", "get", () => {
  const users = []
  const count = Mock.Random.integer(20, 50)
  for (let i = 0; i < count; i++) {
    users.push({
      id: Mock.Random.guid(),
      name: Mock.Random.cname(),
      email: Mock.Random.email(),
      phone: `1${Mock.Random.pick(["3", "5", "7", "8", "9"])}${Mock.Random.string("number", 9)}`,
      avatar: Mock.Random.image("100x100", Mock.Random.color(), "#fff", Mock.Random.first()),
      role: getRandomRole(),
      status: Mock.Random.pick(["active", "inactive", "suspended"]),
      department: Mock.Random.ctitle(2, 4) + "部",
      position: Mock.Random.ctitle(2, 3),
      createdAt: Mock.Random.datetime("yyyy-MM-dd HH:mm:ss"),
      lastLoginAt: Mock.Random.datetime("yyyy-MM-dd HH:mm:ss"),
    })
  }
  return {
    code: 200,
    message: "success",
    data: {
      list: users,
      total: users.length,
    },
  }
})

// 获取单个用户
Mock.mock(/\/api\/users\/[a-zA-Z0-9-]+/, "get", () => {
  return {
    code: 200,
    message: "success",
    data: {
      id: Mock.Random.guid(),
      name: Mock.Random.cname(),
      email: Mock.Random.email(),
      phone: `1${Mock.Random.pick(["3", "5", "7", "8", "9"])}${Mock.Random.string("number", 9)}`,
      avatar: Mock.Random.image("100x100", Mock.Random.color(), "#fff", Mock.Random.first()),
      role: getRandomRole(),
      status: Mock.Random.pick(["active", "inactive", "suspended"]),
      department: Mock.Random.ctitle(2, 4) + "部",
      position: Mock.Random.ctitle(2, 3),
      bio: Mock.Random.cparagraph(1, 3),
      createdAt: Mock.Random.datetime("yyyy-MM-dd HH:mm:ss"),
      lastLoginAt: Mock.Random.datetime("yyyy-MM-dd HH:mm:ss"),
    },
  }
})

// 用户登录
Mock.mock("/api/user/login", "post", (options: { body: string }) => {
  const { email, password } = JSON.parse(options.body)
  if (email && password) {
    return {
      code: 200,
      message: "登录成功",
      data: {
        user: {
          id: Mock.Random.guid(),
          name: Mock.Random.cname(),
          email: email,
          avatar: Mock.Random.image("100x100", "#4A90E2", "#fff", "A"),
          role: roles[0], // admin
        },
        token: Random.guid(),
        expiresIn: 86400,
      },
    }
  }
  return {
    code: 401,
    message: "邮箱或密码错误",
    data: null,
  }
})

// 获取当前用户
Mock.mock("/api/user/current", "get", () => {
  return {
    code: 200,
    message: "success",
    data: {
      id: Mock.Random.guid(),
      name: Mock.Random.cname(),
      email: "admin@halolight.h7ml.cn",
      avatar: Mock.Random.image("100x100", "#4A90E2", "#fff", "A"),
      role: roles[0], // admin
      permissions: ["*"],
    },
  }
})

// 创建用户
Mock.mock("/api/users", "post", () => {
  return {
    code: 200,
    message: "创建成功",
    data: {
      id: Mock.Random.guid(),
      createdAt: Mock.Random.datetime("yyyy-MM-dd HH:mm:ss"),
    },
  }
})

// 更新用户
Mock.mock(/\/api\/users\/[a-zA-Z0-9-]+/, "put", () => {
  return {
    code: 200,
    message: "更新成功",
    data: {
      updatedAt: new Date().toISOString(),
    },
  }
})

// 删除用户
Mock.mock(/\/api\/users\/[a-zA-Z0-9-]+/, "delete", () => {
  return {
    code: 200,
    message: "删除成功",
    data: null,
  }
})

// 获取角色列表
Mock.mock("/api/roles", "get", () => {
  return {
    code: 200,
    message: "success",
    data: roles,
  }
})

const userMock = {}
export default userMock
