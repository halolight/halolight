"use client"

import { AnimatePresence, motion, useMotionValue, useSpring, useTransform } from "framer-motion"
import { ArrowUp } from "lucide-react"
import * as React from "react"

import { cn } from "@/lib/utils"

interface BackToTopProps {
  /** 显示阈值（滚动距离，默认 300px） */
  threshold?: number
  /** 滚动动画持续时间（毫秒，默认 500） */
  duration?: number
  /** 自定义类名 */
  className?: string
  /** 是否显示百分比 */
  showProgress?: boolean
  /** 按钮位置 */
  position?: "bottom-right" | "bottom-left" | "bottom-center"
  /** 滚动容器选择器，默认监听 window */
  scrollContainerSelector?: string
}

/**
 * 返回顶部组件
 *
 * 特性：
 * - 滚动到一定距离后渐显
 * - 显示滚动百分比
 * - 点击平滑滚动返回顶部
 * - 支持监听特定滚动容器
 * - 适配主题和皮肤配置
 */
export function BackToTop({
  threshold = 300,
  duration = 500,
  className,
  showProgress = true,
  position = "bottom-right",
  scrollContainerSelector,
}: BackToTopProps) {
  const [isVisible, setIsVisible] = React.useState(false)
  const [scrollPercent, setScrollPercent] = React.useState(0)
  const scrollContainerRef = React.useRef<Element | null>(null)

  // 使用 motion value 实现更流畅的动画
  const progress = useMotionValue(0)
  const smoothProgress = useSpring(progress, { stiffness: 100, damping: 20 })

  // 透明度基于滚动进度
  const opacity = useTransform(smoothProgress, [0, 100], [0.6, 1])

  // 尺寸基于滚动进度
  const scale = useTransform(smoothProgress, [0, 100], [0.9, 1])

  // 获取滚动容器
  React.useEffect(() => {
    if (scrollContainerSelector) {
      scrollContainerRef.current = document.querySelector(scrollContainerSelector)
    }
  }, [scrollContainerSelector])

  // 监听滚动事件
  React.useEffect(() => {
    const handleScroll = () => {
      let scrollTop: number
      let scrollHeight: number

      if (scrollContainerSelector && scrollContainerRef.current) {
        const container = scrollContainerRef.current
        scrollTop = container.scrollTop
        scrollHeight = container.scrollHeight - container.clientHeight
      } else {
        scrollTop = window.scrollY || document.documentElement.scrollTop
        scrollHeight = document.documentElement.scrollHeight - window.innerHeight
      }

      const percent = scrollHeight > 0 ? Math.min(Math.round((scrollTop / scrollHeight) * 100), 100) : 0

      setScrollPercent(percent)
      progress.set(percent)
      setIsVisible(scrollTop > threshold)
    }

    // 初始化检查
    handleScroll()

    const target = scrollContainerSelector && scrollContainerRef.current
      ? scrollContainerRef.current
      : window

    target.addEventListener("scroll", handleScroll, { passive: true })
    return () => target.removeEventListener("scroll", handleScroll)
  }, [threshold, progress, scrollContainerSelector])

  // 平滑滚动到顶部
  const scrollToTop = React.useCallback(() => {
    const startPosition = scrollContainerSelector && scrollContainerRef.current
      ? scrollContainerRef.current.scrollTop
      : window.scrollY
    const startTime = performance.now()

    const easeOutCubic = (t: number): number => {
      return 1 - Math.pow(1 - t, 3)
    }

    const animateScroll = (currentTime: number) => {
      const elapsed = currentTime - startTime
      const progressRatio = Math.min(elapsed / duration, 1)
      const easeProgress = easeOutCubic(progressRatio)

      const newScrollTop = startPosition * (1 - easeProgress)

      if (scrollContainerSelector && scrollContainerRef.current) {
        scrollContainerRef.current.scrollTop = newScrollTop
      } else {
        window.scrollTo(0, newScrollTop)
      }

      if (progressRatio < 1) {
        requestAnimationFrame(animateScroll)
      }
    }

    requestAnimationFrame(animateScroll)
  }, [duration, scrollContainerSelector])

  // 位置样式
  const positionStyles = {
    "bottom-right": "right-4 sm:right-6",
    "bottom-left": "left-4 sm:left-6",
    "bottom-center": "left-1/2 -translate-x-1/2",
  }

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.button
          initial={{ opacity: 0, scale: 0.8, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.8, y: 20 }}
          transition={{
            type: "spring",
            stiffness: 260,
            damping: 20,
          }}
          onClick={scrollToTop}
          className={cn(
            "fixed bottom-20 z-50",
            "group flex items-center justify-center",
            "rounded-full border border-border/70 bg-background/95 backdrop-blur-sm",
            "shadow-lg shadow-black/5 dark:shadow-black/20",
            "hover:border-primary/60 hover:bg-primary/5",
            "transition-colors duration-200",
            "focus:outline-none focus:ring-2 focus:ring-primary/50 focus:ring-offset-2",
            positionStyles[position],
            showProgress ? "h-12 w-12 sm:h-14 sm:w-14" : "h-10 w-10 sm:h-12 sm:w-12",
            className
          )}
          style={{
            opacity: opacity as unknown as number,
            scale: scale as unknown as number,
          }}
          aria-label={`返回顶部 (${scrollPercent}%)`}
        >
          {/* 进度环 */}
          {showProgress && (
            <svg
              className="absolute inset-0 h-full w-full -rotate-90"
              viewBox="0 0 100 100"
            >
              {/* 背景圆环 */}
              <circle
                cx="50"
                cy="50"
                r="46"
                fill="none"
                stroke="currentColor"
                strokeWidth="4"
                className="text-muted/30"
              />
              {/* 进度圆环 */}
              <motion.circle
                cx="50"
                cy="50"
                r="46"
                fill="none"
                stroke="currentColor"
                strokeWidth="4"
                strokeLinecap="round"
                className="text-primary"
                style={{
                  pathLength: smoothProgress.get() / 100,
                }}
                initial={{ pathLength: 0 }}
                animate={{ pathLength: scrollPercent / 100 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
                strokeDasharray="289.027"
                strokeDashoffset={289.027 * (1 - scrollPercent / 100)}
              />
            </svg>
          )}

          {/* 内容区域 */}
          <div className="relative flex flex-col items-center justify-center">
            {showProgress ? (
              <>
                {/* 百分比文字 */}
                <motion.span
                  className="text-[10px] sm:text-xs font-semibold text-foreground tabular-nums"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.1 }}
                >
                  {scrollPercent}%
                </motion.span>
                {/* 箭头图标 - hover 时显示 */}
                <ArrowUp className="h-3 w-3 sm:h-3.5 sm:w-3.5 text-muted-foreground group-hover:text-primary transition-colors" />
              </>
            ) : (
              <ArrowUp className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
            )}
          </div>

          {/* Hover 效果光晕 */}
          <motion.div
            className="absolute inset-0 rounded-full bg-primary/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            initial={false}
          />
        </motion.button>
      )}
    </AnimatePresence>
  )
}

/**
 * 简洁版返回顶部按钮
 * 仅显示箭头，无百分比
 */
export function BackToTopSimple({
  threshold = 300,
  duration = 500,
  className,
  position = "bottom-right",
  scrollContainerSelector,
}: Omit<BackToTopProps, "showProgress">) {
  return (
    <BackToTop
      threshold={threshold}
      duration={duration}
      className={className}
      position={position}
      showProgress={false}
      scrollContainerSelector={scrollContainerSelector}
    />
  )
}
