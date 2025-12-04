import type { Layout } from "react-grid-layout"
import { create } from "zustand"
import { persist } from "zustand/middleware"

// 仪表盘小部件类型
export type WidgetType =
  | "stats"
  | "chart-line"
  | "chart-bar"
  | "chart-pie"
  | "recent-users"
  | "notifications"
  | "tasks"
  | "calendar"
  | "quick-actions"

export interface DashboardWidget {
  id: string
  type: WidgetType
  title: string
  config?: Record<string, unknown>
}

export interface DashboardLayout extends Layout {
  i: string
}

interface DashboardState {
  widgets: DashboardWidget[]
  layouts: DashboardLayout[]
  isEditing: boolean
  // 操作
  setWidgets: (widgets: DashboardWidget[]) => void
  addWidget: (widget: Omit<DashboardWidget, "id">) => void
  removeWidget: (id: string) => void
  updateWidget: (id: string, updates: Partial<DashboardWidget>) => void
  setLayouts: (layouts: DashboardLayout[]) => void
  setIsEditing: (editing: boolean) => void
  resetToDefault: () => void
}

// 默认小部件
const defaultWidgets: DashboardWidget[] = [
  { id: "stats-1", type: "stats", title: "数据概览" },
  { id: "chart-line-1", type: "chart-line", title: "访问趋势" },
  { id: "chart-bar-1", type: "chart-bar", title: "销售统计" },
  { id: "chart-pie-1", type: "chart-pie", title: "流量占比" },
  { id: "recent-users-1", type: "recent-users", title: "最近用户" },
  { id: "notifications-1", type: "notifications", title: "最新通知" },
  { id: "tasks-1", type: "tasks", title: "待办任务" },
  { id: "calendar-1", type: "calendar", title: "今日日程" },
  { id: "quick-actions-1", type: "quick-actions", title: "快捷操作" },
]

// 默认布局
const defaultLayouts: DashboardLayout[] = [
  { i: "stats-1", x: 0, y: 0, w: 12, h: 2, minW: 6, minH: 2 },
  { i: "chart-line-1", x: 0, y: 2, w: 8, h: 4, minW: 4, minH: 3 },
  { i: "chart-bar-1", x: 8, y: 2, w: 4, h: 4, minW: 3, minH: 3 },
  { i: "chart-pie-1", x: 0, y: 6, w: 4, h: 4, minW: 3, minH: 3 },
  { i: "recent-users-1", x: 4, y: 6, w: 4, h: 4, minW: 3, minH: 3 },
  { i: "notifications-1", x: 8, y: 6, w: 4, h: 4, minW: 3, minH: 3 },
  { i: "tasks-1", x: 0, y: 10, w: 4, h: 4, minW: 3, minH: 3 },
  { i: "calendar-1", x: 4, y: 10, w: 4, h: 4, minW: 3, minH: 3 },
  { i: "quick-actions-1", x: 8, y: 10, w: 4, h: 4, minW: 3, minH: 3 },
]

export const useDashboardStore = create<DashboardState>()(
  persist(
    (set, get) => ({
      widgets: defaultWidgets,
      layouts: defaultLayouts,
      isEditing: false,

      setWidgets: (widgets) => set({ widgets }),

      addWidget: (widget) => {
        const { widgets, layouts } = get()
        const newWidget: DashboardWidget = {
          ...widget,
          id: `${widget.type}-${Date.now()}`,
        }

        // 找到最大的 y 值来放置新部件
        const maxY = layouts.reduce((max, l) => Math.max(max, l.y + l.h), 0)

        const newLayout: DashboardLayout = {
          i: newWidget.id,
          x: 0,
          y: maxY,
          w: 4,
          h: widget.type === "quick-actions" ? 4 : 3,
          minW: 3,
          minH: widget.type === "quick-actions" ? 3 : 2,
        }

        set({
          widgets: [...widgets, newWidget],
          layouts: [...layouts, newLayout],
        })
      },

      removeWidget: (id) => {
        const { widgets, layouts } = get()
        set({
          widgets: widgets.filter((w) => w.id !== id),
          layouts: layouts.filter((l) => l.i !== id),
        })
      },

      updateWidget: (id, updates) => {
        const { widgets } = get()
        set({
          widgets: widgets.map((w) =>
            w.id === id ? { ...w, ...updates } : w
          ),
        })
      },

      setLayouts: (layouts) => set({ layouts }),

      setIsEditing: (editing) => set({ isEditing: editing }),

      resetToDefault: () =>
        set({
          widgets: defaultWidgets,
          layouts: defaultLayouts,
        }),
    }),
    {
      name: "dashboard-storage",
      partialize: (state) => ({
        widgets: state.widgets,
        layouts: state.layouts,
      }),
    }
  )
)

// 可用的小部件模板
export const widgetTemplates: Array<{
  type: WidgetType
  title: string
  description: string
  icon: string
}> = [
  {
    type: "stats",
    title: "数据统计",
    description: "显示关键业务指标",
    icon: "BarChart3",
  },
  {
    type: "chart-line",
    title: "折线图",
    description: "显示趋势数据",
    icon: "LineChart",
  },
  {
    type: "chart-bar",
    title: "柱状图",
    description: "显示对比数据",
    icon: "BarChart",
  },
  {
    type: "chart-pie",
    title: "饼图",
    description: "显示占比数据",
    icon: "PieChart",
  },
  {
    type: "recent-users",
    title: "最近用户",
    description: "显示最近注册的用户",
    icon: "Users",
  },
  {
    type: "notifications",
    title: "通知",
    description: "显示最新通知",
    icon: "Bell",
  },
  {
    type: "tasks",
    title: "待办任务",
    description: "显示待处理任务",
    icon: "CheckSquare",
  },
  {
    type: "calendar",
    title: "日历",
    description: "显示今日日程",
    icon: "Calendar",
  },
  {
    type: "quick-actions",
    title: "快捷操作",
    description: "常用功能入口",
    icon: "Zap",
  },
]
