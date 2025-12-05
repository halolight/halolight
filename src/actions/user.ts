"use server"

import { revalidatePath, revalidateTag } from "next/cache"
import { cookies } from "next/headers"

import { adaptBackendUser } from "@/lib/api/adapters"
import type { BackendUser } from "@/lib/api/backend-types"
import type { User } from "@/lib/api/types"

const API_BASE = process.env.API_URL || process.env.NEXT_PUBLIC_API_URL || "/api"
const IS_MOCK_MODE = process.env.NEXT_PUBLIC_MOCK === "true"

// ============================================================================
// 类型定义
// ============================================================================

export interface ActionResult<T = void> {
  success: boolean
  data?: T
  error?: string
}

export interface LoginFormData {
  email: string
  password: string
  remember?: boolean
}

export interface UserFormData {
  name: string
  email: string
  roleId?: string
  status?: "active" | "inactive" | "suspended"
  avatar?: string
  phone?: string
  department?: string
  position?: string
  bio?: string
}

// ============================================================================
// 辅助函数
// ============================================================================

async function serverFetch<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const cookieStore = await cookies()

  // Mock 模式使用 token，真实模式使用 accessToken
  const token = IS_MOCK_MODE
    ? cookieStore.get("token")?.value
    : cookieStore.get("accessToken")?.value

  const response = await fetch(`${API_BASE}${endpoint}`, {
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
    ...options,
  })

  if (!response.ok) {
    throw new Error(`HTTP ${response.status}: ${response.statusText}`)
  }

  const data = await response.json()

  // Mock 模式：期望返回 { code: 200, data: T, message: string }
  if (IS_MOCK_MODE) {
    if (data.code !== 200 && data.code !== 0) {
      throw new Error(data.message || "请求失败")
    }
    return data.data
  }

  // 真实 API 模式：直接返回数据
  // 后端返回格式可能是：
  // 1. 直接返回实体对象 (如 User)
  // 2. 分页格式 {data: [], meta: {total, page, limit}}
  return data as T
}

// ============================================================================
// 认证相关 Actions
// ============================================================================

/**
 * 用户登录
 */
