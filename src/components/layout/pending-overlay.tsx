"use client"

import { AnimatePresence,motion } from "framer-motion"
import { Coffee,Loader2, Sparkles, Zap } from "lucide-react"
import * as React from "react"

import { cn } from "@/lib/utils"

interface PendingOverlayProps {
  /** 控制遮罩是否可见 */
  visible: boolean
  /** 主要的标题，默认为 "正在前往" */
  label?: string | null
  /** 自定义类名 */
  className?: string
  /** * 延迟显示时间 (毫秒)。
   * 防止在快速网络下遮罩一闪而过 (Flicker)。
   * 默认 250ms。
   */
  delay?: number
  /** 展示模式：跳转 or 刷新 */
  mode?: "navigate" | "refresh"
}

const DEFAULT_TIPS = [
  "正在整理数据碎片...",
  "正在与服务器进行加密通话...",
  "稍微喝口水，马上就好...",
  "正在加载精彩内容...",
  "连接卫星信号中...",
]

// 全局智能过渡遮罩层
export function PendingOverlay({ 
  visible, 
  label, 
  className,
  delay = 250,
  mode = "navigate",
}: PendingOverlayProps) {
  const [show, setShow] = React.useState(false)
  const [tipIndex, setTipIndex] = React.useState(0)
  const [isTakingLong, setIsTakingLong] = React.useState(false)
  const displayDelay = mode === "refresh" ? 0 : delay

  // 1. 处理防闪烁逻辑 (Grace Period)
  React.useEffect(() => {
    let timer: NodeJS.Timeout
    let longTimer: NodeJS.Timeout

    if (visible) {
      // 只有当 visible 持续时间超过 delay 时，才真正显示 UI
      timer = setTimeout(() => {
        setShow(true)
      }, displayDelay)

      // 如果显示超过 8 秒，标记为长时间加载
      longTimer = setTimeout(() => {
        setIsTakingLong(true)
      }, 8000)
    } else {
      // 隐藏时立即重置所有状态
      setShow(false)
      setIsTakingLong(false)
      setTipIndex(0)
    }

    return () => {
      clearTimeout(timer)
      clearTimeout(longTimer)
    }
  }, [visible, displayDelay])

  // 2. 处理提示语轮播
  React.useEffect(() => {
    if (!show) return

    const interval = setInterval(() => {
      setTipIndex((prev) => (prev + 1) % DEFAULT_TIPS.length)
    }, 3000) // 每3秒换一句话

    return () => clearInterval(interval)
  }, [show])

  return (
    <AnimatePresence mode="wait">
      {show && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          // z-[9999] 确保覆盖所有内容，pointer-events-auto 阻止底部点击
          className={cn(
            "fixed inset-0 z-[9999] flex items-center justify-center overflow-hidden touch-none",
            "bg-background/60 backdrop-blur-md supports-[backdrop-filter]:bg-background/40",
            className
          )}
        >
          {/* 装饰性背景光斑 - 慢速呼吸效果 */}
          <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none select-none">
            <motion.div
              animate={{
                scale: [1, 1.15, 1],
                opacity: [0.3, 0.6, 0.3],
              }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              className="absolute top-1/4 left-1/4 h-[50vh] w-[50vh] rounded-full bg-primary/20 blur-[120px]"
            />
            <motion.div
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.2, 0.5, 0.2],
              }}
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
              className="absolute bottom-1/4 right-1/4 h-[40vh] w-[40vh] rounded-full bg-blue-500/20 blur-[120px]"
            />
          </div>

          {/* 核心卡片 */}
          <motion.div
            initial={{ opacity: 0, scale: 0.92, y: 15, filter: "blur(12px)" }}
            animate={{ opacity: 1, scale: 1, y: 0, filter: "blur(0px)" }}
            exit={{ opacity: 0, scale: 0.96, y: -10, filter: "blur(6px)" }}
            transition={{ type: "spring", stiffness: 350, damping: 30 }}
            className={cn(
              "relative z-10 flex w-full max-w-sm flex-col overflow-hidden mx-6",
              "rounded-2xl border border-white/10 bg-card/80 shadow-2xl shadow-primary/10",
              "backdrop-blur-2xl dark:border-white/5 dark:bg-black/50"
            )}
          >
            <div className="flex items-center gap-5 px-6 py-6">
              {/* 左侧图标容器 - 根据状态变化 */}
              <div className="relative flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-primary/10 to-primary/5 ring-1 ring-inset ring-primary/20">
                 {/* 装饰光效 */}
                 <div className="absolute inset-0 rounded-2xl bg-primary/10 blur-xl opacity-50" />
                 
                 <AnimatePresence mode="wait">
                    {isTakingLong ? (
                       <motion.div
                        key="long-wait"
                        initial={{ opacity: 0, scale: 0.5 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="relative z-10"
                       >
                         <Coffee className="h-7 w-7 text-orange-400 animate-pulse" />
                       </motion.div>
                    ) : (
                       <motion.div
                        key="loading"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="relative z-10"
                       >
                         <Loader2 className="h-7 w-7 animate-spin text-primary" />
                       </motion.div>
                    )}
                 </AnimatePresence>

                {/* 状态指示点 */}
                <div className="absolute -right-1.5 -top-1.5">
                  <span className="relative flex h-3.5 w-3.5">
                    <span className={cn(
                      "animate-ping absolute inline-flex h-full w-full rounded-full opacity-75",
                      isTakingLong ? "bg-orange-400" : "bg-primary"
                    )}></span>
                    <span className={cn(
                      "relative inline-flex rounded-full h-3.5 w-3.5 border-2 border-card",
                      isTakingLong ? "bg-orange-400" : "bg-primary"
                    )}></span>
                  </span>
                </div>
              </div>

              {/* 右侧文字信息 */}
              <div className="flex flex-col gap-1.5 min-w-0 flex-1">
                <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <p className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground/80">
                      {isTakingLong
                        ? "稍安勿躁"
                        : mode === "refresh"
                          ? "正在刷新"
                          : "正在前往"}
                    </p>
                    {isTakingLong ? (
                       <Zap className="h-3 w-3 text-orange-400/70" />
                    ) : (
                       <Sparkles className="h-3 w-3 text-primary/40 animate-pulse" />
                    )}
                  </div>
                </div>
                
                <div className="relative h-6 overflow-hidden">
                   <AnimatePresence mode="wait" initial={false}>
                      <motion.p
                        key={isTakingLong ? "long-tip" : `tip-${tipIndex}`}
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: -20, opacity: 0 }}
                        transition={{ duration: 0.25 }}
                        className="absolute inset-0 truncate text-[15px] font-medium text-foreground leading-6"
                      >
                         {isTakingLong 
                            ? "网络稍微有点慢，请耐心等待..." 
                            : (
                              label 
                                || (mode === "refresh" 
                                  ? "正在刷新当前页面..." 
                                  : DEFAULT_TIPS[tipIndex])
                            )}
                      </motion.p>
                   </AnimatePresence>
                </div>
              </div>
            </div>

            {/* 底部进度条 - 长时间等待时变色 */}
            <div className="h-1 w-full bg-primary/5 relative overflow-hidden">
              <motion.div
                className={cn(
                   "absolute inset-0 h-full w-1/2 blur-[2px]",
                   isTakingLong 
                    ? "bg-gradient-to-r from-transparent via-orange-400 to-transparent" 
                    : "bg-gradient-to-r from-transparent via-primary to-transparent"
                )}
                animate={{
                   x: ["-100%", "200%"]
                }}
                transition={{
                  repeat: Infinity,
                  duration: isTakingLong ? 2 : 1.2, // 变慢一点，看起来更稳重
                  ease: "linear",
                }}
              />
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
