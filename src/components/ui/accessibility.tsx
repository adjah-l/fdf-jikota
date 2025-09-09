import * as React from 'react'
import { cn } from '@/lib/utils'

// Skip to main content link for screen readers
export const SkipToContent = () => (
  <a
    href="#main-content"
    className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 z-50 bg-primary text-primary-foreground px-4 py-2 rounded-md transition-transform"
  >
    Skip to main content
  </a>
)

// Visually hidden text for screen readers
export const VisuallyHidden = React.forwardRef<
  HTMLSpanElement,
  React.HTMLAttributes<HTMLSpanElement>
>(({ className, ...props }, ref) => (
  <span
    ref={ref}
    className={cn('sr-only', className)}
    {...props}
  />
))
VisuallyHidden.displayName = 'VisuallyHidden'

// Focus trap for modals and dialogs
export const FocusTrap: React.FC<{
  children: React.ReactNode
  enabled?: boolean
}> = ({ children, enabled = true }) => {
  const trapRef = React.useRef<HTMLDivElement>(null)

  React.useEffect(() => {
    if (!enabled || !trapRef.current) return

    const trap = trapRef.current
    const focusableElements = trap.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    )
    const firstElement = focusableElements[0] as HTMLElement
    const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement

    const handleTabKey = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return

      if (e.shiftKey) {
        if (document.activeElement === firstElement) {
          lastElement?.focus()
          e.preventDefault()
        }
      } else {
        if (document.activeElement === lastElement) {
          firstElement?.focus()
          e.preventDefault()
        }
      }
    }

    document.addEventListener('keydown', handleTabKey)
    firstElement?.focus()

    return () => {
      document.removeEventListener('keydown', handleTabKey)
    }
  }, [enabled])

  return <div ref={trapRef}>{children}</div>
}

// Announce changes to screen readers
export const LiveRegion: React.FC<{
  children: React.ReactNode
  priority?: 'polite' | 'assertive'
}> = ({ children, priority = 'polite' }) => (
  <div
    aria-live={priority}
    aria-atomic="true"
    className="sr-only"
  >
    {children}
  </div>
)

// High contrast mode detection
export const useHighContrast = () => {
  const [isHighContrast, setIsHighContrast] = React.useState(false)

  React.useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-contrast: high)')
    setIsHighContrast(mediaQuery.matches)

    const handleChange = (e: MediaQueryListEvent) => {
      setIsHighContrast(e.matches)
    }

    mediaQuery.addEventListener('change', handleChange)
    return () => mediaQuery.removeEventListener('change', handleChange)
  }, [])

  return isHighContrast
}

// Reduced motion detection
export const useReducedMotion = () => {
  const [prefersReducedMotion, setPrefersReducedMotion] = React.useState(false)

  React.useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    setPrefersReducedMotion(mediaQuery.matches)

    const handleChange = (e: MediaQueryListEvent) => {
      setPrefersReducedMotion(e.matches)
    }

    mediaQuery.addEventListener('change', handleChange)
    return () => mediaQuery.removeEventListener('change', handleChange)
  }, [])

  return prefersReducedMotion
}

// Keyboard navigation helper
export const useKeyboardNavigation = (
  items: string[],
  onSelect: (item: string) => void
) => {
  const [activeIndex, setActiveIndex] = React.useState(-1)

  const handleKeyDown = React.useCallback((e: KeyboardEvent) => {
    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault()
        setActiveIndex(prev => Math.min(prev + 1, items.length - 1))
        break
      case 'ArrowUp':
        e.preventDefault()
        setActiveIndex(prev => Math.max(prev - 1, 0))
        break
      case 'Enter':
      case ' ':
        e.preventDefault()
        if (activeIndex >= 0 && items[activeIndex]) {
          onSelect(items[activeIndex])
        }
        break
      case 'Escape':
        setActiveIndex(-1)
        break
    }
  }, [items, activeIndex, onSelect])

  return {
    activeIndex,
    setActiveIndex,
    handleKeyDown,
  }
}