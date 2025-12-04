"use client"

import dynamic from "next/dynamic"

import { Skeleton } from "@/components/ui/skeleton"

// 懒加载 Dashboard 组件，提升首屏加载性能
const ConfigurableDashboard = dynamic(
  () => import("@/components/dashboard").then((mod) => mod.ConfigurableDashboard),
  {
    loading: () => (
      <div className="space-y-4">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} className="h-32 rounded-xl" />
          ))}
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          <Skeleton className="h-80 rounded-xl" />
          <Skeleton className="h-80 rounded-xl" />
        </div>
      </div>
    ),
    ssr: false, // Dashboard 依赖 localStorage，禁用 SSR
  }
)

export default function DashboardPage() {
  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">仪表盘</h1>
      </div>
      <ConfigurableDashboard />
    </div>
  )
}
