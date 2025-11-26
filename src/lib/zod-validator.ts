import * as z from "zod"

export const zodValidator = <T>(schema: z.ZodSchema<T>) => {
  return (data: unknown): T => {
    const {
      success,
      error: zodError,
      data: parsedData,
    } = schema.safeParse(data)

    if (!success) {
      throw new Error(z.prettifyError(zodError))
    }

    return parsedData
  }
}
