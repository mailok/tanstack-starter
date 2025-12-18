import { createContext, useContext } from 'react'

export type OnboardingState = {
  step: number
  clientId?: string
  nextStepToComplete: number
  completedSteps: number[]
  pendingStep?: number
}

export type OnboardingAction =
  // Simple navigation (no side effects)
  | { type: 'GO_TO_STEP'; payload: number }
  // Complete current step and advance to the next one
  | { type: 'COMPLETE_STEP'; payload: { step: number; nextStep: number } }
  // When client is created for the first time
  | {
      type: 'CLIENT_CREATED'
      payload: { clientId: string; currentStep: number }
    }
  // Step states
  | { type: 'STEP_PENDING'; payload: number }
  | { type: 'STEP_IDLE' }

export function onboardingReducer(
  state: OnboardingState,
  action: OnboardingAction,
): OnboardingState {
  switch (action.type) {
    case 'CLIENT_CREATED': {
      const { clientId, currentStep } = action.payload
      const nextStep = currentStep + 1
      return {
        ...state,
        clientId,
        step: nextStep,
        completedSteps: [...state.completedSteps, currentStep],
        nextStepToComplete: nextStep,
        pendingStep: undefined,
      }
    }

    case 'COMPLETE_STEP': {
      const { step, nextStep } = action.payload
      const completedSteps = state.completedSteps.includes(step)
        ? state.completedSteps
        : [...state.completedSteps, step]

      return {
        ...state,
        step: nextStep,
        completedSteps,
        nextStepToComplete: Math.max(state.nextStepToComplete, nextStep),
      }
    }

    case 'GO_TO_STEP':
      return { ...state, step: action.payload }

    case 'STEP_PENDING':
      return { ...state, pendingStep: action.payload }

    case 'STEP_IDLE':
      return { ...state, pendingStep: undefined }

    default:
      return state
  }
}

// Context
type OnboardingContextType = [OnboardingState, React.Dispatch<OnboardingAction>]

const OnboardingContext = createContext<OnboardingContextType | undefined>(
  undefined,
)

export const OnboardingProvider = OnboardingContext.Provider

// Custom hook
export const useOnboarding = (): OnboardingContextType => {
  const context = useContext(OnboardingContext)
  if (!context) {
    throw new Error('useOnboarding must be used within an OnboardingProvider')
  }
  return context
}
