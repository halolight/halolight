"use client"

import { motion } from "framer-motion"
import { ArrowLeft, Check, CheckCircle2, Eye, EyeOff, Loader2, Lock, ShieldCheck, Sparkles, X } from "lucide-react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import * as React from "react"

import { AuthShell } from "@/components/auth/auth-shell"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { useTitle } from "@/hooks"
import { getPasswordStrength, passwordRules } from "@/lib/auth/password-rules"
import { cn } from "@/lib/utils"
import { useAuthStore } from "@/stores/auth-store"

const resetBackground = {
  gridSize: 24,
  halos: [
    {
      from: "from-indigo-400/30",
      to: "to-violet-400/30",
      className: "absolute -top-36 -left-32 w-96 h-96 rounded-full blur-3xl",
      animate: { scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] },
      transition: { duration: 8, repeat: Infinity, ease: "easeInOut" as const },
    },
    {
      from: "from-fuchsia-400/25",
      to: "to-pink-400/25",
      className: "absolute top-1/3 -right-24 w-80 h-80 rounded-full blur-3xl",
      animate: { scale: [1.15, 0.95, 1.15], opacity: [0.35, 0.55, 0.35] },
      transition: { duration: 10, repeat: Infinity, ease: "easeInOut" as const },
    },
    {
      from: "from-blue-400/20",
      to: "to-cyan-400/20",
      className: "absolute -bottom-32 left-1/4 w-96 h-96 rounded-full blur-3xl",
      animate: { scale: [1, 1.25, 1], opacity: [0.25, 0.45, 0.25] },
      transition: { duration: 12, repeat: Infinity, ease: "easeInOut" as const },
    },
  ],
}

