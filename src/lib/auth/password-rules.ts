export const passwordRules = [
  { label: "至少 8 个字符", test: (p: string) => p.length >= 8 },
  { label: "包含大写字母", test: (p: string) => /[A-Z]/.test(p) },
  { label: "包含小写字母", test: (p: string) => /[a-z]/.test(p) },
  { label: "包含数字", test: (p: string) => /[0-9]/.test(p) },
]

export function getPasswordStrength(password: string) {
  return passwordRules.filter((rule) => rule.test(password)).length
}
