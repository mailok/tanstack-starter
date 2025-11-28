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

export function PersonalInfoForm({ id }: { id?: string }) {
  const form = useForm({
    defaultValues: {
      name: '',
      photo: '',
      email: '',
      phone: '',
      birthDate: '',
      gender: undefined as unknown as 'male' | 'female',
    },
    validators: {
      onChange: ({ value }) => {
        const result = personalInfoSchema.safeParse(value)
        if (!result.success) {
          // Return the first error message for the form level if needed,
          // but usually we want field level errors.
          // TanStack Form 'validators' at root level is for form-wide validation.
          // We should use field-level validators or a form-level validator that returns an object.
          // However, for simple field validation, we can use the schema in the field validators.
          return undefined
        }
        return undefined
      },
    },
    onSubmit: async ({ value }) => {
      console.log(value)
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
      className="flex flex-col md:flex-row gap-8 w-full max-w-5xl mx-auto"
    >
      <div className="w-full md:w-64 flex-shrink-0 flex flex-col items-center space-y-4">
        <div className="relative">
          <AvatarUpload
            onFileChange={(file) => {
              console.log(file)
              // form.setFieldValue('photo', file?.url || '')
            }}
          />
        </div>
      </div>

      <div className="flex-1 space-y-8">
        <div className="grid gap-6">
          <form.Field
            name="name"
            validators={{
              onChange: ({ value }) => {
                const result = personalInfoSchema.shape.name.safeParse(value)
                return result.success
                  ? undefined
                  : { message: result.error.issues[0].message }
              },
            }}
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

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <form.Field
              name="email"
              validators={{
                onChange: ({ value }) => {
                  const result = personalInfoSchema.shape.email.safeParse(value)
                  return result.success
                    ? undefined
                    : { message: result.error.issues[0].message }
                },
              }}
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
              validators={{
                onChange: ({ value }) => {
                  const result = personalInfoSchema.shape.phone.safeParse(value)
                  return result.success
                    ? undefined
                    : { message: result.error.issues[0].message }
                },
              }}
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

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <form.Field
              name="birthDate"
              validators={{
                onChange: ({ value }) => {
                  const result =
                    personalInfoSchema.shape.birthDate.safeParse(value)
                  return result.success
                    ? undefined
                    : { message: result.error.issues[0].message }
                },
              }}
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
              validators={{
                onChange: ({ value }) => {
                  const result =
                    personalInfoSchema.shape.gender.safeParse(value)
                  return result.success
                    ? undefined
                    : { message: result.error.issues[0].message }
                },
              }}
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
      </div>
    </form>
  )
}
