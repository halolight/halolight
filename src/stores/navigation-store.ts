import { create } from "zustand"

export type NavigationSource =
  | "command"
  | "sidebar"
  | "tabbar"
  | "tabbar-refresh"
  | "header"
  | "footer"
  | "other"

interface NavigationState {
  pendingPath: string | null
  label: string | null
  source: NavigationSource | null
  startNavigation: (options: {
    path: string
    label?: string
    source?: NavigationSource
  }) => void
  finishNavigation: () => void
}

export const useNavigationStore = create<NavigationState>((set) => ({
  pendingPath: null,
  label: null,
  source: null,
  startNavigation: ({ path, label, source }) =>
    set({
      pendingPath: path,
      label: label ?? path,
      source: source ?? "other",
    }),
  finishNavigation: () => set({ pendingPath: null, label: null, source: null }),
}))
