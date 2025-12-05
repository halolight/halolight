import { useQuery, useQueryClient } from "@tanstack/react-query"

import { tokenStorage } from "@/lib/api/client"

type ApiResponse<T> = { code: number; message: string; data: T }

const IS_MOCK_MODE = process.env.NEXT_PUBLIC_MOCK === "true"

async function fetcher<T>(url: string): Promise<T> {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  }

  // 真实模式下添加 Authorization 头
  if (!IS_MOCK_MODE) {
    const token = tokenStorage.getAccessToken()
    if (token) {
      headers.Authorization = `Bearer ${token}`
    }
  }

  const res = await fetch(url, { headers })

  if (!res.ok) {
    throw new Error(`HTTP ${res.status}: ${res.statusText}`)
  }

  const json = (await res.json()) as ApiResponse<T> | T

  // 支持包装和非包装两种格式
  if (typeof json === "object" && json && "code" in json && "data" in json) {
    return (json as ApiResponse<T>).data
  }
  return json as T
}

export interface DashboardStats {
  totalUsers: number
  totalRevenue: number
  totalOrders: number
  conversionRate: number
  userGrowth: number
  revenueGrowth: number
  orderGrowth: number
  rateGrowth: number
}

export function useDashboardStats() {
  return useQuery({
    queryKey: ["dashboard", "stats"],
    queryFn: () => fetcher<DashboardStats>("/api/dashboard/stats"),
  })
}

export function useDashboardVisits() {
  return useQuery({
    queryKey: ["dashboard", "visits"],
    queryFn: () => fetcher<Array<{ date: string; visits: number; uniqueVisitors: number; pageViews: number }>>(
      "/api/dashboard/visits"
    ),
  })
}

export function useDashboardSales() {
  return useQuery({
    queryKey: ["dashboard", "sales"],
    queryFn: () => fetcher<Array<{ month: string; sales: number; profit: number }>>("/api/dashboard/sales"),
  })
}

export function useDashboardPie() {
  return useQuery({
    queryKey: ["dashboard", "pie"],
    queryFn: () => fetcher<Array<{ name: string; value: number }>>("/api/dashboard/pie"),
  })
}

export function useDashboardTasks() {
  return useQuery({
    queryKey: ["dashboard", "tasks"],
    queryFn: () => fetcher<Array<{ id: string; title: string; status: "pending" | "in_progress" | "done" }>>(
      "/api/dashboard/tasks"
    ),
  })
}

export function useDashboardNotifications() {
  return useQuery({
    queryKey: ["dashboard", "notifications"],
    queryFn: () => fetcher<Array<{ id: string; title: string; type: string; time: string }>>("/api/notifications"),
  })
}

export function useDashboardUsers() {
  return useQuery({
    queryKey: ["dashboard", "users"],
    queryFn: async () => {
      const data = await fetcher<{ list?: Array<{ name: string; email: string }> }>("/api/users")
      return Array.isArray(data?.list) ? data.list : []
    },
  })
}

export function useDashboardCalendar() {
  return useQuery({
    queryKey: ["dashboard", "calendar"],
    queryFn: () => fetcher<Array<{ id: string; title: string; start: string; end?: string }>>(
      "/api/calendar/events"
    ),
  })
}

export function useDashboardRefresh() {
  const qc = useQueryClient()
  const refresh = async () => {
    await qc.invalidateQueries({ predicate: (query) => Array.isArray(query.queryKey) && query.queryKey[0] === "dashboard" })
  }
  return refresh
}
