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
