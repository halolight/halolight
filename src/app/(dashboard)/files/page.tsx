"use client"

import { AnimatePresence, motion } from "framer-motion"
import {
  ChevronRight,
  Clock,
  Download,
  Edit,
  File,
  FileArchive,
  FileAudio,
  FileImage,
  FileVideo,
  FolderOpen,
  FolderPlus,
  Grid,
  HardDrive,
  Home,
  Info,
  List,
  Loader2,
  MoreHorizontal,
  Search,
  Share2,
  Trash2,
  Upload,
  X,
} from "lucide-react"
import Image from "next/image"
import * as React from "react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
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
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { InputClear } from "@/components/ui/input-clear"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { useCreateFolder, useDeleteFile, useFiles, useStorage } from "@/hooks"
import { FileItem } from "@/lib/api/services"
import { cn } from "@/lib/utils"

const typeIcons: Record<string, React.ElementType> = {
  folder: FolderOpen,
  image: FileImage,
  video: FileVideo,
  audio: FileAudio,
  archive: FileArchive,
  document: File,
}

const typeColors: Record<string, string> = {
  folder: "bg-yellow-500/10 text-yellow-600",
  image: "bg-green-500/10 text-green-600",
  video: "bg-purple-500/10 text-purple-600",
  audio: "bg-pink-500/10 text-pink-600",
  archive: "bg-orange-500/10 text-orange-600",
  document: "bg-gray-500/10 text-gray-600",
}

const typeLabels: Record<string, string> = {
  folder: "文件夹",
  image: "图片",
  video: "视频",
  audio: "音频",
  archive: "压缩包",
  document: "文档",
}

function formatFileSize(bytes: number | null): string {
  if (bytes === null) return "-"
  if (bytes === 0) return "0 B"
  const k = 1024
  const sizes = ["B", "KB", "MB", "GB", "TB"]
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + " " + sizes[i]
}

function formatStorageSize(bytes: number): string {
  const gb = bytes / (1024 * 1024 * 1024)
  return gb.toFixed(1) + " GB"
}

function formatDateTime(dateStr: string): string {
  const date = new Date(dateStr)
  return date.toLocaleString("zh-CN")
}

