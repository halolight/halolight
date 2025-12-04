"use client"

import { useQuery } from "@tanstack/react-query"

import type { CalendarEventFormData } from "@/actions"
import {
  batchDeleteCalendarEventsAction,
  createCalendarEventAction,
  deleteCalendarEventAction,
  updateCalendarEventAction,
} from "@/actions"
import { apiRouter } from "@/lib/api/api-router"
import type { CalendarEvent } from "@/lib/api/types"
import { calendarKeys } from "@/lib/query-keys"

import {
  useActionMutation,
  useActionMutationVoid,
  useBatchActionMutation,
} from "./use-action-mutation"

// ============================================================================
// 查询 Hooks
// ============================================================================

/**
 * 获取日历事件列表
 */
export function useCalendarEvents(start?: string, end?: string) {
  return useQuery({
    queryKey: calendarKeys.eventsByRange(start, end),
    queryFn: async () => {
      const response = await apiRouter.calendar.getEvents()
      // 如果有时间范围，过滤事件
      if (start || end) {
        const events = response.data || []
        return events.filter((event) => {
          const eventStart = new Date(event.start)
          const eventEnd = new Date(event.end)
          const rangeStart = start ? new Date(start) : null
          const rangeEnd = end ? new Date(end) : null

          if (rangeStart && eventEnd < rangeStart) return false
          if (rangeEnd && eventStart > rangeEnd) return false
          return true
        })
      }
      return response.data
    },
  })
}

/**
 * 获取单个日历事件
 */
export function useCalendarEvent(id: string) {
  return useQuery({
    queryKey: calendarKeys.event(id),
    queryFn: async () => {
      // 从事件列表中查找
      const response = await apiRouter.calendar.getEvents()
      const events = response.data || []
      return events.find((e) => e.id === id) || null
    },
    enabled: !!id,
  })
}

// ============================================================================
// Mutation Hooks（使用 Server Actions）
// ============================================================================

/**
 * 创建日历事件
 *
 * @example
 * ```tsx
 * const { mutate, isPending } = useCreateCalendarEvent()
 *
 * mutate({
 *   title: "团队会议",
 *   start: "2024-01-15T10:00:00",
 *   end: "2024-01-15T11:00:00",
 * })
 * ```
 */
export function useCreateCalendarEvent(options?: {
  onSuccess?: (data: CalendarEvent) => void
  onError?: (error: Error) => void
}) {
  return useActionMutation<CalendarEvent, CalendarEventFormData>(
    createCalendarEventAction,
    {
      invalidateKeys: [calendarKeys.events()],
      onSuccess: options?.onSuccess,
      onError: options?.onError,
    }
  )
}

/**
 * 更新日历事件
 *
 * @example
 * ```tsx
 * const { mutate } = useUpdateCalendarEvent()
 *
 * mutate({
 *   id: "event-id",
 *   data: { title: "更新后的标题" },
 * })
 * ```
 */
export function useUpdateCalendarEvent(options?: {
  onSuccess?: (data: CalendarEvent) => void
  onError?: (error: Error) => void
}) {
  return useActionMutation<
    CalendarEvent,
    { id: string; data: Partial<CalendarEventFormData> }
  >(
    async ({ id, data }) => {
      return updateCalendarEventAction(id, data)
    },
    {
      invalidateKeys: [calendarKeys.events()],
      onSuccess: options?.onSuccess,
      onError: options?.onError,
    }
  )
}

/**
 * 删除日历事件
 *
 * @example
 * ```tsx
 * const { mutate } = useDeleteCalendarEvent()
 *
 * mutate("event-id")
 * ```
 */
export function useDeleteCalendarEvent(options?: {
  onSuccess?: (id: string) => void
  onError?: (error: Error) => void
}) {
  return useActionMutationVoid<string>(deleteCalendarEventAction, {
    invalidateKeys: [calendarKeys.events()],
    optimisticUpdate: (queryClient, id) => {
      const queryKey = calendarKeys.events()
      const previousData = queryClient.getQueryData<CalendarEvent[]>(queryKey)

      if (previousData) {
        queryClient.setQueryData<CalendarEvent[]>(
          queryKey,
          previousData.filter((event) => event.id !== id)
        )
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
 * 批量删除日历事件
 *
 * @example
 * ```tsx
 * const { mutate } = useBatchDeleteCalendarEvents()
 *
 * mutate(["id1", "id2", "id3"])
 * ```
 */
export function useBatchDeleteCalendarEvents(options?: {
  onSuccess?: (ids: string[]) => void
  onError?: (error: Error) => void
}) {
  return useBatchActionMutation<string>(batchDeleteCalendarEventsAction, {
    invalidateKeys: [calendarKeys.events()],
    optimisticUpdate: (queryClient, ids) => {
      const queryKey = calendarKeys.events()
      const previousData = queryClient.getQueryData<CalendarEvent[]>(queryKey)

      if (previousData) {
        queryClient.setQueryData<CalendarEvent[]>(
          queryKey,
          previousData.filter((event) => !ids.includes(event.id))
        )
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

export { calendarKeys }
