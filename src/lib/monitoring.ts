import * as Sentry from '@sentry/react'

// Initialize Sentry monitoring
export const initMonitoring = () => {
  const dsn = import.meta.env.VITE_SENTRY_DSN
  
  if (dsn && import.meta.env.PROD) {
    Sentry.init({
      dsn,
      environment: import.meta.env.MODE,
      // Performance monitoring
      tracesSampleRate: 0.1,
      // Release tracking
      release: import.meta.env.VITE_APP_VERSION || '1.0.0',
      // User context
      beforeSend: (event, hint) => {
        // Filter out known issues
        if (event.exception) {
          const error = hint.originalException
          if (error instanceof Error) {
            // Skip common browser extension errors
            if (error.message?.includes('Non-Error promise rejection')) {
              return null
            }
            // Skip network errors that are user-related
            if (error.message?.includes('Failed to fetch')) {
              return null
            }
          }
        }
        return event
      },
    })
  }
}

// Custom error boundary component
export const AppErrorBoundary = Sentry.withErrorBoundary

// Performance monitoring helpers
export const captureException = (error: Error, context?: Record<string, any>) => {
  Sentry.withScope((scope) => {
    if (context) {
      Object.entries(context).forEach(([key, value]) => {
        scope.setContext(key, value)
      })
    }
    Sentry.captureException(error)
  })
}

export const captureMessage = (message: string, level: 'info' | 'warning' | 'error' = 'info') => {
  Sentry.captureMessage(message, level)
}

// User identification
export const identifyUser = (user: { id: string; email?: string; name?: string }) => {
  Sentry.setUser({
    id: user.id,
    email: user.email,
    username: user.name,
  })
}