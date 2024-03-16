import clients from '../../../utils/clients'
import type { PrismaClient, Signature } from '@prisma/client'

const prisma: PrismaClient = clients.prisma

export interface ReportValidation {
  validity: boolean
  validSignature: Signature | null
  signatures: Signature[]
  message: string
}

export interface ReportScan {
  validity: boolean
  validMime: any
  validExtension: any
}

export function matchBytes (buffer: Buffer, hex: string, offset: number): boolean {
  hex = hex.replace(' ', '')
  const buffer2: Buffer = Buffer.from(hex, 'hex')
  const buffer2Len = hex.length / 2
  return buffer.compare(buffer2, 0, buffer2Len, offset, buffer2Len) === 0
}

export async function validateExtension (file: Express.Multer.File): Promise<ReportValidation> {
  const temp: string[] = file.originalname.split('.')
  const extension: string = temp[temp.length - 1]
  const signatures: Signature[] = await prisma.$queryRaw`
    SELECT S.hex AS hex, S.offset AS offset
    FROM "Signature" AS S
    JOIN "Extension" AS E
    ON S.extension_id = E.id
    WHERE E.name = ${extension} AND length(S.hex)/2 <= ${file.buffer.length}
    ORDER BY length(S.hex) DESC
  `

  if (signatures.length > 0) {
    for (const signature of signatures) {
      if (matchBytes(file.buffer, signature.hex, signature.offset)) {
        return {
          validity: true,
          validSignature: signature,
          signatures,
          message: 'Extension sudah valid'
        }
      }
    }
    return {
      validity: false,
      validSignature: null,
      signatures,
      message: 'Extension tidak valid'
    }
  }
  return {
    validity: false,
    validSignature: null,
    signatures: [],
    message: `Tidak ditemukan signature untuk melakukan pencocokan pada file ber-extension: ${extension}`
  }
}

export async function validateMime (file: Express.Multer.File): Promise<ReportValidation> {
  const signatures: Signature[] = await prisma.$queryRaw`
    SELECT S.hex AS hex, S.offset AS offset
    FROM "Signature" AS S
    JOIN (
      SELECT E.id AS id, E.name AS name, M.name AS mime
      FROM "Extension" AS E
      JOIN "Mime" AS M
      ON E.mime_id = M.id
    ) AS E
    ON S.extension_id = E.id
    WHERE E.mime = ${file.mimetype} AND length(S.hex)/2 <= ${file.buffer.length}
    ORDER BY length(S.hex) DESC
  `
  if (signatures.length > 0) {
    for (const signature of signatures) {
      if (matchBytes(file.buffer, signature.hex, signature.offset)) {
        return {
          validity: true,
          validSignature: signature,
          signatures,
          message: 'Mime sudah valid'
        }
      }
    }
    return {
      validity: false,
      validSignature: null,
      signatures,
      message: 'Mime tidak valid'
    }
  }
  return {
    validity: false,
    validSignature: null,
    signatures: [],
    message: `Tidak ditemukan signature untuk melakukan pencocokan pada file dengan mime: ${file.mimetype}`
  }
}

export async function validateFile (file: Express.Multer.File): Promise<ReportValidation> {
  const temp: string[] = file.originalname.split('.')
  const extension: string = temp[temp.length - 1]
  const signatures: Signature[] = await prisma.$queryRaw`
    SELECT S.hex AS hex, S.offset AS offset
    FROM "Signature" AS S
    JOIN "Extension" AS E
    ON S.extension_id = E.id
    JOIN "Mime" AS M
    ON E.mime_id = M.id
    WHERE E.name = ${extension} AND M.name = ${file.mimetype} AND length(S.hex)/2 <= ${file.buffer.length}
    ORDER BY length(S.hex) DESC
  `
  if (signatures.length > 0) {
    for (const signature of signatures) {
      if (matchBytes(file.buffer, signature.hex, signature.offset)) {
        return {
          validity: true,
          validSignature: signature,
          signatures,
          message: 'Extension dan Mime sudah valid satu sama lain.'
        }
      }
    }
    return {
      validity: false,
      validSignature: null,
      signatures,
      message: 'Extension dan Mime tidak valid satu sama lain.'
    }
  }
  return {
    validity: false,
    validSignature: null,
    signatures: [],
    message: `Tidak ditemukan signature untuk melakukan pencocokan pada file dengan extension: ${extension} mime: ${file.mimetype}.`
  }
}

export async function scanFile (file: Express.Multer.File): Promise<ReportScan> {
  const temp: string[] = file.originalname.split('.')
  const extension: string = temp[temp.length - 1]
  const mime: string = file.mimetype
  const ev: ReportValidation = await validateExtension(file)
  const mv: ReportValidation = await validateMime(file)

  if (mv.validity && ev.validity) {
    return {
      validity: true,
      validMime: mime,
      validExtension: extension
    }
  } else if (mv.validity && !ev.validity) {
    const signatures: any = await prisma.$queryRaw`
      SELECT S.hex AS hex, S.offset AS offset, E.name AS extension
      FROM "Signature" AS S
      JOIN (
        SELECT E.id AS id, E.name AS name, M.name AS mime
        FROM "Extension" AS E
        JOIN "Mime" AS M
        ON E.mime_id = M.id
      ) AS E
      WHERE E.mime = ${mime}
      ORDER BY length(hex) DESC
    `
    for (const signature of signatures) {
      if (matchBytes(file.buffer, signature.hex, signature.offset)) {
        return {
          validity: false,
          validMime: mime,
          validExtension: signature.extension
        }
      }
    }
    return {
      validity: false,
      validMime: mime,
      validExtension: null
    }
  } else if (!mv.validity && ev.validity) {
    const validMime: string = (await prisma.extension.findUniqueOrThrow({
      include: { mime: true },
      where: { name: extension }
    })).mime.name
    return {
      validity: false,
      validMime,
      validExtension: extension
    }
  }
  // tambahkan kode extreme, looping seluruh data untuk cek 1 per 1 signature...
  return {
    validity: false,
    validMime: null,
    validExtension: null
  }
}
