import { z, ZodError } from 'zod'
import BadRequestError from '../../../utils/errors/BadRequestError'
import zodIssuesMapper from '../../../utils/zodIssuesMapper'

// Validation for user registration:

export const DataRegisterSchema = z.object({
  email: z.string({ required_error: 'Email harus dicantumkan' }).email().min(12),
  name: z.string().min(7),
  username: z.string().min(7),
  password: z.string().min(7),
  country_code: z.string().min(1)
})

export function validateDataRegister (data: object): z.infer<typeof DataRegisterSchema> {
  try {
    return DataRegisterSchema.parse(data)
  } catch (e) {
    if (e instanceof ZodError) throw new BadRequestError('Informasi yang dicantumkan untuk register harus valid dan lengkap', zodIssuesMapper(e.issues))
    throw (e)
  }
}

// Validation for user login:

export const DataLoginSchema = z.object({
  username: z.string().min(7),
  password: z.string().min(7)
})

export function validateDataLogin (data: object): z.infer<typeof DataLoginSchema> {
  try {
    return DataLoginSchema.parse(data)
  } catch (e) {
    if (e instanceof ZodError) throw new BadRequestError('Informasi yang dicantumkan untuk login valid dan lengkap', zodIssuesMapper(e.issues))
    throw (e)
  }
}

export const DataUpdateSchema = z.object({
  name: z.string().min(7).optional(),
  password: z.string().min(7).optional(),
  country_code: z.string().min(1).optional()
})

export function validateDataUpdate (data: object): z.infer<typeof DataUpdateSchema> {
  try {
    return DataUpdateSchema.parse(data)
  } catch (e) {
    if (e instanceof ZodError) throw new BadRequestError('Informasi yang dicantumkan untuk update harus tepat', zodIssuesMapper(e.issues))
    throw (e)
  }
}

export const DataRefreshTokenSchema = z.object({
  refreshToken: z.string()
})

export function validateDataRefreshToken (data: object): z.infer<typeof DataRefreshTokenSchema> {
  try {
    return DataRefreshTokenSchema.parse(data)
  } catch (e) {
    if (e instanceof ZodError) throw new BadRequestError('Informasi yang dicantumkan untuk refresh token tidak lengkap', zodIssuesMapper(e.issues))
    throw (e)
  }
}
