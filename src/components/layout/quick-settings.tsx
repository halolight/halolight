"use client"

import { motion } from "framer-motion"
import {
  Brush,
  Check,
  Monitor,
  Moon,
  Palette,
  PanelsTopLeft,
  Settings2,
  Smartphone,
  Sun,
  X,
} from "lucide-react"
import { useTheme } from "next-themes"
import * as React from "react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { Switch } from "@/components/ui/switch"
import { cn } from "@/lib/utils"
import { type SkinPreset, useUiSettingsStore } from "@/stores/ui-settings-store"

const themeOptions = [
  { id: "light", label: "浅色", icon: Sun },
  { id: "dark", label: "深色", icon: Moon },
  { id: "system", label: "系统", icon: Monitor },
] as const

const skinPresets: Array<{
  id: SkinPreset
  name: string
  description: string
  colors: string[]
}> = [
  {
    id: "default",
    name: "Shadcn · Neutral",
    description: "官方默认中性色，强调对比与易读性",
    colors: ["#0f172a", "#6366f1", "#14b8a6"],
  },
  {
    id: "blue",
    name: "Shadcn · Blue",
    description: "蓝色主色 + Charts 默认冷色调",
    colors: ["#1d4ed8", "#0ea5e9", "#a855f7"],
  },
  {
    id: "emerald",
    name: "Shadcn · Emerald",
    description: "清新绿色，适合数据和成功态",
    colors: ["#047857", "#10b981", "#22c55e"],
  },
  {
    id: "amber",
    name: "Shadcn · Amber",
    description: "琥珀 / 橙色主色，温暖明快",
    colors: ["#f59e0b", "#f97316", "#fb7185"],
  },
  {
    id: "violet",
    name: "Shadcn · Violet",
    description: "紫色高饱和，科技/创意场景",
    colors: ["#7c3aed", "#8b5cf6", "#06b6d4"],
  },
  {
    id: "rose",
    name: "Shadcn · Rose",
    description: "玫红主色，图表撞色更活泼",
    colors: ["#e11d48", "#f43f5e", "#fb923c"],
  },
  {
    id: "teal",
    name: "Shadcn · Teal",
    description: "青色主色，冷静又具现代感",
    colors: ["#0d9488", "#06b6d4", "#a855f7"],
  },
  {
    id: "slate",
    name: "Shadcn · Slate",
    description: "低饱和灰蓝，后台/工具感",
    colors: ["#0f172a", "#475569", "#0ea5e9"],
  },
  {
    id: "ocean",
    name: "旧 · 深海蓝",
    description: "旧版蓝绿渐变",
    colors: ["#0ea5e9", "#2563eb", "#0ea5e9"],
  },
  {
    id: "sunset",
    name: "旧 · 暮光橙",
    description: "旧版橙粉撞色",
    colors: ["#f97316", "#f43f5e", "#f59e0b"],
  },
  {
    id: "aurora",
    name: "旧 · 极光绿",
    description: "旧版青绿 + 紫色",
    colors: ["#22c55e", "#10b981", "#a855f7"],
  },
]

