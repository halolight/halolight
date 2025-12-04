import Mock from "mockjs"

// 日历事件列表
Mock.mock("/api/calendar/events", "get", () => {
  const events = []
  const now = new Date()
  const currentYear = now.getFullYear()
  const currentMonth = now.getMonth()
  const currentDay = now.getDate()

  // 生成过去几天的事件（3-5个）
  for (let i = 0; i < 5; i++) {
    const daysAgo = Mock.Random.integer(1, 7)
    const startDate = new Date(currentYear, currentMonth, currentDay - daysAgo, Mock.Random.integer(9, 17))
    const endDate = new Date(startDate)
    endDate.setHours(startDate.getHours() + Mock.Random.integer(1, 3))

    events.push(Mock.mock({
      id: "@guid",
      title: "@ctitle(3,10)",
      description: "@cparagraph(1,2)",
      start: startDate.toISOString(),
      end: endDate.toISOString(),
      "type|1": ["meeting", "task", "reminder", "holiday"],
      "color|1": ["#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6"],
      allDay: "@boolean(1, 9, false)",
      location: "@city(true)",
      "attendees|0-5": [
        {
          id: "@guid",
          name: "@cname",
          avatar: "@image('40x40', '@color', '#fff', '@first')",
          "status|1": ["accepted", "declined", "pending"],
        },
      ],
      createdAt: "@datetime('yyyy-MM-dd HH:mm:ss')",
    }))
  }

  // 生成今天的事件（2-4个）
  for (let i = 0; i < Mock.Random.integer(2, 4); i++) {
    const hour = Mock.Random.integer(9, 20)
    const startDate = new Date(currentYear, currentMonth, currentDay, hour)
    const endDate = new Date(startDate)
    endDate.setHours(startDate.getHours() + Mock.Random.integer(1, 2))

    events.push(Mock.mock({
      id: "@guid",
      title: "@ctitle(3,10)",
      description: "@cparagraph(1,2)",
      start: startDate.toISOString(),
      end: endDate.toISOString(),
      "type|1": ["meeting", "task", "reminder"],
      "color|1": ["#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6"],
      allDay: false,
      location: "@city(true)",
      "attendees|1-3": [
        {
          id: "@guid",
          name: "@cname",
          avatar: "@image('40x40', '@color', '#fff', '@first')",
          "status|1": ["accepted", "declined", "pending"],
        },
      ],
      createdAt: "@datetime('yyyy-MM-dd HH:mm:ss')",
    }))
  }

  // 生成未来几天的事件（8-12个）- 确保有"即将到来"的数据
  for (let i = 0; i < Mock.Random.integer(8, 12); i++) {
    const daysAhead = Mock.Random.integer(1, 14)
    const startDate = new Date(currentYear, currentMonth, currentDay + daysAhead, Mock.Random.integer(9, 17))
    const endDate = new Date(startDate)
    endDate.setHours(startDate.getHours() + Mock.Random.integer(1, 3))

    events.push(Mock.mock({
      id: "@guid",
      title: "@ctitle(3,10)",
      description: "@cparagraph(1,2)",
      start: startDate.toISOString(),
      end: endDate.toISOString(),
      "type|1": ["meeting", "task", "reminder", "holiday"],
      "color|1": ["#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6"],
      allDay: "@boolean(1, 9, false)",
      location: "@city(true)",
      "attendees|0-5": [
        {
          id: "@guid",
          name: "@cname",
          avatar: "@image('40x40', '@color', '#fff', '@first')",
          "status|1": ["accepted", "declined", "pending"],
        },
      ],
      createdAt: "@datetime('yyyy-MM-dd HH:mm:ss')",
    }))
  }

  return {
    code: 200,
    message: "success",
    data: events,
  }
})

// 获取单个事件
Mock.mock(/\/api\/calendar\/events\/[a-zA-Z0-9-]+/, "get", () => {
  return {
    code: 200,
    message: "success",
    data: Mock.mock({
      id: "@guid",
      title: "@ctitle(3,10)",
      description: "@cparagraph(2,5)",
      start: "@datetime('yyyy-MM-ddTHH:mm:ss')",
      end: "@datetime('yyyy-MM-ddTHH:mm:ss')",
      "type|1": ["meeting", "task", "reminder", "holiday"],
      "color|1": ["#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6"],
      allDay: "@boolean(1, 9, false)",
      location: "@city(true)",
      "attendees|0-5": [
        {
          id: "@guid",
          name: "@cname",
          avatar: "@image('40x40', '@color', '#fff', '@first')",
          "status|1": ["accepted", "declined", "pending"],
        },
      ],
      "reminders|0-3": ["@integer(5, 60)分钟前"],
      createdAt: "@datetime('yyyy-MM-dd HH:mm:ss')",
    }),
  }
})

// 创建事件
Mock.mock("/api/calendar/events", "post", () => {
  return {
    code: 200,
    message: "创建成功",
    data: Mock.mock({
      id: "@guid",
      createdAt: "@datetime('yyyy-MM-dd HH:mm:ss')",
    }),
  }
})

// 更新事件
Mock.mock(/\/api\/calendar\/events\/[a-zA-Z0-9-]+/, "put", () => {
  return {
    code: 200,
    message: "更新成功",
    data: {
      updatedAt: new Date().toISOString(),
    },
  }
})

// 删除事件
Mock.mock(/\/api\/calendar\/events\/[a-zA-Z0-9-]+/, "delete", () => {
  return {
    code: 200,
    message: "删除成功",
    data: null,
  }
})

const calendarMock = {}
export default calendarMock
