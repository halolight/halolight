"use client"

import { motion, useMotionValue, useTransform } from "framer-motion"
import * as React from "react"

import { cn } from "@/lib/utils"

type Halo = {
  className?: string
  from: string
  to: string
  animate?: Parameters<typeof motion.div>[0]["animate"]
  transition?: Parameters<typeof motion.div>[0]["transition"]
}

type FloatingDots = {
  count?: number
  colorClassName?: string
}

type BackgroundOptions = {
  gridSize?: number
  halos?: Halo[]
}

type AuthShellProps = {
  left?: React.ReactNode
  right: React.ReactNode
  /** 是否展示左侧装饰区；某些简单页（如无效链接）可以关闭。 */
  showLeft?: boolean
  /** 左侧渐变背景自定义，默认蓝紫渐变。 */
  leftGradientClassName?: string
  /** 背景网格与光晕配置。 */
  backgroundOptions?: BackgroundOptions
  /** 浮点动画配置。 */
  floatingDots?: FloatingDots
  /** 右侧区域的 padding 类，可根据页面高度调整。 */
  rightPaddingClassName?: string
  className?: string
}

const defaultHalos: Halo[] = [
  {
    from: "from-blue-400/30",
    to: "to-cyan-400/30",
    className: "absolute -top-40 -left-40 w-96 h-96 rounded-full blur-3xl",
    animate: { scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] },
    transition: { duration: 8, repeat: Infinity, ease: "easeInOut" },
  },
  {
    from: "from-indigo-400/30",
    to: "to-purple-400/30",
    className: "absolute top-1/3 -right-32 w-80 h-80 rounded-full blur-3xl",
    animate: { scale: [1.2, 1, 1.2], opacity: [0.4, 0.6, 0.4] },
    transition: { duration: 10, repeat: Infinity, ease: "easeInOut" },
  },
  {
    from: "from-violet-400/20",
    to: "to-pink-400/20",
    className: "absolute -bottom-32 left-1/4 w-96 h-96 rounded-full blur-3xl",
    animate: { scale: [1, 1.3, 1], opacity: [0.3, 0.5, 0.3] },
    transition: { duration: 12, repeat: Infinity, ease: "easeInOut" },
  },
]

const defaultBackground: BackgroundOptions = {
  gridSize: 24,
  halos: defaultHalos,
}

const defaultFloatingDots: FloatingDots = { count: 6, colorClassName: "bg-white/20" }

export function AuthShell({
  left,
  right,
  showLeft = true,
  leftGradientClassName = "bg-gradient-to-br from-blue-600 via-indigo-600 to-violet-700",
  backgroundOptions = defaultBackground,
  floatingDots = defaultFloatingDots,
  rightPaddingClassName = "px-3 sm:px-5 lg:px-10 py-2 sm:py-3 lg:py-6",
  className,
}: AuthShellProps) {
  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)

  const backgroundGradient = useTransform(
    [mouseX, mouseY],
    ([x, y]) =>
      `radial-gradient(600px circle at ${x}px ${y}px, rgba(255,255,255,0.1), transparent 40%)`
  )

  const handleMouseMove = React.useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      const rect = e.currentTarget.getBoundingClientRect()
      mouseX.set(e.clientX - rect.left)
      mouseY.set(e.clientY - rect.top)
    },
    [mouseX, mouseY]
  )

  return (
    <div className="relative min-h-screen lg:h-dvh overflow-hidden bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
      <div
        className={cn(
          "absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)]",
          `bg-[size:${backgroundOptions.gridSize ?? defaultBackground.gridSize}px_${backgroundOptions.gridSize ?? defaultBackground.gridSize}px]`
        )}
      />

      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {(backgroundOptions.halos ?? defaultHalos).map((halo, idx) => (
          <motion.div
            key={idx}
            animate={halo.animate}
            transition={halo.transition}
            className={cn("bg-gradient-to-br", halo.from, halo.to, halo.className)}
          />
        ))}
      </div>

      <div className={cn("relative flex min-h-screen lg:h-full flex-col lg:flex-row", className)}>
        {showLeft && (
          <motion.div
            initial={{ x: -100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            onMouseMove={handleMouseMove}
            className="hidden lg:flex lg:w-1/2 relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-blue-600 via-indigo-600 to-violet-700" />
            <div className={cn("absolute inset-0", leftGradientClassName)} />
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff0a_1px,transparent_1px),linear-gradient(to_bottom,#ffffff0a_1px,transparent_1px)] bg-[size:32px_32px]" />
            <motion.div className="absolute inset-0" style={{ background: backgroundGradient }} />

            <div className="relative z-10 flex flex-col justify-center px-12 xl:px-16 text-white">
              {left}
            </div>

            {[...Array(floatingDots.count ?? defaultFloatingDots.count)].map((_, i) => (
              <motion.div
                key={i}
                className={cn("absolute w-2 h-2 rounded-full", floatingDots.colorClassName ?? defaultFloatingDots.colorClassName)}
                style={{
                  left: `${20 + i * 15}%`,
                  top: `${30 + (i % 3) * 20}%`,
                }}
                animate={{ y: [0, -20, 0], opacity: [0.2, 0.5, 0.2] }}
                transition={{ duration: 3 + i * 0.5, repeat: Infinity, ease: "easeInOut" }}
              />
            ))}
          </motion.div>
        )}

        <div className={cn("flex-1 flex items-center justify-center", rightPaddingClassName)}>
          {right}
        </div>
      </div>
    </div>
  )
}
