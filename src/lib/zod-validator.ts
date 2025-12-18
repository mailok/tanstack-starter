import { z } from '@/lib/zod-extensions'
import { setResponseStatus } from '@tanstack/react-start/server'

export const zodValidator = <T>(schema: z.ZodSchema<T>) => {
  return (data: unknown): T => {
    const {
      success,
      error: zodError,
      data: parsedData,
    } = schema.safeParse(data)

    if (!success) {
      setResponseStatus(400)
      throw new Error(z.prettifyError(zodError))
    }

    return parsedData
  }
}
