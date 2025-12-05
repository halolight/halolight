# Halolight | Admin Pro

[![CI](https://github.com/dext7r/halolight/actions/workflows/ci.yml/badge.svg?branch=master)](https://github.com/dext7r/halolight/actions/workflows/ci.yml)
[![License](https://img.shields.io/badge/license-MIT-green.svg)](https://github.com/dext7r/halolight/blob/main/LICENSE)
[![Vercel](https://img.shields.io/badge/Vercel-Deployed-000000.svg?logo=vercel)](https://halolight.h7ml.cn)
[![pnpm](https://img.shields.io/badge/pnpm-10.23.0-ffa41c.svg)](https://pnpm.io)
[![Next.js](https://img.shields.io/badge/Next.js-14-%23000000.svg)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-%233178C6.svg)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-18-%2361DAFB.svg)](https://react.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-4-%2306B6D4.svg)](https://tailwindcss.com/)
[![Zustand](https://img.shields.io/badge/Zustand-5-%23E9D5FF.svg)](https://github.com/pmndrs/zustand)
[![React Query](https://img.shields.io/badge/React%20Query-5-%23FF4154.svg)](https://tanstack.com/query)

基于 Next.js 14 App Router 的现代化中文后台管理系统，内置可拖拽仪表盘、权限与状态管理、Server Actions、PWA 能力与可选 Mock 数据，适合快速搭建中后台应用。

- 在线预览：<https://halolight.h7ml.cn>
- GitHub：<https://github.com/dext7r/halolight>

## 功能亮点

- **Next.js 14 App Router + TypeScript**：支持 PWA、SEO 优化与全路由类型安全
- **Server Actions**：内置用户、文档、日历、文件等服务端操作
- **Tailwind CSS 4 + shadcn/ui**：原子化样式、Radix UI 原语、流畅主题切换（深色/浅色/系统）
- **增强交互体验**：framer-motion 动画、Command Menu 全局搜索、TabBar/KeepAlive、加载遮罩
- **状态与数据流**：React Query 5 + Axios 请求层，Zustand 5 管理认证/仪表盘/导航/UI 设置等全局状态
- **可配置仪表盘**：react-grid-layout 支持拖拽、添加/删除/重置、布局持久化到 localStorage
- **快捷设置面板**：快速切换主题、导航栏、TabBar、页脚等布局选项
- **页脚与加载控制**：独立页脚组件，导航加载遮罩显示开关
- **Mock.js 集成**：环境变量一键启用，无后端快速演示开发
- **完整 CI/CD**：GitHub Actions 自动化测试、构建、安全审计

## 目录结构

```
src/
├── actions/               # Server Actions（用户、文档、日历、文件操作）
├── app/
│   ├── (auth)/            # 认证页分组（login/register/reset，独立布局）
│   └── (dashboard)/       # 主业务分组（analytics/messages/users 等，共享布局）
├── components/
│   ├── ui/                # shadcn/ui 基础组件（Button/Dialog/Table 等）
│   ├── auth/              # 认证相关碎片组件
│   ├── layout/            # AdminLayout、Header、Sidebar、TabBar、CommandMenu
│   ├── dashboard/         # ConfigurableDashboard 与图表/统计卡片部件
│   └── data-table/        # 表格封装与工具
├── config/                # 集中配置（路由、权限映射）
├── hooks/                 # React Query hooks（按资源拆分：useUsers/useAuth 等）
├── lib/
│   ├── api/               # 服务定义、Axios client、API 类型
│   ├── store-factory.ts   # Zustand store 工厂函数
│   └── validations/       # 表单/数据校验 schema（zod）
├── mock/                  # Mock.js 数据拦截规则
├── providers/             # 全局 Provider 组合（Theme/Mock/Query/Auth/Permission/WebSocket/Error）
├── stores/                # Zustand 状态管理（auth、dashboardLayout、tabs、uiSettings）
├── types/                 # 通用 TypeScript 类型定义
└── __tests__/             # 测试文件（Vitest + React Testing Library）
```

## 快速开始

环境要求：Node.js >= 18、pnpm >= 8（项目锁定 pnpm@10.23.0）。

```bash
pnpm install
pnpm dev         # 本地开发，默认 http://localhost:3000
```

可选：启用 Mock 数据（仅前端模拟）

```bash
export NEXT_PUBLIC_MOCK=true
pnpm dev
```

生产构建与预览

```bash
pnpm build
pnpm start       # 使用构建产物启动
```

## 环境变量

| 变量名 | 说明 | 默认值 |
|--------|------|--------|
| `NEXT_PUBLIC_API_URL` | API 基础地址 | `/api` |
| `NEXT_PUBLIC_MOCK` | `true` 时启用 Mock.js 拦截 | `false` |
| `NEXT_PUBLIC_DEMO_EMAIL` | 演示账号邮箱 | - |
| `NEXT_PUBLIC_DEMO_PASSWORD` | 演示账号密码 | - |
| `NEXT_PUBLIC_SHOW_DEMO_HINT` | 显示演示账号提示 | `false` |
| `NEXT_PUBLIC_WS_URL` | WebSocket 服务器地址 | - |
| `NEXT_PUBLIC_APP_TITLE` | 应用标题 | `Admin Pro` |
| `NEXT_PUBLIC_BRAND_NAME` | 品牌名称 | `Halolight` |

在项目根目录创建 `.env.local` 文件来覆盖默认值：

```bash
# .env.local 示例
NEXT_PUBLIC_API_URL=https://api.halolight.h7ml.cn
NEXT_PUBLIC_MOCK=true
NEXT_PUBLIC_DEMO_EMAIL=admin@halolight.h7ml.cn
NEXT_PUBLIC_DEMO_PASSWORD=123456
```

## 常用脚本

```bash
pnpm dev          # 启动开发服务器（http://localhost:3000）
pnpm build        # 生产构建，输出到 .next 目录
pnpm start        # 使用构建产物启动生产服务
pnpm lint         # ESLint 检查代码规范
pnpm lint:fix     # 自动修复 ESLint 问题
pnpm type-check   # TypeScript 类型检查（不输出文件）
pnpm preview      # 完整构建并本地预览（build + start）
pnpm test         # 运行测试（watch 模式）
pnpm test:run     # 运行测试（单次执行）
pnpm test:coverage # 运行测试并生成覆盖率报告
```

## 代码规范

- **路径别名**：使用 `@/*` 别名指向 `./src/*`
- **ESLint 规则**：
  - 自动排序 import 语句（`simple-import-sort`）
  - 自动移除未使用的 import（`unused-imports/no-unused-imports`）
  - Next.js 官方规则集
- **Provider 层级**：`ThemeProvider → MockProvider → QueryProvider → AuthProvider → PermissionProvider → WebSocketProvider → ErrorProvider`
- **类型命名**：避免与全局类型冲突（如使用 `Document as DocumentType`）
- **组件范式**：优先使用服务端组件（Server Components），需要客户端交互时使用 `'use client'` 指令

## CI/CD

项目配置了 GitHub Actions 自动化工作流 (`.github/workflows/ci.yml`)：

| Job | 说明 |
|-----|------|
| `lint` | ESLint 检查 + TypeScript 类型检查 |
| `test` | 单元测试 + 覆盖率报告上传到 Codecov |
| `build` | Next.js 生产构建 + 构建产物缓存 |
| `security` | 依赖安全审计（pnpm audit） |
| `dependency-review` | PR 依赖变更检查（仅 Pull Request） |

## 部署

### Vercel（推荐）

点击一键部署到 Vercel：

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/dext7r/halolight)

### 自托管部署

1. **环境准备**：确保 Node.js >= 18 和 pnpm >= 8 已安装
2. **配置环境变量**：复制 `.env.example` 为 `.env.local` 并设置必要变量
3. **构建项目**：
   ```bash
   pnpm install
   pnpm build
   ```
4. **启动服务**：
   ```bash
   pnpm start  # 生产模式启动
   ```
5. **进程守护**（可选）：使用 PM2、systemd 或 Docker 运行

### Docker 部署

```dockerfile
FROM node:20-alpine AS builder
WORKDIR /app
RUN npm install -g pnpm
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile
COPY . .
RUN pnpm build

FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public ./public
EXPOSE 3000
CMD ["node", "server.js"]
```

构建并运行：

```bash
docker build -t halolight .
docker run -p 3000:3000 halolight
```

## 浏览器支持

- Chrome >= 90
- Firefox >= 88
- Safari >= 14
- Edge >= 90

## 贡献

欢迎提交 Issue 和 Pull Request 来帮助改进项目！

1. Fork 本仓库
2. 创建特性分支 (`git checkout -b feature/amazing-feature`)
3. 提交更改 (`git commit -m 'feat: add amazing feature'`)
4. 推送到分支 (`git push origin feature/amazing-feature`)
5. 创建 Pull Request

## 相关链接

- [在线预览](https://halolight.h7ml.cn)
- [GitHub 仓库](https://github.com/dext7r/halolight)
- [问题反馈](https://github.com/dext7r/halolight/issues)

## 许可证

[MIT](LICENSE)
