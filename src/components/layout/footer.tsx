"use client"

import { Heart } from "lucide-react"
import Link from "next/link"

import { projectInfo } from "@/lib/project-info"

export function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="border-t border-border/50 bg-background/80 backdrop-blur-sm">
      <div className="mx-auto max-w-screen-2xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center justify-between gap-2 py-4 text-sm text-muted-foreground sm:flex-row">
          {/* 版权信息 */}
          <div className="flex items-center gap-1">
            <span>© {currentYear} {projectInfo.name}</span>
            <span className="hidden sm:inline">·</span>
            <span className="hidden sm:inline">All rights reserved</span>
          </div>

          {/* 作者信息 */}
          <div className="flex items-center gap-1">
            <span className="hidden sm:inline">Made with</span>
            <Heart className="h-3.5 w-3.5 text-red-500 fill-red-500" />
            <span className="hidden sm:inline">by</span>
            <a
              href={`https://github.com/${projectInfo.author}`}
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-foreground/80 hover:text-primary transition-colors"
            >
              {projectInfo.author}
            </a>
          </div>

          {/* 链接 */}
          <div className="flex items-center gap-3 text-xs">
            <a
              href="https://halolight.docs.h7ml.cn"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-primary transition-colors"
            >
              在线文档
            </a>
            <Link
              href="/privacy"
              className="hover:text-primary transition-colors"
            >
              隐私政策
            </Link>
            <Link
              href="/terms"
              className="hover:text-primary transition-colors"
            >
              服务条款
            </Link>
            <a
              href={projectInfo.repo}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-primary transition-colors"
            >
              GitHub
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}
