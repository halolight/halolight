"use client"

import { AnimatePresence, motion } from "framer-motion"
import {
  Clock,
  Download,
  Edit,
  Eye,
  File,
  FileCode,
  FileImage,
  FileSpreadsheet,
  FileText,
  FolderOpen,
  Grid,
  List,
  Loader2,
  Plus,
  Search,
  Share2,
  Star,
  StarOff,
  Tag,
  Trash2,
  User,
  Users,
  X,
} from "lucide-react"
import * as React from "react"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
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
import { InputClear } from "@/components/ui/input-clear"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { useCreateDocument, useDeleteDocument, useDocuments } from "@/hooks"
import type { Document as DocumentType } from "@/lib/api/types"
import { cn } from "@/lib/utils"

const folders = [
  { name: "全部文档", icon: FolderOpen },
  { name: "项目文档", icon: FileText },
  { name: "设计资源", icon: FileImage },
  { name: "技术文档", icon: FileCode },
  { name: "报表", icon: FileSpreadsheet },
  { name: "会议记录", icon: File },
]

const typeIcons: Record<string, React.ElementType> = {
  pdf: FileText,
  doc: FileText,
  image: FileImage,
  spreadsheet: FileSpreadsheet,
  code: FileCode,
  other: File,
}

const typeColors: Record<string, string> = {
  pdf: "text-red-500",
  doc: "text-blue-500",
  image: "text-green-500",
  spreadsheet: "text-emerald-500",
  code: "text-purple-500",
  other: "text-gray-500",
}

function formatFileSize(bytes: number): string {
  if (bytes === 0) return "0 B"
  const k = 1024
  const sizes = ["B", "KB", "MB", "GB"]
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + " " + sizes[i]
}

function formatDate(dateStr: string): string {
  const date = new Date(dateStr)
  return date.toLocaleDateString("zh-CN")
}

function formatDateTime(dateStr: string): string {
  const date = new Date(dateStr)
  return date.toLocaleString("zh-CN")
}

