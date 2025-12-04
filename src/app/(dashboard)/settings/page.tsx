"use client"

import { motion } from "framer-motion"
import {
  Bell,
  Database,
  Globe,
  Key,
  Palette,
  Shield,
  User,
} from "lucide-react"
import * as React from "react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { InputClear } from "@/components/ui/input-clear"
import { Separator } from "@/components/ui/separator"

const settingSections = [
  {
    id: "profile",
    title: "个人资料",
    description: "管理您的个人信息和账户设置",
    icon: User,
  },
  {
    id: "notifications",
    title: "通知设置",
    description: "配置通知偏好和提醒方式",
    icon: Bell,
  },
  {
    id: "security",
    title: "安全设置",
    description: "管理密码、两步验证等安全选项",
    icon: Shield,
  },
  {
    id: "appearance",
    title: "外观设置",
    description: "自定义界面主题和显示选项",
    icon: Palette,
  },
  {
    id: "language",
    title: "语言与地区",
    description: "设置界面语言和地区格式",
    icon: Globe,
  },
  {
    id: "data",
    title: "数据管理",
    description: "导出、导入和备份您的数据",
    icon: Database,
  },
  {
    id: "api",
    title: "API 密钥",
    description: "管理 API 访问密钥和权限",
    icon: Key,
  },
]

export default function SettingsPage() {
  const [activeSection, setActiveSection] = React.useState("profile")

  // 表单状态
  const [profileData, setProfileData] = React.useState({
    name: "管理员",
    username: "admin",
    email: "admin@halolight.h7ml.cn",
    bio: "系统管理员",
  })

  // 原始数据，用于重置
  const originalData = React.useRef(profileData)

  // 保存处理函数
  const handleSave = () => {
    // 这里可以添加保存逻辑，比如 API 调用
    console.log("保存的数据:", profileData)
    // 模拟保存成功
    alert("保存成功！")
    // 更新原始数据
    originalData.current = { ...profileData }
  }

  return (
    <div className="space-y-6">
        {/* 页面标题 */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <h1 className="text-3xl font-bold tracking-tight">系统设置</h1>
        </motion.div>

        <div className="grid gap-6 lg:grid-cols-4">
          {/* 设置导航 */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
            className="lg:col-span-1"
          >
            <Card>
              <CardContent className="p-2">
                <nav className="space-y-1">
                  {settingSections.map((section) => (
                    <button
                      key={section.id}
                      onClick={() => setActiveSection(section.id)}
                      className={`flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors ${
                        activeSection === section.id
                          ? "bg-primary text-primary-foreground"
                          : "hover:bg-muted"
                      }`}
                    >
                      <section.icon className="h-4 w-4" />
                      {section.title}
                    </button>
                  ))}
                </nav>
              </CardContent>
            </Card>
          </motion.div>

          {/* 设置内容 */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: 0.2 }}
            className="lg:col-span-3"
          >
            <Card>
              <CardHeader>
                <CardTitle>
                  {settingSections.find((s) => s.id === activeSection)?.title}
                </CardTitle>
                <CardDescription>
                  {settingSections.find((s) => s.id === activeSection)?.description}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {activeSection === "profile" && (
                  <>
                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="space-y-2">
                        <label className="text-sm font-medium">姓名</label>
                        <InputClear
                          value={profileData.name}
                          onChange={(value) => setProfileData({ ...profileData, name: value })}
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium">用户名</label>
                        <InputClear
                          value={profileData.username}
                          onChange={(value) => setProfileData({ ...profileData, username: value })}
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">邮箱地址</label>
                      <InputClear
                        type="email"
                        value={profileData.email}
                        onChange={(value) => setProfileData({ ...profileData, email: value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">个人简介</label>
                      <InputClear
                        value={profileData.bio}
                        onChange={(value) => setProfileData({ ...profileData, bio: value })}
                      />
                    </div>
                    <Separator />
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="outline"
                        onClick={() => setProfileData(originalData.current)}
                      >
                        取消
                      </Button>
                      <Button onClick={handleSave}>保存更改</Button>
                    </div>
                  </>
                )}

                {activeSection === "notifications" && (
                  <div className="space-y-4">
                    {[
                      { title: "邮件通知", desc: "接收系统邮件通知" },
                      { title: "浏览器推送", desc: "接收浏览器推送通知" },
                      { title: "短信通知", desc: "接收短信提醒" },
                      { title: "应用内通知", desc: "在应用内显示通知" },
                    ].map((item, index) => (
                      <div key={index} className="flex items-center justify-between rounded-lg border p-4">
                        <div>
                          <p className="font-medium">{item.title}</p>
                          <p className="text-sm text-muted-foreground">{item.desc}</p>
                        </div>
                        <Badge variant={index % 2 === 0 ? "default" : "secondary"}>
                          {index % 2 === 0 ? "已开启" : "已关闭"}
                        </Badge>
                      </div>
                    ))}
                  </div>
                )}

                {activeSection === "security" && (
                  <div className="space-y-4">
                    <div className="rounded-lg border p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">修改密码</p>
                          <p className="text-sm text-muted-foreground">
                            上次修改于 30 天前
                          </p>
                        </div>
                        <Button variant="outline">修改</Button>
                      </div>
                    </div>
                    <div className="rounded-lg border p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">两步验证</p>
                          <p className="text-sm text-muted-foreground">
                            增强账户安全性
                          </p>
                        </div>
                        <Badge>已开启</Badge>
                      </div>
                    </div>
                    <div className="rounded-lg border p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">登录设备</p>
                          <p className="text-sm text-muted-foreground">
                            管理已登录的设备
                          </p>
                        </div>
                        <Button variant="outline">查看</Button>
                      </div>
                    </div>
                  </div>
                )}

                {activeSection !== "profile" && activeSection !== "notifications" && activeSection !== "security" && (
                  <div className="flex h-40 items-center justify-center text-muted-foreground">
                    此功能正在开发中...
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </div>
    </div>
  )
}
