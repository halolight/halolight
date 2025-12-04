"use client"

import { Check, Crown, Shield, UserRoundCheck } from "lucide-react"
import * as React from "react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { usePermission } from "@/providers/permission-provider"
import { useAuthStore } from "@/stores/auth-store"

export default function AccountsPage() {
  const { accounts, activeAccountId, switchAccount, user } = useAuthStore()
  const { permissions, role } = usePermission()
  const [switchingId, setSwitchingId] = React.useState<string | null>(null)

  const handleSwitch = async (accountId: string) => {
    if (accountId === activeAccountId) return
    setSwitchingId(accountId)
    try {
      await switchAccount(accountId)
    } finally {
      setSwitchingId(null)
    }
  }

  const activeAccount =
    accounts.find((acc) => acc.id === activeAccountId) || user || accounts[0] || null

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">账号与权限</h1>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>可用账号</CardTitle>
              <CardDescription>选择要使用的账号身份</CardDescription>
            </div>
            <Badge variant="secondary">
              共 {accounts.length || 1} 个
            </Badge>
          </CardHeader>
          <CardContent className="space-y-3">
            {(accounts.length ? accounts : activeAccount ? [activeAccount] : []).map((acc) => {
              const isActive = acc.id === activeAccountId
              return (
                <div
                  key={acc.id}
                  className="flex flex-col gap-2 rounded-xl border bg-card px-4 py-3 md:flex-row md:items-center"
                >
                  <div className="flex flex-1 items-start gap-3 md:items-center">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
                      {isActive ? <Crown className="h-5 w-5" /> : <UserRoundCheck className="h-5 w-5" />}
                    </div>
                    <div className="flex flex-col">
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{acc.name}</span>
                        <Badge variant={isActive ? "default" : "outline"}>
                          {acc.role?.label || acc.role?.name || "未分配角色"}
                        </Badge>
                        {isActive && (
                          <Badge className="bg-emerald-500 text-white hover:bg-emerald-500/90">
                            当前
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground">{acc.email}</p>
                      {acc.lastLoginAt && (
                        <p className="text-xs text-muted-foreground">
                          上次登录：{new Date(acc.lastLoginAt).toLocaleString()}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary">
                      {acc.role?.permissions?.length ?? 0} 项权限
                    </Badge>
                    <Button
                      variant={isActive ? "secondary" : "outline"}
                      size="sm"
                      disabled={isActive || switchingId === acc.id}
                      onClick={() => handleSwitch(acc.id)}
                    >
                      {isActive ? (
                        <>
                          <Check className="mr-2 h-4 w-4" />
                          使用中
                        </>
                      ) : (
                        <>
                          <UserRoundCheck className="mr-2 h-4 w-4" />
                          {switchingId === acc.id ? "切换中..." : "切换"}
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              )
            })}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>当前权限</CardTitle>
            <CardDescription>
              当前账号的角色与权限列表
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-2">
              <Shield className="h-4 w-4 text-primary" />
              <span className="font-medium">
                {role?.label || role?.name || "未分配角色"}
              </span>
              <Badge variant="secondary">
                {permissions.length} 权限
              </Badge>
            </div>
            <Separator />
            <div className="flex flex-wrap gap-2">
              {permissions.length === 0 && (
                <p className="text-sm text-muted-foreground">暂无权限</p>
              )}
              {permissions.map((perm) => (
                <Badge key={perm} variant="outline" className="font-mono text-xs">
                  {perm}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
