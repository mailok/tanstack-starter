import * as z from 'zod'

// Extend Zod with custom methods
declare module 'zod' {
  interface ZodType<Output, Input = unknown> {
    /**
     * Transforms null values to undefined.
     * Useful for optional fields that may receive null from forms or APIs.
     * @example z.string().nullish().nullToUndefined()
     */
    nullToUndefined(): z.ZodPipe<this, z.ZodTransform<Exclude<Output, null> | undefined>>
  }
}

z.ZodType.prototype.nullToUndefined = function <T>(this: z.ZodType<T>) {
  return this.transform((val: T) => (val === null ? undefined : val))
}

// Re-export z with extensions applied
export { z }

