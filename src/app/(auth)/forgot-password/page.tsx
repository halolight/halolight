"use client"

import { motion } from "framer-motion"
import { ArrowLeft, CheckCircle2, Loader2, Mail, Shield, Sparkles } from "lucide-react"
import Link from "next/link"
import * as React from "react"

import { AuthShell } from "@/components/auth/auth-shell"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { InputClear } from "@/components/ui/input-clear"
import { useTitle } from "@/hooks"
import { useAuthStore } from "@/stores/auth-store"

const forgotBackground = {
  gridSize: 26,
  halos: [
    {
      from: "from-sky-400/30",
      to: "to-cyan-400/30",
      className: "absolute -top-36 -left-32 w-96 h-96 rounded-full blur-3xl",
      animate: { scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] },
      transition: { duration: 8, repeat: Infinity, ease: "easeInOut" as const },
    },
    {
      from: "from-emerald-400/25",
      to: "to-teal-400/25",
      className: "absolute top-1/3 -right-24 w-80 h-80 rounded-full blur-3xl",
      animate: { scale: [1.15, 0.95, 1.15], opacity: [0.35, 0.55, 0.35] },
      transition: { duration: 10, repeat: Infinity, ease: "easeInOut" as const },
    },
  ],
}

export default function ForgotPasswordPage() {
  const { forgotPassword, isLoading, error, clearError } = useAuthStore()
  useTitle("找回密码")

  const [email, setEmail] = React.useState("")
  const [isSubmitted, setIsSubmitted] = React.useState(false)
  const [localError, setLocalError] = React.useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLocalError("")

    if (!email) {
      setLocalError("请输入邮箱地址")
      return
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setLocalError("请输入有效的邮箱地址")
      return
    }

    try {
      await forgotPassword(email)
      setIsSubmitted(true)
    } catch {
      // 错误已在 store 中处理
    }
  }

  React.useEffect(() => {
    clearError()
  }, [clearError])

  return (
    <AuthShell
      leftGradientClassName="bg-gradient-to-br from-sky-600 via-cyan-600 to-emerald-600"
      backgroundOptions={forgotBackground}
      floatingDots={{ count: 5, colorClassName: "bg-white/25" }}
      left={
        <motion.div
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.8 }}
        >
          <div className="flex items-center gap-3 mb-12">
            <div className="relative h-14 w-14 rounded-2xl bg-white/10 backdrop-blur-xl border border-white/20 flex items-center justify-center shadow-2xl">
              <Sparkles className="h-7 w-7" />
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-white/20 to-transparent" />
            </div>
            <div>
              <h2 className="text-2xl font-bold tracking-tight">Admin Pro</h2>
              <p className="text-xs text-white/60">企业级管理系统</p>
            </div>
          </div>

          <h1 className="text-5xl xl:text-6xl font-bold mb-6 leading-tight">找回密码</h1>
          <p className="text-lg text-white/70 max-w-md leading-relaxed mb-12">
            别担心，我们会帮助您重新获得账户访问权限。只需几个简单的步骤即可完成。
          </p>

          <div className="space-y-4">
            {[
              { icon: "📧", text: "输入注册邮箱地址" },
              { icon: "🔗", text: "接收安全重置链接" },
              { icon: "🔐", text: "设置新的安全密码" },
              { icon: "✅", text: "重新登录您的账户" },
            ].map((item, index) => (
              <motion.div
                key={item.text}
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.6 + index * 0.1 }}
                className="flex items-center gap-3 group"
              >
                <div className="shrink-0 w-10 h-10 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center text-xl group-hover:scale-110 transition-transform">
                  {item.icon}
                </div>
                <span className="text-white/90">{item.text}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>
      }
      right={
        <motion.div
          initial={{ y: 40, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
          className="w-full max-w-md"
        >
          <div className="mb-5 lg:hidden flex items-center justify-between rounded-2xl border bg-white/80 p-3 shadow-lg backdrop-blur">
            <div>
              <p className="text-sm text-muted-foreground">重置密码</p>
              <p className="text-lg font-semibold text-foreground">找回您的账户</p>
            </div>
            <div className="h-10 w-10 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold">
              A
            </div>
          </div>

          <Card className="border border-border/50 shadow-2xl backdrop-blur-xl bg-card/85 overflow-hidden">
            {!isSubmitted ? (
              <>
                <div className="h-1 bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600" />

                <CardHeader className="space-y-1 text-center px-4 sm:px-6 pt-7 sm:pt-9 pb-5 sm:pb-6">
                  <motion.div
                    initial={{ scale: 0.5, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                    className="mx-auto relative mb-5"
                  >
                    <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-3xl bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center shadow-2xl">
                      <Mail className="h-10 w-10 sm:h-12 sm:w-12 text-white" />
                      <motion.div
                        className="absolute inset-0 rounded-3xl bg-gradient-to-br from-white/20 to-transparent"
                        animate={{ opacity: [0.5, 0.8, 0.5] }}
                        transition={{ duration: 2, repeat: Infinity }}
                      />
                    </div>
                    <motion.div
                      className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-yellow-400 flex items-center justify-center shadow-lg"
                      animate={{ rotate: [0, 10, -10, 0] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      <Sparkles className="h-4 w-4 text-yellow-900" />
                    </motion.div>
                  </motion.div>

                  <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.3 }}
                  >
                    <CardTitle className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-3">
                      忘记密码？
                    </CardTitle>
                    <CardDescription className="text-sm sm:text-base leading-relaxed">
                      别担心，输入您的邮箱地址
                      <br />
                      我们将发送密码重置链接
                    </CardDescription>
                  </motion.div>
                </CardHeader>

                <CardContent className="px-4 sm:px-6 pb-7">
                  <form onSubmit={handleSubmit} className="space-y-4">
                    {(error || localError) && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="p-3 rounded-xl bg-destructive/10 border border-destructive/20 text-destructive text-xs sm:text-sm"
                      >
                        {error || localError}
                      </motion.div>
                    )}

                    <motion.div
                      initial={{ y: 20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ delay: 0.4 }}
                      className="space-y-2"
                    >
                      <label className="text-xs font-medium text-muted-foreground">邮箱地址</label>
                      <div className="relative group">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors z-10" />
                        <InputClear
                          type="email"
                          placeholder="your@email.com"
                          className="pl-10 h-12 text-sm border-border/50 focus:border-primary/50 rounded-xl transition-all"
                          value={email}
                          onChange={setEmail}
                        />
                      </div>
                    </motion.div>

                    <motion.div
                      initial={{ y: 20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ delay: 0.5 }}
                    >
                      <Button
                        type="submit"
                        className="w-full h-12 text-sm font-medium bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
                        disabled={isLoading}
                      >
                        {isLoading ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            发送中...
                          </>
                        ) : (
                          <>
                            发送重置链接
                            <motion.span
                              className="ml-2"
                              animate={{ x: [0, 4, 0] }}
                              transition={{ duration: 1.5, repeat: Infinity }}
                            >
                              →
                            </motion.span>
                          </>
                        )}
                      </Button>
                    </motion.div>

                    <motion.div
                      initial={{ y: 20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ delay: 0.6 }}
                      className="flex items-start gap-3 p-3 rounded-xl bg-blue-50/50 dark:bg-blue-950/20 border border-blue-200/50 dark:border-blue-800/50"
                    >
                      <Shield className="h-5 w-5 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
                      <div className="text-xs text-muted-foreground leading-relaxed">
                        <p className="font-medium text-foreground mb-1">安全提示</p>
                        重置链接将在15分钟后过期，请及时查收邮件并完成密码重置。
                      </div>
                    </motion.div>
                  </form>
                </CardContent>
              </>
            ) : (
              <>
                <div className="h-1 bg-gradient-to-r from-green-500 via-emerald-500 to-teal-500" />

                <CardHeader className="space-y-1 text-center px-4 sm:px-6 pt-7 sm:pt-9 pb-5 sm:pb-6">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 200, damping: 15 }}
                    className="mx-auto relative mb-5"
                  >
                    <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-3xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center shadow-2xl">
                      <CheckCircle2 className="h-10 w-10 sm:h-12 sm:w-12 text-white" />
                      <motion.div
                        className="absolute inset-0 rounded-3xl"
                        animate={{
                          boxShadow: [
                            "0 0 0 0 rgba(34, 197, 94, 0.4)",
                            "0 0 0 20px rgba(34, 197, 94, 0)",
                          ],
                        }}
                        transition={{ duration: 1.5, repeat: Infinity }}
                      />
                    </div>
                  </motion.div>

                  <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.2 }}
                  >
                    <CardTitle className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent mb-3">
                      邮件已发送
                    </CardTitle>
                    <CardDescription className="text-sm leading-relaxed">
                      我们已向 <span className="font-semibold text-foreground">{email}</span> 发送了密码重置链接
                    </CardDescription>
                  </motion.div>
                </CardHeader>

                <CardContent className="space-y-4 px-4 sm:px-6 pb-7">
                  <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.3 }}
                    className="space-y-4"
                  >
                    <div className="p-4 rounded-xl bg-blue-50/50 dark:bg-blue-950/20 border border-blue-200/50 dark:border-blue-800/50">
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        📧 请检查您的邮箱并点击链接重置密码
                        <br />
                        📁 如果没有收到，请检查垃圾邮件文件夹
                        <br />
                        ⏰ 链接将在15分钟后过期
                      </p>
                    </div>

                    <Button
                      variant="outline"
                      className="w-full h-11 text-sm border-border/50 hover:border-primary/50 hover:bg-primary/5 rounded-xl transition-all"
                      onClick={() => {
                        setIsSubmitted(false)
                        setEmail("")
                      }}
                    >
                      重新发送
                    </Button>
                  </motion.div>
                </CardContent>
              </>
            )}

            <CardFooter className="px-4 sm:px-6 pb-5 sm:pb-7 pt-2">
              <Link
                href="/login"
                className="flex items-center justify-center gap-2 text-sm text-muted-foreground hover:text-primary font-medium transition-colors w-full group"
              >
                <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
                返回登录
              </Link>
            </CardFooter>
          </Card>
        </motion.div>
      }
    />
  )
}
