import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

type StepActionsProps = {
  formId: string
  isLoading?: boolean
  onBack?: () => void
  submitLabel?: string
  className?: string
}

/**
 * Navigation buttons for onboarding steps
 *
 * Shows Back button only when onBack is provided
 * Renders submit button that targets the form by id
 */
export function StepActions({
  formId,
  isLoading = false,
  onBack,
  submitLabel = 'Next',
  className,
}: StepActionsProps) {
  return (
    <div
      className={cn(
        'flex items-center',
        onBack ? 'justify-between' : 'justify-end',
        className,
      )}
    >
      {onBack && (
        <Button
          type="button"
          variant="outline"
          size="lg"
          onClick={onBack}
          disabled={isLoading}
        >
          Back
        </Button>
      )}
      <Button form={formId} type="submit" size="lg" disabled={isLoading}>
        {submitLabel}
      </Button>
    </div>
  )
}

