import Mock from "mockjs"

interface NotificationItem {
  id: string
  type: string
  title: string
  content: string
  read: boolean
  time: string
  createdAt: string
  sender: {
    id: string
    name: string
    avatar: string
  }
}

// 通知列表
Mock.mock("/api/notifications", "get", () => {
  const notifications: NotificationItem[] = []
  const now = new Date()

  // 生成最近的通知（更真实的时间分布）
  const timeRanges = [
    { count: 5, maxHoursAgo: 1 },      // 最近1小时：5条
    { count: 8, maxHoursAgo: 24 },     // 最近24小时：8条
    { count: 12, maxHoursAgo: 72 },    // 最近3天：12条
    { count: 20, maxHoursAgo: 168 },   // 最近7天：20条
    { count: 15, maxHoursAgo: 720 },   // 最近30天：15条
  ]

  timeRanges.forEach(({ count, maxHoursAgo }) => {
    for (let i = 0; i < count; i++) {
      const hoursAgo = Mock.Random.integer(0, maxHoursAgo)
      const createdAt = new Date(now.getTime() - hoursAgo * 60 * 60 * 1000)

      notifications.push(Mock.mock({
        id: "@guid",
        "type|1": ["system", "message", "task", "alert", "user"],
        title: "@ctitle(5,15)",
        content: "@cparagraph(1,2)",
        "read|1": hoursAgo > 24 ? true : "@boolean(3, 7, false)", // 24小时前的多数已读
        time: function() {
          // 生成相对时间描述
          if (hoursAgo < 1) return "刚刚"
          if (hoursAgo < 24) return `${hoursAgo}小时前`
          const daysAgo = Math.floor(hoursAgo / 24)
          if (daysAgo === 1) return "昨天"
          if (daysAgo < 7) return `${daysAgo}天前`
          if (daysAgo < 30) return `${Math.floor(daysAgo / 7)}周前`
          return `${Math.floor(daysAgo / 30)}月前`
        },
        createdAt: createdAt.toISOString(),
        sender: {
          id: "@guid",
          name: "@cname",
          avatar: "@image('40x40', '@color', '#fff', '@first')",
        },
      }))
    }
  })

  // 按时间倒序排列（最新的在前）
  notifications.sort((a, b) =>
    new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  )

  return {
    code: 200,
    message: "success",
    data: notifications,
  }
})

// 未读通知数量
Mock.mock("/api/notifications/unread-count", "get", () => {
  return {
    code: 200,
    message: "success",
    data: {
      count: Mock.Random.integer(0, 20),
    },
  }
})

// 标记已读
Mock.mock(/\/api\/notifications\/[a-zA-Z0-9-]+\/read/, "put", () => {
  return {
    code: 200,
    message: "标记成功",
    data: null,
  }
})

// 标记全部已读
Mock.mock("/api/notifications/read-all", "put", () => {
  return {
    code: 200,
    message: "全部标记成功",
    data: null,
  }
})

// 删除通知
Mock.mock(/\/api\/notifications\/[a-zA-Z0-9-]+/, "delete", () => {
  return {
    code: 200,
    message: "删除成功",
    data: null,
  }
})

const notificationMock = {}
export default notificationMock
