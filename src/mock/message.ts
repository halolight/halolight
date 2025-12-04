import Mock from "mockjs"

// 生成会话数据的辅助函数
function generateConversation() {
  const type = Mock.Random.pick(["private", "group"]) as "private" | "group"
  const name = type === "group" ? Mock.Random.ctitle(3, 6) + "群" : Mock.Random.cname()

  return {
    id: Mock.Random.guid(),
    type,
    name,
    avatar: Mock.Random.image("50x50", Mock.Random.color(), "#fff", Mock.Random.first()),
    lastMessage: Mock.Random.cparagraph(1),
    lastMessageTime: Mock.Random.datetime("yyyy-MM-dd HH:mm:ss"),
    unreadCount: Mock.Random.integer(0, 10),
    online: Mock.Random.boolean(),
    members: Array.from({ length: Mock.Random.integer(2, 10) }, () => ({
      id: Mock.Random.guid(),
      name: Mock.Random.cname(),
      avatar: Mock.Random.image("40x40", Mock.Random.color(), "#fff", Mock.Random.first()),
    })),
  }
}

// 生成消息数据的辅助函数
function generateMessage() {
  const type = Mock.Random.pick(["text", "image", "file"]) as "text" | "image" | "file"
  let content: string
  if (type === "text") {
    content = Mock.Random.cparagraph(1, 3)
  } else if (type === "image") {
    content = Mock.Random.image("200x150")
  } else {
    content = Mock.Random.ctitle(3, 8) + ".pdf"
  }

  return {
    id: Mock.Random.guid(),
    conversationId: Mock.Random.guid(),
    sender: {
      id: Mock.Random.guid(),
      name: Mock.Random.cname(),
      avatar: Mock.Random.image("40x40", Mock.Random.color(), "#fff", Mock.Random.first()),
    },
    type,
    content,
    createdAt: Mock.Random.datetime("yyyy-MM-dd HH:mm:ss"),
    read: Mock.Random.boolean(),
  }
}

// 消息会话列表
Mock.mock("/api/messages/conversations", "get", () => {
  const count = Mock.Random.integer(10, 20)
  return {
    code: 200,
    message: "success",
    data: Array.from({ length: count }, generateConversation),
  }
})

// 消息历史
Mock.mock(/\/api\/messages\/[a-zA-Z0-9-]+/, "get", () => {
  const count = Mock.Random.integer(20, 50)
  return {
    code: 200,
    message: "success",
    data: Array.from({ length: count }, generateMessage),
  }
})

// 发送消息
Mock.mock("/api/messages/send", "post", () => {
  return {
    code: 200,
    message: "发送成功",
    data: Mock.mock({
      id: "@guid",
      createdAt: "@datetime('yyyy-MM-dd HH:mm:ss')",
    }),
  }
})

// 标记会话已读
Mock.mock(/\/api\/messages\/[a-zA-Z0-9-]+\/read/, "put", () => {
  return {
    code: 200,
    message: "success",
    data: null,
  }
})

// 删除会话
Mock.mock(/\/api\/messages\/[a-zA-Z0-9-]+$/, "delete", () => {
  return {
    code: 200,
    message: "success",
    data: null,
  }
})

const messageMock = {}
export default messageMock
