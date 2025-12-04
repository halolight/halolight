"use client"

import { motion } from "framer-motion"
import * as React from "react"
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useChartPalette } from "@/hooks/use-chart-palette"

// 模拟数据
const revenueData = [
  { month: "1月", revenue: 4000, orders: 240 },
  { month: "2月", revenue: 3000, orders: 139 },
  { month: "3月", revenue: 5000, orders: 380 },
  { month: "4月", revenue: 2780, orders: 190 },
  { month: "5月", revenue: 1890, orders: 280 },
  { month: "6月", revenue: 2390, orders: 320 },
  { month: "7月", revenue: 3490, orders: 410 },
]

const trafficData = [
  { name: "周一", pv: 4000, uv: 2400 },
  { name: "周二", pv: 3000, uv: 1398 },
  { name: "周三", pv: 2000, uv: 9800 },
  { name: "周四", pv: 2780, uv: 3908 },
  { name: "周五", pv: 1890, uv: 4800 },
  { name: "周六", pv: 2390, uv: 3800 },
  { name: "周日", pv: 3490, uv: 4300 },
]

export function RevenueChart() {
  const palette = useChartPalette()

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.4 }}
    >
      <Card>
        <CardHeader>
          <CardTitle>收入概览</CardTitle>
          <CardDescription>过去 7 个月的收入趋势</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={revenueData}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={palette.primary} stopOpacity={0.3} />
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
                  dataKey="revenue"
                  stroke={palette.primary}
                  fillOpacity={1}
                  fill="url(#colorRevenue)"
                  strokeWidth={2}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}

export function TrafficChart() {
  const palette = useChartPalette()

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.5 }}
    >
      <Card>
        <CardHeader>
          <CardTitle>访问流量</CardTitle>
          <CardDescription>本周页面访问量 (PV) 和独立访客 (UV)</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={trafficData}>
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
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}

export function SourceChart() {
  const palette = useChartPalette()
  const pieData = React.useMemo(
    () => [
      { name: "直接访问", value: 400, color: palette.primary },
      { name: "搜索引擎", value: 300, color: palette.secondary },
      { name: "社交媒体", value: 200, color: palette.tertiary },
      { name: "邮件营销", value: 100, color: palette.quaternary },
    ],
    [palette.primary, palette.quaternary, palette.secondary, palette.tertiary]
  )

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.6 }}
    >
      <Card>
        <CardHeader>
          <CardTitle>流量来源</CardTitle>
          <CardDescription>各渠道流量占比分布</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
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
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-4 flex flex-wrap justify-center gap-4">
            {pieData.map((item, index) => (
              <div key={index} className="flex items-center gap-2">
                <div
                  className="h-3 w-3 rounded-full"
                  style={{ backgroundColor: item.color }}
                />
                <span className="text-sm text-muted-foreground">{item.name}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
