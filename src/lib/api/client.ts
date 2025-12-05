import axios, { AxiosError, InternalAxiosRequestConfig } from "axios"
import Cookies from "js-cookie"

import {
  adaptBackendCurrentUserResponse,
  adaptBackendLoginResponse,
  adaptBackendRefreshResponse,
} from "./adapters"
import type {
  BackendCurrentUserResponse,
  BackendLoginResponse,
  BackendRefreshTokenResponse,
} from "./backend-types"
import { mockRoles } from "./mock-data"
import type { Role } from "./types"

// ============================================================================
// 环境配置
// ============================================================================

const IS_MOCK_MODE = process.env.NEXT_PUBLIC_MOCK === "true"
const API_PREFIX = "/api"

/**
 * API 基础 URL 配置
 * - Mock 模式: 使用 Next.js 路由代理 /api
 * - 真实模式: 使用完整的后端地址（去除末尾的 /api 避免重复）
 */
const NORMALIZED_API_BASE = (
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000"
).replace(/\/api\/?$/, "")

const API_BASE_URL = IS_MOCK_MODE ? API_PREFIX : NORMALIZED_API_BASE

// ============================================================================
// Token 存储管理
// ============================================================================

const TOKEN_KEYS = {
  ACCESS: "accessToken",
  REFRESH: "refreshToken",
  MOCK: "token",
} as const

/**
 * Token 存储助手
 * 统一管理 Cookie 中的 token，避免状态分散
 * - Mock 模式使用单一 token
 * - 真实模式使用 accessToken 和 refreshToken
 */
export const tokenStorage = {
  /**
   * 获取访问令牌
   */
  getAccessToken: (): string | undefined => {
    return IS_MOCK_MODE
      ? Cookies.get(TOKEN_KEYS.MOCK)
      : Cookies.get(TOKEN_KEYS.ACCESS)
  },

  /**
   * 获取刷新令牌（仅真实模式）
   */
  getRefreshToken: (): string | undefined => {
    return IS_MOCK_MODE
      ? Cookies.get(TOKEN_KEYS.MOCK)
      : Cookies.get(TOKEN_KEYS.REFRESH)
  },

  /**
   * 存储令牌
   * @param accessToken - 访问令牌
   * @param refreshToken - 刷新令牌（可选）
   * @param rememberDays - 记住天数，默认 7 天
   */
  setTokens: (
    accessToken: string,
    refreshToken?: string,
    rememberDays = 7
  ): void => {
    const cookieOptions = {
      expires: rememberDays,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict" as const,
    }

    if (IS_MOCK_MODE) {
      Cookies.set(TOKEN_KEYS.MOCK, accessToken, cookieOptions)
      return
    }

    Cookies.set(TOKEN_KEYS.ACCESS, accessToken, cookieOptions)
    if (refreshToken) {
      // refreshToken 有效期为 accessToken 的 4 倍
      Cookies.set(TOKEN_KEYS.REFRESH, refreshToken, {
        ...cookieOptions,
        expires: rememberDays * 4,
      })
    }
  },

  /**
   * 清除所有令牌
   */
  clear: (): void => {
    Cookies.remove(TOKEN_KEYS.ACCESS)
    Cookies.remove(TOKEN_KEYS.REFRESH)
    Cookies.remove(TOKEN_KEYS.MOCK)
  },
}

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
})

// ============================================================================
// Token 刷新机制
// ============================================================================

/**
 * Token 刷新状态管理
 * 使用队列机制避免并发刷新问题
 */
interface TokenRefreshState {
  isRefreshing: boolean
  refreshPromise: Promise<BackendRefreshTokenResponse> | null
  pendingRequests: Array<{
    resolve: (token: string) => void
    reject: (error: unknown) => void
  }>
}

const refreshState: TokenRefreshState = {
  isRefreshing: false,
  refreshPromise: null,
  pendingRequests: [],
}

/**
 * 将请求加入等待队列
 */
function enqueueRequest(
  resolve: (token: string) => void,
  reject: (error: unknown) => void
): void {
  refreshState.pendingRequests.push({ resolve, reject })
}

