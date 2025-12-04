"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { motion } from "framer-motion"
import {
  AlertCircle,
  Loader2,
  Mail,
  MoreHorizontal,
  Pencil,
  Plus,
  Shield,
  Trash2,
} from "lucide-react"
import * as React from "react"
import { FormProvider, useForm, type UseFormReturn, useWatch } from "react-hook-form"

import { Column, DataTable } from "@/components/data-table"
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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
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
import { InputClear, InputClearForm } from "@/components/ui/input-clear"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useCreateUser, useDeleteUser, useRoles, useUpdateUser, useUsers } from "@/hooks/use-users"
import type { Role, User } from "@/lib/api/services"
import { type UserFormData, userSchema } from "@/lib/validations/schemas"
import { PermissionGuard, usePermission } from "@/providers/permission-provider"

const statusMap = {
  active: { label: "活跃", variant: "default" as const },
  inactive: { label: "禁用", variant: "secondary" as const },
  suspended: { label: "暂停", variant: "outline" as const },
}

const roleColors: Record<string, string> = {
  admin: "bg-red-500/10 text-red-500 border-red-500/20",
  manager: "bg-blue-500/10 text-blue-500 border-blue-500/20",
  editor: "bg-green-500/10 text-green-500 border-green-500/20",
  viewer: "bg-yellow-500/10 text-yellow-500 border-yellow-500/20",
}

interface FormDialogContentProps {
  form: UseFormReturn<UserFormData>
  roles: Role[]
  onSubmit: (data: UserFormData) => void
  onCancel: () => void
  isEdit?: boolean
  isSubmitting: boolean
}

