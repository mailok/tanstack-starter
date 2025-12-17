import { createContext, useContext } from "react"

export type OnboardingState = {
  step: number
  clientId?: string
  nextStepToComplete: number
  completedSteps: number[]
  pendingStep?: number
}

export type OnboardingAction =
  | { type: 'NAVIGATE_TO_STEP'; payload: number }
  | { type: 'ADD_COMPLETED_STEP'; payload: number }
  | { type: 'SET_PENDING_STEP'; payload: number | undefined }
  | {
      type: 'START_ONBOARDING'
      payload: { clientId: string; }
    }

// Reducer function
export function onboardingReducer(
  state: OnboardingState,
  action: OnboardingAction,
): OnboardingState {
  switch (action.type) {
    case 'START_ONBOARDING':
      return {
        ...state,
        step: 2,
        clientId: action.payload.clientId,
        nextStepToComplete: 2,
        completedSteps: [1],
        pendingStep: undefined,
      }
    case 'NAVIGATE_TO_STEP':
      return {
          ...state,
          step: action.payload,
        }
    case 'ADD_COMPLETED_STEP':
      if (state.completedSteps.includes(action.payload)) {
        return state
      }
      return {
        ...state,
        completedSteps: [...state.completedSteps, action.payload],
      }
    case 'SET_PENDING_STEP':
      return { ...state, pendingStep: action.payload }
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