"use client"

import { useEffect } from "react"
import { trackPostView, trackEvent } from "./analytics"

export default function PostAnalytics({ post }) {
  useEffect(() => {
    // Track post view
    trackPostView(post.id, post.title, post.tags.length > 0 ? post.tags[0].name : "General")

    // Track reading progress
    let maxScroll = 0
    const handleScroll = () => {
      const scrollPercent = Math.round(
        (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100,
      )

      if (scrollPercent > maxScroll) {
        maxScroll = scrollPercent

        // Track reading milestones
        if (scrollPercent >= 25 && maxScroll < 25) {
          trackEvent("reading_progress", { post_id: post.id, progress: 25 })
        } else if (scrollPercent >= 50 && maxScroll < 50) {
          trackEvent("reading_progress", { post_id: post.id, progress: 50 })
        } else if (scrollPercent >= 75 && maxScroll < 75) {
          trackEvent("reading_progress", { post_id: post.id, progress: 75 })
        } else if (scrollPercent >= 100 && maxScroll < 100) {
          trackEvent("reading_progress", { post_id: post.id, progress: 100 })
        }
      }
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [post.id, post.title, post.tags])

  return null
}
