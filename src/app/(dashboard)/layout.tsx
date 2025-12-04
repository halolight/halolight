import * as React from "react"

import { AdminLayout } from "@/components/layout/admin-layout"

// Cloudflare Pages 需要 Edge Runtime
export const runtime = "edge"

interface DashboardLayoutProps {
  children: React.ReactNode
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  return <AdminLayout>{children}</AdminLayout>
}
