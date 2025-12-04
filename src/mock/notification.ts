import Mock from "mockjs"

// 通知列表
Mock.mock("/api/notifications", "get", () => {
  return {
    code: 200,
    message: "success",
    data: Mock.mock({
      "list|20-50": [
        {
          id: "@guid",
          "type|1": ["system", "message", "task", "alert"],
          title: "@ctitle(5,15)",
          content: "@cparagraph(1,2)",
          read: "@boolean",
          createdAt: "@datetime('yyyy-MM-dd HH:mm:ss')",
          sender: {
            id: "@guid",
            name: "@cname",
            avatar: "@image('40x40', '@color', '#fff', '@first')",
          },
        },
      ],
    }).list,
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
