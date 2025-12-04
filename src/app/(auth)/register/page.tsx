"use client"

import { motion } from "framer-motion"
import {
  Check,
  Chrome,
  Eye,
  EyeOff,
  Github,
  Loader2,
  Lock,
  Mail,
  MessageCircle,
  Sparkles,
  User,
  X,
} from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import * as React from "react"

import { AuthShell } from "@/components/auth/auth-shell"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { InputClear } from "@/components/ui/input-clear"
import { Separator } from "@/components/ui/separator"
import { useTitle } from "@/hooks"
import { getPasswordStrength, passwordRules } from "@/lib/auth/password-rules"
import { cn } from "@/lib/utils"
import { useAuthStore } from "@/stores/auth-store"

const registerBackground = {
  gridSize: 28,
  halos: [
    {
      from: "from-purple-400/30",
      to: "to-pink-400/30",
      className: "absolute -top-36 -left-32 w-96 h-96 rounded-full blur-3xl",
      animate: { scale: [1, 1.15, 1], opacity: [0.35, 0.55, 0.35] },
      transition: { duration: 8, repeat: Infinity, ease: "easeInOut" as const },
    },
    {
      from: "from-fuchsia-400/25",
      to: "to-amber-400/25",
      className: "absolute top-1/3 -right-24 w-80 h-80 rounded-full blur-3xl",
      animate: { scale: [1.1, 0.95, 1.1], opacity: [0.35, 0.6, 0.35] },
      transition: { duration: 10, repeat: Infinity, ease: "easeInOut" as const },
    },
    {
      from: "from-indigo-400/20",
      to: "to-cyan-400/20",
      className: "absolute -bottom-32 left-1/4 w-96 h-96 rounded-full blur-3xl",
      animate: { scale: [1, 1.25, 1], opacity: [0.25, 0.45, 0.25] },
      transition: { duration: 12, repeat: Infinity, ease: "easeInOut" as const },
    },
  ],
}

