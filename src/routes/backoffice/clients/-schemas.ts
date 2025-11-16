import * as z from 'zod'


export const ClientStatusSchema = z.enum(['active', 'inactive', 'pending'])
export const ClientViewModeSchema = z.enum(['cards', 'table'])

export const BaseClientSearchSchema = z.object({
  page: z.number(),
  name: z.string(),
  status: ClientStatusSchema,
  size: z.number(),
})

export const ClientSearchSchema = z.object({
  page: BaseClientSearchSchema.shape.page.catch(1),
  name: BaseClientSearchSchema.shape.name.default(''),
  status: BaseClientSearchSchema.shape.status.catch('active'),
  viewMode: ClientViewModeSchema.catch('cards'),
})

export type ClientSearch = z.infer<typeof ClientSearchSchema>
export type ClientQuery = z.infer<typeof BaseClientSearchSchema>