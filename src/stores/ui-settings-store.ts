import { create } from "zustand"
import { persist } from "zustand/middleware"

export type SkinPreset =
  | "default"
  | "blue"
  | "emerald"
  | "amber"
  | "violet"
  | "rose"
  | "teal"
  | "slate"
  | "ocean"
  | "sunset"
  | "aurora"

interface UiSettingsState {
  skin: SkinPreset
  showFooter: boolean
  showTabBar: boolean
  mobileHeaderFixed: boolean
  mobileTabBarFixed: boolean
  setSkin: (skin: SkinPreset) => void
  setShowFooter: (visible: boolean) => void
  setShowTabBar: (visible: boolean) => void
  setMobileHeaderFixed: (fixed: boolean) => void
  setMobileTabBarFixed: (fixed: boolean) => void
  resetSettings: () => void
}

export const useUiSettingsStore = create<UiSettingsState>()(
  persist(
    (set) => ({
      skin: "default",
      showFooter: true,
      showTabBar: true,
      mobileHeaderFixed: true,
      mobileTabBarFixed: true,
      setSkin: (skin) => set({ skin }),
      setShowFooter: (visible) => set({ showFooter: visible }),
      setShowTabBar: (visible) => set({ showTabBar: visible }),
      setMobileHeaderFixed: (fixed) => set({ mobileHeaderFixed: fixed }),
      setMobileTabBarFixed: (fixed) => set({ mobileTabBarFixed: fixed }),
      resetSettings: () =>
        set({
          skin: "default",
          showFooter: true,
          showTabBar: true,
          mobileHeaderFixed: true,
          mobileTabBarFixed: true,
        }),
    }),
    {
      name: "ui-settings-storage",
    }
  )
)
