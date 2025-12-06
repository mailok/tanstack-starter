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

const medicalInfoSchema = z.object({
  bloodType: z
    .enum(['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'])
    .optional(),
  allergies: z.array(z.string()).optional(),
  chronicConditions: z.array(z.string()).optional(),
  medications: z.array(z.string()).optional(),
  lastCheckup: z.string().optional(),
  emergencyContactName: z.string().min(1, 'Emergency contact name is required'),
  emergencyContactPhone: z
    .string()
    .min(1, 'Emergency contact phone is required'),
  emergencyContactRelationship: z.string().min(1, 'Relationship is required'),
})

type MedicalInfoFormValues = z.infer<typeof medicalInfoSchema>

// Helper functions to convert between arrays and comma-separated strings
const arrayToString = (arr?: string[]): string => {
  return arr?.filter(Boolean).join(', ') || ''
}

const stringToArray = (str: string): string[] => {
  return str
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean)
}

interface MedicalInfoFormProps {
  id?: string
  initialValues?: Partial<MedicalInfoFormValues>
  onSubmit?: (
    values: MedicalInfoFormValues,
    isDirty: boolean,
  ) => void | Promise<void>
}

export function MedicalInfoForm({
  id,
  initialValues,
  onSubmit: onSubmitProp,
}: MedicalInfoFormProps) {
  const defaultValues = {
    emergencyContactName: '',
    emergencyContactPhone: '',
    emergencyContactRelationship: '',
  }

  // Keep array values as arrays for form state
  const formInitialValues = {
    ...defaultValues,
    ...initialValues,
  }

  const form = useForm({
    defaultValues: formInitialValues,
    validators: {
      onSubmit: medicalInfoSchema,
      onChange: medicalInfoSchema,
    },
    onSubmit: async ({ value, formApi }) => {
      if (onSubmitProp) {
        await onSubmitProp(
          value as MedicalInfoFormValues,
          formApi.state.isDirty,
        )
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
        {/* Medical Details Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
          <form.Field
            name="lastCheckup"
            children={(field) => (
              <Field>
                <FieldLabel>Last Checkup</FieldLabel>
                <FieldContent>
                  <Input
                    type="date"
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
            name="bloodType"
            children={(field) => (
              <Field>
                <FieldLabel>Blood Type</FieldLabel>
                <FieldContent>
                  <Select
                    value={field.state.value}
                    onValueChange={(val) => field.handleChange(val as any)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select blood type" />
                    </SelectTrigger>
                    <SelectContent>
                      {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map(
                        (type) => (
                          <SelectItem key={type} value={type}>
                            {type}
                          </SelectItem>
                        ),
                      )}
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
            name="allergies"
            children={(field) => (
              <Field>
                <FieldLabel>Allergies</FieldLabel>
                <FieldContent>
                  <Input
                    placeholder="Peanuts, Penicillin, etc. (comma separated)"
                    name={field.name}
                    value={arrayToString(field.state.value)}
                    onBlur={field.handleBlur}
                    onChange={(e) =>
                      field.handleChange(stringToArray(e.target.value))
                    }
                  />
                </FieldContent>
                <FieldError errors={field.state.meta.errors} />
              </Field>
            )}
          />

          <form.Field
            name="chronicConditions"
            children={(field) => (
              <Field>
                <FieldLabel>Chronic Conditions</FieldLabel>
                <FieldContent>
                  <Input
                    placeholder="Diabetes, Hypertension, etc. (comma separated)"
                    name={field.name}
                    value={arrayToString(field.state.value)}
                    onBlur={field.handleBlur}
                    onChange={(e) =>
                      field.handleChange(stringToArray(e.target.value))
                    }
                  />
                </FieldContent>
                <FieldError errors={field.state.meta.errors} />
              </Field>
            )}
          />

          <form.Field
            name="medications"
            children={(field) => (
              <Field>
                <FieldLabel>Medications</FieldLabel>
                <FieldContent>
                  <Input
                    placeholder="Ibuprofen, Aspirin, etc. (comma separated)"
                    name={field.name}
                    value={arrayToString(field.state.value)}
                    onBlur={field.handleBlur}
                    onChange={(e) =>
                      field.handleChange(stringToArray(e.target.value))
                    }
                  />
                </FieldContent>
                <FieldError errors={field.state.meta.errors} />
              </Field>
            )}
          />
        </div>

        {/* Emergency Contact Section */}
        <div className="pt-4 md:pt-6">
          <h3 className="text-lg font-medium mb-4">Emergency Contact</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
            <form.Field
              name="emergencyContactName"
              children={(field) => (
                <Field>
                  <FieldLabel>Name</FieldLabel>
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
              name="emergencyContactRelationship"
              children={(field) => (
                <Field>
                  <FieldLabel>Relationship</FieldLabel>
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
              name="emergencyContactPhone"
              children={(field) => (
                <Field>
                  <FieldLabel>Phone</FieldLabel>
                  <FieldContent>
                    <Input
                      type="tel"
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
