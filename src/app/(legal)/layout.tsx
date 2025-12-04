import * as React from "react"

import { LegalLayoutContent } from "@/components/layout/legal-layout-content"

// Cloudflare Pages 需要 Edge Runtime
export const runtime = "edge"

interface LegalLayoutProps {
  children: React.ReactNode
}

export default function LegalLayout({ children }: LegalLayoutProps) {
  return <LegalLayoutContent>{children}</LegalLayoutContent>
}
