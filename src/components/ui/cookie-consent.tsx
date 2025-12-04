"use client"

import { AnimatePresence, motion } from "framer-motion"
import { Cookie, X } from "lucide-react"
import Link from "next/link"
import * as React from "react"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

const COOKIE_CONSENT_KEY = "cookie-consent"

export type CookieConsentValue = "accepted" | "rejected" | null

interface CookieConsentProps {
  className?: string
  onAccept?: () => void
  onReject?: () => void
}

export function CookieConsent({
  className,
  onAccept,
  onReject,
}: CookieConsentProps) {
  const [isVisible, setIsVisible] = React.useState(false)
  const [isClosing, setIsClosing] = React.useState(false)

  React.useEffect(() => {
    const consent = localStorage.getItem(COOKIE_CONSENT_KEY)
    if (!consent) {
      // 延迟显示，避免页面加载时立即弹出
      const timer = setTimeout(() => setIsVisible(true), 1000)
      return () => clearTimeout(timer)
    }
  }, [])

  const handleClose = React.useCallback((value: CookieConsentValue) => {
    setIsClosing(true)
    setTimeout(() => {
      if (value) {
        localStorage.setItem(COOKIE_CONSENT_KEY, value)
      }
      setIsVisible(false)
      setIsClosing(false)
    }, 200)
  }, [])

  const handleAccept = React.useCallback(() => {
    handleClose("accepted")
    onAccept?.()
  }, [handleClose, onAccept])

  const handleReject = React.useCallback(() => {
    handleClose("rejected")
    onReject?.()
  }, [handleClose, onReject])

  const handleDismiss = React.useCallback(() => {
    handleClose(null)
  }, [handleClose])

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: isClosing ? 0 : 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
          className={cn(
            "fixed bottom-0 left-0 right-0 z-50 p-4 md:p-6",
            className
          )}
        >
          <div className="mx-auto max-w-4xl">
            <div className="relative rounded-xl border border-border bg-card/95 p-4 shadow-lg backdrop-blur supports-backdrop-filter:bg-card/80 md:p-6">
              {/* 关闭按钮 */}
              <Button
                variant="ghost"
                size="icon"
                className="absolute right-2 top-2 h-8 w-8 text-muted-foreground hover:text-foreground"
                onClick={handleDismiss}
              >
                <X className="h-4 w-4" />
                <span className="sr-only">关闭</span>
              </Button>

              <div className="flex flex-col gap-4 md:flex-row md:items-center md:gap-6">
                {/* 图标 */}
                <div className="hidden shrink-0 md:block">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                    <Cookie className="h-6 w-6 text-primary" />
                  </div>
                </div>

                {/* 内容 */}
                <div className="flex-1 space-y-2 pr-8 md:pr-0">
                  <h3 className="flex items-center gap-2 text-base font-semibold text-foreground">
                    <Cookie className="h-5 w-5 text-primary md:hidden" />
                    Cookie 使用说明
                  </h3>
                  <p className="text-sm leading-relaxed text-muted-foreground">
                    我们使用 Cookie 和类似技术来提升您的浏览体验、分析网站流量并提供个性化内容。
                    点击&ldquo;接受全部&rdquo;即表示您同意我们的{" "}
                    <Link
                      href="/privacy"
                      className="font-medium text-primary underline-offset-4 hover:underline"
                    >
                      隐私政策
                    </Link>{" "}
                    和{" "}
                    <Link
                      href="/terms"
                      className="font-medium text-primary underline-offset-4 hover:underline"
                    >
                      服务条款
                    </Link>
                    。
                  </p>
                </div>

                {/* 操作按钮 */}
                <div className="flex shrink-0 flex-col gap-2 sm:flex-row md:flex-col lg:flex-row">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleReject}
                    className="order-2 sm:order-1 md:order-2 lg:order-1"
                  >
                    仅必要 Cookie
                  </Button>
                  <Button
                    size="sm"
                    onClick={handleAccept}
                    className="order-1 sm:order-2 md:order-1 lg:order-2"
                  >
                    接受全部
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

// 工具函数：获取当前 Cookie 同意状态
export function getCookieConsent(): CookieConsentValue {
  if (typeof window === "undefined") return null
  const value = localStorage.getItem(COOKIE_CONSENT_KEY)
  if (value === "accepted" || value === "rejected") {
    return value
  }
  return null
}

// 工具函数：重置 Cookie 同意状态（用于设置页面）
export function resetCookieConsent(): void {
  if (typeof window === "undefined") return
  localStorage.removeItem(COOKIE_CONSENT_KEY)
}
