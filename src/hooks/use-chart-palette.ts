import { useTheme } from "next-themes"
import * as React from "react"

type ChartPalette = {
  primary: string
  secondary: string
  tertiary: string
  quaternary: string
  quinary: string
  positive: string
  negative: string
}

const fallback: ChartPalette = {
  primary: "oklch(var(--chart-1))",
  secondary: "oklch(var(--chart-2))",
  tertiary: "oklch(var(--chart-3))",
  quaternary: "oklch(var(--chart-4))",
  quinary: "oklch(var(--chart-5))",
  positive: "oklch(var(--chart-1))",
  negative: "oklch(var(--chart-5))",
}

export function useChartPalette(): ChartPalette {
  const { resolvedTheme } = useTheme()
  const [palette, setPalette] = React.useState<ChartPalette>(fallback)

  React.useEffect(() => {
    if (typeof window === "undefined") return

    const root = getComputedStyle(document.documentElement)
    const read = (key: string, fb: string) => (root.getPropertyValue(key).trim() || fb)

    const update = () => {
      const next = {
        primary: read("--chart-1", fallback.primary),
        secondary: read("--chart-2", fallback.secondary),
        tertiary: read("--chart-3", fallback.tertiary),
        quaternary: read("--chart-4", fallback.quaternary),
        quinary: read("--chart-5", fallback.quinary),
        positive: read("--chart-1", fallback.positive),
        negative: read("--chart-5", fallback.negative),
      }
      setPalette(next)
    }

    update()

    // 监听 data-skin / class 变化，确保切换主题或皮肤时实时更新
    const observer = new MutationObserver((mutations) => {
      for (const mutation of mutations) {
        if (mutation.type === "attributes") {
          update()
          break
        }
      }
    })
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ["class", "data-skin"] })

    return () => observer.disconnect()
  }, [resolvedTheme])

  return palette
}
