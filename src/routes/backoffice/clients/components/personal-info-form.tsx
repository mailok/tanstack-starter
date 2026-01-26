import * as React from 'react'
import { useForm } from '@tanstack/react-form'
import { z } from 'zod'
import { format } from 'date-fns'
import { CalendarIcon } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import {
  Field,
  FieldContent,
  FieldError,
  FieldLabel,
} from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import AvatarUpload from '@/components/file-upload/avatar-upload'

const personalInfoSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  photo: z.union([z.url('Must be a valid URL'), z.literal('')]).nullish(),
  email: z.email('Invalid email address'),
  phone: z.string().min(1, 'Phone is required'),
  birthDate: z.string().min(1, 'Birth date is required'),
  gender: z.enum(['male', 'female']),
})

type PersonalInfoFormValues = z.infer<typeof personalInfoSchema>

/**
 * Parses a date string (YYYY-MM-DD) into a local Date object.
 * This prevents timezone offsets that usually shift the date by one day.
 */
function parseLocalDate(dateStr: string) {
  if (!dateStr) return undefined
  const [year, month, day] = dateStr.split('-').map(Number)
  return new Date(year, month - 1, day)
}

interface PersonalInfoFormProps {
  id?: string
  initialValues?: Partial<PersonalInfoFormValues>
  onSubmit?: (
    values: PersonalInfoFormValues,
    isDirty: boolean,
  ) => void | Promise<void>
  disabled?: boolean
}

export function PersonalInfoForm({
  id,
  initialValues,
  onSubmit: onSubmitProp,
  disabled,
}: PersonalInfoFormProps) {
  const [isCalendarOpen, setIsCalendarOpen] = React.useState(false)

  const defaultValues = {
    name: '',
    email: '',
    phone: '',
    birthDate: '',
    gender: undefined as unknown as 'male' | 'female',
  }

  const form = useForm({
    defaultValues: {
      ...defaultValues,
      ...initialValues,
    },
    validators: {
      onSubmit: personalInfoSchema,
      onChange: personalInfoSchema,
    },
    onSubmit: async ({ value, formApi }) => {
      if (onSubmitProp) {
        value.photo = undefined
        await onSubmitProp(value, formApi.state.isDirty)
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
      className="flex flex-col lg:flex-row gap-4 md:gap-8 w-full"
    >
      <fieldset disabled={disabled} className="contents">
        {/* Avatar Section - Sidebar on Desktop, Top on Mobile */}
        <div className="w-full lg:w-40 shrink-0 flex flex-col items-center space-y-2 md:space-y-4">
          <div className="relative">
            <AvatarUpload
              onFileChange={(file) => {
                console.log(file)
                // form.setFieldValue('photo', file?.url || '')
              }}
            />
          </div>
        </div>

        {/* Fields Section - Main Content */}
        <div className="flex-1 space-y-4 md:space-y-6">
          <form.Field
            name="name"
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

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
            <form.Field
              name="email"
              children={(field) => (
                <Field>
                  <FieldLabel>Email</FieldLabel>
                  <FieldContent>
                    <Input
                      type="email"
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
              name="phone"
              children={(field) => (
                <Field>
                  <FieldLabel>Phone</FieldLabel>
                  <FieldContent>
                    <Input
                      name={field.name}
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                      type="tel"
                    />
                  </FieldContent>
                  <FieldError errors={field.state.meta.errors} />
                </Field>
              )}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
            <form.Field
              name="birthDate"
              children={(field) => (
                <Field>
                  <FieldLabel>Birth Date</FieldLabel>
                  <FieldContent>
                    <Popover
                      open={isCalendarOpen}
                      onOpenChange={setIsCalendarOpen}
                    >
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className={cn(
                            'w-full justify-start text-left font-normal',
                            !field.state.value && 'text-muted-foreground',
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {field.state.value ? (
                            format(parseLocalDate(field.state.value)!, 'PPP')
                          ) : (
                            <span>Pick a date</span>
                          )}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          captionLayout="dropdown"
                          selected={parseLocalDate(field.state.value)}
                          defaultMonth={parseLocalDate(field.state.value)}
                          onSelect={(date) => {
                            field.handleChange(
                              date ? format(date, 'yyyy-MM-dd') : '',
                            )
                            setIsCalendarOpen(false)
                          }}
                          startMonth={new Date(1900, 0)}
                          endMonth={new Date()}
                          disabled={(date) =>
                            date > new Date() || date < new Date('1900-01-01')
                          }
                        />
                      </PopoverContent>
                    </Popover>
                  </FieldContent>
                  <FieldError errors={field.state.meta.errors} />
                </Field>
              )}
            />

            <form.Field
              name="gender"
              children={(field) => (
                <Field>
                  <FieldLabel>Gender</FieldLabel>
                  <FieldContent>
                    <Select
                      value={field.state.value}
                      onValueChange={(val) =>
                        field.handleChange(val as 'male' | 'female')
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select gender" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="male">Male</SelectItem>
                        <SelectItem value="female">Female</SelectItem>
                      </SelectContent>
                    </Select>
                  </FieldContent>
                  <FieldError errors={field.state.meta.errors} />
                </Field>
              )}
            />
          </div>
        </div>
      </fieldset>

      {!id && (
        <div className="flex justify-end pt-4">
          <Button type="submit" size="lg" disabled={disabled}>
            Save Changes
          </Button>
        </div>
      )}
    </form>
  )
}
