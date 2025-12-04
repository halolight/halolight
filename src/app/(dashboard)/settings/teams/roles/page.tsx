"use client"

import { motion } from "framer-motion"
import {
  AlertCircle,
  Check,
  ChevronLeft,
  Loader2,
  MoreHorizontal,
  Pencil,
  Plus,
  Shield,
  Trash2,
  Users,
} from "lucide-react"
import Link from "next/link"
import * as React from "react"

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Textarea } from "@/components/ui/textarea"
import { getRouteTdk } from "@/config/tdk"
import { useTdk } from "@/hooks/use-tdk"
import {
  useCreateRole,
  useDeleteRole,
  usePermissions,
  useRolesDetail,
  useUpdateRole,
} from "@/hooks/use-teams"
import type { Permission, RoleDetail } from "@/lib/api/types"

const roleColors: Record<string, string> = {
  admin: "bg-red-500/10 text-red-500 border-red-500/20",
  manager: "bg-blue-500/10 text-blue-500 border-blue-500/20",
  editor: "bg-green-500/10 text-green-500 border-green-500/20",
  viewer: "bg-yellow-500/10 text-yellow-500 border-yellow-500/20",
}

interface FormData {
  name: string
  label: string
  description: string
  permissions: string[]
}

const defaultFormData: FormData = {
  name: "",
  label: "",
  description: "",
  permissions: [],
}

