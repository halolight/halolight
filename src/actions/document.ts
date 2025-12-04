"use server"

import { revalidatePath, revalidateTag } from "next/cache"
import { cookies } from "next/headers"

import type { Document } from "@/lib/api/types"

const API_BASE = process.env.API_URL || process.env.NEXT_PUBLIC_API_URL || "/api"

// ============================================================================
// 类型定义
// ============================================================================

export interface ActionResult<T = void> {
  success: boolean
  data?: T
  error?: string
}

export interface DocumentFormData {
  name: string
  type: string
  folder?: string
  tags?: string[]
  shared?: boolean
}

export interface DocumentSearchParams {
  page?: number
  pageSize?: number
  type?: string
  folder?: string
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
// 文档管理 Actions
// ============================================================================

/**
 * 获取文档列表
 */
export async function getDocumentsAction(
  params?: DocumentSearchParams
): Promise<ActionResult<{ list: Document[]; total: number }>> {
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

    const result = await serverFetch<{ list: Document[]; total: number }>(
      `/documents${query ? `?${query}` : ""}`
    )

    return { success: true, data: result }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "获取文档列表失败",
    }
  }
}

/**
 * 获取单个文档
 */
export async function getDocumentAction(
  id: string
): Promise<ActionResult<Document>> {
  try {
    const document = await serverFetch<Document>(`/documents/${id}`)
    return { success: true, data: document }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "获取文档失败",
    }
  }
}

/**
 * 创建文档
 */
export async function createDocumentAction(
  formData: DocumentFormData
): Promise<ActionResult<Document>> {
  try {
    const document = await serverFetch<Document>("/documents", {
      method: "POST",
      body: JSON.stringify(formData),
    })

    revalidateTag("documents")
    revalidatePath("/documents")

    return { success: true, data: document }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "创建文档失败",
    }
  }
}

/**
 * 更新文档
 */
export async function updateDocumentAction(
  id: string,
  formData: Partial<DocumentFormData>
): Promise<ActionResult<Document>> {
  try {
    const document = await serverFetch<Document>(`/documents/${id}`, {
      method: "PUT",
      body: JSON.stringify(formData),
    })

    revalidateTag("documents")
    revalidatePath("/documents")
    revalidatePath(`/documents/${id}`)

    return { success: true, data: document }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "更新文档失败",
    }
  }
}

/**
 * 删除文档
 */
export async function deleteDocumentAction(id: string): Promise<ActionResult> {
  try {
    await serverFetch<void>(`/documents/${id}`, {
      method: "DELETE",
    })

    revalidateTag("documents")
    revalidatePath("/documents")

    return { success: true }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "删除文档失败",
    }
  }
}

/**
 * 批量删除文档
 */
export async function batchDeleteDocumentsAction(
  ids: string[]
): Promise<ActionResult> {
  try {
    await serverFetch<void>("/documents/batch-delete", {
      method: "POST",
      body: JSON.stringify({ ids }),
    })

    revalidateTag("documents")
    revalidatePath("/documents")

    return { success: true }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "批量删除失败",
    }
  }
}

/**
 * 分享文档
 */
export async function shareDocumentAction(
  id: string,
  userIds: string[]
): Promise<ActionResult<Document>> {
  try {
    const document = await serverFetch<Document>(`/documents/${id}/share`, {
      method: "POST",
      body: JSON.stringify({ userIds }),
    })

    revalidateTag("documents")
    revalidatePath("/documents")
    revalidatePath(`/documents/${id}`)

    return { success: true, data: document }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "分享文档失败",
    }
  }
}

/**
 * 取消分享
 */
export async function unshareDocumentAction(
  id: string,
  userIds?: string[]
): Promise<ActionResult<Document>> {
  try {
    const document = await serverFetch<Document>(`/documents/${id}/unshare`, {
      method: "POST",
      body: JSON.stringify({ userIds }),
    })

    revalidateTag("documents")
    revalidatePath("/documents")

    return { success: true, data: document }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "取消分享失败",
    }
  }
}

/**
 * 移动文档到文件夹
 */
export async function moveDocumentAction(
  id: string,
  folder: string
): Promise<ActionResult<Document>> {
  try {
    const document = await serverFetch<Document>(`/documents/${id}/move`, {
      method: "POST",
      body: JSON.stringify({ folder }),
    })

    revalidateTag("documents")
    revalidatePath("/documents")

    return { success: true, data: document }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "移动文档失败",
    }
  }
}

/**
 * 添加标签
 */
export async function addDocumentTagsAction(
  id: string,
  tags: string[]
): Promise<ActionResult<Document>> {
  try {
    const document = await serverFetch<Document>(`/documents/${id}/tags`, {
      method: "POST",
      body: JSON.stringify({ tags }),
    })

    revalidateTag("documents")
    revalidatePath("/documents")

    return { success: true, data: document }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "添加标签失败",
    }
  }
}

/**
 * 重命名文档
 */
export async function renameDocumentAction(
  id: string,
  name: string
): Promise<ActionResult<Document>> {
  try {
    const document = await serverFetch<Document>(`/documents/${id}/rename`, {
      method: "PATCH",
      body: JSON.stringify({ name }),
    })

    revalidateTag("documents")
    revalidatePath("/documents")

    return { success: true, data: document }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "重命名失败",
    }
  }
}
