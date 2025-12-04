"use client"

import { usePathname } from "next/navigation"
import * as React from "react"

import { getRouteTdk } from "@/config/tdk"
import { useTdk } from "@/hooks/use-tdk"

export function TdkManager() {
  const pathname = usePathname()
  const tdkEntry = React.useMemo(() => getRouteTdk(pathname), [pathname])
  useTdk(tdkEntry)
  return null
}