/**
 * 刷新完成后处理队列中的所有请求
 * @param error - 刷新错误（如果有）
 * @param token - 新的访问令牌
 */
function flushPendingRequests(error: unknown | null, token?: string): void {
  refreshState.pendingRequests.forEach((request) => {
    if (error) {
      request.reject(error)
    } else if (token) {
      request.resolve(token)
    }
  })
  refreshState.pendingRequests.length = 0
}

/**
 * 刷新访问令牌
 * 使用独立的 axios 实例避免触发拦截器造成循环
 */
async function refreshAccessToken(): Promise<BackendRefreshTokenResponse> {
  const refreshToken = tokenStorage.getRefreshToken()

  if (!refreshToken) {
    throw new Error("No refresh token available")
  }

  try {
    // 使用独立的 axios 实例，完整URL路径避免拦截器循环
    const response = await axios.post<BackendRefreshTokenResponse>(
      `${NORMALIZED_API_BASE}${API_PREFIX}/auth/refresh`,
      { refreshToken },
      {
        headers: {
          "Content-Type": "application/json",
        },
        timeout: 10000,
      }
    )

    const { accessToken, refreshToken: newRefreshToken } = response.data

    // 存储新的 tokens
    tokenStorage.setTokens(accessToken, newRefreshToken)

    return response.data
  } catch (error) {
    // 刷新失败，清除所有 tokens 并跳转登录
    tokenStorage.clear()

    if (typeof window !== "undefined") {
      window.location.href = "/login"
    }

    throw error
  }
}

// ============================================================================
// 请求拦截器
// ============================================================================

apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = tokenStorage.getAccessToken()

    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`
    }

    return config
  },
  (error: AxiosError) => Promise.reject(error)
)

// ============================================================================
// 响应拦截器
// ============================================================================

apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & {
      _retry?: boolean
    }

    // Mock 模式：简单处理 401 错误
    if (IS_MOCK_MODE) {
      if (error.response?.status === 401) {
        tokenStorage.clear()
        if (typeof window !== "undefined") {
          window.location.href = "/login"
        }
      }
      return Promise.reject(error)
    }

    // 真实 API 模式：实现 token 刷新逻辑
    // 只处理 401 错误且有原始请求配置的情况
    if (error.response?.status !== 401 || !originalRequest) {
      return Promise.reject(error)
    }

    // 如果已经重试过，清除 token 并跳转登录
    if (originalRequest._retry) {
      tokenStorage.clear()
      if (typeof window !== "undefined") {
        window.location.href = "/login"
      }
      return Promise.reject(error)
    }

    // 标记为已重试
    originalRequest._retry = true

    // 如果正在刷新，将请求加入队列
    if (refreshState.isRefreshing) {
      return new Promise((resolve, reject) => {
        enqueueRequest(
          (token: string) => {
            if (originalRequest.headers) {
              originalRequest.headers.Authorization = `Bearer ${token}`
            }
            resolve(apiClient(originalRequest))
          },
          (err: unknown) => {
            reject(err)
          }
        )
      })
    }

    // 开始刷新流程
    refreshState.isRefreshing = true
    refreshState.refreshPromise = refreshAccessToken()

    try {
      const refreshResponse = await refreshState.refreshPromise
      const { accessToken } = adaptBackendRefreshResponse(refreshResponse)

      // 更新原始请求的 token
      if (originalRequest.headers) {
        originalRequest.headers.Authorization = `Bearer ${accessToken}`
      }

      // 处理队列中的所有请求
      flushPendingRequests(null, accessToken)

      // 重试原始请求
      return apiClient(originalRequest)
    } catch (refreshError) {
      // 刷新失败，拒绝队列中的所有请求
      flushPendingRequests(refreshError)
      return Promise.reject(refreshError)
    } finally {
      refreshState.isRefreshing = false
      refreshState.refreshPromise = null
    }
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
  username?: string
  password: string
  confirmPassword: string
  phone?: string
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

// ============================================================================
// Mock API 函数（Mock 模式使用）
// ============================================================================

const mockLogin = async (data: LoginRequest): Promise<LoginResponse> => {
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
}

const mockRegister = async (data: RegisterRequest): Promise<LoginResponse> => {
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
}

const mockGetCurrentUser = async (): Promise<CurrentUserResponse | null> => {
  const token = Cookies.get("token")
  if (!token) return null

  const account = findAccountByToken(token)
  if (!account) return null

  return {
    user: account,
    accounts: [...mockAccounts],
  }
}

// ============================================================================
// Auth API
// ============================================================================

export const authApi = {
  /**
   * 用户登录
   */
  login: async (data: LoginRequest): Promise<LoginResponse> => {
    if (IS_MOCK_MODE) {
      return mockLogin(data)
    }

    // 真实 API 调用
    const response = await apiClient.post<BackendLoginResponse>(
      `${API_PREFIX}/auth/login`,
      {
        email: data.email,
        password: data.password,
      }
    )

    const loginResponse = adaptBackendLoginResponse(response.data)

    // 存储 tokens（记住登录状态影响过期时间）
    tokenStorage.setTokens(
      response.data.accessToken,
      response.data.refreshToken,
      data.remember ? 7 : 1
    )

    return loginResponse
  },

  /**
   * 用户注册
   */
  register: async (data: RegisterRequest): Promise<LoginResponse> => {
    if (IS_MOCK_MODE) {
      return mockRegister(data)
    }

    // 真实 API 调用
    // 后端期望: email, username, password, name, phone?
    const response = await apiClient.post<BackendLoginResponse>(
      `${API_PREFIX}/auth/register`,
      {
        email: data.email,
        username: data.username || data.email.split("@")[0], // 默认使用邮箱前缀作为用户名
        name: data.name,
        password: data.password,
        ...(data.phone && { phone: data.phone }),
      }
    )

    const loginResponse = adaptBackendLoginResponse(response.data)

    // 注册后自动登录，默认记住 7 天
    tokenStorage.setTokens(response.data.accessToken, response.data.refreshToken)

    return loginResponse
  },

  /**
   * 忘记密码
   */
  forgotPassword: async (email: string): Promise<void> => {
    if (IS_MOCK_MODE) {
      await new Promise((resolve) => setTimeout(resolve, 500))
      console.log("发送重置密码邮件到:", email)
      return
    }

    await apiClient.post(`${API_PREFIX}/auth/forgot-password`, { email })
  },

  /**
   * 重置密码
   */
  resetPassword: async (token: string, password: string): Promise<void> => {
    if (IS_MOCK_MODE) {
      await new Promise((resolve) => setTimeout(resolve, 500))
      console.log("重置密码:", token, password)
      return
    }

    await apiClient.post(`${API_PREFIX}/auth/reset-password`, {
      token,
      password,
    })
  },

  /**
   * 登出
   */
  logout: async (): Promise<void> => {
    if (IS_MOCK_MODE) {
      tokenStorage.clear()
      return
    }

    try {
      await apiClient.post(`${API_PREFIX}/auth/logout`)
    } finally {
      tokenStorage.clear()
    }
  },

  /**
   * 获取当前用户信息
   */
  getCurrentUser: async (): Promise<CurrentUserResponse | null> => {
    if (IS_MOCK_MODE) {
      return mockGetCurrentUser()
    }

    const token = tokenStorage.getAccessToken()
    if (!token) return null

    try {
      const response = await apiClient.get<BackendCurrentUserResponse>(
        `${API_PREFIX}/auth/me`
      )

      return adaptBackendCurrentUserResponse(response.data)
    } catch (error) {
      console.error("获取当前用户失败:", error)
      return null
    }
  },

  /**
   * 获取账号列表（多账号支持）
   */
  getAccounts: async (): Promise<AccountWithToken[]> => {
    if (IS_MOCK_MODE) {
      await new Promise((resolve) => setTimeout(resolve, 200))
      return [...mockAccounts]
    }

    // 真实 API 暂不支持多账号
    return []
  },
}

export default apiClient
