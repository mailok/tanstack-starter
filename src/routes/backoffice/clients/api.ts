import { createServerFn } from '@tanstack/react-start'
import * as z from 'zod'
import { setResponseStatus } from '@tanstack/react-start/server'
import { BaseClientSearchSchema } from './schemas'
import * as service from './service'
import { zodValidator } from '@/lib/zod-validator'
import { until } from 'until-async'


export const getClientInsights = createServerFn({ method: 'GET' }).handler(() =>
  service.getInsights(),
)

export type GetClientsPageResponse = Awaited<
  ReturnType<typeof service.findMany>
>

const ClientIdSchema = z.uuid('Invalid client ID')
const DEFAULT_NOT_FOUND_ERROR =
  'The client you are looking for does not exist or has been removed.'

export const getClientsPage = createServerFn({ method: 'GET' })
  .inputValidator(BaseClientSearchSchema)
  .handler(async ({ data }) => service.findMany(data))

export const getClientPersonalInformation = createServerFn({ method: 'GET' })
  .inputValidator(zodValidator(ClientIdSchema))
  .handler(async ({ data: clientId }) => {
    const [error, personalInfo] = await until(() =>
      service.getPersonalInformation(clientId),
    )

    if (error) {
      // TODO: Log error
      throw new Error(
        'Cannot get client personal information. Please try again later.',
      )
    }

    if (!personalInfo) {
      setResponseStatus(400)
      throw new Error(DEFAULT_NOT_FOUND_ERROR)
    }

    return personalInfo
  })

export const getClientMedicalInformation = createServerFn({ method: 'GET' })
  .inputValidator(zodValidator(ClientIdSchema))
  .handler(async ({ data: clientId }) => {
    const [error, result] = await until(() =>
      service.getMedicalInformation(clientId),
    )

    if (error) {
      // TODO: Log error
      throw new Error(
        'Cannot get client medical information. Please try again later.',
      )
    }

    if (!result) {
      setResponseStatus(400)
      throw new Error(DEFAULT_NOT_FOUND_ERROR)
    }

    return result.medicalInfo
  })

export const getClientBenefits = createServerFn({ method: 'GET' })
  .inputValidator(zodValidator(ClientIdSchema))
  .handler(async ({ data: clientId }) => {
    const [error, result] = await until(() => service.getBenefits(clientId))

    if (error) {
      // TODO: Log error
      throw new Error('Cannot get client benefits. Please try again later.')
    }

    if (!result) {
      setResponseStatus(400)
      throw new Error(DEFAULT_NOT_FOUND_ERROR)
    }

    return result.benefits
  })

export const getClientHeaderInfo = createServerFn({ method: 'GET' })
  .inputValidator(zodValidator(ClientIdSchema))
  .handler(async ({ data: clientId }) => {
    const [error, client] = await until(() => service.getHeaderInfo(clientId))

    if (error) {
      // TODO: Log error
      throw new Error(
        'Cannot get client header information. Please try again later.',
      )
    }

    return client
  })

const OnboardingProgressSchema = z.object({
  clientId: ClientIdSchema,
  step: z.number().optional(),
})

function hasData(data: Record<string, any> | null) {
  if (!data) return false
  return Object.values(data).some((value) => value !== null && value !== '')
}

export const getClientOnboardingProgress = createServerFn({ method: 'GET' })
  .inputValidator(zodValidator(OnboardingProgressSchema))
  .handler(async ({ data: { clientId, step } }) => {
    const [error, client] = await until(() => service.getClient(clientId))

    if (error) {
      // TODO: Log error
      throw new Error(
        'Cannot get client progress information. Please try again later.',
      )
    }

    if (!client) {
      setResponseStatus(400)
      throw new Error(DEFAULT_NOT_FOUND_ERROR)
    }

    const isCompleted = client.status !== 'pending'
    const completedSteps: number[] = []

    if (isCompleted) {
      completedSteps.push(1, 2, 3)
    } else {
      if (hasData(client.personalInfo)) completedSteps.push(1)
      if (hasData(client.medicalInfo)) completedSteps.push(2)
      if (hasData(client.benefits)) completedSteps.push(3)
    }

    // null means all steps are completed
    const nextOnboardingStep =
      [1, 2, 3].find((s) => !completedSteps.includes(s)) ?? null

    let currentViewStep = nextOnboardingStep
    let redirectMessage: string | null = null

    if (step) {
      if (![1, 2, 3].includes(step)) {
        redirectMessage = `Step ${step} does not exist.`
      } else {
        const canViewStep =
          nextOnboardingStep === null || step <= nextOnboardingStep
        if (canViewStep) {
          currentViewStep = step
        } else {
          redirectMessage = `You cannot access step ${step} yet. Please complete the previous steps first.`
        }
      }
    }

    let initialValues: Record<string, any> | null = null

    if (currentViewStep === 1) {
      initialValues = client.personalInfo
    }

    if (currentViewStep === 2) {
      initialValues = client.medicalInfo
    }

    if (currentViewStep === 3) {
      initialValues = client.benefits
    }

    return {
      isCompleted,
      nextOnboardingStep,
      currentViewStep,
      completedSteps,
      initialValues,
      redirectMessage,
    }
  })

const PersonalInfoSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  photo: z.url('Must be a valid URL').optional().nullable(),
  email: z.email('Invalid email address'),
  phone: z.string().min(1, 'Phone is required'),
  birthDate: z.string().min(1, 'Birth date is required'),
  gender: z.enum(['male', 'female']).nullable(),
})

export const createClient = createServerFn({ method: 'POST' })
  .inputValidator(zodValidator(PersonalInfoSchema))
  .handler(async ({ data }) => {
    const [error, result] = await until(() => service.createClient(data))

    if (error) {
      // TODO: Log error
      throw new Error('Cannot create client. Please try again later.')
    }

    return result
  })

const UpdatePersonalInfoSchema = z.object({
  clientId: ClientIdSchema,
  data: PersonalInfoSchema,
})

export const updateClientPersonalInfo = createServerFn({
  method: 'POST',
})
  .inputValidator(zodValidator(UpdatePersonalInfoSchema))
  .handler(async ({ data: { clientId, data } }) => {
    const [error, result] = await until(() =>
      service.updatePersonalInfo({ clientId, data }),
    )

    if (error) {
      // TODO: Log error
      throw new Error(
        'Cannot update personal information. Please try again later.',
      )
    }

    if (!result) {
      setResponseStatus(400)
      throw new Error(DEFAULT_NOT_FOUND_ERROR)
    }

    return result
  })

const MedicalInfoSchema = z.object({
  bloodType: z
    .enum(['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'])
    .optional()
    .nullable(),
  allergies: z.array(z.string()).optional().nullable(),
  chronicConditions: z.array(z.string()).optional().nullable(),
  medications: z.array(z.string()).optional().nullable(),
  lastCheckup: z.string().optional().nullable(),
  emergencyContactName: z.string().min(1, 'Emergency contact name is required'),
  emergencyContactPhone: z
    .string()
    .min(1, 'Emergency contact phone is required'),
  emergencyContactRelationship: z.string().min(1, 'Relationship is required'),
})

const UpdateMedicalInfoSchema = z.object({
  clientId: ClientIdSchema,
  data: MedicalInfoSchema,
})

export const updateClientMedicalInformation = createServerFn({
  method: 'POST',
})
  .inputValidator(zodValidator(UpdateMedicalInfoSchema))
  .handler(async ({ data: { clientId, data } }) => {
    const [error, result] = await until(() =>
      service.updateMedicalInfo({ clientId, data }),
    )

    if (error) {
      // TODO: Log error
      console.error(error)
      throw new Error(
        'Cannot update medical information. Please try again later.',
      )
    }

    return result
  })

const BenefitsSchema = z.object({
  insuranceProvider: z.string().optional().nullable(),
  policyNumber: z.string().optional().nullable(),
  coverageType: z.enum(['Basic', 'Standard', 'Premium']).optional().nullable(),
  deductible: z.number().int().optional().nullable(),
  copay: z.number().int().optional().nullable(),
  annualLimit: z.number().int().optional().nullable(),
  dentalCoverage: z.boolean().optional().nullable(),
  visionCoverage: z.boolean().optional().nullable(),
  mentalHealthCoverage: z.boolean().optional().nullable(),
})

const CompleteOnboardingSchema = z.object({
  clientId: ClientIdSchema,
  benefits: BenefitsSchema,
})

export const completeClientOnboarding = createServerFn({ method: 'POST' })
  .inputValidator(zodValidator(CompleteOnboardingSchema))
  .handler(async ({ data: { clientId, benefits } }) => {
    const [error, result] = await until(() =>
      service.completeOnboarding({ clientId, benefits }),
    )

    if (error) {
      // TODO: Log error
      throw new Error('Cannot complete onboarding. Please try again later.')
    }

    return result
  })
