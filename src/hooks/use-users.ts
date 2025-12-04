"use client"

import { useQuery } from "@tanstack/react-query"

import type { UserFormData } from "@/actions"
import {
  batchDeleteUsersAction,
  createUserAction,
  deleteUserAction,
  updateUserAction,
  updateUserStatusAction,
} from "@/actions"
import { apiRouter } from "@/lib/api/api-router"
import type { User, UserStatus } from "@/lib/api/types"
import { userKeys } from "@/lib/query-keys"

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
 * 获取用户列表
 */
export function useUsers(params?: {
  page?: number
  pageSize?: number
  search?: string
  status?: string
  role?: string
}) {
  return useQuery({
    queryKey: userKeys.list(params || {}),
    queryFn: async () => {
      const response = await apiRouter.user.getUsers(params)
      return response.data
    },
  })
}

/**
 * 获取单个用户
 */
export function useUser(id: string) {
  return useQuery({
    queryKey: userKeys.detail(id),
    queryFn: async () => {
      const response = await apiRouter.user.getUser(id)
      return response.data
    },
    enabled: !!id,
  })
}

/**
 * 获取角色列表
 */
export function useRoles() {
  return useQuery({
    queryKey: userKeys.all,
    queryFn: async () => {
      const response = await apiRouter.role.getRoles()
      return response.data
    },
  })
}

// ============================================================================
// Mutation Hooks（使用 Server Actions）
// ============================================================================

/**
 * 创建用户
 *
 * @example
 * ```tsx
 * const { mutate, isPending } = useCreateUser()
 *
 * mutate({
 *   name: "张三",
 *   email: "zhangsan@example.com",
 *   role: "user",
 * })
 * ```
 */
export function useCreateUser(options?: {
  onSuccess?: (data: User) => void
  onError?: (error: Error) => void
}) {
  return useActionMutation<User, UserFormData>(createUserAction, {
    invalidateKeys: [userKeys.lists()],
    onSuccess: options?.onSuccess,
    onError: options?.onError,
  })
}

/**
 * 更新用户
 *
 * @example
 * ```tsx
 * const { mutate } = useUpdateUser()
 *
 * mutate({
 *   id: "user-id",
 *   data: { name: "新名字" },
 * })
 * ```
 */
export function useUpdateUser(options?: {
  onSuccess?: (data: User) => void
  onError?: (error: Error) => void
}) {
  return useActionMutation<User, { id: string; data: Partial<UserFormData> }>(
    async ({ id, data }) => {
      return updateUserAction(id, data)
    },
    {
      invalidateKeys: [userKeys.lists()],
      onSuccess: options?.onSuccess,
      onError: options?.onError,
    }
  )
}

/**
 * 删除用户
 *
 * @example
 * ```tsx
 * const { mutate } = useDeleteUser()
 *
 * mutate("user-id")
 * ```
 */
export function useDeleteUser(options?: {
  onSuccess?: (id: string) => void
  onError?: (error: Error) => void
}) {
  const { removeItem } = useOptimisticListUpdate<User>(userKeys.lists())

  return useActionMutationVoid<string>(deleteUserAction, {
    invalidateKeys: [userKeys.lists()],
    optimisticUpdate: (_, id) => removeItem(id),
    onSuccess: options?.onSuccess,
    onError: options?.onError,
  })
}

/**
 * 批量删除用户
 *
 * @example
 * ```tsx
 * const { mutate } = useBatchDeleteUsers()
 *
 * mutate(["id1", "id2", "id3"])
 * ```
 */
export function useBatchDeleteUsers(options?: {
  onSuccess?: (ids: string[]) => void
  onError?: (error: Error) => void
}) {
  return useBatchActionMutation<string>(batchDeleteUsersAction, {
    invalidateKeys: [userKeys.lists()],
    optimisticUpdate: (queryClient, ids) => {
      const queryKey = userKeys.lists()
      const previousData = queryClient.getQueryData<{ list: User[] }>(queryKey)

      if (previousData) {
        queryClient.setQueryData<{ list: User[] }>(queryKey, {
          ...previousData,
          list: previousData.list.filter((user) => !ids.includes(user.id)),
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

/**
 * 更新用户状态
 *
 * @example
 * ```tsx
 * const { mutate } = useUpdateUserStatus()
 *
 * mutate({ id: "user-id", status: "active" })
 * ```
 */
export function useUpdateUserStatus(options?: {
  onSuccess?: (data: User) => void
  onError?: (error: Error) => void
}) {
  return useActionMutation<
    User,
    { id: string; status: UserStatus }
  >(
    async ({ id, status }) => {
      return updateUserStatusAction(id, status)
    },
    {
      invalidateKeys: [userKeys.lists()],
      optimisticUpdate: (queryClient, { id, status }) => {
        const queryKey = userKeys.lists()
        const previousData = queryClient.getQueryData<{ list: User[] }>(queryKey)

        if (previousData) {
          queryClient.setQueryData<{ list: User[] }>(queryKey, {
            ...previousData,
            list: previousData.list.map((user) =>
              user.id === id ? { ...user, status } : user
            ),
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
    }
  )
}

// ============================================================================
// 重新导出 Query Keys（便于外部使用）
// ============================================================================

export { userKeys }
