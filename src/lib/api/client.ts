import axios, { AxiosError, InternalAxiosRequestConfig } from "axios"
import Cookies from "js-cookie"

import { mockRoles } from "./mock-data"
import type { Role } from "./types"

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "/api"

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
})

// 请求拦截器
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = Cookies.get("token")
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error: AxiosError) => {
    return Promise.reject(error)
  }
)

// 响应拦截器
apiClient.interceptors.response.use(
  (response) => {
    return response
  },
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      Cookies.remove("token")
      if (typeof window !== "undefined") {
        window.location.href = "/login"
      }
    }
    return Promise.reject(error)
  }
)

// API 响应类型
export interface ApiResponse<T = unknown> {
  code: number
  message: string
  data: T
}

// 用户相关类型（带权限的账号信息）
export interface User {
  id: string
  email: string
  name: string
  avatar?: string
  role: Role
  status?: "active" | "inactive" | "suspended"
  createdAt: string
  lastLoginAt?: string
}

export interface AccountWithToken extends User {
  token: string
}

export interface LoginRequest {
  email: string
  password: string
  remember?: boolean
}

export interface RegisterRequest {
  name: string
  email: string
  password: string
  confirmPassword: string
}

export interface LoginResponse {
  user: AccountWithToken
  token: string
  expiresIn: number
  accounts: AccountWithToken[]
}

export interface CurrentUserResponse {
  user: AccountWithToken
  accounts: AccountWithToken[]
}

// 内置多账号示例（模拟多租户/多角色）
const mockAccounts: AccountWithToken[] = [
  {
    id: "acc-admin",
    email: "admin@halolight.h7ml.cn",
    name: "主账号（管理员）",
    avatar: "/avatars/1.png",
    role: mockRoles[0],
    status: "active",
    createdAt: new Date().toISOString(),
    lastLoginAt: new Date().toISOString(),
    token: "mock_token_acc-admin",
  },
  {
    id: "acc-ops",
    email: "ops@halolight.h7ml.cn",
    name: "日常运营账号",
    avatar: "/avatars/2.png",
    role: mockRoles[1],
    status: "active",
    createdAt: new Date().toISOString(),
    lastLoginAt: new Date(Date.now() - 1000 * 60 * 60 * 6).toISOString(),
    token: "mock_token_acc-ops",
  },
  {
    id: "acc-editor",
    email: "editor@halolight.h7ml.cn",
    name: "内容编辑账号",
    avatar: "/avatars/3.png",
    role: mockRoles[2],
    status: "active",
    createdAt: new Date().toISOString(),
    lastLoginAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
    token: "mock_token_acc-editor",
  },
]

const buildToken = (accountId: string) => `mock_token_${accountId}`

const findAccountByEmail = (email: string) =>
  mockAccounts.find((account) => account.email === email)

const findAccountByToken = (token: string) =>
  mockAccounts.find((account) => account.token === token)

// 模拟 API 调用（实际项目中替换为真实 API）
export const authApi = {
  login: async (data: LoginRequest): Promise<LoginResponse> => {
    await new Promise((resolve) => setTimeout(resolve, 500))

    const account = findAccountByEmail(data.email)
    if (!account || data.password !== "123456") {
      throw new Error("邮箱或密码错误")
    }

    const token = buildToken(account.id)
    const hydratedAccount: AccountWithToken = { ...account, token }

    return {
      user: hydratedAccount,
      token,
      expiresIn: 86400,
      accounts: mockAccounts.map((item) =>
        item.id === account.id ? hydratedAccount : item
      ),
    }
  },

  register: async (data: RegisterRequest): Promise<LoginResponse> => {
    await new Promise((resolve) => setTimeout(resolve, 500))

    if (data.password !== data.confirmPassword) {
      throw new Error("两次密码输入不一致")
    }

    const accountId = `acc-${Date.now()}`
    const newAccount: AccountWithToken = {
      id: accountId,
      email: data.email,
      name: data.name,
      avatar: "/avatars/4.png",
      role: mockRoles[3],
      status: "active",
      createdAt: new Date().toISOString(),
      lastLoginAt: new Date().toISOString(),
      token: buildToken(accountId),
    }

    mockAccounts.push(newAccount)

    return {
      user: newAccount,
      token: newAccount.token,
      expiresIn: 86400,
      accounts: [...mockAccounts],
    }
  },

  forgotPassword: async (email: string): Promise<void> => {
    await new Promise((resolve) => setTimeout(resolve, 500))
    console.log("发送重置密码邮件到:", email)
  },

  resetPassword: async (token: string, password: string): Promise<void> => {
    await new Promise((resolve) => setTimeout(resolve, 500))
    console.log("重置密码:", token, password)
  },

  logout: async (): Promise<void> => {
    Cookies.remove("token")
  },

  getCurrentUser: async (): Promise<CurrentUserResponse | null> => {
    const token = Cookies.get("token")
    if (!token) return null

    const account = findAccountByToken(token)
    if (!account) return null

    return {
      user: account,
      accounts: [...mockAccounts],
    }
  },

  getAccounts: async (): Promise<AccountWithToken[]> => {
    await new Promise((resolve) => setTimeout(resolve, 200))
    return [...mockAccounts]
  },
}

export default apiClient
