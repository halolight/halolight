"use client"

import { motion } from "framer-motion"
import {
  BarChart,
  Book,
  Calendar,
  ChevronRight,
  Code,
  ExternalLink,
  FileText,
  FolderOpen,
  MessageSquare,
  Search,
  Settings,
  Shield,
  Users,
} from "lucide-react"
import Link from "next/link"
import * as React from "react"

import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"

const docCategories = [
  {
    title: "快速开始",
    icon: Book,
    description: "了解系统基础功能和快速上手指南",
    items: [
      { title: "系统介绍", href: "#intro" },
      { title: "安装配置", href: "#install" },
      { title: "基本使用", href: "#usage" },
    ],
  },
  {
    title: "用户管理",
    icon: Users,
    description: "用户创建、编辑、权限分配等操作指南",
    items: [
      { title: "添加用户", href: "#add-user" },
      { title: "角色权限", href: "#roles" },
      { title: "批量操作", href: "#batch" },
    ],
  },
  {
    title: "数据分析",
    icon: BarChart,
    description: "报表生成、数据导出和可视化功能",
    items: [
      { title: "仪表盘配置", href: "#dashboard" },
      { title: "报表生成", href: "#reports" },
      { title: "数据导出", href: "#export" },
    ],
  },
  {
    title: "系统设置",
    icon: Settings,
    description: "系统配置、主题定制和偏好设置",
    items: [
      { title: "基础配置", href: "#config" },
      { title: "主题定制", href: "#theme" },
      { title: "通知设置", href: "#notifications" },
    ],
  },
  {
    title: "安全指南",
    icon: Shield,
    description: "账户安全、数据保护和最佳实践",
    items: [
      { title: "双因素认证", href: "#2fa" },
      { title: "密码策略", href: "#password" },
      { title: "审计日志", href: "#audit" },
    ],
  },
  {
    title: "API 文档",
    icon: Code,
    description: "接口说明、调用示例和错误处理",
    items: [
      { title: "认证接口", href: "#auth-api" },
      { title: "用户接口", href: "#user-api" },
      { title: "数据接口", href: "#data-api" },
    ],
  },
]

const popularDocs = [
  { title: "如何创建新用户", views: 1234, category: "用户管理" },
  { title: "配置双因素认证", views: 986, category: "安全指南" },
  { title: "导出数据报表", views: 876, category: "数据分析" },
  { title: "自定义仪表盘", views: 654, category: "数据分析" },
  { title: "API 认证方式", views: 543, category: "API 文档" },
]

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
}

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
}

export default function DocsPage() {
  const [searchQuery, setSearchQuery] = React.useState("")

  const filteredCategories = docCategories.filter(
    (category) =>
      category.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      category.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      category.items.some((item) =>
        item.title.toLowerCase().includes(searchQuery.toLowerCase())
      )
  )

  return (
    <div className="space-y-6">
        {/* 页面标题 */}
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">帮助文档</h1>
          </div>
        </div>

        {/* 搜索栏 */}
        <Card>
          <CardContent className="pt-6">
            <div className="relative max-w-xl mx-auto">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                placeholder="搜索文档..."
                className="pl-10 h-12 text-lg"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </CardContent>
        </Card>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* 文档分类 */}
          <div className="lg:col-span-2">
            <motion.div
              variants={container}
              initial="hidden"
              animate="show"
              className="grid gap-4 sm:grid-cols-2"
            >
              {filteredCategories.map((category) => (
                <motion.div key={category.title} variants={item}>
                  <Card className="h-full hover:shadow-md transition-shadow">
                    <CardHeader className="pb-3">
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-primary/10">
                          <category.icon className="h-5 w-5 text-primary" />
                        </div>
                        <CardTitle className="text-lg">{category.title}</CardTitle>
                      </div>
                      <CardDescription>{category.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2">
                        {category.items.map((docItem) => (
                          <li key={docItem.title}>
                            <Link
                              href={docItem.href}
                              className="flex items-center text-sm text-muted-foreground hover:text-foreground transition-colors group"
                            >
                              <FileText className="mr-2 h-4 w-4" />
                              <span className="flex-1">{docItem.title}</span>
                              <ChevronRight className="h-4 w-4 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </motion.div>

            {filteredCategories.length === 0 && (
              <Card className="p-8 text-center">
                <Book className="mx-auto h-12 w-12 text-muted-foreground/50" />
                <h3 className="mt-4 text-lg font-medium">未找到相关文档</h3>
                <p className="mt-2 text-muted-foreground">
                  请尝试其他搜索关键词
                </p>
              </Card>
            )}
          </div>

          {/* 侧边栏 */}
          <div className="space-y-6">
            {/* 热门文档 */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">热门文档</CardTitle>
                <CardDescription>最受欢迎的帮助文章</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {popularDocs.map((doc, index) => (
                    <li key={doc.title}>
                      <Link
                        href="#"
                        className="flex items-start gap-3 group"
                      >
                        <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-muted text-xs font-medium">
                          {index + 1}
                        </span>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium group-hover:text-primary transition-colors truncate">
                            {doc.title}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {doc.category} · {doc.views} 次浏览
                          </p>
                        </div>
                      </Link>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            {/* 快速链接 */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">快速链接</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Link
                  href="#"
                  className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  <MessageSquare className="h-4 w-4" />
                  联系客服
                  <ExternalLink className="ml-auto h-3 w-3" />
                </Link>
                <Link
                  href="#"
                  className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  <Calendar className="h-4 w-4" />
                  预约培训
                  <ExternalLink className="ml-auto h-3 w-3" />
                </Link>
                <Link
                  href="#"
                  className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  <FolderOpen className="h-4 w-4" />
                  下载资源
                  <ExternalLink className="ml-auto h-3 w-3" />
                </Link>
              </CardContent>
            </Card>

            {/* 版本信息 */}
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">文档版本</span>
                  <Badge variant="secondary">v1.0.0</Badge>
                </div>
                <Separator className="my-3" />
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">最后更新</span>
                  <span className="text-sm">2024-01-15</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
    </div>
  )
}
