import { createServerFn } from '@tanstack/react-start'
import * as z from 'zod'
import { BaseClientSearchSchema } from './-schemas'
import * as service from './-service'
import { tryPromise } from '@/lib/try-promise'
import { setResponseStatus } from '@tanstack/react-start/server'


export const getClientInsights = createServerFn({ method: 'GET' }).handler(() =>
  service.getInsights(),
)

export type GetClientsPageResponse = Awaited<ReturnType<typeof service.findMany>>

const ClientIdSchema = z.uuid("Invalid client ID")


export const getClientsPage = createServerFn({ method: 'GET' })
  .inputValidator(BaseClientSearchSchema)
  .handler(async ({ data }) => service.findMany(data))

export const getClientPersonalInformation = createServerFn({ method: 'GET' })
  .inputValidator(z.unknown())
  .handler(async ({ data }) => {
    const { success, error: zodError, data: clientId } = ClientIdSchema.safeParse(data)

    if (!success) {
      setResponseStatus(400)
      throw new Error(z.prettifyError(zodError));
    }

    const { data: personalInfo, error } = await tryPromise(service.getPersonalInformation(clientId));

    if (error) {
      // TODO: Log error
      throw new Error("Cannot get client personal information. Please try again later.");
    }

    if (!personalInfo) {
      setResponseStatus(400)
     throw new Error("The client you are looking for does not exist or has been removed.");
    }
    
    return personalInfo
  });

export const getClientMedicalInformation = createServerFn({ method: 'GET' })
  .inputValidator(z.unknown())
  .handler(async ({ data }) => {
    const { success, error: zodError, data: clientId } = ClientIdSchema.safeParse(data)

    if (!success) {
      setResponseStatus(400)
      throw new Error(z.prettifyError(zodError));
    }

    const { data: medicalInfo, error } = await tryPromise(service.getMedicalInformation(clientId));

    if (error) {
      // TODO: Log error
      throw new Error("Cannot get client medical information. Please try again later.");
    }

    if (!medicalInfo) {
     throw new Error("The client you are looking for does not exist or has been removed.");
    }
    
    return medicalInfo
  })

export const getClientBenefits = createServerFn({ method: 'GET' })
  .inputValidator(z.unknown())
  .handler(async ({ data }) => {
    const { success, error: zodError, data: clientId } = ClientIdSchema.safeParse(data)

    if (!success) {
      setResponseStatus(400)
      throw new Error(z.prettifyError(zodError));
    }

    const { data: benefits, error } = await tryPromise(service.getBenefits(clientId));

    if (error) {
      // TODO: Log error
      throw new Error("Cannot get client benefits. Please try again later.");
    }

    if (!benefits) {
     throw new Error("The client you are looking for does not exist or has been removed.");
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
