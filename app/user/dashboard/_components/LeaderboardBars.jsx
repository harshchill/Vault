"use client"

import { useEffect, useState } from "react"

export function LeaderboardBars({ bars }) {
  const [widths, setWidths] = useState(bars.map(() => 0))

  useEffect(() => {
    const timers = bars.map((bar, i) =>
      setTimeout(() => {
        setWidths((prev) => {
          const next = [...prev]
          next[i] = bar.width
          return next
        })
      }, bar.delay)
    )
    return () => timers.forEach(clearTimeout)
  }, [bars])

  return bars.map((bar, i) => (
    <div key={i} className="w-20 h-1.5 bg-slate-100 rounded-full overflow-hidden hidden sm:block">
      <div
        className="h-full bg-teal-400 rounded-full"
        style={{ width: widths[i] + "%", transition: "width 0.7s ease" }}
      />
    </div>
  ))
}
