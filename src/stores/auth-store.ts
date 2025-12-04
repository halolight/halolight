import Cookies from "js-cookie"
import { create } from "zustand"
import { createJSONStorage, persist } from "zustand/middleware"

import {
  AccountWithToken,
  authApi,
  LoginRequest,
  RegisterRequest,
} from "@/lib/api/client"

interface AuthState {
  user: AccountWithToken | null
  accounts: AccountWithToken[]
  activeAccountId: string | null
  token: string | null
  isLoading: boolean
  isAuthenticated: boolean
  error: string | null

  // Actions
  login: (data: LoginRequest) => Promise<void>
  register: (data: RegisterRequest) => Promise<void>
  logout: () => Promise<void>
  switchAccount: (accountId: string) => Promise<void>
  loadAccounts: () => Promise<void>
  forgotPassword: (email: string) => Promise<void>
  resetPassword: (token: string, password: string) => Promise<void>
  checkAuth: () => Promise<void>
  clearError: () => void
}

const cookieOptions = (days = 1) => ({
  expires: days,
  secure: process.env.NODE_ENV === "production",
  sameSite: "strict" as const,
})

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      accounts: [],
      activeAccountId: null,
      token: null,
      isLoading: false,
      isAuthenticated: false,
      error: null,

      login: async (data: LoginRequest) => {
        set({ isLoading: true, error: null })
        try {
          const response = await authApi.login(data)

          Cookies.set("token", response.token, cookieOptions(data.remember ? 7 : 1))

          set({
            user: response.user,
            token: response.token,
            accounts: response.accounts,
            activeAccountId: response.user.id,
            isAuthenticated: true,
            isLoading: false,
          })
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : "登录失败",
            isLoading: false,
          })
          throw error
        }
      },

      register: async (data: RegisterRequest) => {
        set({ isLoading: true, error: null })
        try {
          const response = await authApi.register(data)

          Cookies.set("token", response.token, cookieOptions())

          set({
            user: response.user,
            token: response.token,
            accounts: response.accounts,
            activeAccountId: response.user.id,
            isAuthenticated: true,
            isLoading: false,
          })
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : "注册失败",
            isLoading: false,
          })
          throw error
        }
      },

      logout: async () => {
        set({ isLoading: true })
        try {
          await authApi.logout()
        } finally {
          Cookies.remove("token")
          set({
            user: null,
            token: null,
            accounts: [],
            activeAccountId: null,
            isAuthenticated: false,
            isLoading: false,
          })
        }
      },

      switchAccount: async (accountId: string) => {
        const account = get().accounts.find((item) => item.id === accountId)
        if (!account) {
          set({ error: "账号不存在" })
          throw new Error("账号不存在")
        }

        Cookies.set("token", account.token, cookieOptions(7))
        set({
          user: account,
          token: account.token,
          activeAccountId: account.id,
          isAuthenticated: true,
          error: null,
        })
      },

      loadAccounts: async () => {
        set({ isLoading: true })
        try {
          const accounts = await authApi.getAccounts()
          const { activeAccountId, token, user } = get()
          const nextUser =
            accounts.find((acc) => acc.id === activeAccountId) ||
            accounts.find((acc) => acc.token === token) ||
            user ||
            null

          if (nextUser) {
            Cookies.set("token", nextUser.token, cookieOptions(7))
          } else {
            Cookies.remove("token")
          }

          set({
            accounts,
            user: nextUser,
            activeAccountId: nextUser?.id ?? null,
            token: nextUser?.token ?? null,
            isAuthenticated: Boolean(nextUser),
            isLoading: false,
          })
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : "加载账号失败",
            isLoading: false,
          })
        }
      },

      forgotPassword: async (email: string) => {
        set({ isLoading: true, error: null })
        try {
          await authApi.forgotPassword(email)
          set({ isLoading: false })
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : "发送失败",
            isLoading: false,
          })
          throw error
        }
      },

      resetPassword: async (token: string, password: string) => {
        set({ isLoading: true, error: null })
        try {
          await authApi.resetPassword(token, password)
          set({ isLoading: false })
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : "重置失败",
            isLoading: false,
          })
          throw error
        }
      },

      checkAuth: async () => {
        const token = Cookies.get("token")
        const { accounts } = get()

        if (!token) {
          set({
            isAuthenticated: false,
            user: null,
            token: null,
            activeAccountId: null,
            isLoading: false,
          })
          return
        }

        const cachedAccount = accounts.find((acc) => acc.token === token)
        if (cachedAccount) {
          set({
            user: cachedAccount,
            token,
            activeAccountId: cachedAccount.id,
            isAuthenticated: true,
            isLoading: false,
          })
          return
        }

        set({ isLoading: true })
        try {
          const response = await authApi.getCurrentUser()
          if (response?.user) {
            set({
              user: response.user,
              token,
              accounts: response.accounts,
              activeAccountId: response.user.id,
              isAuthenticated: true,
              isLoading: false,
            })
          } else {
            Cookies.remove("token")
            set({
              isAuthenticated: false,
              user: null,
              token: null,
              activeAccountId: null,
              accounts: [],
              isLoading: false,
            })
          }
        } catch {
          Cookies.remove("token")
          set({
            isAuthenticated: false,
            user: null,
            token: null,
            activeAccountId: null,
            accounts: [],
            isLoading: false,
          })
        }
      },

      clearError: () => set({ error: null }),
    }),
    {
      name: "auth-storage",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        accounts: state.accounts,
        activeAccountId: state.activeAccountId,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
)
