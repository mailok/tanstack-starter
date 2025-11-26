import { createServerFn, json } from '@tanstack/react-start'
import * as z from 'zod'
import { BaseClientSearchSchema } from './-schemas'
import * as service from './-service'
import { CLIENT_ERROR_CODES } from './-constants'

export const getClientInsights = createServerFn({ method: 'GET' }).handler(() =>
  service.getInsights(),
)

export type GetClientsPageResponse = Awaited<ReturnType<typeof service.findMany>>

export const getClientsPage = createServerFn({ method: 'GET' })
  .inputValidator(BaseClientSearchSchema)
  .handler(async ({ data }) => service.findMany(data))

export const getClientPersonalInformation = createServerFn({ method: 'GET' })
  .inputValidator(z.uuid())
  .handler(async ({ data: clientId }) => {
    const personalInfo = await service.getPersonalInformation(clientId);

    if (!personalInfo) {
      throw new Error('Cannot personal information: Client not found')
    }
    
    return personalInfo
  });

export const getClientMedicalInformation = createServerFn({ method: 'GET' })
  .inputValidator(z.uuid())
  .handler(async ({ data: clientId }) =>
    service.getMedicalInformation(clientId),
  )

export const getClientBenefits = createServerFn({ method: 'GET' })
  .inputValidator(z.uuid())
  .handler(async ({ data: clientId }) => service.getBenefits(clientId))

export const getClientHeaderInfo = createServerFn({ method: 'GET' })
  .inputValidator(z.uuid())
  .handler(async ({ data: clientId }) => {
    const client = await service.getHeaderInfo(clientId)
    
    if (!client) {
      throw new Error('Cannot get client information: Client not found')
    }
    
    return client
  })



export const checkClientExists = createServerFn({ method: 'GET' })
  .inputValidator(z.unknown())
  .handler(async ({ data }) => {
    const { error, data: clientId } = z.uuid().safeParse(data)

    if (error) {
      throw json({ message: CLIENT_ERROR_CODES.INVALID_CLIENT_ID }, { status: 400 });
    }

    const exists = await service.checkClientExists(clientId)

    if (!exists) {
      // Using 400 because 404 is not working properly in the framework. Issues have been reported.
      throw json({ message: CLIENT_ERROR_CODES.CLIENT_NOT_FOUND }, { status: 400 });
    }

    return exists
  })
