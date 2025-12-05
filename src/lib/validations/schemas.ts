import { z } from "zod"

// 登录表单验证
export const loginSchema = z.object({
  email: z
    .string()
    .min(1, "请输入邮箱")
    .email("请输入有效的邮箱地址"),
  password: z
    .string()
    .min(1, "请输入密码")
    .min(6, "密码至少6个字符"),
  remember: z.boolean().optional(),
})

export type LoginFormData = z.infer<typeof loginSchema>

// 注册表单验证
export const registerSchema = z
  .object({
    name: z
      .string()
      .min(1, "请输入姓名")
      .min(2, "姓名至少2个字符")
      .max(20, "姓名最多20个字符"),
    email: z
      .string()
      .min(1, "请输入邮箱")
      .email("请输入有效的邮箱地址"),
    password: z
      .string()
      .min(1, "请输入密码")
      .min(6, "密码至少6个字符")
      .regex(
        /^(?=.*[a-zA-Z])(?=.*\d)/,
        "密码必须包含字母和数字"
      ),
    confirmPassword: z.string().min(1, "请确认密码"),
    agreement: z.boolean().refine((val) => val === true, {
      message: "请阅读并同意服务条款",
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "两次输入的密码不一致",
    path: ["confirmPassword"],
  })

export type RegisterFormData = z.infer<typeof registerSchema>

// 忘记密码表单验证
export const forgotPasswordSchema = z.object({
  email: z
    .string()
    .min(1, "请输入邮箱")
    .email("请输入有效的邮箱地址"),
})

export type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>

// 重置密码表单验证
export const resetPasswordSchema = z
  .object({
    password: z
      .string()
      .min(1, "请输入新密码")
      .min(6, "密码至少6个字符")
      .regex(
        /^(?=.*[a-zA-Z])(?=.*\d)/,
        "密码必须包含字母和数字"
      ),
    confirmPassword: z.string().min(1, "请确认密码"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "两次输入的密码不一致",
    path: ["confirmPassword"],
  })

export type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>

// 用户表单验证
export const userSchema = z.object({
  name: z
    .string()
    .min(1, "请输入姓名")
    .min(2, "姓名至少2个字符")
    .max(20, "姓名最多20个字符"),
  email: z
    .string()
    .min(1, "请输入邮箱")
    .email("请输入有效的邮箱地址"),
  phone: z
    .string()
    .optional()
    .refine(
      (val) => !val || /^1[3-9]\d{9}$/.test(val.replace(/-/g, "")),
      "请输入有效的手机号"
    ),
  role: z.string().min(1, "请选择角色"),
  status: z.enum(["active", "inactive", "suspended"], {
    message: "请选择状态",
  }),
})

export type UserFormData = z.infer<typeof userSchema>

// 个人资料表单验证
export const profileSchema = z.object({
  name: z
    .string()
    .min(1, "请输入姓名")
    .min(2, "姓名至少2个字符")
    .max(20, "姓名最多20个字符"),
  email: z
    .string()
    .min(1, "请输入邮箱")
    .email("请输入有效的邮箱地址"),
  phone: z
    .string()
    .optional()
    .refine(
      (val) => !val || /^1[3-9]\d{9}$/.test(val.replace(/-/g, "")),
      "请输入有效的手机号"
    ),
  company: z.string().optional(),
  address: z.string().optional(),
  bio: z.string().max(200, "简介最多200个字符").optional(),
})

export type ProfileFormData = z.infer<typeof profileSchema>

// 修改密码表单验证
export const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, "请输入当前密码"),
    newPassword: z
      .string()
      .min(1, "请输入新密码")
      .min(6, "密码至少6个字符")
      .regex(
        /^(?=.*[a-zA-Z])(?=.*\d)/,
        "密码必须包含字母和数字"
      ),
    confirmPassword: z.string().min(1, "请确认新密码"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "两次输入的密码不一致",
    path: ["confirmPassword"],
  })
  .refine((data) => data.currentPassword !== data.newPassword, {
    message: "新密码不能与当前密码相同",
    path: ["newPassword"],
  })

export type ChangePasswordFormData = z.infer<typeof changePasswordSchema>

// 日历事件表单验证
export const calendarEventSchema = z.object({
  title: z
    .string()
    .min(1, "请输入标题")
    .max(50, "标题最多50个字符"),
  description: z.string().max(500, "描述最多500个字符").optional(),
  start: z.string().min(1, "请选择开始时间"),
  end: z.string().min(1, "请选择结束时间"),
  allDay: z.boolean().optional(),
  color: z.string().optional(),
})

export type CalendarEventFormData = z.infer<typeof calendarEventSchema>

// 文档表单验证
export const documentSchema = z.object({
  title: z
    .string()
    .min(1, "请输入标题")
    .max(100, "标题最多100个字符"),
  type: z.enum(["document", "spreadsheet", "presentation"], {
    message: "请选择类型",
  }),
  content: z.string().optional(),
  shared: z.boolean().optional(),
})

export type DocumentFormData = z.infer<typeof documentSchema>