export function QuickSettings() {
  const { setTheme, theme, resolvedTheme } = useTheme()
  const {
    skin,
    setSkin,
    showFooter,
    showTabBar,
    mobileHeaderFixed,
    mobileTabBarFixed,
    setShowFooter,
    setShowTabBar,
    setMobileHeaderFixed,
    setMobileTabBarFixed,
    resetSettings,
  } = useUiSettingsStore()
  const [open, setOpen] = React.useState(false)
  const [mounted, setMounted] = React.useState(false)

  React.useEffect(() => {
    setMounted(true)
  }, [])

  const handleThemeChange = React.useCallback(
    async (newTheme: string) => {
      const currentTheme = resolvedTheme || theme || "light"
      const isDark = currentTheme === "dark"

      let willBeDark = false
      if (newTheme === "dark") {
        willBeDark = true
      } else if (newTheme === "light") {
        willBeDark = false
      } else if (newTheme === "system") {
        willBeDark = window.matchMedia("(prefers-color-scheme: dark)").matches
      }

      if (isDark === willBeDark) {
        setTheme(newTheme)
        return
      }

      const supportsViewTransitions =
        typeof document !== "undefined" &&
        "startViewTransition" in document &&
        typeof document.startViewTransition === "function"

      if (!supportsViewTransitions) {
        setTheme(newTheme)
        return
      }

      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        setTheme(newTheme)
        return
      }

      const button = document.querySelector<HTMLButtonElement>("[aria-label='界面设置']")
      const rect = button?.getBoundingClientRect()
      const x = rect ? rect.left + rect.width / 2 : window.innerWidth / 2
      const y = rect ? rect.top + rect.height / 2 : window.innerHeight / 2

      const maxRadius = Math.hypot(
        Math.max(x, window.innerWidth - x),
        Math.max(y, window.innerHeight - y)
      )

      const clipPathStart = `circle(0px at ${x}px ${y}px)`
      const clipPathEnd = `circle(${maxRadius}px at ${x}px ${y}px)`

      if (!willBeDark) {
        document.documentElement.classList.add("transitioning-to-light")
      }

      try {
        const transition = document.startViewTransition(() => {
          setTheme(newTheme)
        })

        await transition.ready

        const animation = document.documentElement.animate(
          {
            clipPath: willBeDark
              ? [clipPathStart, clipPathEnd]
              : [clipPathEnd, clipPathStart],
          },
          {
            duration: 400,
            easing: "cubic-bezier(0.4, 0, 0.2, 1)",
            pseudoElement: willBeDark
              ? "::view-transition-new(root)"
              : "::view-transition-old(root)",
          }
        )

        await animation.finished
      } catch {
        setTheme(newTheme)
      } finally {
        document.documentElement.classList.remove("transitioning-to-light")
      }
    },
    [resolvedTheme, theme, setTheme]
  )

  const handleSkinChange = React.useCallback(
    async (nextSkin: SkinPreset) => {
      if (skin === nextSkin) return

      const supportsViewTransitions =
        typeof document !== "undefined" &&
        "startViewTransition" in document &&
        typeof document.startViewTransition === "function"

      if (!supportsViewTransitions || window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        setSkin(nextSkin)
        return
      }

      const button = document.querySelector<HTMLButtonElement>("[aria-label='界面设置']")
      const rect = button?.getBoundingClientRect()
      const x = rect ? rect.left + rect.width / 2 : window.innerWidth / 2
      const y = rect ? rect.top + rect.height / 2 : window.innerHeight / 2
      const maxRadius = Math.hypot(
        Math.max(x, window.innerWidth - x),
        Math.max(y, window.innerHeight - y)
      )

      const clipPathStart = `circle(0px at ${x}px ${y}px)`
      const clipPathEnd = `circle(${maxRadius}px at ${x}px ${y}px)`

      try {
        const transition = document.startViewTransition(() => {
          setSkin(nextSkin)
        })
        await transition.ready
        const animation = document.documentElement.animate(
          { clipPath: [clipPathStart, clipPathEnd] },
          {
            duration: 420,
            easing: "cubic-bezier(0.4, 0, 0.2, 1)",
            pseudoElement: "::view-transition-new(root)",
          }
        )
        await animation.finished
      } catch {
        setSkin(nextSkin)
      }
    },
    [skin, setSkin]
  )

  const handleResetSettings = React.useCallback(() => {
    resetSettings()
  }, [resetSettings])

  const currentTheme = resolvedTheme || theme || "system"

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="relative shrink-0"
          aria-label="界面设置"
        >
          <Settings2 className="h-5 w-5" />
          <Badge
            variant="secondary"
            className="pointer-events-none absolute right-1 top-1 h-4 px-1 text-[10px]"
          >
            UI
          </Badge>
        </Button>
      </SheetTrigger>
      <SheetContent
        side="right"
        className="w-[360px] sm:max-w-[420px] p-0 [&_[data-slot=sheet-close]]:hidden"
      >
        <SheetHeader className="sr-only">
          <SheetTitle>界面设置</SheetTitle>
          <SheetDescription>控制主题、皮肤和界面布局</SheetDescription>
        </SheetHeader>
        <div className="flex h-full min-h-0 flex-col">
          <div className="flex items-center justify-between gap-2 border-b px-4 py-3">
            <div className="flex items-center gap-2">
              <SheetClose asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <X className="h-4 w-4" />
                  <span className="sr-only">关闭</span>
                </Button>
              </SheetClose>
              <div>
                <p className="text-sm font-semibold">界面设置</p>
                <p className="text-xs text-muted-foreground">主题 · 皮肤 · 布局</p>
              </div>
            </div>
          </div>
          <ScrollArea className="flex-1 min-h-0 pr-1">
            <div className="space-y-4 p-4 pb-6">
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm font-medium">
                  <Palette className="h-4 w-4" />
                  <span>主题模式</span>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  {themeOptions.map((option) => {
                    const isActive = mounted && currentTheme === option.id
                    return (
                      <Button
                        key={option.id}
                        type="button"
                        variant="outline"
                        className="relative h-auto flex flex-col items-start justify-center gap-1 rounded-lg py-2 overflow-hidden border-border/70"
                        asChild
                      >
                        <motion.button
                          type="button"
                          onClick={() => handleThemeChange(option.id)}
                          whileTap={{ scale: 0.98 }}
                          transition={{ duration: 0.12 }}
                          className={cn(
                            "relative w-full rounded-md px-2 py-1.5 text-left",
                            isActive ? "text-primary" : "text-foreground"
                          )}
                        >
                          {isActive && (
                            <motion.span
                              layoutId="theme-highlight"
                              className="absolute inset-0 rounded-md border border-primary/40 bg-primary/10 shadow-sm"
                              transition={{ type: "spring", stiffness: 320, damping: 28 }}
                            />
                          )}
                          <span className="relative flex flex-col gap-1">
                            <option.icon className="h-4 w-4" />
                            <span className="text-xs">{option.label}</span>
                          </span>
                        </motion.button>
                      </Button>
                    )
                  })}
                </div>
              </div>

              <Separator />

              <div className="space-y-3">
                <div className="flex items-center gap-2 text-sm font-medium">
                  <Brush className="h-4 w-4" />
                  <span>配色皮肤</span>
                  <Badge variant="outline" className="h-5 px-1.5 text-[11px]">
                    实时预览
                  </Badge>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  {skinPresets.map((preset) => {
                    const active = skin === preset.id
                    return (
                      <motion.button
                        key={preset.id}
                        type="button"
                        className={cn(
                          "group relative overflow-hidden rounded-lg border p-3 text-left transition hover:border-primary/60 hover:bg-primary/5",
                          active && "border-primary ring-1 ring-primary/50 bg-primary/5"
                        )}
                        onClick={() => handleSkinChange(preset.id)}
                        whileHover={{ y: -2 }}
                        whileTap={{ scale: 0.99 }}
                        transition={{ duration: 0.12 }}
                      >
                        {active && (
                          <motion.span
                            layoutId="skin-highlight"
                            className="absolute inset-0 rounded-lg border border-primary/50 bg-primary/5"
                            transition={{ type: "spring", stiffness: 280, damping: 26 }}
                          />
                        )}
                        <div className="relative flex items-center justify-between text-sm font-semibold">
                          <span>{preset.name}</span>
                          {active && <Check className="h-4 w-4 text-primary" />}
                        </div>
                        <p className="relative mt-1 text-xs text-muted-foreground line-clamp-2">
                          {preset.description}
                        </p>
                        <div className="relative mt-2 flex gap-1">
                          {preset.colors.map((color) => (
                            <motion.span
                              key={color}
                              layout
                              className="h-6 w-6 rounded-md border border-border/70"
                              style={{ backgroundColor: color }}
                              whileHover={{ scale: 1.05 }}
                            />
                          ))}
                        </div>
                      </motion.button>
                    )
                  })}
                </div>
              </div>

              <Separator />

              <div className="space-y-3 pb-8">
                <div className="flex items-center gap-2 text-sm font-medium">
                  <PanelsTopLeft className="h-4 w-4" />
                  <span>布局元素</span>
                </div>
                <div className="flex flex-col gap-2">
                  <div className="flex items-center justify-between rounded-lg border border-border/70 bg-muted/40 px-3 py-2">
                    <div>
                      <p className="text-sm font-medium">显示底部</p>
                      <p className="text-xs text-muted-foreground">控制页脚和快捷入口展示</p>
                    </div>
                    <Switch checked={showFooter} onCheckedChange={setShowFooter} />
                  </div>
                  <div className="flex items-center justify-between rounded-lg border border-border/70 bg-muted/40 px-3 py-2">
                    <div>
                      <p className="text-sm font-medium">显示多标签</p>
                      <p className="text-xs text-muted-foreground">隐藏后不再展示顶部标签栏</p>
                    </div>
                    <Switch checked={showTabBar} onCheckedChange={setShowTabBar} />
                  </div>
                </div>
              </div>

              <Separator />

              <div className="space-y-3 pb-8">
                <div className="flex items-center gap-2 text-sm font-medium">
                  <Smartphone className="h-4 w-4" />
                  <span>移动端行为</span>
                </div>
                <div className="flex flex-col gap-2">
                  <div className="flex items-center justify-between rounded-lg border border-border/70 bg-muted/40 px-3 py-2">
                    <div>
                      <p className="text-sm font-medium">固定头部</p>
                      <p className="text-xs text-muted-foreground">
                        滚动时保持顶部栏浮动，提升快速访问
                      </p>
                    </div>
                    <Switch
                      checked={mobileHeaderFixed}
                      onCheckedChange={setMobileHeaderFixed}
                    />
                  </div>
                  <div className="flex items-center justify-between rounded-lg border border-border/70 bg-muted/40 px-3 py-2">
                    <div>
                      <p className="text-sm font-medium">固定标签栏</p>
                      <p className="text-xs text-muted-foreground">
                        页面滚动时保持多标签栏可见
                      </p>
                    </div>
                    <Switch
                      checked={mobileTabBarFixed}
                      onCheckedChange={setMobileTabBarFixed}
                    />
                  </div>
                </div>
              </div>

              <Separator />

              <div className="space-y-2 border-t pt-4">
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full"
                  onClick={handleResetSettings}
                >
                  恢复默认配置
                </Button>
                <p className="text-center text-xs text-muted-foreground">
                  重置皮肤、布局与移动端行为为初始配置
                </p>
              </div>
            </div>
          </ScrollArea>
        </div>
      </SheetContent>
    </Sheet>
  )
}
