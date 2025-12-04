# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 项目概述

这是一个基于 Next.js 14 App Router 的中文后台管理系统 (Admin Pro / Halolight)，使用 TypeScript、Tailwind CSS 4、shadcn/ui 和 framer-motion 构建。

## 技术栈速览

- **框架**: Next.js 14 App Router + TypeScript
- **样式**: Tailwind CSS 4、shadcn/ui (Radix UI)、lucide-react
- **动画/交互**: framer-motion、react-grid-layout（可拖拽仪表盘）
- **数据**: React Query 5、Zustand 5（全局/仪表盘布局状态）、recharts（图表）
- **Mock**: Mock.js（`NEXT_PUBLIC_MOCK=true` 时启用）
- **构建工具**: pnpm 10、ESLint 9（simple-import-sort / unused-imports）
- **测试**: Vitest + React Testing Library

## 常用命令

```bash
pnpm dev          # 启动开发服务器
pnpm build        # 生产构建
pnpm lint         # ESLint 检查
pnpm lint:fix     # ESLint 自动修复
pnpm type-check   # TypeScript 类型检查
pnpm test         # 运行测试（watch 模式）
pnpm test:run     # 运行测试（单次）
pnpm test:coverage # 运行测试并生成覆盖率报告
```

## 架构

### Provider 层级结构 (src/providers/app-providers.tsx)

```
ThemeProvider → MockProvider → QueryProvider → AuthProvider → PermissionProvider → WebSocketProvider → ErrorProvider
```

### 核心目录结构

```
src/
├── actions/           # Server Actions（用户、文档、日历、文件操作）
├── app/
│   ├── (auth)/        # 认证页分组（login/register/forgot-password/reset-password）
│   └── (dashboard)/   # 主业务分组（analytics/calendar/documents/files/messages/...）
├── components/
│   ├── ui/            # shadcn/ui 基础组件
│   ├── auth/          # 认证相关碎片组件
│   ├── layout/        # AdminLayout、Header、Sidebar、TabBar、CommandMenu
│   ├── dashboard/     # ConfigurableDashboard 与图表/统计卡片部件
│   └── data-table/    # 表格封装与工具
├── config/            # 集中配置（路由、权限映射）
├── hooks/             # React Query hooks（按资源拆分）
├── lib/
│   ├── api/           # 服务定义、类型、client
│   ├── store-factory.ts # Zustand store 工厂函数
│   └── validations/   # 表单/数据校验 schema（zod）
├── mock/              # Mock.js 数据拦截规则
├── providers/         # 全局 Provider 组合
├── stores/            # Zustand 状态管理（auth、dashboardLayout、tabs、uiSettings）
├── types/             # 通用 TypeScript 类型定义
└── __tests__/         # 测试文件
```

### 数据流模式

1. **API 请求**: `src/lib/api/services.ts` 定义服务 → `src/hooks/` 封装 React Query hooks → 页面组件使用
2. **Server Actions**: `src/actions/` 提供服务端操作，支持表单提交和数据变更
3. **Mock 数据**: 设置 `NEXT_PUBLIC_MOCK=true` 后，MockProvider 会拦截 fetch 请求返回模拟数据
4. **状态管理**: Zustand stores 用于认证和仪表盘布局等全局状态

### React Query 缓存策略

在 `src/providers/query-provider.tsx` 中定义了分级缓存配置：

- **static**: 静态数据（30分钟 stale，1小时 gc）
- **dashboard**: 仪表盘数据（5分钟 stale，30分钟 gc）
- **user**: 用户数据（2分钟 stale，10分钟 gc）
- **realtime**: 实时数据（30秒 stale，5分钟 gc）

### 代码规范

- ESLint 配置自动移除未使用的 imports (`unused-imports/no-unused-imports`)
- Import 语句自动排序 (`simple-import-sort`)
- 使用 `@/*` 路径别名指向 `./src/*`
- 注意避免与全局类型冲突，如使用 `Document as DocumentType` 导入
- 组件范式：优先使用服务端组件，需要客户端交互时使用 `'use client'` 指令

### UI 组件

- 基于 Radix UI 原语构建的 shadcn/ui 组件
- framer-motion 用于动画效果
- lucide-react 图标库
- recharts 用于图表
- react-grid-layout 用于可配置仪表盘

## 环境变量

| 变量名 | 说明 | 默认值 |
|--------|------|--------|
| `NEXT_PUBLIC_API_URL` | API 基础 URL | `/api` |
| `NEXT_PUBLIC_MOCK` | 启用 Mock.js 数据拦截 | `false` |
| `NEXT_PUBLIC_DEMO_EMAIL` | 演示账号邮箱 | - |
| `NEXT_PUBLIC_DEMO_PASSWORD` | 演示账号密码 | - |
| `NEXT_PUBLIC_SHOW_DEMO_HINT` | 显示演示账号提示 | `false` |
| `NEXT_PUBLIC_WS_URL` | WebSocket 服务器地址 | - |
| `NEXT_PUBLIC_APP_TITLE` | 应用标题 | `Admin Pro` |
| `NEXT_PUBLIC_BRAND_NAME` | 品牌名称 | `Halolight` |
| `NEXT_PUBLIC_GA_ID` | Google Analytics ID（大陆部署留空禁用） | - |

## 安全特性

- **CSP 安全头**: 在 `src/middleware.ts` 中配置 Content-Security-Policy
- **无硬编码凭证**: 演示账号通过环境变量配置
- **HttpOnly Cookie**: 认证 token 使用 HttpOnly cookie 存储

## CI/CD

GitHub Actions 工作流 (`.github/workflows/ci.yml`) 包含：

- **lint**: ESLint + TypeScript 类型检查
- **test**: 单元测试 + 覆盖率报告
- **build**: Next.js 生产构建
- **security**: 依赖安全审计
- **dependency-review**: PR 依赖变更检查

## 新增功能开发指南

### 添加新页面

1. 在 `src/app/(dashboard)/` 下创建页面目录
2. 在 `src/config/routes.ts` 中添加路由配置和权限映射
3. 在 `src/components/layout/sidebar.tsx` 的菜单项中添加导航

### 添加新的 Server Action

1. 在 `src/actions/` 下创建或修改对应的 action 文件
2. 在 `src/actions/index.ts` 中导出
3. 在组件中使用 `"use server"` 标记的函数

### 添加新的 API 服务

1. 在 `src/lib/api/types.ts` 中定义类型
2. 在 `src/lib/api/services.ts` 中添加服务方法
3. 在 `src/hooks/` 下创建 React Query hook
4. 如需 Mock 数据，在 `src/mock/` 中添加相应数据
