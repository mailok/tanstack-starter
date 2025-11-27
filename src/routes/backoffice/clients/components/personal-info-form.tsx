import { useForm } from '@tanstack/react-form'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import {
  Field,
  FieldContent,
  FieldError,
  FieldGroup,
  FieldLabel,
} from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from '@/components/ui/input-group'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

const personalInfoSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  photo: z.string().url('Must be a valid URL'),
  email: z.string().email('Invalid email address'),
  phone: z.string().min(1, 'Phone is required'),
  birthDate: z.string().min(1, 'Birth date is required'),
  gender: z.enum(['male', 'female']),
})

export function PersonalInfoForm() {
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
      onSubmit={(e) => {
        e.preventDefault()
        e.stopPropagation()
        form.handleSubmit()
      }}
      className="space-y-8 min-w-96"
    >
      <FieldGroup>
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

        <form.Field
          name="photo"
          validators={{
            onChange: ({ value }) => {
              const result = personalInfoSchema.shape.photo.safeParse(value)
              return result.success
                ? undefined
                : { message: result.error.issues[0].message }
            },
          }}
          children={(field) => (
            <Field>
              <FieldLabel>Photo URL</FieldLabel>
              <FieldContent>
                <Input
                  name={field.name}
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                  placeholder="https://example.com/photo.jpg"
                />
              </FieldContent>
              <FieldError errors={field.state.meta.errors} />
            </Field>
          )}
        />

        <div className="grid grid-cols-2 gap-4">
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
                  <InputGroup>
                    <InputGroupAddon>@</InputGroupAddon>
                    <InputGroupInput
                      name={field.name}
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                    />
                  </InputGroup>
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

        <div className="grid grid-cols-2 gap-4">
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
                const result = personalInfoSchema.shape.gender.safeParse(value)
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
      </FieldGroup>

      <Button type="submit">Submit</Button>
    </form>
  )
}
