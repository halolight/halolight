import Mock from "mockjs"

// 文件类型配置
const fileTypeConfig = {
  folder: { extensions: [""], mime: "folder" },
  image: { extensions: [".jpg", ".png", ".gif", ".webp"], mime: "image/jpeg" },
  video: { extensions: [".mp4", ".mov", ".avi"], mime: "video/mp4" },
  audio: { extensions: [".mp3", ".wav", ".flac"], mime: "audio/mpeg" },
  archive: { extensions: [".zip", ".rar", ".7z"], mime: "application/zip" },
  document: { extensions: [".pdf", ".doc", ".docx", ".xls", ".xlsx"], mime: "application/pdf" },
}

type FileType = keyof typeof fileTypeConfig

// 生成单个文件
function generateFile() {
  const types: FileType[] = ["folder", "image", "video", "audio", "archive", "document"]
  const type = Mock.Random.pick(types) as FileType
  const config = fileTypeConfig[type]
  const ext = Mock.Random.pick(config.extensions)
  const name = Mock.Random.ctitle(2, 6) + ext

  return {
    id: Mock.Random.guid(),
    name,
    type,
    size: type === "folder" ? null : Mock.Random.integer(1024, 1024 * 1024 * 100),
    items: type === "folder" ? Mock.Random.integer(0, 50) : null,
    path: "/我的文件",
    mimeType: config.mime,
    thumbnail: type === "image" ? Mock.Random.image("100x100") : null,
    createdAt: Mock.Random.datetime("yyyy-MM-dd HH:mm:ss"),
    updatedAt: Mock.Random.datetime("yyyy-MM-dd HH:mm:ss"),
  }
}

// 文件列表
Mock.mock("/api/files", "get", () => {
  const count = Mock.Random.integer(20, 40)
  const list = Array.from({ length: count }, generateFile)

  return {
    code: 200,
    message: "success",
    data: list,
  }
})

// 存储空间信息
Mock.mock("/api/files/storage", "get", () => {
  return {
    code: 200,
    message: "success",
    data: {
      used: Mock.Random.integer(10737418240, 107374182400),
      total: 107374182400,
      breakdown: {
        images: Mock.Random.integer(1073741824, 21474836480),
        videos: Mock.Random.integer(5368709120, 32212254720),
        audio: Mock.Random.integer(536870912, 5368709120),
        documents: Mock.Random.integer(536870912, 10737418240),
        archives: Mock.Random.integer(268435456, 5368709120),
        others: Mock.Random.integer(268435456, 2147483648),
      },
    },
  }
})

// 上传文件
Mock.mock("/api/files/upload", "post", () => {
  return {
    code: 200,
    message: "上传成功",
    data: {
      id: Mock.Random.guid(),
      name: Mock.Random.ctitle(3, 6) + ".pdf",
      size: Mock.Random.integer(1024, 10485760),
      url: Mock.Random.url(),
      createdAt: Mock.Random.datetime("yyyy-MM-dd HH:mm:ss"),
    },
  }
})

// 创建文件夹
Mock.mock("/api/files/folder", "post", () => {
  return {
    code: 200,
    message: "创建成功",
    data: {
      id: Mock.Random.guid(),
      name: Mock.Random.ctitle(2, 4),
      type: "folder",
      createdAt: Mock.Random.datetime("yyyy-MM-dd HH:mm:ss"),
    },
  }
})

// 删除文件
Mock.mock(/\/api\/files\/[a-zA-Z0-9-]+$/, "delete", () => {
  return {
    code: 200,
    message: "删除成功",
    data: null,
  }
})

// 移动文件
Mock.mock(/\/api\/files\/[a-zA-Z0-9-]+\/move/, "put", () => {
  return {
    code: 200,
    message: "移动成功",
    data: null,
  }
})

// 重命名文件
Mock.mock(/\/api\/files\/[a-zA-Z0-9-]+\/rename/, "put", () => {
  return {
    code: 200,
    message: "重命名成功",
    data: null,
  }
})

const fileMock = {}
export default fileMock
