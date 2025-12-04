"use client"

import { motion } from "framer-motion"
import {
  Bell,
  Building,
  Camera,
  Key,
  Loader2,
  Mail,
  MapPin,
  Phone,
  Shield,
  User,
} from "lucide-react"
import * as React from "react"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { useAuthStore } from "@/stores/auth-store"

export default function ProfilePage() {
  const { user } = useAuthStore()
  const [isLoading, setIsLoading] = React.useState(false)
  const [profileData, setProfileData] = React.useState({
    name: user?.name || "管理员",
    email: user?.email || "admin@halolight.h7ml.cn",
    phone: "138-8888-8888",
    address: "北京市朝阳区",
    company: "科技有限公司",
    bio: "热爱技术，专注于后台管理系统开发",
  })

  const [securitySettings, setSecuritySettings] = React.useState({
    twoFactor: false,
    loginAlert: true,
    sessionTimeout: true,
  })

  const [notificationSettings, setNotificationSettings] = React.useState({
    email: true,
    push: true,
    sms: false,
    marketing: false,
  })

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    // 模拟保存
    await new Promise((resolve) => setTimeout(resolve, 1000))
    setIsLoading(false)
  }

  return (
    <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">个人资料</h1>
        </div>

        <Tabs defaultValue="profile" className="space-y-6">
          <TabsList>
            <TabsTrigger value="profile">
              <User className="mr-2 h-4 w-4" />
              基本信息
            </TabsTrigger>
            <TabsTrigger value="security">
              <Shield className="mr-2 h-4 w-4" />
              安全设置
            </TabsTrigger>
            <TabsTrigger value="notifications">
              <Bell className="mr-2 h-4 w-4" />
              通知偏好
            </TabsTrigger>
          </TabsList>

          <TabsContent value="profile">
            <div className="grid gap-6 md:grid-cols-3">
              {/* 头像卡片 */}
              <Card>
                <CardHeader>
                  <CardTitle>头像</CardTitle>
                  <CardDescription>点击上传新头像</CardDescription>
                </CardHeader>
                <CardContent className="flex flex-col items-center gap-4">
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    className="relative cursor-pointer group"
                  >
                    <Avatar className="h-32 w-32">
                      <AvatarImage src="/avatar.png" alt="头像" />
                      <AvatarFallback className="text-3xl">
                        {profileData.name.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                      <Camera className="h-8 w-8 text-white" />
                    </div>
                  </motion.div>
                  <div className="text-center">
                    <p className="font-medium">{profileData.name}</p>
                    <p className="text-sm text-muted-foreground">{profileData.email}</p>
                  </div>
                  <Button variant="outline" size="sm">
                    <Camera className="mr-2 h-4 w-4" />
                    更换头像
                  </Button>
                </CardContent>
              </Card>

              {/* 基本信息表单 */}
              <Card className="md:col-span-2">
                <CardHeader>
                  <CardTitle>基本信息</CardTitle>
                  <CardDescription>更新您的个人信息</CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleProfileSubmit} className="space-y-4">
                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="name">姓名</Label>
                        <div className="relative">
                          <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                          <Input
                            id="name"
                            className="pl-10"
                            value={profileData.name}
                            onChange={(e) =>
                              setProfileData({ ...profileData, name: e.target.value })
                            }
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email">邮箱</Label>
                        <div className="relative">
                          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                          <Input
                            id="email"
                            type="email"
                            className="pl-10"
                            value={profileData.email}
                            onChange={(e) =>
                              setProfileData({ ...profileData, email: e.target.value })
                            }
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="phone">电话</Label>
                        <div className="relative">
                          <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                          <Input
                            id="phone"
                            className="pl-10"
                            value={profileData.phone}
                            onChange={(e) =>
                              setProfileData({ ...profileData, phone: e.target.value })
                            }
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="company">公司</Label>
                        <div className="relative">
                          <Building className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                          <Input
                            id="company"
                            className="pl-10"
                            value={profileData.company}
                            onChange={(e) =>
                              setProfileData({ ...profileData, company: e.target.value })
                            }
                          />
                        </div>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="address">地址</Label>
                      <div className="relative">
                        <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="address"
                          className="pl-10"
                          value={profileData.address}
                          onChange={(e) =>
                            setProfileData({ ...profileData, address: e.target.value })
                          }
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="bio">个人简介</Label>
                      <Textarea
                        id="bio"
                        rows={3}
                        value={profileData.bio}
                        onChange={(e) =>
                          setProfileData({ ...profileData, bio: e.target.value })
                        }
                      />
                    </div>
                    <div className="flex justify-end">
                      <Button type="submit" disabled={isLoading}>
                        {isLoading ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            保存中...
                          </>
                        ) : (
                          "保存更改"
                        )}
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="security">
            <div className="grid gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>密码</CardTitle>
                  <CardDescription>更改您的账户密码</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid gap-4 md:grid-cols-3">
                    <div className="space-y-2">
                      <Label htmlFor="current-password">当前密码</Label>
                      <Input id="current-password" type="password" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="new-password">新密码</Label>
                      <Input id="new-password" type="password" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="confirm-password">确认新密码</Label>
                      <Input id="confirm-password" type="password" />
                    </div>
                  </div>
                  <div className="flex justify-end">
                    <Button>
                      <Key className="mr-2 h-4 w-4" />
                      更新密码
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>安全选项</CardTitle>
                  <CardDescription>管理您的账户安全设置</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>双因素认证</Label>
                      <p className="text-sm text-muted-foreground">
                        启用后登录时需要额外验证
                      </p>
                    </div>
                    <Switch
                      checked={securitySettings.twoFactor}
                      onCheckedChange={(checked) =>
                        setSecuritySettings({ ...securitySettings, twoFactor: checked })
                      }
                    />
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>登录提醒</Label>
                      <p className="text-sm text-muted-foreground">
                        新设备登录时发送邮件通知
                      </p>
                    </div>
                    <Switch
                      checked={securitySettings.loginAlert}
                      onCheckedChange={(checked) =>
                        setSecuritySettings({ ...securitySettings, loginAlert: checked })
                      }
                    />
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>会话超时</Label>
                      <p className="text-sm text-muted-foreground">
                        30分钟无操作自动退出登录
                      </p>
                    </div>
                    <Switch
                      checked={securitySettings.sessionTimeout}
                      onCheckedChange={(checked) =>
                        setSecuritySettings({ ...securitySettings, sessionTimeout: checked })
                      }
                    />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>登录历史</CardTitle>
                  <CardDescription>最近的登录活动</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[
                      { device: "Chrome - macOS", location: "北京, 中国", time: "当前会话", current: true },
                      { device: "Safari - iOS", location: "北京, 中国", time: "2 小时前", current: false },
                      { device: "Firefox - Windows", location: "上海, 中国", time: "昨天", current: false },
                    ].map((session, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <div className="space-y-1">
                          <p className="font-medium">{session.device}</p>
                          <p className="text-sm text-muted-foreground">
                            {session.location} · {session.time}
                          </p>
                        </div>
                        {session.current ? (
                          <Badge variant="secondary">当前</Badge>
                        ) : (
                          <Button variant="ghost" size="sm">
                            撤销
                          </Button>
                        )}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="notifications">
            <Card>
              <CardHeader>
                <CardTitle>通知偏好</CardTitle>
                <CardDescription>选择您希望接收通知的方式</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>邮件通知</Label>
                    <p className="text-sm text-muted-foreground">
                      通过邮件接收重要通知
                    </p>
                  </div>
                  <Switch
                    checked={notificationSettings.email}
                    onCheckedChange={(checked) =>
                      setNotificationSettings({ ...notificationSettings, email: checked })
                    }
                  />
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>推送通知</Label>
                    <p className="text-sm text-muted-foreground">
                      在浏览器中接收推送通知
                    </p>
                  </div>
                  <Switch
                    checked={notificationSettings.push}
                    onCheckedChange={(checked) =>
                      setNotificationSettings({ ...notificationSettings, push: checked })
                    }
                  />
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>短信通知</Label>
                    <p className="text-sm text-muted-foreground">
                      通过短信接收紧急通知
                    </p>
                  </div>
                  <Switch
                    checked={notificationSettings.sms}
                    onCheckedChange={(checked) =>
                      setNotificationSettings({ ...notificationSettings, sms: checked })
                    }
                  />
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>营销邮件</Label>
                    <p className="text-sm text-muted-foreground">
                      接收产品更新和促销信息
                    </p>
                  </div>
                  <Switch
                    checked={notificationSettings.marketing}
                    onCheckedChange={(checked) =>
                      setNotificationSettings({ ...notificationSettings, marketing: checked })
                    }
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
    </div>
  )
}
