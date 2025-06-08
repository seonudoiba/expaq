"use client"

import { useEffect, useState } from "react"
import { PageLoading } from "./page-loading"
import { SearchLoading } from "./search-loading"

interface SmartLoadingProps {
  type?: "page" | "search" | "content"
  delay?: number
  timeout?: number
  fallbackMessage?: string
}

export function SmartLoading({
  type = "page",
  delay = 300,
  timeout = 10000,
  fallbackMessage = "This is taking longer than expected...",
}: SmartLoadingProps) {
  const [showLoading, setShowLoading] = useState(false)
  const [showFallback, setShowFallback] = useState(false)

  useEffect(() => {
    // Delay showing loading to prevent flash for fast loads
    const delayTimer = setTimeout(() => {
      setShowLoading(true)
    }, delay)

    // Show fallback message for very long loads
    const timeoutTimer = setTimeout(() => {
      setShowFallback(true)
    }, timeout)

    return () => {
      clearTimeout(delayTimer)
      clearTimeout(timeoutTimer)
    }
  }, [delay, timeout])

  if (!showLoading) {
    return null
  }

  if (type === "search") {
    return <SearchLoading message={showFallback ? fallbackMessage : "Searching for experiences..."} />
  }

  return <PageLoading type="general" />
}
