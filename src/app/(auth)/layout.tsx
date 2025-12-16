
import * as React from "react"

// Cloudflare Pages 需要 Edge Runtime
// export const runtime = "edge"

// import { Footer } from "@/components/layout/footer"

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="relative h-dvh bg-background overflow-hidden">
      <div className="pointer-events-none absolute inset-0 z-0">
        <div className="absolute -left-10 -top-20 h-64 w-64 rounded-full bg-primary/15 blur-3xl" />
        <div className="absolute right-4 top-10 h-52 w-52 rounded-full bg-secondary/20 blur-3xl" />
        <div className="absolute left-10 bottom-0 h-60 w-60 rounded-full bg-primary/10 blur-[70px]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(255,255,255,0.08),transparent_35%),radial-gradient(circle_at_80%_0%,rgba(255,255,255,0.06),transparent_30%)]" />
      </div>
      <div className="relative z-10 grid h-full grid-rows-[1fr_auto]">
        <div className="min-h-0 overflow-y-auto">{children}</div>
        {/* <Footer /> */}
      </div>
    </div>
  )
}
