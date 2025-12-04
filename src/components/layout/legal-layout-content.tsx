"use client"

import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import * as React from "react"

import { BackToTop } from "@/components/ui/back-to-top"
import { Button } from "@/components/ui/button"

interface LegalLayoutContentProps {
  children: React.ReactNode
}

export function LegalLayoutContent({ children }: LegalLayoutContentProps) {
  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <header className="sticky top-0 z-50 w-full border-b border-border/50 bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60">
        <div className="mx-auto flex h-14 max-w-6xl items-center px-4">
          <Button variant="ghost" size="sm" asChild>
            <Link href="/" className="flex items-center gap-2">
              <ArrowLeft className="h-4 w-4" />
              返回首页
            </Link>
          </Button>
          <div className="flex-1" />
          <Link
            href="/"
            className="text-sm font-semibold text-foreground hover:text-primary transition-colors"
          >
            Admin Pro
          </Link>
        </div>
      </header>

      <main className="flex-1 w-full">
        <div className="mx-auto w-full max-w-6xl px-4 py-6">{children}</div>
      </main>

      <BackToTop threshold={200} duration={400} />
    </div>
  )
}
