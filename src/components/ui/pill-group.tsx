'use client'

import * as React from 'react'
import { cn } from '@/lib/utils'

interface PillGroupContextValue {
  value: string
  onValueChange: (value: string) => void
  orientation: 'horizontal' | 'vertical'
}

const PillGroupContext = React.createContext<PillGroupContextValue | undefined>(
  undefined,
)

function usePillGroup() {
  const context = React.useContext(PillGroupContext)
  if (!context) {
    throw new Error('usePillGroup must be used within a PillGroup')
  }
  return context
}

interface PillGroupProps extends React.HTMLAttributes<HTMLDivElement> {
  value: string
  onValueChange: (value: string) => void
  orientation?: 'horizontal' | 'vertical'
}

export function PillGroup({
  className,
  value,
  onValueChange,
  orientation = 'horizontal',
  children,
  ...props
}: PillGroupProps) {
  return (
    <PillGroupContext.Provider value={{ value, onValueChange, orientation }}>
      <div
        className={cn(
          'inline-flex items-center justify-center rounded-full bg-muted/50 p-1 text-muted-foreground',
          orientation === 'vertical' &&
            'flex-col h-auto rounded-lg w-full items-stretch gap-1',
          orientation === 'horizontal' && 'h-11',
          className,
        )}
        {...props}
      >
        {children}
      </div>
    </PillGroupContext.Provider>
  )
}

interface PillGroupItemProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  value: string
}

export function PillGroupItem({
  className,
  value,
  children,
  ...props
}: PillGroupItemProps) {
  const context = usePillGroup()
  const isSelected = context.value === value

  return (
    <button
      type="button"
      onClick={() => context.onValueChange(value)}
      data-orientation={context.orientation}
      className={cn(
        'cursor-pointer inline-flex items-center justify-center whitespace-nowrap rounded-full px-6 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
        isSelected
          ? 'bg-background text-foreground shadow-sm'
          : 'hover:bg-background/50 hover:text-foreground',
        // Vertical specific styles
        'data-[orientation=vertical]:justify-start data-[orientation=vertical]:rounded-md data-[orientation=vertical]:px-4',
        className,
      )}
      {...props}
    >
      {children}
    </button>
  )
}