export default function DocumentsPage() {
  const { data, isLoading } = useDocuments()
  const documents = React.useMemo(() => data?.list ?? [], [data?.list])
  const deleteDocument = useDeleteDocument()
  const createDocument = useCreateDocument()

  const [searchQuery, setSearchQuery] = React.useState("")
  const [selectedFolder, setSelectedFolder] = React.useState("全部文档")
  const [viewMode, setViewMode] = React.useState<"grid" | "list">("list")
  const [isUploadDialogOpen, setIsUploadDialogOpen] = React.useState(false)
  const [starred, setStarred] = React.useState<Set<string>>(new Set())
  const [selectedDocument, setSelectedDocument] = React.useState<DocumentType | null>(null)

  const filteredDocuments = React.useMemo(() => {
    return documents.filter((doc: DocumentType) => {
      const docName = doc.name ?? doc.title ?? ""
      const matchesSearch = docName.toLowerCase().includes(searchQuery.toLowerCase())
      const matchesFolder = selectedFolder === "全部文档" || doc.folder === selectedFolder
      return matchesSearch && matchesFolder
    })
  }, [documents, searchQuery, selectedFolder])

  const folderCounts = React.useMemo(() => {
    const counts: Record<string, number> = { "全部文档": documents.length }
    documents.forEach((doc: DocumentType) => {
      if (doc.folder) {
        counts[doc.folder] = (counts[doc.folder] || 0) + 1
      }
    })
    return counts
  }, [documents])

  const toggleStar = (id: string, e?: React.MouseEvent) => {
    e?.stopPropagation()
    setStarred((prev) => {
      const next = new Set(prev)
      if (next.has(id)) {
        next.delete(id)
      } else {
        next.add(id)
      }
      return next
    })
  }

  const handleDelete = (id: string, e?: React.MouseEvent) => {
    e?.stopPropagation()
    deleteDocument.mutate(id)
    if (selectedDocument?.id === id) {
      setSelectedDocument(null)
    }
  }

  const handleSelectDocument = (doc: DocumentType) => {
    setSelectedDocument(doc)
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
            <h1 className="text-3xl font-bold tracking-tight">文档管理</h1>
          </div>
          <Dialog open={isUploadDialogOpen} onOpenChange={setIsUploadDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                上传文档
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>上传文档</DialogTitle>
                <DialogDescription>选择要上传的文档文件</DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="flex items-center justify-center w-full">
                  <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer hover:bg-muted/50 transition-colors">
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      <FileText className="w-8 h-8 mb-2 text-muted-foreground" />
                      <p className="text-sm text-muted-foreground">
                        点击或拖拽文件到此处上传
                      </p>
                    </div>
                    <input type="file" className="hidden" multiple />
                  </label>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsUploadDialogOpen(false)}>
                  取消
                </Button>
                <Button onClick={() => setIsUploadDialogOpen(false)} disabled={createDocument.isPending}>
                  {createDocument.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  上传
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </motion.div>

        {/* 移动端文件夹选择器 */}
        <div className="lg:hidden mb-4">
          <Card>
            <CardContent className="p-3">
              <div className="flex items-center gap-2 overflow-x-auto pb-2">
                {folders.map((folder) => (
                  <button
                    key={folder.name}
                    onClick={() => setSelectedFolder(folder.name)}
                    className={cn(
                      "flex items-center gap-2 px-3 py-1.5 text-sm rounded-lg whitespace-nowrap transition-colors flex-shrink-0",
                      selectedFolder === folder.name
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted hover:bg-muted/80"
                    )}
                  >
                    <folder.icon className="h-4 w-4" />
                    <span>{folder.name}</span>
                    <Badge
                      variant={selectedFolder === folder.name ? "secondary" : "outline"}
                      className="h-5 min-w-5 px-1.5 text-xs"
                    >
                      {folderCounts[folder.name] || 0}
                    </Badge>
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-6 lg:grid-cols-12">
          {/* 桌面端文件夹列表 */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
            className="hidden lg:block lg:col-span-2"
          >
            <Card className="h-[calc(100vh-220px)]">
              <CardHeader className="pb-2">
                <CardTitle className="text-base">文件夹</CardTitle>
              </CardHeader>
              <CardContent className="p-2">
                <nav className="space-y-1">
                  {folders.map((folder) => (
                    <button
                      key={folder.name}
                      onClick={() => setSelectedFolder(folder.name)}
                      className={cn(
                        "flex w-full items-center justify-between rounded-lg px-3 py-2 text-sm transition-colors",
                        selectedFolder === folder.name
                          ? "bg-primary text-primary-foreground"
                          : "hover:bg-muted"
                      )}
                    >
                      <div className="flex items-center gap-2">
                        <folder.icon className="h-4 w-4" />
                        <span className="truncate">{folder.name}</span>
                      </div>
                      <Badge
                        variant={selectedFolder === folder.name ? "secondary" : "outline"}
                        className="h-5 min-w-5 px-1.5"
                      >
                        {folderCounts[folder.name] || 0}
                      </Badge>
                    </button>
                  ))}
                </nav>
              </CardContent>
            </Card>
          </motion.div>

          {/* 文档列表 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.2 }}
            className={cn(
              "transition-all duration-300",
              selectedDocument ? "lg:col-span-5" : "lg:col-span-10",
              selectedDocument ? "col-span-12" : "col-span-12"
            )}
          >
            <Card className="h-[calc(100vh-220px)] lg:h-[calc(100vh-220px)]">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between gap-4">
                  <div className="relative flex-1 max-w-sm">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <InputClear
                      placeholder="搜索文档..."
                      value={searchQuery}
                      onChange={setSearchQuery}
                      className="pl-10"
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant={viewMode === "grid" ? "secondary" : "ghost"}
                      size="icon"
                      onClick={() => setViewMode("grid")}
                    >
                      <Grid className="h-4 w-4" />
                    </Button>
                    <Button
                      variant={viewMode === "list" ? "secondary" : "ghost"}
                      size="icon"
                      onClick={() => setViewMode("list")}
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
                  ) : (
                    <AnimatePresence mode="wait">
                      {viewMode === "grid" ? (
                        <motion.div
                          key="grid"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          className="grid gap-3 p-4 sm:grid-cols-2"
                        >
                          {filteredDocuments.map((doc: DocumentType, index: number) => {
                            const Icon = typeIcons[doc.type] || File
                            return (
                              <motion.div
                                key={doc.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.03 }}
                                onClick={() => handleSelectDocument(doc)}
                                className={cn(
                                  "group relative rounded-lg border p-3 hover:shadow-md transition-all cursor-pointer",
                                  selectedDocument?.id === doc.id && "ring-2 ring-primary"
                                )}
                              >
                                <div className="flex items-start justify-between">
                                  <div className={cn("p-2 rounded-lg bg-muted", typeColors[doc.type] || typeColors.other)}>
                                    <Icon className="h-5 w-5" />
                                  </div>
                                  <div className="flex items-center gap-1">
                                    <Button
                                      variant="ghost"
                                      size="icon"
                                      className="h-7 w-7"
                                      onClick={(e) => toggleStar(doc.id, e)}
                                    >
                                      {starred.has(doc.id) ? (
                                        <Star className="h-3.5 w-3.5 fill-yellow-500 text-yellow-500" />
                                      ) : (
                                        <StarOff className="h-3.5 w-3.5" />
                                      )}
                                    </Button>
                                  </div>
                                </div>
                                <div className="mt-2">
                                  <p className="font-medium text-sm truncate">{doc.name}</p>
                                  <p className="text-xs text-muted-foreground mt-1">
                                    {formatFileSize(doc.size)} · {formatDate(doc.updatedAt)}
                                  </p>
                                </div>
                              </motion.div>
                            )
                          })}
                        </motion.div>
                      ) : (
                        <motion.div
                          key="list"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          className="divide-y"
                        >
                          {filteredDocuments.map((doc: DocumentType, index: number) => {
                            const Icon = typeIcons[doc.type] || File
                            return (
                              <motion.div
                                key={doc.id}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: index * 0.03 }}
                                onClick={() => handleSelectDocument(doc)}
                                className={cn(
                                  "flex items-center justify-between px-4 py-3 hover:bg-muted/50 transition-colors cursor-pointer",
                                  selectedDocument?.id === doc.id && "bg-muted"
                                )}
                              >
                                <div className="flex items-center gap-3 min-w-0 flex-1">
                                  <div className={cn("p-2 rounded-lg bg-muted shrink-0", typeColors[doc.type] || typeColors.other)}>
                                    <Icon className="h-4 w-4" />
                                  </div>
                                  <div className="min-w-0 flex-1">
                                    <p className="font-medium text-sm truncate">{doc.name}</p>
                                    <p className="text-xs text-muted-foreground truncate">
                                      {formatFileSize(doc.size)} · {formatDate(doc.updatedAt)}{doc.author?.name ? ` · ${doc.author.name}` : ""}
                                    </p>
                                  </div>
                                </div>
                                <div className="flex items-center gap-1 shrink-0 ml-2">
                                  {doc.shared && (
                                    <Badge variant="outline" className="text-xs">
                                      <Share2 className="h-3 w-3 mr-1" />
                                      共享
                                    </Badge>
                                  )}
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-7 w-7"
                                    onClick={(e) => toggleStar(doc.id, e)}
                                  >
                                    {starred.has(doc.id) ? (
                                      <Star className="h-3.5 w-3.5 fill-yellow-500 text-yellow-500" />
                                    ) : (
                                      <StarOff className="h-3.5 w-3.5" />
                                    )}
                                  </Button>
                                </div>
                              </motion.div>
                            )
                          })}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  )}

                  {!isLoading && filteredDocuments.length === 0 && (
                    <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
                      <FileText className="h-12 w-12 mb-4" />
                      <p>暂无文档</p>
                    </div>
                  )}
                </ScrollArea>
              </CardContent>
            </Card>
          </motion.div>

          {/* 桌面端文档详情面板 */}
          <AnimatePresence>
            {selectedDocument && (
              <motion.div
                initial={{ opacity: 0, x: 20, width: 0 }}
                animate={{ opacity: 1, x: 0, width: "auto" }}
                exit={{ opacity: 0, x: 20, width: 0 }}
                transition={{ duration: 0.3 }}
                className="hidden lg:block lg:col-span-5"
              >
                <Card className="h-[calc(100vh-220px)]">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-base">文档详情</CardTitle>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => setSelectedDocument(null)}
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
                          const Icon = typeIcons[selectedDocument.type] || File
                          return (
                            <div className={cn("p-4 rounded-xl bg-muted mb-3", typeColors[selectedDocument.type] || typeColors.other)}>
                              <Icon className="h-12 w-12" />
                            </div>
                          )
                        })()}
                        <h3 className="font-semibold text-lg">{selectedDocument.name}</h3>
                        <p className="text-sm text-muted-foreground">{selectedDocument.folder}</p>
                      </div>

                      {/* 操作按钮 */}
                      <div className="flex justify-center gap-2">
                        <Button variant="outline" size="sm">
                          <Eye className="mr-2 h-4 w-4" />
                          预览
                        </Button>
                        <Button variant="outline" size="sm">
                          <Download className="mr-2 h-4 w-4" />
                          下载
                        </Button>
                        <Button variant="outline" size="sm">
                          <Share2 className="mr-2 h-4 w-4" />
                          分享
                        </Button>
                      </div>

                      <Separator />

                      {/* 文件信息 */}
                      <div className="space-y-4">
                        <h4 className="text-sm font-medium">文件信息</h4>
                        <div className="space-y-3 text-sm">
                          <div className="flex items-center justify-between">
                            <span className="text-muted-foreground">类型</span>
                            <Badge variant="secondary">{selectedDocument.type.toUpperCase()}</Badge>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-muted-foreground">大小</span>
                            <span>{formatFileSize(selectedDocument.size)}</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-muted-foreground">浏览次数</span>
                            <span className="flex items-center gap-1">
                              <Eye className="h-3 w-3" />
                              {selectedDocument.views}
                            </span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-muted-foreground">创建时间</span>
                            <span className="flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              {formatDateTime(selectedDocument.createdAt)}
                            </span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-muted-foreground">修改时间</span>
                            <span>{formatDateTime(selectedDocument.updatedAt)}</span>
                          </div>
                        </div>
                      </div>

                      <Separator />

                      {/* 作者信息 */}
                      {selectedDocument.author && (
                        <div className="space-y-3">
                          <h4 className="text-sm font-medium flex items-center gap-2">
                            <User className="h-4 w-4" />
                            作者
                          </h4>
                          <div className="flex items-center gap-3">
                            <Avatar className="h-10 w-10">
                              <AvatarImage src={selectedDocument.author.avatar} />
                              <AvatarFallback>{selectedDocument.author.name?.[0] ?? "?"}</AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="font-medium text-sm">{selectedDocument.author.name ?? "未知"}</p>
                              <p className="text-xs text-muted-foreground">文档所有者</p>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* 协作者 */}
                      {selectedDocument.collaborators && selectedDocument.collaborators.length > 0 && (
                        <>
                          <Separator />
                          <div className="space-y-3">
                            <h4 className="text-sm font-medium flex items-center gap-2">
                              <Users className="h-4 w-4" />
                              协作者 ({selectedDocument.collaborators.length})
                            </h4>
                            <div className="space-y-2">
                              {selectedDocument.collaborators.map((collaborator) => (
                                <div key={collaborator.id} className="flex items-center gap-3">
                                  <Avatar className="h-8 w-8">
                                    <AvatarImage src={collaborator.avatar} />
                                    <AvatarFallback>{collaborator.name[0]}</AvatarFallback>
                                  </Avatar>
                                  <span className="text-sm">{collaborator.name}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        </>
                      )}

                      {/* 标签 */}
                      {selectedDocument.tags && selectedDocument.tags.length > 0 && (
                        <>
                          <Separator />
                          <div className="space-y-3">
                            <h4 className="text-sm font-medium flex items-center gap-2">
                              <Tag className="h-4 w-4" />
                              标签
                            </h4>
                            <div className="flex flex-wrap gap-2">
                              {selectedDocument.tags.map((tag, index) => (
                                <Badge key={index} variant="secondary">
                                  {tag}
                                </Badge>
                              ))}
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
                            onClick={(e) => handleDelete(selectedDocument.id, e)}
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

        {/* 移动端文档详情抽屉 */}
        <AnimatePresence>
          {selectedDocument && (
            <>
              {/* 移动端遮罩层 */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="lg:hidden fixed inset-0 bg-black/50 z-40"
                onClick={() => setSelectedDocument(null)}
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
                  <h3 className="font-semibold">文档详情</h3>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => setSelectedDocument(null)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
                <ScrollArea className="h-[calc(80vh-60px)]">
                  <div className="p-4 space-y-6">
                    {/* 文件图标和名称 */}
                    <div className="flex flex-col items-center text-center">
                      {(() => {
                        const Icon = typeIcons[selectedDocument.type] || File
                        return (
                          <div className={cn("p-4 rounded-xl bg-muted mb-3", typeColors[selectedDocument.type] || typeColors.other)}>
                            <Icon className="h-12 w-12" />
                          </div>
                        )
                      })()}
                      <h3 className="font-semibold text-lg break-all">{selectedDocument.name}</h3>
                      <p className="text-sm text-muted-foreground">{selectedDocument.folder}</p>
                    </div>

                    {/* 操作按钮 */}
                    <div className="flex justify-center gap-2 flex-wrap">
                      <Button variant="outline" size="sm">
                        <Eye className="mr-2 h-4 w-4" />
                        预览
                      </Button>
                      <Button variant="outline" size="sm">
                        <Download className="mr-2 h-4 w-4" />
                        下载
                      </Button>
                      <Button variant="outline" size="sm">
                        <Share2 className="mr-2 h-4 w-4" />
                        分享
                      </Button>
                    </div>

                    <Separator />

                    {/* 文件信息 */}
                    <div className="space-y-4">
                      <h4 className="text-sm font-medium">文件信息</h4>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div className="space-y-3">
                          <span className="text-muted-foreground">类型</span>
                          <div>
                            <Badge variant="secondary">{selectedDocument.type.toUpperCase()}</Badge>
                          </div>
                        </div>
                        <div className="space-y-3">
                          <span className="text-muted-foreground">大小</span>
                          <div>{formatFileSize(selectedDocument.size)}</div>
                        </div>
                        <div className="space-y-3">
                          <span className="text-muted-foreground">浏览次数</span>
                          <div className="flex items-center gap-1">
                            <Eye className="h-3 w-3" />
                            {selectedDocument.views}
                          </div>
                        </div>
                        <div className="space-y-3">
                          <span className="text-muted-foreground">创建时间</span>
                          <div className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            <span className="text-xs">{formatDateTime(selectedDocument.createdAt)}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <Separator />

                    {/* 作者信息 */}
                    {selectedDocument.author && (
                      <div className="space-y-3">
                        <h4 className="text-sm font-medium flex items-center gap-2">
                          <User className="h-4 w-4" />
                          作者
                        </h4>
                        <div className="flex items-center gap-3">
                          <Avatar className="h-10 w-10">
                            <AvatarImage src={selectedDocument.author.avatar} />
                            <AvatarFallback>{selectedDocument.author.name?.[0] ?? "?"}</AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium text-sm">{selectedDocument.author.name ?? "未知"}</p>
                            <p className="text-xs text-muted-foreground">文档所有者</p>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* 协作者 */}
                    {selectedDocument.collaborators && selectedDocument.collaborators.length > 0 && (
                      <>
                        <Separator />
                        <div className="space-y-3">
                          <h4 className="text-sm font-medium flex items-center gap-2">
                            <Users className="h-4 w-4" />
                            协作者 ({selectedDocument.collaborators.length})
                          </h4>
                          <div className="space-y-2">
                            {selectedDocument.collaborators.map((collaborator) => (
                              <div key={collaborator.id} className="flex items-center gap-3">
                                <Avatar className="h-8 w-8">
                                  <AvatarImage src={collaborator.avatar} />
                                  <AvatarFallback>{collaborator.name[0]}</AvatarFallback>
                                </Avatar>
                                <span className="text-sm">{collaborator.name}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </>
                    )}

                    {/* 标签 */}
                    {selectedDocument.tags && selectedDocument.tags.length > 0 && (
                      <>
                        <Separator />
                        <div className="space-y-3">
                          <h4 className="text-sm font-medium flex items-center gap-2">
                            <Tag className="h-4 w-4" />
                            标签
                          </h4>
                          <div className="flex flex-wrap gap-2">
                            {selectedDocument.tags.map((tag, index) => (
                              <Badge key={index} variant="secondary">
                                {tag}
                              </Badge>
                            ))}
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
                          onClick={(e) => handleDelete(selectedDocument.id, e)}
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
