"use client"

import "react-grid-layout/css/styles.css"
import "react-resizable/css/styles.css"

import {
  BarChart,
  BarChart3,
  Bell,
  Calendar,
  CheckSquare,
  FilePlus,
  GripVertical,
  LineChart,
  PieChart,
  Plus,
  RotateCcw,
  Save,
  Settings,
  TrendingDown,
  TrendingUp,
  Users,
  X,
  Zap,
} from "lucide-react"
import { useRouter } from "next/navigation"
import * as React from "react"
import GridLayout, { Layout } from "react-grid-layout"
import {
  Area,
  AreaChart,
  Bar,
  BarChart as ReBarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart as RePieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { useChartPalette } from "@/hooks/use-chart-palette"
import {
  useDashboardCalendar,
  useDashboardNotifications,
  useDashboardPie,
  useDashboardRefresh,
  useDashboardSales,
  useDashboardStats,
  useDashboardTasks,
  useDashboardUsers,
  useDashboardVisits,
} from "@/hooks/use-dashboard-data"
import { cn } from "@/lib/utils"
import {
  type DashboardLayout,
  type DashboardWidget,
  useDashboardStore,
  widgetTemplates,
  type WidgetType,
} from "@/stores/dashboard-store"

// 按视口宽度换算列数
const getColumnsForWidth = (width: number) => {
  if (width < 640) return 1
  if (width < 1024) return 6
  return 12
}

// 根据列数调整布局，移动端按顺序纵向堆叠
const getResponsiveLayout = (baseLayout: DashboardLayout[], cols: number): DashboardLayout[] => {
  if (cols <= 1) {
    let currentY = 0
    return baseLayout.map((item) => {
      const height = Math.max(item.h, item.minH ?? 1)
      const next = { ...item, x: 0, y: currentY, w: 1, h: height }
      currentY += height
      return next
    })
  }

  return baseLayout.map((item) => {
    const width = Math.min(item.w, cols)
    const maxX = Math.max(cols - width, 0)
    const x = Math.min(item.x, maxX)
    return { ...item, w: width, x }
  })
}

// 图标映射
const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  BarChart3,
  LineChart,
  BarChart,
  PieChart,
  Users,
  Bell,
  CheckSquare,
  Calendar,
  Zap,
}

// 统计数据小部件
function StatsWidget() {
  const palette = useChartPalette()
  const { data, isLoading } = useDashboardStats()
  type StatItem = { label: string; value: string; change: string; up: boolean }
  const stats: StatItem[] =
    data && !isLoading
      ? [
          { label: "总用户", value: data.totalUsers?.toLocaleString() ?? "-", change: `${data.userGrowth}%`, up: data.userGrowth >= 0 },
          { label: "总收入", value: data.totalRevenue ? `¥${data.totalRevenue.toLocaleString()}` : "-", change: `${data.revenueGrowth}%`, up: data.revenueGrowth >= 0 },
          { label: "总订单", value: data.totalOrders?.toLocaleString() ?? "-", change: `${data.orderGrowth}%`, up: data.orderGrowth >= 0 },
          { label: "转化率", value: data.conversionRate ? `${data.conversionRate}%` : "-", change: `${data.rateGrowth}%`, up: data.rateGrowth >= 0 },
        ]
      : []
  const display: StatItem[] =
    stats.length > 0
      ? stats
      : Array.from({ length: 4 }, () => ({ label: "", value: "", change: "", up: true }))

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 h-full">
      {display.map((stat, idx) => (
        <div key={stat.label || idx} className="flex flex-col justify-center">
          <p className="text-sm text-muted-foreground">{stat.label || "加载中..."}</p>
          <p className="text-2xl font-bold">{stat.value || "—"}</p>
          <div
            className="flex items-center text-sm"
            style={{
              color: stat.up ? palette.positive : palette.negative,
            }}
          >
            {stat.up ? (
              <TrendingUp className="h-3 w-3 mr-1" />
            ) : (
              <TrendingDown className="h-3 w-3 mr-1" />
            )}
            {stat.change}
          </div>
        </div>
      ))}
    </div>
  )
}

