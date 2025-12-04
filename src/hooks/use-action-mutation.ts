"use client"

import type { QueryKey } from "@tanstack/react-query"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useCallback } from "react"

import type { ActionResult } from "@/actions"

// ============================================================================
// 类型定义
// ============================================================================

type OptimisticUpdater<TVars> = (
  queryClient: ReturnType<typeof useQueryClient>,
  variables: TVars
) => void | (() => void)

interface ActionMutationOptions<TData, TVars> {
  /** 成功后失效的 query keys */
  invalidateKeys?: QueryKey[]
  /** 乐观更新函数，返回回滚函数 */
  optimisticUpdate?: OptimisticUpdater<TVars>
  /** 成功回调 */
  onSuccess?: (data: TData, variables: TVars) => void
  /** 错误回调 */
  onError?: (error: Error, variables: TVars) => void
  /** 完成回调（无论成功或失败） */
  onSettled?: (data: TData | undefined, error: Error | null, variables: TVars) => void
}

interface ActionMutationContext {
  rollback?: () => void
}

// ============================================================================
// Hook 实现
// ============================================================================

/**
 * Server Action Mutation Hook
 *
 * 将 Server Action 包装为 React Query mutation，支持：
 * - 自动处理 ActionResult 格式
 * - 乐观更新与回滚
 * - 自动失效相关 queries
 * - 错误处理
 *
 * @example
 * ```tsx
 * const { mutate, isPending } = useActionMutation(createUserAction, {
 *   invalidateKeys: [userKeys.lists()],
 *   onSuccess: (data) => toast.success(`用户 ${data.name} 创建成功`),
 * })
 *
 * // 调用
 * mutate({ name: "张三", email: "zhangsan@example.com" })
 * ```
 */
export function useActionMutation<TData, TVars>(
  action: (variables: TVars) => Promise<ActionResult<TData>>,
  options?: ActionMutationOptions<TData, TVars>
) {
  const queryClient = useQueryClient()

  const mutation = useMutation<TData, Error, TVars, ActionMutationContext>({
    mutationFn: async (variables) => {
      const result = await action(variables)

      if (!result.success) {
        throw new Error(result.error || "操作失败")
      }

      return result.data as TData
    },

    onMutate: async (variables) => {
      // 取消相关查询，避免竞态
      if (options?.invalidateKeys) {
        await Promise.all(
          options.invalidateKeys.map((key) =>
            queryClient.cancelQueries({ queryKey: key })
          )
        )
      }

      // 执行乐观更新
      const rollback = options?.optimisticUpdate?.(queryClient, variables)

      return {
        rollback: typeof rollback === "function" ? rollback : undefined,
      }
    },

    onError: (error, variables, context) => {
      // 回滚乐观更新
      context?.rollback?.()

      // 调用错误回调
      options?.onError?.(error, variables)
    },

    onSuccess: (data, variables) => {
      // 失效相关 queries
      options?.invalidateKeys?.forEach((key) => {
        queryClient.invalidateQueries({ queryKey: key })
      })

      // 调用成功回调
      options?.onSuccess?.(data, variables)
    },

    onSettled: (data, error, variables) => {
      options?.onSettled?.(data, error as Error | null, variables)
    },
  })

  return mutation
}

/**
 * 无数据返回的 Action Mutation Hook
 *
 * 用于删除等不返回数据的操作
 *
 * @example
 * ```tsx
 * const { mutate } = useActionMutationVoid(deleteUserAction, {
 *   invalidateKeys: [userKeys.lists()],
 * })
 *
 * mutate("user-id")
 * ```
 */
export function useActionMutationVoid<TVars>(
  action: (variables: TVars) => Promise<ActionResult<void>>,
  options?: Omit<ActionMutationOptions<void, TVars>, "onSuccess"> & {
    onSuccess?: (variables: TVars) => void
  }
) {
  const queryClient = useQueryClient()

  const mutation = useMutation<void, Error, TVars, ActionMutationContext>({
    mutationFn: async (variables) => {
      const result = await action(variables)

      if (!result.success) {
        throw new Error(result.error || "操作失败")
      }
    },

    onMutate: async (variables) => {
      if (options?.invalidateKeys) {
        await Promise.all(
          options.invalidateKeys.map((key) =>
            queryClient.cancelQueries({ queryKey: key })
          )
        )
      }

      const rollback = options?.optimisticUpdate?.(queryClient, variables)

      return {
        rollback: typeof rollback === "function" ? rollback : undefined,
      }
    },

    onError: (error, variables, context) => {
      context?.rollback?.()
      options?.onError?.(error, variables)
    },

    onSuccess: (_, variables) => {
      options?.invalidateKeys?.forEach((key) => {
        queryClient.invalidateQueries({ queryKey: key })
      })

      options?.onSuccess?.(variables)
    },

    onSettled: (_, error, variables) => {
      options?.onSettled?.(undefined, error as Error | null, variables)
    },
  })

  return mutation
}

