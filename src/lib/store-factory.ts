/**
 * Zustand Store 工厂函数
 * 提供统一的 store 创建模式，减少重复代码
 */

import type { StateCreator, StoreMutatorIdentifier } from "zustand"
import { create } from "zustand"
import { createJSONStorage, persist, type PersistOptions, type PersistStorage } from "zustand/middleware"

// ============================================================================
// 类型定义
// ============================================================================

/** 持久化存储配置 */
export interface PersistConfig<T> {
  /** 存储键名 */
  name: string
  /** 存储类型，默认 localStorage */
  storage?: "local" | "session"
  /** 版本号，用于迁移 */
  version?: number
  /** 选择需要持久化的字段 */
  partialize?: (state: T) => Partial<T>
  /** 状态迁移函数 */
  migrate?: (persistedState: unknown, version: number) => T
}

/** Store 创建选项 */
export interface StoreOptions<T> {
  /** 是否启用持久化 */
  persist?: PersistConfig<T>
  /** 开发模式下的 store 名称（用于 devtools） */
  devName?: string
}

// ============================================================================
// 工具函数
// ============================================================================

/**
 * 获取存储实现
 */
function getStorage<T>(type: "local" | "session" = "local"): PersistStorage<T> | undefined {
  if (typeof window === "undefined") {
    return undefined
  }
  return createJSONStorage<T>(() =>
    type === "session" ? sessionStorage : localStorage
  )
}

/**
 * 检查是否在浏览器环境
 */
export function isBrowser(): boolean {
  return typeof window !== "undefined"
}

// ============================================================================
// Store 工厂函数
// ============================================================================

/**
 * 创建基础 store（无持久化）
 *
 * @example
 * ```ts
 * interface CounterState {
 *   count: number
 *   increment: () => void
 * }
 *
 * export const useCounterStore = createStore<CounterState>((set) => ({
 *   count: 0,
 *   increment: () => set((state) => ({ count: state.count + 1 })),
 * }))
 * ```
 */
export function createStore<T>(
  initializer: StateCreator<T, [], []>
) {
  return create<T>()(initializer)
}

/**
 * 创建持久化 store
 *
 * @example
 * ```ts
 * interface SettingsState {
 *   theme: 'light' | 'dark'
 *   setTheme: (theme: 'light' | 'dark') => void
 * }
 *
 * export const useSettingsStore = createPersistedStore<SettingsState>(
 *   (set) => ({
 *     theme: 'light',
 *     setTheme: (theme) => set({ theme }),
 *   }),
 *   {
 *     name: 'settings-storage',
 *     partialize: (state) => ({ theme: state.theme }),
 *   }
 * )
 * ```
 */
export function createPersistedStore<T>(
  initializer: StateCreator<T, [], [["zustand/persist", unknown]]>,
  config: PersistConfig<T>
) {
  const { name, storage = "local", version, partialize, migrate } = config

  const persistOptions: PersistOptions<T, Partial<T>> = {
    name,
    storage: getStorage<Partial<T>>(storage),
    version,
    partialize,
    migrate: migrate as PersistOptions<T, Partial<T>>["migrate"],
  }

  return create<T>()(persist(initializer, persistOptions))
}

/**
 * 创建带选择器的 store hook
 * 用于优化性能，只在选中的状态变化时重新渲染
 *
 * @example
 * ```ts
 * const useCount = createSelector(useCounterStore, (state) => state.count)
 * // 在组件中使用
 * const count = useCount()
 * ```
 */
export function createSelector<T, U>(
  useStore: () => T,
  selector: (state: T) => U
): () => U {
  return () => {
    const state = useStore()
    return selector(state)
  }
}

/**
 * 创建 store 的重置函数
 * 用于将 store 重置到初始状态
 *
 * @example
 * ```ts
 * const initialState = { count: 0 }
 * const useCounterStore = createStore<CounterState>((set) => ({
 *   ...initialState,
 *   increment: () => set((state) => ({ count: state.count + 1 })),
 *   reset: createResetFn(set, initialState),
 * }))
 * ```
 */
export function createResetFn<T extends object>(
  set: (partial: Partial<T>) => void,
  initialState: Partial<T>
): () => void {
  return () => set(initialState)
}

// ============================================================================
// Store 组合工具
// ============================================================================

/**
 * 组合多个 store 的状态（只读）
 * 用于需要访问多个 store 状态的场景
 *
 * @example
 * ```ts
 * const useCombinedState = combineStores({
 *   auth: useAuthStore,
 *   settings: useSettingsStore,
 * })
 *
 * // 在组件中
 * const { auth, settings } = useCombinedState()
 * ```
 */
export function combineStores<T extends Record<string, () => unknown>>(
  stores: T
): () => { [K in keyof T]: ReturnType<T[K]> } {
  return () => {
    const result = {} as { [K in keyof T]: ReturnType<T[K]> }
    for (const key in stores) {
      result[key] = stores[key]() as ReturnType<T[typeof key]>
    }
    return result
  }
}

// ============================================================================
// 类型导出
// ============================================================================

export type { StateCreator, StoreMutatorIdentifier }
