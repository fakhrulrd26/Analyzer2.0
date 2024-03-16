import { z, ZodError } from 'zod'
import BadRequestError from '../../../utils/errors/BadRequestError'
import zodIssuesMapper from '../../../utils/zodIssuesMapper'

export const CommonDataSchema = z.object({
  content: z.string().min(10),
  isHelping: z.boolean(),
  rate: z.number().int().min(0).max(5)
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
  content: z.string().min(10).optional(),
  isHelping: z.boolean().optional(),
  rate: z.number().int().min(0).max(5).optional()
})

export function validateDataUpdateSchema (data: object): z.infer<typeof DataUpdateSchema> {
  try {
    return DataUpdateSchema.parse(data)
  } catch (e) {
    if (e instanceof ZodError) throw new BadRequestError('Informasi yang dicantumkan untuk membuat Mime harus valid.', zodIssuesMapper(e.issues))
    throw (e)
  }
}