export default function RolesPage() {
  useTdk(getRouteTdk("/settings/teams/roles"))

  const { data: roles = [], isLoading, error } = useRolesDetail()
  const { data: permissionList = [] } = usePermissions()
  const createMutation = useCreateRole()
  const updateMutation = useUpdateRole()
  const deleteMutation = useDeleteRole()

  const [isAddDialogOpen, setIsAddDialogOpen] = React.useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = React.useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = React.useState(false)
  const [selectedRole, setSelectedRole] = React.useState<RoleDetail | null>(null)
  const [formData, setFormData] = React.useState<FormData>(defaultFormData)

  // 按分组整理权限
  const permissionsByGroup = React.useMemo(() => {
    const groups: Record<string, Array<{ key: string; label: string }>> = {}
    permissionList.forEach((p) => {
      if (!groups[p.group]) {
        groups[p.group] = []
      }
      groups[p.group].push({ key: p.key, label: p.label })
    })
    return groups
  }, [permissionList])

  const handleCreate = async () => {
    if (!formData.name.trim() || !formData.label.trim()) return
    await createMutation.mutateAsync({
      name: formData.name,
      label: formData.label,
      description: formData.description,
      permissions: formData.permissions as Permission[],
    })
    setIsAddDialogOpen(false)
    setFormData(defaultFormData)
  }

  const handleEdit = (role: RoleDetail) => {
    setSelectedRole(role)
    setFormData({
      name: role.name,
      label: role.label,
      description: role.description || "",
      permissions: role.permissions.includes("*" as Permission)
        ? permissionList.map((p) => p.key)
        : [...role.permissions],
    })
    setIsEditDialogOpen(true)
  }

  const handleUpdate = async () => {
    if (!selectedRole || !formData.name.trim() || !formData.label.trim()) return
    await updateMutation.mutateAsync({
      id: selectedRole.id,
      data: {
        name: formData.name,
        label: formData.label,
        description: formData.description,
        permissions: formData.permissions as Permission[],
      },
    })
    setIsEditDialogOpen(false)
    setSelectedRole(null)
    setFormData(defaultFormData)
  }

  const handleDeleteClick = (role: RoleDetail) => {
    setSelectedRole(role)
    setIsDeleteDialogOpen(true)
  }

  const handleDelete = async () => {
    if (!selectedRole) return
    await deleteMutation.mutateAsync(selectedRole.id)
    setIsDeleteDialogOpen(false)
    setSelectedRole(null)
  }

  const togglePermission = (key: string) => {
    setFormData((prev) => ({
      ...prev,
      permissions: prev.permissions.includes(key)
        ? prev.permissions.filter((p) => p !== key)
        : [...prev.permissions, key],
    }))
  }

  const toggleGroupPermissions = (groupKeys: string[]) => {
    const allSelected = groupKeys.every((k) => formData.permissions.includes(k))
    setFormData((prev) => ({
      ...prev,
      permissions: allSelected
        ? prev.permissions.filter((p) => !groupKeys.includes(p))
        : [...new Set([...prev.permissions, ...groupKeys])],
    }))
  }

  const renderPermissionForm = () => (
    <ScrollArea className="h-[300px] pr-4">
      <div className="space-y-4">
        {Object.entries(permissionsByGroup).map(([group, perms]) => {
          const groupKeys = perms.map((p) => p.key)
          const allSelected = groupKeys.every((k) =>
            formData.permissions.includes(k)
          )
          const someSelected =
            groupKeys.some((k) => formData.permissions.includes(k)) &&
            !allSelected

          return (
            <div key={group} className="space-y-2">
              <div className="flex items-center gap-2">
                <Checkbox
                  id={`group-${group}`}
                  checked={allSelected}
                  data-indeterminate={someSelected}
                  onCheckedChange={() => toggleGroupPermissions(groupKeys)}
                />
                <Label
                  htmlFor={`group-${group}`}
                  className="font-medium cursor-pointer"
                >
                  {group}
                </Label>
              </div>
              <div className="ml-6 grid grid-cols-2 gap-2">
                {perms.map((perm) => (
                  <div key={perm.key} className="flex items-center gap-2">
                    <Checkbox
                      id={perm.key}
                      checked={formData.permissions.includes(perm.key)}
                      onCheckedChange={() => togglePermission(perm.key)}
                    />
                    <Label
                      htmlFor={perm.key}
                      className="text-sm font-normal cursor-pointer"
                    >
                      {perm.label}
                    </Label>
                  </div>
                ))}
              </div>
            </div>
          )
        })}
      </div>
    </ScrollArea>
  )

  return (
    <div className="space-y-6">
      {/* 页面标题 */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="flex items-center justify-between"
      >
        <div className="flex items-center gap-4">
          <Link href="/settings/teams">
            <Button variant="ghost" size="icon">
              <ChevronLeft className="h-5 w-5" />
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">角色管理</h1>
            <p className="text-muted-foreground mt-1">
              创建和管理系统角色，配置角色权限
            </p>
          </div>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => setFormData(defaultFormData)}>
              <Plus className="mr-2 h-4 w-4" />
              创建角色
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>创建新角色</DialogTitle>
              <DialogDescription>定义角色信息和权限</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="name">角色标识</Label>
                  <Input
                    id="name"
                    placeholder="如: editor"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="label">角色名称</Label>
                  <Input
                    id="label"
                    placeholder="如: 编辑员"
                    value={formData.label}
                    onChange={(e) =>
                      setFormData({ ...formData, label: e.target.value })
                    }
                  />
                </div>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="description">角色描述（可选）</Label>
                <Textarea
                  id="description"
                  placeholder="输入角色描述"
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                />
              </div>
              <div className="grid gap-2">
                <Label>权限配置</Label>
                {renderPermissionForm()}
              </div>
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setIsAddDialogOpen(false)}
              >
                取消
              </Button>
              <Button
                onClick={handleCreate}
                disabled={
                  createMutation.isPending ||
                  !formData.name.trim() ||
                  !formData.label.trim()
                }
              >
                {createMutation.isPending && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                创建
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </motion.div>

      {/* 统计卡片 */}
      <div className="grid gap-4 md:grid-cols-3">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>角色总数</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-blue-500">{roles.length}</p>
            </CardContent>
          </Card>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
        >
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>权限项总数</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-green-500">
                {permissionList.length}
              </p>
            </CardContent>
          </Card>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.3 }}
        >
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>已分配用户</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-purple-500">
                {roles.reduce((acc, r) => acc + r.userCount, 0)}
              </p>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* 角色列表 */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.4 }}
      >
        <Card>
          <CardHeader>
            <CardTitle>角色列表</CardTitle>
            <CardDescription>查看和管理所有角色及其权限</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
              </div>
            ) : error ? (
              <div className="flex items-center justify-center py-8 text-destructive">
                <AlertCircle className="mr-2 h-5 w-5" />
                加载失败，请重试
              </div>
            ) : roles.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
                <Shield className="h-12 w-12 mb-4" />
                <p>暂无角色</p>
                <p className="text-sm">点击上方按钮创建第一个角色</p>
              </div>
            ) : (
              <div className="space-y-4">
                {roles.map((role, index) => (
                  <motion.div
                    key={role.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.2, delay: index * 0.05 }}
                  >
                    <Card className="hover:shadow-md transition-shadow">
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            <div
                              className={`flex h-10 w-10 items-center justify-center rounded-lg ${
                                roleColors[role.id] || "bg-gray-500/10"
                              }`}
                            >
                              <Shield className="h-5 w-5" />
                            </div>
                            <div>
                              <div className="flex items-center gap-2">
                                <h3 className="font-semibold">{role.label}</h3>
                                <Badge variant="outline" className="text-xs">
                                  {role.name}
                                </Badge>
                              </div>
                              <p className="text-sm text-muted-foreground">
                                {role.description || "暂无描述"}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-4">
                            <div className="text-right text-sm">
                              <div className="flex items-center gap-1 text-muted-foreground">
                                <Users className="h-4 w-4" />
                                <span>{role.userCount} 用户</span>
                              </div>
                              <div className="flex items-center gap-1 text-muted-foreground">
                                <Check className="h-4 w-4" />
                                <span>
                                  {role.permissions.includes("*" as Permission)
                                    ? "全部权限"
                                    : `${role.permissions.length} 权限`}
                                </span>
                              </div>
                            </div>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon">
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuLabel>操作</DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem
                                  onClick={() => handleEdit(role)}
                                >
                                  <Pencil className="mr-2 h-4 w-4" />
                                  编辑
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem
                                  className="text-destructive"
                                  onClick={() => handleDeleteClick(role)}
                                  disabled={role.id === "admin"}
                                >
                                  <Trash2 className="mr-2 h-4 w-4" />
                                  删除
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>

      {/* 编辑对话框 */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>编辑角色</DialogTitle>
            <DialogDescription>修改角色信息和权限</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="edit-name">角色标识</Label>
                <Input
                  id="edit-name"
                  placeholder="如: editor"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-label">角色名称</Label>
                <Input
                  id="edit-label"
                  placeholder="如: 编辑员"
                  value={formData.label}
                  onChange={(e) =>
                    setFormData({ ...formData, label: e.target.value })
                  }
                />
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-description">角色描述（可选）</Label>
              <Textarea
                id="edit-description"
                placeholder="输入角色描述"
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
              />
            </div>
            <div className="grid gap-2">
              <Label>权限配置</Label>
              {renderPermissionForm()}
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsEditDialogOpen(false)}
            >
              取消
            </Button>
            <Button
              onClick={handleUpdate}
              disabled={
                updateMutation.isPending ||
                !formData.name.trim() ||
                !formData.label.trim()
              }
            >
              {updateMutation.isPending && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              保存
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 删除确认对话框 */}
      <AlertDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>确认删除</AlertDialogTitle>
            <AlertDialogDescription>
              确定要删除角色 &quot;{selectedRole?.label}&quot; 吗？此操作无法撤销。
              {selectedRole?.userCount && selectedRole.userCount > 0 && (
                <span className="block mt-2 text-destructive">
                  警告：该角色下有 {selectedRole.userCount} 个用户，删除后这些用户将失去该角色。
                </span>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>取消</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {deleteMutation.isPending && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              删除
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
