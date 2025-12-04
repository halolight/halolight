"use client"

import { motion } from "framer-motion"
import {
  Archive,
  File,
  Forward,
  Inbox,
  Loader2,
  Mail,
  MailOpen,
  Plus,
  Reply,
  Search,
  Send,
  Star,
  Trash2,
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
import { useConversations, useDeleteConversation, useMarkConversationRead, useMessages, useSendMessage } from "@/hooks"
import { Conversation, Message } from "@/lib/api/services"
import { cn } from "@/lib/utils"

const folders = [
  { id: "inbox", name: "收件箱", icon: Inbox },
  { id: "sent", name: "已发送", icon: Send },
  { id: "draft", name: "草稿箱", icon: File },
  { id: "archive", name: "归档", icon: Archive },
  { id: "trash", name: "回收站", icon: Trash2 },
]

function formatTime(dateStr: string): string {
  const date = new Date(dateStr)
  const now = new Date()
  const diff = now.getTime() - date.getTime()
  const hours = Math.floor(diff / 3600000)
  const days = Math.floor(diff / 86400000)

  if (hours < 24) {
    return `${String(date.getHours()).padStart(2, "0")}:${String(date.getMinutes()).padStart(2, "0")}`
  }
  if (days < 7) return `${days} 天前`
  return date.toLocaleDateString("zh-CN")
}

// 会话项组件 - 使用 React.memo 优化渲染
const ConversationItem = React.memo<{
  conv: Conversation
  isSelected: boolean
  isStarred: boolean
  onSelect: (conv: Conversation) => void
  onToggleStar: (id: string) => void
}>(({ conv, isSelected, isStarred, onSelect }) => (
  <div
    onClick={() => onSelect(conv)}
    className={cn(
      "flex cursor-pointer gap-3 border-b px-4 py-3 transition-colors hover:bg-muted/50",
      conv.unreadCount > 0 && "bg-muted/30",
      isSelected && "bg-muted"
    )}
  >
    <div className="relative">
      <Avatar className="h-10 w-10">
        <AvatarImage src={conv.avatar} />
        <AvatarFallback>{conv.name[0]}</AvatarFallback>
      </Avatar>
      {conv.online && (
        <div className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-green-500 border-2 border-background" />
      )}
    </div>
    <div className="flex-1 overflow-hidden">
      <div className="flex items-center justify-between">
        <span className={cn("font-medium", conv.unreadCount > 0 && "font-semibold")}>
          {conv.name}
        </span>
        <span className="text-xs text-muted-foreground">
          {formatTime(conv.lastMessageTime)}
        </span>
      </div>
      <p className={cn("text-sm truncate", conv.unreadCount > 0 && "font-medium")}>
        {conv.lastMessage}
      </p>
      <div className="flex items-center gap-2 mt-1">
        {isStarred && (
          <Star className="h-3 w-3 fill-yellow-500 text-yellow-500" />
        )}
        {conv.unreadCount > 0 && (
          <Badge variant="default" className="h-4 min-w-4 px-1 text-xs">
            {conv.unreadCount}
          </Badge>
        )}
      </div>
    </div>
  </div>
))
ConversationItem.displayName = "ConversationItem"

export default function MessagesPage() {
  const { data: conversations = [], isLoading } = useConversations()
  const markConversationRead = useMarkConversationRead()
  const sendMessage = useSendMessage()
  const deleteConversation = useDeleteConversation()

  const [selectedFolder, setSelectedFolder] = React.useState("inbox")
  const [selectedConversation, setSelectedConversation] = React.useState<Conversation | null>(null)
  const [searchQuery, setSearchQuery] = React.useState("")
  const [isComposeOpen, setIsComposeOpen] = React.useState(false)
  const [starred, setStarred] = React.useState<Set<string>>(new Set())

  const { data: messages = [] } = useMessages(selectedConversation?.id || "")

  const filteredConversations = React.useMemo(() => {
    return conversations.filter((conv: Conversation) =>
      conv.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      conv.lastMessage.toLowerCase().includes(searchQuery.toLowerCase())
    )
  }, [conversations, searchQuery])

  const handleSelectConversation = (conv: Conversation) => {
    setSelectedConversation(conv)
    if (conv.unreadCount > 0) {
      markConversationRead.mutate(conv.id)
    }
  }

  const handleDeleteConversation = React.useCallback(() => {
    if (!selectedConversation) return
    const convo = selectedConversation
    setSelectedConversation(null)
    deleteConversation.mutate(convo.id, {
      onError: () => {
        setSelectedConversation(convo)
      },
    })
  }, [deleteConversation, selectedConversation])

  const toggleStar = (id: string) => {
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

  // const unreadCount = conversations.reduce((sum: number, c: Conversation) => sum + c.unreadCount, 0)

  const folderCounts = {
    inbox: conversations.length,
    sent: 0,
    draft: 0,
    archive: 0,
    trash: 0,
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
            <h1 className="text-3xl font-bold tracking-tight">消息中心</h1>
          </div>
          <Dialog open={isComposeOpen} onOpenChange={setIsComposeOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                写消息
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px]">
              <DialogHeader>
                <DialogTitle>新消息</DialogTitle>
                <DialogDescription>填写收件人、主题与内容后发送</DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <InputClear placeholder="收件人" />
                <InputClear placeholder="主题" />
                <textarea
                  className="min-h-[200px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  placeholder="写下您的消息..."
                />
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsComposeOpen(false)}>
                  存为草稿
                </Button>
                <Button onClick={() => setIsComposeOpen(false)} disabled={sendMessage.isPending}>
                  {sendMessage.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  发送
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </motion.div>

        <div className="grid gap-6 lg:grid-cols-12">
          {/* 文件夹列表 */}
          <div className="lg:col-span-2">
            <Card>
              <CardContent className="p-2">
                <nav className="space-y-1">
                  {folders.map((folder) => (
                    <button
                      key={folder.id}
                      onClick={() => setSelectedFolder(folder.id)}
                      className={cn(
                        "flex w-full items-center justify-between rounded-lg px-3 py-2 text-sm transition-colors",
                        selectedFolder === folder.id
                          ? "bg-primary text-primary-foreground"
                          : "hover:bg-muted"
                      )}
                    >
                      <div className="flex items-center gap-2">
                        <folder.icon className="h-4 w-4" />
                        {folder.name}
                      </div>
                      {folderCounts[folder.id as keyof typeof folderCounts] > 0 && (
                        <Badge
                          variant={selectedFolder === folder.id ? "secondary" : "default"}
                          className="h-5 min-w-5 px-1.5"
                        >
                          {folderCounts[folder.id as keyof typeof folderCounts]}
                        </Badge>
                      )}
                    </button>
                  ))}
                </nav>
              </CardContent>
            </Card>
          </div>

          {/* 消息列表 */}
          <div className="lg:col-span-4">
            <Card className="h-[calc(100vh-220px)]">
              <CardHeader className="pb-3">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground z-10" />
                  <InputClear
                    placeholder="搜索消息..."
                    value={searchQuery}
                    onChange={setSearchQuery}
                    className="pl-10"
                  />
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <ScrollArea className="h-[calc(100vh-320px)]">
                  {isLoading ? (
                    <div className="flex items-center justify-center py-12">
                      <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                    </div>
                  ) : (
                    filteredConversations.map((conv: Conversation) => (
                      <ConversationItem
                        key={conv.id}
                        conv={conv}
                        isSelected={selectedConversation?.id === conv.id}
                        isStarred={starred.has(conv.id)}
                        onSelect={handleSelectConversation}
                        onToggleStar={toggleStar}
                      />
                    ))
                  )}
                  {!isLoading && filteredConversations.length === 0 && (
                    <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
                      <Mail className="h-12 w-12 mb-4" />
                      <p>暂无消息</p>
                    </div>
                  )}
                </ScrollArea>
              </CardContent>
            </Card>
          </div>

          {/* 消息详情 */}
          <div className="lg:col-span-6">
            <Card className="h-[calc(100vh-220px)]">
              {selectedConversation ? (
                <div className="flex flex-col h-full">
                  <CardHeader className="pb-3 shrink-0">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-10 w-10">
                          <AvatarImage src={selectedConversation.avatar} />
                          <AvatarFallback>{selectedConversation.name[0]}</AvatarFallback>
                        </Avatar>
                        <div>
                          <CardTitle className="text-lg">{selectedConversation.name}</CardTitle>
                          <p className="text-xs text-muted-foreground">
                            {selectedConversation.online ? "在线" : "离线"}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => toggleStar(selectedConversation.id)}
                        >
                          <Star
                            className={cn(
                              "h-4 w-4",
                              starred.has(selectedConversation.id) && "fill-yellow-500 text-yellow-500"
                            )}
                          />
                        </Button>
                        <Button variant="ghost" size="icon">
                          <Reply className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon">
                          <Forward className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon">
                          <Archive className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={handleDeleteConversation}
                          disabled={deleteConversation.isPending}
                        >
                          {deleteConversation.isPending ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <Trash2 className="h-4 w-4" />
                          )}
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <Separator className="shrink-0" />
                  <div className="flex-1 min-h-0 overflow-hidden">
                    <ScrollArea className="h-full">
                      <div className="space-y-4 p-4">
                        {messages.map((message: Message) => (
                          <div
                            key={message.id}
                            className={cn(
                              "flex gap-3",
                              message.sender.id === "current-user" && "flex-row-reverse"
                            )}
                          >
                            <Avatar className="h-8 w-8 shrink-0">
                              <AvatarImage src={message.sender.avatar} />
                              <AvatarFallback>{message.sender.name[0]}</AvatarFallback>
                            </Avatar>
                            <div
                              className={cn(
                                "max-w-[70%] rounded-lg p-3",
                                message.sender.id === "current-user"
                                  ? "bg-primary text-primary-foreground"
                                  : "bg-muted"
                              )}
                            >
                              <p className="text-sm whitespace-pre-wrap break-words">{message.content}</p>
                              <p className="text-xs opacity-70 mt-1">
                                {formatTime(message.createdAt)}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </ScrollArea>
                  </div>
                  <div className="shrink-0 p-4 pt-2 border-t">
                    <div className="flex gap-2">
                      <InputClear
                        placeholder="输入消息..."
                        wrapperClassName="flex-1 min-w-0"
                      />
                      <Button>
                        <Send className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
                  <MailOpen className="h-16 w-16 mb-4" />
                  <p>选择一条消息查看详情</p>
                </div>
              )}
            </Card>
          </div>
        </div>
    </div>
  )
}
