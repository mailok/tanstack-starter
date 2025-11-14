import { useQueryErrorResetBoundary } from '@tanstack/react-query'
import { createContext, useContext } from 'react'
import { ErrorBoundary as ReactErrorBoundary } from 'react-error-boundary'

type Props = {
  children: React.ReactNode
  fallback: React.ReactNode
}

export function ErrorBoundary({ children, fallback }: Props) {
  const { reset } = useQueryErrorResetBoundary()

  return (
    <ReactErrorBoundary
      onReset={reset}
      fallbackRender={({ error, resetErrorBoundary }) => {
        return (
          <ErrorContext.Provider value={{ error, resetErrorBoundary }}>
            {fallback}
          </ErrorContext.Provider>
        )
      }}
    >
      {children}
    </ReactErrorBoundary>
  )
}

type ErrorContextType = {
  error: Error | null
  resetErrorBoundary: () => void
} | null

const ErrorContext = createContext<ErrorContextType>(null)

export function useErrorBoundary() {
  const context = useContext(ErrorContext)
  if (!context) {
    throw new Error(
      'useErrorBoundary must be used within an ErrorBoundary component',
    )
  }
  return context
}
