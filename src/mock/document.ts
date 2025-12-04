import Mock from "mockjs"

const folders = ["项目文档", "设计资源", "技术文档", "报表", "会议记录"]
const fileExtensions: Record<string, string[]> = {
  pdf: [".pdf"],
  doc: [".doc", ".docx"],
  image: [".png", ".jpg", ".jpeg"],
  spreadsheet: [".xls", ".xlsx"],
  code: [".md", ".js", ".ts"],
}

function getRandomExtension(type: string): string {
  const exts = fileExtensions[type] || [".txt"]
  return exts[Math.floor(Math.random() * exts.length)]
}

// 文档列表
Mock.mock("/api/documents", "get", () => {
  const types = ["pdf", "doc", "image", "spreadsheet", "code", "other"] as const
  return {
    code: 200,
    message: "success",
    data: Mock.mock({
      "list|15-30": [
        {
          id: "@guid",
          "name|1": function () {
            const type = types[Math.floor(Math.random() * types.length)]
            const name = Mock.Random.ctitle(3, 8)
            return name + getRandomExtension(type)
          },
          "type|1": types,
          "size|1024-104857600": 1,
          "folder|1": folders,
          content: "@cparagraph(3,10)",
          author: {
            id: "@guid",
            name: "@cname",
            avatar: "@image('40x40', '@color', '#fff', '@first')",
          },
          shared: "@boolean",
          "tags|1-3": ["@ctitle(2,4)"],
          views: "@integer(0, 1000)",
          createdAt: "@datetime('yyyy-MM-dd HH:mm:ss')",
          updatedAt: "@datetime('yyyy-MM-dd HH:mm:ss')",
        },
      ],
    }).list,
  }
})

// 获取单个文档
Mock.mock(/\/api\/documents\/[a-zA-Z0-9-]+/, "get", () => {
  return {
    code: 200,
    message: "success",
    data: Mock.mock({
      id: "@guid",
      name: "@ctitle(5,10).pdf",
      "type|1": ["pdf", "doc", "image", "spreadsheet", "code", "other"],
      "size|1024-104857600": 1,
      "folder|1": folders,
      content: "@cparagraph(10,30)",
      author: {
        id: "@guid",
        name: "@cname",
        avatar: "@image('40x40', '@color', '#fff', '@first')",
      },
      shared: "@boolean",
      "tags|1-3": ["@ctitle(2,4)"],
      views: "@integer(0, 1000)",
      createdAt: "@datetime('yyyy-MM-dd HH:mm:ss')",
      updatedAt: "@datetime('yyyy-MM-dd HH:mm:ss')",
      "collaborators|0-5": [
        {
          id: "@guid",
          name: "@cname",
          avatar: "@image('40x40', '@color', '#fff', '@first')",
        },
      ],
    }),
  }
})

// 创建文档
Mock.mock("/api/documents", "post", () => {
  return {
    code: 200,
    message: "创建成功",
    data: Mock.mock({
      id: "@guid",
      createdAt: "@datetime('yyyy-MM-dd HH:mm:ss')",
    }),
  }
})

// 更新文档
Mock.mock(/\/api\/documents\/[a-zA-Z0-9-]+/, "put", () => {
  return {
    code: 200,
    message: "更新成功",
    data: {
      updatedAt: new Date().toISOString(),
    },
  }
})

// 删除文档
Mock.mock(/\/api\/documents\/[a-zA-Z0-9-]+/, "delete", () => {
  return {
    code: 200,
    message: "删除成功",
    data: null,
  }
})

const documentMock = {}
export default documentMock