export default function FilesPage() {
  const { data: files = [], isLoading } = useFiles()
  const { data: storage } = useStorage()
  const createFolder = useCreateFolder()
  const deleteFile = useDeleteFile()

  const [searchQuery, setSearchQuery] = React.useState("")
  const [viewMode, setViewMode] = React.useState<"grid" | "list">("list")
  const [currentPath] = React.useState<string[]>(["我的文件"])
  const [isNewFolderOpen, setIsNewFolderOpen] = React.useState(false)
  const [newFolderName, setNewFolderName] = React.useState("")
  const [selectedFile, setSelectedFile] = React.useState<FileItem | null>(null)

  const filteredFiles = React.useMemo(() => {
    return files.filter((file: FileItem) =>
      file.name.toLowerCase().includes(searchQuery.toLowerCase())
    )
  }, [files, searchQuery])

  const storageUsed = storage ? storage.used / (1024 * 1024 * 1024) : 0
  const storageTotal = storage ? storage.total / (1024 * 1024 * 1024) : 100

  const handleCreateFolder = () => {
    if (newFolderName.trim()) {
      createFolder.mutate({ name: newFolderName })
      setNewFolderName("")
      setIsNewFolderOpen(false)
    }
  }

  const handleDeleteFile = (id: string, e?: React.MouseEvent) => {
    e?.stopPropagation()
    deleteFile.mutate(id)
    if (selectedFile?.id === id) {
      setSelectedFile(null)
    }
  }

  const handleSelectFile = (file: FileItem) => {
    setSelectedFile(file)
  }

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
            <h1 className="text-3xl font-bold tracking-tight">文件存储</h1>
          </div>
          <div className="flex items-center gap-2">
            <Dialog open={isNewFolderOpen} onOpenChange={setIsNewFolderOpen}>
              <DialogTrigger asChild>
                <Button variant="outline">
                  <FolderPlus className="mr-2 h-4 w-4" />
                  新建文件夹
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>新建文件夹</DialogTitle>
                  <DialogDescription>输入文件夹名称</DialogDescription>
                </DialogHeader>
                <div className="py-4">
                  <InputClear
                    placeholder="文件夹名称"
                    value={newFolderName}
                    onChange={setNewFolderName}
                  />
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsNewFolderOpen(false)}>
                    取消
                  </Button>
                  <Button onClick={handleCreateFolder} disabled={createFolder.isPending}>
                    {createFolder.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    创建
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
            <Button>
              <Upload className="mr-2 h-4 w-4" />
              上传文件
            </Button>
          </div>
        </motion.div>

        {/* 移动端存储信息卡片 */}
        <div className="lg:hidden">
          <Card className="mb-4">
            <CardContent className="p-4">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 rounded-lg bg-primary/10">
                  <HardDrive className="h-5 w-5 text-primary" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium">{storageUsed.toFixed(1)} GB / {storageTotal.toFixed(0)} GB</p>
                  <div className="h-2 rounded-full bg-muted overflow-hidden mt-1">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${(storageUsed / storageTotal) * 100}%` }}
                      transition={{ duration: 1, ease: "easeOut" }}
                      className="h-full bg-primary rounded-full"
                    />
                  </div>
                </div>
              </div>
              {storage && (
                <div className="flex gap-2 flex-wrap">
                  {[
                    { type: "image", label: "图片", size: formatStorageSize(storage.breakdown.images), color: "bg-green-500" },
                    { type: "video", label: "视频", size: formatStorageSize(storage.breakdown.videos), color: "bg-purple-500" },
                    { type: "audio", label: "音频", size: formatStorageSize(storage.breakdown.audio), color: "bg-pink-500" },
                  ].map((item) => (
                    <div key={item.type} className="flex items-center gap-1 px-2 py-1 bg-muted rounded-full">
                      <div className={cn("h-1.5 w-1.5 rounded-full", item.color)} />
                      <span className="text-xs">{item.label}</span>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-6 lg:grid-cols-12">
          {/* 桌面端存储信息 */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
            className="hidden lg:block lg:col-span-2 space-y-4"
          >
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base">存储空间</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-primary/10">
                    <HardDrive className="h-5 w-5 text-primary" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">{storageUsed.toFixed(1)} GB</p>
                    <p className="text-xs text-muted-foreground">共 {storageTotal.toFixed(0)} GB</p>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="h-2 rounded-full bg-muted overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${(storageUsed / storageTotal) * 100}%` }}
                      transition={{ duration: 1, ease: "easeOut" }}
                      className="h-full bg-primary rounded-full"
                    />
                  </div>
                  <p className="text-xs text-muted-foreground text-right">
                    {((storageUsed / storageTotal) * 100).toFixed(1)}%
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base">文件类型</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {storage && [
                  { type: "image", label: "图片", size: formatStorageSize(storage.breakdown.images), color: "bg-green-500" },
                  { type: "video", label: "视频", size: formatStorageSize(storage.breakdown.videos), color: "bg-purple-500" },
                  { type: "audio", label: "音频", size: formatStorageSize(storage.breakdown.audio), color: "bg-pink-500" },
                  { type: "archive", label: "压缩包", size: formatStorageSize(storage.breakdown.archives), color: "bg-orange-500" },
                  { type: "other", label: "其他", size: formatStorageSize(storage.breakdown.others), color: "bg-gray-500" },
                ].map((item) => (
                  <div key={item.type} className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <div className={cn("h-2 w-2 rounded-full", item.color)} />
                      <span className="text-xs">{item.label}</span>
                    </div>
                    <span className="text-xs text-muted-foreground">{item.size}</span>
                  </div>
                ))}
              </CardContent>
            </Card>
          </motion.div>

          {/* 文件列表 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.2 }}
            className={cn(
              "transition-all duration-300",
              selectedFile ? "lg:col-span-6" : "lg:col-span-10",
              "col-span-12"
            )}
          >
            <Card className="h-[calc(100vh-220px)] lg:h-[calc(100vh-220px)]">
              <CardHeader className="pb-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  {/* 面包屑导航 */}
                  <div className="flex items-center gap-1 text-sm min-w-0 flex-1">
                    <Button variant="ghost" size="sm" className="h-8 px-2 flex-shrink-0">
                      <Home className="h-4 w-4" />
                    </Button>
                    <div className="flex items-center gap-1 min-w-0 flex-1 overflow-x-auto">
                      {currentPath.map((path, index) => (
                        <React.Fragment key={index}>
                          <ChevronRight className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                          <Button variant="ghost" size="sm" className="h-8 px-2 whitespace-nowrap flex-shrink-0">
                            {path}
                          </Button>
                        </React.Fragment>
                      ))}
                    </div>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                      <InputClear
                        placeholder="搜索文件..."
                        value={searchQuery}
                        onChange={setSearchQuery}
                        className="pl-10 w-32 sm:w-48"
                      />
                    </div>
                    <Button
                      variant={viewMode === "grid" ? "secondary" : "ghost"}
                      size="icon"
                      onClick={() => setViewMode("grid")}
                      className="hidden sm:flex"
                    >
                      <Grid className="h-4 w-4" />
                    </Button>
                    <Button
                      variant={viewMode === "list" ? "secondary" : "ghost"}
                      size="icon"
                      onClick={() => setViewMode("list")}
                      className="hidden sm:flex"
                    >
                      <List className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <ScrollArea className="h-[calc(100vh-340px)]">
                  {isLoading ? (
                    <div className="flex items-center justify-center py-12">
                      <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                    </div>
                  ) : viewMode === "grid" ? (
                    <div className="grid gap-3 p-4 sm:grid-cols-2 lg:grid-cols-3">
                      {filteredFiles.map((file: FileItem, index: number) => {
                        const Icon = typeIcons[file.type] || File
                        return (
                          <motion.div
                            key={file.id}
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: index * 0.03 }}
                            onClick={() => handleSelectFile(file)}
                            className={cn(
                              "group relative rounded-lg border p-3 hover:shadow-md transition-all cursor-pointer",
                              selectedFile?.id === file.id && "ring-2 ring-primary"
                            )}
                          >
                            <div className="flex flex-col items-center text-center">
                              <div className={cn("p-3 rounded-xl mb-2", typeColors[file.type] || typeColors.document)}>
                                <Icon className="h-7 w-7" />
                              </div>
                              <p className="font-medium text-sm truncate w-full">{file.name}</p>
                              <p className="text-xs text-muted-foreground mt-1">
                                {file.type === "folder" ? `${file.items} 项` : formatFileSize(file.size)}
                              </p>
                            </div>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="absolute top-2 right-2 h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity"
                                  onClick={(e) => e.stopPropagation()}
                                >
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem>
                                  <Download className="mr-2 h-4 w-4" />
                                  下载
                                </DropdownMenuItem>
                                <DropdownMenuItem>重命名</DropdownMenuItem>
                                <DropdownMenuItem>移动</DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem
                                  className="text-destructive"
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    handleDeleteFile(file.id)
                                  }}
                                >
                                  <Trash2 className="mr-2 h-4 w-4" />
                                  删除
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </motion.div>
                        )
                      })}
                    </div>
                  ) : (
                    <div className="divide-y">
                      {filteredFiles.map((file: FileItem, index: number) => {
                        const Icon = typeIcons[file.type] || File
                        return (
                          <motion.div
                            key={file.id}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.03 }}
                            onClick={() => handleSelectFile(file)}
                            className={cn(
                              "flex items-center justify-between px-4 py-3 hover:bg-muted/50 transition-colors cursor-pointer",
                              selectedFile?.id === file.id && "bg-muted"
                            )}
                          >
                            <div className="flex items-center gap-3 min-w-0 flex-1">
                              <div className={cn("p-2 rounded-lg shrink-0", typeColors[file.type] || typeColors.document)}>
                                <Icon className="h-4 w-4" />
                              </div>
                              <div className="min-w-0 flex-1">
                                <p className="font-medium text-sm truncate">{file.name}</p>
                                <p className="text-xs text-muted-foreground truncate">
                                  {file.updatedAt}
                                </p>
                              </div>
                            </div>
                            <div className="flex items-center gap-4 shrink-0 ml-2">
                              <span className="text-sm text-muted-foreground">
                                {file.type === "folder" ? `${file.items} 项` : formatFileSize(file.size)}
                              </span>
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-7 w-7"
                                    onClick={(e) => e.stopPropagation()}
                                  >
                                    <MoreHorizontal className="h-4 w-4" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  <DropdownMenuItem>
                                    <Download className="mr-2 h-4 w-4" />
                                    下载
                                  </DropdownMenuItem>
                                  <DropdownMenuItem>重命名</DropdownMenuItem>
                                  <DropdownMenuItem>移动</DropdownMenuItem>
                                  <DropdownMenuSeparator />
                                  <DropdownMenuItem
                                    className="text-destructive"
                                    onClick={(e) => {
                                      e.stopPropagation()
                                      handleDeleteFile(file.id)
                                    }}
                                  >
                                    <Trash2 className="mr-2 h-4 w-4" />
                                    删除
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </div>
                          </motion.div>
                        )
                      })}
                    </div>
                  )}

                  {!isLoading && filteredFiles.length === 0 && (
                    <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
                      <FolderOpen className="h-12 w-12 mb-4" />
                      <p>此文件夹为空</p>
                    </div>
                  )}
                </ScrollArea>
              </CardContent>
            </Card>
          </motion.div>

          {/* 桌面端文件详情面板 */}
          <AnimatePresence>
            {selectedFile && (
              <motion.div
                initial={{ opacity: 0, x: 20, width: 0 }}
                animate={{ opacity: 1, x: 0, width: "auto" }}
                exit={{ opacity: 0, x: 20, width: 0 }}
                transition={{ duration: 0.3 }}
                className="hidden lg:block lg:col-span-4"
              >
                <Card className="h-[calc(100vh-220px)]">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-base flex items-center gap-2">
                        <Info className="h-4 w-4" />
                        文件详情
                      </CardTitle>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => setSelectedFile(null)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardHeader>
                  <Separator />
                  <ScrollArea className="h-[calc(100vh-320px)]">
                    <CardContent className="pt-4 space-y-6">
                      {/* 文件图标和名称 */}
                      <div className="flex flex-col items-center text-center">
                        {(() => {
                          const Icon = typeIcons[selectedFile.type] || File
                          return (
                            <div className={cn("p-4 rounded-xl mb-3", typeColors[selectedFile.type] || typeColors.document)}>
                              <Icon className="h-12 w-12" />
                            </div>
                          )
                        })()}
                        <h3 className="font-semibold text-lg break-all">{selectedFile.name}</h3>
                        <Badge variant="secondary" className="mt-2">
                          {typeLabels[selectedFile.type] || "文件"}
                        </Badge>
                      </div>

                      {/* 操作按钮 */}
                      <div className="flex justify-center gap-2">
                        {selectedFile.type !== "folder" && (
                          <Button variant="outline" size="sm">
                            <Download className="mr-2 h-4 w-4" />
                            下载
                          </Button>
                        )}
                        <Button variant="outline" size="sm">
                          <Share2 className="mr-2 h-4 w-4" />
                          分享
                        </Button>
                        {selectedFile.type === "folder" && (
                          <Button variant="outline" size="sm">
                            <FolderOpen className="mr-2 h-4 w-4" />
                            打开
                          </Button>
                        )}
                      </div>

                      <Separator />

                      {/* 文件信息 */}
                      <div className="space-y-4">
                        <h4 className="text-sm font-medium">文件信息</h4>
                        <div className="space-y-3 text-sm">
                          <div className="flex items-center justify-between">
                            <span className="text-muted-foreground">类型</span>
                            <span>{typeLabels[selectedFile.type] || "未知"}</span>
                          </div>
                          {selectedFile.type !== "folder" && (
                            <div className="flex items-center justify-between">
                              <span className="text-muted-foreground">大小</span>
                              <span>{formatFileSize(selectedFile.size)}</span>
                            </div>
                          )}
                          {selectedFile.type === "folder" && selectedFile.items !== null && (
                            <div className="flex items-center justify-between">
                              <span className="text-muted-foreground">包含</span>
                              <span>{selectedFile.items} 项</span>
                            </div>
                          )}
                          <div className="flex items-center justify-between">
                            <span className="text-muted-foreground">位置</span>
                            <span className="truncate max-w-[150px]">{selectedFile.path}</span>
                          </div>
                          {selectedFile.mimeType && selectedFile.mimeType !== "folder" && (
                            <div className="flex items-center justify-between">
                              <span className="text-muted-foreground">MIME类型</span>
                              <span className="text-xs truncate max-w-[150px]">{selectedFile.mimeType}</span>
                            </div>
                          )}
                          <div className="flex items-center justify-between">
                            <span className="text-muted-foreground">创建时间</span>
                            <span className="flex items-center gap-1 text-xs">
                              <Clock className="h-3 w-3" />
                              {formatDateTime(selectedFile.createdAt)}
                            </span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-muted-foreground">修改时间</span>
                            <span className="text-xs">{formatDateTime(selectedFile.updatedAt)}</span>
                          </div>
                        </div>
                      </div>

                      {/* 缩略图预览 */}
                      {selectedFile.thumbnail && (
                        <>
                          <Separator />
                          <div className="space-y-3">
                            <h4 className="text-sm font-medium">预览</h4>
                            <div className="relative overflow-hidden rounded-lg border">
                              <Image
                                src={selectedFile.thumbnail}
                                alt={selectedFile.name}
                                width={640}
                                height={360}
                                className="h-auto w-full object-cover"
                                sizes="(max-width: 768px) 100vw, 480px"
                              />
                            </div>
                          </div>
                        </>
                      )}

                      <Separator />

                      {/* 危险操作 */}
                      <div className="space-y-3">
                        <h4 className="text-sm font-medium text-destructive">危险操作</h4>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm">
                            <Edit className="mr-2 h-4 w-4" />
                            重命名
                          </Button>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={(e) => handleDeleteFile(selectedFile.id, e)}
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            删除
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </ScrollArea>
                </Card>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* 移动端文件详情抽屉 */}
        <AnimatePresence>
          {selectedFile && (
            <>
              {/* 移动端遮罩层 */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="lg:hidden fixed inset-0 bg-black/50 z-40"
                onClick={() => setSelectedFile(null)}
              />

              {/* 移动端详情抽屉 */}
              <motion.div
                initial={{ y: "100%" }}
                animate={{ y: 0 }}
                exit={{ y: "100%" }}
                transition={{ type: "spring", damping: 25, stiffness: 200 }}
                className="lg:hidden fixed bottom-0 left-0 right-0 z-50 max-h-[80vh] rounded-t-2xl bg-background"
              >
                <div className="flex items-center justify-between p-4 border-b">
                  <h3 className="font-semibold">文件详情</h3>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => setSelectedFile(null)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
                <ScrollArea className="h-[calc(80vh-60px)]">
                  <div className="p-4 space-y-6">
                    {/* 文件图标和名称 */}
                    <div className="flex flex-col items-center text-center">
                      {(() => {
                        const Icon = typeIcons[selectedFile.type] || File
                        return (
                          <div className={cn("p-4 rounded-xl mb-3", typeColors[selectedFile.type] || typeColors.document)}>
                            <Icon className="h-12 w-12" />
                          </div>
                        )
                      })()}
                      <h3 className="font-semibold text-lg break-all">{selectedFile.name}</h3>
                      <Badge variant="secondary" className="mt-2">
                        {typeLabels[selectedFile.type] || "文件"}
                      </Badge>
                    </div>

                    {/* 操作按钮 */}
                    <div className="flex justify-center gap-2 flex-wrap">
                      {selectedFile.type !== "folder" && (
                        <Button variant="outline" size="sm">
                          <Download className="mr-2 h-4 w-4" />
                          下载
                        </Button>
                      )}
                      <Button variant="outline" size="sm">
                        <Share2 className="mr-2 h-4 w-4" />
                        分享
                      </Button>
                      {selectedFile.type === "folder" && (
                        <Button variant="outline" size="sm">
                          <FolderOpen className="mr-2 h-4 w-4" />
                          打开
                        </Button>
                      )}
                    </div>

                    <Separator />

                    {/* 文件信息 */}
                    <div className="space-y-4">
                      <h4 className="text-sm font-medium">文件信息</h4>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div className="space-y-3">
                          <span className="text-muted-foreground">类型</span>
                          <div>{typeLabels[selectedFile.type] || "未知"}</div>
                        </div>
                        {selectedFile.type !== "folder" && (
                          <div className="space-y-3">
                            <span className="text-muted-foreground">大小</span>
                            <div>{formatFileSize(selectedFile.size)}</div>
                          </div>
                        )}
                        {selectedFile.type === "folder" && selectedFile.items !== null && (
                          <div className="space-y-3">
                            <span className="text-muted-foreground">包含</span>
                            <div>{selectedFile.items} 项</div>
                          </div>
                        )}
                        <div className="space-y-3 col-span-2">
                          <span className="text-muted-foreground">位置</span>
                          <div className="truncate text-xs">{selectedFile.path}</div>
                        </div>
                        {selectedFile.mimeType && selectedFile.mimeType !== "folder" && (
                          <div className="space-y-3 col-span-2">
                            <span className="text-muted-foreground">MIME类型</span>
                            <div className="truncate text-xs">{selectedFile.mimeType}</div>
                          </div>
                        )}
                        <div className="space-y-3">
                          <span className="text-muted-foreground">创建时间</span>
                          <div className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            <span className="text-xs">{formatDateTime(selectedFile.createdAt)}</span>
                          </div>
                        </div>
                        <div className="space-y-3">
                          <span className="text-muted-foreground">修改时间</span>
                          <div className="text-xs">{formatDateTime(selectedFile.updatedAt)}</div>
                        </div>
                      </div>
                    </div>

                    {/* 缩略图预览 */}
                    {selectedFile.thumbnail && (
                      <>
                        <Separator />
                        <div className="space-y-3">
                          <h4 className="text-sm font-medium">预览</h4>
                          <div className="relative overflow-hidden rounded-lg border">
                            <Image
                              src={selectedFile.thumbnail}
                              alt={selectedFile.name}
                              width={640}
                              height={360}
                              className="h-auto w-full object-cover"
                              sizes="(max-width: 768px) 100vw, 480px"
                            />
                          </div>
                        </div>
                      </>
                    )}

                    <Separator />

                    {/* 危险操作 */}
                    <div className="space-y-3">
                      <h4 className="text-sm font-medium text-destructive">危险操作</h4>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">
                          <Edit className="mr-2 h-4 w-4" />
                          重命名
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={(e) => handleDeleteFile(selectedFile.id, e)}
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          删除
                        </Button>
                      </div>
                    </div>
                  </div>
                </ScrollArea>
              </motion.div>
            </>
          )}
        </AnimatePresence>
    </div>
  )
}
