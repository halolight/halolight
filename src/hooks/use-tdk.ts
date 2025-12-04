"use client"

import * as React from "react"

import type { TdkEntry } from "@/config/tdk"

import { useTitle } from "./use-title"

function updateMetaTag(name: string, content: string) {
  if (typeof document === "undefined") return
  let element = document.head.querySelector<HTMLMetaElement>(`meta[name="${name}"]`)
  if (!element) {
    element = document.createElement("meta")
    element.setAttribute("name", name)
    document.head.appendChild(element)
  }
  element.setAttribute("content", content)
}

export function useTdk(entry: TdkEntry) {
  useTitle(entry.title)

  React.useEffect(() => {
    updateMetaTag("description", entry.description)
  }, [entry.description])

  React.useEffect(() => {
    updateMetaTag("keywords", entry.keywords)
  }, [entry.keywords])
}
