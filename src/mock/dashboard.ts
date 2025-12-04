import Mock from "mockjs"

// 仪表盘统计数据
Mock.mock("/api/dashboard/stats", "get", () => {
  return {
    code: 200,
    message: "success",
    data: Mock.mock({
      totalUsers: "@integer(1000, 50000)",
      totalRevenue: "@integer(100000, 9999999)",
      totalOrders: "@integer(500, 10000)",
      conversionRate: "@float(1, 10, 1, 2)",
      userGrowth: "@float(-5, 20, 1, 2)",
      revenueGrowth: "@float(-10, 30, 1, 2)",
      orderGrowth: "@float(-5, 25, 1, 2)",
      rateGrowth: "@float(-2, 5, 1, 2)",
    }),
  }
})

// 图表数据 - 访问趋势
Mock.mock("/api/dashboard/visits", "get", () => {
  const data = Mock.mock({
    "list|30": [
      {
        date: function () {
          const d = new Date()
          d.setDate(d.getDate() - Math.floor(Math.random() * 30))
          return d.toISOString().split("T")[0]
        },
        visits: "@integer(1000, 8000)",
        uniqueVisitors: "@integer(500, 5000)",
        pageViews: "@integer(3000, 20000)",
      },
    ],
  })
  // 按日期排序
  data.list.sort((a: { date: string }, b: { date: string }) =>
    new Date(a.date).getTime() - new Date(b.date).getTime()
  )
  return {
    code: 200,
    message: "success",
    data: data.list,
  }
})

// 图表数据 - 销售趋势
Mock.mock("/api/dashboard/sales", "get", () => {
  const months = ["1月", "2月", "3月", "4月", "5月", "6月", "7月", "8月", "9月", "10月", "11月", "12月"]
  const data = months.map((month) => ({
    month,
    sales: Mock.Random.integer(50000, 200000),
    profit: Mock.Random.integer(10000, 50000),
  }))
  return {
    code: 200,
    message: "success",
    data,
  }
})

// 热门产品
Mock.mock("/api/dashboard/products", "get", () => {
  return {
    code: 200,
    message: "success",
    data: Mock.mock({
      "list|10": [
        {
          id: "@guid",
          name: "@ctitle(3,8)",
          category: "@ctitle(2,4)",
          price: "@float(10, 1000, 2, 2)",
          sales: "@integer(100, 5000)",
          stock: "@integer(0, 500)",
          image: "@image('80x80', '@color', '#fff', '@first')",
        },
      ],
    }).list,
  }
})

// 最近订单
Mock.mock("/api/dashboard/orders", "get", () => {
  return {
    code: 200,
    message: "success",
    data: Mock.mock({
      "list|10": [
        {
          id: "@guid",
          orderNo: /^ORD[0-9]{10}$/,
          customer: "@cname",
          amount: "@float(100, 10000, 2, 2)",
          "status|1": ["pending", "processing", "shipped", "delivered", "cancelled"],
          createdAt: "@datetime('yyyy-MM-dd HH:mm:ss')",
        },
      ],
    }).list,
  }
})

// 用户活动
Mock.mock("/api/dashboard/activities", "get", () => {
  return {
    code: 200,
    message: "success",
    data: Mock.mock({
      "list|20": [
        {
          id: "@guid",
          user: "@cname",
          avatar: "@image('40x40', '@color', '#fff', '@first')",
          "action|1": ["登录系统", "创建订单", "更新资料", "上传文件", "发表评论", "分享内容"],
          target: "@ctitle(3,6)",
          time: "@datetime('yyyy-MM-dd HH:mm:ss')",
        },
      ],
    }).list,
  }
})

// 系统概览
Mock.mock("/api/dashboard/overview", "get", () => {
  return {
    code: 200,
    message: "success",
    data: Mock.mock({
      cpu: "@integer(20, 90)",
      memory: "@integer(30, 85)",
      disk: "@integer(40, 75)",
      network: "@integer(10, 60)",
      uptime: "@integer(86400, 8640000)",
      requests: "@integer(10000, 100000)",
      errors: "@integer(0, 100)",
      responseTime: "@integer(50, 500)",
    }),
  }
})

// 流量来源占比
Mock.mock("/api/dashboard/pie", "get", () => {
  return {
    code: 200,
    message: "success",
    data: Mock.mock({
      sources: [
        { name: "直接访问", value: "@integer(200, 800)" },
        { name: "搜索引擎", value: "@integer(150, 700)" },
        { name: "社交媒体", value: "@integer(80, 400)" },
        { name: "邮件营销", value: "@integer(50, 200)" },
      ],
    }).sources,
  }
})

// 待办任务
Mock.mock("/api/dashboard/tasks", "get", () => {
  return {
    code: 200,
    message: "success",
    data: Mock.mock({
      "list|5-8": [
        {
          id: "@guid",
          title: "@ctitle(4, 10)",
          "status|1": ["pending", "in_progress", "done"],
        },
      ],
    }).list,
  }
})

const dashboardMock = {}
export default dashboardMock