/**
 * 批量操作的 Action Mutation Hook
 *
 * @example
 * ```tsx
 * const { mutate } = useBatchActionMutation(batchDeleteUsersAction, {
 *   invalidateKeys: [userKeys.lists()],
 * })
 *
 * mutate(["id1", "id2", "id3"])
 * ```
 */
export function useBatchActionMutation<TItem>(
  action: (items: TItem[]) => Promise<ActionResult<void>>,
  options?: Omit<ActionMutationOptions<void, TItem[]>, "onSuccess"> & {
    onSuccess?: (items: TItem[]) => void
  }
) {
  return useActionMutationVoid(action, options)
}

/**
 * 创建带预设选项的 mutation hook 工厂
 *
 * @example
 * ```tsx
 * const useCreateUser = createActionMutationHook(createUserAction, {
 *   invalidateKeys: [userKeys.lists()],
 * })
 *
 * // 在组件中使用
 * const { mutate } = useCreateUser({
 *   onSuccess: (data) => console.log(data),
 * })
 * ```
 */
export function createActionMutationHook<TData, TVars>(
  action: (variables: TVars) => Promise<ActionResult<TData>>,
  defaultOptions?: ActionMutationOptions<TData, TVars>
) {
  return function useCreatedMutation(
    overrideOptions?: Partial<ActionMutationOptions<TData, TVars>>
  ) {
    const mergedOptions = {
      ...defaultOptions,
      ...overrideOptions,
      invalidateKeys: [
        ...(defaultOptions?.invalidateKeys || []),
        ...(overrideOptions?.invalidateKeys || []),
      ],
    }

    return useActionMutation(action, mergedOptions)
  }
}

// ============================================================================
// 辅助 Hooks
// ============================================================================

/**
 * 创建乐观更新辅助函数
 */
export function useOptimisticUpdate<T>(queryKey: QueryKey) {
  const queryClient = useQueryClient()

  const update = useCallback(
    (updater: (old: T | undefined) => T) => {
      const previousData = queryClient.getQueryData<T>(queryKey)

      queryClient.setQueryData<T>(queryKey, (old) => updater(old))

      return () => {
        queryClient.setQueryData<T>(queryKey, previousData)
      }
    },
    [queryClient, queryKey]
  )

  return update
}

/**
 * 创建列表项乐观更新辅助函数
 */
export function useOptimisticListUpdate<T extends { id: string }>(
  queryKey: QueryKey
) {
  const queryClient = useQueryClient()

  const addItem = useCallback(
    (item: T) => {
      const previousData = queryClient.getQueryData<{ list: T[] }>(queryKey)

      queryClient.setQueryData<{ list: T[] }>(queryKey, (old) => ({
        ...old,
        list: [item, ...(old?.list || [])],
      }))

      return () => {
        queryClient.setQueryData(queryKey, previousData)
      }
    },
    [queryClient, queryKey]
  )

  const updateItem = useCallback(
    (id: string, updates: Partial<T>) => {
      const previousData = queryClient.getQueryData<{ list: T[] }>(queryKey)

      queryClient.setQueryData<{ list: T[] }>(queryKey, (old) => ({
        ...old,
        list:
          old?.list.map((item) =>
            item.id === id ? { ...item, ...updates } : item
          ) || [],
      }))

      return () => {
        queryClient.setQueryData(queryKey, previousData)
      }
    },
    [queryClient, queryKey]
  )

  const removeItem = useCallback(
    (id: string) => {
      const previousData = queryClient.getQueryData<{ list: T[] }>(queryKey)

      queryClient.setQueryData<{ list: T[] }>(queryKey, (old) => ({
        ...old,
        list: old?.list.filter((item) => item.id !== id) || [],
      }))

      return () => {
        queryClient.setQueryData(queryKey, previousData)
      }
    },
    [queryClient, queryKey]
  )

  return { addItem, updateItem, removeItem }
}
