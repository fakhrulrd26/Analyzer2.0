import { z, ZodError } from 'zod'
import BadRequestError from '../../../utils/errors/BadRequestError'
import zodIssuesMapper from '../../../utils/zodIssuesMapper'

export const CommonDataSchema = z.object({
  name: z.string().min(1)
})

export function validateCommonDataSchema (data: object): z.infer<typeof CommonDataSchema> {
  try {
    return CommonDataSchema.parse(data)
  } catch (e) {
    if (e instanceof ZodError) throw new BadRequestError('Informasi yang dicantumkan untuk membuat Mime harus lengkap dan valid.', zodIssuesMapper(e.issues))
    throw (e)
  }
}

export const DataUpdateSchema = z.object({
  name: z.string().min(1).optional()
})

export function validateDataUpdateSchema (data: object): z.infer<typeof DataUpdateSchema> {
  try {
    return DataUpdateSchema.parse(data)
  } catch (e) {
    if (e instanceof ZodError) throw new BadRequestError('Informasi yang dicantumkan untuk membuat Mime harus valid.', zodIssuesMapper(e.issues))
    throw (e)
  }
}
