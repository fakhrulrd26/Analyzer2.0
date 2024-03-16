import { z, ZodError } from 'zod'
import BadRequestError from '../../../utils/errors/BadRequestError'
import zodIssuesMapper from '../../../utils/zodIssuesMapper'

export const CommonDataSchema = z.object({
  offset: z.number().gte(0),
  hex: z.string(),
  extension_id: z.number().gt(0)
})

export function validateCommonDataSchema (data: object): z.infer<typeof CommonDataSchema> {
  try {
    return CommonDataSchema.parse(data)
  } catch (e) {
    if (e instanceof ZodError) throw new BadRequestError('Informasi yang dicantumkan untuk membuat Signature harus lengkap dan valid.', zodIssuesMapper(e.issues))
    throw (e)
  }
}

export const DataUpdateSchema = z.object({
  offset: z.number().gte(0).optional(),
  hex: z.string().optional(),
  extension_id: z.number().gt(0).optional()
})

export function validateDataUpdateSchema (data: object): z.infer<typeof DataUpdateSchema> {
  try {
    return DataUpdateSchema.parse(data)
  } catch (e) {
    if (e instanceof ZodError) throw new BadRequestError('Informasi yang dicantumkan untuk membuat Signature harus valid.', zodIssuesMapper(e.issues))
    throw (e)
  }
}
