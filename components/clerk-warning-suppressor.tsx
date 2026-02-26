'use client'

import { useEffect } from 'react'

/**
 * Suppresses Clerk's development key warning in development environments.
 * This is expected behavior during development and not a blocking issue.
 */
export function ClerkWarningSuppressor() {
  useEffect(() => {
    // Only suppress in development
    if (process.env.NODE_ENV === 'development') {
      const originalWarn = console.warn
      const originalError = console.error

      console.warn = function(...args: any[]) {
        const message = args[0]?.toString?.() || ''
        if (message.includes('Clerk has been loaded with development keys')) {
          return
        }
        originalWarn.apply(console, args)
      }

      console.error = function(...args: any[]) {
        const message = args[0]?.toString?.() || ''
        if (message.includes('Clerk has been loaded with development keys')) {
          return
        }
        originalError.apply(console, args)
      }

      return () => {
        console.warn = originalWarn
        console.error = originalError
      }
    }
  }, [])

  return null
}
