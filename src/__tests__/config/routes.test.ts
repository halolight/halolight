import { describe, expect, it } from "vitest"

import {
  findPermissionRule,
  getMenuPermission,
  getRoutePermission,
  getRouteTitle,
  isAuthRoute,
  isPublicRoute,
  MENU_ITEMS,
  PERMISSION_RULES,
  PUBLIC_ROUTES,
  ROUTE_PERMISSIONS,
  ROUTE_TITLES,
} from "@/config/routes"

describe("routes config", () => {
  describe("PUBLIC_ROUTES", () => {
    it("should contain login route", () => {
      expect(PUBLIC_ROUTES).toContain("/login")
    })

    it("should contain register route", () => {
      expect(PUBLIC_ROUTES).toContain("/register")
    })
  })

  describe("isPublicRoute", () => {
    it("should return true for public routes", () => {
      expect(isPublicRoute("/login")).toBe(true)
      expect(isPublicRoute("/register")).toBe(true)
      expect(isPublicRoute("/forgot-password")).toBe(true)
    })

    it("should return false for protected routes", () => {
      expect(isPublicRoute("/")).toBe(false)
      expect(isPublicRoute("/users")).toBe(false)
      expect(isPublicRoute("/settings")).toBe(false)
    })
  })

  describe("isAuthRoute", () => {
    it("should return true for auth routes", () => {
      expect(isAuthRoute("/login")).toBe(true)
      expect(isAuthRoute("/register")).toBe(true)
    })

    it("should return false for non-auth routes", () => {
      expect(isAuthRoute("/")).toBe(false)
      expect(isAuthRoute("/users")).toBe(false)
    })
  })

  describe("ROUTE_PERMISSIONS", () => {
    it("should have permission for dashboard", () => {
      expect(ROUTE_PERMISSIONS["/"]).toBe("dashboard:view")
    })

    it("should have permission for users", () => {
      expect(ROUTE_PERMISSIONS["/users"]).toBe("users:view")
    })
  })

  describe("getRoutePermission", () => {
    it("should return permission for exact path", () => {
      expect(getRoutePermission("/")).toBe("dashboard:view")
      expect(getRoutePermission("/users")).toBe("users:view")
    })

    it("should return permission for nested path via regex", () => {
      expect(getRoutePermission("/users/123")).toBe("users:view")
      expect(getRoutePermission("/documents/edit")).toBe("documents:view")
    })

    it("should return undefined for unknown path", () => {
      expect(getRoutePermission("/unknown")).toBeUndefined()
    })
  })

  describe("getRouteTitle", () => {
    it("should return title for known routes", () => {
      expect(getRouteTitle("/")).toBe("仪表盘")
      expect(getRouteTitle("/users")).toBe("用户管理")
    })

    it("should return default title for unknown routes", () => {
      expect(getRouteTitle("/unknown")).toBe("Admin Pro")
    })
  })

  describe("ROUTE_TITLES", () => {
    it("should have title for all main routes", () => {
      expect(ROUTE_TITLES["/"]).toBe("仪表盘")
      expect(ROUTE_TITLES["/users"]).toBe("用户管理")
      expect(ROUTE_TITLES["/analytics"]).toBe("数据分析")
    })
  })

  describe("PERMISSION_RULES", () => {
    it("should have rules for main routes", () => {
      expect(PERMISSION_RULES.length).toBeGreaterThan(0)
    })

    it("should match dashboard pattern", () => {
      const dashboardRule = PERMISSION_RULES.find(
        (r) => r.permission === "dashboard:view"
      )
      expect(dashboardRule?.pattern.test("/")).toBe(true)
    })
  })

  describe("findPermissionRule", () => {
    it("should find rule for dashboard", () => {
      const rule = findPermissionRule("/")
      expect(rule?.permission).toBe("dashboard:view")
      expect(rule?.label).toBe("仪表盘")
    })

    it("should find rule for users", () => {
      const rule = findPermissionRule("/users")
      expect(rule?.permission).toBe("users:view")
    })

    it("should return undefined for unknown path", () => {
      expect(findPermissionRule("/unknown")).toBeUndefined()
    })
  })

  describe("MENU_ITEMS", () => {
    it("should have menu items", () => {
      expect(MENU_ITEMS.length).toBeGreaterThan(0)
    })

    it("should have dashboard as first item", () => {
      expect(MENU_ITEMS[0].title).toBe("仪表盘")
      expect(MENU_ITEMS[0].href).toBe("/")
    })

    it("should have icon for each item", () => {
      MENU_ITEMS.forEach((item) => {
        expect(item.icon).toBeDefined()
      })
    })
  })

  describe("getMenuPermission", () => {
    it("should return permission for menu href", () => {
      expect(getMenuPermission("/")).toBe("dashboard:view")
      expect(getMenuPermission("/users")).toBe("users:view")
    })

    it("should return undefined for unknown href", () => {
      expect(getMenuPermission("/unknown")).toBeUndefined()
    })
  })
})
