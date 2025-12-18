import { useMutation, UseMutationOptions } from '@tanstack/react-query'
import { useCurrentStep } from '@/components/stepper'
import { useOnboarding } from './use-onboarding'

type MutationOptions<TData, TError, TVariables, TContext> = Omit<
  UseMutationOptions<TData, TError, TVariables, TContext>,
  'onMutate' | 'onSettled'
> & {
  onMutate?: (variables: TVariables) => Promise<TContext> | TContext | void
  onSettled?: (
    data: TData | undefined,
    error: TError | null,
    variables: TVariables,
    context: TContext | undefined,
  ) => void
}

export function useOnboardingMutation<
  TData = unknown,
  TError = Error,
  TVariables = void,
  TContext = unknown,
>(options: MutationOptions<TData, TError, TVariables, TContext>) {
  const { step } = useCurrentStep()
  const [, dispatch] = useOnboarding()

  return useMutation({
    ...options,
    onMutate: async (variables: TVariables) => {
      dispatch({ type: 'STEP_PENDING', payload: step })
      const context = await options.onMutate?.(variables)
      return context as TContext
    },
    onSettled: (
      data: TData | undefined,
      error: TError | null,
      variables: TVariables,
      context: TContext | undefined,
    ) => {
      dispatch({ type: 'STEP_IDLE' })
      options.onSettled?.(data, error, variables, context)
    },
  })
}

