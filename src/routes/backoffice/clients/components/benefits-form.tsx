import { useForm } from '@tanstack/react-form'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import {
  Field,
  FieldContent,
  FieldError,
  FieldLabel,
} from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'

const benefitsSchema = z.object({
  insuranceProvider: z.string().optional(),
  policyNumber: z.string().optional(),
  coverageType: z.enum(['Basic', 'Standard', 'Premium']).optional(),
  deductible: z.number().int().optional(),
  copay: z.number().int().optional(),
  annualLimit: z.number().int().optional(),
  dentalCoverage: z.boolean().optional(),
  visionCoverage: z.boolean().optional(),
  mentalHealthCoverage: z.boolean().optional(),
})

type BenefitsFormValues = z.infer<typeof benefitsSchema>

interface BenefitsFormProps {
  id?: string
  initialValues?: Partial<BenefitsFormValues>
  onSubmit?: (values: BenefitsFormValues) => void | Promise<void>
}

export function BenefitsForm({
  id,
  initialValues,
  onSubmit: onSubmitProp,
}: BenefitsFormProps) {
  const defaultValues = {
    insuranceProvider: '',
    policyNumber: '',
    coverageType: undefined as unknown as 'Basic' | 'Standard' | 'Premium',
    deductible: undefined as unknown as number,
    copay: undefined as unknown as number,
    annualLimit: undefined as unknown as number,
    dentalCoverage: false,
    visionCoverage: false,
    mentalHealthCoverage: false,
  }

  const form = useForm({
    defaultValues: {
      ...defaultValues,
      ...initialValues,
    },
    onSubmit: async ({ value }) => {
      if (onSubmitProp) {
        await onSubmitProp(value as BenefitsFormValues)
      } else {
        console.log(value)
      }
    },
  })

  return (
    <form
      id={id}
      onSubmit={(e) => {
        e.preventDefault()
        e.stopPropagation()
        form.handleSubmit()
      }}
      className="flex flex-col gap-4 md:gap-8 w-full"
    >
      <div className="flex-1 space-y-4 md:space-y-6">
        {/* Insurance Information Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
          <form.Field
            name="insuranceProvider"
            children={(field) => (
              <Field>
                <FieldLabel>Insurance Provider</FieldLabel>
                <FieldContent>
                  <Input
                    name={field.name}
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                  />
                </FieldContent>
                <FieldError errors={field.state.meta.errors} />
              </Field>
            )}
          />

          <form.Field
            name="coverageType"
            children={(field) => (
              <Field>
                <FieldLabel>Coverage Type</FieldLabel>
                <FieldContent>
                  <Select
                    value={field.state.value}
                    onValueChange={(val) => field.handleChange(val as any)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select coverage type" />
                    </SelectTrigger>
                    <SelectContent>
                      {['Basic', 'Standard', 'Premium'].map((type) => (
                        <SelectItem key={type} value={type}>
                          {type}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FieldContent>
                <FieldError errors={field.state.meta.errors} />
              </Field>
            )}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
          <form.Field
            name="policyNumber"
            children={(field) => (
              <Field>
                <FieldLabel>Policy Number</FieldLabel>
                <FieldContent>
                  <Input
                    name={field.name}
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                  />
                </FieldContent>
                <FieldError errors={field.state.meta.errors} />
              </Field>
            )}
          />

          <form.Field
            name="deductible"
            children={(field) => (
              <Field>
                <FieldLabel>Deductible</FieldLabel>
                <FieldContent>
                  <Input
                    type="number"
                    name={field.name}
                    value={field.state.value ?? ''}
                    onBlur={field.handleBlur}
                    onChange={(e) =>
                      field.handleChange(
                        e.target.value
                          ? Number(e.target.value)
                          : (undefined as any),
                      )
                    }
                  />
                </FieldContent>
                <FieldError errors={field.state.meta.errors} />
              </Field>
            )}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
          <form.Field
            name="copay"
            children={(field) => (
              <Field>
                <FieldLabel>Copay</FieldLabel>
                <FieldContent>
                  <Input
                    type="number"
                    name={field.name}
                    value={field.state.value ?? ''}
                    onBlur={field.handleBlur}
                    onChange={(e) =>
                      field.handleChange(
                        e.target.value
                          ? Number(e.target.value)
                          : (undefined as any),
                      )
                    }
                  />
                </FieldContent>
                <FieldError errors={field.state.meta.errors} />
              </Field>
            )}
          />

          <form.Field
            name="annualLimit"
            children={(field) => (
              <Field>
                <FieldLabel>Annual Limit</FieldLabel>
                <FieldContent>
                  <Input
                    type="number"
                    name={field.name}
                    value={field.state.value ?? ''}
                    onBlur={field.handleBlur}
                    onChange={(e) =>
                      field.handleChange(
                        e.target.value
                          ? Number(e.target.value)
                          : (undefined as any),
                      )
                    }
                  />
                </FieldContent>
                <FieldError errors={field.state.meta.errors} />
              </Field>
            )}
          />
        </div>

        {/* Coverage Options Section */}
        <div className="pt-4 md:pt-6">
          <h3 className="text-lg font-medium mb-4">Coverage Options</h3>
          <div className="space-y-4">
            <form.Field
              name="dentalCoverage"
              children={(field) => (
                <Field>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="dentalCoverage"
                      checked={field.state.value}
                      onCheckedChange={(checked) =>
                        field.handleChange(checked === true)
                      }
                    />
                    <FieldLabel htmlFor="dentalCoverage" className="mb-0!">
                      Dental Coverage
                    </FieldLabel>
                  </div>
                  <FieldError errors={field.state.meta.errors} />
                </Field>
              )}
            />

            <form.Field
              name="visionCoverage"
              children={(field) => (
                <Field>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="visionCoverage"
                      checked={field.state.value}
                      onCheckedChange={(checked) =>
                        field.handleChange(checked === true)
                      }
                    />
                    <FieldLabel htmlFor="visionCoverage" className="mb-0!">
                      Vision Coverage
                    </FieldLabel>
                  </div>
                  <FieldError errors={field.state.meta.errors} />
                </Field>
              )}
            />

            <form.Field
              name="mentalHealthCoverage"
              children={(field) => (
                <Field>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="mentalHealthCoverage"
                      checked={field.state.value}
                      onCheckedChange={(checked) =>
                        field.handleChange(checked === true)
                      }
                    />
                    <FieldLabel
                      htmlFor="mentalHealthCoverage"
                      className="mb-0!"
                    >
                      Mental Health Coverage
                    </FieldLabel>
                  </div>
                  <FieldError errors={field.state.meta.errors} />
                </Field>
              )}
            />
          </div>
        </div>
      </div>

      {!id && (
        <div className="flex justify-end pt-4">
          <Button type="submit" size="lg">
            Save Changes
          </Button>
        </div>
      )}
    </form>
  )
}