export default function RegisterPage() {
  const router = useRouter()
  const { register, isLoading, error, clearError } = useAuthStore()
  useTitle("注册")

  const [formData, setFormData] = React.useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  })
  const [showPassword, setShowPassword] = React.useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = React.useState(false)
  const [localError, setLocalError] = React.useState("")
  const [agreedToTerms, setAgreedToTerms] = React.useState(false)

  const passwordStrength = React.useMemo(
    () => getPasswordStrength(formData.password),
    [formData.password]
  )

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLocalError("")

    if (!formData.name || !formData.email || !formData.password) {
      setLocalError("请填写所有必填字段")
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

    if (!agreedToTerms) {
      setLocalError("请同意服务条款和隐私政策")
      return
    }

    try {
      await register(formData)
      router.push("/")
    } catch {
      // 错误已在 store 中处理
    }
  }

  const handleSocialLogin = (provider: string) => {
    console.log(`使用 ${provider} 注册`)
  }

  React.useEffect(() => {
    clearError()
  }, [clearError])

  return (
    <AuthShell
      leftGradientClassName="bg-gradient-to-br from-purple-600 via-fuchsia-600 to-indigo-600"
      backgroundOptions={registerBackground}
      floatingDots={{ count: 8, colorClassName: "bg-white/25" }}
      rightPaddingClassName="p-3 sm:p-4 lg:px-10 lg:py-6"
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
            创建账户
            <motion.span
              animate={{ opacity: [1, 0.5, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="inline-block ml-2"
            >
              ✨
            </motion.span>
          </h1>
          <p className="text-lg text-white/70 max-w-md leading-relaxed mb-12">
            加入我们，开始体验强大的后台管理功能，提升您的工作效率。
          </p>

          <div className="space-y-4">
            {[
              { icon: "🎁", text: "完全免费的基础功能" },
              { icon: "📊", text: "实时数据分析和报告" },
              { icon: "👥", text: "团队协作和权限管理" },
              { icon: "💬", text: "7x24 小时技术支持" },
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
          className="w-full max-w-md my-1"
        >
          <motion.div
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="mb-4 lg:hidden text-center"
          >
            <div className="inline-flex items-center gap-3 mb-3 px-6 py-3 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-600 shadow-xl">
              <Sparkles className="h-6 w-6 text-white" />
              <span className="text-xl font-bold text-white">Admin Pro</span>
            </div>
            <p className="text-sm text-muted-foreground">创建账户，开始您的旅程</p>
          </motion.div>

          <Card className="border border-border/50 shadow-2xl backdrop-blur-xl bg-card/80 overflow-hidden">
            <div className="h-1 bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600" />

            <CardHeader className="space-y-1 text-center pb-2 sm:pb-4 pt-3 sm:pt-6">
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.4 }}
              >
                <CardTitle className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                  创建账户
                </CardTitle>
                <CardDescription className="text-xs sm:text-sm mt-2">
                  填写以下信息完成注册
                </CardDescription>
              </motion.div>
            </CardHeader>
            <CardContent className="space-y-2 sm:space-y-4 px-4 sm:px-6">
              <div className="grid grid-cols-3 gap-2 sm:gap-3">
                {[
                  { icon: Github, name: "github", label: "GitHub" },
                  { icon: Chrome, name: "google", label: "Google" },
                  { icon: MessageCircle, name: "wechat", label: "微信" },
                ].map((provider, index) => (
                  <motion.div
                    key={provider.name}
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.5 + index * 0.1 }}
                  >
                    <Button
                      variant="outline"
                      className="w-full h-11 sm:h-12 border-border/50 hover:border-primary/50 hover:bg-primary/5 transition-all duration-300 group"
                      onClick={() => handleSocialLogin(provider.name)}
                    >
                      <provider.icon className="h-5 w-5 group-hover:scale-110 transition-transform" />
                    </Button>
                  </motion.div>
                ))}
              </div>

              <div className="relative py-3">
                <div className="absolute inset-0 flex items-center">
                  <Separator className="w-full" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-card px-3 text-muted-foreground font-medium">
                    或使用邮箱注册
                  </span>
                </div>
              </div>

                <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
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
                  transition={{ delay: 0.6 }}
                  className="space-y-2"
                >
                  <label className="text-xs font-medium text-muted-foreground">您的姓名</label>
                  <div className="relative group">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors z-10" />
                    <InputClear
                      type="text"
                      placeholder="张三"
                      className="pl-10 h-11 sm:h-12 text-sm border-border/50 focus:border-primary/50 rounded-xl transition-all"
                      value={formData.name}
                      onChange={(value) =>
                        setFormData({ ...formData, name: value })
                      }
                    />
                  </div>
                </motion.div>

                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.65 }}
                  className="space-y-2"
                >
                  <label className="text-xs font-medium text-muted-foreground">邮箱地址</label>
                  <div className="relative group">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors z-10" />
                    <InputClear
                      type="email"
                      placeholder="your@email.com"
                      className="pl-10 h-11 sm:h-12 text-sm border-border/50 focus:border-primary/50 rounded-xl transition-all"
                      value={formData.email}
                      onChange={(value) =>
                        setFormData({ ...formData, email: value })
                      }
                    />
                  </div>
                </motion.div>

                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.7 }}
                  className="space-y-2"
                >
                  <label className="text-xs font-medium text-muted-foreground">设置密码</label>
                  <div className="relative group">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                    <Input
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      className="pl-10 pr-10 h-11 sm:h-12 text-sm border-border/50 focus:border-primary/50 rounded-xl transition-all"
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
                      {showPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                  </div>

                  {formData.password && (
                    <div className="space-y-2">
                      <div className="flex gap-1">
                        {[1, 2, 3, 4].map((level) => (
                          <div
                            key={level}
                            className={cn(
                              "h-1.5 flex-1 rounded-full transition-colors",
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
                        {passwordRules.map((rule) => (
                          <div
                            key={rule.label}
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
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </motion.div>

                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.75 }}
                  className="space-y-2"
                >
                  <label className="text-xs font-medium text-muted-foreground">确认密码</label>
                  <div className="relative group">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                    <Input
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="••••••••"
                      className="pl-10 pr-10 h-11 sm:h-12 text-sm border-border/50 focus:border-primary/50 rounded-xl transition-all"
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
                      {showConfirmPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                </motion.div>

                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.8 }}
                >
                  <label className="flex items-start gap-2 cursor-pointer group text-xs sm:text-sm">
                    <input
                      type="checkbox"
                      checked={agreedToTerms}
                      onChange={(e) => setAgreedToTerms(e.target.checked)}
                      className="rounded border-gray-300 mt-0.5 w-4 h-4 text-primary focus:ring-primary"
                    />
                    <span className="text-muted-foreground group-hover:text-foreground transition-colors">
                      我已阅读并同意{" "}
                      <Link href="/terms" className="text-primary hover:text-primary/80 font-medium transition-colors">
                        服务条款
                      </Link>{" "}
                      和{" "}
                      <Link href="/privacy" className="text-primary hover:text-primary/80 font-medium transition-colors">
                        隐私政策
                      </Link>
                    </span>
                  </label>
                </motion.div>

                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.85 }}
                >
                  <Button
                    type="submit"
                    className="w-full h-11 sm:h-12 text-sm font-medium bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        注册中...
                      </>
                    ) : (
                      <>
                        创建账户
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
          <CardFooter className="flex flex-col space-y-3 sm:space-y-4 px-4 sm:px-6 pb-4 sm:pb-7 pt-2">
              <div className="relative w-full">
                <div className="absolute inset-0 flex items-center">
                  <Separator className="w-full" />
                </div>
              </div>
              <p className="text-xs sm:text-sm text-muted-foreground text-center">
                已有账户？{" "}
                <Link href="/login" className="text-primary hover:text-primary/80 font-semibold transition-colors">
                  立即登录
                </Link>
              </p>
            </CardFooter>
          </Card>
        </motion.div>
      }
    />
  )
}
