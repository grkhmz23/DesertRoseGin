import * as React from "react"

const MOBILE_BREAKPOINT = 768
const TABLET_BREAKPOINT = 1024

export function useIsMobile() {
  const [isMobile, setIsMobile] = React.useState<boolean | undefined>(undefined)

  React.useEffect(() => {
    const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`)
    const onChange = () => {
      setIsMobile(window.innerWidth < MOBILE_BREAKPOINT)
    }
    if (typeof mql.addEventListener === "function") {
      mql.addEventListener("change", onChange)
    } else {
      mql.addListener(onChange)
    }
    setIsMobile(window.innerWidth < MOBILE_BREAKPOINT)
    return () => {
      if (typeof mql.removeEventListener === "function") {
        mql.removeEventListener("change", onChange)
      } else {
        mql.removeListener(onChange)
      }
    }
  }, [])

  return !!isMobile
}

export type Breakpoint = "mobile" | "tablet" | "desktop"

export function useBreakpoint(): Breakpoint {
  const [breakpoint, setBreakpoint] = React.useState<Breakpoint>(() => {
    if (typeof window === "undefined") return "desktop"
    const w = window.innerWidth
    if (w < MOBILE_BREAKPOINT) return "mobile"
    if (w < TABLET_BREAKPOINT) return "tablet"
    return "desktop"
  })

  React.useEffect(() => {
    const update = () => {
      const w = window.innerWidth
      if (w < MOBILE_BREAKPOINT) setBreakpoint("mobile")
      else if (w < TABLET_BREAKPOINT) setBreakpoint("tablet")
      else setBreakpoint("desktop")
    }
    window.addEventListener("resize", update)
    update()
    return () => window.removeEventListener("resize", update)
  }, [])

  return breakpoint
}
