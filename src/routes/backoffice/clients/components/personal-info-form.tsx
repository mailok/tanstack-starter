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
import AvatarUpload from '@/components/file-upload/avatar-upload'

const personalInfoSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  photo: z.url('Must be a valid URL'),
  email: z.email('Invalid email address'),
  phone: z.string().min(1, 'Phone is required'),
  birthDate: z.string().min(1, 'Birth date is required'),
  gender: z.enum(['male', 'female']),
})

type PersonalInfoFormValues = z.infer<typeof personalInfoSchema>

interface PersonalInfoFormProps {
  id?: string
  initialValues?: Partial<PersonalInfoFormValues>
  onSubmit?: (values: PersonalInfoFormValues) => void | Promise<void>
}

export function PersonalInfoForm({
  id,
  initialValues,
  onSubmit: onSubmitProp,
}: PersonalInfoFormProps) {
  const defaultValues = {
    name: '',
    photo: '',
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
    onSubmit: async ({ value }) => {
      if (onSubmitProp) {
        await onSubmitProp(value as PersonalInfoFormValues)
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
      {/* Avatar Section - Sidebar on Desktop, Top on Mobile */}
      <div className="w-full lg:w-40 flex-shrink-0 flex flex-col items-center space-y-2 md:space-y-4">
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
                  <Input
                    name={field.name}
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                    type="date"
                  />
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
