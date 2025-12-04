"use server"

import { revalidatePath, revalidateTag } from "next/cache"
import { cookies } from "next/headers"

import type { FileItem, StorageInfo } from "@/lib/api/types"

const API_BASE = process.env.API_URL || process.env.NEXT_PUBLIC_API_URL || "/api"

// ============================================================================
// 类型定义
// ============================================================================

export interface ActionResult<T = void> {
  success: boolean
  data?: T
  error?: string
}

export interface FileUploadResult {
  id: string
  name: string
  url: string
  size: number
  type: string
}

export interface FileSearchParams {
  page?: number
  pageSize?: number
  type?: string
  path?: string
  search?: string
}

// ============================================================================
// 辅助函数
// ============================================================================

async function serverFetch<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const cookieStore = await cookies()
  const token = cookieStore.get("token")?.value

  const response = await fetch(`${API_BASE}${endpoint}`, {
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
    ...options,
  })

  const data = await response.json()

  if (data.code !== 200 && data.code !== 0) {
    throw new Error(data.message || "请求失败")
  }

  return data.data
}

// ============================================================================
// 文件管理 Actions
// ============================================================================

/**
 * 获取文件列表
 */
export async function getFilesAction(
  params?: FileSearchParams
): Promise<ActionResult<{ list: FileItem[]; total: number }>> {
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

    const result = await serverFetch<{ list: FileItem[]; total: number }>(
      `/files${query ? `?${query}` : ""}`
    )

    return { success: true, data: result }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "获取文件列表失败",
    }
  }
}

/**
 * 获取存储信息
 */
export async function getStorageInfoAction(): Promise<
  ActionResult<StorageInfo>
> {
  try {
    const info = await serverFetch<StorageInfo>("/files/storage-info")
    return { success: true, data: info }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "获取存储信息失败",
    }
  }
}

/**
 * 创建文件夹
 */
export async function createFolderAction(
  name: string,
  parentPath?: string
): Promise<ActionResult<FileItem>> {
  try {
    const folder = await serverFetch<FileItem>("/files/folder", {
      method: "POST",
      body: JSON.stringify({ name, parentPath }),
    })

    revalidateTag("files")
    revalidatePath("/files")

    return { success: true, data: folder }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "创建文件夹失败",
    }
  }
}

/**
 * 删除文件/文件夹
 */
export async function deleteFileAction(id: string): Promise<ActionResult> {
  try {
    await serverFetch<void>(`/files/${id}`, {
      method: "DELETE",
    })

    revalidateTag("files")
    revalidatePath("/files")

    return { success: true }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "删除失败",
    }
  }
}

/**
 * 批量删除文件
 */
export async function batchDeleteFilesAction(
  ids: string[]
): Promise<ActionResult> {
  try {
    await serverFetch<void>("/files/batch-delete", {
      method: "POST",
      body: JSON.stringify({ ids }),
    })

    revalidateTag("files")
    revalidatePath("/files")

    return { success: true }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "批量删除失败",
    }
  }
}

/**
 * 重命名文件/文件夹
 */
export async function renameFileAction(
  id: string,
  name: string
): Promise<ActionResult<FileItem>> {
  try {
    const file = await serverFetch<FileItem>(`/files/${id}/rename`, {
      method: "PATCH",
      body: JSON.stringify({ name }),
    })

    revalidateTag("files")
    revalidatePath("/files")

    return { success: true, data: file }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "重命名失败",
    }
  }
}

/**
 * 移动文件/文件夹
 */
export async function moveFileAction(
  id: string,
  targetPath: string
): Promise<ActionResult<FileItem>> {
  try {
    const file = await serverFetch<FileItem>(`/files/${id}/move`, {
      method: "POST",
      body: JSON.stringify({ targetPath }),
    })

    revalidateTag("files")
    revalidatePath("/files")

    return { success: true, data: file }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "移动失败",
    }
  }
}

/**
 * 复制文件
 */
export async function copyFileAction(
  id: string,
  targetPath: string
): Promise<ActionResult<FileItem>> {
  try {
    const file = await serverFetch<FileItem>(`/files/${id}/copy`, {
      method: "POST",
      body: JSON.stringify({ targetPath }),
    })

    revalidateTag("files")
    revalidatePath("/files")

    return { success: true, data: file }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "复制失败",
    }
  }
}

/**
 * 获取文件下载链接
 */
export async function getFileDownloadUrlAction(
  id: string
): Promise<ActionResult<{ url: string; expiresAt: string }>> {
  try {
    const result = await serverFetch<{ url: string; expiresAt: string }>(
      `/files/${id}/download-url`
    )
    return { success: true, data: result }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "获取下载链接失败",
    }
  }
}

/**
 * 收藏/取消收藏文件
 */
export async function toggleFileFavoriteAction(
  id: string,
  favorite: boolean
): Promise<ActionResult<FileItem>> {
  try {
    const file = await serverFetch<FileItem>(`/files/${id}/favorite`, {
      method: "PATCH",
      body: JSON.stringify({ favorite }),
    })

    revalidateTag("files")
    revalidatePath("/files")

    return { success: true, data: file }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "操作失败",
    }
  }
}

/**
 * 分享文件
 */
export async function shareFileAction(
  id: string,
  options?: {
    expiresIn?: number // 过期时间（小时）
    password?: string
  }
): Promise<ActionResult<{ shareUrl: string; password?: string }>> {
  try {
    const result = await serverFetch<{ shareUrl: string; password?: string }>(
      `/files/${id}/share`,
      {
        method: "POST",
        body: JSON.stringify(options || {}),
      }
    )

    return { success: true, data: result }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "分享失败",
    }
  }
}
