import "./globals.css";

import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import Script from "next/script";

import { AppProviders } from "@/providers/app-providers";

// 使用本地字体，避免依赖 Google Fonts（大陆访问受限）
// 字体文件位于 public/fonts 目录
// 只预加载 Regular 字重，其他按需加载以减少首屏资源
const inter = localFont({
  src: [
    {
      path: "../../public/fonts/Inter-Regular.woff2",
      weight: "400",
      style: "normal",
    },
    {
      path: "../../public/fonts/Inter-Medium.woff2",
      weight: "500",
      style: "normal",
    },
    {
      path: "../../public/fonts/Inter-SemiBold.woff2",
      weight: "600",
      style: "normal",
    },
    {
      path: "../../public/fonts/Inter-Bold.woff2",
      weight: "700",
      style: "normal",
    },
  ],
  variable: "--font-geist-sans",
  display: "swap",
  preload: false, // 禁用自动预加载，按需加载字体
});

const jetbrainsMono = localFont({
  src: [
    {
      path: "../../public/fonts/JetBrainsMono-Regular.woff2",
      weight: "400",
      style: "normal",
    },
    {
      path: "../../public/fonts/JetBrainsMono-Medium.woff2",
      weight: "500",
      style: "normal",
    },
    {
      path: "../../public/fonts/JetBrainsMono-Bold.woff2",
      weight: "700",
      style: "normal",
    },
  ],
  variable: "--font-geist-mono",
  display: "swap",
  preload: false, // 代码字体按需加载
});

// Google Analytics ID（通过环境变量配置，大陆部署可留空禁用）
const GA_ID = process.env.NEXT_PUBLIC_GA_ID;

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#000000" },
  ],
};

export const metadata: Metadata = {
  title: "Admin Pro - 后台管理系统",
  description: "现代化的后台管理系统",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Admin Pro",
  },
  formatDetection: {
    telephone: false,
  },
  icons: {
    icon: [
      { url: "/icons/icon-192x192.png", sizes: "192x192", type: "image/png" },
      { url: "/icons/icon-512x512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: [
      { url: "/icons/icon-152x152.png", sizes: "152x152", type: "image/png" },
    ],
  },
};

// 全局关闭静态预渲染，避免客户端上下文依赖在构建时执行
export const dynamic = "force-dynamic";
export const revalidate = 0;

// Cloudflare Pages 需要 Edge Runtime
export const runtime = "edge";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN" suppressHydrationWarning>
      <head>
        {/* 51.la 图片统计（无 JS 依赖，兼容性最好） */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="https://web.51.la/go?id=L1NaKSoU1jvMh9mE"
          alt=""
          width={0}
          height={0}
          style={{ display: "none" }}
        />
        {/* Google Analytics（通过环境变量控制，大陆部署可禁用） */}
        {/* 使用 lazyOnload 避免预加载警告，不影响核心功能 */}
        {GA_ID && (
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
              strategy="lazyOnload"
            />
            <Script id="google-analytics" strategy="lazyOnload">
              {`window.dataLayer = window.dataLayer || [];function gtag(){dataLayer.push(arguments);}gtag('js', new Date());gtag('config', '${GA_ID}');`}
            </Script>
          </>
        )}
      </head>
      <body
        className={`${inter.variable} ${jetbrainsMono.variable} antialiased`}
      >
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  );
}