export default function ResetPasswordPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const token = searchParams.get("token")

  const { resetPassword, isLoading, error, clearError } = useAuthStore()
  useTitle("重置密码")

  const [formData, setFormData] = React.useState({
    password: "",
    confirmPassword: "",
  })
  const [showPassword, setShowPassword] = React.useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = React.useState(false)
  const [localError, setLocalError] = React.useState("")
  const [isSuccess, setIsSuccess] = React.useState(false)

  const passwordStrength = React.useMemo(
    () => getPasswordStrength(formData.password),
    [formData.password]
  )

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLocalError("")

    if (!token) {
      setLocalError("无效的重置链接")
      return
    }

    if (!formData.password || !formData.confirmPassword) {
      setLocalError("请填写所有字段")
      return
    }

    if (formData.password !== formData.confirmPassword) {
      setLocalError("两次密码输入不一致")
      return
    }

    if (passwordStrength < 3) {
      setLocalError("密码强度不足")
      return
    }

    try {
      await resetPassword(token, formData.password)
      setIsSuccess(true)
    } catch {
      // 错误已在 store 中处理
    }
  }

  React.useEffect(() => {
    clearError()
  }, [clearError])

  if (!token) {
    return (
      <AuthShell
        showLeft={false}
        rightPaddingClassName="p-3 sm:p-4 lg:px-10 lg:py-6"
        right={
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="w-full max-w-md"
          >
            <Card className="border border-border/50 shadow-2xl backdrop-blur-xl bg-card/80 overflow-hidden">
              <div className="h-1 bg-gradient-to-r from-red-500 via-orange-500 to-yellow-500" />

              <CardHeader className="space-y-1 text-center px-4 sm:px-6 pt-7 sm:pt-9 pb-5 sm:pb-6">
                <motion.div
                  initial={{ scale: 0.5, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                  className="mx-auto relative mb-5"
                >
                  <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-3xl bg-gradient-to-br from-red-500 to-orange-500 flex items-center justify-center shadow-2xl">
                    <X className="h-10 w-10 sm:h-12 sm:w-12 text-white" />
                  </div>
                </motion.div>

                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.3 }}
                >
                  <CardTitle className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-red-600 to-orange-600 bg-clip-text text-transparent mb-3">
                    无效链接
                  </CardTitle>
                  <CardDescription className="text-sm leading-relaxed">
                    密码重置链接无效或已过期
                  </CardDescription>
                </motion.div>
              </CardHeader>

              <CardContent className="space-y-4 px-4 sm:px-6 pb-7">
                <p className="text-xs sm:text-sm text-muted-foreground text-center">
                  请重新请求密码重置链接，或联系客服获取帮助。
                </p>
                <div className="flex flex-col gap-3">
                  <Button
                    asChild
                    className="w-full h-12 text-sm font-medium bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
                  >
                    <Link href="/forgot-password">重新发送链接</Link>
                  </Button>
                  <Button
                    asChild
                    variant="outline"
                    className="w-full h-12 text-sm border-border/50 hover:border-primary/50 hover:bg-primary/5 rounded-xl transition-all"
                  >
                    <Link href="/login">返回登录</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        }
      />
    )
  }

  return (
    <AuthShell
      leftGradientClassName="bg-gradient-to-br from-indigo-700 via-violet-700 to-fuchsia-700" rightPaddingClassName="p-3 sm:p-4 lg:px-10 lg:py-6"
      backgroundOptions={resetBackground}
      floatingDots={{ count: 7, colorClassName: "bg-white/25" }}
      left={
        <motion.div
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.8 }}
        >
          <motion.div
            className="flex items-center gap-3 mb-12"
            whileHover={{ scale: 1.02 }}
            transition={{ type: "spring", stiffness: 400 }}
          >
            <div className="relative h-14 w-14 rounded-2xl bg-white/10 backdrop-blur-xl border border-white/20 flex items-center justify-center shadow-2xl">
              <Sparkles className="h-7 w-7" />
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-white/20 to-transparent" />
            </div>
            <div>
              <h2 className="text-2xl font-bold tracking-tight">Admin Pro</h2>
              <p className="text-xs text-white/60">企业级管理系统</p>
            </div>
          </motion.div>

          <h1 className="text-5xl xl:text-6xl font-bold mb-6 leading-tight">
            重置密码
            <motion.span
              animate={{ opacity: [1, 0.5, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="inline-block ml-2"
            >
              🔐
            </motion.span>
          </h1>
          <p className="text-lg text-white/70 max-w-md leading-relaxed mb-12">
            设置一个安全的新密码，保护您的账户安全。请确保密码足够复杂。
          </p>

          <div className="space-y-4">
            {[
              { icon: "🔒", text: "使用至少 8 个字符" },
              { icon: "🔤", text: "混合大小写字母" },
              { icon: "🔢", text: "包含数字和符号" },
              { icon: "🛡️", text: "避免使用个人信息" },
            ].map((item, index) => (
              <motion.div
                key={item.text}
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.6 + index * 0.1 }}
                className="flex items-center gap-3 group"
              >
                <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center text-xl group-hover:scale-110 transition-transform">
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
          <motion.div
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="mb-6 lg:hidden text-center"
          >
            <div className="inline-flex items-center gap-3 mb-3 px-6 py-3 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-600 shadow-xl">
              <Sparkles className="h-6 w-6 text-white" />
              <span className="text-xl font-bold text-white">Admin Pro</span>
            </div>
            <p className="text-sm text-muted-foreground">设置您的新密码</p>
          </motion.div>

          <Card className="border border-border/50 shadow-2xl backdrop-blur-xl bg-card/80 overflow-hidden">
            {!isSuccess ? (
              <>
                <div className="h-1 bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600" />

                <CardHeader className="space-y-1 text-center px-4 sm:px-6 pt-7 sm:pt-9 pb-5 sm:pb-6">
                  <motion.div
                    initial={{ scale: 0.5, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                    className="mx-auto relative mb-6"
                  >
                    <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-3xl bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center shadow-2xl">
                      <ShieldCheck className="h-10 w-10 sm:h-12 sm:w-12 text-white" />
                      <motion.div
                        className="absolute inset-0 rounded-3xl bg-gradient-to-br from-white/20 to-transparent"
                        animate={{ opacity: [0.5, 0.8, 0.5] }}
                        transition={{ duration: 2, repeat: Infinity }}
                      />
                    </div>
                  </motion.div>

                  <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.3 }}
                  >
                    <CardTitle className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-3">
                      设置新密码
                    </CardTitle>
                    <CardDescription className="text-sm leading-relaxed">
                      请设置您的新密码，确保密码足够安全
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
                      <label className="text-xs font-medium text-muted-foreground">新密码</label>
                      <div className="relative group">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                        <Input
                          type={showPassword ? "text" : "password"}
                          placeholder="••••••••"
                          className="pl-10 pr-10 h-12 text-sm border-border/50 focus:border-primary/50 rounded-xl transition-all"
                          value={formData.password}
                          onChange={(e) =>
                            setFormData({ ...formData, password: e.target.value })
                          }
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                        >
                          {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                      </div>

                      {formData.password && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          className="space-y-2"
                        >
                          <div className="flex gap-1">
                            {[1, 2, 3, 4].map((level) => (
                              <motion.div
                                key={level}
                                initial={{ scaleX: 0 }}
                                animate={{ scaleX: 1 }}
                                transition={{ delay: level * 0.1 }}
                                className={cn(
                                  "h-1.5 flex-1 rounded-full transition-colors origin-left",
                                  passwordStrength >= level
                                    ? passwordStrength <= 1
                                      ? "bg-red-500"
                                      : passwordStrength <= 2
                                      ? "bg-orange-500"
                                      : passwordStrength <= 3
                                      ? "bg-yellow-500"
                                      : "bg-green-500"
                                    : "bg-muted"
                                )}
                              />
                            ))}
                          </div>
                          <div className="grid grid-cols-2 gap-1">
                            {passwordRules.map((rule, index) => (
                              <motion.div
                                key={rule.label}
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: index * 0.05 }}
                                className={cn(
                                  "flex items-center gap-1 text-xs",
                                  rule.test(formData.password)
                                    ? "text-green-500"
                                    : "text-muted-foreground"
                                )}
                              >
                                {rule.test(formData.password) ? (
                                  <Check className="h-3 w-3" />
                                ) : (
                                  <X className="h-3 w-3" />
                                )}
                                {rule.label}
                              </motion.div>
                            ))}
                          </div>
                        </motion.div>
                      )}
                    </motion.div>

                    <motion.div
                      initial={{ y: 20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ delay: 0.5 }}
                      className="space-y-2"
                    >
                      <label className="text-xs font-medium text-muted-foreground">确认新密码</label>
                      <div className="relative group">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                        <Input
                          type={showConfirmPassword ? "text" : "password"}
                          placeholder="••••••••"
                          className="pl-10 pr-10 h-12 text-sm border-border/50 focus:border-primary/50 rounded-xl transition-all"
                          value={formData.confirmPassword}
                          onChange={(e) =>
                            setFormData({ ...formData, confirmPassword: e.target.value })
                          }
                        />
                        <button
                          type="button"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                        >
                          {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                      </div>

                      {formData.confirmPassword && (
                        <motion.div
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          className={cn(
                            "flex items-center gap-1 text-xs",
                            formData.password === formData.confirmPassword
                              ? "text-green-500"
                              : "text-destructive"
                          )}
                        >
                          {formData.password === formData.confirmPassword ? (
                            <>
                              <Check className="h-3 w-3" />
                              密码匹配
                            </>
                          ) : (
                            <>
                              <X className="h-3 w-3" />
                              密码不匹配
                            </>
                          )}
                        </motion.div>
                      )}
                    </motion.div>

                    <motion.div
                      initial={{ y: 20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ delay: 0.6 }}
                    >
                      <Button
                        type="submit"
                        className="w-full h-12 text-sm font-medium bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
                        disabled={isLoading}
                      >
                        {isLoading ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            重置中...
                          </>
                        ) : (
                          <>
                            重置密码
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
                  </form>
                </CardContent>
              </>
            ) : (
              <>
                <div className="h-1 bg-gradient-to-r from-green-500 via-emerald-500 to-teal-500" />

                <CardHeader className="space-y-1 text-center px-4 sm:px-6 pt-8 sm:pt-10 pb-6">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 200, damping: 15 }}
                    className="mx-auto relative mb-6"
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
                      密码重置成功
                    </CardTitle>
                    <CardDescription className="text-sm leading-relaxed">
                      您的密码已成功重置
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
                    <div className="p-4 rounded-xl bg-green-50/50 dark:bg-green-950/20 border border-green-200/50 dark:border-green-800/50">
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        ✅ 您的密码已成功更新
                        <br />
                        🔐 现在可以使用新密码登录您的账户
                      </p>
                    </div>

                    <Button
                      className="w-full h-12 text-sm font-medium bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
                      onClick={() => router.push("/login")}
                    >
                      前往登录
                      <motion.span
                        className="ml-2"
                        animate={{ x: [0, 4, 0] }}
                        transition={{ duration: 1.5, repeat: Infinity }}
                      >
                        →
                      </motion.span>
                    </Button>
                  </motion.div>
                </CardContent>
              </>
            )}

            <CardFooter className="px-4 sm:px-6 pb-6 pt-2">
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