export async function loginAction(
  formData: LoginFormData
): Promise<ActionResult<{ user: User; token: string }>> {
  try {
    if (IS_MOCK_MODE) {
      // Mock 模式
      const result = await serverFetch<{ user: User; token: string }>(
        "/user/login",
        {
          method: "POST",
          body: JSON.stringify({
            email: formData.email,
            password: formData.password,
          }),
        }
      )

      // 设置 cookie
      const cookieStore = await cookies()
      const maxAge = formData.remember ? 7 * 24 * 60 * 60 : 24 * 60 * 60

      cookieStore.set("token", result.token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge,
        path: "/",
      })

      revalidatePath("/")

      return { success: true, data: result }
    } else {
      // 真实 API 模式
      // 后端返回 { accessToken, refreshToken, user: BackendUser }
      const response = await fetch(`${API_BASE}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.message || `登录失败: ${response.statusText}`)
      }

      const data = await response.json()

      // 适配后端用户数据
      const user = adaptBackendUser(data.user)

      // 设置 cookies
      const cookieStore = await cookies()
      const maxAge = formData.remember ? 7 * 24 * 60 * 60 : 24 * 60 * 60

      cookieStore.set("accessToken", data.accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge,
        path: "/",
      })

      cookieStore.set("refreshToken", data.refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 30 * 24 * 60 * 60, // 30 天
        path: "/",
      })

      revalidatePath("/")

      return {
        success: true,
        data: { user, token: data.accessToken },
      }
    }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "登录失败",
    }
  }
}

/**
 * 用户登出
 */
export async function logoutAction(): Promise<ActionResult> {
  try {
    const cookieStore = await cookies()

    if (IS_MOCK_MODE) {
      cookieStore.delete("token")
    } else {
      // 真实 API 模式：调用登出接口
      const token = cookieStore.get("accessToken")?.value
      if (token) {
        try {
          await fetch(`${API_BASE}/auth/logout`, {
            method: "POST",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          })
        } catch (error) {
          // 即使登出接口失败，也要清除本地 cookies
          console.error("Logout API failed:", error)
        }
      }

      cookieStore.delete("accessToken")
      cookieStore.delete("refreshToken")
    }

    revalidatePath("/")

    return { success: true }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "登出失败",
    }
  }
}

/**
 * 获取当前用户信息
 */
export async function getCurrentUserAction(): Promise<ActionResult<User>> {
  try {
    if (IS_MOCK_MODE) {
      const user = await serverFetch<User>("/user/current")
      return { success: true, data: user }
    } else {
      // 真实 API 模式：调用 /api/auth/me，返回 BackendUser，需要适配
      const backendUser = await serverFetch<BackendUser>("/auth/me")
      const user = adaptBackendUser(backendUser)
      return { success: true, data: user }
    }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "获取用户信息失败",
    }
  }
}

// ============================================================================
// 用户管理 Actions
// ============================================================================

/**
 * 获取用户列表
 */
export async function getUsersAction(params?: {
  page?: number
  pageSize?: number
  keyword?: string
}): Promise<ActionResult<{ list: User[]; total: number }>> {
  try {
    const query = new URLSearchParams(
      Object.entries(params || {}).reduce(
        (acc, [key, value]) => {
          if (value !== undefined) acc[key] = String(value)
          return acc
        },
        {} as Record<string, string>
      )
    ).toString()

    if (IS_MOCK_MODE) {
      const result = await serverFetch<{ list: User[]; total: number }>(
        `/users${query ? `?${query}` : ""}`
      )
      return { success: true, data: result }
    } else {
      // 真实 API 模式：返回 { data: BackendUser[], meta: { total, page, limit } }
      const result = await serverFetch<{
        data: BackendUser[]
        meta: { total: number; page: number; limit: number }
      }>(`/users${query ? `?${query}` : ""}`)

      // 适配后端用户数据
      const users = result.data.map(adaptBackendUser)

      return {
        success: true,
        data: { list: users, total: result.meta.total },
      }
    }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "获取用户列表失败",
    }
  }
}

/**
 * 创建用户
 */
export async function createUserAction(
  formData: UserFormData
): Promise<ActionResult<User>> {
  try {
    if (IS_MOCK_MODE) {
      const user = await serverFetch<User>("/users", {
        method: "POST",
        body: JSON.stringify(formData),
      })

      revalidateTag("users")
      revalidatePath("/users")

      return { success: true, data: user }
    } else {
      // 真实 API 模式：返回 BackendUser
      const backendUser = await serverFetch<BackendUser>("/users", {
        method: "POST",
        body: JSON.stringify(formData),
      })

      const user = adaptBackendUser(backendUser)

      revalidateTag("users")
      revalidatePath("/users")

      return { success: true, data: user }
    }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "创建用户失败",
    }
  }
}

/**
 * 更新用户
 */
export async function updateUserAction(
  id: string,
  formData: Partial<UserFormData>
): Promise<ActionResult<User>> {
  try {
    if (IS_MOCK_MODE) {
      const user = await serverFetch<User>(`/users/${id}`, {
        method: "PUT",
        body: JSON.stringify(formData),
      })

      revalidateTag("users")
      revalidatePath("/users")
      revalidatePath(`/users/${id}`)

      return { success: true, data: user }
    } else {
      // 真实 API 模式：返回 BackendUser
      const backendUser = await serverFetch<BackendUser>(`/users/${id}`, {
        method: "PUT",
        body: JSON.stringify(formData),
      })

      const user = adaptBackendUser(backendUser)

      revalidateTag("users")
      revalidatePath("/users")
      revalidatePath(`/users/${id}`)

      return { success: true, data: user }
    }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "更新用户失败",
    }
  }
}

/**
 * 删除用户
 */
export async function deleteUserAction(id: string): Promise<ActionResult> {
  try {
    await serverFetch<void>(`/users/${id}`, {
      method: "DELETE",
    })

    revalidateTag("users")
    revalidatePath("/users")

    return { success: true }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "删除用户失败",
    }
  }
}

/**
 * 批量删除用户
 */
export async function batchDeleteUsersAction(
  ids: string[]
): Promise<ActionResult> {
  try {
    await serverFetch<void>("/users/batch-delete", {
      method: "POST",
      body: JSON.stringify({ ids }),
    })

    revalidateTag("users")
    revalidatePath("/users")

    return { success: true }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "批量删除失败",
    }
  }
}

/**
 * 更新用户状态
 */
export async function updateUserStatusAction(
  id: string,
  status: "active" | "inactive" | "suspended"
): Promise<ActionResult<User>> {
  try {
    if (IS_MOCK_MODE) {
      const user = await serverFetch<User>(`/users/${id}/status`, {
        method: "PATCH",
        body: JSON.stringify({ status }),
      })

      revalidateTag("users")
      revalidatePath("/users")

      return { success: true, data: user }
    } else {
      // 真实 API 模式：返回 BackendUser
      const backendUser = await serverFetch<BackendUser>(`/users/${id}/status`, {
        method: "PATCH",
        body: JSON.stringify({ status }),
      })

      const user = adaptBackendUser(backendUser)

      revalidateTag("users")
      revalidatePath("/users")

      return { success: true, data: user }
    }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "更新状态失败",
    }
  }
}
