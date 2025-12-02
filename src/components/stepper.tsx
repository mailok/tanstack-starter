import * as React from 'react'
import { Check } from 'lucide-react'
import { Spinner } from '@/components/ui/spinner'
import { cn } from '@/lib/utils'

type StepperProps = {
  className?: string
  children: React.ReactNode
  orientation?: 'horizontal' | 'vertical'
  active: number
  completed?: boolean | number[]
  pending?: boolean | number
} & React.HTMLAttributes<HTMLDivElement>

function Stepper({
  className,
  children,
  orientation = 'horizontal',
  active,
  completed = false,
  pending = false,
  ...props
}: StepperProps) {
  const stepperRef = React.useRef<HTMLDivElement>(null)
  const childrenArray = React.Children.toArray(children)
  const stepsCount = childrenArray.length

  return (
    <StepperContext.Provider
      value={{ orientation, active, completed, pending, stepperRef }}
    >
      <div
        ref={stepperRef}
        className={cn(
          'flex size-full',
          orientation === 'vertical'
            ? 'flex-col justify-between'
            : 'flex-row items-start justify-center md:justify-between',
          className,
        )}
        {...props}
      >
        {childrenArray.map((child, index) => {
          if (!React.isValidElement(child)) return null
          const isLast = index === stepsCount - 1

          // Inject props into Step
          const stepElement = React.cloneElement(
            child as React.ReactElement<any>,
            {
              index,
              isLast,
            },
          )

          if (orientation === 'horizontal') {
            return (
              <React.Fragment key={index}>
                {stepElement}
                {!isLast && (
                  <StepperConnector
                    index={index}
                    active={active}
                    orientation="horizontal"
                  />
                )}
              </React.Fragment>
            )
          }

          // Vertical: Step renders its own connector internally
          return <React.Fragment key={index}>{stepElement}</React.Fragment>
        })}
      </div>
    </StepperContext.Provider>
  )
}

type StepProps = {
  step: number
  children?: React.ReactNode
  className?: string
  index?: number
  isLast?: boolean
}

function Step({ step, className, index, isLast, ...props }: StepProps) {
  const { orientation, active } = useStepper()
  const { isActive } = useStepStatus(step)
  const isVertical = orientation === 'vertical'

  return (
    <div
      className={cn(
        'items-center gap-4',
        isVertical
          ? 'flex flex-row w-full flex-1'
          : cn(isActive ? 'flex' : 'hidden md:flex', 'flex-col relative w-max'),
        className,
      )}
      {...props}
    >
      <div
        className={cn(
          'flex flex-col items-center',
          isVertical && 'self-stretch',
        )}
      >
        <StepperIcon step={step} />
        {isVertical && !isLast && (
          <StepperConnector
            index={index!}
            active={active}
            orientation="vertical"
          />
        )}
      </div>

      <div
        className={cn(
          'flex flex-col items-center text-center transition-colors duration-300',
          !isVertical &&
            'absolute top-full mt-2 w-max left-1/2 -translate-x-1/2',
        )}
      >
        {props.children}
      </div>
    </div>
  )
}

function StepperIcon({ step }: { step: number }) {
  const { isActive, isCompleted, isPending } = useStepStatus(step)

  if (isPending) {
    return (
      <div
        id="step"
        className="relative z-20 flex h-10 w-10 shrink-0 items-center justify-center rounded-full border-2 border-muted bg-background"
      >
        <Spinner className="size-6 text-primary" />
      </div>
    )
  }

  const icon = isCompleted ? <Check className="h-5 w-5" /> : step

  return (
    <div
      id="step"
      className={cn(
        'relative z-20 flex h-10 w-10 shrink-0 items-center justify-center rounded-full border-2 text-sm font-semibold transition-colors',
        isActive &&
          'border-primary bg-primary text-primary-foreground ring-2 ring-primary ring-offset-2 ring-offset-background',
        isCompleted && 'border-primary bg-primary text-primary-foreground',
        !isActive &&
          !isCompleted &&
          'border-2 bg-muted border-gray-400 text-muted-foreground',
      )}
    >
      {icon}
    </div>
  )
}

function StepperTitle({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) {
  return (
    <div className={cn('text-lg font-semibold', className)}>{children}</div>
  )
}

function StepperDescription({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) {
  return (
    <div
      className={cn(
        'text-sm whitespace-normal text-muted-foreground',
        className,
      )}
    >
      {children}
    </div>
  )
}

function StepperConnector({
  index,
  active,
  orientation,
}: {
  index: number
  active: number
  orientation: 'horizontal' | 'vertical'
}) {
  const isHorizontal = orientation === 'horizontal'
  // Line is active if the *next* step (index + 2) is active or completed.
  // Actually, if active step is 2, line 1-2 (index 0) should be active.
  // So if active > index + 1.
  const isHighlight = active > index + 1

  return (
    <div
      className={cn(
        'bg-border relative transition-colors duration-300',
        isHorizontal
          ? 'hidden md:block flex-1 h-[2px] mt-5 min-w-[2rem]'
          : 'w-[2px] flex-1 min-h-[2rem]',
      )}
    >
      <div
        className={cn(
          'absolute bg-primary transition-all duration-500 ease-out',
          isHorizontal ? 'h-full left-0 top-0' : 'w-full top-0 left-0',
          isHighlight
            ? isHorizontal
              ? 'w-full'
              : 'h-full'
            : isHorizontal
              ? 'w-0'
              : 'h-0',
        )}
      />
    </div>
  )
}

export { Stepper, Step, StepperIcon, StepperTitle, StepperDescription }

//------------------CUSTOM HOOKS---------------------

export function useStepStatus(step: number) {
  const { active, completed, pending } = useStepper()

  const isActive = active === step

  let isCompleted = false
  if (completed === true) {
    isCompleted = true
  } else if (Array.isArray(completed)) {
    isCompleted = completed.includes(step)
  }

  let isPending = false
  if (pending === true) {
    isPending = true
  } else if (typeof pending === 'number') {
    isPending = pending === step
  }

  return { isActive, isCompleted, isPending }
}

//------------------CONTEXTS---------------------

export type StepperOptions = {
  orientation: 'horizontal' | 'vertical'
  active: number
  completed: boolean | number[]
  pending: boolean | number
  stepperRef: React.RefObject<HTMLDivElement | null>
}

const StepperContext = React.createContext<StepperOptions | null>(null)

export const useStepper = (): StepperOptions => {
  const context = React.useContext(StepperContext)
  if (!context) {
    throw new Error('useStepper must be used within a StepperProvider.')
  }
  return context
}

//---------------------------------------------
