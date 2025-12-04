"use client"

import { motion } from "framer-motion"
import {
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  Clock,
  Loader2,
  MapPin,
  Plus,
  Users,
  Video,
} from "lucide-react"
import * as React from "react"

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
import { InputClear } from "@/components/ui/input-clear"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useCalendarEvents, useCreateCalendarEvent } from "@/hooks"
import { CalendarEvent } from "@/lib/api/services"
import { cn } from "@/lib/utils"

const typeColors: Record<string, string> = {
  meeting: "bg-blue-500",
  task: "bg-green-500",
  reminder: "bg-yellow-500",
  holiday: "bg-purple-500",
}

/**
 * 获取事件类型对应的颜色
 */
function getEventTypeColor(type?: string): string {
  return type && typeColors[type] ? typeColors[type] : "bg-muted-foreground"
}

const typeLabels: Record<string, string> = {
  meeting: "会议",
  task: "任务",
  reminder: "提醒",
  holiday: "假日",
}

/**
 * 获取事件类型对应的标签
 */
function getEventTypeLabel(type?: string): string {
  return type && typeLabels[type] ? typeLabels[type] : "其他"
}

const weekDays = ["日", "一", "二", "三", "四", "五", "六"]

function formatDate(date: Date): string {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`
}

function formatTime(dateStr: string): string {
  const date = new Date(dateStr)
  return `${String(date.getHours()).padStart(2, "0")}:${String(date.getMinutes()).padStart(2, "0")}`
}

function getDateFromEvent(event: CalendarEvent): string {
  return event.start.split("T")[0]
}

export default function CalendarPage() {
  const { data: events = [], isLoading } = useCalendarEvents()
  const createEvent = useCreateCalendarEvent()

  const [currentDate, setCurrentDate] = React.useState(new Date())
  const [selectedDate, setSelectedDate] = React.useState(new Date())
  const [isAddEventOpen, setIsAddEventOpen] = React.useState(false)

  const year = currentDate.getFullYear()
  const month = currentDate.getMonth()

  const firstDayOfMonth = new Date(year, month, 1)
  const lastDayOfMonth = new Date(year, month + 1, 0)
  const firstDayWeekday = firstDayOfMonth.getDay()
  const daysInMonth = lastDayOfMonth.getDate()

  const prevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1))
  }

  const nextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1))
  }

  const goToToday = () => {
    const today = new Date()
    setCurrentDate(today)
    setSelectedDate(today)
  }

  const getEventsForDate = (date: string) => {
    return events.filter((event: CalendarEvent) => getDateFromEvent(event) === date)
  }

  const selectedDateStr = formatDate(selectedDate)
  const todayDateStr = formatDate(new Date())
  const selectedEvents = getEventsForDate(selectedDateStr)

  const calendarDays = React.useMemo(() => {
    const days = []
    const prevMonthDays = new Date(year, month, 0).getDate()

    for (let i = firstDayWeekday - 1; i >= 0; i--) {
      days.push({
        day: prevMonthDays - i,
        isCurrentMonth: false,
        date: formatDate(new Date(year, month - 1, prevMonthDays - i)),
      })
    }

    for (let i = 1; i <= daysInMonth; i++) {
      days.push({
        day: i,
        isCurrentMonth: true,
        date: formatDate(new Date(year, month, i)),
      })
    }

    const remainingDays = 42 - days.length
    for (let i = 1; i <= remainingDays; i++) {
      days.push({
        day: i,
        isCurrentMonth: false,
        date: formatDate(new Date(year, month + 1, i)),
      })
    }

    return days
  }, [year, month, firstDayWeekday, daysInMonth])

  const upcomingEvents = React.useMemo(() => {
    const today = new Date()
    return events
      .filter((event: CalendarEvent) => new Date(event.start) >= today)
      .sort((a: CalendarEvent, b: CalendarEvent) => new Date(a.start).getTime() - new Date(b.start).getTime())
      .slice(0, 4)
  }, [events])

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
            <h1 className="text-3xl font-bold tracking-tight">日程安排</h1>
          </div>
          <Dialog open={isAddEventOpen} onOpenChange={setIsAddEventOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                新建日程
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>新建日程</DialogTitle>
                <DialogDescription>添加新的日程或任务</DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <label className="text-sm font-medium">标题</label>
                  <InputClear placeholder="输入日程标题" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <label className="text-sm font-medium">日期</label>
                    <InputClear type="date" defaultValue={selectedDateStr} />
                  </div>
                  <div className="grid gap-2">
                    <label className="text-sm font-medium">类型</label>
                    <InputClear placeholder="会议" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <label className="text-sm font-medium">开始时间</label>
                    <InputClear type="time" defaultValue="09:00" />
                  </div>
                  <div className="grid gap-2">
                    <label className="text-sm font-medium">结束时间</label>
                    <InputClear type="time" defaultValue="10:00" />
                  </div>
                </div>
                <div className="grid gap-2">
                  <label className="text-sm font-medium">地点</label>
                  <InputClear placeholder="会议室或线上链接" />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsAddEventOpen(false)}>
                  取消
                </Button>
                <Button onClick={() => setIsAddEventOpen(false)} disabled={createEvent.isPending}>
                  {createEvent.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  创建
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </motion.div>

        {/* 移动端月份导航和操作 */}
        <div className="lg:hidden">
          <Card className="mb-4">
            <CardContent className="p-3">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm" onClick={goToToday}>
                    今天
                  </Button>
                  <div className="flex items-center gap-1">
                    <Button variant="ghost" size="icon" onClick={prevMonth}>
                      <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={nextMonth}>
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <h2 className="text-lg font-semibold">
                  {year}年{month + 1}月
                </h2>
              </div>
              {/* 类型图例 */}
              <div className="flex items-center gap-2 flex-wrap">
                {Object.entries(typeLabels).map(([type, label]) => (
                  <div key={type} className="flex items-center gap-1">
                    <div className={cn("h-2 w-2 rounded-full", typeColors[type])} />
                    <span className="text-xs text-muted-foreground">{label}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* 日历 */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
            className="lg:col-span-2"
          >
            <Card>
              <CardHeader className="pb-3 hidden lg:block">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <Button variant="outline" size="sm" onClick={goToToday}>
                      今天
                    </Button>
                    <div className="flex items-center gap-1">
                      <Button variant="ghost" size="icon" onClick={prevMonth}>
                        <ChevronLeft className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={nextMonth}>
                        <ChevronRight className="h-4 w-4" />
                      </Button>
                    </div>
                    <h2 className="text-lg font-semibold">
                      {year}年{month + 1}月
                    </h2>
                  </div>
                  <div className="flex items-center gap-2">
                    {Object.entries(typeLabels).map(([type, label]) => (
                      <div key={type} className="flex items-center gap-1">
                        <div className={cn("h-2 w-2 rounded-full", typeColors[type])} />
                        <span className="text-xs text-muted-foreground">{label}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="flex items-center justify-center py-24">
                    <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                  </div>
                ) : (
                  <>
                    {/* 星期标题 */}
                    <div className="grid grid-cols-7 mb-2">
                      {weekDays.map((day) => (
                        <div
                          key={day}
                          className="text-center text-sm font-medium text-muted-foreground py-2"
                        >
                          {day}
                        </div>
                      ))}
                    </div>

                    {/* 日期格子 */}
                    <div className="grid grid-cols-7 gap-px sm:gap-1">
                      {calendarDays.map((item, index) => {
                        const dayEvents = getEventsForDate(item.date)
                        const isSelected = item.date === selectedDateStr
                        const isToday = item.date === todayDateStr

                        return (
                          <motion.button
                            key={index}
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: index * 0.01 }}
                            onClick={() => setSelectedDate(new Date(item.date))}
                            className={cn(
                              "relative aspect-square p-0.5 sm:p-1 rounded transition-colors text-xs sm:text-sm",
                              item.isCurrentMonth
                                ? "hover:bg-muted"
                                : "text-muted-foreground/30",
                              isSelected && "bg-primary text-primary-foreground hover:bg-primary",
                              isToday && !isSelected && "ring-1 sm:ring-2 ring-primary"
                            )}
                          >
                            <span className="text-xs sm:text-sm">{item.day}</span>
                            {dayEvents.length > 0 && (
                              <div className="absolute bottom-0.5 sm:bottom-1 left-1/2 -translate-x-1/2 flex gap-0.5">
                                {dayEvents.slice(0, 2).map((event: CalendarEvent, i: number) => (
                                  <div
                                    key={i}
                                    className={cn(
                                      "h-0.5 w-0.5 sm:h-1 sm:w-1 rounded-full",
                                      isSelected ? "bg-primary-foreground" : getEventTypeColor(event.type)
                                    )}
                                  />
                                ))}
                                {dayEvents.length > 2 && (
                                  <div
                                    className={cn(
                                      "h-0.5 w-0.5 sm:h-1 sm:w-1 rounded-full",
                                      isSelected ? "bg-primary-foreground" : "bg-muted-foreground"
                                    )}
                                  />
                                )}
                              </div>
                            )}
                          </motion.button>
                        )
                      })}
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          </motion.div>

          {/* 桌面端日程列表 */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: 0.2 }}
            className="hidden lg:block"
          >
            <Card className="h-full">
              <CardHeader>
                <CardTitle className="text-base">
                  {selectedDate.getMonth() + 1}月{selectedDate.getDate()}日 日程
                </CardTitle>
                <CardDescription>
                  {selectedEvents.length > 0
                    ? `共 ${selectedEvents.length} 个日程`
                    : "暂无日程"}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[400px] pr-4">
                  {selectedEvents.length > 0 ? (
                    <div className="space-y-4">
                      {selectedEvents.map((event: CalendarEvent, index: number) => (
                        <motion.div
                          key={event.id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.1 }}
                          className="relative rounded-lg border p-4 hover:shadow-md transition-shadow"
                        >
                          <div
                            className={cn(
                              "absolute left-0 top-0 bottom-0 w-1 rounded-l-lg",
                              getEventTypeColor(event.type)
                            )}
                          />
                          <div className="flex items-start justify-between">
                            <div className="space-y-1">
                              <h4 className="font-medium">{event.title}</h4>
                              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                <Clock className="h-3 w-3" />
                                {formatTime(event.start)} - {formatTime(event.end)}
                              </div>
                              {event.location && (
                                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                  {event.location.includes("线上") ? (
                                    <Video className="h-3 w-3" />
                                  ) : (
                                    <MapPin className="h-3 w-3" />
                                  )}
                                  {event.location}
                                </div>
                              )}
                              {event.attendees && event.attendees.length > 0 && (
                                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                  <Users className="h-3 w-3" />
                                  {event.attendees.map(a => a.name).join(", ")}
                                </div>
                              )}
                            </div>
                            <Badge variant="secondary">{getEventTypeLabel(event.type)}</Badge>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
                      <CalendarIcon className="h-12 w-12 mb-4" />
                      <p>今日暂无日程</p>
                      <Button
                        variant="link"
                        className="mt-2"
                        onClick={() => setIsAddEventOpen(true)}
                      >
                        添加日程
                      </Button>
                    </div>
                  )}
                </ScrollArea>
              </CardContent>
            </Card>
          </motion.div>

        {/* 移动端日程列表 */}
        <div className="lg:hidden mt-4">
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-base">
                    {selectedDate.getMonth() + 1}月{selectedDate.getDate()}日 日程
                  </CardTitle>
                  <CardDescription>
                    {selectedEvents.length > 0
                      ? `共 ${selectedEvents.length} 个日程`
                      : "暂无日程"}
                  </CardDescription>
                </div>
                {selectedEvents.length === 0 && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setIsAddEventOpen(true)}
                  >
                    添加日程
                  </Button>
                )}
              </div>
            </CardHeader>
            <CardContent className="p-0">
              {selectedEvents.length > 0 ? (
                <div className="divide-y">
                  {selectedEvents.map((event: CalendarEvent, index: number) => (
                    <motion.div
                      key={event.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="p-3 hover:bg-muted/50 transition-colors"
                    >
                      <div className="flex items-start gap-3">
                        <div
                          className={cn(
                            "w-0.5 h-full rounded-full mt-1 shrink-0",
                            getEventTypeColor(event.type)
                          )}
                        />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-1">
                            <h4 className="font-medium text-sm truncate">{event.title}</h4>
                            <Badge variant="secondary" className="text-xs shrink-0 ml-2">
                              {getEventTypeLabel(event.type)}
                            </Badge>
                          </div>
                          <div className="space-y-1">
                            <div className="flex items-center gap-1 text-xs text-muted-foreground">
                              <Clock className="h-3 w-3" />
                              {formatTime(event.start)} - {formatTime(event.end)}
                            </div>
                            {event.location && (
                              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                {event.location.includes("线上") ? (
                                  <Video className="h-3 w-3" />
                                ) : (
                                  <MapPin className="h-3 w-3" />
                                )}
                                <span className="truncate">{event.location}</span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-8 text-muted-foreground">
                  <CalendarIcon className="h-8 w-8 mb-2" />
                  <p className="text-sm">今日暂无日程</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
        </div>

        {/* 即将到来的日程 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.3 }}
        >
          <Card>
            <CardHeader>
              <CardTitle>即将到来</CardTitle>
              <CardDescription>未来的日程安排</CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                </div>
              ) : upcomingEvents.length > 0 ? (
                <div className="grid gap-3 sm:gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
                  {upcomingEvents.map((event: CalendarEvent, index: number) => (
                    <motion.div
                      key={event.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="rounded-lg border p-3 sm:p-4 hover:shadow-md transition-shadow"
                    >
                      <div className="flex items-center gap-2 mb-2">
                        <div className={cn("h-2 w-2 rounded-full", getEventTypeColor(event.type))} />
                        <Badge variant="outline" className="text-xs">
                          {getDateFromEvent(event)}
                        </Badge>
                      </div>
                      <h4 className="font-medium text-sm mb-1 truncate">{event.title}</h4>
                      <p className="text-xs sm:text-sm text-muted-foreground">
                        {formatTime(event.start)} - {formatTime(event.end)}
                      </p>
                      {event.location && (
                        <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                          <MapPin className="h-3 w-3" />
                          <span className="truncate">{event.location}</span>
                        </p>
                      )}
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-8 text-muted-foreground">
                  <CalendarIcon className="h-8 w-8 mb-2" />
                  <p className="text-sm">暂无即将到来的日程</p>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
    </div>
  )
}
