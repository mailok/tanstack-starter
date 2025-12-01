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
    const [error,personalInfo] = await until(() =>service.getPersonalInformation(clientId))

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
    const [error,result] = await until(() =>service.getMedicalInformation(clientId))

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
    const [error,result] = await until(() => service.getBenefits(clientId))

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
    const [error,client] = await until(() =>service.getHeaderInfo(clientId))

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
    const nextOnboardingStep = [1, 2, 3].find((s) => !completedSteps.includes(s)) ?? null

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
