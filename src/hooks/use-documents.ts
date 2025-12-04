"use client"

import { useQuery } from "@tanstack/react-query"

import type { DocumentFormData } from "@/actions"
import {
  batchDeleteDocumentsAction,
  createDocumentAction,
  deleteDocumentAction,
  updateDocumentAction,
} from "@/actions"
import { apiRouter } from "@/lib/api/api-router"
import type { Document } from "@/lib/api/types"
import { documentKeys } from "@/lib/query-keys"

import {
  useActionMutation,
  useActionMutationVoid,
  useBatchActionMutation,
  useOptimisticListUpdate,
} from "./use-action-mutation"

// ============================================================================
// 查询 Hooks
// ============================================================================

/**
 * 获取文档列表
 */
export function useDocuments(params?: {
  page?: number
  pageSize?: number
  type?: string
  search?: string
}) {
  return useQuery({
    queryKey: documentKeys.list(params || {}),
    queryFn: async () => {
      const response = await apiRouter.document.getDocuments(params)
      return response.data
    },
  })
}

/**
 * 获取单个文档
 */
export function useDocument(id: string) {
  return useQuery({
    queryKey: documentKeys.detail(id),
    queryFn: async () => {
      const response = await apiRouter.document.getDocument(id)
      return response.data
    },
    enabled: !!id,
  })
}

// ============================================================================
// Mutation Hooks（使用 Server Actions）
// ============================================================================

/**
 * 创建文档
 *
 * @example
 * ```tsx
 * const { mutate, isPending } = useCreateDocument()
 *
 * mutate({
 *   name: "新文档",
 *   type: "document",
 * })
 * ```
 */
export function useCreateDocument(options?: {
  onSuccess?: (data: Document) => void
  onError?: (error: Error) => void
}) {
  return useActionMutation<Document, DocumentFormData>(createDocumentAction, {
    invalidateKeys: [documentKeys.lists()],
    onSuccess: options?.onSuccess,
    onError: options?.onError,
  })
}

/**
 * 更新文档
 *
 * @example
 * ```tsx
 * const { mutate } = useUpdateDocument()
 *
 * mutate({
 *   id: "doc-id",
 *   data: { name: "新名称" },
 * })
 * ```
 */
export function useUpdateDocument(options?: {
  onSuccess?: (data: Document) => void
  onError?: (error: Error) => void
}) {
  return useActionMutation<Document, { id: string; data: Partial<DocumentFormData> }>(
    async ({ id, data }) => {
      return updateDocumentAction(id, data)
    },
    {
      invalidateKeys: [documentKeys.lists()],
      onSuccess: options?.onSuccess,
      onError: options?.onError,
    }
  )
}

/**
 * 删除文档
 *
 * @example
 * ```tsx
 * const { mutate } = useDeleteDocument()
 *
 * mutate("doc-id")
 * ```
 */
export function useDeleteDocument(options?: {
  onSuccess?: (id: string) => void
  onError?: (error: Error) => void
}) {
  const { removeItem } = useOptimisticListUpdate<Document>(documentKeys.lists())

  return useActionMutationVoid<string>(deleteDocumentAction, {
    invalidateKeys: [documentKeys.lists()],
    optimisticUpdate: (_, id) => removeItem(id),
    onSuccess: options?.onSuccess,
    onError: options?.onError,
  })
}

/**
 * 批量删除文档
 *
 * @example
 * ```tsx
 * const { mutate } = useBatchDeleteDocuments()
 *
 * mutate(["id1", "id2", "id3"])
 * ```
 */
export function useBatchDeleteDocuments(options?: {
  onSuccess?: (ids: string[]) => void
  onError?: (error: Error) => void
}) {
  return useBatchActionMutation<string>(batchDeleteDocumentsAction, {
    invalidateKeys: [documentKeys.lists()],
    optimisticUpdate: (queryClient, ids) => {
      const queryKey = documentKeys.lists()
      const previousData = queryClient.getQueryData<{ list: Document[] }>(queryKey)

      if (previousData) {
        queryClient.setQueryData<{ list: Document[] }>(queryKey, {
          ...previousData,
          list: previousData.list.filter((doc) => !ids.includes(doc.id)),
        })
      }

      return () => {
        if (previousData) {
          queryClient.setQueryData(queryKey, previousData)
        }
      }
    },
    onSuccess: options?.onSuccess,
    onError: options?.onError,
  })
}

// ============================================================================
// 重新导出 Query Keys（便于外部使用）
// ============================================================================

export { documentKeys }