function FormDialogContent({
  form,
  roles,
  onSubmit,
  onCancel,
  isEdit = false,
  isSubmitting,
}: FormDialogContentProps) {
  const watchedRole = useWatch({
    control: form.control,
    name: "role",
  })
  const watchedStatus = useWatch({
    control: form.control,
    name: "status",
  })

  return (
    <FormProvider {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="name">姓名</Label>
            <InputClearForm id="name" name="name" placeholder="输入用户姓名" />
            {form.formState.errors.name && (
              <p className="text-sm text-destructive flex items-center gap-1">
                <AlertCircle className="h-3 w-3" />
                {form.formState.errors.name.message}
              </p>
            )}
          </div>
          <div className="grid gap-2">
            <Label htmlFor="email">邮箱</Label>
            <InputClearForm id="email" name="email" type="email" placeholder="输入邮箱地址" />
            {form.formState.errors.email && (
              <p className="text-sm text-destructive flex items-center gap-1">
                <AlertCircle className="h-3 w-3" />
                {form.formState.errors.email.message}
              </p>
            )}
          </div>
          <div className="grid gap-2">
            <Label htmlFor="phone">电话（可选）</Label>
            <InputClearForm id="phone" name="phone" placeholder="输入手机号" />
            {form.formState.errors.phone && (
              <p className="text-sm text-destructive flex items-center gap-1">
                <AlertCircle className="h-3 w-3" />
                {form.formState.errors.phone.message}
              </p>
            )}
          </div>
          <div className="grid gap-2">
            <Label>角色</Label>
            <Select
              value={watchedRole ?? ""}
              onValueChange={(value) => form.setValue("role", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="选择角色" />
              </SelectTrigger>
              <SelectContent>
                {roles.map((role) => (
                  <SelectItem key={role.id} value={role.id}>
                    {role.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {form.formState.errors.role && (
              <p className="text-sm text-destructive flex items-center gap-1">
                <AlertCircle className="h-3 w-3" />
                {form.formState.errors.role.message}
              </p>
            )}
          </div>
          <div className="grid gap-2">
            <Label>状态</Label>
            <Select
              value={watchedStatus ?? ""}
              onValueChange={(value: "active" | "inactive" | "suspended") =>
                form.setValue("status", value)
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="选择状态" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="active">活跃</SelectItem>
                <SelectItem value="inactive">禁用</SelectItem>
                <SelectItem value="suspended">暂停</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={() => {
              onCancel()
              form.reset()
            }}
          >
            取消
          </Button>
          <Button
            type="submit"
            disabled={isSubmitting}
          >
            {isSubmitting && (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            )}
            {isEdit ? "保存" : "创建"}
          </Button>
        </DialogFooter>
      </form>
    </FormProvider>
  )
}

export default function UsersPage() {
  const [page] = React.useState(1)
  const [search, setSearch] = React.useState("")
  const [statusFilter, setStatusFilter] = React.useState("all")
  const [roleFilter, setRoleFilter] = React.useState("all")
  const [isAddDialogOpen, setIsAddDialogOpen] = React.useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = React.useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = React.useState(false)
  const [selectedUser, setSelectedUser] = React.useState<User | null>(null)

  usePermission()

  // React Query hooks
  const { data, isLoading, error } = useUsers({
    page,
    pageSize: 10,
    search,
    status: statusFilter,
    role: roleFilter,
  })

  const { data: roles = [] } = useRoles()

  const createMutation = useCreateUser()
  const updateMutation = useUpdateUser()
  const deleteMutation = useDeleteUser()
  const handleCloseAddDialog = React.useCallback(() => setIsAddDialogOpen(false), [])
  const handleCloseEditDialog = React.useCallback(() => setIsEditDialogOpen(false), [])

  // Form for create/edit
  const form = useForm<UserFormData>({
    resolver: zodResolver(userSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      role: "",
      status: "active",
    },
  })

  const users = React.useMemo(() => data?.list ?? [], [data?.list])
  const total = data?.total || 0

  // 统计数据
  const stats = React.useMemo(() => ({
    total,
    active: users.filter((u) => u.status === "active").length,
    inactive: users.filter((u) => u.status === "inactive").length,
    suspended: users.filter((u) => u.status === "suspended").length,
  }), [users, total])

  // 打开编辑对话框
  const handleEdit = (user: User) => {
    setSelectedUser(user)
    form.reset({
      name: user.name,
      email: user.email,
      phone: user.phone || "",
      role: user.role.id,
      status: user.status,
    })
    setIsEditDialogOpen(true)
  }

  // 打开删除确认
  const handleDeleteClick = (user: User) => {
    setSelectedUser(user)
    setIsDeleteDialogOpen(true)
  }

  // 创建用户
  const handleCreate = async (formData: UserFormData) => {
    await createMutation.mutateAsync({
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      roleId: formData.role,
      status: formData.status,
    })
    setIsAddDialogOpen(false)
    form.reset()
  }

  // 更新用户
  const handleUpdate = async (formData: UserFormData) => {
    if (!selectedUser) return
    await updateMutation.mutateAsync({
      id: selectedUser.id,
      data: {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        roleId: formData.role,
        status: formData.status,
      },
    })
    setIsEditDialogOpen(false)
    setSelectedUser(null)
    form.reset()
  }

  // 删除用户
  const handleDelete = async () => {
    if (!selectedUser) return
    await deleteMutation.mutateAsync(selectedUser.id)
    setIsDeleteDialogOpen(false)
    setSelectedUser(null)
  }

  const columns: Column<User>[] = [
    {
      key: "name",
      title: "用户",
      render: (_, user) => (
        <div className="flex items-center gap-3">
          <Avatar className="h-8 w-8">
            <AvatarImage src={user.avatar} />
            <AvatarFallback>{user.name.slice(0, 1)}</AvatarFallback>
          </Avatar>
          <div>
            <p className="font-medium">{user.name}</p>
            <p className="text-xs text-muted-foreground">{user.email}</p>
          </div>
        </div>
      ),
    },
    {
      key: "role",
      title: "角色",
      sortable: true,
      render: (_, user) => (
        <Badge variant="outline" className={roleColors[user.role.id] || ""}>
          <Shield className="mr-1 h-3 w-3" />
          {user.role.label}
        </Badge>
      ),
    },
    {
      key: "status",
      title: "状态",
      sortable: true,
      render: (_, user) => {
        const status = statusMap[user.status]
        return <Badge variant={status.variant}>{status.label}</Badge>
      },
    },
    {
      key: "createdAt",
      title: "注册时间",
      sortable: true,
      render: (_, user) => new Date(user.createdAt).toLocaleDateString("zh-CN"),
    },
    {
      key: "lastLoginAt",
      title: "最后登录",
      sortable: true,
      render: (_, user) =>
        user.lastLoginAt
          ? new Date(user.lastLoginAt).toLocaleDateString("zh-CN")
          : "-",
    },
    {
      key: "actions",
      title: "操作",
      width: 80,
      render: (_, user) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>操作</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <PermissionGuard permission="users:edit">
              <DropdownMenuItem onClick={() => handleEdit(user)}>
                <Pencil className="mr-2 h-4 w-4" />
                编辑
              </DropdownMenuItem>
            </PermissionGuard>
            <DropdownMenuItem>
              <Mail className="mr-2 h-4 w-4" />
              发送邮件
            </DropdownMenuItem>
            <PermissionGuard permission="users:delete">
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="text-destructive"
                onClick={() => handleDeleteClick(user)}
              >
                <Trash2 className="mr-2 h-4 w-4" />
                删除
              </DropdownMenuItem>
            </PermissionGuard>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ]

  return (
    <div className="space-y-6">
        {/* 页面标题 */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="flex items-center justify-between"
        >
          <div>
            <h1 className="text-3xl font-bold tracking-tight">用户管理</h1>
          </div>
          <PermissionGuard permission="users:create">
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <DialogTrigger asChild>
                <Button onClick={() => form.reset()}>
                  <Plus className="mr-2 h-4 w-4" />
                  添加用户
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>添加新用户</DialogTitle>
                  <DialogDescription>填写以下信息创建新用户账号</DialogDescription>
                </DialogHeader>
                <FormDialogContent
                  form={form}
                  roles={roles}
                  onSubmit={handleCreate}
                  onCancel={handleCloseAddDialog}
                  isSubmitting={createMutation.isPending}
                />
              </DialogContent>
            </Dialog>
          </PermissionGuard>
        </motion.div>

        {/* 统计卡片 */}
        <div className="grid gap-4 md:grid-cols-4">
          {[
            { label: "总用户数", value: stats.total, color: "text-blue-500" },
            { label: "活跃用户", value: stats.active, color: "text-green-500" },
            { label: "已禁用", value: stats.inactive, color: "text-yellow-500" },
            { label: "暂停中", value: stats.suspended, color: "text-red-500" },
          ].map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
            >
              <Card>
                <CardHeader className="pb-2">
                  <CardDescription>{stat.label}</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* 筛选区域 */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-wrap gap-4">
              <div className="flex-1 min-w-[200px]">
                <InputClear
                  placeholder="搜索用户..."
                  value={search}
                  onChange={setSearch}
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="状态筛选" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">全部状态</SelectItem>
                  <SelectItem value="active">活跃</SelectItem>
                  <SelectItem value="inactive">禁用</SelectItem>
                  <SelectItem value="suspended">暂停</SelectItem>
                </SelectContent>
              </Select>
              <Select value={roleFilter} onValueChange={setRoleFilter}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="角色筛选" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">全部角色</SelectItem>
                  {roles.map((role) => (
                    <SelectItem key={role.id} value={role.id}>
                      {role.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* 用户表格 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.4 }}
        >
          <Card>
            <CardHeader>
              <CardTitle>用户列表</CardTitle>
              <CardDescription>查看和管理所有系统用户</CardDescription>
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
              ) : (
                <DataTable
                  columns={columns}
                  data={users}
                  searchPlaceholder="搜索用户..."
                  pageSize={10}
                />
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* 编辑对话框 */}
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>编辑用户</DialogTitle>
                  <DialogDescription>修改用户信息</DialogDescription>
                </DialogHeader>
                <FormDialogContent
                  form={form}
                  roles={roles}
                  onSubmit={handleUpdate}
                  onCancel={handleCloseEditDialog}
                  isEdit
                  isSubmitting={updateMutation.isPending}
                />
              </DialogContent>
            </Dialog>

        {/* 删除确认对话框 */}
        <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>确认删除</AlertDialogTitle>
              <AlertDialogDescription>
                确定要删除用户 &quot;{selectedUser?.name}&quot; 吗？此操作无法撤销。
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