// 折线图小部件
function LineChartWidget({ isMobile }: { isMobile?: boolean }) {
  const palette = useChartPalette()
  const { data, isLoading } = useDashboardVisits()
  const lineData = data?.map((item) => ({ month: item.date, value: item.visits })) ?? []
  const chartHeight = isMobile ? 200 : 260
  return (
    <div style={{ height: chartHeight }}>
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={isLoading ? [] : lineData}>
          <defs>
            <linearGradient id="widgetLine" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={palette.primary} stopOpacity={0.35} />
              <stop offset="95%" stopColor={palette.primary} stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
          <XAxis dataKey="month" className="text-xs" />
          <YAxis className="text-xs" />
          <Tooltip
            contentStyle={{
              backgroundColor: "hsl(var(--popover))",
              border: "1px solid hsl(var(--border))",
              borderRadius: "var(--radius)",
            }}
          />
          <Area
            type="monotone"
            dataKey="value"
            stroke={palette.primary}
            fillOpacity={1}
            fill="url(#widgetLine)"
            strokeWidth={2}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}

// 柱状图小部件
function BarChartWidget({ isMobile }: { isMobile?: boolean }) {
  const palette = useChartPalette()
  const { data, isLoading } = useDashboardSales()
  const chartData = data?.map((item) => ({ name: item.month, pv: item.sales, uv: item.profit })) ?? []
  const chartHeight = isMobile ? 200 : 260
  return (
    <div style={{ height: chartHeight }}>
      <ResponsiveContainer width="100%" height="100%">
        <ReBarChart data={isLoading ? [] : chartData}>
          <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
          <XAxis dataKey="name" className="text-xs" />
          <YAxis className="text-xs" />
          <Tooltip
            contentStyle={{
              backgroundColor: "hsl(var(--popover))",
              border: "1px solid hsl(var(--border))",
              borderRadius: "var(--radius)",
            }}
          />
          <Bar dataKey="pv" fill={palette.primary} radius={[4, 4, 0, 0]} />
          <Bar dataKey="uv" fill={palette.secondary} radius={[4, 4, 0, 0]} />
        </ReBarChart>
      </ResponsiveContainer>
    </div>
  )
}

// 饼图小部件
function PieChartWidget({ isMobile }: { isMobile?: boolean }) {
  const palette = useChartPalette()
  const { data, isLoading } = useDashboardPie()
  const pieData = React.useMemo(() => {
    const paletteColors = [palette.primary, palette.secondary, palette.tertiary, palette.quaternary, palette.quinary]
    return (data ?? []).map((item, idx) => ({ ...item, color: paletteColors[idx % paletteColors.length] }))
  }, [data, palette.primary, palette.quaternary, palette.quinary, palette.secondary, palette.tertiary])
  const chartHeight = isMobile ? 220 : 260
  return (
    <div className="h-full flex flex-col gap-4">
      <div style={{ height: chartHeight }}>
        <ResponsiveContainer width="100%" height="100%">
          <RePieChart>
            <Pie
              data={isLoading ? [] : pieData}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={100}
              paddingAngle={5}
              dataKey="value"
            >
              {(isLoading ? [] : pieData).map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                backgroundColor: "hsl(var(--popover))",
                border: "1px solid hsl(var(--border))",
                borderRadius: "var(--radius)",
              }}
            />
          </RePieChart>
        </ResponsiveContainer>
      </div>
      <div className="flex flex-wrap justify-center gap-3">
        {pieData.map((item, index) => (
          <div key={index} className="flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: item.color }} />
            <span className="text-xs text-muted-foreground">{item.name}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

// 最近用户小部件
function RecentUsersWidget({ isMobile }: { isMobile?: boolean }) {
  const { data, isLoading } = useDashboardUsers()
  const list = Array.isArray(data) ? data : []
  const display = (isLoading ? [] : list).slice(0, isMobile ? 3 : list.length)

  return (
    <div className="space-y-3">
      {display.map((user) => (
        <div key={user.email} className="flex items-center justify-between">
          <div>
            <p className="font-medium text-sm">{user.name}</p>
            <p className="text-xs text-muted-foreground">{user.email}</p>
          </div>
          <span className="text-xs text-muted-foreground">刚刚</span>
        </div>
      ))}
    </div>
  )
}

// 通知小部件
function NotificationsWidget({ isMobile }: { isMobile?: boolean }) {
  const { data, isLoading } = useDashboardNotifications()
  const list = Array.isArray(data) ? data : []
  const display = (isLoading ? [] : list).slice(0, isMobile ? 3 : list.length)

  return (
    <div className="space-y-3">
      {display.map((n) => (
        <div key={n.id} className="flex items-center gap-3">
          <Bell className="h-4 w-4 text-muted-foreground" />
          <div className="flex-1">
            <p className="text-sm font-medium">{n.title}</p>
            <p className="text-xs text-muted-foreground">{n.time}</p>
          </div>
        </div>
      ))}
    </div>
  )
}

// 任务小部件
function TasksWidget({ isMobile }: { isMobile?: boolean }) {
  const { data, isLoading } = useDashboardTasks()
  const tasks = data ?? []
  const display = (isLoading ? [] : tasks).slice(0, isMobile ? 3 : tasks.length)

  return (
    <div className="space-y-3">
      {display.map((task) => (
        <div key={task.id} className="flex items-center gap-3">
          <CheckSquare className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm flex-1">{task.title}</span>
          <Badge variant={task.status === "in_progress" ? "default" : "outline"} className="text-xs">
            {task.status === "in_progress" ? "进行中" : task.status === "done" ? "已完成" : "待处理"}
          </Badge>
        </div>
      ))}
    </div>
  )
}

// 日历小部件
function CalendarWidget({ isMobile }: { isMobile?: boolean }) {
  const { data, isLoading } = useDashboardCalendar()

  const today = React.useMemo(() => {
    const d = new Date()
    return d.toISOString().slice(0, 10)
  }, [])

  const todayEvents = React.useMemo(() => {
    const events = Array.isArray(data) ? data : []
    return events.filter((event) => {
      const start = event.start?.slice(0, 10)
      return start === today
    })
  }, [data, today])

  const formatRange = (start?: string, end?: string) => {
    if (!start) return "时间未定"
    const startDate = new Date(start)
    const endDate = end ? new Date(end) : null
    const fmt = new Intl.DateTimeFormat("zh-CN", {
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    })
    const startStr = fmt.format(startDate)
    const endStr = endDate ? fmt.format(endDate) : ""
    return endStr ? `${startStr} - ${endStr}` : startStr
  }

  const displayList = todayEvents.slice(0, isMobile ? 3 : 6)

  return (
    <div className="h-full flex flex-col gap-3">
      <div className="flex-1 overflow-auto rounded-md border bg-muted/30 p-3">
        {isLoading && <p className="text-xs text-muted-foreground">加载中...</p>}
        {!isLoading && todayEvents.length === 0 && (
          <p className="text-xs text-muted-foreground text-center">暂无日程</p>
        )}
        {!isLoading && todayEvents.length > 0 && (
          <ul className="space-y-2">
            {displayList.map((event) => (
              <li
                key={event.id}
                className="flex items-start justify-between gap-2 rounded-md bg-background p-2 shadow-xs"
              >
                <div className="flex-1">
                  <p className="text-sm font-medium leading-tight">{event.title || "未命名事件"}</p>
                  <p className="text-[11px] text-muted-foreground leading-tight">
                    {formatRange(event.start, event.end)}
                  </p>
                </div>
                <span className="text-[11px] text-muted-foreground">日程</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}

// 快捷操作小部件
function QuickActionsWidget() {
  const router = useRouter()
  const actions = [
    { label: "添加用户", icon: Users, href: "/users" },
    { label: "新建文档", icon: FilePlus, href: "/documents" },
    { label: "发送通知", icon: Bell, href: "/notifications" },
    { label: "数据分析", icon: BarChart3, href: "/analytics" },
    { label: "日程安排", icon: Calendar, href: "/calendar" },
    { label: "系统设置", icon: Settings, href: "/settings" },
  ]

  return (
    <div className="h-full flex flex-col">
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-3 flex-1">
        {actions.map((action) => (
          <Button
            key={action.label}
            variant="outline"
            className="flex flex-col items-center justify-center gap-2 h-full min-h-[88px] rounded-lg text-sm sm:text-xs"
            onClick={() => router.push(action.href)}
          >
            <action.icon className="h-5 w-5 text-primary" />
            <span className="font-medium">{action.label}</span>
          </Button>
        ))}
      </div>
    </div>
  )
}

// 小部件内容渲染
function WidgetContent({ type, isMobile }: { type: WidgetType; isMobile?: boolean }) {
  switch (type) {
    case "stats":
      return <StatsWidget />
    case "chart-line":
      return <LineChartWidget isMobile={isMobile} />
    case "chart-bar":
      return <BarChartWidget isMobile={isMobile} />
    case "chart-pie":
      return <PieChartWidget isMobile={isMobile} />
    case "recent-users":
      return <RecentUsersWidget isMobile={isMobile} />
    case "notifications":
      return <NotificationsWidget isMobile={isMobile} />
    case "tasks":
      return <TasksWidget isMobile={isMobile} />
    case "calendar":
      return <CalendarWidget isMobile={isMobile} />
    case "quick-actions":
      return <QuickActionsWidget />
    default:
      return <div>未知部件类型</div>
  }
}

// 单个小部件组件
interface WidgetCardProps {
  widget: DashboardWidget
  isEditing: boolean
  onRemove: () => void
  isMobile: boolean
}

function WidgetCard({ widget, isEditing, onRemove, isMobile }: WidgetCardProps) {
  return (
    <Card className="h-full overflow-hidden">
      <CardHeader className="pb-2 flex flex-row items-center justify-between space-y-0">
        <div className="flex items-center gap-2">
          {isEditing && (
            <div className="cursor-grab active:cursor-grabbing drag-handle">
              <GripVertical className="h-4 w-4 text-muted-foreground" />
            </div>
          )}
          <CardTitle className="text-sm font-medium">{widget.title}</CardTitle>
        </div>
        {isEditing && (
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6"
            onClick={onRemove}
          >
            <X className="h-3 w-3" />
          </Button>
        )}
      </CardHeader>
      <CardContent className="flex-1 overflow-auto">
        <WidgetContent type={widget.type} isMobile={isMobile} />
      </CardContent>
    </Card>
  )
}

// 可配置仪表盘组件
export function ConfigurableDashboard() {
  const {
    widgets,
    layouts,
    isEditing,
    setLayouts,
    setIsEditing,
    addWidget,
    removeWidget,
    resetToDefault,
  } = useDashboardStore()

  // 初始化容器宽度为 0，在 layout effect 测量后才渲染网格，避免 SSR/CSR 不一致
  const [containerWidth, setContainerWidth] = React.useState(0)
  const containerRef = React.useRef<HTMLDivElement>(null)
  const columns = React.useMemo(() => getColumnsForWidth(containerWidth), [containerWidth])
  const isMobile = columns === 1
  const rowHeight = isMobile ? 140 : 90
  const responsiveLayout = React.useMemo(
    () => getResponsiveLayout(layouts, columns),
    [columns, layouts]
  )
  const canEditLayout = !isMobile && isEditing && columns === 12
  const refreshDashboard = useDashboardRefresh()
  const [refreshing, setRefreshing] = React.useState(false)

  const handleRefresh = React.useCallback(async () => {
    setRefreshing(true)
    await refreshDashboard()
    setRefreshing(false)
  }, [refreshDashboard])

  // 使用 useLayoutEffect + ResizeObserver 在绘制前同步容器宽度，避免时序闪烁
  React.useLayoutEffect(() => {
    const node = containerRef.current
    if (!node) return

    const updateWidth = () => {
      setContainerWidth(node.offsetWidth)
    }

    // 立即同步一次
    updateWidth()

    // 优先使用 ResizeObserver 监听容器自身尺寸变化
    if (typeof ResizeObserver !== "undefined") {
      const observer = new ResizeObserver(updateWidth)
      observer.observe(node)
      return () => observer.disconnect()
    }

    // 降级使用 window resize 事件
    window.addEventListener("resize", updateWidth)
    return () => window.removeEventListener("resize", updateWidth)
  }, [])

  const handleLayoutChange = (newLayout: Layout[]) => {
    if (!isEditing || columns !== 12) return
    setLayouts(newLayout as DashboardLayout[])
  }

  const handleAddWidget = (type: WidgetType, title: string) => {
    addWidget({ type, title })
  }

  // 移动端增加轻微水平边距，避免内容贴边且为 GridLayout 计算误差提供缓冲
  const gridMargin: [number, number] = isMobile ? [8, 12] : [12, 12]
  const gridPadding: [number, number] = isMobile ? [8, 0] : [0, 0]

  return (
    <div ref={containerRef} className="space-y-4">
      {/* 工具栏 */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={handleRefresh} disabled={refreshing}>
            <RotateCcw className="h-4 w-4 mr-1" />
            {refreshing ? "刷新中..." : "刷新"}
          </Button>
        </div>
        <div className="flex items-center gap-2">
          {isEditing ? (
            <>
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="outline" size="sm">
                    <Plus className="h-4 w-4 mr-1" />
                    部件
                  </Button>
                </SheetTrigger>
                <SheetContent>
                  <SheetHeader>
                    <SheetTitle>部件</SheetTitle>
                    <SheetDescription>选择要添加到仪表盘的部件</SheetDescription>
                  </SheetHeader>
                  <div className="grid gap-3 mt-4">
                    {widgetTemplates.map((template) => {
                      const Icon = iconMap[template.icon] || BarChart3
                      return (
                        <Button
                          key={template.type}
                          variant="outline"
                          className="justify-start h-auto py-3"
                          onClick={() => {
                            handleAddWidget(template.type, template.title)
                          }}
                        >
                          <Icon className="h-5 w-5 mr-3" />
                          <div className="text-left">
                            <p className="font-medium">{template.title}</p>
                            <p className="text-xs text-muted-foreground">
                              {template.description}
                            </p>
                          </div>
                        </Button>
                      )
                    })}
                  </div>
                </SheetContent>
              </Sheet>
              <Button variant="outline" size="sm" onClick={resetToDefault}>
                <RotateCcw className="h-4 w-4 mr-1" />
                重置
              </Button>
              <Button size="sm" onClick={() => setIsEditing(false)}>
                <Save className="h-4 w-4 mr-1" />
                保存
              </Button>
            </>
          ) : (
            <Button variant="outline" size="sm" onClick={() => setIsEditing(true)}>
              <Settings className="h-4 w-4 mr-1" />
              自定义
            </Button>
          )}
        </div>
      </div>

      {/* 网格布局 - 只在容器宽度测量完成后渲染，避免 SSR/CSR 不一致和首帧溢出 */}
      {containerWidth > 0 && (
        <GridLayout
          className="layout"
          layout={responsiveLayout}
          cols={columns}
          rowHeight={rowHeight}
          width={containerWidth}
          margin={gridMargin}
          containerPadding={gridPadding}
          onLayoutChange={handleLayoutChange}
          isDraggable={canEditLayout}
          isResizable={canEditLayout}
          draggableHandle=".drag-handle"
          compactType="vertical"
          preventCollision={false}
        >
          {widgets.map((widget) => (
            <div key={widget.id} className={cn(isEditing && "ring-2 ring-primary/20 rounded-lg")}>
              <WidgetCard
                widget={widget}
                isEditing={isEditing}
                isMobile={isMobile}
                onRemove={() => removeWidget(widget.id)}
              />
            </div>
          ))}
        </GridLayout>
      )}

      {/* 空状态 */}
      {widgets.length === 0 && (
        <Card className="p-8 text-center">
          <BarChart3 className="mx-auto h-12 w-12 text-muted-foreground/50" />
          <h3 className="mt-4 text-lg font-medium">没有部件</h3>
          <p className="mt-2 text-muted-foreground">
            点击「自定义」按钮添加仪表盘部件
          </p>
        </Card>
      )}
    </div>
  )
}
