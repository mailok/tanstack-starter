import { createServerFn, json } from '@tanstack/react-start'
import * as z from 'zod'
import { BaseClientSearchSchema } from './-schemas'
import * as service from './-service'
import { tryPromise } from '@/lib/try-promise'

export const ErrorCodes = {
  clientNotFound: 'CLIENT_NOT_FOUND',
  invalidClientId: 'INVALID_CLIENT_ID',
}

export const getClientInsights = createServerFn({ method: 'GET' }).handler(() =>
  service.getInsights(),
)

export type GetClientsPageResponse = Awaited<ReturnType<typeof service.findMany>>


export const getClientsPage = createServerFn({ method: 'GET' })
  .inputValidator(BaseClientSearchSchema)
  .handler(async ({ data }) => service.findMany(data))

export const getClientPersonalInformation = createServerFn({ method: 'GET' })
  .inputValidator(z.unknown())
  .handler(async ({ data }) => {
    const { success, data: clientId } = z.uuid().safeParse(data)

    if (!success) {
      throw json({ errorCode: ErrorCodes.invalidClientId }, { status: 400 });
    }

    const { data: personalInfo, error } = await tryPromise(service.getPersonalInformation(clientId));

    if (error) {
      // TODO: Log error
      throw new Error("Cannot get client personal information. Please try again later.");
    }

    if (!personalInfo) {
     throw json({ message: ErrorCodes.clientNotFound }, { status: 400 });
    }
    
    return personalInfo
  });

export const getClientMedicalInformation = createServerFn({ method: 'GET' })
  .inputValidator(z.unknown())
  .handler(async ({ data }) => {
    const { success, data: clientId } = z.uuid().safeParse(data)

    if (!success) {
      throw json({ errorCode: ErrorCodes.invalidClientId }, { status: 400 });
    }

    const { data: medicalInfo, error } = await tryPromise(service.getMedicalInformation(clientId));

    if (error) {
      // TODO: Log error
      throw new Error("Cannot get client medical information. Please try again later.");
    }

    if (!medicalInfo) {
     throw json({ message: ErrorCodes.clientNotFound }, { status: 400 });
    }
    
    return medicalInfo
  })

export const getClientBenefits = createServerFn({ method: 'GET' })
  .inputValidator(z.unknown())
  .handler(async ({ data }) => {
    const { success, data: clientId } = z.uuid().safeParse(data)

    if (!success) {
      throw json({ errorCode: ErrorCodes.invalidClientId }, { status: 400 });
    }

    const { data: benefits, error } = await tryPromise(service.getBenefits(clientId));

    if (error) {
      // TODO: Log error
      throw new Error("Cannot get client benefits. Please try again later.");
    }

    if (!benefits) {
     throw json({ message: ErrorCodes.clientNotFound }, { status: 400 });
    }
    
    return benefits
  })

export const getClientHeaderInfo = createServerFn({ method: 'GET' })
  .inputValidator(z.uuid())
  .handler(async ({ data: clientId }) => {
    const { data: client, error } = await tryPromise(service.getHeaderInfo(clientId))
    
    if (error) {
      // TODO: Log error
      throw new Error("Cannot get client header information. Please try again later.");
    }
    
    return client
  })
