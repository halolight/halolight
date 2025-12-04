"use client"

import { motion } from "framer-motion"
import {
  Clock,
  Eye,
  MousePointerClick,
  TrendingDown,
  TrendingUp,
  Users,
} from "lucide-react"
import * as React from "react"
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts"

import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useChartPalette } from "@/hooks/use-chart-palette"

// 模拟数据
const weeklyData = [
  { day: "周一", visitors: 2400, pageViews: 4000, bounceRate: 35 },
  { day: "周二", visitors: 1398, pageViews: 3000, bounceRate: 42 },
  { day: "周三", visitors: 9800, pageViews: 2000, bounceRate: 28 },
  { day: "周四", visitors: 3908, pageViews: 2780, bounceRate: 38 },
  { day: "周五", visitors: 4800, pageViews: 1890, bounceRate: 31 },
  { day: "周六", visitors: 3800, pageViews: 2390, bounceRate: 45 },
  { day: "周日", visitors: 4300, pageViews: 3490, bounceRate: 40 },
]

const metrics = [
  {
    title: "页面访问量",
    value: "128,430",
    change: 12.5,
    icon: Eye,
    colorKey: "primary",
  },
  {
    title: "独立访客",
    value: "24,521",
    change: 8.2,
    icon: Users,
    colorKey: "secondary",
  },
  {
    title: "平均停留时间",
    value: "4m 32s",
    change: -2.4,
    icon: Clock,
    colorKey: "quaternary",
  },
  {
    title: "点击率",
    value: "3.24%",
    change: 4.1,
    icon: MousePointerClick,
    colorKey: "tertiary",
  },
]

// 生成基于时间的模拟数据（避免 SSR 不一致）
function generateHourlyData() {
  // 使用固定种子模式生成数据，模拟真实流量模式
  const basePattern = [
    120, 80, 50, 30, 25, 40, 150, 380, 620, 850, 920, 780,
    650, 720, 810, 890, 950, 880, 720, 580, 420, 350, 280, 180
  ]
  return Array.from({ length: 24 }, (_, i) => ({
    hour: `${String(i).padStart(2, '0')}:00`,
    value: basePattern[i] + Math.floor(basePattern[i] * 0.2 * (Math.sin(i) + 1)),
  }))
}

export default function AnalyticsPage() {
  // 使用 state 来避免 SSR/客户端不一致
  const [hourlyData, setHourlyData] = React.useState<Array<{hour: string, value: number}>>([])
  const [mounted, setMounted] = React.useState(false)
  const palette = useChartPalette()

  React.useEffect(() => {
    setMounted(true)
    setHourlyData(generateHourlyData())
  }, [])

  return (
    <div className="space-y-6">
      {/* 页面标题 */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <h1 className="text-3xl font-bold tracking-tight">数据分析</h1>
      </motion.div>

      {/* 指标卡片 */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {metrics.map((metric, index) => (
          <motion.div
            key={metric.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
          >
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardDescription>{metric.title}</CardDescription>
                <metric.icon
                  className="h-5 w-5"
                  style={{ color: palette[metric.colorKey as keyof typeof palette] || palette.primary }}
                />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{metric.value}</div>
                <div className="flex items-center gap-1 mt-1">
                  {metric.change > 0 ? (
                    <TrendingUp className="h-4 w-4" style={{ color: palette.positive }} />
                  ) : (
                    <TrendingDown className="h-4 w-4" style={{ color: palette.negative }} />
                  )}
                  <span style={{ color: metric.change > 0 ? palette.positive : palette.negative }}>
                    {Math.abs(metric.change)}%
                  </span>
                  <span className="text-xs text-muted-foreground">较上周</span>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* 图表 */}
      <div className="grid gap-4 md:grid-cols-2">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.4 }}
        >
          <Card>
            <CardHeader>
              <CardTitle>访客趋势</CardTitle>
              <CardDescription>本周每日独立访客数</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={weeklyData}>
                    <defs>
                      <linearGradient id="colorVisitors" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor={palette.primary} stopOpacity={0.3} />
                        <stop offset="95%" stopColor={palette.primary} stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                    <XAxis dataKey="day" className="text-xs" />
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
                      dataKey="visitors"
                      stroke={palette.primary}
                      fillOpacity={1}
                      fill="url(#colorVisitors)"
                      strokeWidth={2}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.5 }}
        >
          <Card>
            <CardHeader>
              <CardTitle>跳出率分析</CardTitle>
              <CardDescription>本周每日跳出率百分比</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={weeklyData}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                    <XAxis dataKey="day" className="text-xs" />
                    <YAxis className="text-xs" />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "hsl(var(--popover))",
                        border: "1px solid hsl(var(--border))",
                        borderRadius: "var(--radius)",
                      }}
                    />
                    <Bar
                      dataKey="bounceRate"
                      fill={palette.secondary}
                      radius={[4, 4, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* 实时流量 */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.6 }}
      >
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>24小时流量</CardTitle>
                <CardDescription>过去24小时的访问量分布</CardDescription>
              </div>
              <Badge variant="outline" className="animate-pulse">
                <span className="mr-1 h-2 w-2 rounded-full bg-green-500 inline-block" />
                实时
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="h-[200px]">
              {mounted && hourlyData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={hourlyData}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                    <XAxis
                      dataKey="hour"
                      className="text-xs"
                      interval={2}
                      tick={{ fontSize: 11 }}
                    />
                    <YAxis className="text-xs" tick={{ fontSize: 11 }} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "hsl(var(--popover))",
                        border: "1px solid hsl(var(--border))",
                        borderRadius: "var(--radius)",
                      }}
                      labelFormatter={(label) => `时间: ${label}`}
                      formatter={(value: number) => [`${value} 次访问`, "访问量"]}
                    />
                    <Line
                      type="monotone"
                      dataKey="value"
                      stroke={palette.tertiary}
                      strokeWidth={2}
                      dot={false}
                      activeDot={{ r: 4 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex items-center justify-center h-full text-muted-foreground">
                  加载中...
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}
